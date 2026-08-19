const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const ROLES = require('../constants/roles');

const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    desactivarCliente,
    activarCliente
} = require('../controllers/clientes.controller');
;

router.get('/', verificarToken, verificarRol(ROLES.ADMIN),obtenerClientes);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN),obtenerClientePorId);
router.post('/', verificarToken, verificarRol(ROLES.ADMIN), crearCliente);
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN), actualizarCliente);
router.patch('/:id/desactivar', verificarToken, verificarRol(ROLES.ADMIN), desactivarCliente);
router.patch('/:id/activar', verificarToken, verificarRol(ROLES.ADMIN), activarCliente);

module.exports = router;