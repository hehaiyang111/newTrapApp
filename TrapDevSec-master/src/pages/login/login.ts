import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {HomePage} from "../home/home";
import {TabsPage} from "../tabs/tabs";
import {Base} from "../../common/base.js";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {DetailPage} from "../detail/detail";
import {ScanPage} from "../scan/scan";
import { AppVersion } from '@ionic-native/app-version';
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username = '';
  password = '';
  startApp: any;
  version = 3.1;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient,
              private base: Base, private nativePageTransitions: NativePageTransitions, private iAB: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.httpClient.get(this.base.BASE_URL + "app/version").subscribe((res)=>{
      let latestVersion = parseInt(res.toString(), 10);
      if (this.version < latestVersion) {
        this.base.showConfirmAlert("请更新","请更新", ()=>{
         // this.iAB.create("http://www.fjchenkang.com/app/app-debug.apk",'_system')
          this.iAB.create("http://39.108.184.47/app/app-debug.apk",'_system')
        }, ()=>{})
      }
    })

    if (localStorage['username'] && localStorage['password']) {
      this.username = localStorage['username'];
      this.password = localStorage['password'];
    }

    if (localStorage['token'] && localStorage['username'] && localStorage['password']) {
      this.auto_login();
    }
  }

  auto_login() {
    this.httpClient.post(this.base.BASE_URL + 'login', {},
      {params: new HttpParams({fromObject: {username: localStorage['username'], password: localStorage['password']}})})
      .subscribe(res => {
          console.log(res['token']);
          localStorage['token'] = res['token'];
          sessionStorage['isLogin'] = true
          this.nativePageTransitions.slide(this.base.transitionOptions);
          this.navCtrl.setRoot(TabsPage);
        },
        res => {
          sessionStorage['isLogin'] = true
          this.nativePageTransitions.slide(this.base.transitionOptions);
          this.navCtrl.setRoot(TabsPage);
        })
  }

  login() {
    this.httpClient.post(this.base.BASE_URL + 'login', {},
      {params: new HttpParams({fromObject: {username: this.username, password: this.password}})})
      .subscribe(res => {
          console.log(res['token']);
          localStorage['token'] = res['token'];
          // 直接把用户名密码存了
          localStorage['username'] = this.username;
          localStorage['password'] = this.password;
          this.nativePageTransitions.slide(this.base.transitionOptions);
          this.navCtrl.setRoot(TabsPage);
          sessionStorage['isLogin'] = true
          this.base.showAlert('提示', '数量输入为空或不合法', ()=>{});
        },
        res => {
          this.base.showConfirmAlert('提示', '登录失败', ()=>{

          }, ()=>{});
        })
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
  }

  test() {
    this.navCtrl.push(DetailPage, {id: 1004})
  }

  open_other_app() {
    var sApp = (window as any).startApp.set({
      "application":"com.leduoworks.gpstoolbox"
    }).start();
    // startApp.set({
    //   "intent": "geo:38.899533,-77.036476",
    //   "flags": ["FLAG_ACTIVITY_NEW_TASK"]
    // }).start();
    // var sApp = (window as any).startApp.set({
    //   "package": "io.myapp"
    // });

    // sApp.start();
  }

}
