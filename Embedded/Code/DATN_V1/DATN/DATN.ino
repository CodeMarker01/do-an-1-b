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

#define RST_PIN        14
#define SS_PIN         15
#define SS_PIN1        26
#define SENSOR_DOOR    34

#define RELAY          33
#define BUZZER         13

MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522 rfid1(SS_PIN1, RST_PIN); // Instance of the class
RTC_DS1307 rtc;
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

Adafruit_Fingerprint finger = Adafruit_Fingerprint(&Serial2);

//NEXTION CONTROL ADD USER PAGE
//PAGE 1
NexText text_time_p0 = NexText(0, 6, "t5"); 
NexText text_connect_p0 = NexText(0, 7, "t7"); 
NexButton button_user_p1 = NexButton(1, 2, "b0");
//PAGE 2
NexText text_state_p2 = NexText(2, 1, "t0"); 
NexText text_infor_p2 = NexText(2, 4, "t1");
NexButton button_fing_p2 = NexButton(2, 2, "b0");
NexButton button_rfid_p2 = NexButton(2, 3, "b1");
NexRadio  select_checkin_p2 = NexRadio(2, 5, "r0");
NexRadio  select_checkout_p2 = NexRadio(2, 6, "r1");

//PAGE key_rfid_select 
NexText text_pkrfidsel = NexText(7, 1, "t0");
NexButton button_pkrfidsel = NexButton(7, 10, "b28");

//PAGE key_pass_admin
NexText text_pkpassad = NexText(8, 1, "t0");
NexButton button_pkpassad = NexButton(8, 10, "b28");

//PAGE ADD USER 
NexText text_fing_p4 = NexText(4, 10, "t9"); 
NexText text_rfid_p4 = NexText(4, 11, "t10"); 
NexText text_name_p4 = NexText(4, 12, "t11"); 
NexText text_pos_p4 = NexText(4, 13, "t12"); 
NexText text_gmail_p4 = NexText(4, 14, "t13"); 
NexText text_username_p4 = NexText(4, 15, "t14"); 
NexText text_pass_p4 = NexText(4, 16, "t15"); 
NexText text_pass2_p4 = NexText(4, 17, "t16"); 

NexTouch button_fing_p4 = NexButton(4, 18, "m0");
NexTouch button_rfid_p4 = NexButton(4, 19, "m1");
NexButton button_exit_p4 = NexButton(4, 26, "b0");
NexButton button_done_p4 = NexButton(4, 27, "b1");

//PAGE KEYBOARD ADD USER
NexText text_dis_pkeyname = NexText(9, 1, "t0"); 
NexText text_dis_pkeypos = NexText(10, 1, "t0"); 
NexText text_dis_pkeygmail = NexText(11, 1, "t0"); 
NexText text_dis_pkeyusername = NexText(12, 1, "t0"); 
NexText text_dis_pkeypass = NexText(13, 1, "t0"); 
NexText text_dis_pkeypass2 = NexText(14, 1, "t0"); 

NexButton button_enter_pkeyname = NexButton(9, 10, "b28");
NexButton button_enter_pkeypos = NexButton(10, 10, "b28");
NexButton button_enter_pkeygmail = NexButton(11, 10, "b28");
NexButton button_enter_pkeyusername = NexButton(12, 10, "b28");
NexButton button_enter_pkeypass = NexButton(13, 10, "b28");
NexButton button_enter_pkeypass2 = NexButton(14, 10, "b28");

//PAGE KEYBOARD DELETE
NexText text_dis_delall = NexText(15, 1, "t0"); 
NexText text_dis_delid = NexText(16, 1, "t0");
NexText text_dis_pdeluser = NexText(5, 4, "t1"); 
NexButton button_enter_pdelall = NexButton(15, 10, "b28");
NexButton button_enter_pdelid = NexButton(16, 10, "b28");

//PAGE SET TAG TEMPORARY
NexText text_rfid_psettemp = NexText(6, 5, "t4"); 
NexText text_pos_psettemp = NexText(6, 6, "t5"); 
NexText text_dur_psettemp = NexText(6, 7, "t6");
NexText text_pos_pkeytemp = NexText(17, 1, "t0"); 
NexText text_dur_pkeytemp = NexText(18, 1, "t0"); 

NexTouch button_rfid_psettemp = NexButton(6, 8, "m0");
NexButton button_pos_pkeytemp = NexButton(17, 10, "b28");
NexButton button_dur_pkeytemp = NexButton(18, 10, "b28");
NexButton button_exit_psettemp = NexButton(6, 11, "b0");
NexButton button_done_psettemp = NexButton(6, 12, "b1");

//DEFINE PAGE
NexPage page0 = NexPage(0,0,"wait");
NexPage page1 = NexPage(1,0,"select");
NexPage page2 = NexPage(2,0,"user");
NexPage page3 = NexPage(3,0,"admin");
NexPage page4 = NexPage(4,0,"add_user");
NexPage page5 = NexPage(5,0,"del_user");
NexPage page6 = NexPage(6,0,"set_temp");

//KHAI BAO BIEN SU DUNG
int  ID_CHECK, ID_STORED, ID_DEL;
uint32_t   ENA_CHECKIN, ENA_CHECKOUT;
char ID_CHECK_C[20], ID_STORED_C[20], ID_DEL_C[20], ID_DEL_C2[20], NAME_RESPOND_C[20], Respond_DataCreateUser_C[20], Respond_DataCreateDoor_C[20];
String NAME_RESPOND_S = {};
String ENABLE_DOOR = {};
char TIME_ALL[30], TIME[25];
byte UID_B[4], UIDC_B[4];
byte moc;
char UID_C[8], UIDC_C[8]; //15


long previousMillis = 0; 
char textname_p4c[20], textpos_p4c[20],textgmail_p4c[20], textusern_p4c[20], textpass_p4c[20], textpass2_p4c[20];
char textpos_psettempc[20], textdur_psettempc[20];
char pass_pkrfidselc[12], pass_pkpassadc[8];
char pass_pdelallc[8];

//KHAI BAO WIFI
<<<<<<< Updated upstream:Embedded/Code/DATN_V1/DATN/DATN.ino
const char *ssid = "TANG 2 - 2";
//const char *ssid = "@@";
const char *password = "0936120886";
const char *serverCreateUser = "http://192.168.0.103:8000/api/create-users";
const char *serverCreateDoor = "http://192.168.0.103:8000/api/user/create-guest";
const char *serverCheckUser = "http://192.168.0.103:8000/api/profile/user/check-in-out";  
const char *serverCheckDoor = "http://192.168.0.103:8000/api/user/open-door";

=======
//const char *ssid = "TANG 2 - 2";
const char *ssid = "@@";
const char *password = "0936120886";
const char *serverName = "http://172.20.10.4:8000/api/create-users"; // WIFI TANG 2-1 http://172.20.10.4:8000/api/create-users
//const char *serverName = "http://172.20.10.4:8000/update-sensor";
//const char *serverName = "http://172.20.10.4:8000/api/create-or-update-user-profile";  //WIFI TANG 2-2 createUser
>>>>>>> Stashed changes:embed/Arduino/DATN_V1/DATN/DATN.ino
unsigned long lastTime = 0;
unsigned long timerDelay = 5000;

unsigned long previousMillis1 = 0;
unsigned long interval = 30000;

int n = 0;
int humiTest = 321;
int tempTest = 100;
double sensorReadingsArr[5];


//KHAI BAO DOI TUONG CHAM
NexTouch *nex_listen_list[] = 
{
  &button_user_p1,
  &button_fing_p2,
  &button_rfid_p2,
  &button_fing_p4,
  &button_rfid_p4,
  &button_enter_pkeyname,
  &button_enter_pkeypos,
  &button_enter_pkeygmail,
  &button_enter_pkeyusername,
  &button_enter_pkeypass,
  &button_enter_pkeypass2,
  &button_exit_p4,
  &button_done_p4,
  &button_enter_pdelall,
  &button_enter_pdelid,
  &button_rfid_psettemp,
  &button_pos_pkeytemp,
  &button_dur_pkeytemp,
  &button_exit_psettemp,
  &button_done_psettemp,
  
  &button_pkrfidsel,
  &button_pkpassad,
  NULL
};
void button_user_p1_PopCallback(void *ptr)
{
  select_checkin_p2.getValue(&ENA_CHECKIN);
  select_checkout_p2.getValue(&ENA_CHECKOUT);
  Serial.print("checkin: ");
  Serial.println(ENA_CHECKIN);
  Serial.print("checkout: ");
  Serial.println(ENA_CHECKOUT);
  if( (ENA_CHECKIN==1)&&(ENA_CHECKOUT==0) || (ENA_CHECKIN==0)&&(ENA_CHECKOUT==1))
  {
    page2.show();  
  }
//  else 
//  {
//    page1.show();
//  }
}
void bfingp2PopCallback(void *ptr) //CHECK ID
{
//  text_time_p0.setText("hi sinh");
  Serial.println("R305");
  digitalWrite(BUZZER, HIGH);
  delay(50);
  digitalWrite(BUZZER, LOW);
  text_state_p2.setText("ENTER YOUR FINGER");
  unsigned long  time_now = millis();   
  while(millis() < time_now + 5000)
  {
    getFingerprintID(); 
    ID_CHECK = finger.fingerID;
    sprintf(ID_CHECK_C, "ID LA %d", ID_CHECK);
    //CHECK ID -> LAY NAME
  } 
    for(int u=0;u<sizeof(ID_CHECK_C);u++)
    {
      Serial.println(ID_CHECK_C[u]);
    }
  if((ID_CHECK == 65406) && (ID_CHECK == 0))
  {
    text_infor_p2.setText("ID ERROR");  //SAI --> THIEU K NHAP
    delay(1000);
  }
  else 
  { 
    SEND_DATA_CHECK();  
    //text_infor_p2.setText(ID_CHECK_C);
    text_infor_p2.setText(NAME_RESPOND_C);
    Serial.println("++++++++++++++");
    Serial.println(NAME_RESPOND_C);
    delay(2000);
  }
  
  memset(NAME_RESPOND_C, NULL, 20);
  //text_infor_p2.setText(NULL);
  text_state_p2.setText("SELECT MODE");
  page1.show();
  
}

void button_pkrfidsel_PopCallback(void *ptr)
{
  text_pkrfidsel.getText(pass_pkrfidselc, 20);
  text_pkrfidsel.setText(NULL);
  Serial.println(String(pass_pkrfidselc)); 
  if( (String(pass_pkrfidselc) == "FINGER ERROR") || (String(pass_pkrfidselc) == "TEMPORARY"))
  {    
    page2.show();
    Serial.println("RFID");
    text_state_p2.setText("ENTER YOUR TAG RFID");
    unsigned long  time_now = millis();   
    while(millis() < time_now + 5000)
    {
       READ_RFID();
       text_infor_p2.setText(UID_C);
    } 
    text_infor_p2.setText(NULL);
    SEND_DATA_CHECK();
    memset(UID_C, 0, 8);  
    text_state_p2.setText("SELECT MODE");
    page1.show();
  }
  else 
  {
    page2.show();
    text_infor_p2.setText("THE REQUEST NOT CORRECT");
    delay(1000);
    text_infor_p2.setText("                       ");
    page1.show();
    memset(pass_pkrfidselc, 0, 15);
  }
}
void button_pkpassad_PopCallback(void *ptr)
{
  text_pkrfidsel.getText(pass_pkpassadc, 8);
  Serial.println(String(pass_pkpassadc));
  if( (String(pass_pkpassadc) == "12345678") || (String(pass_pkpassadc) == "87654321"))
  {
    memset(pass_pkpassadc, NULL, 8);
    text_pkrfidsel.setText(NULL);
    page3.show();
  }
  else
  {
    memset(pass_pkpassadc, NULL, 8);
    text_pkrfidsel.setText(NULL);
    page1.show();
  }   
}
//------------------------------- PAGE ADMIN ---------------------------------------//
void bfingp4_PopCallback(void *ptr) //gui id len
{
  text_fing_p4.setText("ENTER YOUR FINGER");
  EEPROM.get(9, ID_STORED); 
  ID_STORED ++;
  EEPROM.put(9, ID_STORED);  
  EEPROM.commit(); 
  if (ID_STORED == 0) 
  {
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
     text_rfid_p4.setText("ENTER YOUR TAG RFID");
  } 
<<<<<<< Updated upstream:Embedded/Code/DATN_V1/DATN/DATN.ino
  text_rfid_p4.setText(UID_C);                          
=======
  text_rfid_p4.setText(UID_C); // NẰM NGOÀI HAY TRONG ?
                          
>>>>>>> Stashed changes:embed/Arduino/DATN_V1/DATN/DATN.ino
}
void bnamep5_PopCallback(void *ptr) 
{
  text_dis_pkeyname.getText(textname_p4c, 20);
  Serial.println(textname_p4c);
  text_dis_pkeyname.setText(NULL);
  page4.show();
  text_name_p4.setText(textname_p4c);
}
void bposp6_PopCallback(void *ptr)
{
  text_dis_pkeypos.getText(textpos_p4c, 20);
  Serial.println(textpos_p4c);
  text_dis_pkeypos.setText(NULL);
  page4.show();
  text_pos_p4.setText(textpos_p4c);
}
void bgmailp7_PopCallback(void *ptr) 
{
  text_dis_pkeygmail.getText(textgmail_p4c, 20);
  Serial.println(textgmail_p4c);
  text_dis_pkeygmail.setText(NULL);
  page4.show();
  text_gmail_p4.setText(textgmail_p4c); 
}
void benter_pkeyusername_PopCallback(void *ptr)
{
  text_dis_pkeyusername.getText(textusern_p4c, 20);
  Serial.println(textusern_p4c);
  text_dis_pkeyusername.setText(NULL);
  page4.show();
  text_username_p4.setText(textusern_p4c); 
}
void bpassp8_PopCallback(void *ptr)
{
  text_dis_pkeypass.getText(textpass_p4c, 20);
  Serial.println(textpass_p4c);
  text_dis_pkeypass.setText(NULL);
  page4.show();
  text_pass_p4.setText(textpass_p4c); 
}
void bpass2p8_PopCallback(void *ptr)
{
  text_dis_pkeypass2.getText(textpass2_p4c, 20);
  Serial.println(textpass2_p4c);
  text_dis_pkeypass2.setText(NULL);
  page4.show();
  if(String(textpass2_p4c) == String(textpass_p4c))
  {
    text_pass2_p4.setText(textpass2_p4c); 
    Serial.println("CORRECT");
  }
  else
  {
    text_pass2_p4.setText("PASSWORD INCORRECT"); 
    memset(textpass2_p4c, NULL, 20);
    Serial.println("PASS1: ");
    Serial.println(textpass_p4c);
    Serial.println("PASS2: ");
    Serial.println(textpass2_p4c); 
  }
}
void bexitp4_PopCallback(void *ptr)
{
  memset(ID_STORED_C, NULL, 20);
  memset(UID_C, NULL, 8);
  memset(textname_p4c, NULL, 20);
  memset(textpos_p4c, NULL, 20);
  memset(textgmail_p4c, NULL, 20);
  memset(textusern_p4c, NULL, 20);
  memset(textpass_p4c, NULL, 20);
  memset(textpass2_p4c, NULL, 20);
  text_fing_p4.setText(NULL);
  text_rfid_p4.setText(NULL);
  text_name_p4.setText(NULL);
  text_pos_p4.setText(NULL);
  text_gmail_p4.setText(NULL);
  text_username_p4.setText(NULL);
  text_pass_p4.setText(NULL); 
  text_pass2_p4.setText(NULL); 
  page3.show();  
}
void bdonep4_PopCallback(void *ptr)
{
  Serial.println("----------rfid--------------");
  Serial.println(UID_C);
  SEND_DATA_STORED();
  SEND_DATA_CREATEDOOR();
  Serial.println(String(Respond_DataCreateUser_C));
  Serial.println(String(Respond_DataCreateDoor_C));
  memset(ID_STORED_C, NULL, 20);
  memset(UID_C, NULL, 8);
  memset(textname_p4c, NULL, 20);
  memset(textpos_p4c, NULL, 20);
  memset(textgmail_p4c, NULL, 20);
  memset(textusern_p4c, NULL, 20);
  memset(textpass_p4c, NULL, 20);
  memset(textpass2_p4c, NULL, 20);
  memset(Respond_DataCreateUser_C, NULL, 20);
  memset(Respond_DataCreateDoor_C, NULL, 20);
  text_fing_p4.setText(NULL);
  text_rfid_p4.setText(NULL);
  text_name_p4.setText(NULL);
  text_pos_p4.setText(NULL);
  text_gmail_p4.setText(NULL);
  text_username_p4.setText(NULL);
  text_pass_p4.setText(NULL); 
  text_pass2_p4.setText(NULL); 
  page3.show(); 
}

//PAGE DELETE
void benter_pdelall_PopCallback(void *ptr)
{
  text_dis_delall.getText(pass_pdelallc, 8);
  text_dis_delall.setText(NULL);
  Serial.println(String(pass_pdelallc));
  if( (String(pass_pdelallc) == "12345678") || (String(pass_pdelallc) == "87654321"))
  {
    finger.emptyDatabase();
    Serial.println("Now database is empty :)");
    page5.show();
    text_dis_pdeluser.setText("DATABASE IS EMPTY");
    delay(2000);
    text_dis_pdeluser.setText(NULL);

    //DELETE EEPROM
    for (int i = 0; i < 512; i++) 
    {
      EEPROM.write(i, 0);
      delay(5); 
    }
    ID_STORED = 1;    // RESET ID
  }
  else
  {
    page5.show();
    text_dis_pdeluser.setText("ERROR PASSWORD");
    delay(2000);
    text_dis_pdeluser.setText(NULL);
  }   
}
void benter_pdelid_PopCallback(void *ptr)
{
  text_dis_delid.getText(ID_DEL_C, 20);
  text_dis_delid.setText(NULL);
  Serial.println(String(ID_DEL_C));
  ID_DEL = atoi(ID_DEL_C),  
  deleteFingerprint(ID_DEL);
  page5.show();
  sprintf(ID_DEL_C2, "DELETED ID %d", ID_DEL);
  text_dis_pdeluser.setText(ID_DEL_C2);
  delay(2000);
  text_dis_pdeluser.setText(NULL);
  memset(ID_DEL_C, NULL, 20);
}

//PAGE SET TEMPORARY
void brfid_psettemp_PopCallback(void *ptr)
{
  unsigned long  time_now = millis();   
  while(millis() < time_now + 5000)
  {
     READ_RFID();
     text_rfid_psettemp.setText("ENTER YOUR TAG RFID");
  } 
  text_rfid_psettemp.setText(UID_C);
}
void bpos_pkeytemp_PopCallback(void *ptr)
{
  text_pos_pkeytemp.getText(textpos_psettempc, 20);
  text_pos_pkeytemp.setText(NULL);
  page6.show();
  text_rfid_psettemp.setText(UID_C);
  text_pos_psettemp.setText(textpos_psettempc);
  text_dur_psettemp.setText(textdur_psettempc);
}
void bdur_pkeytemp_PopCallback(void *ptr)
{
  text_dur_pkeytemp.getText(textdur_psettempc, 20);
  text_dur_pkeytemp.setText(NULL);
  page6.show();
  text_rfid_psettemp.setText(UID_C);
  text_pos_psettemp.setText(textpos_psettempc);
  text_dur_psettemp.setText(textdur_psettempc);
}
void bexit_pkeytemp_PopCallback(void *ptr)
{
  memset(UID_C, NULL, 8);
  memset(textpos_psettempc, NULL, 20);
  memset(textdur_psettempc, NULL, 20);
  text_rfid_psettemp.setText(NULL);
  text_pos_psettemp.setText(NULL);
  text_dur_psettemp.setText(NULL);
  page3.show();  
}
void bdone_pkeytemp_PopCallback(void *ptr)
{
  SEND_DATA_CREATEDOOR();
  Serial.println(Respond_DataCreateDoor_C);
  memset(UID_C, NULL, 8);
  memset(textpos_psettempc, NULL, 20);
  memset(textdur_psettempc, NULL, 20);
  memset(Respond_DataCreateDoor_C, NULL, 20); 
  text_rfid_psettemp.setText(NULL);
  text_pos_psettemp.setText(NULL);
  text_dur_psettemp.setText(NULL);
  page3.show(); 
}

void setup() 
{
  Serial.begin(9600);
  Serial1.begin(115200); //115200 HMI 
  finger.begin(57600); //R305
  SPI.begin();
  mfrc522.PCD_Init();
  delay(5);
  nexInit();
  EEPROM.begin(512);
  EEPROM.commit();
  pinMode(RELAY, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(SENSOR_DOOR, INPUT_PULLUP);
  // Register the pop event callback function of the components
  button_user_p1.attachPop(button_user_p1_PopCallback, &button_user_p1);
  button_fing_p2.attachPop(bfingp2PopCallback, &button_fing_p2);
  button_fing_p4.attachPop(bfingp4_PopCallback, &button_fing_p4);
  button_rfid_p4.attachPop(brfidp4_PopCallback, &button_rfid_p4);
  button_enter_pkeyname.attachPop(bnamep5_PopCallback, &button_enter_pkeyname);
  button_enter_pkeypos.attachPop(bposp6_PopCallback, &button_enter_pkeypos);
  button_enter_pkeygmail.attachPop(bgmailp7_PopCallback, &button_enter_pkeygmail);
  button_enter_pkeyusername.attachPop(benter_pkeyusername_PopCallback, &button_enter_pkeyusername);
  button_enter_pkeypass.attachPop(bpassp8_PopCallback, &button_enter_pkeypass);
  button_enter_pkeypass2.attachPop(bpass2p8_PopCallback, &button_enter_pkeypass2);
  button_exit_p4.attachPop(bexitp4_PopCallback, &button_exit_p4);
  button_done_p4.attachPop(bdonep4_PopCallback, &button_done_p4);  
  button_enter_pdelall.attachPop(benter_pdelall_PopCallback, &button_enter_pdelall);
  button_enter_pdelid.attachPop(benter_pdelid_PopCallback, &button_enter_pdelid);
  button_rfid_psettemp.attachPop(brfid_psettemp_PopCallback, &button_rfid_psettemp);
  button_pos_pkeytemp.attachPop(bpos_pkeytemp_PopCallback, &button_pos_pkeytemp);
  button_dur_pkeytemp.attachPop(bdur_pkeytemp_PopCallback, &button_dur_pkeytemp);
  button_exit_psettemp.attachPop(bexit_pkeytemp_PopCallback,&button_exit_psettemp);
  button_done_psettemp.attachPop(bdone_pkeytemp_PopCallback,&button_done_psettemp);   
  button_pkrfidsel.attachPop(button_pkrfidsel_PopCallback, &button_pkrfidsel);
  button_pkpassad.attachPop(button_pkpassad_PopCallback, &button_pkpassad);

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
    
  }
  //rtc.adjust(DateTime(2021, 6, 5, 17, 12, 0)); // YEAR/MON/DAY/HOUR/MINUTE/SECOND

//WIFI
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
    text_connect_p0.setText("CONNECT: ERROR");
  }
  text_connect_p0.setText("CONNECT: OK");
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");

}

void loop() 
{
  //RECONNECT WIFI
  unsigned long currentMillis = millis();
  // if WiFi is down, try reconnecting every CHECK_WIFI_TIME seconds
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis1 >=interval)) 
  {
    //text_connect_p0.setText("CONNECT: ERROR");
    Serial.print(millis());
    Serial.println("Reconnecting to WiFi...");
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis1 = currentMillis;
  }
  //else text_connect_p0.setText("CONNECT: OK");

  //CHECK RFID TO OPEN DOOR 
  READ_RFID1();
  READ_RFID2(); 
  if (String(UIDC_C) == NULL)
  {
    Serial.println("NO CARD");  
  }
  else
  {
    SEND_DATA_CHECKDOOR();
    memset(UIDC_C, NULL, 8);
    Serial.println("HAVE CARD"); 
  }
  
  if(digitalRead(SENSOR_DOOR) == 0)   //CB DONG:0 - MO: 1
  {
    digitalWrite(RELAY, HIGH); //CLOSE
    Serial.println("CLOSE DOOR");
  }
  if( ENABLE_DOOR == "1" )
  {
    digitalWrite(RELAY, LOW); //OPEN
    Serial.println("OPEN DOOR");
    ENABLE_DOOR = "0";
  }
  
<<<<<<< Updated upstream:Embedded/Code/DATN_V1/DATN/DATN.ino
=======

>>>>>>> Stashed changes:embed/Arduino/DATN_V1/DATN/DATN.ino
  // LOOP NEXTION
  nexLoop(nex_listen_list);
  if(millis() - previousMillis >= 1000)
  {
     previousMillis = millis();
     GET_TIME();
     //text_time_p0.setText(TIME_ALL);
  }
} 

void READ_RFID()
{
  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522  
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
  Serial.println("ID CHECK: ");
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    //Serial.print(mfrc522.uid.uidByte[i], HEX);
    UID_B[i] = mfrc522.uid.uidByte[i];
  }
  byte UID_SIZE = sizeof(UID_B);
  //memset(UID_C, 0, sizeof(UID_SIZE));

  //COVERT BYTE TO CHAR
  for (int y = 0; y < UID_SIZE; y++)
  {
    // convert byte to its ascii representation
    sprintf(&UID_C[y * 2], "%02X", UID_B[y]);
  }
  digitalWrite(BUZZER, HIGH);
  delay(50);
  digitalWrite(BUZZER, LOW);
  Serial.println(UID_C);
  Serial.println("");
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1(); 
  SPI.end(); 
}

void READ_RFID1()
{
  SPI.begin(); // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522  
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
  Serial.println("READER 1: ");
  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    //Serial.print(mfrc522.uid.uidByte[i], HEX);
    UIDC_B[i] = mfrc522.uid.uidByte[i];
  }
  byte UIDC_SIZE = sizeof(UIDC_B);
  memset(UIDC_C, NULL, sizeof(UIDC_SIZE));

  //COVERT BYTE TO CHAR
  for (int y = 0; y < UIDC_SIZE; y++)
  {
    // convert byte to its ascii representation
    sprintf(&UIDC_C[y * 2], "%02X", UIDC_B[y]);
  }
  digitalWrite(BUZZER, HIGH);
  delay(50);
  digitalWrite(BUZZER, LOW);
  Serial.println(UIDC_C);
  Serial.println("");
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1(); 
  SPI.end(); 
}

void READ_RFID2()
{
  SPI.begin(); // Init SPI bus
  rfid1.PCD_Init(); // Init MFRC522
    
  if ( ! rfid1.PICC_IsNewCardPresent()) 
  {
  return;
  }
  if ( ! rfid1.PICC_ReadCardSerial()) 
  {
  return;
  }
  Serial.println("READER 2: ");
  for (byte i = 0; i < rfid1.uid.size; i++)
  {
    //Serial.print(rfid1.uid.uidByte[ii], HEX);
    UIDC_B[i] = rfid1.uid.uidByte[i];
  }
  byte UIDC_SIZE = sizeof(UIDC_B);
  memset(UIDC_C, NULL, sizeof(UIDC_SIZE));
  //COVERT BYTE TO CHAR
  for (int y = 0; y < UIDC_SIZE; y++)
  {
    // convert byte to its ascii representation
    sprintf(&UIDC_C[y * 2], "%02X", UIDC_B[y]);
  }
  digitalWrite(BUZZER, HIGH);
  delay(50);
  digitalWrite(BUZZER, LOW);
  Serial.println(UIDC_C);
  Serial.println("");
  rfid1.PICC_HaltA();
  rfid1.PCD_StopCrypto1();  
  SPI.end();
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

//DELETE FINGER 
uint8_t deleteFingerprint(uint8_t id) 
{
  uint8_t p = -1;

  p = finger.deleteModel(id);

  if (p == FINGERPRINT_OK) {
    Serial.println("Deleted!");
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    Serial.println("Communication error");
    return p;
  } else if (p == FINGERPRINT_BADLOCATION) {
    Serial.println("Could not delete in that location");
    return p;
  } else if (p == FINGERPRINT_FLASHERR) {
    Serial.println("Error writing to flash");
    return p;
  } else {
    Serial.print("Unknown error: 0x"); Serial.println(p, HEX);
    return p;
  }
}

void GET_TIME()
{
  DateTime now = rtc.now();
  sprintf(TIME,"%04d-%02d-%02dT%02d:%02d:%02d",now.year(),now.month(), now.day(),now.hour(),now.minute(),now.second());
  sprintf(TIME_ALL,"TIME: %02d:%02d:%02d %02d/%02d/%04d ", now.hour(), now.minute(), now.second(), now.day(), now.month(), now.year());
//  Serial.println(TIME_ALL);
//  Serial.println(TIME); 
}

void SEND_DATA_STORED()
{
  HTTPClient http;
  http.begin(serverCreateUser);
  GET_TIME();
  
<<<<<<< Updated upstream:Embedded/Code/DATN_V1/DATN/DATN.ino
  String dataCreateUser = String("{\"fingerprint\":\"") + ID_STORED + String("\",\"rfid\":\"") + UID_C + String("\",\"name\":\"") 
  + textname_p4c + String("\",\"Position\":\"") + textpos_p4c + String("\",\"email\":\"") + textgmail_p4c + String("\",\"password\":\"") 
  + textpass_p4c + String("\" }"); 
  http.addHeader("Content-Type", "application/json");
  int httpResponse_CreateUser = http.POST(dataCreateUser); 
  if (httpResponse_CreateUser == 200) //GET DATA
  {
    Respond_DataCreateUser_C == "SUCCESS";
    Serial.print("HTTP Response Create User: ");
    Serial.println(httpResponse_CreateUser);
  }
  else
  {
    Respond_DataCreateUser_C == "ERROR";
    Serial.print("Error: ");
    Serial.println(httpResponse_CreateUser);
  }
  
=======
  String dataPost = String("{\"fingerprint\":\"") + ID_STORED + String("\",\"rfid\":\"") + UID_C + String("\",\"name\":\"") 
  + textname_p4c + String("\",\"Position\":\"") + textpos_p4c + String("\",\"email\":\"") + textgmail_p4c + String("\",\"password\":\"") 
  + textpass_p4c + String("\" }");
  
  http.addHeader("Content-Type", "application/json");
  //http.addHeader("x-auth-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjBiY2Q5NjMzYTQ1YTQyNzc4ODA5ODY1In0sImlhdCI6MTYyMjk5MDE1NSwiZXhwIjoxNjIzNDIyMTU1fQ.c3KwTOYYH2FKXVMGYS_TwJ7lj0OeU1D73UuX6iDxcGY");
  // int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":24.25,\"value2\":\"49.54\",\"value3\": humiTest }");
  int httpResponseCode = http.POST(dataPost); // GUI DATA LEN SERVER  
  Serial.println("---------------");
  Serial.println(dataPost);
  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
>>>>>>> Stashed changes:embed/Arduino/DATN_V1/DATN/DATN.ino
  http.end(); 
}

void SEND_DATA_CHECK()
{
  GET_TIME();
  if( (ENA_CHECKIN == 1) && (ID_CHECK !=0))
  {
    HTTPClient http;
    http.begin(serverCheckUser);
    String dataCheckIn = String("{\"checkOutCode\":\"") + ID_CHECK + String("\",\"RFID\":\"") + UID_C + String("\",\"checkInTime\":\"") 
    + TIME + String("\",\"REQUEST\":\"") + pass_pkrfidselc + String("\" }");   
    http.addHeader("Content-Type", "application/json");
    int httpResponse_CheckIn = http.POST(dataCheckIn); // GUI DATA LEN SERVER  

    String StringRecive_In = "{}"; 
    if (httpResponse_CheckIn == 200) //GET DATA
    {
      Serial.print("HTTP Response code POST EMBEDDED: ");
      Serial.println(httpResponse_CheckIn); //SEND DATA
      StringRecive_In = http.getString();
      Serial.println(StringRecive_In);  //GET RESPONDE

      // -------------------------------------- PROCESS JSON -----------------------------------------------//
    /* Guidline 
     * Step1: GET OBJECT. Ex(JSONVar ObjectRecive_In = JSON.parse(StringRecive_In);)
     * Step2: GET KEY. (Ex: JSONVar keys1 = ObjectRecive_In.keys();)
     * Step3: GET VALUE KEY. (Ex: JSONVar valueKey1 = ObjectRecive_In[keys1[0]];)
     */
    JSONVar ObjectRecive_In = JSON.parse(StringRecive_In);  // STEP1
    JSONVar keys1 = ObjectRecive_In.keys();                 // STEP2
    JSONVar valueKey1 = ObjectRecive_In[keys1[0]];          // STEP3
    JSONVar keys2 = valueKey1.keys();
    JSONVar valueName = valueKey1[keys2[8]];
    NAME_RESPOND_S = JSON.stringify(valueName); ///Convert the json to a String 

    NAME_RESPOND_S.remove(0,1);   //REMOVE ""
    for (int i = 0; i < NAME_RESPOND_S.length(); i++) 
    {
        if (NAME_RESPOND_S.charAt(i) == '"') 
        {
            moc = i; 
        }
    }
    NAME_RESPOND_S.remove(moc,NAME_RESPOND_S.length()-moc); //vi tri, so luong
    Serial.println(NAME_RESPOND_S);   
    NAME_RESPOND_S.toCharArray(NAME_RESPOND_C, sizeof(NAME_RESPOND_S));
    //sprintf(NAME_RESPOND_C, "%s --", NAME_RESPOND);
    Serial.print("Name: ");
    Serial.println(NAME_RESPOND_C);
    }
    else //ERROR
    {
      Serial.print("Error code POST EMBEDDED: ");
      Serial.println(httpResponse_CheckIn);
    }
    
    http.end();
    ID_CHECK = 0;
//    ENA_CHECKIN=0;
//    select_checkin_p2.setValue(0);
  }
  
  if(ENA_CHECKOUT == 1 && (ID_CHECK !=0))
  {
    HTTPClient http;
    http.begin(serverCheckUser);
    String dataCheckOut = String("{\"checkOutCode\":\"") + ID_CHECK + String("\",\"RFID\":\"") + UID_C + String("\",\"checkOutTime\":\"") 
    + TIME + String("\",\"REQUEST\":\"") + pass_pkrfidselc + String("\" }");   
    http.addHeader("Content-Type", "application/json");
    Serial.println(dataCheckOut);
    int httpResponse_CheckOut = http.POST(dataCheckOut); // GUI DATA LEN SERVER  

    String StringRecive_Out = "{}"; 
    if (httpResponse_CheckOut == 200) //GET DATA
    {
      Serial.print("HTTP Response code POST EMBEDDED: ");
      Serial.println(httpResponse_CheckOut); //SEND DATA
      StringRecive_Out = http.getString();
      Serial.println(StringRecive_Out);  //GET RESPONDE

      JSONVar ObjectRecive_Out = JSON.parse(StringRecive_Out);  // STEP1
      JSONVar keys3 = ObjectRecive_Out.keys();                 // STEP2
      JSONVar valueKey3 = ObjectRecive_Out[keys3[0]];          // STEP3
      JSONVar keys4 = valueKey3.keys();
      JSONVar valueName = valueKey3[keys4[8]];
      NAME_RESPOND_S = JSON.stringify(valueName); ///Convert the json to a String 
  
      NAME_RESPOND_S.remove(0,1);   //REMOVE ""
      for (int i = 0; i < NAME_RESPOND_S.length(); i++) 
      {
          if (NAME_RESPOND_S.charAt(i) == '"') 
          {
              moc = i; 
          }
      }
      NAME_RESPOND_S.remove(moc,NAME_RESPOND_S.length()-moc); //vi tri, so luong
      Serial.println(NAME_RESPOND_S);   
      NAME_RESPOND_S.toCharArray(NAME_RESPOND_C, sizeof(NAME_RESPOND_S));
      Serial.print("Name: ");
      Serial.println(NAME_RESPOND_C); 
    }
    else //ERROR
    {
      Serial.print("Error code POST EMBEDDED: ");
      Serial.println(httpResponse_CheckOut);
    }  
    http.end(); 
    
    ID_CHECK = 0; 
//    ENA_CHECKOUT=0;
//    select_checkout_p2.setValue(0);
  }
}

void SEND_DATA_CREATEDOOR()
{
  HTTPClient http;
  http.begin(serverCreateDoor);   
  String dataCreateDoor = String("{\"rfid\":\"") + UID_C + String("\",\"role\":\"") + textpos_psettempc + String("\",\"DurationTemporary\":\"") 
  + textdur_psettempc + String("\"}"); 
  http.addHeader("Content-Type", "application/json");
  int httpResponseCreateDoor = http.POST(dataCreateDoor); // GUI DATA LEN SERVER  
  if (httpResponseCreateDoor == 200) //GET DATA
  {
    Respond_DataCreateDoor_C == "SUCCESS";
    Serial.print("HTTP Response Create User: ");
    Serial.println(httpResponseCreateDoor);
  }
  else
  {
    Respond_DataCreateDoor_C == "ERROR";
    Serial.print("Error: ");
    Serial.println(httpResponseCreateDoor);
  }
  
  http.end(); 
}

void SEND_DATA_CHECKDOOR()
{
  HTTPClient http;
  http.begin(serverCheckDoor);
   
  String dataCheckDoor = String("{\"rfid\":\"") + UIDC_C + String("\",\"role\":\"") + textpos_psettempc + String("\"}"); 
  http.addHeader("Content-Type", "application/json");
  int httpResponse_CheckDoor = http.POST(dataCheckDoor); // GUI DATA LEN SERVER  

  String StringRecive_CheckDoor = "{}"; 
  if (httpResponse_CheckDoor == 200) //GET DATA
  {
    Serial.print("HTTP Response Check Door: ");
    Serial.println(httpResponse_CheckDoor); //SEND DATA
    StringRecive_CheckDoor = http.getString();
    Serial.println(StringRecive_CheckDoor);  //GET RESPONDE

    // -------------------------------------- PROCESS JSON -----------------------------------------------//
    JSONVar ObjectRecive_CheckDoor = JSON.parse(StringRecive_CheckDoor);  // STEP1
    JSONVar keysCheckDoor = ObjectRecive_CheckDoor.keys();                 // STEP2
    JSONVar valueCheckDoor = ObjectRecive_CheckDoor[keysCheckDoor[2]];          // STEP3
    ENABLE_DOOR = JSON.stringify(valueCheckDoor); ///Convert the json to a String 
    Serial.print("ENABLE DOOR: ");
    Serial.println(ENABLE_DOOR);
  }
  else //ERROR
  {
    Serial.print("Error code POST EMBEDDED: ");
    Serial.println(httpResponse_CheckDoor);
  }
  http.end(); 
}
