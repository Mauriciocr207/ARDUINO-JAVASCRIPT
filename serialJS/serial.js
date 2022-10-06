// Conexión Serial
const {SerialPort} = require('serialport');
const port = new SerialPort(
    {
        path: 'COM3',
        baudRate: 9600
    }
);

port.on('open', () => console.log('Open Serial Port cabronesss'));

port.on('err', err => console.log(err.message));


//Express - Creando el servidor
const express = require('express');
const app = express();

// Creacion del socket 
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Envío de documento al navegador
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
    console.log(__dirname);
});
// Configuración del servidor
server.listen(3000, () => {
    console.log("Server running...");
})



// Envío y recepción de datos
//     Recepción de datos del arduino
port.on('data', data => {
    // Se reciben datos al puerto y se convierten.
    let dataString = data.toString();
    // Se emiten al cliente
    io.emit('arduino:data', {value: dataString});
    console.log(dataString);
});
    // Conexión de socket
io.on('connection', socket => { 
    console.log('A new socket conected:' + socket.id);

    // Se envía mensaje desde el navegador -> Servidor recibe mensaje del navegador.
    socket.on('message', data => {
        // Se envía 
        socket.broadcast.emit('message', data);
        // Se escribe mensaje en el puerto serial hacia el arduino
        port.write(Buffer.from(data));
    });
});
