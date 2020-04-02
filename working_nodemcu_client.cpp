#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <SocketIoClient.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;
SocketIoClient webSocket;

void event(const char * payload, size_t length) {
  USE_SERIAL.printf("got message: %s\n", payload);
//  webSocket.emit("hello", "Hello from nodemcu");
  webSocket.emit("hello","\"Hi server\"");
}


void setup() {
    USE_SERIAL.begin(115200);

    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }

    WiFiMulti.addAP("JOBS", "bhavik6666");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }
    webSocket.on("seconds", event);
    webSocket.on("event", event);
    webSocket.begin("2b612e3d.ngrok.io");
//    webSocket.emit("hello", "\"Hello from nodemcu\"s");
    // use HTTP Basic Authorization this is optional remove if not needed
    //webSocket.setAuthorization("username", "password");
}

void loop() {
    webSocket.loop();
}