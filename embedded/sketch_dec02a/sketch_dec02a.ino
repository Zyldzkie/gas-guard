#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// CUSTOMIZEABLE --- START | CUSTOMIZEABLE --- START | CUSTOMIZEABLE --- START


// CUSTOMIZEABLE --- END | CUSTOMIZEABLE --- END | CUSTOMIZEABLE --- END

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;
bool ledstatus = false;
bool buzzerStatus = false;
unsigned long sendDataPrevMillis = 0;


void setup() {
  
  Serial.begin(115200);
  
  pinMode(buzzerPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
  pinMode(yellowLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(gasSensorPin, INPUT);
  

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wifi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");

  Serial.print("IP: ");
  Serial.print(WiFi.localIP());
  Serial.print("");

  config.api_key = api_key;
  config.database_url = db_url;
  
  if(Firebase.signUp(&config, &auth, "", "")){
    Serial.print("sign up ok");
    signupOK=true;  
  }else{
    Serial.print(config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if(Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 2000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();


    // FOR TESTING // REMOVE AFTER TESTING
    if(Firebase.RTDB.getBool(&fbdo, "/" + hardwareId + "/buzzer"))
    {
       if(fbdo.dataType() == "boolean") 
       {
          buzzerStatus = fbdo.boolData();
          Serial.println("Successful READ from " + fbdo.dataPath() + ": " + String(ledstatus) + " {" + fbdo.dataType() + "}");
      
          if (buzzerStatus == true) {
            digitalWrite(buzzerPin, HIGH);  
          } else {
            digitalWrite(buzzerPin, LOW);   
          }
       }
        
    }

    int sensorValue = analogRead(gasSensorPin);
    if (Firebase.RTDB.setInt(&fbdo, "/" + hardwareId + "/gas_value", sensorValue)) {
      Serial.print("Gas value has been updated: ");
      Serial.println(sensorValue);
    } else {
      Serial.print("Failed to update gas value. Error: ");
      Serial.println(fbdo.errorReason());
    }  
  }
}
