import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Base } from "../../common/base.js";

/**
 * Generated class for the TrapQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-trap-query',
  templateUrl: 'trap-query.html',
})
export class TrapQueryPage {
  dataList:any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient:HttpClient,
    private base:Base) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrapQueryPage');
    console.log(localStorage["TrapDeviceId"]);

    this.httpClient.post(this.base.BASE_URL + 'app/TrapWorker', {},
      {
        params: {
          scanId: localStorage["TrapDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })

  }
  ionViewWillEnter(){
    this.httpClient.post(this.base.BASE_URL + 'app/TrapWorker', {},
      {
        params: {
          scanId: localStorage["TrapDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })
  }

}
