import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Base} from "../../common/base.js";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {HttpClient, HttpParams} from "@angular/common/http";
import {File} from '@ionic-native/file';

/**
 * Generated class for the MaintenancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-maintenance',
  templateUrl: 'maintenance.html',
})
export class MaintenancePage {

  private id: '';
  private longitude: '';
  private latitude: '';
  private altitude: '';
  private num = '0';
  private femaleNum = '0';
  private maleNum = '0';
  private imageData: null;
  private drug = 'APF-I持久增强型';
  private remark = '';
  private workingContent = '0';
  private otherBeetleList = [];
  private otherNum = '0';
  private otherType = '0';
  private belongs = false;
  //private username = '';
  private have_submit=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              private fileTransfer: FileTransfer, private base: Base, private httpClient: HttpClient,private file:File) {
    this.id = this.navParams.get('id');
    this.longitude = this.navParams.get('longitude');
    this.latitude = this.navParams.get('latitude');
    this.altitude = this.navParams.get('altitude');
    // this.belongs = this.navParams.get('belongs');
    // if(!this.belongs){
    //   this.have_submit=true;
    // }
    //判断经纬度是否为null,是的话提示确定后直接返回重新录入
    if(this.id==''||this.id==null||this.id=='null'||!this.longitude||!this.latitude||!this.altitude|| this.altitude=='null'|| this.latitude=='null'||this.longitude=='null'){
        this.base.showAlert('提示', '经纬度海拔存在为空，请重新定位', ()=>{});
        Base.popTo(this.navCtrl, 'DetailPage');
    }
    // if(this.longitude==null ||this.longitude=='' || this.latitude==null ||this.latitude=='' ||this.altitude==null||this.altitude==''||this.id==null ||this.id==''){
    //       this.base.showAlert('提示', '经纬度海拔存在为空，请重新定位', ()=>{});
    //       Base.popTo(this.navCtrl, 'DetailPage');
    // }
    //this.username = this.navParams.get('username');

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaintenancePage');
    this.loadOtherBeetleList()
  }

  loadOtherBeetleList() {
    this.httpClient.get(this.base.BASE_URL + 'auth_api/other_beetle/town', {
      headers: {token: localStorage['token']}
    }).subscribe(res => {
      this.otherBeetleList = res['data']
      localStorage['otherBeetle'] = JSON.stringify(res['data'])
    }, ()=>{
      this.otherBeetleList = JSON.parse(localStorage['otherBeetle'])
    })
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: 1,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };
    this.camera.getPicture(options).then((imageData) => {
      // this.submit(imageData)
      // this.navCtrl.popToRoot()
      this.imageData = imageData;
    }, (err) => {
      // Handle error
      // this.navCtrl.popToRoot()
    }).catch((error)=> {
      console.log(error)
    });
  }

  choosePhoto() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: 0,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      // this.submit(imageData)
      // this.navCtrl.popToRoot()
      this.imageData = imageData;
    }, (err) => {
      // Handle error
      // this.navCtrl.popToRoot()
    }).catch((error)=> {
      console.log(error)
    });
  }
  numchange(){
    // (ionChange)="numchange()"
    let num1=0;
    if (parseInt(this.num)<0|| parseInt(this.num)==NaN) {
      this.base.showAlert('提示', '数字输入不合法', ()=>{});      
    }
    if (!this.num) {
      this.base.showAlert('提示', '数量输入为空或不合法', ()=>{});
    }
    num1=parseInt(this.num);
    this.num=''+num1;
    if (this.num == 'NaN') {
      this.base.showAlert('提示', '数量输入不合法', ()=>{});     
    }
   
  }
  otherNumchange(){
    //(ionChange)="otherNumchange()"
    let otherNum1=0;
    if (parseInt(this.otherNum)<0||parseInt(this.otherNum)==NaN) {
      this.base.showAlert('提示', '数字输入不合法', ()=>{});
     
    }    
    if (!this.otherNum) {
      this.base.showAlert('提示', '数量输入为空或不合法', ()=>{});
    }
  
    otherNum1=parseInt(this.otherNum);
   
    this.otherNum=''+otherNum1;
    if (this.otherNum=='NaN') {
      this.base.showAlert('提示', '数量输入不合法', ()=>{});
      
    }
   
  }
  submit() {
    this.base.showConfirmAlert('天牛数量：'+this.num+'<br>'+'其他天牛数量：'+this.otherNum,'确认提交' , (confirm)=> {this.submit_function(confirm)}, ()=>{})
  }


  submit_function(confirm) {
    
    // (parseInt(this.femaleNum) + parseInt(this.maleNum) != parseInt(this.num))
    //int项不为负，不为不是数字
    let num1=0;
    let otherNum1=0;
    let num1Str='0';
    let otherNum1Str='0';
    
    if (parseInt(this.maleNum) < 0 ||parseInt(this.maleNum)==NaN || parseInt(this.femaleNum) < 0||parseInt(this.femaleNum)==NaN ||parseInt(this.num)<0|| parseInt(this.num)==NaN||parseInt(this.otherNum)<0||parseInt(this.otherNum)==NaN||parseInt(this.otherType)<0||parseInt(this.otherType)==NaN||parseInt(this.workingContent)<0||parseInt(this.workingContent)==NaN) {
      this.base.showAlert('提示', '数字输入不合法', ()=>{});
      return;
    }
    
    if (!this.maleNum || !this.femaleNum ||!this.num ||!this.otherNum||!this.otherType||!this.workingContent) {
      this.base.showAlert('提示', '数量输入为空或不合法', ()=>{});
      return;
    }
    num1=parseInt(this.num);
    otherNum1=parseInt(this.otherNum);
    num1Str=''+num1;
    otherNum1Str=''+otherNum1;
    if (num1Str == 'NaN' ||otherNum1Str=='NaN') {
      this.base.showAlert('提示', '数量输入不合法', ()=>{});
      return;
    }
    this.num=''+num1;
    this.otherNum=''+otherNum1;
    this.have_submit =true;
    if (this.imageData != null) {
      let options: FileUploadOptions = {};
      options.fileKey = "image";
      var time = Date.parse(Date());
      options.fileName = time + ".jpg";
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;
      options.httpMethod = "POST";
      options.params = {
        deviceId: this.id,
        longitude: this.longitude, latitude: this.latitude, num: this.num,
        maleNum: this.maleNum, femaleNum: this.femaleNum, altitude: this.altitude,
        drug: this.drug, remark: this.remark, workingContent: this.workingContent,
        otherNum: this.otherNum, otherType: this.otherType
      };
      options.headers = {token: localStorage['token']};


      //创建文件对象
      const fileTransfer: FileTransferObject = this.fileTransfer.create();


      this.base.logger(JSON.stringify(options),"Img_maintenance_submit_function_fileTransferPar.txt");

      fileTransfer.upload(this.imageData, this.base.BASE_URL + 'auth_api/maintenance', options)
        .then((res) => {
          console.log(res);
          console.log(JSON.stringify(res));
          console.log(JSON.parse(JSON.stringify(res)).message);

          this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

          this.base.showAlert('提示', '提交成功', ()=>{});
          Base.popTo(this.navCtrl, 'DetailPage');
        }, (error) => {//发送失败(网络出错等)
          this.base.showAlert('提示', '提交失败', ()=>{});
            this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");

          let cacheData = {deviceId: this.id,
            longitude: this.longitude, latitude: this.latitude, num: this.num,
            maleNum: this.maleNum, femaleNum: this.femaleNum, altitude: this.altitude, img: this.imageData,
            drug:this.drug,remark:this.remark,workingContent: this.workingContent, otherNum: this.otherNum, otherType: this.otherType};
          let maintenanceCache: any;
          maintenanceCache = localStorage.getItem('maintenanceCache');
          if (maintenanceCache == null) {
            maintenanceCache = [];
          } else {
            maintenanceCache = JSON.parse(maintenanceCache);
          }
          maintenanceCache.push(cacheData);
          //localStorage安全保存数据
          // try{
          //   localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
          // }catch(oException){
          //     if(oException.name == 'QuotaExceededError'){
          //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
          //         //console.log('已经超出本地存储限定大小！');
          //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
          //       // localStorage.clear();
          //       // localStorage.setItem(key,value);
          //     }
          // } 

          localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
          //this.navCtrl.pop();
          confirm.dismiss()
          Base.popTo(this.navCtrl, 'DetailPage');
        })
        //.catch((error) => {//发送失败(文件不存在等)
          // alert("出错" + error);
          //alert('失败');
          //console.log(error);
        //});
    } else {
      
      var options: string = "deviceId: " + this.id +
        "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
          "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude+
            "drug:" + this.drug + "remark:" + this.remark+ "workingContent:" + this.workingContent+ "otherNum:" + this.otherNum + "otherType:" + this.otherType;


      this.base.logger(options, "NonImg_maintenance_submit_function_fileTransferPar.txt");

      this.httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {},
        {headers: {token: localStorage['token']}, params:{deviceId: this.id,
            longitude: this.longitude, latitude: this.latitude, num: this.num,
            maleNum: this.maleNum, femaleNum: this.femaleNum, altitude: this.altitude,
            drug: this.drug, remark: this.remark, workingContent: this.workingContent, otherNum: this.otherNum, otherType: this.otherType}})
        .subscribe(res => {
          console.log(JSON.stringify(res));
          console.log(JSON.parse(JSON.stringify(res)).message);
          this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
              this.base.showAlert('提示', '提交成功', ()=>{});
              Base.popTo(this.navCtrl, 'DetailPage');
        }, (msg)=>{

            this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");
            
          this.base.showAlert('提示', '提交失败', ()=>{});
          let cacheData = {deviceId: this.id,
            longitude: this.longitude, latitude: this.latitude, num: this.num,
            maleNum: this.maleNum, femaleNum: this.femaleNum, altitude: this.altitude,
            drug:this.drug,remark:this.remark,workingContent: this.workingContent, otherNum: this.otherNum, otherType: this.otherType};
          let maintenanceCache: any;
          maintenanceCache = localStorage.getItem('maintenanceCache');
          if (maintenanceCache == null) {
            maintenanceCache = [];
          } else {
            maintenanceCache = JSON.parse(maintenanceCache);
          }
          maintenanceCache.push(cacheData);
          // try{
          //   localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
          // }catch(oException){
          //     if(oException.name == 'QuotaExceededError'){
          //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
          //         //console.log('已经超出本地存储限定大小！');
          //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
          //       // localStorage.clear();
          //       // localStorage.setItem(key,value);
          //     }
          // }   
          localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
          console.log("Hello");

          //this.navCtrl.pop();
          confirm.dismiss();
          Base.popTo(this.navCtrl, 'DetailPage');
      });

    }
  }


}
