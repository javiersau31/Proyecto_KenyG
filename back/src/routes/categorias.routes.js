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

router.get('/', verificarToken, verificarRol(ROLES.ADMIN),obtenerCategorias);
router.get('/:id', verificarToken, verificarRol(ROLES.ADMIN),obtenerCategoriaPorId);
router.post('/', verificarToken, verificarRol(ROLES.ADMIN),crearCategoria);
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN), actualizarCategoria);
router.patch('/:id/desactivar', verificarToken, verificarRol(ROLES.ADMIN),desactivarCategoria);
router.patch('/:id/activar', verificarToken, verificarRol(ROLES.ADMIN),activarCategoria);

module.exports = router;