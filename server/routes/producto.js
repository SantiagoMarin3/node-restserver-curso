const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

//===========================
// Obtener productos
//===========================
app.get('/producto', verificaToken, (req, res) => {
    // Trae todos los productos
    // Populate: usuario categoria
    // Paginado

    let desde = req.query.desde || 0;
    desde = Number(desde); //Convierte string en entero

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })
});

//===========================
// Obtener un producto por id
//===========================
app.get('/producto/:id', (req, res) => {
    // Populate: usuario categoria
    // Paginado

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });
});

//===========================
// Buscar producto
//===========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //Crea una expresion regular. La i es que es insensible a may y min

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        })

});


//===========================
// Crear un producto
//===========================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    }); // Se crear una nueva instancia de ese Schema

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
});

//===========================
// Actualiza un nuevo producto
//===========================
app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let productoActualizado = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    };

    Producto.findByIdAndUpdate(id, productoActualizado, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    })
});

//===========================
// Borrar un producto
//===========================
app.delete('/producto/:id', verificaToken, (req, res) => {
    // El campo disponible pasa a falso

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })
    });
});

module.exports = app;