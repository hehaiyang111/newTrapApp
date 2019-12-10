import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Base } from "../../common/base.js";

/**
 * Generated class for the InjectQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-inject-query',
  templateUrl: 'inject-query.html',
})
export class InjectQueryPage {
  dataList:any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient: HttpClient, private base: Base) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InjectQueryPage');
    this.httpClient.post(this.base.BASE_URL + 'app/InjectWorker', {},
      {
        params: {
          id: localStorage["InjectDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })

  }
  ionViewWillEnter(){
    this.httpClient.post(this.base.BASE_URL + 'app/InjectWorker', {},
      {
         params: {
          id: localStorage["InjectDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })
  }

}
