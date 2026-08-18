const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    obtenerReportes,
    obtenerReportePorId,
    generarReporteVentas
} = require('../controllers/reportes.controller');

router.get('/', verificarToken, obtenerReportes);
router.get('/:id', verificarToken, obtenerReportePorId);
router.post('/ventas', verificarToken, generarReporteVentas);

module.exports = router;