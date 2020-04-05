#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

const char * CLIENTID = "\"bs4d20djs837\"";
const char * SERVER = "11944e76.ngrok.io";
const char * SSID = "JOBS";
const char * PASSWORD = "bhavik6666";
boolean isHandshakDone = false;
int LDRDataCounter = 0;
int LDRData = 0;
int LDRNormal = 10;
#define LED D0
char headerData[2] = "\"";
char finalData[15];
char tempChar[5];

void authHandshake(const char * payload, size_t length) {
  Serial.printf("authHandshake: %s\n", payload);
  if(!strcmp(payload, "verified")) {
    isHandshakDone = true;
  }
}
void socket_Connected(const char * payload, size_t length) {
  Serial.println("Socket.IO Connected!");
  webSocket.emit("join", CLIENTID);
}
void take_LDRAction(const char * payload, size_t length) {
  Serial.printf("LDRAction: %s\n", payload);
  if(strcmp(payload,"HIGH") == 0) {
    makeLEDHigh();
  }
  if(strcmp(payload,"LOW") == 0) {
    makeLEDLow();
  }
}
void makeLEDHigh() {
  digitalWrite(LED, LOW);
}
void makeLEDLow() {
  digitalWrite(LED, HIGH);
}
void checkHeap() {
  Serial.print("heap: ");
  Serial.println(ESP.getFreeHeap());
}
void takeLDRData() {
  LDRData = analogRead(A0);
  LDRDataCounter++;
  if(LDRDataCounter==10) {
    sendLDRData(LDRData);
    //checkHeap();
    LDRDataCounter=0;
  }
  if(LDRData<LDRNormal) {
    makeLEDHigh();
  }
}
void sendLDRData(int LDRData) {
    tempChar[0] = 0;
    itoa(LDRData, tempChar, 10);
    finalData[0] = 0;
    
    strcat(finalData, headerData);
    strcat(finalData, tempChar);
    strcat(finalData , "\"");

    webSocket.emit("LDRData", finalData);
}
void disconnect() {
   Serial.println("Socket.IO DisConnected!");
}
void setup() {
    Serial.begin(115200);
    Serial.setDebugOutput(true);
    Serial.println();
    pinMode(LED, OUTPUT); 
    for(uint8_t t = 4; t > 0; t--) {
        Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
        Serial.flush();
        delay(1000);
    }

    WiFiMulti.addAP(SSID, PASSWORD);
    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }
    webSocket.on("auth", authHandshake);
    webSocket.on("LDRAction", take_LDRAction);
    webSocket.on("connect", socket_Connected);
    webSocket.begin(SERVER);
    webSocket.on("disconnect", socket_Connected);
}

void loop() {
//  if(!webSocket.connected()) {
//    Serial.printf("sorrry disconnected");
  //}
  if(isHandshakDone==true){
      delay(1000);
      takeLDRData();
  }
  webSocket.loop();
}