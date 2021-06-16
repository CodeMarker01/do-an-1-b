void SEND_DATA_CHECK()
{
  GET_TIME();
  if(ENA_CHECKIN == 1)
  {
    HTTPClient http;
    http.begin(servercheck);
      String dataPost = String("{\"checkOutCode\":\"") + ID_CHECK + String("\",\"RFID\":\"") + UID_C + String("\",\"checkInTime\":\"") 
    + TIME + String("\",\"REQUEST\":\"") + pass_pkrfidselc + String("\" }");
    
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(dataPost); // GUI DATA LEN SERVER  

    String StringRecive_In = "{}"; // STORED DATA GET FROM SEVER 
    if (httpResponseCode > 0) //GET DATA
    {
      Serial.print("HTTP Response code POST EMBEDDED: ");
      Serial.println(httpResponseCode);
      StringRecive_In = http.getString();
      Serial.println(StringRecive_In);
    }
    else
    {
      Serial.print("Error code POST EMBEDDED: ");
      Serial.println(httpResponseCode);
    }

// ---------------------------------GET JSON----------------------------------------------//
/* Guidline 
 * Step1: GET OBJECT. Ex(JSONVar ObjectRecive_In = JSON.parse(StringRecive_In);)
 * Step2: GET KEY. (Ex: JSONVar keys1 = ObjectRecive_In.keys();)
 * Step3: GET VALUE KEY. (Ex: JSONVar valueKey1 = ObjectRecive_In[keys1[0]];)
 */
  JSONVar ObjectRecive_In = JSON.parse(StringRecive_In);   // LAY OBJECT
  
  if (JSON.typeof(ObjectRecive_In) == "undefined")
  {
    Serial.println("Parsing input failed!");
    return;
  }
//  Serial.println(JSON.typeof(ObjectRecive_In)); // XEM KIEU JSON
//  Serial.print("JSON object = ");
//  Serial.println(ObjectRecive_In); 

  JSONVar keys1 = ObjectRecive_In.keys(); // LAY KEY 
//  Serial.println(ObjectRecive_In.keys());
  JSONVar valueKey1 = ObjectRecive_In[keys1[0]]; // LAY VALUE KEY
//  for (int i = 0; i < keys1.length(); i++) // IN ALL KEY VA VALUE KEY
//  {
//    valueKey1 = ObjectRecive_In[keys1[i]];
//    Serial.print(keys1[i]);
//    Serial.print(" = ");
//    Serial.println(valueKey1);
//  }  
                      // LAY VALUE KEY NHO LÀM OBJECT 
  JSONVar keys2 = valueKey1.keys(); // LAY KEY2
//  Serial.println(valueKey1.keys());
//  JSONVar valueKey2 = valueKey1[keys[0]]; 
//  for (int i = 0; i < keys2.length(); i++) // // IN ALL KEY VA VALUE KEY
//  {
//    JSONVar value4 = value[keys2[i]];
//    Serial.print(keys2[i]);
//    Serial.print(" = ");
//    Serial.println(value4);    
//  }
    Serial.println("--------------------");
    Serial.println(keys2[8]);   // LAY KEY[8]
    Serial.print(" = ");
    Serial.println( valueKey1[keys2[8]]); //LAY VALUE KEU[8]

    http.end();
    ENA_CHECKIN=0;
    select_checkin_p2.setValue(0);
  }
