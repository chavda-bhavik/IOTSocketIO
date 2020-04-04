#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

const char * CLIENTID = "\"bs4d20djs837\"";
const char * SERVER = "2d83b49d.ngrok.io";
const char * SSID = "JOBS";
const char * PASSWORD = "bhavik6666";
boolean isHandshakDone = false;
int LDRDataCounter = 0;

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
    Serial.printf("LED made high");
  }
}
void checkHeap() {
  Serial.print("heap: ");
  Serial.println(ESP.getFreeHeap());
}
void takeLDRData() {
  LDRDataCounter++;
  if(LDRDataCounter==10) {
    checkHeap();
    LDRDataCounter=0;
    webSocket.emit("LDRData", "\"15\"");
  }
}
void disconnect() {
   Serial.println("Socket.IO DisConnected!");
}
void setup() {
    Serial.begin(115200);
    Serial.setDebugOutput(true);
    Serial.println();

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
  delay(1000);
//  if(!webSocket.connected()) {
//    Serial.printf("sorrry disconnected");
  //}
  if(isHandshakDone==true){
      takeLDRData();
  }
  webSocket.loop();
}