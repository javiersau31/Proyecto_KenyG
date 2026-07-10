const express = require('express');
const router = express.Router();

const{obtenerClientes, obtenerClientePorId, crearCliente, actualizarCliente, eliminarCliente} = require('../controllers/clientes.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/',verificarToken ,obtenerClientes);
router.get('/:id',verificarToken ,obtenerClientePorId);
router.post('/',verificarToken ,crearCliente);
router.put('/:id',verificarToken ,actualizarCliente);
router.delete('/:id',verificarToken ,eliminarCliente);

module.exports = router;