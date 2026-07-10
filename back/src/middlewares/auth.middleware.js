const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; 
    next();
  } catch (err) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
