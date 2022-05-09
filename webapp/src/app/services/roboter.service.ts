import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class RoboterService {


  url: string = "";
  websocket: WebSocket | null = null;
  connected = false;
  interval: any;

  speed = 0;
  steer = 0;
  steerFactor = 0.2;
  armed = false;
  weapon = 0;


  constructor(
    private logger: LoggerService
  ) {
    this.logger.Log("test");
    this.interval = setInterval(() => this.sendValues(), 10);

  }

  // constructor(url: string) {
  //     this.gateway = url;
  //     this.

  //     this.log("test")

  //     setInterval(this.sendValues, 10);
  // }


  private sendValues() {
    if (this.connected) {
      var motor_a = this.speed + ((this.steer) * this.steerFactor);
      var motor_b = this.speed + ((this.steer * -1) * this.steerFactor);
      this.websocket?.send("motor:" + motor_a + "," + motor_b);
    }
    else {
      this.logger.Log("not connected");
    }
  }

  private initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    this.websocket = new WebSocket(this.url);
    this.websocket.onopen = e => this.onOpen(e);
    this.websocket.onclose = e => this.onClose(e);
    this.websocket.onerror = e => this.onError(e);
    this.websocket.onmessage = e => this.onMessage(e); // <-- add this line
  }

  private onError(event: any) {
    console.error(event);
    this.logger.Log("error");
  }

  private onOpen(event: any) {
    console.log('Connection opened');
    this.logger.Log('Connection opened');

    this.connected = true;
  }

  private onClose(event: any) {
    console.log('Connection closed');
    this.logger.Log('Connection closed');
    this.connected = false;
    setTimeout(this.initWebSocket, 500);
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
    this.logger.Log('Set Steering: ' + val);
  }

  SetSpeed(val: number) {
    this.speed = val;
  }

  ArmBot() {
    this.websocket?.send("arm:true");
  }
  DisarmBot() {
    this.websocket?.send("disarm:true");
  }
}
