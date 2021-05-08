#include "Nextion.h"

NexText text_state = NexText(2, 4, "t1"); 
NexButton button_on = NexButton(2, 2, "b0");
NexButton button_off = NexButton(2, 3, "b1");

//KHAI BAO DOI TUONG CHAM
NexTouch *nex_listen_list[] = 
{
  &button_on,
  &button_off,
  NULL
};

void bOnPopCallback(void *ptr) 
{
  //text_state.setText("on");
  Serial.println("led on");
}
void bOffPopCallback(void *ptr)
{
  //text_state.setText("off");

  Serial.println("led off");
  //text_state.setText(String(i));
}

void setup() 
{
  nexInit();
  // Register the pop event callback function of the components
  button_on.attachPop(bOnPopCallback, &button_on);
  button_off.attachPop(bOffPopCallback, &button_off);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() 
{
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  nexLoop(nex_listen_list);
}
