package com.example.myfirstapp;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.TextView;

import org.json.JSONException;

public class DisplayWeatherActivity extends AppCompatActivity {
    private TextView cityText;
    private TextView condDesc;
    private TextView temp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_weather);

        // Grab the intent that started the activity:
        Intent intent = getIntent();
        String location = intent.getStringExtra(MainActivity.LOCATION);

        /* Programmatically create a TextView, set its size & message:
        TextView textView = new TextView(this);
        textView.setTextSize(40);
        textView.setText(location);
        ViewGroup layout = (ViewGroup) findViewById(R.id.activity_display_weather);
        // Add the TextView to the layout:
        layout.addView(textView); */

        // Populate results?
        cityText = (TextView) findViewById(R.id.cityText);
        condDesc = (TextView) findViewById(R.id.condDescr);
        temp = (TextView) findViewById(R.id.temp);
        JSONWeatherTask task = new JSONWeatherTask();
        task.execute(new String[]{location});
    }

    private class JSONWeatherTask extends AsyncTask<String, Void, Weather> {

        @Override
        protected Weather doInBackground(String... params) {
            Weather weather = new Weather();
            String data = ((new WeatherHttpClient()).getWeatherData(params[0]));

            try {
                weather = JSONWeatherParser.getWeather(data);
                //weather.iconData = ((new WeatherHttpClient()).getImage(weather.currentCondition.getIcon()));
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
            return weather;
        }

        @Override
        protected void onPostExecute(Weather weather) {
            super.onPostExecute(weather);

            if (weather == null) {
                cityText.setText("Error!");
            }
            else {
                cityText.setText(weather.location.getCity() + ", " + weather.location.getCountry()); // City, Country
                condDesc.setText(weather.currentCondition.getCondition() + " - " + weather.currentCondition.getDescr()); // Condition description
                temp.setText((Math.round((weather.temperature.getTemp() - 273.15))) + " degrees C");
            }
        }
    }

}
