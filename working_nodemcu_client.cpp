#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <SocketIoClient.h>

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

const char * CLIENTID = "\"bs4d20djs837\"";
const char * SERVER = "b74def3d.ngrok.io";
const char * SSID = "JOBS";
const char * PASSWORD = "bhavik6666";
boolean isHandshakDone = false;

void authHandshake(const char * payload, size_t length) {
  Serial.printf("authHandshake: %s\n", payload);
  isHandshakDone = true;
}
void socket_Connected(const char * payload, size_t length) {
  Serial.println("Socket.IO Connected!");
  webSocket.emit("join", CLIENTID);
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
    webSocket.on("connect", socket_Connected);
    webSocket.begin(SERVER);
}

void loop() {
  
  webSocket.loop();
}