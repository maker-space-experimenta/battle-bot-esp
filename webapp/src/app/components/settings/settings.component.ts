import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from 'src/app/models/config';
import { ConfigService } from 'src/app/services/config.service';
import { RoboterService } from 'src/app/services/roboter.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {




  config: Config | null = null;

  constructor(
    private robot: RoboterService,
    private configService: ConfigService,
    private router: Router
  ) {
    this.configService.config.subscribe(c => this.config = c);
  }

  ngOnInit(): void {
  }

  saveSettings() {
    if (this.config) {
      this.configService.SaveConfig(this.config);

      this.router.navigate(["remotecontrol"])
    }

  }

  testMotorA() {
    this.robot.ArmBot();
    this.robot.SetMotorA(100);
    this.robot.SetMotorB(1);

    setTimeout(() => {
      this.robot.DisarmBot();
      this.robot.SetMotorA(0);
    }, 2000);
  }


  testMotorB() {
    this.robot.ArmBot();
    this.robot.SetMotorB(100);
    this.robot.SetMotorA(1);

    setTimeout(() => {
      this.robot.DisarmBot();
      this.robot.SetMotorB(0);
    }, 2000);
  }
}
