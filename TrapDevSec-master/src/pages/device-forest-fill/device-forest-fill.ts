import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Base} from "../../common/base.js";
import {PhotoUploadPage} from "../photo-upload/photo-upload";

/**
 * Generated class for the DeviceForestFillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @Component({
//   selector: 'page-device-forest-fill',
//   templateUrl: 'device-forest-fill.html',
// })
export class DeviceForestFillPage {

  // 坡向
  slopDirection = '';
  // 坡位
  slopPosition = '';
  // 林分类型
  forestStructure = '';
  // 平均树高
  avgHeight = '';
  // 平均胸径
  avgDbh = '';
  // 林分密度
  forestStructureDensity = '';
  // 郁密度
  crownDensity = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient,
              private base: Base) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceForestFillPage');
  }

  submit() {
    let device = {};
    device['deviceId'] = this.navParams.get('id');
    device['slopeDirection'] = this.slopDirection;
    device['slopePosition'] = this.slopPosition;
    device['forestStructure'] = this.forestStructure;
    device['avgHeight'] = this.avgHeight;
    device['avgDbh'] = this.avgDbh;
    device['forestStructureDensity'] = this.forestStructureDensity;
    device['crownDensity'] = this.crownDensity;
    this.httpClient.post(this.base.BASE_URL + 'auth_api/device_forest', device,
      {headers:{token:localStorage['token']}}).subscribe(res=>{
      console.log(res)
      this.navCtrl.push(PhotoUploadPage, {deviceId: this.navParams.get('id')});
    }, res => {
      alert('上传失败，缓存记录');
      // 缓存记录到localStorage中
      let deviceForestCache: any;
      deviceForestCache = localStorage.getItem('deviceForestCache');
      if (deviceForestCache == null) {
        deviceForestCache = [];
      } else {
        deviceForestCache = JSON.parse(deviceForestCache);
      }
      deviceForestCache.push(device);
      localStorage.setItem('deviceForestCache', JSON.stringify(deviceForestCache));
      this.navCtrl.push(PhotoUploadPage, {deviceId: this.navParams.get('id')});
    }, () => {

    });
    // this.navCtrl.popToRoot()

  }

  pass() {
    this.navCtrl.push(PhotoUploadPage, {deviceId: this.navParams.get('id')});
  }

}
