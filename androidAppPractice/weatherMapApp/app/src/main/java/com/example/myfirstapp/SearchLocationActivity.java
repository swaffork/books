package com.example.myfirstapp;

import android.app.Activity;
import android.os.Bundle;
import android.widget.ListView;
import android.widget.ProgressBar;

public class SearchLocationActivity extends Activity {

    private ListView cityListView;
    private ProgressBar progressBar;
    private WeatherHttpClient client;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.search_location_activity);


    }
}
