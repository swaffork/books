package com.example.myfirstapp;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.example.myfirstapp.Location;
import com.example.myfirstapp.Weather;

public class JSONWeatherParser {

    public static Weather getWeather(String data) throws JSONException {
        Weather weather = new Weather();

        // Parse data into JSON object, then extract info
        JSONObject jObject = new JSONObject(data);

        // Location and un-weather-y details:
        Location location = new Location();
        JSONObject coordObject = getObject("coord", jObject);
        location.setLatitude(getFloat("lat", coordObject));
        location.setLongitude(getFloat("lon", coordObject));

        JSONObject sysObject = getObject("sys", jObject);
        location.setCountry(getString("country", sysObject));
        location.setCity(getString("name", jObject));
        location.setSunrise(getInt("sunrise", sysObject));
        location.setSunset(getInt("sunset", sysObject));
        weather.location = location;

        // Get weather info from response array, using only the first value
        JSONArray jArray = jObject.getJSONArray("weather");
        JSONObject JSONWeather = jArray.getJSONObject(0);
        weather.currentCondition.setWeatherId(getInt("id", JSONWeather));
        weather.currentCondition.setDescr(getString("description", JSONWeather));
        weather.currentCondition.setIcon(getString("icon", JSONWeather));

        // Humidity, pressure, temperature:
        JSONObject mainObject = getObject("main", jObject);
        weather.currentCondition.setHumidity(getInt("humidity", mainObject));
        weather.currentCondition.setPressure(getInt("pressure", mainObject));
        weather.temperature.setMaxTemp(getFloat("temp_max", mainObject));
        weather.temperature.setMaxTemp(getFloat("temp_min", mainObject));
        weather.temperature.setTemp(getFloat("temp", mainObject));

        // Wind:
        JSONObject wObj = getObject("wind", jObject);
        weather.wind.setSpeed(getFloat("speed", wObj));
        weather.wind.setDeg(getFloat("deg", wObj));

        // Clouds:
        JSONObject cObj = getObject("clouds", jObject);
        weather.clouds.setPerc(getInt("all", cObj));

        // Download icon?

        return weather;
    }

    /* Helper functions *******************************************/
    private static JSONObject getObject(String tagName, JSONObject jObject) throws JSONException {
        JSONObject subObj = jObject.getJSONObject(tagName);
        return subObj;
    }

    private static String getString(String tagName, JSONObject jObject) throws JSONException {
        return jObject.getString(tagName);
    }

    private static float getFloat(String tagName, JSONObject jObject) throws JSONException {
        return (float) jObject.getDouble(tagName);
    }

    private static int getInt(String tagName, JSONObject jObject) throws JSONException {
        return jObject.getInt(tagName);
    }
}
