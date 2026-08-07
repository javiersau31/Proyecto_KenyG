const express = require('express');
const router = express.Router();
const db = require('../config/database');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/', verificarToken, async (req, res) => {
  try {
    const [categorias] = await db.query(
      'SELECT id_categoria, nombre FROM categorias WHERE activo = TRUE ORDER BY nombre ASC'
    );
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
});

router.post('/', verificarToken, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO categorias (nombre) VALUES (?)', [nombre.trim()]
    );
    res.status(201).json({ id_categoria: result.insertId, mensaje: 'Categoría creada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
});

module.exports = router;
