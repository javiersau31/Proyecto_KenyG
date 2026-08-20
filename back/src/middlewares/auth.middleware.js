const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: 'Token no proporcionado'
        });
    }

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            mensaje: 'Formato de token inválido'
        });
    }

    try {

        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = payload;

        next();

    } catch (err) {

        console.error('Error JWT:', err.message);

        return res.status(403).json({
            mensaje: 'Token inválido o expirado'
        });
    }
};

module.exports = verificarToken;