import {ChangeDetectorRef, Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Base} from "../../common/base.js";
import {LocatePage} from "../locate/locate";

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  private deviceId;

  private isLogin = 'false';

//  private username = '';

  private dataList;

  private workingContentDict = ['首次悬挂诱捕器', '换药+收虫', '收虫', '其他'];

  private belongs = true;

  private sum = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private base: Base ,private httpClient: HttpClient,
              private changeDetectorRef:ChangeDetectorRef) {
    /*
    this.isLogin = sessionStorage['isLogin']
    this.deviceId = this.navParams.get('id')
    var that = this
    this.httpClient.get(base.BASE_URL + "scanned",{params:new HttpParams({fromObject: {id: this.deviceId, page: '1', limit: '9999'}})})
      .subscribe(res=> {
        this.dataList = res['data']
        that.changeDetectorRef.detectChanges()
      })

    // 登录后才有token
    if (sessionStorage['isLogin']) {
      this.httpClient.get(base.BASE_URL + "auth_api/test_belongings", {
        headers: {token: localStorage['token']},
        params: new HttpParams({fromObject: {deviceId: this.deviceId}})
      })
        .subscribe(res => {
          if (!res['data']) {
            this.belongs = false;

          } else {
            this.belongs = true;
          }
          that.changeDetectorRef.detectChanges()
        })
    }
    */
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewWillEnter() {
    var that = this
    //this.belongs = false;
    that.changeDetectorRef.detectChanges()
    this.isLogin = sessionStorage['isLogin']
    this.deviceId = this.navParams.get('id')
    this.httpClient.get(this.base.BASE_URL + "scanned",{params:new HttpParams({fromObject: {id: this.deviceId, page: '1', limit: '9999'}})})
      .subscribe(res=> {
        this.dataList = res['data']
        this.sum = 0
        for (let i = 0; i < this.dataList.length; ++i) {
          this.sum += this.dataList[i].num;
        }
     //   this.username = this.dataList[0].username;

        that.changeDetectorRef.detectChanges()
      })

    // 登录后才有token
    if (this.isLogin == 'true') {
      this.httpClient.get(this.base.BASE_URL + "auth_api/test_belongings", {
        headers: {token: localStorage['token']},
        params: new HttpParams({fromObject: {deviceId: this.deviceId}})
      })
        .subscribe(res => {
          if (!res['data']) {
            this.belongs = false;

          } else {
            this.belongs = true;
          }
          that.changeDetectorRef.detectChanges()
        }, ()=> {
          // 联网失败的时候，暂且让录入数据的按钮亮起来
          this.belongs = true;
          that.changeDetectorRef.detectChanges()
        })
    }
  }

  locate() {
    this.navCtrl.push(LocatePage, {id: this.deviceId//,belongs:this.belongs//,username:this.username
    })
  }

}
