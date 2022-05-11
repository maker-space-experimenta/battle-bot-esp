import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _config: Config | null = null;
  config: BehaviorSubject<Config | null> = new BehaviorSubject<Config | null>(null);

  constructor() {
    this.LoadConfig();

    if (this._config == null) {
      this.SaveConfig(new Config());
    }
  }

  LoadConfig() {
    let item = localStorage.getItem("config");
    if (item) {
      this._config = JSON.parse(item) as Config;
      this.config.next(this._config);
    }
  }

  SaveConfig(c: Config) {
    this._config = c;
    localStorage.setItem("config", JSON.stringify(this._config));
    this.config.next(this._config);
  }
}
