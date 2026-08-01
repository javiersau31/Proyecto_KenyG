const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    eliminarVenta,
    agregarDetalle,
    obtenerDetallesPorVenta,
    editarDetalle,
    eliminarDetalle,
    actualizarTotal
} = require('../controllers/ventas.controller');

// Ventas
router.get('/', verificarToken, obtenerVentas);
router.get('/:id', verificarToken, obtenerVentaPorId);
router.post('/', verificarToken, crearVenta);
router.delete('/:id', verificarToken, eliminarVenta);

// Detalle de venta
router.get('/:id_venta/detalle', verificarToken, obtenerDetallesPorVenta);
router.post('/detalle', verificarToken, agregarDetalle);
router.put('/detalle/:id_detalle', verificarToken, editarDetalle);
router.delete('/detalle/:id_detalle', verificarToken, eliminarDetalle);

// Esto se va a usar pa recalcular total desde el detalle no te borre tu detalle_ventas jaja
router.put('/:id_venta/actualizar-total', verificarToken, actualizarTotal);

module.exports = router;