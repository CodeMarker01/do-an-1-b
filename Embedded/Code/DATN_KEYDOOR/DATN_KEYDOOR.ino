#include <SPI.h>
#include <MFRC522.h>

#define SS_1_PIN 10
#define SS_2_PIN 2
#define RST_PIN 9
#define RELAY 3
#define SENSOR_DOOR 4
 
MFRC522 rfid(SS_1_PIN, RST_PIN); // Instance of the class
MFRC522 rfid1(SS_2_PIN, RST_PIN); // Instance of the class
MFRC522::MIFARE_Key key; 

byte UID_B[4], UID_B1[4];
char UID_C[15], UID_C1[15];

void setup() 
{ 
  Serial.begin(9600);
  pinMode(RELAY, OUTPUT);
  pinMode(SENSOR_DOOR, INPUT);
}

void loop() 
{
  RFID();
  RFID1(); 
  // CHECK_UID: SEND DATA TO SERVER TO CHECK IT. IF OK SEND '1' FOR ESP32, ELSE  SEND '0'.
  // IF(CHECK_UID == 1) ... ELSE ...
  if(String(UID_C1) == "A9A1EF6E")
  {
    digitalWrite(RELAY, HIGH);
    Serial.println("OPEN");
  }
  Serial.println(digitalRead(SENSOR_DOOR));
  if(digitalRead(SENSOR_DOOR) == 1)
  {
    memset(UID_C1, NULL, 15);
    digitalWrite(RELAY, LOW);
    Serial.println("CLOSE");
  }
  else Serial.println("MO");

}

//===========================================

void RFID()
{
  //Serial.println("pirmais");
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init MFRC522 
   
  if ( ! rfid.PICC_IsNewCardPresent()) 
  {
  return;
  }
  if ( ! rfid.PICC_ReadCardSerial()) 
  {
  return;
  }
  Serial.println("READER 1: ");
  for (byte i = 0; i < rfid.uid.size; i++)
  {
    UID_B1[i] = rfid.uid.uidByte[i];
  }
  byte UID_SIZE1 = sizeof(UID_B1);
  memset(UID_C1, 0, sizeof(UID_SIZE1));
  //COVERT BYTE TO CHAR
  for (int y = 0; y < UID_SIZE1; y++)
  {
    // convert byte to its ascii representation
    sprintf(&UID_C1[y * 2], "%02X", UID_B1[y]);
  }
  Serial.println(UID_C1);
  Serial.println("");
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
  SPI.end();
}

//==============================================
void RFID1()
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
    UID_B1[i] = rfid1.uid.uidByte[i];
  }
  byte UID_SIZE1 = sizeof(UID_B1);
  memset(UID_C1, 0, sizeof(UID_SIZE1));
  //COVERT BYTE TO CHAR
  for (int y = 0; y < UID_SIZE1; y++)
  {
    // convert byte to its ascii representation
    sprintf(&UID_C1[y * 2], "%02X", UID_B1[y]);
  }
  Serial.println(UID_C1);
  Serial.println("");
  rfid1.PICC_HaltA();
  rfid1.PCD_StopCrypto1();
   
  SPI.end();
}
