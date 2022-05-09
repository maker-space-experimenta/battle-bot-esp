import { Component, OnInit } from '@angular/core';
import { JoystickEvent, NgxJoystickComponent } from 'ngx-joystick';
import { JoystickManagerOptions, JoystickOutputData } from 'nipplejs';
import { RoboterService } from './services/roboter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'battlebot';

  bgColor = "#024400"

  /**
   *
   */
  constructor(
    private robot: RoboterService
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
  }
  disarmBot() {
    this.robot.DisarmBot();
    this.bgColor = "#024400";
  }


}
