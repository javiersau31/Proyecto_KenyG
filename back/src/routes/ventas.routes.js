const express = require('express');

const router = express.Router();

const verificarToken =
    require('../middlewares/auth.middleware');

const verificarRol =
    require('../middlewares/roles.middleware');

const ROLES =
    require('../constants/roles');

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


// ======================================================
// VENTAS
// ======================================================

router.get(
    '/',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    obtenerVentas
);


router.get(
    '/:id',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    obtenerVentaPorId
);


router.post(
    '/',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    crearVenta
);


router.delete(
    '/:id',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    eliminarVenta
);


// ======================================================
// DETALLE DE VENTA
// ======================================================

router.get(
    '/:id_venta/detalle',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    obtenerDetallesPorVenta
);


router.post(
    '/detalle',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    agregarDetalle
);


router.put(
    '/detalle/:id_detalle',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    editarDetalle
);


router.delete(
    '/detalle/:id_detalle',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    eliminarDetalle
);


router.put(
    '/:id_venta/actualizar-total',
    verificarToken,
    verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),
    actualizarTotal
);


module.exports = router;