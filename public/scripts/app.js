// Conexiones con el servidor
const inputText = document.querySelector('#text');
const button = document.querySelector('#emisorButton');
const connectButton = document.querySelector('#connect');
const messageBox = document.querySelector('#messsageBox');
const textArea = document.querySelector('#textArea');
let textValuesArray = []; 
for (let i = 0; i < textArea.rows; i++) {
  textValuesArray[i] = 0;  
}
const socket = io();



// CONEXIÓN CON EL PUERTO SERIAL
// Envía la señal para abrir o cerrar el puerto serial
let wantToOpenPort= false;
connectButton.addEventListener('click', () => {
  wantToOpenPort = !wantToOpenPort;
  if(wantToOpenPort) {
      socket.emit('wantOpenPort', true); // Solicitud para abrir el puerto
  } else {
    socket.emit('wantOpenPort', false); // Solcitud para cerrar el puerto
  }
});

// Envía error en caso de que no se pueda abrir o cerrar el puerto
socket.on('arduinoDisconnected', data => {
  if(data) {
    console.log('CONECTA TU ARDUINO');
    connectButton.classList.remove( connectButton.classList[1] );

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
    }
  };
});
    
//Verifica si el puerto se abrió correctamente
socket.on('openedPort', data => {
  const classNameAcept = 'connect-acept';
  const classNameDenied = 'connect-denied';
  if(data) {
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
  const data = inputText.value + '';
  socket.emit('envioDatos', data);
  console.log(data);
});

// Receptor - El cliente recibe datos
socket.on('arduino:data', data => {
  textValuesArray.push(data.trim());
  textValuesArray.shift();
  // Se imprimen los datos en consola
  console.log(textValuesArray);
  let text = '';
  for (const i of textValuesArray) {
    text = text + `${i}\n`;
  }
  textArea.textContent = text;
});


