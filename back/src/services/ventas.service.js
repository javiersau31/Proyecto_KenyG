const conexion = require('../config/database');


// ======================================================
// CREAR VENTA
// ======================================================

const crearVenta = async (id_cliente, id_usuario) => {

    const [resultado] = await conexion.query(
        `INSERT INTO ventas (id_cliente, id_usuario)
         VALUES (?, ?)`,
        [id_cliente, id_usuario]
    );

    return resultado.insertId;
};


// ======================================================
// OBTENER TODAS LAS VENTAS
// ======================================================

const obtenerVentas = async () => {

    const [ventas] = await conexion.query(
        `SELECT
            v.id_venta,
            DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i') AS fecha,
            v.total,
            v.id_cliente,
            v.id_usuario,
            c.nombre AS nombre_cliente
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        ORDER BY v.fecha DESC`
    );

    return ventas;
};


// ======================================================
// OBTENER VENTA POR ID
// ======================================================

const obtenerVentaPorId = async (id_venta) => {

    const [ventas] = await conexion.query(
        `SELECT
            v.id_venta,
            DATE_FORMAT(v.fecha, '%Y-%m-%d %H:%i') AS fecha,
            v.total,
            v.id_cliente,
            v.id_usuario,
            c.nombre AS nombre_cliente
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        WHERE v.id_venta = ?`,
        [id_venta]
    );

    return ventas[0] || null;
};


// ======================================================
// AGREGAR DETALLE
// ======================================================

const agregarDetalle = async (datos) => {

    const {
        id_venta,
        id_articulo,
        cantidad
    } = datos;

    // =========================
    // Verificar que la venta exista
    // =========================

    const [ventaRows] = await conexion.query(
        `SELECT id_venta
         FROM ventas
         WHERE id_venta = ?`,
        [id_venta]
    );

    if (ventaRows.length === 0) {
        return {
            ok: false,
            status: 404,
            mensaje: 'La venta no existe.'
        };
    }

    // =========================
    // Obtener artículo y precio
    // =========================

    const [articuloRows] = await conexion.query(
        `SELECT
            id_articulo,
            nombre,
            precio,
            existencia
         FROM articulos
         WHERE id_articulo = ?
         AND activo = TRUE`,
        [id_articulo]
    );

    if (articuloRows.length === 0) {
        return {
            ok: false,
            status: 404,
            mensaje: 'Artículo no encontrado.'
        };
    }

    const articulo = articuloRows[0];

    const existenciaActual = Number(articulo.existencia);
    const precioUnitario = Number(articulo.precio);

    // =========================
    // Verificar stock
    // =========================

    if (existenciaActual < cantidad) {
        return {
            ok: false,
            status: 400,
            mensaje: `Stock insuficiente. Existencia disponible: ${existenciaActual}.`
        };
    }

    // =========================
    // Calcular subtotal
    // =========================

    const subtotal = cantidad * precioUnitario;

    // =========================
    // Insertar detalle
    // =========================

    await conexion.query(
        `INSERT INTO detalle_ventas
        (
            id_venta,
            id_articulo,
            cantidad,
            precio_unitario,
            subtotal
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            id_venta,
            id_articulo,
            cantidad,
            precioUnitario,
            subtotal
        ]
    );

    // =========================
    // Descontar stock
    // =========================

    await conexion.query(
        `UPDATE articulos
         SET existencia = existencia - ?
         WHERE id_articulo = ?`,
        [
            cantidad,
            id_articulo
        ]
    );

    // =========================
    // Actualizar total
    // =========================

    await conexion.query(
        `UPDATE ventas
         SET total = total + ?
         WHERE id_venta = ?`,
        [
            subtotal,
            id_venta
        ]
    );

    return {
        ok: true,
        precio_unitario: precioUnitario,
        subtotal
    };
};

// ======================================================
// OBTENER DETALLES DE UNA VENTA
// ======================================================

const obtenerDetallesPorVenta = async (id_venta) => {

    const [detalles] = await conexion.query(
        `SELECT
            d.id_detalle,
            d.id_venta,
            d.id_articulo,
            a.nombre AS nombre_articulo,
            d.cantidad,
            d.precio_unitario,
            d.subtotal
        FROM detalle_ventas d
        INNER JOIN articulos a
            ON d.id_articulo = a.id_articulo
        WHERE d.id_venta = ?
        ORDER BY d.id_detalle ASC`,
        [id_venta]
    );

    return detalles;
};


// ======================================================
// EDITAR DETALLE
// ======================================================


const editarDetalle = async (id_detalle, cantidad) => {

    // =========================
    // Obtener detalle actual
    // =========================

    const [[detalle]] = await conexion.query(
        `SELECT
            id_detalle,
            id_venta,
            id_articulo,
            cantidad,
            precio_unitario
         FROM detalle_ventas
         WHERE id_detalle = ?`,
        [id_detalle]
    );

    if (!detalle) {
        return {
            ok: false,
            status: 404,
            mensaje: 'Detalle no encontrado.'
        };
    }

    const cantidadAnterior = Number(detalle.cantidad);
    const cantidadNueva = Number(cantidad);

    // =========================
    // Diferencia de stock
    // =========================

    const diferencia = cantidadNueva - cantidadAnterior;

    // =========================
    // Obtener existencia actual
    // =========================

    const [[articulo]] = await conexion.query(
        `SELECT
            existencia,
            activo
         FROM articulos
         WHERE id_articulo = ?`,
        [detalle.id_articulo]
    );

    if (!articulo || !articulo.activo) {
        return {
            ok: false,
            status: 404,
            mensaje: 'El artículo ya no está disponible.'
        };
    }

    const existenciaActual = Number(articulo.existencia);

    // =========================
    // Verificar stock
    // =========================

    if (diferencia > 0 && existenciaActual < diferencia) {
        return {
            ok: false,
            status: 400,
            mensaje: `Stock insuficiente. Existencia disponible: ${existenciaActual}.`
        };
    }

    // =========================
    // Actualizar detalle
    // =========================

    const nuevoSubtotal =
        cantidadNueva * Number(detalle.precio_unitario);

    await conexion.query(
        `UPDATE detalle_ventas
         SET cantidad = ?,
             subtotal = ?
         WHERE id_detalle = ?`,
        [
            cantidadNueva,
            nuevoSubtotal,
            id_detalle
        ]
    );

    // =========================
    // Ajustar stock
    // =========================

    await conexion.query(
        `UPDATE articulos
         SET existencia = existencia - ?
         WHERE id_articulo = ?`,
        [
            diferencia,
            detalle.id_articulo
        ]
    );

    // =========================
    // Actualizar total
    // =========================

    const diferenciaTotal =
        nuevoSubtotal - (
            cantidadAnterior * Number(detalle.precio_unitario)
        );

    await conexion.query(
        `UPDATE ventas
         SET total = total + ?
         WHERE id_venta = ?`,
        [
            diferenciaTotal,
            detalle.id_venta
        ]
    );

    return {
        ok: true
    };
};
// ======================================================
// ELIMINAR DETALLE
// ======================================================

const eliminarDetalle = async (id_detalle) => {

    // =========================
    // Obtener información del detalle
    // =========================

    const [[detalle]] = await conexion.query(
        `SELECT
            id_detalle,
            id_venta,
            id_articulo,
            cantidad,
            subtotal
         FROM detalle_ventas
         WHERE id_detalle = ?`,
        [id_detalle]
    );

    if (!detalle) {
        return {
            ok: false,
            status: 404,
            mensaje: 'Detalle no encontrado.'
        };
    }

    // =========================
    // Devolver stock
    // =========================

    await conexion.query(
        `UPDATE articulos
         SET existencia = existencia + ?
         WHERE id_articulo = ?`,
        [
            detalle.cantidad,
            detalle.id_articulo
        ]
    );

    // =========================
    // Eliminar detalle
    // =========================

    await conexion.query(
        `DELETE FROM detalle_ventas
         WHERE id_detalle = ?`,
        [id_detalle]
    );

    // =========================
    // Actualizar total
    // =========================

    await conexion.query(
        `UPDATE ventas
         SET total = total - ?
         WHERE id_venta = ?`,
        [
            detalle.subtotal,
            detalle.id_venta
        ]
    );

    return {
        ok: true
    };
};
// ======================================================
// ELIMINAR VENTA COMPLETA
// ======================================================

const eliminarVenta = async (id_venta) => {

    // Obtener todos los detalles de la venta
    const [detalles] = await conexion.query(
        `SELECT
            id_articulo,
            cantidad
         FROM detalle_ventas
         WHERE id_venta = ?`,
        [id_venta]
    );

    // Devolver el stock de cada artículo
    for (const detalle of detalles) {

        await conexion.query(
            `UPDATE articulos
             SET existencia = existencia + ?
             WHERE id_articulo = ?`,
            [
                detalle.cantidad,
                detalle.id_articulo
            ]
        );
    }

    // Eliminar detalles
    await conexion.query(
        `DELETE FROM detalle_ventas
         WHERE id_venta = ?`,
        [id_venta]
    );

    // Eliminar venta
    const [resultado] = await conexion.query(
        `DELETE FROM ventas
         WHERE id_venta = ?`,
        [id_venta]
    );

    if (resultado.affectedRows === 0) {
        return {
            ok: false,
            status: 404,
            mensaje: 'Venta no encontrada.'
        };
    }

    return {
        ok: true
    };
};

// ======================================================
// RECALCULAR TOTAL
// ======================================================

const recalcularTotal = async (id_venta) => {

    await conexion.query(
        `UPDATE ventas
         SET total = (
             SELECT IFNULL(SUM(subtotal), 0)
             FROM detalle_ventas
             WHERE id_venta = ?
         )
         WHERE id_venta = ?`,
        [
            id_venta,
            id_venta
        ]
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