const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const clientesRoutes = require('./routes/clientes.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const articulosRoutes = require('./routes/articulos.routes');
const ventasRoutes = require('./routes/ventas.routes');
const reportesRoutes = require('./routes/reportes.routes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reportes', reportesRoutes);

module.exports = app;