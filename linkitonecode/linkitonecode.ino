#include <LGPRS.h>      //include the base GPRS library
#include <LGPRSClient.h>  //include the ability to Post and Get information using HTTP
#include <LGPRSUdp.h>
#include <stdint.h>
#include "SparkFunBME280.h"
#include "Wire.h"
#include "SPI.h"
#define website "api.<yourwebsite>.com"
#define APN "WWW"
#define APN_USER ""
#define APN_PASS ""
LGPRSClient c;
BME280 mySensor;

boolean disconnectedMsg = false;
void setup() {
  // put your setup code here, to run once:
   Serial.begin(115200);             // setup Serial port
   mySensor.settings.commInterface = SPI_MODE;
   mySensor.settings.chipSelectPin = 10;
 
  //Operation settings
   mySensor.settings.runMode = 3; //Normal mode
   mySensor.settings.tStandby = 0;
   mySensor.settings.filter = 0;
   mySensor.settings.tempOverSample = 1;
   mySensor.settings.pressOverSample = 1;
   mySensor.settings.humidOverSample = 1;
 
   Serial.print("Starting BME280... result of .begin(): 0x");
   delay(10);  //BME280 requires 2ms to start up.
   Serial.println(mySensor.begin(), HEX);
   makeConnection();
}

void loop() {
    sendData();
    delay(5000);
}
void sendData(){
  int temp = mySensor.readTempC();
  int hum = mySensor.readFloatHumidity;
  int pres = mySensor.readFloatPressure;
  int ligh = map(analogRead(A0),0,1023,0,100);
  String dataString = String(temp)+"/"+String(hum)+"/"+String(pres)+"/"+String(ligh);
  Serial.println("send HTTP GET request");
  c.println("GET /sensor/<publisherkey>/"+dataString+" HTTP/1.1");
  c.println("Host: " website);
  c.println("Connection: close");
  c.println();

  // waiting for server response
  Serial.println("waiting HTTP response:");
  while (!c.available())
  {
    delay(100);
  }
  if(c.available()){
      
  }
  Serial.println("Data Sent");
}
void makeConnection(){
  Serial.println("Attach to GPRS network");   // Attach to GPRS network - need to add timeout
  while (!LGPRS.attachGPRS(APN,APN_USER,APN_PASS)) {
    delay(500);
  }
  Serial.println("GPRS attached!");
  delay(10000);
   // keep retrying until connected to website
  Serial.println("Connecting to API");
  while (0 == c.connect(website, 80))
  {
    Serial.println("Re-Connecting to API");
    delay(1000);
  }
}
