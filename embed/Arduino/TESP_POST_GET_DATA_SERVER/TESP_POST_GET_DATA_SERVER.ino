#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

const char *ssid = "iPhone 12";
//const char *ssid = "@@";
const char *password = "Motdentam";
const char *serverName = "http://192.168.137.1:8000/update-sensor"; // "http://115.76.176.235:8000"

unsigned long lastTime = 0;
unsigned long timerDelay = 2000;
String httpGETRequest(const char *serverName);
String sensorReadings;
double sensorReadingsArr[5];
int humiTest = 321;
int tempTest = 100;
int foo = 10;
int bar = 20;

void GUI_DATA()
{
  HTTPClient http;
  http.begin(serverName);

  //String Data = String("{\"_foo\":\"") + foo + String("\",\"_bar\":\"") + bar + String("\"}");
  String dataPost = String("{\"api_key\":\"sinh\",\"sensor\":\"DHT11\",\"value1\":\"29\",\"Temperature\":") + 27 + (",\"Humi\":") + humiTest + String(" }");
  http.addHeader("Content-Type", "application/json");
  // int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":24.25,\"value2\":\"49.54\",\"value3\": humiTest }");
  int httpResponseCode = http.POST(dataPost); // GUI DATA LEN SERVER  
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  http.end(); 
}

void LAY_DATA()
{
  HTTPClient http;
  http.begin(serverName);
//---------------------------------------------------------------------------------//
  int httpResponseCodeGET = http.GET(); // LAY DATA TU SERVER
  String payload = "{}"; // STORED DATA GET FROM SEVER 
  if (httpResponseCodeGET > 0) //GET DATA
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
// -------------------------------------------------------------------------------------//
  JSONVar myObject = JSON.parse(payload); // JSON TO DISPLAY
  // JSON.typeof(jsonVar) can be used to get the type of the var
  if (JSON.typeof(myObject) == "undefined")
  {
    Serial.println("Parsing input failed!");
    return;
  }

  Serial.print("JSON object = "); // CHUOI JSON CHUA TACH
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
  // 
//  Serial.print("1 = ");
//  Serial.println(sensorReadingsArr[0]);
//  // Serial.println(typeof('sensorReadingsArr[0]'));
//  Serial.print("2 = ");
//  Serial.println(sensorReadingsArr[1]);
//  Serial.print("3 = ");
//  Serial.println(sensorReadingsArr[2]);
//  Serial.print("4 = ");
//  Serial.println(sensorReadingsArr[3]);
//  Serial.print("5 = ");
//  Serial.println(sensorReadingsArr[4]);

  http.end();   
}
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
  if ((millis() - lastTime) > timerDelay)
  {
    if (WiFi.status() == WL_CONNECTED)
    {
      GUI_DATA();
      LAY_DATA();
    }
    else
    {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}
