const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuariosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuariosDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contrasena invalidos"
                }
            });
        };

        if (!bcrypt.compareSync(body.password, usuariosDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contrasena) invalidos"
                }
            });
        };

        let token = jwt.sign({
            usuario: usuariosDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            Usuario: usuariosDB,
            token
        });
    });
})

module.exports = app;