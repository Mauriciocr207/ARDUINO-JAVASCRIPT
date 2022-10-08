// Conexión Serial
const {SerialPort, SerialPortMock} = require('serialport');
const port = new SerialPort(
    {
        path: 'COM3',
        baudRate: 9600,
        autoOpen: false
    }
);

//Express - Creando el servidor
const express = require('express');
const { callbackify } = require('util');
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

// Eventos del puerto
port.on('open', () => {
    console.log('Open Serial Port cabronesss');
});

port.on('err', () => {console.log('error al abrir el puerto')}); 

port.on('data', data => {
    // Se reciben datos al puerto y se convierten.
    let dataString = data.toString();
    // Se emiten al cliente
    io.emit('arduino:data', {value: parseInt(dataString)});
    console.log(dataString);
});


// Envío y recepción de datos
    // Conexión de socket
io.on('connection', socket => { 
    console.log('A new socket conected:' + socket.id);
    //Creación del puerto

    // Emisor
    // Se envía mensaje desde el navegador -> Servidor recibe mensaje del navegador.
    socket.on('message', data => {
        // Se envía 
        socket.broadcast.emit('message', data);
        // Se escribe mensaje en el puerto serial hacia el arduino
        port.write(Buffer.from(data));
    });

    // Receptor
    

    //Conexión del puerto
    socket.on('portConnection', data => {
        if(!data) {
            port.open(function (err) { 
                if(err) {
                    socket.emit('arduinoDisconnected', true);
                    console.log('CONECTA ARDUINO');
                }
            });
        } else {
            port.close(function (err) { 
                if(err) {
                    socket.emit('arduinoDisconnected', true);
                    console.log('CONECTA ARDUINO');
                }
            })
        }
    });
});
