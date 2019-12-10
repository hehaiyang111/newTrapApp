import {Injectable} from "@angular/core";
import {NativeTransitionOptions} from "@ionic-native/native-page-transitions";
import { AlertController } from 'ionic-angular';
import { text } from "@angular/core/src/render3/instructions";
import { File } from "@ionic-native/file";

@Injectable()
export class Base {
  // BASE_URL = "http://39.108.184.47:8081/"
  BASE_URL = "http://106.15.200.245:50000/"
  // BASE_URL = "http://106.15.90.78:50000/"
    //BASE_URL = "http://127.0.0.1:50000/"
  // BASE_URL = "http://192.168.199.199:50000/"
  transitionOptions: NativeTransitionOptions = {
    direction: 'left',
    duration: 200,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 0,
    androiddelay: 0,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
  };
  constructor(private alertCtrl: AlertController,private file:File) {

  }

  showAlert(title, content, func) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: [{text:'确认', handler: func}]
    });
    alert.present();
  }

  readLogger(filename):string{
    this.file.readAsText(this.file.externalDataDirectory,filename).then(function (success){
      console.log(success);
      return success;
    });
    return "";
  }
  
  logger(info:string,storage:string){
    var that = this;
    this.file.checkFile(this.file.externalDataDirectory,storage).then(function (success){
      console.log(success);
      that.file.writeFile(that.file.externalDataDirectory, storage, '[' + info + '],', { append: true }).then(function (success) {
        console.log(success);
        // success
      }, function (error) {
        console.log(error);
        // error
      });
    },function(err){
      console.log(err);
        that.file.writeFile(that.file.externalDataDirectory, storage, '[' + info + '],', { replace: true }).then(function (success) {
          console.log(success);
          // success
        }, function (error) {
          console.log(error);
          // error
        });

    });
  }

  convertToBase64(path,osVal){
    if(osVal == 1){
      this.file.readAsDataURL(this.file.tempDirectory,path).then((imageBase64)=>{
        console.log(imageBase64);
        
        return imageBase64;
      })
    }else{
      this.file.readAsDataURL(this.file.externalDataDirectory, path).then((imageBase64) => {
        console.log(imageBase64);
        return imageBase64;
      })
    }

  }
  
  showPrompt(title, myName,func1, func2) {
    const prompt = this.alertCtrl.create({
      title: title,
      inputs: [
        {
          type:'text',
          name: myName,  
          placeholder: '设备id'        
        }

      ],
      buttons: [
        {
          text: '取消',
          handler: func2
        },
        {
          text: '确认',
          handler: (data)=>{
            func1(data);
          }
        }
      ]
    });
    prompt.present();
  }


  showConfirmAlert(title, content, func1, func2) {
    const confirm = this.alertCtrl.create({
      title: title,
      message: content,
      buttons: [
        {
          text: '取消',
          handler: func2
        },
        {
          text: '确认',
          handler: ()=>{
            func1(confirm);
          }
        }
      ]
    });
    confirm.present();
  }

  static popTo(navCtrl, name) {
    let views = navCtrl.getViews();
    let target = -1;
    for (let i = 0; i < views.length; ++i) {
      if (views[i].name == name) {
        target = i;
        break;
      }
    }
    if (target >= 0) {
      navCtrl.popTo(navCtrl.getByIndex(target)).then(()=>{});
    }

  }
}
