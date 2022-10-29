const int led = 13;
const int potPin = 3;
int valorVariable = 0;
String cadena;


void setup() {
  pinMode(led,OUTPUT);
  Serial.begin(9600);
}

void loop() {
  //Se lee el serial si hay un dato disponible
  if(Serial.available()>0){
    cadena = Serial.readStringUntil('\n');
    cadena = cadena.substring(0, cadena.length());
    if(cadena != "") {
      if(cadena == "H") {
        digitalWrite(led, HIGH);
      } 
      else if(cadena == "L") {
        digitalWrite(led, LOW);
      }
      Serial.println(cadena);
      delay(1000);
      cadena = "";
      }
    }
  
  //Envio de datos
  int val = analogRead(potPin);
  if( !(val < (valorVariable + 10) && val > (valorVariable - 10)) ){
    Serial.println(val);
    valorVariable = val;
  }
  delay(20);
}
