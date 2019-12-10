import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from "rxjs/Subscription";
import { Geolocation } from "@ionic-native/geolocation";
import { ScanPage } from "../scan/scan";
import { NativePageTransitions } from "@ionic-native/native-page-transitions";
import { Base } from "../../common/base.js";
import { DeviceBeetleFillPage } from "../device-beetle-fill/device-beetle-fill";
import { MaintenancePage } from "../maintenance/maintenance";
import { ChangeDetectorRef } from '@angular/core';

/**
 * Generated class for the LocatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-locate',
  templateUrl: 'locate.html',
})
export class LocatePage {

  // 定位订阅
  subscription: Subscription;

  // 是否定位成功
  location_ready = false;

  //username = '';

  // 经度
  longitude = '';

  // 纬度
  latitude = '';

  // 海拔
  altitude = '';

  // 精度
  accuracy = '';

  deviceId = '';

  belongs = false;

  callBack = (params) => {
    return new Promise((resolve, reject) => {
      if (params) {
        this.navCtrl.push(MaintenancePage, {
          id: params.id, longitude: params.longitude,
          latitude: params.latitude, altitude: params.altitude
        });
      } else {

      }
    });
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
    private nativePageTransitions: NativePageTransitions, private base: Base, private changeDetectorRef: ChangeDetectorRef) {
    this.deviceId = this.navParams.get('id');
   // this.username = this.navParams.get('username');
   // this.belongs = this.navParams.get('belongs');
    // this.altitude='-10000';
    // this.latitude='null';
    // this.longitude='null';
     //this.accuracy='40';
    // this.location_ready=true;

    this.locate()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocatePage');
  }

  locate() {
    let options = {
      enableHighAccuracy: true,
      timeout: 99999999,
      maximumAge: 0
    };
    let that = this
    let watch = this.geolocation.watchPosition(options);
    
    this.subscription = watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      if (data['coords']) {
        // setTimeout(() => {
          this.latitude = String(data.coords.latitude);
          sessionStorage['latitude'] = String(data.coords.latitude);
          this.longitude = String(data.coords.longitude);
          sessionStorage['longitude'] = String(data.coords.longitude);
         this.altitude = String(data.coords.altitude);
         sessionStorage['altitude'] = String(data.coords.altitude);


        this.accuracy = String(data.coords.accuracy);
        
            // 不是可以在这里直接判断海拔是不是null吗。。。。
        if(data.coords.altitude==null){
                        this.altitude='-10000';
                        sessionStorage['altitude']='-10000';
                        //this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                        
          }
          setTimeout(() => {
            //this.location_ready = true;
            this.location_ready = true;
            that.changeDetectorRef.detectChanges()
            
          }, 5000);
        


        // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
        // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
        // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
        // document.getElementById('sumbit_button').removeAttribute('disabled')
         that.changeDetectorRef.detectChanges()
        // },5);
        // if(this.altitude==null){
        //   this.location_ready = false;
        //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});        
        // }
      }
      // else{
      //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
      // }
    }, res => {
      // setTimeout(() => {
    //    this.base.showAlert('提示','wu',()=>{});
      this.location_ready = false;
      that.changeDetectorRef.detectChanges()
      
      // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
      // },5);

      // alert();
    });

  }

  scan() {
    // this.nativePageTransitions.slide(this.base.transitionOptions);
    this.navCtrl.push(MaintenancePage, { callBack: this.callBack });
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fillMaintenanceData() {
    
    this.navCtrl.push(MaintenancePage, {
      id: this.deviceId, longitude: this.longitude,
      latitude: this.latitude, altitude: this.altitude//,belongs:this.belongs//, username: this.username
    });
    
  }


}
