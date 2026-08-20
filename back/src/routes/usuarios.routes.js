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


router.get('/', verificarToken, verificarRol(ROLES.ADMIN,ROLES.VENDEDOR),obtenerUsuarios);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN,ROLES.VENDEDOR),obtenerUsuarioPorId);
router.post('/', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), crearUsuario);
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), actualizarUsuario);
router.patch('/:id/desactivar', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), desactivarUsuario);
router.patch('/:id/activar', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), activarUsuario);

module.exports = router;