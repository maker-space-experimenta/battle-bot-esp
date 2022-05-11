import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss']
})
export class LoggerComponent implements OnInit, OnDestroy {

  logsSub: Subscription | null = null;
  logs: string[] = [];

  constructor(
    private logger: LoggerService
  ) { }

  ngOnDestroy(): void {
    if (this.logsSub != null) {
      this.logsSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.logsSub = this.logger.logs.subscribe(val => this.logs = val.reverse());
  }

}
