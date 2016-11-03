package com.example.getandpost;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.os.AsyncTask;
import android.util.StringBuilderPrinter;

import org.json.JSONObject;
import org.json.JSONArray;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        new SendPostRequest().execute();
    }

    // Send request in the background
    public class SendPostRequest extends ASyncTask<String, Void, String> {
        protected void onPreExecute(){}

        // Define the URL and initialize a JSON object
        protected String doInBackground(String... arg0) {
            try {
                URL url = new URL("http://studytutorial.in/post.php");

                JSONObject postDataParams = new JSONObject();
                postDataParams.put("name", "abc");
                postDataParams.put("email", "abc@gmail.com");
                Log.e("params", postDataParams.toString());

                // Create a URL connection:
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setReadTimeout(15000); // ms
                connection.setConnectTimeout(15000); // ms
                connection.setRequestMethod("POST");
                connection.setDoInput(true);
                connection.setDoOutput(true);

                OutputStream os = connection.getOutputStream();
                BufferedWriter writer = new BufferedWriter(
                        new OutputStreamWriter(os, "UTF-8")); // start writing data over URL connection
                writer.write(getPostDataString(postDataParams)); // format the parameters into URL
                writer.flush();
                writer.close();
                os.close();

                // Read response from API. Check if response code is HTTP_OK!
                int responseCode = connection.getResponseCode();
                if (responseCode == HttpsUrlConnection.HTTP_OK) {
                    // messy way to parse input...
                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(connection.getInputStream()));
                    StringBuffer sb = new StringBuffer("");
                    String line = "";

                    while ( (line = in.readline()) != null) {
                        sb.sppend(line);
                        break;
                    }

                    in.close();
                    return sb.toString();
                }
                else {
                    return new String("Error! Response Code: " + responseCode);
                }
            }
            catch (Exception e) {
                return new String("Exception: " + e.getMessage());
            }
        }

        @Override
        protected void onPostExecute(String result){

        }
    }

    // How we encode a string to be used in a query of a URL
    // Just for tutorial! We actually do want to send the JSON object to our API
    public String getPostDataString(JSONObject params) throws Exception {
        StringBuilder result = new StringBuilder();
        boolean first = true;

        Iterator<String> itr = params.keys();

        while (itr.hasNext()) {
            String key = itr.next();
            Object value = params.get(key);

            // Manually place & to separate parameters in URL...
            if (first)
                first = false;
            else
                result.append("&");

            result.append(URLEncoder.encode(key, "UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(value.toString(), "UTF-8"));
        }
        return result.toString();
    }
}
