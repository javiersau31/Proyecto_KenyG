const conexion = require('../config/database');
const MESSAGES = require('../constants/messages');
const { validarCliente } = require('../validators/clientes.validators');

// Obtener todos los clientes activos
exports.obtenerClientes = async (req, res) => {

    try {

        const [clientes] = await conexion.query(
            `SELECT
                id_cliente,
                nombre,
                direccion,
                telefono,
                correo
            FROM clientes
            WHERE activo = TRUE
            ORDER BY nombre ASC`
        );

        res.json(clientes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Obtener un cliente por ID
exports.obtenerClientePorId = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del cliente es inválido.'
            });
        }

        const [clientes] = await conexion.query(
            `SELECT
                id_cliente,
                nombre,
                direccion,
                telefono,
                correo
            FROM clientes
            WHERE id_cliente = ?
            AND activo = TRUE`,
            [id]
        );

        if (clientes.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        res.json(clientes[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Crear un nuevo cliente (lo crea el admin/vendedor desde el panel, sin login, esta parte no me quedo clara pero pues tu me dices que onda con los roles y que puede hacer cada uno)
exports.crearCliente = async (req, res) => {

    try {

        const validacion = validarCliente(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { nombre, direccion, telefono, correo } = validacion.datos;

        const [resultado] = await conexion.query(
            `INSERT INTO clientes (nombre, direccion, telefono, correo)
             VALUES (?, ?, ?, ?)`,
            [nombre, direccion, telefono, correo]
        );

        return res.status(201).json({
            mensaje: 'Cliente creado correctamente.',
            id_cliente: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Actualizar un cliente
exports.actualizarCliente = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del cliente es inválido.'
            });
        }

        const validacion = validarCliente(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { nombre, direccion, telefono, correo } = validacion.datos;

        const [clienteActual] = await conexion.query(
            `SELECT id_cliente
             FROM clientes
             WHERE id_cliente = ?
             AND activo = TRUE`,
            [id]
        );

        if (clienteActual.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        await conexion.query(
            `UPDATE clientes
             SET nombre = ?, direccion = ?, telefono = ?, correo = ?
             WHERE id_cliente = ?`,
            [nombre, direccion, telefono, correo, id]
        );

        return res.status(200).json({
            mensaje: 'Cliente actualizado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Desactivar un cliente (soft delete de nuevo)
exports.desactivarCliente = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del cliente es inválido.'
            });
        }

        await conexion.query(
            `UPDATE clientes
             SET activo = FALSE
             WHERE id_cliente = ?`,
            [id]
        );

        return res.json({
            mensaje: 'Cliente desactivado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Activar un cliente
exports.activarCliente = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del cliente es inválido.'
            });
        }

        await conexion.query(
            `UPDATE clientes
             SET activo = TRUE
             WHERE id_cliente = ?`,
            [id]
        );

        return res.json({
            mensaje: 'Cliente activado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};