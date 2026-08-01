const MESSAGES = require('../constants/messages');
const { validarVenta, validarDetalleVenta } = require('../validators/ventas.validators');
const ventasService = require('../services/ventas.service');

// Listar ventas
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

// Obtener una venta por ID
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

// Crear una venta (encabezado, sin detalle todavía)
exports.crearVenta = async (req, res) => {

    try {

        const validacion = validarVenta(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        // req.usuario lo agrega auth.middleware.js a partir del JWTT
        const id_usuario = req.usuario.id_usuario;
        const { id_cliente } = validacion.datos;

        const id_venta = await ventasService.crearVenta(id_cliente, id_usuario);

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

// Eliminar una venta completa
exports.eliminarVenta = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID de la venta es inválido.'
            });
        }

        await ventasService.eliminarVenta(id);

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

// Detalle de venta
// Agregar un artículo a la venta
exports.agregarDetalle = async (req, res) => {

    try {

        const validacion = validarDetalleVenta(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const resultado = await ventasService.agregarDetalle(validacion.datos);

        if (!resultado.ok) {
            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });
        }

        return res.status(201).json({
            mensaje: 'Artículo agregado a la venta correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Obtener el detalle de una venta
exports.obtenerDetallesPorVenta = async (req, res) => {

    try {

        const { id_venta } = req.params;

        if (Number.isNaN(Number(id_venta))) {
            return res.status(400).json({
                mensaje: 'El ID de la venta es inválido.'
            });
        }

        const detalles = await ventasService.obtenerDetallesPorVenta(id_venta);
        res.json(detalles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Editar una línea de detalle
exports.editarDetalle = async (req, res) => {

    try {

        const { id_detalle } = req.params;
        const { cantidad, precio_unitario } = req.body;

        if (Number.isNaN(Number(id_detalle))) {
            return res.status(400).json({
                mensaje: 'El ID del detalle es inválido.'
            });
        }

        if (!cantidad || !precio_unitario || cantidad <= 0 || precio_unitario <= 0) {
            return res.status(400).json({
                mensaje: 'Cantidad y precio unitario deben ser mayores a cero.'
            });
        }

        const resultado = await ventasService.editarDetalle(id_detalle, cantidad, precio_unitario);

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

// Eliminar una línea de detalle
exports.eliminarDetalle = async (req, res) => {

    try {

        const { id_detalle } = req.params;

        if (Number.isNaN(Number(id_detalle))) {
            return res.status(400).json({
                mensaje: 'El ID del detalle es inválido.'
            });
        }

        const resultado = await ventasService.eliminarDetalle(id_detalle);

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

// Recalcular el total de una venta a partir de sus detalles
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