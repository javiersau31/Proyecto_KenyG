const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const ROLES = require('../constants/roles');

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    desactivarUsuario,
    activarUsuario
} = require('../controllers/usuarios.controller');


router.get('/', verificarToken, verificarRol(ROLES.ADMIN),obtenerUsuarios);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN),obtenerUsuarioPorId);
router.post('/', verificarToken, verificarRol(ROLES.ADMIN), crearUsuario);
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN), actualizarUsuario);
router.patch('/:id/desactivar', verificarToken, verificarRol(ROLES.ADMIN), desactivarUsuario);
router.patch('/:id/activar', verificarToken, verificarRol(ROLES.ADMIN), activarUsuario);

module.exports = router;