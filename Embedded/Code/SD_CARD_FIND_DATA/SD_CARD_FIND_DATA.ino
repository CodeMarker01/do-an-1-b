#include <MFRC522.h> // for the RFID
#include <SPI.h> // for the RFID and SD card module
#include <SD.h> // for the SD card

// define pins for RFID
#define CS_RFID 9
#define RST_RFID 10
// define select pin for SD card module
#define CS_SD 4 

// Create a file to store the data
File myFile;

MFRC522 rfid(CS_RFID, RST_RFID); 
String uidString;
String karakterTerima = "169 161 239 110";
char buf[17];


void setup() 
{  
  Serial.begin(9600);
  //while(!Serial); // for Leonardo/Micro/Zero
  SPI.begin(); 
  rfid.PCD_Init(); 

  // Setup for the SD card
  Serial.print("Initializing SD card...");
  if(!SD.begin(CS_SD)) 
  {
    Serial.println("initialization failed!");
    return;
  }
  Serial.println("initialization done.");
}

void loop() 
{
  //look for new cards
//  if(rfid.PICC_IsNewCardPresent()) 
//  {
//    Serial.println("RFID");
//    readRFID();
//    delay(50);
//    logCard();
//  }
SearchData();
}

void readRFID() 
{
  rfid.PICC_ReadCardSerial();
  Serial.print("Tag UID: ");
  uidString = String(rfid.uid.uidByte[0]) + " " + String(rfid.uid.uidByte[1]) + " " + 
    String(rfid.uid.uidByte[2]) + " " + String(rfid.uid.uidByte[3]);
  Serial.println(uidString);
  delay(100);
}

void logCard()
{
  // Enables SD card chip select pin
  digitalWrite(CS_SD,LOW); 
  // Open file
  myFile=SD.open("DATA.txt", FILE_WRITE);
  // If the file opened ok, write to it
  if (myFile) 
  {
    Serial.println("File opened ok");
    myFile.println(uidString);
    myFile.close();
  }
  else 
  {
    Serial.println("error opening data.txt");  
  }
  // Disables SD card chip select pin  
  digitalWrite(CS_SD,HIGH);
}

void SearchData()
{
// re-open the file for reading:
  myFile = SD.open("DATA.txt");
  if (myFile) 
  {
    //Serial.println("DATA.txt");  
    // read from the file until there's nothing else in it:
    
    while (myFile.available()) 
    {
        myFile.read(buf,15);        
        if(strncmp(&buf[0],"169 161 239 110",15)==0)
        {
            Serial.println("Match!");  
            Serial.println(myFile.seek(buf));      
        }
    }
    myFile.close();
  } else 
  {
    Serial.println("error opening test.txt");
  }
}
