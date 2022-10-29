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
});


// Conexión Serial
const {SerialPort, SerialPortMock} = require('serialport');
let port = new SerialPort(
    {
        path: 'COM1',
        baudRate: 9600,
        autoOpen: false
    }
);
port.on('err', () => {console.log('error al abrir el puerto')}); 


// Envío y recepción de datos
// Conexión de socket
io.on('connection', socket => { 
    console.log('A new socket conected:' + socket.id);
    port.isOpen ? port.close() : null;
    
    // Se recibe el nombre del puerto
    socket.on('port', portValue => {
        // Se crea el puerto y los eventos del puerto.
        port = new SerialPort(
            {
                path: portValue,
                baudRate: 9600,
                autoOpen: false
            }
        );
        console.log(port.path);

        //RECEPCION DE DATOS DEL ARDUINO
        // arduino -> servidor -> cliente
        port.on('data', data => {
            // Se reciben datos al puerto y se convierten.
            const dataString = data.toString(); 
            
            // Se emiten al cliente
            io.emit('arduino:data', dataString);
            console.log(dataString);

        });
    });
       
    //Conexión del puerto
    socket.on('wantOpenPort', theWant => {
        if(theWant) {
            port.open(function (err) { 
                if(err) {
                    socket.emit('arduinoDisconnected', true);
                    console.log('CONECTA ARDUINO');
                } else { 
                    socket.emit('openedPort', true);
                    console.log('PUERTO ABIERTO');
                }
            });
        } else {
            port.close(function (err) { 
                if(err) {
                    socket.emit('arduinoDisconnected', true);
                    console.log('CONECTA ARDUINO');
                } else {
                    socket.emit('openedPort', false);
                    console.log('PUERTO CERRADO');
                }
            })
        }
    });

    //ENVIO DE DATOS AL ARDUINO
    // arduino <- servidor <- cliente
    socket.on('envioDatos', data => {
        //Se escribe mensaje en el puerto serial hacia el arduino
        data = `${data}\n`;
        port.write(Buffer.from(data));
        console.log(`enviando datos: ${data}`);
    });

});

//RECEPCION DE DATOS DEL ARDUINO
// arduino -> servidor -> cliente
// port.on('data', data => {
//     // Se reciben datos al puerto y se convierten.
//     const dataString = data.toString(); 
    
//     // Se emiten al cliente
//     io.emit('arduino:data', dataString);
//     console.log(dataString);

// });