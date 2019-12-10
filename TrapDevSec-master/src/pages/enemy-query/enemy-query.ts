import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Base } from "../../common/base.js";

/**
 * Generated class for the EnemyQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-enemy-query',
  templateUrl: 'enemy-query.html',
})
export class EnemyQueryPage {
  dataList:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,private httpClient:HttpClient,private base:Base) {
    console.log(localStorage['queryEnemyID']);
    // this.dataList = localStorage["queryEnemyID"];
    //   console.log(this.dataList);

  }

  ionViewDidLoad() {
    console.log(localStorage['queryEnemyID']);
    this.httpClient.post(this.base.BASE_URL + 'app/queryById', {},
      {
        params: {
          scanId: localStorage["queryEnemyID"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })

    console.log('ionViewDidLoad EnemyQueryPage');
    
  }
  ionViewWillEnter(){
    console.log(localStorage['queryEnemyID']);

    console.log(localStorage['queryEnemyID']);
    this.httpClient.post(this.base.BASE_URL + 'app/queryById', {},
      {
        params: {
          scanId: localStorage["queryEnemyID"]
        }
      })
      .subscribe(res => {
        console.log(res);
        this.dataList = res;

      })
  }

}
