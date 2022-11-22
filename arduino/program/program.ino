#include <nRF24L01.h>
#include <printf.h>
#include <RF24.h>
#include <RF24_config.h>
#include <SPI.h>

const int ce_pin = 8;   // CE
const int cs_pin = 10;  // CSN
RF24 radio(ce_pin, cs_pin);

uint8_t address[][6] = { "1Side", "2Side" };  // Direccion de emision y recepción
int role = 0;   // 0 -> "1Side"  (Con led y Bobina)  || 1 -> "2Side"  (Con potencionmetro)

int leds[]={3, 5, 6, 9};    // Leds que se pueden utilizar

String lecturaPotenciometro = "";   // Variable para verificar que el mensaje recibido sea un número

int valorPotenciometro = 0; // Verifica que el valor del potenciometro esté en un determinado rango
int valorAux = 0;   // Variable para no enviar en cada loop el valor del potenciometro




void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  for(int i =0 ; i < 4; i++) 
  {pinMode(leds[i],OUTPUT);}
  
  // initialize the transceiver on the SPI bus
  if (!radio.begin()) {
    Serial.println("radio hardware is not responding!!");
  } else {
    Serial.println("radio hardware is ready!!");
  }

  radio.setPALevel(RF24_PA_MIN);    // Se configura el modulo en baja potencia
  Serial.println("Base iniciada");
  
  // set the TX address of the RX node into the TX pipe
  radio.openWritingPipe(address[role]);  // always uses pipe 0
 
  // set the RX address of the TX node into a RX pipe
  radio.openReadingPipe(1, address[!role]);  // using pipe 1

  radio.startListening();
}

void loop() {
  
  // PARA LECTURA
  uint8_t pipe;
    if (radio.available(&pipe)) {
      radio.stopListening();
      uint8_t *lecturaDATA[32];
      // is there a payload? get the pipe number that recieved it
      uint8_t bytes = radio.getPayloadSize();  // get the size of the payload
      radio.read(&lecturaDATA, sizeof(lecturaDATA));             // fetch payload from FIFO
//      Serial.print(F("Received "));
//      Serial.print(bytes);  // print the size of the payload
//      Serial.print(F(" bytes on pipe "));
//      Serial.print(pipe);  // print the pipe number
//      Serial.print(F(": "));
      String str = (char*)lecturaDATA;
      lecturaPotenciometro = str;
      Serial.println(str);  // print the payload's value
      radio.startListening();
    }
    if(Serial.available()) {
      radio.stopListening();
      String escrituraDATA = Serial.readStringUntil('\n');
      byte buff[escrituraDATA.length() + 1];
      escrituraDATA.getBytes(buff, escrituraDATA.length() + 1);  
      radio.write(&buff,sizeof(buff));
      radio.startListening();
    }
    
    if(role != 0) {
      int pot = analogRead(A0);
      if(valorPotenciometro < pot -10 || valorPotenciometro > pot + 10) {
          valorPotenciometro = pot;
      }
      if(valorAux != valorPotenciometro) {
          valorAux = valorPotenciometro;
          radio.stopListening();
          String escrituraDATA = String(valorAux);
          byte buff[escrituraDATA.length() + 1];
          escrituraDATA.getBytes(buff, escrituraDATA.length() + 1);  
          radio.write(&buff,sizeof(buff));
          radio.startListening();
      }
    } 
    else {
      int pot = lecturaPotenciometro.toInt();
      if(pot != 0) {
        int valorPotenciometro = pot;
          if(valorPotenciometro > 0 && valorPotenciometro < 255.75) {
            encenderLed(leds[0], valorPotenciometro);
          } 
          else if(valorPotenciometro > 255.75 && valorPotenciometro < 511.5) {
            int Min = 255.75;
            encenderLed(leds[0], 1023); 
            encenderLed(leds[1], valorPotenciometro - Min);
          }
          else if(valorPotenciometro > 511.5 && valorPotenciometro < 767.25) {
            int Min = 511.5;
            encenderLed(leds[0], 1023);
            encenderLed(leds[1], 1023);
            encenderLed(leds[2], valorPotenciometro - Min);
          }
          else if(valorPotenciometro > 767.25 && valorPotenciometro < 1023) {
            int Min = 767.25;
            encenderLed(leds[0], 1023);
            encenderLed(leds[1], 1023);
            encenderLed(leds[2], 1023);
            encenderLed(leds[3], valorPotenciometro - Min);
          }
        }
      }
}

void encenderLed(int x, int brillo) {
  analogWrite(x, brillo);
}
