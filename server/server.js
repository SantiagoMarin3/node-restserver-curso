require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Habilita la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
})