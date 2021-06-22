#include <Nextion.h>
#include <Adafruit_Fingerprint.h>
#include <HardwareSerial.h>
#include <SPI.h>
#include <MFRC522.h>
#include <RTClib.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <EEPROM.h>

#define RST_PIN        26 
#define SS_PIN         5 
MFRC522 mfrc522(SS_PIN, RST_PIN);
RTC_DS1307 rtc;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial2);

//NEXTION CONTROL ADD USER PAGE
//PAGE 2
NexText text_state_p2 = NexText(2, 1, "t0"); 
NexText text_infor_p2 = NexText(2, 4, "t1");
NexButton button_fing_p2 = NexButton(2, 2, "b0");
NexButton button_rfid_p2 = NexButton(2, 3, "b1");

//PAGE 4
NexText text_fing_p4 = NexText(4, 3, "t2"); 
NexText text_rfid_p4 = NexText(4, 5, "t4"); 
NexText text_name_p4 = NexText(4, 10, "t10"); 
NexText text_pos_p4 = NexText(4, 11, "t11"); 
NexText text_gmail_p4 = NexText(4, 12, "t12"); 
NexText text_pass_p4 = NexText(4, 13, "t13"); 

NexTouch button_fing_p4 = NexButton(4, 15, "m0");
NexTouch button_rfid_p4 = NexButton(4, 16, "m1");
NexButton button_done_p4 = NexButton(4, 14, "b6");

//PAGE KEYBOARD 5,6,7,8
NexText text_dis_p5 = NexText(5, 2, "t0"); 
NexText text_dis_p6 = NexText(6, 2, "t0"); 
NexText text_dis_p7 = NexText(7, 2, "t0"); 
NexText text_dis_p8 = NexText(8, 2, "t0"); 

NexButton button_name_p5 = NexButton(5, 34, "b28");
NexButton button_pos_p6 = NexButton(6, 34, "b28");
NexButton button_gmail_p7 = NexButton(7, 34, "b28");
NexButton button_pass_p8 = NexButton(8, 34, "b28");

//DEFINE PAGE
NexPage page2 = NexPage(2,0,"page_user");
NexPage page3 = NexPage(3,0,"page_admin");
NexPage page4 = NexPage(4,0,"add_user");

//KHAI BAO BIEN SU DUNG
int  ID_CHECK, ID_STORED;
char ID_CHECK_C[20], ID_STORED_C[20];
char TIME[20], TIME_D[10], TIME_H[10];
byte UID_B[4];
char UID_C[15];

long previousMillis = 0;
char textname_p4c[20], textpos_p4c[20],textgmail_p4c[20], textpass_p4c[20];

//KHAI BAO WIFI
//const char *ssid = "@@";
const char *ssid = "iPhone 12";
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

void bfingp2PopCallback(void *ptr) //CHECK ID
{
  Serial.println("R305");
  text_state_p2.setText("ENTER YOUR FINGER");
  unsigned long  time_now = millis();   
  while(millis() < time_now + 5000)
  {
     getFingerprintID(); 
    ID_CHECK = finger.fingerID;
    sprintf(ID_CHECK_C, "ID LA %d", ID_CHECK);
    if(ID_CHECK == -1) text_infor_p2.setText("KHONG TIM THAY");  //SAI
    else text_infor_p2.setText(ID_CHECK_C); 
  } 
  //SEND_DATA_CHECK();
  ID_CHECK = 0;
  text_infor_p2.setText(NULL);
  text_state_p2.setText("SELECT MODE");
}

void brfidp2PopCallback(void *ptr)
{
  Serial.println("RFID");
  text_state_p2.setText("ENTER YOUR TAG RFID");
  unsigned long  time_now = millis();   
  while(millis() < time_now + 5000)
  {
     READ_RFID();
     text_infor_p2.setText(UID_C);
  } 
  text_infor_p2.setText(NULL);
  //SEND_DATA_CHECK();
   memset(UID_C, 0, 15);
  text_state_p2.setText("SELECT MODE");
}

void bfingp4_PopCallback(void *ptr) //gui id len
{
  EEPROM.get(9, ID_STORED); 
  ID_STORED ++;
  EEPROM.put(9, ID_STORED);  
  EEPROM.commit(); 
  if (ID_STORED == 0) 
  {// ID #0 not allowed, try again!
     return;
  }
  Serial.print("Enrolling ID #");
  Serial.println(ID_STORED);
  while (!getFingerprintEnroll());
  sprintf(ID_STORED_C, "%d", ID_STORED);
  text_fing_p4.setText(ID_STORED_C);
}

void brfidp4_PopCallback(void *ptr)
{
  unsigned long  time_now = millis(); 
  while(millis() < time_now + 5000)
  {
     READ_RFID();
     text_rfid_p4.setText(UID_C);
  } 
}
void bnamep5_PopCallback(void *ptr) 
{
  text_dis_p5.getText(textname_p4c, 20);
  Serial.println(textname_p4c);
  text_dis_p5.setText(NULL);
  page4.show();
  text_name_p4.setText(textname_p4c);
  text_fing_p4.setText(ID_STORED_C); 
  text_rfid_p4.setText(UID_C);
}
void bposp6_PopCallback(void *ptr)
{
  text_dis_p6.getText(textpos_p4c, 20);
  Serial.println(textpos_p4c);
  text_dis_p6.setText(NULL);
  page4.show();
  text_pos_p4.setText(textpos_p4c);
  text_fing_p4.setText(ID_STORED_C); 
  text_rfid_p4.setText(UID_C);
}
void bgmailp7_PopCallback(void *ptr) 
{
  text_dis_p7.getText(textgmail_p4c, 20);
  Serial.println(textgmail_p4c);
  text_dis_p7.setText(NULL);
  page4.show();
  text_gmail_p4.setText(textgmail_p4c); 
  text_fing_p4.setText(ID_STORED_C); 
  text_rfid_p4.setText(UID_C);
}
void bpassp8_PopCallback(void *ptr)
{
  text_dis_p8.getText(textpass_p4c, 20);
  Serial.println(textpass_p4c);
  text_dis_p8.setText(NULL);
  page4.show();
  text_pass_p4.setText(textpass_p4c); 
  text_fing_p4.setText(ID_STORED_C); 
  text_rfid_p4.setText(UID_C);
}
void bdonep4_PopCallback(void *ptr)
{
  //SEND_DATA_STORED();
  
  //DELETE DATA STRING
  memset(ID_STORED_C, NULL, 20);
  memset(UID_C, NULL, 15);
  memset(textname_p4c, NULL, 20);
  memset(textpos_p4c, NULL, 20);
  memset(textgmail_p4c, NULL, 20);
  memset(textpass_p4c, NULL, 20);

  //DELETE DATA HMI
  text_fing_p4.setText(NULL);
  text_rfid_p4.setText(NULL);
  text_name_p4.setText(NULL);
  text_pos_p4.setText(NULL);
  text_gmail_p4.setText(NULL);
  text_pass_p4.setText(NULL); 
  page3.show();
  
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
  EEPROM.begin(512);
  EEPROM.commit();
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

  //DELETE EEPROM
//  for (int i = 0; i < 512; i++) 
//  {
//    EEPROM.write(i, 0);
//    delay(5); //Phải có delay tối thiểu 5 mili giây giữa mối lần write
//  }
}

void loop() 
{
  nexLoop(nex_listen_list);
  if(millis() - previousMillis >= 1000)
  {
     previousMillis = millis();
     GET_TIME();
  }
} 

// CHECK FINGER
uint8_t getFingerprintID() 
{
  uint8_t p = finger.getImage();
  switch (p) 
  {
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
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  Serial.println("ID thẻ: ");
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    //Serial.print(mfrc522.uid.uidByte[i], HEX);
    UID_B[i] = mfrc522.uid.uidByte[i];
  }
  byte UID_SIZE = sizeof(UID_B);
  memset(UID_C, 0, sizeof(UID_SIZE));

  //COVERT BYTE TO CHAR
  for (int y = 0; y < UID_SIZE; y++)
  {
    // convert byte to its ascii representation
    sprintf(&UID_C[y * 2], "%02X", UID_B[y]);
  }
  Serial.println(UID_C);
  Serial.println("");
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();  
}

//ADD FINGER
uint8_t getFingerprintEnroll() 
{
  int p = -1;
  Serial.print("Waiting for valid finger to enroll as #"); Serial.println(ID_STORED);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.println(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(1);
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

  Serial.println("Remove finger");
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }
  Serial.print("ID "); Serial.println(ID_STORED);
  p = -1;
  Serial.println("Place same finger again");
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch (p) {
    case FINGERPRINT_OK:
      Serial.println("Image taken");
      break;
    case FINGERPRINT_NOFINGER:
      Serial.print(".");
      break;
    case FINGERPRINT_PACKETRECIEVEERR:
      Serial.println("Communication error");
      break;
    case FINGERPRINT_IMAGEFAIL:
      Serial.println("Imaging error");
      break;
    default:
      Serial.println("Unknown error");
      break;
    }
  }

  // OK success!

  p = finger.image2Tz(2);
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
  Serial.print("Creating model for #");  Serial.println(ID_STORED);

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println("Prints matched!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_ENROLLMISMATCH) {
    Serial.println("Fingerprints did not match");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  Serial.print("ID "); Serial.println(ID_STORED);
  p = finger.storeModel(ID_STORED);
  if (p == FINGERPRINT_OK) {
    Serial.println("Stored!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not store in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.println("Unknown error");
    return p;
  }

  return true;
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
  sprintf(TIME_H,"%02d:%02d:%02d", now.hour(), now.minute(), now.second());
  sprintf(TIME_D,"%02d/%02d/%04d", now.hour(), now.minute(), now.second(), now.day(), now.month(), now.year());  
  //Serial.println(TIME);
  //text_state.setText(TIME);  
}
void SEND_DATA_STORED()
{
  HTTPClient http;
  http.begin(serverName);
  GET_TIME();
  String POS = "worker";
  String RFID = "abcdrf4";
  String NAME = "sinh pham";
  String GMAIL = "sinhpham@gmail.com";
  String PASS = "pass1234";
  
  String dataPost = String("{\"ID\":\" ") + ID_STORED + String("\",\"RFID\":\" ") + UID_C + String("\",\"NAME\":\" ") 
  + textname_p4c + String("\",\"Position\":\" ") + textpos_p4c + String("\",\"GMAIL\":\" ") + textgmail_p4c + String("\",\"PASS\":\" ") 
  + textpass_p4c + String("\",\"TIME\":\" ") + TIME + String("\" }");
  
  http.addHeader("Content-Type", "application/json");
  // int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":24.25,\"value2\":\"49.54\",\"value3\": humiTest }");
  int httpResponseCode = http.POST(dataPost); // GUI DATA LEN SERVER  
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  http.end(); 
}

void SEND_DATA_CHECK()
{
  HTTPClient http;
  http.begin(serverName);
  GET_TIME();
  String POS = "worker";
  String RFID = "abcdrf4";
  String NAME = "sinh pham";
  String GMAIL = "sinhpham@gmail.com";
  String PASS = "pass1234";
  
  String dataPost = String("{\"ID\":\" ") + ID_CHECK + String("\",\"RFID\":\" ") + UID_C + String("\",\"CheckInTime\":\" ") 
  + TIME_H + String("\",\"CheckInDay\":\" ") + TIME_D + String("\",\"CheckOutTime\":\" ") + TIME_H + String("\",\"CheckOutDay\":\" ") 
  + TIME_D + String("\",\"TIME\":\" ") + TIME + String("\" }");
  
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

  http.end();   
}
