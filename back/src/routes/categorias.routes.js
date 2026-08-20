const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const ROLES = require('../constants/roles');

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    desactivarCategoria,
    activarCategoria
} = require('../controllers/categorias.controller');

router.get('/', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerCategorias);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerCategoriaPorId);
router.post('/', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),crearCategoria);
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), actualizarCategoria);
router.patch('/:id/desactivar', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),desactivarCategoria);
router.patch('/:id/activar', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),activarCategoria);

module.exports = router;