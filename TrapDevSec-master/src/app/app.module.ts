import { NgModule, ErrorHandler,Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QRScanner } from "@ionic-native/qr-scanner";
import { ScanPage } from "../pages/scan/scan";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpClientModule } from '@angular/common/http';
import {LoginPage} from "../pages/login/login";
import {Base} from "../common/base.js";
import {LocatePage} from "../pages/locate/locate";
import {CoordinateConvertor} from "../common/coordinate-convertor";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {CachePage} from "../pages/cache/cache";

import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {Camera} from "@ionic-native/camera";
import {MaintenancePage} from "../pages/maintenance/maintenance";
import {Diagnostic} from "@ionic-native/diagnostic";
import {DetailPage} from "../pages/detail/detail";
import {DeviceDataPage} from "../pages/device-data/device-data";
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';
import { NewHomePage} from '../pages/newhome/newhome'
import { switchProjectPage} from '../pages/newSwitchProject/newSwitchProject';
import { TrapPage} from '../pages/newTrap/newTrap'
import { DryPage} from '../pages/newDry/newDry';
import { DeadtreePage} from '../pages/newDeadTree/newDeadTree';
import { EnemyPage} from '../pages/newEnemy/newEnemy';
import { TrackPage} from '../pages/newTrack/newTrack';
import { TrapQueryPage} from '../pages/trap-query/trap-query';
import { DeadTreesQueryPage} from '../pages/dead-trees-query/dead-trees-query';
import { InjectQueryPage} from '../pages/inject-query/inject-query';
import { EnemyQueryPage} from '../pages/enemy-query/enemy-query';
import { TrackQueryPage} from '../pages/track-query/track-query';
import { Base64 } from '@ionic-native/base64';
import { AppAvailability } from '@ionic-native/app-availability';
import {NewMedicinePage} from '../pages/new-medicine/new-medicine';
import {MedicineQueryPage} from '../pages/medicine-query/medicine-query'


class MyErrorHandler implements ErrorHandler {
  constructor(
    @Inject(AlertController) private alerts: AlertController,
    @Inject(SplashScreen) public splashScreen: SplashScreen,
    private base: Base
  ) { }

  handleError(err: any): void {
    // do something with the error
    console.log(err);
    // this.base.logger(JSON.stringify(err),"error.txt");
  }
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    TrapQueryPage,
    DeadTreesQueryPage,
    InjectQueryPage,
    EnemyQueryPage,
    TrackQueryPage,
    NewMedicinePage,
    MedicineQueryPage,

    ScanPage,
    NewHomePage,
    DryPage,
    DeadtreePage,
    EnemyPage,
    TrackPage,

    LoginPage,
    TrapPage,
    switchProjectPage,
    // DeviceBeetleFillPage,
    // DeviceForestFillPage,
    LocatePage,
    CachePage,
    // PhotoUploadPage,
    MaintenancePage,
    DetailPage,
    DeviceDataPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      iconMode:'ios',
      mode:'ios',
      backButtonText: '返回'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ScanPage,
    NewHomePage,
    DryPage,
    TrapQueryPage,
    DeadTreesQueryPage,
    InjectQueryPage,
    EnemyQueryPage,
    TrackQueryPage,
    NewMedicinePage,
    MedicineQueryPage,
    
    DeadtreePage,
    EnemyPage,
    TrackPage,
    switchProjectPage,
    TrapPage,
    LoginPage,
    // DeviceBeetleFillPage,
    // DeviceForestFillPage,
    LocatePage,
    CachePage,
    // PhotoUploadPage,
    MaintenancePage,
    DetailPage,
    DeviceDataPage
  ],
  providers: [
    InAppBrowser,
    AppVersion,
    StatusBar,
    SplashScreen,
    QRScanner,
    Geolocation,
    Base,
    CoordinateConvertor,
    NativePageTransitions,
    AppAvailability,
    Diagnostic,
    Base64,
    Camera,
    File,
    FileTransfer,
    { provide: ErrorHandler, useClass: MyErrorHandler}
  ]
})
export class AppModule {}
