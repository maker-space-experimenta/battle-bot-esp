import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemotecontrolComponent } from './components/remotecontrol/remotecontrol.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [

  { path: "remotecontrol", component: RemotecontrolComponent},
  { path: "settings", component: SettingsComponent},

  { path: "", redirectTo: "/remotecontrol", pathMatch: "full" }
];

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
  ]
})
export class AppRoutingModule { }
