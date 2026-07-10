const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');

const {obtenerArticulos, obtenerArticuloPorId, crearArticulo, actualizarArticulo, desactivarArticulo, activarArticulo} = require('../controllers/articulos.controller');

router.get('/', verificarToken, obtenerArticulos);
router.get('/:id', verificarToken , obtenerArticuloPorId);  // Leer uno
router.post('/', verificarToken , crearArticulo);           // Crear
router.put('/:id', verificarToken, actualizarArticulo);    // Actualizar
router.patch('/:id/desactivar', verificarToken , desactivarArticulo);   // Eliminar
router.patch('/:id/activar', verificarToken , activarArticulo);   // Activar


module.exports = router;