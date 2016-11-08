package com.example.myfirstapp;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

public class GPSDisplayWeatherActivity extends AppCompatActivity {

    private TextView cityText;
    private TextView condDesc;
    private TextView temp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_weather);

        // Grab the intent that started the activity:
        Intent intent = getIntent();
        cityText.setText("TBC");
    }
}
