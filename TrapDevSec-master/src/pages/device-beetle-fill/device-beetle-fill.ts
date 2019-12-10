import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DeviceForestFillPage} from "../device-forest-fill/device-forest-fill";
import {HttpClient} from "@angular/common/http";
import {Base} from "../../common/base.js";
import {File} from "@ionic-native/file";

/**
 * Generated class for the DeviceBeetleFillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @Component({
//   selector: 'page-device-beetle-fill',
//   templateUrl: 'device-beetle-fill.html',
// })
export class DeviceBeetleFillPage {

  // 更换次数
  changeTimes = '';
  // 天牛数量
  beetleNum = '';
  // 半径内死亡松树
  pineDeathNum = '';
  // 样本是否存活
  sampleAlive : any;
  // 是否疫点小班
  epidemicArea : any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient,
    private base: Base, private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceBeetleFillPage');
  }

  submit() {
    console.log("提交");
    
    let deviceBeetle = {};
    deviceBeetle["deviceId"] = this.navParams.get("id");
    deviceBeetle["changeTimes"] = this.changeTimes;
    deviceBeetle["beetleNum"] = this.beetleNum;
    deviceBeetle["sampleAlive"] = this.sampleAlive;
    deviceBeetle["epidemicArea"] = this.epidemicArea;

    this.httpClient.post(this.base.BASE_URL + 'auth_api/device_beetle', deviceBeetle,
      {headers:{token:localStorage['token']}}).subscribe(res=>{
      console.log(res)
    }, res => {
      alert('上传失败，缓存记录');
      // 缓存记录到localStorage中
      let deviceBeetleCache: any;
      deviceBeetleCache = localStorage.getItem('deviceBeetleCache');
      if (deviceBeetleCache == null) {
        deviceBeetleCache = [];
      } else {
        deviceBeetleCache = JSON.parse(deviceBeetleCache);
      }

      deviceBeetleCache.push(deviceBeetle);
      
          this.file.writeFile(this.file.externalDataDirectory, "new_file5.txt", JSON.stringify(deviceBeetleCache), { replace: true }).then(function (success) {
            console.log("newfile5");
            console.log(success);
            // success
          }, function (error) {
            console.log(error);
            // error
          });

      localStorage.setItem('deviceBeetleCache', JSON.stringify(deviceBeetleCache));
      
    }, () => {

    });
    this.navCtrl.push(DeviceForestFillPage, {id: this.navParams.get('id')});
  }



}
