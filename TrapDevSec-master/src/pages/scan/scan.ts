import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';
import {DeviceBeetleFillPage} from "../device-beetle-fill/device-beetle-fill";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {Base} from "../../common/base.js";

/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿
  // 回调
  callBack: any;
  scanSub: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private qrScanner: QRScanner,
    private httpClient: HttpClient,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private nativePageTransitions: NativePageTransitions,
    private base: Base) {
    //默认为false
    this.light = false;
    this.frontCamera = false;
    this.callBack = this.navParams.get('callBack');
  }
  ionViewDidLoad() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            // alert(text)
            // alert(text);
            let geshi=true;
            // if(text.length!=15){
            //   geshi=false;
            // }
            // if(geshi){
            //     let shuzi="1234567890";
            //     for(let i=0;i<text.length;i++){
            //         let c=text.charAt(i);
            //         // indexof返回的是数字。。。。。。之前怎么可以的
            //         if(shuzi.indexOf(c) < 0){
            //           geshi=false;
            //         }
            //     }
            // }

            if (geshi) {
              // let id = text.split('id:')[1];
              let id = text;
              let device = {
                "id": id,
                "latitude": sessionStorage['latitude'],
                "longitude": sessionStorage['longitude'],
                "altitude": sessionStorage['altitude']
              };
              this.hideCamera();
              if (this.scanSub) {
                this.scanSub.unsubscribe();
              }
              if (this.qrScanner) {
                this.qrScanner.destroy();
              }
              this.navCtrl.pop().then(() => {
                this.callBack({id: id});
              });
              /**
              this.httpClient.post('http://39.108.184.47:8081/auth_api/device', device,
                                            47.103.66.70
                {headers: {token: localStorage['token']}}).subscribe(res => {
                this.qrScanner.hide(); // hide camera preview
                this.scanSub.unsubscribe(); // stop scanning
                this.qrScanner.destroy();
                this.toast('提交成功');
                // this.navCtrl.pop();
                this.nativePageTransitions.slide(this.base.transitionOptions);
                // this.viewCtrl.dismiss({id: id});
                // this.navCtrl.push(DeviceBeetleFillPage, {id: id});
                // this.navCtrl.pop();

                // pop返回方法
                this.navCtrl.pop().then(() => {
                  this.callBack(id);
                })
              }, res => {
                alert('上传失败，缓存记录');
                // 缓存记录到localStorage中
                let deviceCache: any;
                deviceCache = localStorage.getItem('deviceCache');
                if (deviceCache == null) {
                  deviceCache = [];
                } else {
                  deviceCache = JSON.parse(deviceCache);
                }
                deviceCache.push(device);
                localStorage.setItem('deviceCache', JSON.stringify(deviceCache));
                this.qrScanner.hide(); // hide camera preview
                this.scanSub.unsubscribe(); // stop scanning
                this.qrScanner.destroy();
                // this.toast('提交成功');
                // this.navCtrl.pop();
                this.nativePageTransitions.slide(this.base.transitionOptions);
                // this.viewCtrl.dismiss({id: id});
                // this.navCtrl.push(DeviceBeetleFillPage, {id: id});
                // this.navCtrl.pop();

                // pop返回方法
                this.navCtrl.pop().then(() => {
                  this.callBack(id);
                })
              });
              **/

            } else {
              // 先注释掉这里
               //this.toast('请扫描正确的二维码');
              this.base.showAlert('提示','请扫描正确的二维码',()=>{});
            }
            // this.qrScanner.hide(); // hide camera preview
            // scanSub.unsubscribe(); // stop scanning
            // this.qrScanner.destroy();
            // this.nativePageTransitions.slide(this.base.transitionOptions);
            // this.navCtrl.pop();
          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
  autoScan(){
    let name='deviceid';
    let myid='';
    this.base.showPrompt("可手动输入设备id",name, (data)=>{
     
      myid=data[name];
     // this.base.showAlert('提示',myid,()=>{});
      
      let geshi=true;
            // if(myid.length!=15){
            //   geshi=false;
            // //  this.base.showAlert('提示',myid.length,()=>{});
            // }
            if(geshi){
             // this.base.showAlert('提示','b',()=>{});
                // let shuzi="1234567890";
                // for(let i=0;i<myid.length;i++){
                //     let c=myid.charAt(i);
                //     // indexof返回的是数字。。。。。。之前怎么可以的
                //     if(shuzi.indexOf(c) < 0){
                //       geshi=false;
                //     }
                // }
            }

            if (geshi) {
             // this.base.showAlert('提示','c',()=>{});
              // let id = text.split('id:')[1];
              let id = myid;                       
              if (this.scanSub) {
                this.scanSub.unsubscribe();
              }
              if (this.qrScanner) {
                this.qrScanner.destroy();
              }
              this.navCtrl.pop().then(() => {
               // this.base.showAlert('提示','d',()=>{});
                this.callBack({id: id});
              });
            } else {
             
              this.base.showAlert('提示','二维码格式有误，请重新输入',()=>{});
            }
           // return
         
    }, ()=>{})
  }
  ionViewDidEnter() {
    //页面可见时才执行
    this.showCamera();
    this.isShow = true;//显示背景
  }


  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {

    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
  }

  ionViewWillLeave() {
    this.hideCamera();
    if (this.scanSub) {
      this.scanSub.unsubscribe();
    }
    if (this.qrScanner) {
      this.qrScanner.destroy();
    }
  }

  toast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }
}
