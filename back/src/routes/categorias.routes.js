const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    desactivarCategoria,
    activarCategoria
} = require('../controllers/categorias.controller');

router.get('/', verificarToken, obtenerCategorias);
router.get('/:id', verificarToken, obtenerCategoriaPorId);
router.post('/', verificarToken, crearCategoria);
router.put('/:id', verificarToken, actualizarCategoria);
router.patch('/:id/desactivar', verificarToken, desactivarCategoria);
router.patch('/:id/activar', verificarToken, activarCategoria);

module.exports = router;