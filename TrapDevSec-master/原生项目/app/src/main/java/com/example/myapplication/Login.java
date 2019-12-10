package com.example.myapplication;

import android.content.Intent;
import android.os.Handler;

import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

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
import java.util.HashMap;

public class Login extends AppCompatActivity {
    private EditText username;
    private EditText password;
    private Button login;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        username = (EditText) findViewById(R.id.username);
        password = (EditText) findViewById(R.id.password);
        login = (Button) findViewById(R.id.login);

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                pressLogin();
            }
        });
    }
    public void pressLogin(){
        new Thread(runnable).start();
    }

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
    Handler handler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            Bundle data = msg.getData();
            String val = data.getString("value");
          if (val.equals("err")){
              Toast.makeText(Login.this,"登录失败！请确定用户名和密码！",Toast.LENGTH_LONG).show();
          }
          if (val.equals("notnull")){
              Toast.makeText(Login.this,"用户名和密码不能为空！",Toast.LENGTH_LONG).show();
            }

        }
    };


    Runnable runnable = new Runnable(){
        @Override
        public void run() {
            Message msg = new Message();
            Bundle data = new Bundle();
            String usernameText = String.valueOf(username.getText());
            String passwordText = String.valueOf(password.getText());

            if(usernameText.equals("")||passwordText.equals("")){
                data.putString("value","notnull");
                msg.setData(data);
                handler.sendMessage(msg);
                return;
            }
            HashMap<String,String> params = new HashMap<>();
            params.put("username",usernameText);
            params.put("password",passwordText);
            String res = sendPost("http://39.108.184.47:8081/login",params);

            Log.i("res:",res);
            if (res==""){
                data.putString("value","err");
                msg.setData(data);
                handler.sendMessage(msg);

            }else{
                try {
                    JSONObject token = new JSONObject(res);
                    if(token.has("token")){
                        Intent intent = new Intent(Login.this,MainActivity.class);
                        intent.putExtra("res",res);
                        startActivity(intent);
                    }else{
                        data.putString("value","err");
                        msg.setData(data);
                        handler.sendMessage(msg);

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }


        }
    };


    }
