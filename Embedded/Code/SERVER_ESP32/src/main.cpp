/*
  Rui Santos
  Complete project details at Complete project details at https://RandomNerdTutorials.com/esp8266-nodemcu-http-get-post-arduino/

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files.

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
*/
// #ifdef ESP8266
// #define typeof(x) typeof(x)
// #endif

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "Arduino_JSON.h"

// #define typeof(x) __typeof__(x)
// #ifdef ESP8266
// #define typeof(x) typeof(x)
// #endif

const char *ssid = "WiFi";
const char *password = "chucmungnammoi";

//Your Domain name with URL path or IP address with path
const char *serverName = "http://192.168.2.224:8000/update-sensor";

// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;
String httpGETRequest(const char *serverName);
String sensorReadings;
double sensorReadingsArr[5];
int humiTest = 123;
int tempTest = 100;
int foo = 10;
int bar = 20;

void setup()
{
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop()
{
  //Send an HTTP POST request every 10 minutes
  if ((millis() - lastTime) > timerDelay)
  {
    //Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED)
    {
      // sensorReadings = httpGETRequest(serverName);
      HTTPClient http;

      // Your Domain name with URL path or IP address with path
      http.begin(serverName);

      // Specify content-type header
      // http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      // // Data to send with HTTP POST
      // String httpRequestData = "api_key=tPmAT5Ab3j7F9&sensor=BME280&value1=24.25&value2=49.54&value3=1005.14";
      // // Send HTTP POST request
      // int httpResponseCode = http.POST(httpRequestData);

      // If you need an HTTP request with a content type: application/json, use the following:
      String Data = String("{\"_foo\":\"") + foo + String("\",\"_bar\":\"") + bar + String("\"}");
      String dataPost = String("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"Temperature\":") + 49.54 + (",\"Humi\":") + humiTest + String(" }");
      http.addHeader("Content-Type", "application/json");
      // int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":24.25,\"value2\":\"49.54\",\"value3\": humiTest }");
      int httpResponseCode = http.POST(dataPost);

      // If you need an HTTP request with a content type: text/plain
      //http.addHeader("Content-Type", "text/plain");
      //int httpResponseCode = http.POST("Hello, World!");
      int httpResponseCodeGET = http.GET();

      String payload = "{}";

      if (httpResponseCodeGET > 0)
      {
        Serial.print("HTTP Response code GET: ");
        Serial.println(httpResponseCodeGET);
        payload = http.getString();
      }
      else
      {
        Serial.print("Error code GET: ");
        Serial.println(httpResponseCodeGET);
      }

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      JSONVar myObject = JSON.parse(payload);

      // JSON.typeof(jsonVar) can be used to get the type of the var
      if (JSON.typeof(myObject) == "undefined")
      {
        Serial.println("Parsing input failed!");
        return;
      }

      Serial.print("JSON object = ");
      Serial.println(myObject);

      // myObject.keys() can be used to get an array of all the keys in the object
      JSONVar keys = myObject.keys();

      for (int i = 0; i < keys.length(); i++)
      {
        JSONVar value = myObject[keys[i]];
        Serial.print(keys[i]);
        Serial.print(" = ");
        Serial.println(value);
        sensorReadingsArr[i] = double(value);
      }
      Serial.print("1 = ");
      Serial.println(sensorReadingsArr[0]);
      // Serial.println(typeof('sensorReadingsArr[0]'));
      Serial.print("2 = ");
      Serial.println(sensorReadingsArr[1]);
      Serial.print("3 = ");
      Serial.println(sensorReadingsArr[2]);
      Serial.print("4 = ");
      Serial.println(sensorReadingsArr[3]);
      Serial.print("5 = ");
      Serial.println(sensorReadingsArr[4]);

      // Free resources
      http.end();
    }
    else
    {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

// String httpGETRequest(const char *serverName)
// {
//   // HTTPClient http;

//   // Your IP address with path or Domain name with URL path
//   // http.begin(serverName);

//   // Send HTTP POST request
//   int httpResponseCode = http.GET();

//   String payload = "{}";

//   if (httpResponseCode > 0)
//   {
//     Serial.print("HTTP Response code GET: ");
//     Serial.println(httpResponseCode);
//     payload = http.getString();
//   }
//   else
//   {
//     Serial.print("Error code GET: ");
//     Serial.println(httpResponseCode);
//   }
//   // Free resources
//   // http.end();

//   return payload;
// }