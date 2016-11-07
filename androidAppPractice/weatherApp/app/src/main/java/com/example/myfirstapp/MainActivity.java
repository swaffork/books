package com.example.myfirstapp;

import com.example.myfirstapp.Location;
import com.example.myfirstapp.Weather;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class MainActivity extends AppCompatActivity {
    public final static String EXTRA_MESSAGE = "com.example.myfirstapp.MESSAGE";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /* Called when he the user clicks the Send button
    * Note this method MUST be public, have a void return value, and have view
    * as the only parameter. */
    public void sendMessage(View view) {
        /* Intent is object that provides runtime binding between separate
         * components (like two activities). Represents an app's "intent to do
         * something."
         *  this: Context parameter (Activity is subclass of Context)
         *  .class: the class of app component where the system will deliver the Intent*/
        Intent intent = new Intent(this, DisplayMessageActivity.class);
        EditText editText = (EditText) findViewById(R.id.edit_message);
        String message = editText.getText().toString();
        /* adds the EditText's value to the intent; we define the key as
         * EXTRA_MESSAGE to retrieve the text value. */
        intent.putExtra(EXTRA_MESSAGE, message);
        startActivity(intent);
    }
}
