package com.example.myfirstapp;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.myfirstapp.JSONWeatherParser;
import com.example.myfirstapp.R;
import com.example.myfirstapp.Weather;
import com.example.myfirstapp.WeatherHttpClient;

import org.json.JSONException;

public class SearchLocationActivity extends AppCompatActivity {
    private TextView cityText;
    private TextView condDesc;
    private TextView temp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.search_location_activity);

        // Grab the intent that started the activity and its data:
        Intent intent = getIntent();
        String location = intent.getStringExtra(MainActivity.LOCATION);

        cityText = (TextView) findViewById(R.id.cityText);
        condDesc = (TextView) findViewById(R.id.condDescr);
        temp = (TextView) findViewById(R.id.temp);

        // Async call to OpenWeather:
        com.example.myfirstapp.SearchLocationActivity.JSONWeatherTask task = new com.example.myfirstapp.SearchLocationActivity.JSONWeatherTask();
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

            //if ( (weather.iconData != null) && (weather.iconData.length > 0) ) {
            //Bitmap image = BitmapFactory.decodeByteArray(weather.iconData, 0, weather.iconData.length); // data, offset, length
            cityText.setText(weather.location.getCity() + ", " + weather.location.getCountry()); // City, Country
            condDesc.setText(weather.currentCondition.getCondition() + " - " + weather.currentCondition.getDescr()); // Condition description
            temp.setText((Math.round((weather.temperature.getTemp() - 273.15))) + " degrees C");
            //}
        }
    }
}