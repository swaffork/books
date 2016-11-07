package com.example.myfirstapp;

import com.example.myfirstapp.Location;
import com.example.myfirstapp.Weather;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONException;

import static com.example.myfirstapp.R.id.condDescr;

// *** not extends Activity?
public class MainActivity extends AppCompatActivity {
    public final static String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
    private TextView cityText;
    private TextView condDesc;
    private TextView temp;
    private ImageView imgView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String city = "London, UK";

        cityText = (TextView) findViewById(R.id.cityText);
        condDesc = (TextView) findViewById(R.id.condDescr);
        temp = (TextView) findViewById(R.id.temp);
        imgView = (ImageView) findViewById(R.id.condIcon);

        // Async call to OpenWeather:
        JSONWeatherTask task = new JSONWeatherTask();
        task.execute(new String[]{city});
    }

    /*@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }*/

    private class JSONWeatherTask extends AsyncTask<String, Void, Weather> {

        @Override
        protected Weather doInBackground(String... params) {
            Weather weather = new Weather();
            String data = ((new WeatherHttpClient()).getWeatherData(params[0]));

            try {
                weather = JSONWeatherParser.getWeather(data);
                weather.iconData = ((new WeatherHttpClient()).getImage(weather.currentCondition.getIcon()));
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
            return weather;
        }

        @Override
        protected void onPostExecute(Weather weather) {
            super.onPostExecute(weather);

            if ( (weather.iconData != null) && (weather.iconData.length > 0) ) {
                Bitmap image = BitmapFactory.decodeByteArray(weather.iconData, 0, weather.iconData.length); // data, offset, length
                cityText.setText(weather.location.getCity() + "," + weather.location.getCountry()); // City, Country
                condDesc.setText(weather.currentCondition.getCondition() + "-" + weather.currentCondition.getDescr()); // Condition description
                temp.setText("" + Math.round((weather.temperature.getTemp() - 273.15)) + "Celsius");
            }
        }
    }
}
