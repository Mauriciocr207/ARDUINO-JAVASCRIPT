// Conexiones con el servidor
const inputText = document.querySelector('#text');
const button = document.querySelector('#btn-Emisor');
const h1 = document.querySelector('h1');

const socket = io();

// Envío y recepción de datos
  // El cliente recibe datos
socket.on('arduino:data', data => {
    // Se imprimen los datos en consola
    console.log(data, h1.textContent);
});

button.addEventListener('click', () => {
    socket.emit('message', inputText.value);
    console.log('Enviando mensaje');
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