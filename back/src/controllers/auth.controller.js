const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {

    // El campo se llama "usuario" en el body (así lo manda el front),
    // pero en la tabla usuarios NO existe apa una columna usuario,
    // solo "correo". pero aqui ya lo puse pa que busque por correo
    const { usuario: correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({
            mensaje: 'Correo y contraseña son obligatorios.'
        });
    }

    try {

        const [usuarios] = await db.query(
            `SELECT
                u.id_usuario,
                u.nombre,
                u.correo,
                u.contrasena,
                u.activo,
                r.nombre AS rol
            FROM usuarios u
            INNER JOIN roles r
                ON u.id_rol = r.id_rol
            WHERE u.correo = ?`,
            [correo]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        const usuarioDB = usuarios[0];

        if (!usuarioDB.activo) {
            return res.status(403).json({
                mensaje: 'El usuario se encuentra deshabilitado.'
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            contrasena,
            usuarioDB.contrasena
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        const token = jwt.sign(
            {
                id_usuario: usuarioDB.id_usuario,
                nombre: usuarioDB.nombre,
                rol: usuarioDB.rol
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '10h'
            }
        );

        res.json({
            token,
            usuario: {
                id_usuario: usuarioDB.id_usuario,
                nombre: usuarioDB.nombre,
                correo: usuarioDB.correo,
                rol: usuarioDB.rol
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error interno del servidor.'
        });
    }
};