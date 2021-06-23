#include "Nextion.h"

//KHAI BAO BIEN
char textname_p4c[20], textpos_p4c[20],textgmail_p4c[20], textpass_p4c[20];

NexText text_fing = NexText(4, 4, "t2"); 
NexText text_rfid = NexText(4, 7, "t4"); 
NexText text_name = NexText(4, 16, "t10"); 
NexText text_positon = NexText(4, 17, "t11"); 
NexText text_gmail = NexText(4, 18, "t12"); 
NexText text_pass = NexText(4, 9, "t13"); 

NexButton button_fing = NexButton(4, 3, "b0");
NexButton button_rfid = NexButton(4, 6, "b1");
NexButton button_name = NexButton(4, 11, "b2");
NexButton button_position = NexButton(4, 13, "b3");
NexButton button_gmail = NexButton(4, 14, "b4");
NexButton button_pass = NexButton(4, 15, "b5");
NexButton button_done = NexButton(4, 20, "b6");
//KHAI BAO DOI TUONG CHAM
NexTouch *nex_listen_list[] = 
{
  &button_fing,
  &button_rfid,
  &button_name,
  &button_position,
  &button_gmail,
  &button_pass,
  &button_done,
  NULL
};

void bfingp4_PopCallback(void *ptr) //gui id len
{

  text_fing.setText("ID");
}
void brfidp4_PopCallback(void *ptr)
{
  
  text_rfid.setText("ID");
}
void bnamep4_PopCallback(void *ptr) 
{
  //text_state.setText("on");
  text_name.getText(textname_p4c, 20);
  Serial.println(textname_p4c);
  text_name.setText(NULL);
}
void bposp4_PopCallback(void *ptr)
{
  //text_state.setText("off");
  text_positon.getText(textpos_p4c, 20); //char
  Serial.println(textpos_p4c);
  text_positon.setText(NULL);
}
void bgmailp4_PopCallback(void *ptr) 
{
  text_gmail.getText(textgmail_p4c, 20);
  Serial.println(textgmail_p4c);
  text_gmail.setText(NULL);
}
void bpassp4_PopCallback(void *ptr)
{
  text_pass.getText(textpass_p4c, 20);
  Serial.println(textpass_p4c);
  text_pass.setText(NULL);
}
void bdonep4_PopCallback(void *ptr)
{
  textname_p4c[20] = NULL;
}
void setup() 
{
  nexInit();
  button_fing.attachPop(bfingp4_PopCallback, &button_fing);
  button_rfid.attachPop(brfidp4_PopCallback, &button_rfid);
  button_name.attachPop(bnamep4_PopCallback, &button_name);
  button_position.attachPop(bposp4_PopCallback, &button_position);
  button_gmail.attachPop(bgmailp4_PopCallback, &button_gmail);
  button_pass.attachPop(bpassp4_PopCallback, &button_pass);
  button_done.attachPop(bdonep4_PopCallback, &button_done);   
}

void loop() 
{
  nexLoop(nex_listen_list);
}
