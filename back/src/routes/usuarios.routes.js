const express = require('express');
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    desactivarUsuario,
    activarUsuario
} = require('../controllers/usuarios.controller');

const verificarToken = require('../middlewares/auth.middleware');

router.get('/', verificarToken, obtenerUsuarios);
router.get('/:id', verificarToken, obtenerUsuarioPorId);
router.post('/', verificarToken, crearUsuario);
router.put('/:id', verificarToken, actualizarUsuario);
router.patch('/:id/desactivar', verificarToken, desactivarUsuario);
router.patch('/:id/activar', verificarToken, activarUsuario);

module.exports = router;