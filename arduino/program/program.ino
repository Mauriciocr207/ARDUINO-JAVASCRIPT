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
    cadena = cadena.substring(0, cadena.length() - 1);
  }

  
  variable = cadena.toInt();
  
  if(variable != 0) {
    digitalWrite(led, HIGH);
    Serial.print("RECIBI DATOS: ");
    Serial.println(variable);
    delay(3000);
    cadena = "0";
  } else {
    digitalWrite(led, LOW);
  }

  Serial.println(counter);
  counter++;
  delay(1000);
  
}
