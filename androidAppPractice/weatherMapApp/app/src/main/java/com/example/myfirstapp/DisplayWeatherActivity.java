package com.example.myfirstapp;

import android.content.Intent;
import android.support.v4.view.ViewGroupCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.TextView;

public class DisplayWeatherActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_message);

        // Grab the intent that started the activity:
        Intent intent = getIntent();
        // Retrieve data from first activity:
        String location = intent.getStringExtra(MainActivity.LOCATION);
        // Programmatically create a TextView, set its size & message:
        TextView textView = new TextView(this);
        textView.setTextSize(40);
        textView.setText(location);

        ViewGroup layout = (ViewGroup) findViewById(R.id.activity_display_message);
        // Add the TextView to the layout:
        layout.addView(textView);
    }
}
