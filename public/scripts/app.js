// Constantes
const inputText = document.querySelector('#text');
const button = document.querySelector('#emisorButton');
const connectButton = document.querySelector('#connect');
const messageBox = document.querySelector('#messsageBox');
const textArea = document.querySelector('#textArea');
let textValuesArray = []; 
for (let i = 0; i < textArea.rows; i++) {
  textValuesArray[i] = '';  
}
const textAreaBin = document.querySelector('#textArea-Bin');
const btnPort = document.querySelector('#sendPort');
const numberPort = document.querySelector('#numberPort');
const comSelection = document.querySelector('.COMselection');
const socket = io();


// CONEXIÓN CON EL PUERTO SERIAL
// Envía el valor numérico del puerto
numberPort.addEventListener('input', () => {
  comSelection.classList.remove('portAcepted');
  comSelection.classList.add('portDenied');
  socket.emit('wantOpenPort', false); // Solicitud para cerrar el puerto
});
btnPort.addEventListener('click', () => {
  comSelection.classList.remove('portDenied');
  comSelection.classList.add('portAcepted');
  const namePort = `COM${numberPort.value}`
  socket.emit('port', namePort); // Se envia el nombre del puerto
  console.log(namePort);
});

// Envía la señal para abrir o cerrar el puerto serial
let wantToOpenPort= false;
connectButton.addEventListener('click', () => {
  wantToOpenPort = !wantToOpenPort;
  wantToOpenPort ? 
    socket.emit('wantOpenPort', true) // Solicitud para abrir el puerto 
    :socket.emit('wantOpenPort', false); // Solcitud para cerrar el puerto  
});

// Envía error en caso de que no se pueda abrir o cerrar el puerto
socket.on('arduinoDisconnected', disconnected => {
  if(disconnected) {
    console.log('CONECTA TU ARDUINO');
    connectButton.classList.remove( connectButton.classList[1] ); // Elimina cualquier clase en la posición 1 del array

    let msgErrorNode = document.querySelector('.errorArduinoConnection');
    
    if(msgErrorNode == null) {
      //Se crean y se posicionan nuevos elementos y sus clases
      msgErrorNode = document.createElement('DIV');
      const msgErrChildNode = document.createElement('STRONG');
      document.querySelector('body').appendChild(msgErrorNode);
      msgErrorNode.appendChild(msgErrChildNode);
      msgErrChildNode.textContent = "CONECTA TU ARDUINO"
      msgErrorNode.classList.add('errorArduinoConnection');

      setTimeout(() => {
        msgErrorNode.style.opacity = '1';
      }, 200);
      setTimeout(() => {
        msgErrorNode.style.opacity = '0';
      }, 2500);
      setTimeout(() => {
        msgErrorNode.remove();
      }, 3000);

      return 

    }
  };
});
    

//Verifica si el puerto se abrió correctamente
socket.on('openedPort', opened => {
  const classNameAcept = 'connect-acept';
  const classNameDenied = 'connect-denied';
  if(opened) {
    console.log('PUERTO ABIERTO');
    connectButton.classList.add(classNameAcept);
    connectButton.classList.remove(classNameDenied);
  } else {
    console.log('PUERTO CERRADO');
    connectButton.classList.add(classNameDenied);
    connectButton.classList.remove(classNameAcept);
  }
});

//----------------------------------//
//----------------------------------//
//----------------------------------//
//----------------------------------//

//ENVIO Y RECEPCION DE DATOS
// Emisor - El cliente envía datos
button.addEventListener('click', () => {
  const data = inputText.value;
  socket.emit('envioDatos', data);
  inputText.value = '';
});

// Receptor - El cliente recibe datos
socket.on('arduino:data', data => {
  data = data.trim(); // Se limpia todo espacio del string
  textValuesArray.push(data); //Se añade data al final del array
  textValuesArray.shift(); //Se elimina el primer dato del array
  // Se muestran los datos en el textArea
  let textToTextArea = '';
  for (const i of textValuesArray) {
    textToTextArea = textToTextArea + `${i}\n`;
  }
  textArea.textContent = textToTextArea;

  // Se imprime en consola las conversiones de cada char del string
  console.log(`Valor: ${data}`);
  let textToTextArea_Bin = '';
  for (const i of data) { //data es un string
    //Obtener valor Ascii del char
    const AsciiData = i.charCodeAt();

    //Cambiar un decimal a binario
    const binData = AsciiData.toString(2);
    
    //Cambiar un binario a un decimal
    const toIntData = parseInt(binData,2);
    
    //Obtener el caracter Ascii dado un valor decimal
    const toCharData = String.fromCharCode(toIntData);
    
    const charInfo = {
        String: i,
        Decimal: AsciiData,
        Binario: binData,
        DecimalBack: toIntData,
        StringBack: toCharData
    }
    console.table(charInfo);
    console.log(`\n`);

    textToTextArea_Bin = textToTextArea_Bin + ` ${charInfo.Binario.toString()}`;
  }
  
  // Se muestra cada string como combinaciones en binario en textAreaBin
  textAreaBin.textContent = textToTextArea_Bin;

});