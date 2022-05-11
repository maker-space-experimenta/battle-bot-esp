import { Component, OnInit } from '@angular/core';
import { JoystickEvent, NgxJoystickComponent } from 'ngx-joystick';
import { JoystickManagerOptions, JoystickOutputData } from 'nipplejs';
import { ConfigService } from './../../services/config.service';
import { RoboterService } from './../../services/roboter.service';


@Component({
  selector: 'app-remotecontrol',
  templateUrl: './remotecontrol.component.html',
  styleUrls: ['./remotecontrol.component.scss']
})
export class RemotecontrolComponent implements OnInit {
  bgColor = "#024400";
  armed = false;
  displaySettings = true;

  invertMotors = false;

  /**
   *
   */
  constructor(
    private robot: RoboterService,
    private config: ConfigService
  ) { }

  ngOnInit(): void {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let url = "ws://" + urlParams.get("bot") + "/ws";
    console.log("connecting to " + url);

    this.robot.SetUrl(url);
    this.robot.Connect();
  }

  semiOptionsSpeed: any = {
    mode: 'static',
    position: { left: '50%', top: '50%' },
    catchDistance: 50,
    color: 'white'
  };
  semiOptionsSteer: any = {
    mode: 'static',
    position: { left: '50%', top: '50%' },
    catchDistance: 200,
    color: 'white'
  };

  onMoveControlSpeed(event: JoystickEvent) {
    this.robot.SetSpeed(event.data.instance.frontPosition.y);
  }
  onEndControlSpeed(event: JoystickEvent) {
    this.robot.SetSpeed(0);
  }

  onMoveControlSteer(event: JoystickEvent) {
    this.robot.SetSteering(event.data.instance.frontPosition.x);
  }
  onEndControlSteer(event: JoystickEvent) {
    this.robot.SetSteering(0);
  }

  onButtonArmBot() {
    this.robot.ArmBot();
    this.bgColor = "#440500";
    this.armed = true;
  }
  disarmBot() {
    this.robot.DisarmBot();
    this.bgColor = "#024400";
    this.armed = false;
  }




}
