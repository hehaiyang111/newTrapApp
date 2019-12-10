import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransferObject, FileTransfer, FileUploadOptions} from "@ionic-native/file-transfer";
import {Base} from "../../common/base.js";

/**
 * Generated class for the PhotoUploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @Component({
//   selector: 'page-photo-upload',
//   templateUrl: 'photo-upload.html',
// })
export class PhotoUploadPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera,
              private fileTransfer: FileTransfer, private base: Base) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoUploadPage');
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 10,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: 1,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      this.uploadFile(imageData, this.navParams.get('deviceId'))
      this.navCtrl.popToRoot()
    }, (err) => {
      // Handle error
      this.navCtrl.popToRoot()
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
      this.uploadFile(imageData, this.navParams.get('deviceId'))
      this.navCtrl.popToRoot()
    }, (err) => {
      // Handle error
      this.navCtrl.popToRoot()
    }).catch((error)=> {
      console.log(error)
    });
  }

  uploadFile(imageData, deviceId) {
    let options: FileUploadOptions = {};
    options.fileKey = "image";
    var time = Date.parse(Date());
    options.fileName = time + ".jpg";
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.httpMethod = "POST";
    options.params = {deviceId: deviceId};
    options.headers = {token: localStorage['token']};


    //创建文件对象
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload(imageData, this.base.BASE_URL + 'auth_api/device_img', options)
      .then((res) => {
        console.log(res);
        alert('发送成功');
      }, (error) => {//发送失败(网络出错等)
        alert('发送失败');
        console.log(error);
      })
      .catch((error) => {//发送失败(文件不存在等)
        // alert("出错" + error);
        alert('失败');
        console.log(error);
      });
  }

}
