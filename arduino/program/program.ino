int counter = 0;
int led = 13;
int variable = 0;
String cadena;


void setup() {
  pinMode(led,OUTPUT);
  Serial.begin(9600);
}

void loop() {
  //Se lee el serial
  if(Serial.available()>0){
    cadena = Serial.readStringUntil('\n');
    cadena = cadena.substring(0, cadena.length());
  }

  if(cadena != "") {
    if(cadena == "H") {
      digitalWrite(led, HIGH);
    } 
    else if(cadena == "L") {
      digitalWrite(led, LOW);
    }
    Serial.print("RECIBI DATOS: ");
    Serial.println(cadena);
    delay(3000);
    cadena = "";
  }
  Serial.println(counter);
  counter++;
  delay(1000);
}
