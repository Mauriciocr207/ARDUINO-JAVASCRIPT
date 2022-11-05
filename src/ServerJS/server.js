//Express - Creando el servidor
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express();

// Creacion del servidor y el socket
const serverJS = createServer(app);
const ioJS = new Server(serverJS, {});

// Configuración del servidor
serverJS.listen(65000, () => {
    console.log("ServerJS running...");
});

// Envío de documento al navegador
(function() {
    const arrayDirName = __dirname.split("\\");
    arrayDirName.pop();
    arrayDirName.pop();
    const __dirName = arrayDirName.join("\\");
    console.log(__dirName);

    app.use(express.static(__dirName + '/public'));
    app.get('/', (req, res) => {
        res.sendFile(__dirName + '/public/index.html');
    });
})();


// Conexión Serial
const { SerialPort } = require('serialport');
let port; // variable global para el puerto
function createSerialPort(portValue) {
    // Se crea el puerto y los eventos del puerto.
    port = new SerialPort(
        {
            path: portValue,
            baudRate: 9600,
            autoOpen: false
        }
    );
    console.log(`Port created on: ${port.path}`);

    //RECEPCION DE DATOS DEL ARDUINO
    // arduino -> servidor -> cliente
    port.on('data', data => {
        // Se reciben datos al puerto y se convierten.
        const dataString = data.toString();

        // Se emiten al cliente
        io.emit('arduino:data', dataString);
        console.log(dataString);

    });

    port.on('err', () => {console.log('error al abrir el puerto')});
}
createSerialPort('COM1'); // Se inicializa el puerto en el COM1



// Envío y recepción de datos
// Conexión de socket
ioJS.on('connection', client => { 
    console.log('A new client conected');
    console.log('Client ID: ' + client.id);
    console.log('Client IP: ' + client.handshake.address);
    port.isOpen ? port.close() : null;
    
    // Se recibe el nombre del puerto
    client.on('port', portValue => {
        createSerialPort(portValue);
    });
       
    //Conexión del puerto
    client.on('wantOpenPort', theWant => {
        if(theWant) {
            port.open( err => { 
                if(err) {
                    client.emit('arduinoDisconnected', true);
                    console.log('CONECTA ARDUINO');
                } else { 
                    client.emit('openedPort', true);
                    console.log('PUERTO ABIERTO');
                }
            });
        } else {
            port.close( err => { 
                if(err) {
                    client.emit('arduinoDisconnected', true);
                    console.log('CONECTA ARDUINO');
                } else {
                    client.emit('openedPort', false);
                    console.log('PUERTO CERRADO');
                }
            })
        }
    });

    //ENVIO DE DATOS AL ARDUINO
    // arduino <- servidor <- cliente
    client.on('envioDatos', data => {
        //Se escribe mensaje en el puerto serial hacia el arduino
        data = `${data}\n`;
        port.write(Buffer.from(data));
        console.log(`enviando datos: ${data}`);
    });
});


