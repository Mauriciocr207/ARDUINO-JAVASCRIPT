// Conexiones con el servidor
const inputText = document.querySelector('#text');
const button = document.querySelector('#btn-Emisor');
const connectButton = document.querySelector('#connect');
const socket = io();


let portCreated = false;
connectButton.addEventListener('click', () => {
  const classNameAcept = 'connect-acept';
  const classNameDenied = 'connect-denied';
  
  if(!connectButton.classList.contains(classNameAcept)) {
      connectButton.classList.add(classNameAcept);
      connectButton.classList.remove(classNameDenied);
      socket.emit('portConnection', false); // El puerto esta apagado en este momento
  } else {
    connectButton.classList.add(classNameDenied);
    connectButton.classList.remove(classNameAcept);
    socket.emit('portConnection', true); // El puerto esta apagado en este momento
  }
});



// Envío y recepción de datos

// Emisor
button.addEventListener('click', () => {
  socket.emit('message', inputText.value);
});



// Receptor
  // El cliente recibe datos
socket.on('arduino:data', data => {
  // Se imprimen los datos en consola
  console.log(data);
});



// Conexión del puerto
socket.on('arduinoDisconnected', data => {
  if (data) {
    console.log('CONECTA TU ARDUINO');
  }
});







// Estilos de la página
const   signUpBtn = document.getElementById('signUp'),
        signInBtn = document.getElementById('signIn'),
        container = document.getElementById('container');

signUpBtn.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});
signInBtn.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});