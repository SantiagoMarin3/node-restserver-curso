const jwt = require('jsonwebtoken');

// =======================
// Verifica Token
// =======================

let verificaToken = (req, res, next) => {
    let token = req.get('token') //De esta forma obtengo los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next();
    })

};

// =======================
// Verifica AdminRole
// =======================

let verificaAdminRole = (req, res, next) => {
    if (req.usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'No tiene permisos para esta operacion'
            }
        })
    }
};

module.exports = {
    verificaToken,
    verificaAdminRole
}