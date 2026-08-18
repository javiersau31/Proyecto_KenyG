const conexion = require('../config/database');
const MESSAGES = require('../constants/messages');
const { validarRangoFechas } = require('../validators/reportes.validators');
const reportesService = require('../services/reportes.service');

// historial de reportes generados
exports.obtenerReportes = async (req, res) => {

    try {

        const [reportes] = await conexion.query(
            `SELECT
                r.id_reporte,
                r.nombre,
                r.tipo,
                r.fecha_generacion,
                u.nombre AS generado_por
            FROM reportes r
            INNER JOIN usuarios u
                ON r.generado_por = u.id_usuario
            ORDER BY r.fecha_generacion DESC`
        );

        res.json(reportes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Obtener un registro de reporte por ID 
exports.obtenerReportePorId = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID del reporte es inválido.'
            });
        }

        const [reportes] = await conexion.query(
            `SELECT
                r.id_reporte,
                r.nombre,
                r.tipo,
                r.fecha_generacion,
                u.nombre AS generado_por
            FROM reportes r
            INNER JOIN usuarios u
                ON r.generado_por = u.id_usuario
            WHERE r.id_reporte = ?`,
            [id]
        );

        if (reportes.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        res.json(reportes[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Generar un reporte de ventas por rango de fechas
exports.generarReporteVentas = async (req, res) => {

    try {

        const validacion = validarRangoFechas(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { fecha_inicio, fecha_fin } = validacion.datos;

        // req.usuario lo agrega el middleware verificarToken (auth.middleware.js)
        const idUsuario = req.usuario.id_usuario;

        // Lógica de negocio  (service)
        const reporteCalculado = await reportesService.calcularReporteVentas(
            fecha_inicio,
            fecha_fin
        );

        const nombreReporte = `Ventas ${fecha_inicio} a ${fecha_fin}`;

        // registro histórico de que este reporte fue generado
        const [resultado] = await conexion.query(
            `INSERT INTO reportes (nombre, tipo, generado_por)
             VALUES (?, ?, ?)`,
            [nombreReporte, 'ventas', idUsuario]
        );

        return res.status(201).json({
            mensaje: 'Reporte de ventas generado correctamente.',
            id_reporte: resultado.insertId,
            reporte: reporteCalculado
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};