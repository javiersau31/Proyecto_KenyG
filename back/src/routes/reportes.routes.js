const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const ROLES = require('../constants/roles');


const {
    obtenerReportes,
    obtenerReportePorId,
    generarReporteVentas
} = require('../controllers/reportes.controller');

router.get('/', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerReportes);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerReportePorId);
router.post('/ventas', verificarToken,verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), generarReporteVentas);

module.exports = router;