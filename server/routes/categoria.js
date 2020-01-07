const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');

// Muestra todas la categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') //Permite cargar informacion de otras tablas
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })
        });
});

// Muestra todas la categorias por ID
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        })
    });
});

// Crea una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    }); // Se crear una nueva instancia de ese Schema

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

// Actualiza una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descripcionActualizada = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descripcionActualizada, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    })
});

// Elimina una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Solo un admin puede borrar categorias
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    })
});

module.exports = app;