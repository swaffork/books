package com.example.myfirstapp;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {
    public final static String LOCATION = "com.example.myfirstapp.LOCATION";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /* Called when he the user clicks the Send button
    * Note this method MUST be public, have a void return value, and have view
    * as the only parameter. */
    public void getWeatherByCity(View view) {
        /* Intent is object that provides runtime binding between separate
         * components (like two activities). Represents an app's "intent to do
         * something."
         *  this: Context parameter (Activity is subclass of Context)
         *  .class: the class of app component where the system will deliver the Intent*/
        Intent intent = new Intent(this, DisplayWeatherActivity.class);
        EditText editText = (EditText) findViewById(R.id.edit_location);
        String location = editText.getText().toString();
        /* adds the EditText's value to the intent; we define the key as
         * LOCATION to retrieve the text value. */
        intent.putExtra(LOCATION, location);
        editText.setText("");
        startActivity(intent);
    }

    public void getWeatherByGPS(View view) {
        Intent intent = new Intent(this, GPSDisplayWeatherActivity.class);
        // get the long and lat
        EditText editText = (EditText) findViewById(R.id.edit_location);
        String location = editText.getText().toString();
        intent.putExtra(LOCATION, location);
        editText.setText("");
        startActivity(intent);
    }
}
