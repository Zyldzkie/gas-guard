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
int sensorValue = 0;


void setup() {
  
  Serial.begin(115200);
  
  pinMode(buzzerPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
  pinMode(yellowLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(gasSensorPin, INPUT);

  digitalWrite(greenLedPin, HIGH);
  

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

  if(Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > checkIntervalMilli || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();

    sensorValue = analogRead(gasSensorPin);
    
    if (Firebase.RTDB.setInt(&fbdo, "/" + hardwareId + "/gas_value", sensorValue)) {
      
      Serial.print("Gas value has been updated: ");
      Serial.println(sensorValue);

      Firebase.RTDB.setBool(&fbdo, "/" + hardwareId + "/status", true);

      digitalWrite(yellowLedPin, HIGH);
      ctr++;
      Serial.println("Sending data: " + String(ctr));

      // Set warning and danger thresholds to the Firebase Realtime Database
      if (Firebase.RTDB.setInt(&fbdo, "/" + hardwareId + "/warningThresh", warningThresh)) {
        Serial.println("Warning threshold updated to: " + String(warningThresh));
      } else {
        Serial.println("Failed to update warning threshold. Error: " + fbdo.errorReason());
      }

      if (Firebase.RTDB.setInt(&fbdo, "/" + hardwareId + "/dangerThresh", dangerThresh)) {
        Serial.println("Danger threshold updated to: " + String(dangerThresh));
      } else {
        Serial.println("Failed to update danger threshold. Error: " + fbdo.errorReason());
      }

    } else {
      Serial.print("Failed to update gas value. Error: ");
      Serial.println(fbdo.errorReason());

      Firebase.RTDB.setBool(&fbdo, "/" + hardwareId + "/status", false);
    }  
    
  }
  else
  {
    digitalWrite(yellowLedPin, LOW);
   
  }

  if (sensorValue >= dangerThresh)
  {
    digitalWrite(redLedPin, HIGH);
    digitalWrite(buzzerPin, HIGH);
    delay(60000);
    digitalWrite(redLedPin, LOW);
    digitalWrite(buzzerPin, LOW);
  }
}
