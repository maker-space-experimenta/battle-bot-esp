import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxJoystickModule } from 'ngx-joystick';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoggerComponent } from './components/logger/logger.component';

@NgModule({
  declarations: [
    AppComponent,
    LoggerComponent
  ],
  imports: [
    BrowserModule,
    NgxJoystickModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
