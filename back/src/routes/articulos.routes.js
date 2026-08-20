const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const verificarRol = require('../middlewares/roles.middleware');
const ROLES = require('../constants/roles');

const {obtenerArticulos, obtenerArticuloPorId, crearArticulo, actualizarArticulo, desactivarArticulo, activarArticulo} = require('../controllers/articulos.controller');

router.get('/', verificarToken,verificarRol(ROLES.ADMIN, ROLES.VENDEDOR), obtenerArticulos);
router.get('/:id', verificarToken , verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),obtenerArticuloPorId);  // Leer uno
router.post('/', verificarToken , verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),crearArticulo);           // Crear
router.put('/:id', verificarToken, verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),actualizarArticulo);    // Actualizar
router.patch('/:id/desactivar', verificarToken , verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),desactivarArticulo);   // Eliminar
router.patch('/:id/activar', verificarToken , verificarRol(ROLES.ADMIN, ROLES.VENDEDOR),activarArticulo);   // Activar


module.exports = router;