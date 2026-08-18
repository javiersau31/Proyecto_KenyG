const conexion = require('../config/database');

// Calcula el resumen de ventas dentro de un rango de fechas :) no lo hice tan elaborado pero si ocupa más cosas me dices
const calcularReporteVentas = async (fechaInicio, fechaFin) => {

    // Detalle de ventas dentro del rango
    const [ventas] = await conexion.query(
        `SELECT
            v.id_venta,
            v.fecha,
            v.total,
            c.nombre AS cliente,
            u.nombre AS vendedor
        FROM ventas v
        INNER JOIN clientes c
            ON v.id_cliente = c.id_cliente
        INNER JOIN usuarios u
            ON v.id_usuario = u.id_usuario
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        ORDER BY v.fecha ASC`,
        [fechaInicio, fechaFin]
    );

    // Totales generales del periodo
    const [[totales]] = await conexion.query(
        `SELECT
            COUNT(*) AS total_ventas,
            IFNULL(SUM(total), 0) AS monto_total
        FROM ventas
        WHERE DATE(fecha) BETWEEN ? AND ?`,
        [fechaInicio, fechaFin]
    );

    // Artículos más vendidos en el periodo
    const [articulosMasVendidos] = await conexion.query(
        `SELECT
            a.nombre AS articulo,
            SUM(dv.cantidad) AS cantidad_vendida,
            SUM(dv.subtotal) AS monto_generado
        FROM detalle_ventas dv
        INNER JOIN ventas v
            ON dv.id_venta = v.id_venta
        INNER JOIN articulos a
            ON dv.id_articulo = a.id_articulo
        WHERE DATE(v.fecha) BETWEEN ? AND ?
        GROUP BY a.id_articulo, a.nombre
        ORDER BY cantidad_vendida DESC
        LIMIT 5`,
        [fechaInicio, fechaFin]
    );

    return {
        periodo: {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
        },
        resumen: {
            total_ventas: totales.total_ventas,
            monto_total: totales.monto_total
        },
        articulos_mas_vendidos: articulosMasVendidos,
        ventas
    };

};

module.exports = {
    calcularReporteVentas
};