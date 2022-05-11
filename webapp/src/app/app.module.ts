import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxJoystickModule } from 'ngx-joystick';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoggerComponent } from './components/logger/logger.component';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './components/settings/settings.component';
import { AppRoutingModule } from './app-routing.module';
import { RemotecontrolComponent } from './components/remotecontrol/remotecontrol.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoggerComponent,
    SettingsComponent,
    RemotecontrolComponent
  ],
  imports: [
    BrowserModule,
    NgxJoystickModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
