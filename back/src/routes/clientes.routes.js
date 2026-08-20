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

router.get('/', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerClientes);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerClientePorId);
router.post('/', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), crearCliente);
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), actualizarCliente);
router.patch('/:id/desactivar', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), desactivarCliente);
router.patch('/:id/activar', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), activarCliente);

module.exports = router;