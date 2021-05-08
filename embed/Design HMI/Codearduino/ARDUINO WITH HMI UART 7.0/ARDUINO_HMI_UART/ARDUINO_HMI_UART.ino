 //My blog: http://unovn.blogspot.com/
 //My apps: 
 #include <SoftwareSerial.h>
 int i, giaTri[7];
 int bluetoothTx = 1;
 int bluetoothRx = 0;
 SoftwareSerial HMI(bluetoothRx , bluetoothTx);


 
 void setup()
 {
  Serial.begin(9600);
   //Setup Bluetooth serial connection to android
   HMI.begin(9600);
    pinMode(13, OUTPUT);
    digitalWrite(13, LOW);
   
 
 }
 void loop()
 {
   resdUart();
   
   if(giaTri[0]==101 && giaTri[1]== 1 && giaTri[2]== 1 && giaTri[3]== 1 && giaTri[4]== 255 && giaTri[5]== 255 && giaTri[6]== 255)
   {
    digitalWrite(13, HIGH);
    }
    if(giaTri[0]==101 && giaTri[1]== 1 && giaTri[2]== 2 && giaTri[3]== 0 && giaTri[4]== 255 && giaTri[5]== 255 && giaTri[6]== 255)
   {
    digitalWrite(13, LOW);
    }
 }


 void resdUart()
 {
//Read from bluetooth and write to usb serial ( KHI CHƯA KẾT NỐI)
  if(HMI.available())
   {
    for(i=0;i<7;i++)
    {
      giaTri[i] = (int)HMI.read();
     Serial.print(giaTri[i]);
     Serial.print(" ");
    }
    Serial.print("\n");
   }
  }
