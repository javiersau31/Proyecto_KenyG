const conexion = require('../config/database');

// Crear una venta nueva (arranca en total = 0, se va acumulando con cada detalle)
const crearVenta = async (id_cliente, id_usuario) => {

    const [resultado] = await conexion.query(
        `INSERT INTO ventas (id_cliente, id_usuario)
         VALUES (?, ?)`,
        [id_cliente, id_usuario]
    );

    return resultado.insertId;

};

const obtenerVentas = async () => {

    const [ventas] = await conexion.query(
        `SELECT
            v.id_venta,
            DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i') AS fecha,
            v.total,
            c.nombre AS nombre_cliente
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        ORDER BY v.fecha DESC`
    );

    return ventas;

};

const obtenerVentaPorId = async (id_venta) => {

    const [ventas] = await conexion.query(
        `SELECT
            v.id_venta,
            DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i') AS fecha,
            v.total,
            v.id_cliente,
            c.nombre AS nombre_cliente
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        WHERE v.id_venta = ?`,
        [id_venta]
    );

    return ventas[0] || null;

};

// Agregar una línea de detalle a una venta valida stock, inserta,
// descuenta existencia y actualiza el total de la venta
const agregarDetalle = async (datos) => {

    const { id_venta, id_articulo, cantidad, precio_unitario } = datos;

    const [articuloRows] = await conexion.query(
        `SELECT existencia
         FROM articulos
         WHERE id_articulo = ?
         AND activo = TRUE`,
        [id_articulo]
    );

    if (articuloRows.length === 0) {
        return { ok: false, status: 404, mensaje: 'Artículo no encontrado.' };
    }

    const existenciaActual = articuloRows[0].existencia;

    if (existenciaActual < cantidad) {
        return { ok: false, status: 400, mensaje: 'No hay suficiente stock para la cantidad solicitada.' };
    }

    const subtotal = cantidad * precio_unitario;

    await conexion.query(
        `INSERT INTO detalle_ventas
        (id_venta, id_articulo, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [id_venta, id_articulo, cantidad, precio_unitario, subtotal]
    );

    await conexion.query(
        `UPDATE ventas
         SET total = total + ?
         WHERE id_venta = ?`,
        [subtotal, id_venta]
    );

    await conexion.query(
        `UPDATE articulos
         SET existencia = existencia - ?
         WHERE id_articulo = ?`,
        [cantidad, id_articulo]
    );

    return { ok: true };

};

const obtenerDetallesPorVenta = async (id_venta) => {

    const [detalles] = await conexion.query(
        `SELECT
            d.id_detalle,
            d.id_articulo,
            a.nombre AS nombre_articulo,
            d.cantidad,
            d.precio_unitario,
            d.subtotal
        FROM detalle_ventas d
        INNER JOIN articulos a
            ON d.id_articulo = a.id_articulo
        WHERE d.id_venta = ?`,
        [id_venta]
    );

    return detalles;

};

// Editar un detalle recalcula subtotal y ajusta el total de la venta con la diferencia
const editarDetalle = async (id_detalle, cantidad, precio_unitario) => {

    const [[detalle]] = await conexion.query(
        `SELECT subtotal, id_venta
         FROM detalle_ventas
         WHERE id_detalle = ?`,
        [id_detalle]
    );

    if (!detalle) {
        return { ok: false, status: 404, mensaje: 'Detalle no encontrado.' };
    }

    const nuevoSubtotal = cantidad * precio_unitario;
    const diferencia = nuevoSubtotal - detalle.subtotal;

    await conexion.query(
        `UPDATE detalle_ventas
         SET cantidad = ?, precio_unitario = ?, subtotal = ?
         WHERE id_detalle = ?`,
        [cantidad, precio_unitario, nuevoSubtotal, id_detalle]
    );

    await conexion.query(
        `UPDATE ventas
         SET total = total + ?
         WHERE id_venta = ?`,
        [diferencia, detalle.id_venta]
    );

    return { ok: true };

};

// Eliminar un detalle y restar su subtotal del total de la venta
const eliminarDetalle = async (id_detalle) => {

    const [[detalle]] = await conexion.query(
        `SELECT subtotal, id_venta
         FROM detalle_ventas
         WHERE id_detalle = ?`,
        [id_detalle]
    );

    if (!detalle) {
        return { ok: false, status: 404, mensaje: 'Detalle no encontrado.' };
    }

    await conexion.query(
        `DELETE FROM detalle_ventas
         WHERE id_detalle = ?`,
        [id_detalle]
    );

    await conexion.query(
        `UPDATE ventas
         SET total = total - ?
         WHERE id_venta = ?`,
        [detalle.subtotal, detalle.id_venta]
    );

    return { ok: true };

};

// Eliminar una venta completa (y sus detalles). Ventas no maneja soft delete
// porqueee la guía solo pide soft delete
// para Usuarios, Clientes, Categorías y Artículos y eso hice paps.
const eliminarVenta = async (id_venta) => {

    await conexion.query(
        `DELETE FROM detalle_ventas
         WHERE id_venta = ?`,
        [id_venta]
    );

    await conexion.query(
        `DELETE FROM ventas
         WHERE id_venta = ?`,
        [id_venta]
    );

};

// Recalcula el total de una venta sumando todos sus detalles 
const recalcularTotal = async (id_venta) => {

    await conexion.query(
        `UPDATE ventas
         SET total = (
            SELECT IFNULL(SUM(subtotal), 0)
            FROM detalle_ventas
            WHERE id_venta = ?
         )
         WHERE id_venta = ?`,
        [id_venta, id_venta]
    );

};

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerVentaPorId,
    agregarDetalle,
    obtenerDetallesPorVenta,
    editarDetalle,
    eliminarDetalle,
    eliminarVenta,
    recalcularTotal
};