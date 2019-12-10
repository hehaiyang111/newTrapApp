import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import {ScanPage} from "../scan/scan";
import { Geolocation } from "@ionic-native/geolocation";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Subscription} from "rxjs/Subscription";
import {DeviceBeetleFillPage} from "../device-beetle-fill/device-beetle-fill";
import {DeviceForestFillPage} from "../device-forest-fill/device-forest-fill";
import {Base} from "../../common/base.js";
import {LocatePage} from "../locate/locate";
import {CachePage} from "../cache/cache";
import {LoginPage} from "../login/login";
import {App} from "ionic-angular";
import {PhotoUploadPage} from "../photo-upload/photo-upload";
import {Diagnostic} from '@ionic-native/diagnostic';
import {DetailPage} from "../detail/detail";
import {DeviceDataPage} from "../device-data/device-data";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  locate_btn_str = '定位';


  location_ready = false;

  subscription : Subscription;

  // 用户名
  username = '';
  // 真实姓名
  name = '';
  // 地区
  area = '';
  // 用户类型
  type = '';

  role = '0';

  // 是否是管理员
  isAdmin = false;

  isWorker = false;

  constructor(public navCtrl: NavController, private qrScanner: QRScanner, private geolocation: Geolocation,
              private httpClient: HttpClient, private base: Base, private app: App, private diagnostic: Diagnostic) {
    // this.locate();
   // this.base.showConfirmAlert('天牛数量：3'+'<br>'+'其他天牛数量：7','确认提交' , (confirm)=> {}, ()=>{})
    this.isWorker = false;
    this.httpClient.get('http://39.108.184.47:8081/auth_api/user', {headers:{token:localStorage['token']}})
      .subscribe(res=>{
        // 移除本地缓存的登录信息
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('province');
        localStorage.removeItem('city');
        localStorage.removeItem('area');
        localStorage.removeItem('town');
        localStorage.removeItem('town');
        localStorage.removeItem('role');


        this.username = localStorage['username'] = res['username'];
        this.name = localStorage['name'] = res['name'];
        localStorage['province'] = res['province'];
        localStorage['city'] = res['city'];
        localStorage['area'] = res['area'];
        localStorage['town'] = res['town'];
        localStorage['role'] = res['role'];
        this.role = res['role'].toString();
        this.area = '';
        if (localStorage['province'] && localStorage['province'] != 'null') {
          this.area += localStorage['province'];
        }
        if (localStorage['city'] && localStorage['city'] != 'null') {
          this.area += localStorage['city'];
        }
        if (localStorage['area'] && localStorage['area'] != 'null') {
          this.area += localStorage['area'];
        }
        if (localStorage['town'] && localStorage['town'] != 'null') {
          this.area += localStorage['town'];
        }
        switch (localStorage['role']) {
          case '0': this.type = '超级管理员'; break;
          case '1': this.type = '省级用户'; break;
          case '2': this.type = '市级用户'; break;
          case '3': this.type = '县级用户'; break;
          case '4': this.type = '管理员'; break;
          case '5': this.type = '工人'; break;
        }
        if (localStorage['role'] == '5') {
          this.isWorker = true;
        }

      }, () => {
        this.username = localStorage['username'];
        this.name = localStorage['name'];
        this.area = '';
        this.role = localStorage['role'];
        if (localStorage['province'] && localStorage['province'] != 'null') {
          this.area += localStorage['province'];
        }
        if (localStorage['city'] && localStorage['city'] != 'null') {
          this.area += localStorage['city'];
        }
        if (localStorage['area'] && localStorage['area'] != 'null') {
          this.area += localStorage['area'];
        }
        if (localStorage['town'] && localStorage['town'] != 'null') {
          this.area += localStorage['town'];
        }
        switch (localStorage['role']) {
          case '0': this.type = '超级管理员'; break;
          case '1': this.type = '省级用户'; break;
          case '2': this.type = '市级用户'; break;
          case '3': this.type = '县级用户'; break;
          case '4': this.type = '管理员'; break;
          case '5': this.type = '工人'; break;
        }
        if (localStorage['role'] == '5') {
          this.isWorker = true;
        }
      })
    this.diagnostic.getLocationMode().then((status) => {
      if (status == this.diagnostic.locationMode.DEVICE_ONLY) {

      } else {
        this.base.showAlert('提示', '请设置为仅限设备', ()=>{this.diagnostic.switchToLocationSettings();});
      }
    }).catch((e)=>{alert(e)})
  }

  locate() {
    let options = {
      enableHighAccuracy: true,
      timeout: 99999999,
      maximumAge: 0
    };
    let watch = this.geolocation.watchPosition(options);
    this.subscription = watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      if (data['coords']) {
        // alert("纬度:" + data.coords.latitude + "\n经度:" + data.coords.longitude);
        sessionStorage['latitude'] = data.coords.latitude;
        sessionStorage['longitude'] = data.coords.longitude;
        // subscription.unsubscribe();
        this.location_ready = true;
      }
    }, res=>{
      this.location_ready = false;
      // alert();
    });

  }

  callBack =(params) => {
    return new Promise((resolve, reject) => {
      if (params) {
        this.navCtrl.push(DetailPage, {id: params.id});
      } else {

      }
    });
  };

  scan() {
    this.navCtrl.push(ScanPage, {callBack: this.callBack})
    // let options = {
    //   enableHighAccuracy: true,
    //   timeout: 50000,
    //   maximumAge: 0
    // };
    // let watch = this.geolocation.watchPosition(options);
    // let subscription = watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //
    //   alert("纬度:" + data.coords.latitude + "\n经度:" + data.coords.longitude);
    //   this.location_ready = true;
    //   subscription.unsubscribe();
    // });
  }
  location() {
    let options = {
      enableHighAccuracy: true,
      timeout: 0,
      maximumAge: 0
    };
    let watch = this.geolocation.watchPosition(options);
    this.subscription = watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude

      alert("纬度:" + data.coords.latitude + "\n经度:" + data.coords.longitude);
      this.subscription.unsubscribe();
    });

  }
  ionicViewWillEnter() {
    // this.locate();
  }

  ionViewDidEnter() {
    // this.locate();
  }

  ionViewWillLeave() {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }

  }
  submit() {
    let device = {
      "id": 1004,
      "latitude": 26.049941,
      "longitude": 119.138151,
    };
    this.httpClient.post('http://39.108.184.47:8081/auth_api/device', device,
      {headers:{token:localStorage['token']}}).subscribe(res=>{
        console.log(res)
    })
    alert();
  }

  submitBeetle() {
    this.navCtrl.setRoot(DeviceBeetleFillPage);
  }

  submitForest() {
    this.navCtrl.push(DeviceForestFillPage);
  }

  locatePage() {
    this.navCtrl.push(LocatePage);
  }

  cachePage() {
    this.navCtrl.push(CachePage);
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage['isLogin'] = false;
    this.app.getRootNav().setRoot(LoginPage);
  }

  phototest() {
    this.navCtrl.push(PhotoUploadPage);
  }

  deviceDataPage() {
    this.navCtrl.push(DeviceDataPage);
  }

}
