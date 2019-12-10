import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {Base} from "../../common/base.js";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";

import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the CachePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cache',
  templateUrl: 'cache.html',
})
export class CachePage {

  record = [];
  indexList = [];
  have_submit=false;
 // username='';
  pp = [];
  deviceCache: any;
  alldeviceCache: any;
  deviceBeetleCache: any;
  deviceForestCache: any;

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, private httpClient: HttpClient,
              private base: Base, private fileTransfer: FileTransfer,private file:File) {
                
                // if (localStorage.getItem('maintenanceCache') != null) {
                //       this.alldeviceCache = JSON.parse(localStorage.getItem('maintenanceCache'));
                //       for (let i = 0; i < this.alldeviceCache.length; ++i) {
                            
                //     }
                //   }    
    this.loadList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CachePage');
  }

  postMaintenance(cache, httpClient, base) {
    if (cache.img == undefined) {
      return new Promise((resolve, reject)=> {
        httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {},
          {
            headers: {token: localStorage['token']}, params: {
              deviceId: cache.deviceId,
              longitude: cache.longitude, latitude: cache.latitude, num: cache.num,
              maleNum: cache.maleNum, femaleNum: cache.femaleNum, altitude: cache.altitude,
              drug: cache.drug, remark: cache.remark, workingContent: cache.workingContent,
              otherType: cache.otherType, otherNum: cache.otherNum
            }
          }).toPromise().then(res=>{
            
              resolve('ok')
            //  this.base.showAlert('提示', 'false'+res['data'], ()=>{});
             
            },
            res=> {
              reject('error')
          }
        )
      })
    } else {
      let options: FileUploadOptions = {};
      options.fileKey = "image";
      var time = Date.parse(Date());
      options.fileName = time + ".jpg";
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;
      options.httpMethod = "POST";
      options.params = {
        deviceId: cache.deviceId, longitude: cache.longitude, latitude: cache.latitude, altitude: cache.altitude,num: cache.num,
        maleNum: cache.maleNum, femaleNum: cache.femaleNum, drug: cache.drug, remark: cache.remark,
        workingContent: cache.workingContent,
        otherType: cache.otherType, otherNum: cache.otherNum
      };
      options.headers = {token: localStorage['token']};


      //创建文件对象
      const fileTransfer: FileTransferObject = this.fileTransfer.create();

      return new Promise(function (resolve, reject) {
        fileTransfer.upload(cache.img, 'http://39.108.184.47:8081/auth_api/maintenance', options)
          .then((res) => {
            // console.log(res);
            resolve('ok');
           
             
            
          //   if (!res['data']) {
          //     reject('error')
              
          //   } else {
              
          //     resolve('ok')
          //   }
          }, (error) => {//发送失败(网络出错等)
         //   this.base.showAlert('提示', 'false2', ()=>{});
              resolve('ok');
              return new Promise((resolve, reject) => {
                httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {},
                  {
                    headers: { token: localStorage['token'] }, params: {
                      deviceId: cache.deviceId,
                      longitude: cache.longitude, latitude: cache.latitude, num: cache.num,
                      maleNum: cache.maleNum, femaleNum: cache.femaleNum, altitude: cache.altitude,
                      drug: cache.drug, remark: cache.remark, workingContent: cache.workingContent,
                      otherType: cache.otherType, otherNum: cache.otherNum
                    }
                  }).toPromise().then(res => {
                    console.log("OK");
                    resolve('ok')
                    //  this.base.showAlert('提示', 'false'+res['data'], ()=>{});

                  },
                    res => {
                      console.log("ERROR");
                      reject('error')
                    }
                  )
              })

            // console.log(error);
            // reject('error')

          })
          .catch((error) => {
            return new Promise((resolve, reject) => {
              httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {},
                {
                  headers: { token: localStorage['token'] }, params: {
                    deviceId: cache.deviceId,
                    longitude: cache.longitude, latitude: cache.latitude, num: cache.num,
                    maleNum: cache.maleNum, femaleNum: cache.femaleNum, altitude: cache.altitude,
                    drug: cache.drug, remark: cache.remark, workingContent: cache.workingContent,
                    otherType: cache.otherType, otherNum: cache.otherNum
                  }
                }).toPromise().then(res => {
                  console.log("OK");
                  resolve('ok')
                  //  this.base.showAlert('提示', 'false'+res['data'], ()=>{});

                },
                  res => {
                    console.log("ERROR");
                    reject('error')
                  }
                )
            })
            
            //发送失败(文件不存在等)
            // alert("出错" + error);
            // console.log(error);
         //   this.base.showAlert('提示', 'false3', ()=>{});
            // reject('error')

          });
      })

    }
  }


  postDevice(device, httpClient, base) {
    return new Promise(function (resolve, reject) {
      httpClient.post(base.BASE_URL + 'auth_api/device', device,
        {headers: {token: localStorage['token']}}).subscribe(res => {
          resolve('ok');
      }, res => {
          reject('error');
      }).catch((error) => {

      });
    })

  }

  postDeviceBeetle(deviceBeetle, httpClient, base) {
    return new Promise(function (resolve, reject) {
      httpClient.post(base.BASE_URL + 'auth_api/device_beetle', deviceBeetle,
        {headers: {token: localStorage['token']}}).subscribe(res => {
        resolve('ok');
      }, res => {
        reject('error');
      }).catch((error) => {

      });
    })
  }

  postDeviceForest(deviceForest, httpClient, base) {
    return new Promise(function (resolve, reject) {
      httpClient.post(base.BASE_URL + 'auth_api/device_beetle', deviceForest,
        {headers: {token: localStorage['token']}}).subscribe(res => {
        resolve('ok');
      }, res => {
        reject('error');
      }).catch((error) => {

      });
    })
  }



  async submit() {
    
    let loading = this.loadingCtrl.create({
      content: '正在提交，请耐心等待'
    });
  
    loading.present();
    this.have_submit=true;
    let tmpDeviceList = [];
    this.alldeviceCache=[];
    
    this.base.logger(JSON.stringify(this.deviceCache), "CachePar.txt");

    for(let i = 0; i < this.deviceCache.length; ++i){
      
      await this.postMaintenance(this.deviceCache[i], this.httpClient, this.base).then(res=>{
      //  this.base.showAlert('提示', '成功'+i, ()=>{});
        this.base.logger("i=" + i + "# deviceId=" + this.deviceCache[i].deviceId + "# " + JSON.stringify(res), "CacheRes1.txt");
      }, res=>{
      //  this.base.showAlert('提示', '失败'+i, ()=>{});          
          tmpDeviceList.push(this.deviceCache[i]);  
          this.base.logger("i=" + i + "# deviceId=" + this.deviceCache[i].deviceId + "# " + JSON.stringify(res), "CacheRes2.txt");

      }).catch((error)=>{
        this.base.logger("i=" + i + "# deviceId=" + this.deviceCache[i].deviceId + "# " + JSON.stringify(error), "CacheError.txt");
      });
     
    }    

    for (let i = 0; i < tmpDeviceList.length; ++i) {
      this.indexList.push(tmpDeviceList[i]);
    }
    //this.alldeviceCache = tmpDeviceList;
    
    

    localStorage.setItem('maintenanceCache', JSON.stringify(this.indexList));


    loading.dismiss();
    this.loadList();
  }
  
  async submit1() {
    // 先提交设备信息，以防是新设备
    let indexList = [];
    let tmpDeviceList = [];
    let test = null;
    this.have_submit=true;
    for (let i = 0; i < this.deviceCache.length; ++i) {
      await this.postDevice(this.deviceCache[i], this.httpClient, this.base).then(res=>{
      }, res=>{
        indexList.push(i);
      }).catch((error)=>{

      });
    }
    
    for (let i = 0; i < indexList.length; ++i) {
      tmpDeviceList.push(this.deviceCache[i]);
    }
    this.deviceCache = tmpDeviceList;

    localStorage.setItem('deviceCache', JSON.stringify(this.deviceCache));


    // this.loadList();

    // 提交天牛信息
    indexList = [];
    let tmpDeviceBeetleList = [];
    for (let i = 0; i < this.deviceBeetleCache.length; ++i) {
      await this.postDevice(this.deviceBeetleCache[i], this.httpClient, this.base).then(res=>{
      }, res=>{
        indexList.push(i);
      }).catch((error)=>{

      });
    }
    for (let i = 0; i < indexList.length; ++i) {
      tmpDeviceBeetleList.push(this.deviceBeetleCache[i]);
    }
    this.deviceBeetleCache = tmpDeviceBeetleList;
    localStorage.setItem('deviceBeetleCache', JSON.stringify(this.deviceBeetleCache));


    // this.loadList();

    // 提交森林信息
    indexList = [];
    let tmpDeviceForestList = [];
    for (let i = 0; i < this.deviceForestCache.length; ++i) {
      await this.postDevice(this.deviceForestCache[i], this.httpClient, this.base).then(res=>{
      }, res=>{
        indexList.push(i);
      }).catch((error)=>{

      });
    }
    for (let i = 0; i < indexList.length; ++i) {
      tmpDeviceForestList.push(this.deviceForestCache[i]);
    }
    this.deviceForestCache = tmpDeviceForestList;
    

    localStorage.setItem('deviceForestCache', JSON.stringify(this.deviceForestCache));

    //sd 卡上面
    // this.file.createFile(this.file.applicationStorageDirectory, "new_file.txt", true).then(function (success) {
    //   console.log(success);
    //   // success
    // }, function (error) {
    //   console.log(error);
    //   // error
    // });


    this.loadList();
  }

  clear() {
    localStorage.removeItem('maintenanceCache')
    localStorage.removeItem('deviceCache');
    localStorage.removeItem('alldeviceCache');
    localStorage.removeItem('deviceBeetleCache');
    localStorage.removeItem('deviceForestCache');
    this.record = [];
  }

  loadList() {
    this.record = [];
    this.deviceCache = [];//可以上传的
    this.alldeviceCache=[];//缓存全部的数据
    this.indexList=[];
    this.pp=[];
    //this.username=localStorage['username'];
    if (localStorage.getItem('maintenanceCache') != null) {
      //this.deviceCache = JSON.parse(localStorage.getItem('maintenanceCache'))
      this.alldeviceCache = JSON.parse(localStorage.getItem('maintenanceCache'));
      
      for (let i = 0; i < this.alldeviceCache.length; ++i) {
                            this.pp[i]=0;
                            this.httpClient.get(this.base.BASE_URL + "auth_api/test_belongings", {
                              headers: {token: localStorage['token']},
                              params: {deviceId: this.alldeviceCache[i].deviceId}
                            })
                              .subscribe(res => {
                                if (!res['data']) {
                                  //不属于的继续放缓存
                                  this.indexList.push(this.alldeviceCache[i]);
                                  this.pp[i]=1;     
                                //  this.base.showAlert('不属于', this.alldeviceCache[i].deviceId, ()=>{});
                                }
                              }, ()=> {
                            
                              
                            })
          if(this.pp[i]==0){
            //this.base.showAlert('my', this.alldeviceCache[i].deviceId, ()=>{});
            this.deviceCache.push(this.alldeviceCache[i])
          }
            this.record.push('设备:' + this.alldeviceCache[i]["deviceId"])
          }
          //this.base.showAlert('不属于', this.indexList.length, ()=>{});
          //this.base.showAlert('属于', this.deviceCache.length, ()=>{});
    }

    // if (localStorage['deviceCache']) {
    //   this.deviceCache = JSON.parse(localStorage['deviceCache']);
    //   for (let i = 0; i < this.deviceCache.length; ++i) {
    //     this.record.push('设备:' + this.deviceCache[i]["id"])
    //   }
    // }
    //
    // this.deviceBeetleCache = [];
    // if (localStorage['deviceBeetleCache']) {
    //   this.deviceBeetleCache = JSON.parse(localStorage['deviceBeetleCache']);
    //   for (let i = 0; i < this.deviceBeetleCache.length; ++i) {
    //     this.record.push('设备天牛信息:' + this.deviceBeetleCache[i]["deviceId"])
    //   }
    // }
    //
    // this.deviceForestCache = [];
    // if (localStorage['deviceForestCache']) {
    //   this.deviceForestCache = JSON.parse(localStorage['deviceForestCache']);
    //   for (let i = 0; i < this.deviceForestCache.length; ++i) {
    //     this.record.push('设备森林信息:' + this.deviceForestCache[i]["deviceId"])
    //   }
    // }

  }

}
