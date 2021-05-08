#include <Nextion.h>
#include <Adafruit_Fingerprint.h>
#include <HardwareSerial.h>
#include <SPI.h>
#include <MFRC522.h>
#include <RTClib.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

#define RST_PIN        26 
#define SS_PIN         5 
MFRC522 mfrc522(SS_PIN, RST_PIN);
RTC_DS1307 rtc;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial2);

NexText text_state_p2 = NexText(2, 1, "t0"); 

NexText text_state = NexText(2, 4, "t1");
NexButton button_fing_p2 = NexButton(2, 2, "b0");
NexButton button_rfid_p2 = NexButton(2, 3, "b1");

//NEXTION CONTROL ADD USER PAGE
NexText text_fing = NexText(4, 4, "t2"); 
NexText text_rfid = NexText(4, 7, "t4"); 
NexText text_name = NexText(4, 16, "t10"); 
NexText text_positon = NexText(4, 17, "t11"); 
NexText text_gmail = NexText(4, 18, "t12"); 
NexText text_pass = NexText(4, 9, "t13"); 

NexText text_dis_p5 = NexText(5, 2, "t0"); 
NexText text_dis_p6 = NexText(6, 2, "t0"); 
NexText text_dis_p7 = NexText(7, 2, "t0"); 
NexText text_dis_p8 = NexText(8, 2, "t0"); 

NexTouch button_fing_p4 = NexButton(4, 15, "m0");
NexTouch button_rfid_p4 = NexButton(4, 16, "m1");
NexButton button_name_p5 = NexButton(5, 34, "b28");
NexButton button_pos_p6 = NexButton(6, 34, "b28");
NexButton button_gmail_p7 = NexButton(7, 34, "b28");
NexButton button_pass_p8 = NexButton(8, 34, "b28");
NexButton button_done_p4 = NexButton(4, 14, "b6");

NexPage page2 = NexPage(2,0,"page_user");
NexPage page4 = NexPage(4,0,"add_user");

//KHAI BAO BIEN SU DUNG
int ID, ID_CARD;
char ID_S[10], ID_CARD_S[20], TIME[20];
long previousMillis = 0;
char textname_p4c[20], textpos_p4c[20],textgmail_p4c[20], textpass_p4c[20];

//KHAI BAO WIFI
const char *ssid = "@@";
const char *password = "Motdentam";
const char *serverName = "http://192.168.137.1:8000/update-sensor"; 

unsigned long lastTime = 0;
unsigned long timerDelay = 5000;
int humiTest = 321;
int tempTest = 100;
double sensorReadingsArr[5];
String httpGETRequest(const char *serverName);

//KHAI BAO DOI TUONG CHAM
NexTouch *nex_listen_list[] = 
{
  &button_fing_p2,
  &button_rfid_p2,
  &button_fing_p4,
  &button_rfid_p4,
  &button_name_p5,
  &button_pos_p6,
  &button_gmail_p7,
  &button_pass_p8,
  &button_done_p4,
  NULL
};

void bfingp2PopCallback(void *ptr) 
{
  Serial.println("R305");
  text_state_p2.setText("ENTER YOUR FINGER");
  unsigned long  time_now = millis();   
  while(millis() < time_now + 5000)
  {
     getFingerprintID(); 
  } 
  ID = finger.fingerID;
  GUI_DATA();
  sprintf(ID_S, "ID LA %d", ID);
  if(ID == 2) text_state.setText(ID_S);
  else text_state.setText("KHONG TIM THAY");    
  ID = 0;
//delay(50);            //don't ned to run this at full speed.  
  text_state_p2.setText("SELECT MODE ATTENDANCE");
}

void brfidp2PopCallback(void *ptr)
{
  Serial.println("RFID");
  text_state_p2.setText("ENTER YOUR TAG RFID");
  unsigned long  time_now = millis();   
  while(millis() < time_now + 5000)
  {
     READ_RFID();
     //Serial.print("ID LA:");
  } 
  text_state_p2.setText("SELECT MODE ATTENDANCE");
}

void bfingp4_PopCallback(void *ptr) //gui id len
{

  text_fing.setText("ID");
}
void brfidp4_PopCallback(void *ptr)
{
  
  text_rfid.setText("ID");
}
void bnamep5_PopCallback(void *ptr) 
{
  //text_state.setText("on");
  //text_name.getText(textname_p4c, 20);
  text_dis_p5.getText(textname_p4c, 20);
  Serial.println(textname_p4c);
  
  //text_name.setText(NULL);
  page4.show();
  text_state.setText(textname_p4c);
}
void bposp6_PopCallback(void *ptr)
{
  //text_state.setText("off");
  text_positon.getText(textpos_p4c, 20); //char
  Serial.println(textpos_p4c);
  //text_positon.setText(NULL);
  page4.show();
}
void bgmailp7_PopCallback(void *ptr) 
{
  
  text_gmail.getText(textgmail_p4c, 20);
  Serial.println(textgmail_p4c);
  //text_gmail.setText(NULL);
  page4.show();
}
void bpassp8_PopCallback(void *ptr)
{
  text_pass.getText(textpass_p4c, 20);
  Serial.println(textpass_p4c);
  //text_pass.setText(NULL);
  page4.show();
}
void bdonep4_PopCallback(void *ptr)
{
//  memset(textname_p4c, NULL, 20);
//  memset(textpos_p4c, NULL, 20);
//  memset(textgmail_p4c, NULL, 20);
//  memset(textpass_p4c, NULL, 20);
  page2.show();
}

void setup() 
{
  //Serial.begin(9600);
  Serial2.begin(115200);
  finger.begin(57600);
  SPI.begin();
  mfrc522.PCD_Init();
  delay(5);
  nexInit();
  // Register the pop event callback function of the components
  button_fing_p2.attachPop(bfingp2PopCallback, &button_fing_p2);
  button_rfid_p2.attachPop(brfidp2PopCallback, &button_rfid_p2);

  button_fing_p4.attachPop(bfingp4_PopCallback, &button_fing_p4);
  button_rfid_p4.attachPop(brfidp4_PopCallback, &button_rfid_p4);
  button_name_p5.attachPop(bnamep5_PopCallback, &button_name_p5);
  button_pos_p6.attachPop(bposp6_PopCallback, &button_pos_p6);
  button_gmail_p7.attachPop(bgmailp7_PopCallback, &button_gmail_p7);
  button_pass_p8.attachPop(bpassp8_PopCallback, &button_pass_p8);
  button_done_p4.attachPop(bdonep4_PopCallback, &button_done_p4); 

  if (finger.verifyPassword()) 
  {
    Serial.println("Found fingerprint sensor!");
  } else {
    Serial.println("Did not find fingerprint sensor :(");
    //while (1) { delay(1); }
  }

// DS1307
  if(!rtc.begin())
  {
    Serial.println("ERROR");
    return;
  }
  if (! rtc.isrunning()) 
  {
    Serial.println("RTC is NOT running, let's set the time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
     //rtc.adjust(DateTime(2021, 5, 3, 14, 38, 0)); // YEAR/MON/DAY/HOUR/MINUTE/SECOND
  }

//WIFI
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
  nexLoop(nex_listen_list);
  if(millis() - previousMillis >= 1000)
  {
     previousMillis = millis();
     GET_TIME();
  }
//  Serial.println(textname_p4c);
//  Serial.println(textpos_p4c);
//  Serial.println(textgmail_p4c);
//  Serial.println(textpass_p4c);
} 


uint8_t getFingerprintID() {
  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println("No finger detected");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image converted");
      break;
    case FINGERPRINT_IMAGEMESS:
      Serial.println("Image too messy");
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      return p;
    case FINGERPRINT_FEATUREFAIL:
      Serial.println("Could not find fingerprint features");
      return p;
    case FINGERPRINT_INVALIDIMAGE:
      Serial.println("Could not find fingerprint features");
      return p;
    default:
      Serial.println("Unknown error");
      return p;
  }

  // OK converted!
  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.println("Found a print match!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    Serial.println("Did not find a match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);

  return finger.fingerID;
}

// returns -1 if failed, otherwise returns ID #
int getFingerprintIDez() 
{
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK)  return -1;

  p = finger.fingerFastSearch();
  if (p != FINGERPRINT_OK)  return -1;

  // found a match!
  Serial.print("Found ID #"); Serial.print(finger.fingerID);
  Serial.print(" with confidence of "); Serial.println(finger.confidence);
  return finger.fingerID;
}
void READ_RFID()
{
if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
  return;
  }
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
  return;
  }
  Serial.println("ID thẻ: ");
  for (byte i = 0; i < 5; i++)
  {
    //Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0 ": " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println("");
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();  
}
void GET_TIME()
{
  DateTime now = rtc.now();
  Serial.print(now.year(), DEC);
  Serial.print('/');
  Serial.print(now.month(), DEC);
  Serial.print('/');
  Serial.print(now.day(), DEC);
  Serial.print(" (");
  Serial.print(daysOfTheWeek[now.dayOfTheWeek()]);
  Serial.print(") ");
  Serial.print(now.hour(), DEC);
  Serial.print(':');
  Serial.print(now.minute(), DEC);
  Serial.print(':');
  Serial.print(now.second(), DEC);
  Serial.println();
  sprintf(TIME,"%d:%d:%d %d/%d/%d", now.hour(), now.minute(), now.second(), now.day(), now.month(), now.year());
  //Serial.println(TIME);
  text_state.setText(TIME);  
}
void GUI_DATA()
{
  HTTPClient http;
  http.begin(serverName);
  GET_TIME();
  String POS = "worker";
  String RFID = "abcdrf4";
  String NAME = "sinh pham";
  String GMAIL = "sinhpham@gmail.com";
  String PASS = "pass1234";
  
  String dataPost = String("{\"ID\":\" ") + ID + String("\",\"RFID\":\" ") + RFID + String("\",\"NAME\":\" ") 
  + NAME + String("\",\"Position\":\" ") + POS + String("\",\"GMAIL\":\" ") + GMAIL + String("\",\"PASS\":\" ") 
  + PASS + String("\",\"TIME\":\" ") + TIME + String("\" }");
  
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
