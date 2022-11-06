String Texto = "";
void setup()
{
  Serial.begin(9600);
}

void loop()
{
  // Se lee el serial si hay un dato disponible
  //  3s11111111 01101000 00000000 -> Ejemplo de dato recibido
  if (Serial.available() > 0)
  {
    String cadena = Serial.readStringUntil('\n');
    cadena = cadena.substring(0, cadena.length()); // Se limpiar la cadena
    if (cadena.indexOf("s") != -1)
    {
      int binSize = (cadena.substring(0, cadena.indexOf("s"))).toInt();            // Se obtienen los bits en la cadena
      String dataBin = cadena.substring(cadena.indexOf("s") + 1, cadena.length()); // Se obtienen los datos en binario
      Serial.println(dataBin);
      String binCadena = dataBin;
      String Cadena;
      for (int i = 0; i < binSize; i++)
      {
        if (i == 0)
        {
          Cadena = binCadena.substring(0, 8);
          binCadena = binCadena.substring(8, binCadena.length());
        }
        else
        {
          Cadena = binCadena.substring(1, 9);
          binCadena = binCadena.substring(9, binCadena.length());
        }
        // Serial.println(Cadena);
        delay(20);
      }
    }
    /*else {
      Texto += cadena + " ";
      if(cadena == "00000000") {
        // Serial.println(Texto);
        // Serial.println("listo");
        Texto = "";
      }*/
  }

  Texto = "";
  delay(1000);
}
