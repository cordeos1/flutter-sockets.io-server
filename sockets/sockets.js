const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Coldplay'));
bands.addBand(new Band('Maroon5'));
bands.addBand(new Band('Queen'));
bands.addBand(new Band('AC/DC'));

//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente Conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente Desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje: ', payload);

        io.emit('mensaje', {admin: 'Nuevo Mensaje'});
    });

    client.on('emitir-mensaje', (payload) =>{
        console.log(payload);
        //io.emit('nuevo-mensaje', payload);//emite a todos los clientes, incluyendo al que produce el mensaje
        client.broadcast.emit('nuevo-mensaje', payload); //emite a todos menos al cliente que emite el mensaje
    });

    client.on('vote-band', (payload) =>{
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) =>{
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) =>{
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});