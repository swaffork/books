package com.sample.foo.simplewebapi;

import android.os.AsyncTask;
import android.os.Bundle;

class RetrieveFeedTask extends AsyncTask<Void, Void, String> {
	
	private Exception exception;

	// Before expensive async task, show the progress circle:
	protected void onPreExecute() {
		progressBar.setVisibility(View.VISIBLE); 
		responseView.setText(""); // Clear contents of text view!
	}

	// Where we actually call to the API
	protected String doInBackground(Void... urls) {
		String email = emailText.getText().toString();
		// TBC: Validation goes here!

		try {
			/* Set up and open a connection to make an API request:
			URL built from supplied email and our own API key.
			Note that some web APIs support sending the key through an HTTP header to prevent snooping.
			API_URL: "https://api.fullcontact.com/v2/person.json?";
			API_KEY: "f34edbb1dc997da9" */
			URL url = new URL(API_URL + "email=" + email + "&apiKey=" + API_KEY);
			HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

			try {
				// Read the complete response string:
				BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
				StringBuilder stringBuilder = new StringBuilder();
				String line;
				while ( (line = bufferedReader.readLine()) != null ) {
					stringBuilder.append(line).append("\n");
				}
				bufferedReader.close();
				return stringBuilder.toString();
			}
			finally {
				urlConnection.disconnect();
			}
		}
		catch(Exception e) {
			Log.e("ERROR", e.getMessage(), e);
			return null;
		}
	}

	// What we do when call to API is complete
	protected void onPostExecute(String response) {
		if (response == null) {
			response = "ERROR! NO RESPONSE";
		}
		progressBar.setVisibility(View.GONE); // Hide progress bar
		Log.i("INFO", response);
		responseView.setText(response); // Display fetched response in TextView
	}
}


