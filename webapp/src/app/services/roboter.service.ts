import { Injectable } from '@angular/core';
import { Config } from '../models/config';
import { ConfigService } from './config.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class RoboterService {

  config: Config | null = null;

  url: string = "";
  websocket: WebSocket | null = null;
  connected = false;
  interval: any;

  motor_a = 0;
  motor_b = 0;

  speed = 0;
  steer = 0;
  armed = false;
  weapon = 0;


  constructor(
    private logger: LoggerService,
    private configService: ConfigService
  ) {
    console.log("start robot");
    this.configService.config.subscribe(c => {
      this.config = c

      if (this.connected == false) {
        this.Connect();
      }
    });
    this.configService.LoadConfig();
    this.interval = setInterval(() => this.sendValues(), 100);
  }

  private sendValues() {
    if (this.connected && this.config) {
      let ma = (this.motor_a * (this.config.motorAPolarity ? 1 : -1));
      let mb = (this.motor_b * (this.config.motorBPolarity ? 1 : -1));

      let msg = `motor:${ma};${mb}`;

      if (this.config.motorInvert) {
        msg = `motor:${mb};${ma}`;
      }

      console.log(msg);
      this.websocket?.send(msg);
    }
    else {
      this.logger.Log("not connected");
    }
  }

  private initWebSocket() {
    if (this.config) {
      console.log('Trying to open a WebSocket connection...');
      let url = "ws://" + this.config.websocketAddress + "/ws";
      this.websocket = new WebSocket(url);
      this.websocket.onopen = e => this.onOpen(e);
      this.websocket.onclose = e => this.onClose(e);
      this.websocket.onerror = e => this.onError(e);
      this.websocket.onmessage = e => this.onMessage(e); // <-- add this line
    } else {
      console.log("init websocket not possible - missing config");
      this.configService.LoadConfig();

    }
  }

  private onError(event: any) {
    console.error(event);
    this.logger.Log("error");
  }

  private onOpen(event: any) {
    console.log('Connection opened');
    this.logger.Log('Connection opened');

    this.connected = true;

    // crude hack to fix motor problems - dont ask, just ignore
    this.SetMotorA(1);
    this.SetMotorB(1);
  }

  private onClose(event: any) {
    console.log('Connection closed');
    this.logger.Log('Connection closed');
    this.connected = false;
    setTimeout(() => { this.initWebSocket(); }, 500);
  }

  private onMessage(event: any) {
    console.log(event.data);
  }

  Connect() {
    this.initWebSocket();
  }

  SetUrl(url: string) {
    this.url = url;
  }

  SetSteering(val: number) {
    this.steer = val;
    this.CalcMotorValues();
  }

  SetSpeed(val: number) {
    this.speed = val;
    this.CalcMotorValues();
  }

  CalcMotorValues() {
    if (this.config) {
      this.motor_a = (this.speed * this.config.speedFactor) + ((this.steer) * this.config.steerFactor);
      this.motor_b = (this.speed * this.config.speedFactor) + ((this.steer * -1) * this.config.steerFactor);
    }
  }

  ArmBot() {
    this.websocket?.send("arm:true");
    this.armed = true;
  }
  DisarmBot() {
    this.websocket?.send("disarm:true");
    this.armed = false;
  }

  SetMotorA(val: number) {
    this.logger.Log("testing motor a");
    this.motor_a = val;
  }
  SetMotorB(val: number) {
    this.logger.Log("testing motor b");
    this.motor_b = val;
  }
}
