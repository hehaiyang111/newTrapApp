package com.example.myapplication;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;
import com.example.myapplication.R;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;

public class Detail extends AppCompatActivity {
    private ArrayList<HashMap<String,String>> detailArray;
    private ListView locationArray;
    private DetailAdapter detailAdapter;
    private Button submit;
    private String codeString;
    private String token;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_detail);

        Bundle bundle = this.getIntent().getExtras();
        codeString = bundle.getString("codeString");
        token = bundle.getString("token");
        Log.i("codeInfo:",codeString+",token:"+token);
        ActivityCompat.requestPermissions(this, new String[] {
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION },
                1);

        detailArray = new ArrayList<>();

//        Log.i("arraySize:",String.valueOf(detailArray.size()));
        locationArray = (ListView) findViewById(R.id.locationArray);
        detailAdapter = new DetailAdapter(this,detailArray);
        locationArray.setAdapter(detailAdapter);

//        Log.i("getCount:",String.valueOf(detailAdapter.getCount()));
        getLocation();

        submit = (Button)findViewById(R.id.submit);

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                submitInfo();
            }
        });

    }
    public void submitInfo(){new Thread(runnable).start();}


    public String sendPost(String url, HashMap<String,String> params){
        PrintWriter out = null;
        BufferedReader in =null;
        String result = "";
        StringBuilder tempParams = new StringBuilder();
        int pos = 0;

        try{

            for (String key : params.keySet()) {
                if (pos > 0) {
                    tempParams.append("&");
                }
                tempParams.append(String.format("%s=%s", key,  URLEncoder.encode(params.get(key),"utf-8")));
                pos++;
            }

            URL realUrl = new URL(url);
            HttpURLConnection urlConn = (HttpURLConnection) realUrl.openConnection();

            urlConn.setDoOutput(true);
            //设置请求允许输入 默认是true
            urlConn.setDoInput(true);
            // Post请求不能使用缓存
            urlConn.setUseCaches(false);
            urlConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            urlConn.setRequestProperty("token",token);
            //获取URLConnection对象对应的输出流
            out = new PrintWriter(urlConn.getOutputStream());
            //发送请求参数
            out.print(tempParams);
            //输出流的缓冲
            out.flush();
            if (urlConn.getResponseCode()==200)
                in = new  BufferedReader(new InputStreamReader(urlConn.getInputStream()));
            else
                in = new BufferedReader(new InputStreamReader(urlConn.getErrorStream()));
            String line;
            while ((line = in.readLine())!=null) {
                result+="\n"+line;
            }

        } catch (Exception e) {
            e.printStackTrace();

        }finally {
            try{
                if(out!=null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return result;
    }
    private Handler handler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            Bundle data = msg.getData();
            String val = data.getString("value");
            if (val.equals("err")){
                Toast.makeText(Detail.this,"请求失败！出现了未知错误",Toast.LENGTH_LONG).show();
            }
            if (val.equals("suc")){
                Toast.makeText(Detail.this,"提交成功",Toast.LENGTH_LONG).show();
            }
            else{
                Toast.makeText(Detail.this,val+" (人员超过100m会导致失败)",Toast.LENGTH_LONG).show();
            }

        }
    };


    private Runnable runnable = new Runnable() {
        @Override
        public void run() {
            Message msg = new Message();
            Bundle data = new Bundle();
            String longtitude = detailArray.get(detailArray.size() - 1).get("longtitude");
            String latitude = detailArray.get(detailArray.size() - 1).get("latitude");
            String altitude = detailArray.get(detailArray.size() - 1).get("altitude");
            HashMap<String, String> params = new HashMap<>();
            params.put("longitude", longtitude);
            params.put("latitude", latitude);
            params.put("altitude",altitude);
            params.put("deviceId",codeString);
            params.put("num","0");params.put("maleNum","0");params.put("femaleNum","0");
            params.put("drug","test");params.put("remark","test");
            params.put("workingContent","0");
            params.put("otherNum","0");params.put("otherType","0");

            String res = sendPost("http://39.108.184.47:8081/auth_api/maintenance", params);

            Log.i("res:", res);
            if (res == "") {
                data.putString("value", "suc");
                msg.setData(data);
                handler.sendMessage(msg);

            } else {
                try {
                    JSONObject json = new JSONObject(res);
                    if (json.has("message")) {
                        data.putString("value", json.getString("message"));
                        msg.setData(data);
                        handler.sendMessage(msg);
                    } else {
                        data.putString("value", "err");
                        msg.setData(data);
                        handler.sendMessage(msg);

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }
    };

        public void showLocation(Location currentLocation,boolean isGps,boolean isNetwork){
        if(currentLocation != null){
            HashMap<String,String> info = new HashMap<>();
            info.put("longtitude",String.valueOf(currentLocation.getLongitude()));
            info.put("latitude",String.valueOf(currentLocation.getLatitude()));
            info.put("accuracy",String.valueOf(currentLocation.getAccuracy()));
            info.put("altitude",String.valueOf(currentLocation.getAltitude()));
//            info.put("isNet",String.valueOf(isNetwork));

            info.put("GPSmode", Settings.Secure.getString(getContentResolver(), Settings.Secure.LOCATION_PROVIDERS_ALLOWED));
            detailArray.add(info);
            detailAdapter.notifyDataSetChanged();

            Log.e("detailLength",String.valueOf(detailArray.size()));
            String s = "";
            s += " Current Location: (";
            s += currentLocation.getLongitude();
            s += ",";
            s += currentLocation.getLatitude();
            s += ")\n Speed: ";
            s += currentLocation.getSpeed();
            s += "\n Direction: ";
            s += currentLocation.getBearing();
            s += "\n Accuracy: ";
            s += currentLocation.getAccuracy();
           // Toast.makeText(Detail.this,s,Toast.LENGTH_LONG).show();
        }
        else{
//            HashMap<String,String> info = new HashMap<>();
//            info.put("isGps",String.valueOf(isGps));
////            info.put("isNet",String.valueOf(isNetwork));
//            info.put("isNet", Settings.Secure.getString(getContentResolver(), Settings.Secure.LOCATION_PROVIDERS_ALLOWED));
//            detailArray.add(info);
//            detailAdapter.notifyDataSetChanged();
            Toast.makeText(Detail.this,"获取不到定位信息，请打开GPS,或切换定位模式（不要选择 \"仅用网络定位\"）",Toast.LENGTH_LONG).show();

        }
    }
    @SuppressLint("MissingPermission")
    public void getLocation() {
        final LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);


        final Boolean isGps = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        //通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
        final Boolean isNetwork = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

        System.out.println(isGps);
        System.out.println(isNetwork);
        @SuppressLint("MissingPermission") Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        showLocation(location, isGps, isNetwork);

        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 1, new LocationListener() {
            public void onLocationChanged(Location location) {
                LocationManager locationManager2 = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                Boolean isGps2 = locationManager2.isProviderEnabled(LocationManager.GPS_PROVIDER);
                //通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
                Boolean isNetwork2 = locationManager2.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

                // TODO Auto-generated method stub
                showLocation(location, isGps2, isNetwork2);
            }

            public void onProviderDisabled(String provider) {
                LocationManager locationManager2 = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                Boolean isGps2 = locationManager2.isProviderEnabled(LocationManager.GPS_PROVIDER);
                //通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
                Boolean isNetwork2 = locationManager2.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

                // TODO Auto-generated method stub
                showLocation(null, isGps2, isNetwork2);
            }

            public void onProviderEnabled(String provider) {
                LocationManager locationManager2 = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                Boolean isGps2 = locationManager2.isProviderEnabled(LocationManager.GPS_PROVIDER);
                //通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
                Boolean isNetwork2 = locationManager2.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

                showLocation(locationManager.getLastKnownLocation(provider), isGps2, isNetwork2);
            }

            public void onStatusChanged(String provider, int status, Bundle extras) {
                // TODO Auto-generated method stub
                LocationManager locationManager2 = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                Boolean isGps2 = locationManager2.isProviderEnabled(LocationManager.GPS_PROVIDER);
                //通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
                Boolean isNetwork2 = locationManager2.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

                // TODO Auto-generated method stub
                showLocation(null, isGps2, isNetwork2);


            }
        });
        }
    }





