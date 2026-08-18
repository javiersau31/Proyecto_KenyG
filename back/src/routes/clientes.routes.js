const express = require('express');
const router = express.Router();

const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    desactivarCliente,
    activarCliente
} = require('../controllers/clientes.controller');

const verificarToken = require('../middlewares/auth.middleware');

router.get('/', verificarToken, obtenerClientes);
router.get('/:id', verificarToken, obtenerClientePorId);
router.post('/', verificarToken, crearCliente);
router.put('/:id', verificarToken, actualizarCliente);
router.patch('/:id/desactivar', verificarToken, desactivarCliente);
router.patch('/:id/activar', verificarToken, activarCliente);

module.exports = router;