const conexion = require('../config/database');
const bcrypt = require('bcryptjs');
const MESSAGES = require('../constants/messages');
const { validarUsuario } = require('../validators/usuarios.validators');

// Obtener todos los usuarios activos
exports.obtenerUsuarios = async (req, res) => {

    try {

        const [usuarios] = await conexion.query(
            `SELECT
                u.id_usuario,
                u.nombre,
                u.correo,
                u.telefono,
                u.id_rol,
                r.nombre AS rol,
                u.created_at
            FROM usuarios u
            INNER JOIN roles r
                ON u.id_rol = r.id_rol
            WHERE u.activo = TRUE
            ORDER BY u.nombre ASC`
        );

        res.json(usuarios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Obtener un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del usuario es inválido.'
            });
        }

        const [usuarios] = await conexion.query(
            `SELECT
                u.id_usuario,
                u.nombre,
                u.correo,
                u.telefono,
                u.id_rol,
                r.nombre AS rol,
                u.created_at
            FROM usuarios u
            INNER JOIN roles r
                ON u.id_rol = r.id_rol
            WHERE u.id_usuario = ?
            AND u.activo = TRUE`,
            [id]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        res.json(usuarios[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {

    try {

        const validacion = validarUsuario(req.body, true);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { nombre, correo, telefono, contrasena, id_rol } = validacion.datos;

        // Verificar que el rol existaaa
        const [rol] = await conexion.query(
            `SELECT id_rol
             FROM roles
             WHERE id_rol = ?`,
            [id_rol]
        );

        if (rol.length === 0) {
            return res.status(404).json({
                mensaje: 'El rol seleccionado no existe.'
            });
        }

        // Verificar corro repetido
        const [usuarioExistente] = await conexion.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE correo = ?`,
            [correo]
        );

        if (usuarioExistente.length > 0) {
            return res.status(400).json({
                mensaje: 'Ya existe un usuario con ese correo.'
            });
        }

        const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

        const [resultado] = await conexion.query(
            `INSERT INTO usuarios
            (nombre, correo, telefono, contrasena, id_rol)
            VALUES (?, ?, ?, ?, ?)`,
            [nombre, correo, telefono, contrasenaHasheada, id_rol]
        );

        return res.status(201).json({
            mensaje: 'Usuario creado correctamente.',
            id_usuario: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del usuario es inválido.'
            });
        }

        // La contraseña es opcional al actualizar
        const validacion = validarUsuario(req.body, false);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { nombre, correo, telefono, contrasena, id_rol } = validacion.datos;

        // Verificar que el usuario exista
        const [usuarioActual] = await conexion.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE id_usuario = ?
             AND activo = TRUE`,
            [id]
        );

        if (usuarioActual.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        // Verificar que el rol exista
        const [rol] = await conexion.query(
            `SELECT id_rol
             FROM roles
             WHERE id_rol = ?`,
            [id_rol]
        );

        if (rol.length === 0) {
            return res.status(404).json({
                mensaje: 'El rol seleccionado no existe.'
            });
        }

        // Verificar correo duplicado en otro usuario
        const [correoDuplicado] = await conexion.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE correo = ?
             AND id_usuario <> ?`,
            [correo, id]
        );

        if (correoDuplicado.length > 0) {
            return res.status(400).json({
                mensaje: 'Ya existe un usuario con ese correo.'
            });
        }

        // Si mandan contraseña nueva, se hashea si no pues se conserva la que ya esta
        if (contrasena) {

            const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

            await conexion.query(
                `UPDATE usuarios
                 SET nombre = ?, correo = ?, telefono = ?, contrasena = ?, id_rol = ?
                 WHERE id_usuario = ?`,
                [nombre, correo, telefono, contrasenaHasheada, id_rol, id]
            );

        } else {

            await conexion.query(
                `UPDATE usuarios
                 SET nombre = ?, correo = ?, telefono = ?, id_rol = ?
                 WHERE id_usuario = ?`,
                [nombre, correo, telefono, id_rol, id]
            );

        }

        return res.status(200).json({
            mensaje: 'Usuario actualizado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Desactivar un usuario (soft delete de nuevo equisde)
exports.desactivarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del usuario es inválido.'
            });
        }

        await conexion.query(
            `UPDATE usuarios
             SET activo = FALSE
             WHERE id_usuario = ?`,
            [id]
        );

        return res.json({
            mensaje: 'Usuario desactivado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Activar un usuario
exports.activarUsuario = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del usuario es inválido.'
            });
        }

        await conexion.query(
            `UPDATE usuarios
             SET activo = TRUE
             WHERE id_usuario = ?`,
            [id]
        );

        return res.json({
            mensaje: 'Usuario activado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};