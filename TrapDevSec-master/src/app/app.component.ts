import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {HomePage} from "../pages/home/home";
import {ScanPage} from "../pages/scan/scan";
import {LoginPage} from "../pages/login/login";
import { NewHomePage} from '../pages/newhome/newhome'
import {DeviceForestFillPage} from "../pages/device-forest-fill/device-forest-fill";
import {DeviceBeetleFillPage} from "../pages/device-beetle-fill/device-beetle-fill";
import {LocatePage} from "../pages/locate/locate";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = NewHomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
