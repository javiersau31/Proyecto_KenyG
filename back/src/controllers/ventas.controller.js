const MESSAGES = require('../constants/messages');

const {
    validarVenta,
    validarDetalleVenta
} = require('../validators/ventas.validators');

const ventasService = require('../services/ventas.service');


// ======================================================
// LISTAR VENTAS
// ======================================================

exports.obtenerVentas = async (req, res) => {

    try {

        const ventas = await ventasService.obtenerVentas();

        res.json(ventas);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};


// ======================================================
// OBTENER VENTA POR ID
// ======================================================

exports.obtenerVentaPorId = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {

            return res.status(400).json({
                mensaje: 'El ID de la venta es inválido.'
            });

        }

        const venta = await ventasService.obtenerVentaPorId(id);

        if (!venta) {

            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });

        }

        res.json(venta);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};


// ======================================================
// CREAR VENTA
// ======================================================

exports.crearVenta = async (req, res) => {

    try {

        const validacion = validarVenta(req.body);

        if (!validacion.valido) {

            return res.status(400).json({
                mensaje: validacion.mensaje
            });

        }

        // El middleware de autenticación agrega req.usuario
        const id_usuario = req.usuario.id_usuario;

        const { id_cliente } = validacion.datos;

        const id_venta = await ventasService.crearVenta(
            id_cliente,
            id_usuario
        );

        return res.status(201).json({
            mensaje: 'Venta creada correctamente.',
            id_venta
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};


// ======================================================
// ELIMINAR VENTA COMPLETA
// ======================================================

exports.eliminarVenta = async (req, res) => {
    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID de la venta es inválido.'
            });
        }

        const resultado =
            await ventasService.eliminarVenta(Number(id));

        if (!resultado.ok) {
            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });
        }

        return res.json({
            mensaje: 'Venta eliminada correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });
    }
};


// ======================================================
// AGREGAR DETALLE A UNA VENTA
// ======================================================

exports.agregarDetalle = async (req, res) => {

    try {

        const validacion = validarDetalleVenta(req.body);

        if (!validacion.valido) {

            return res.status(400).json({
                mensaje: validacion.mensaje
            });

        }

        const resultado = await ventasService.agregarDetalle(
            validacion.datos
        );

        if (!resultado.ok) {

            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });

        }

        return res.status(201).json({
            mensaje: 'Artículo agregado a la venta correctamente.',
            precio_unitario: resultado.precio_unitario,
            subtotal: resultado.subtotal
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};


// ======================================================
// OBTENER DETALLES DE UNA VENTA
// ======================================================

exports.obtenerDetallesPorVenta = async (req, res) => {

    try {

        const { id_venta } = req.params;

        if (Number.isNaN(Number(id_venta))) {

            return res.status(400).json({
                mensaje: 'El ID de la venta es inválido.'
            });

        }

        const detalles =
            await ventasService.obtenerDetallesPorVenta(id_venta);

        res.json(detalles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};


// ======================================================
// EDITAR DETALLE
// ======================================================

exports.editarDetalle = async (req, res) => {

    try {

        const { id_detalle } = req.params;

        const { cantidad } = req.body;

        if (Number.isNaN(Number(id_detalle))) {

            return res.status(400).json({
                mensaje: 'El ID del detalle es inválido.'
            });

        }

        if (
            !Number.isInteger(Number(cantidad)) ||
            Number(cantidad) <= 0
        ) {

            return res.status(400).json({
                mensaje: 'La cantidad debe ser un número entero mayor a cero.'
            });

        }

        const resultado =
            await ventasService.editarDetalle(
                id_detalle,
                Number(cantidad)
            );

        if (!resultado.ok) {

            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });

        }

        return res.json({
            mensaje: 'Detalle actualizado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};


// ======================================================
// ELIMINAR DETALLE
// ======================================================

exports.eliminarDetalle = async (req, res) => {
    try {

        const { id_detalle } = req.params;

        if (Number.isNaN(Number(id_detalle))) {
            return res.status(400).json({
                mensaje: 'El ID del detalle es inválido.'
            });
        }

        const resultado =
            await ventasService.eliminarDetalle(id_detalle);

        if (!resultado.ok) {
            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });
        }

        return res.json({
            mensaje: 'Detalle eliminado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });
    }
};


// ======================================================
// RECALCULAR TOTAL
// ======================================================

exports.actualizarTotal = async (req, res) => {

    try {

        const { id_venta } = req.params;

        if (Number.isNaN(Number(id_venta))) {

            return res.status(400).json({
                mensaje: 'El ID de la venta es inválido.'
            });

        }

        await ventasService.recalcularTotal(id_venta);

        return res.json({
            mensaje: 'Total actualizado correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};