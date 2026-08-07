const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.routes');
const articulosRoutes = require('./routes/articulos.routes');
const clientesRoutes = require('./routes/cliente.routes');
const ventasRoutes = require('./routes/ventas.routes');
const categoriasRoutes = require('./routes/categorias.routes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/categorias', categoriasRoutes);

module.exports = app;