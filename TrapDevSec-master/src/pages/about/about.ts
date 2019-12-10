import { Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Geolocation } from "@ionic-native/geolocation";
import { Subscription } from "rxjs/Subscription";
import { AppAvailability } from '@ionic-native/app-availability';
import { TabsPage } from "../tabs/tabs";
import { Base } from "../../common/base.js";
import { CoordinateConvertor } from "../../common/coordinate-convertor";
import { AlertController } from 'ionic-angular';
import { File } from "@ionic-native/file";
import { ChangeDetectorRef } from '@angular/core';
import { Platform } from 'ionic-angular';



// import * as MarkerClusterer from "../../../node_modules/@types/markerclustererplus/index";
declare var BMap;
// declare let appAvailability: any;
declare var device;
declare var BMap_Symbol_SHAPE_POINT;
// declare var BMapLib;
var markers = [];
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  // @ViewChild('map') mapElement: ElementRef;
  @ViewChild('map2') map_container2: ElementRef;
  map: any;//地图对象
  marker: any;//标记
  subscription: Subscription;

  // 是否定位成功
  location_ready = false;

  //username = '';

  // 经度
  longitude = '';

  // 纬度
  latitude = '';

  // 海拔
  altitude = '';

  // 精度
  accuracy = '';


  constructor(public navCtrl: NavController, private httpClient: HttpClient, private base: Base,
    private coordinateConvertor: CoordinateConvertor, 
    @Inject(AlertController) private alerts: AlertController, 
    private file: File, private geolocation: Geolocation, 
    private changeDetectorRef: ChangeDetectorRef,
    private appAvailability:AppAvailability,
    private platform: Platform) {

    // let map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true });//创建地图实例
    //
    // // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
    // let point = new BMap.Point(113.23, 23.16);//坐标可以通过百度地图坐标拾取器获取
    // map.centerAndZoom(point, 17);//设置中心和地图显示级别
    //
    // map.addControl(new BMap.MapTypeControl());
    // // map.setCurrentCity("广州");
    //
    // let sizeMap = new BMap.Size(10, 80);//显示位置
    // map.addControl(new BMap.NavigationControl());
    //
    // map.centerAndZoom('中国', 5);
  }

openBaiduMap() {
  let app;

  if (this.platform.is('ios')) {
    app = 'baidumap://';
  } else if (this.platform.is('android')) {
    app = 'com.baidu.BaiduMap';
  }

  var point = new BMap.Point(116.331398, 39.897445);
  point = this.coordinateConvertor.wgs2bd(Number(this.latitude), Number(this.longitude));
  console.log(point[0]);
  console.log(point[1]);
  
  
  this.appAvailability.check(app).then(
    (yes: boolean) => {
      if (this.platform.is('ios')) {
        window.location.href = 'baidumap://map/direction?origin=中关村&destination=五道口&mode=driving&region=北京&src=ios.baidu.openAPIdemo'
      }else{
        window.location.href = 'bdapp://map/direction?&origin=latlng:116.291226,39.965221|name:世纪城&destination=latlng:39.9761,116.3282|name:钓点位置'
      }
    },
    (no: boolean) => {
      console.log(this.latitude);
      console.log(this.longitude);
      
      var url:string = "http://api.map.baidu.com/marker?location=" + point[0] + "," + point[1] + "&title=我的位置&content=百度奎科大厦&output=html&src=webapp.baidu.openAPIdemo";
      console.log(url);
      window.open(url);
    }
  )
  // appAvailability.check(
  //   'com.baidu.BaiduMap',
  //   function() {  // 已下载
  //     device.platform === 'iOS'?
  //       window.location.href = 'baidumap://map/direction?origin=latlng:116.291226,39.965221|name:世纪城&destination=latlng:39.9761,116.3282|name:钓点位置':
  //       window.location.href = 'bdapp://map/direction?&origin=latlng:116.291226,39.965221|name:世纪城&destination=latlng:39.9761,116.3282|name:钓点位置'
  //   },
  //   function() { // 未下载
  //     // 打开浏览器

  //   }
  // );
}

  locate() {
    let options = {
      enableHighAccuracy: true,
      timeout: 99999999,
      maximumAge: 0
    };
    let that = this
    let watch = this.geolocation.watchPosition(options);
    this.subscription = watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      if (data['coords']) {
        // setTimeout(() => {
        this.latitude = String(data.coords.latitude);
        sessionStorage['latitude'] = String(data.coords.latitude);
        this.longitude = String(data.coords.longitude);
        sessionStorage['longitude'] = String(data.coords.longitude);
        this.altitude = String(data.coords.altitude);
        sessionStorage['altitude'] = String(data.coords.altitude);


        this.accuracy = String(data.coords.accuracy);

        // 不是可以在这里直接判断海拔是不是null吗。。。。
        if (data.coords.altitude == null) {
          this.altitude = '-10000';
          sessionStorage['altitude'] = '-10000';
          //this.base.showAlert('提示','gps信号弱，请等待',()=>{});

        }
        setTimeout(() => {
          //this.location_ready = true;
          this.location_ready = true;
          that.changeDetectorRef.detectChanges()

        }, 5000);



        // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
        // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
        // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
        // document.getElementById('sumbit_button').removeAttribute('disabled')
        that.changeDetectorRef.detectChanges()
        // },5);
        // if(this.altitude==null){
        //   this.location_ready = false;
        //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});        
        // }
      }
      // else{
      //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
      // }
    }, res => {
      // setTimeout(() => {
      //    this.base.showAlert('提示','wu',()=>{});
      this.location_ready = false;
      that.changeDetectorRef.detectChanges()

      // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
      // },5);

      // alert();
    });

  }


  IamHere() {
    let map = this.map;
    
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);

    // setInterval("this.myLocation()",5000);
    // this.myLocation();
    map.centerAndZoom('中国', 5);

    map.addControl(new BMap.MapTypeControl());

    let sizeMap = new BMap.Size(10, 80);//显示位置
    map.addControl(new BMap.NavigationControl());

    map.centerAndZoom(point, 12);
    var i: number = 1;
    var that = this;
    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用

    function addMarker(point, index) {  // 创建图标对象   
      var myIcon = new BMap.Icon("http://106.15.90.78/myLocation.jpeg", new BMap.Size(23, 25), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
      });
      // 创建标注对象并添加到地图   
      var marker = new BMap.Marker(point, { icon: myIcon });
      map.addOverlay(marker);
    }

    point = this.coordinateConvertor.wgs2bd(Number(this.latitude), Number(this.longitude));
    console.log("Point1进来");
    console.log(point);

    var point2 = new BMap.Point(point[1], point[0]);
    // var point2 = new BMap.Point(119.24242762534455, 26.085565172849666);
    console.log("进来的");
    console.log(point2);


    var mk = new BMap.Marker(point2);
    map.addOverlay(mk);
    map.panTo(point2);
    // alert('您的位置：' + r.point.lng + ',' + r.point.lat);



    map.centerAndZoom(point2, 15);  // 编写自定义函数，创建标注   


    addMarker(point2, 0);
    // }
    // this.file.writeFile(this.file.externalDataDirectory, "new_location2.txt", '[' + this.latitude + ',' + this.longitude + ',' + this.altitude + ']', { replace: true }).then(function (success) {
    //   console.log(success);
    //   // success
    // }, function (error) {
    //   console.log(error);
    //   // error
    // });

    // let append = '';
    // setInterval(() => {
    //   this.locate();
    //   // if (this.altitude != '-10000' && !this.altitude && this.altitude!="")

    //   if (this.latitude && this.longitude) {
    //     const alert = this.alerts.create({
    //       title: '数据',
    //       enableBackdropDismiss: false,
    //       buttons: [
    //         {
    //           text: this.latitude + ',' + this.longitude + ',' + this.altitude,
    //           handler: () => {
    //           }
    //         }
    //       ]
    //     });
    //     alert.present();
    //     setTimeout(() => {
    //       var point = this.coordinateConvertor.wgs2bd(Number(this.latitude), Number(this.longitude));
    //       console.log("point1=>");
    //       console.log(point);

    //       console.log(this.latitude);
    //       console.log(this.longitude);
    //       console.log(this.altitude);


    //       var point2 = new BMap.Point(point[1], point[0]);
    //       console.log("point2=>");
    //       console.log(point2);

    //       var mk = new BMap.Marker(point2);
    //       map.addOverlay(mk);
    //       map.panTo(point2);
    //       // alert('您的位置：' + point.lng + ',' + point.lat);




    //       map.centerAndZoom(point2, 15);  // 编写自定义函数，创建标注   


    //       addMarker(point2, i);

    //       append += '[' + this.latitude + ',' + this.longitude + ',' + this.altitude + ']';

    //       that.file.writeFile(that.file.externalDataDirectory, "new_location3.txt", append, { replace: true }).then(function (success) {
    //         console.log(success);
    //         // success
    //       }, function (error) {
    //         console.log(error);
    //         // error
    //       });

    //       i++;
    //     }, 5000)
    //   }
    // }, 30000);
  }

  ionViewDidEnter() {
    var myPoint = [];
    let map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true });//创建地图实例
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);

    // setInterval("this.myLocation()",5000);
    // this.myLocation();
    map.centerAndZoom('中国', 5);

    map.addControl(new BMap.MapTypeControl());

    let sizeMap = new BMap.Size(10, 80);//显示位置
    map.addControl(new BMap.NavigationControl());


    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用

    this.locate();


    this.httpClient.get(this.base.BASE_URL + 'auth_api/user', { headers: { token: localStorage['token'] } })
      .subscribe(data => {
        // console.log(d);
        var center = '';
        if (data['town'] != null)
          center = data['town'] + center;
        if (data['city'] != null)
          center = data['city'] + center;
        if (data['area'] != null)
          center = data['area'] + center;
        if (data['province'] != null)
          center = data['province'] + center;
        if (center)
          map.centerAndZoom(center, 11);
      })
    this.httpClient.get(this.base.BASE_URL + 'auth_api/device_list', {
      headers: { token: localStorage['token'] },
      params: { searchText: "", limit: "2000", page: "1",isMap:"false" }
    }).subscribe(res => {

      for (var i = 0; i < res['data'].length; i++) {
        if (res['data'][i].longitude && res['data'][i].latitude) {
          if (i == 0)
            console.log(res['data'][i].latitude);

          var point = this.coordinateConvertor.wgs2bd(res['data'][i].latitude, res['data'][i].longitude);
          point = new BMap.Point(point[1], point[0]);
          markers.push(point);
          // this.addMarker(point);
        }
      }
      this.addMarker()
    })



    function addMarker(point, index) {  // 创建图标对象   
      var myIcon = new BMap.Icon("http://106.15.90.78/myLocation.jpeg", new BMap.Size(23, 25), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
      });
      // 创建标注对象并添加到地图   
      var marker = new BMap.Marker(point, { icon: myIcon });
      map.addOverlay(marker);
    }

    setTimeout(() => {

    }, 5000)
    // if (this.altitude != '-10000' && !this.altitude && this.altitude != "") {


  }

  addMarker() {
    var options = {

      size: 15,

      shape: 2,

      color: '#d340c3'

    }

    var markerClusterer = new BMap.PointCollection(markers, options);
    // var marker = new BMap.Marker(point);
    this.map.addOverlay(markerClusterer);
  }

}