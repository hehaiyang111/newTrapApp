import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Base } from "../../common/base.js";

/**
 * Generated class for the DeadTreesQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dead-trees-query',
  templateUrl: 'dead-trees-query.html',
})
export class DeadTreesQueryPage {
  dataList:any

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient: HttpClient, private base: Base) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeadTreesQueryPage');
    this.httpClient.post(this.base.BASE_URL + 'app/DeadWorker', {},
      {
        params: {
          scanId: localStorage["DeadMotherDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })

  }
  ionViewWillEnter(){
    this.httpClient.post(this.base.BASE_URL + 'app/DeadWorker', {},
      {
        params: {
          scanId: localStorage["DeadMotherDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })
  }

}
