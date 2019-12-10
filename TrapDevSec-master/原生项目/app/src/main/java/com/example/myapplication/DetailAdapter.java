package com.example.myapplication;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import com.example.myapplication.R;

import java.util.ArrayList;
import java.util.HashMap;

public class DetailAdapter extends BaseAdapter {
    private Context mContext;

    private ArrayList<HashMap<String,String>> detailArray=null;

    public DetailAdapter(Context context,ArrayList<HashMap<String,String>> detailArray){
        this.mContext = context;
        this.detailArray = detailArray;
        Log.i("adpter","执行adapter构造函数");
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Log.i("getView","执行getView");
        View item = LayoutInflater.from(mContext).inflate(R.layout.location_list_layout,null);

        TextView longtitude = (TextView) item.findViewById(R.id.longtitude);
        TextView latitude = (TextView)item.findViewById(R.id.latitude);
        TextView accuracy = (TextView)item.findViewById(R.id.accuracy);
        TextView altitude = (TextView)item.findViewById(R.id.altitude);
        TextView GPSmode = (TextView)item.findViewById(R.id.GPSmode);

        longtitude.setText(detailArray.get(position).get("longtitude"));
        latitude.setText(detailArray.get(position).get("latitude"));
        accuracy.setText(detailArray.get(position).get("accuracy"));
        altitude.setText(detailArray.get(position).get("altitude"));
        GPSmode.setText(detailArray.get(position).get("GPSmode"));




        return item;
    }

    @Override
    public int getCount() {
        return detailArray.size();
    }

    @Override
    public Object getItem(int position) {
        return detailArray.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

}
