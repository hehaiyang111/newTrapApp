import { NavController, NavParams } from 'ionic-angular';
import {ChangeDetectorRef, Component} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Base} from "../../common/base.js";


/**
 * Generated class for the DeviceDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'device-data',
  templateUrl: 'device-data.html',
})
export class DeviceDataPage {

  private province = '';
  private city = '';
  private area = '';

  private provinceList :any;
  private cityList :any;
  private areaList :any;

  private dataList: any;

  private role: any;

  private deviceCount: 0;
  private beetleCount: 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private httpClient: HttpClient, private base: Base, private changeDetectorRef:ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceDataPage');
    this.loadProvince()
    this.role = parseInt(localStorage['role'])
  }

  loadProvince() {
    let that = this;
    this.httpClient.get(this.base.BASE_URL + 'auth_api/dist/provinces',
      {headers:{token:localStorage['token']}}).subscribe(
        res => {
          this.provinceList = res;
          this.changeDetectorRef.detectChanges()
        }
    );
    this.city = '';
    this.area = '';
    this.cityList = [];
    this.areaList = [];
  }

  loadCity() {
    let that = this;
    this.httpClient.get(this.base.BASE_URL + 'auth_api/dist/cities',
      {headers:{token:localStorage['token']}, params:new HttpParams({fromObject: {id: this.province}})}).subscribe(
      res => {
        this.cityList = res;
        this.changeDetectorRef.detectChanges()
      }
    )
  }

  loadArea() {
    let that = this;

    this.httpClient.get(this.base.BASE_URL + 'auth_api/dist/areas',
      {headers:{token:localStorage['token']}, params:new HttpParams({fromObject: {id: this.city}})}).subscribe(
      res => {
        this.areaList = res;
        this.changeDetectorRef.detectChanges()
      }
    )
  }

  query() {
    if (this.province == '') {
      this.base.showAlert('提示', '请选择省', () => {})
      return;
    }
    if (this.role == 2) {
      if (this.city == '') {
        this.base.showAlert('提示', '请选择市', () => {})
        return;
      }
    }
    if (this.role == 3) {
      if (this.city == '') {
        this.base.showAlert('提示', '请选择市', () => {})
        return;
      }
      if (this.area == '') {
        this.base.showAlert('提示', '请选择县', () => {})
        return;
      }
    }
    let adcode = ''
    if (this.province != '') {
      adcode = this.province
    }
    if (this.city != '') {
      adcode = this.city
    }
    if (this.area != '') {
      adcode = this.area
    }
    this.httpClient.get(this.base.BASE_URL + 'auth_api/device_summary/detail',
      {headers:{token:localStorage['token']}, params:new HttpParams({fromObject: {adcode: adcode}})}).subscribe(
        res => {
          this.dataList = res['data']
          this.deviceCount = this.dataList.length;
          this.beetleCount = 0;
          for (let i = 0; i < this.deviceCount; ++i) {
            this.beetleCount += this.dataList[i].num
          }
        }
    )
  }

}
