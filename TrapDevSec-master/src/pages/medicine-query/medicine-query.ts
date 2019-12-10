import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Base } from "../../common/base.js";
/**
 * Generated class for the MedicineQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-medicine-query',
  templateUrl: 'medicine-query.html',
})
export class MedicineQueryPage {
  dataList:any
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private httpClient: HttpClient, private base: Base) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicineQueryPage');
    console.log(localStorage["MedicineDeviceId"]);

    this.httpClient.post(this.base.BASE_URL + 'app/MedicineWorker', {},
      {
         params: {
          scanId: localStorage["MedicineDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;
      })
  }
  ionViewWillEnter(){
    this.httpClient.post(this.base.BASE_URL + 'app/MedicineWorker', {},
      {
        params: {
          scanId: localStorage["MedicineDeviceId"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })
  }









}
