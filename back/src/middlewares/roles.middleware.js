const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {

        const { rol } = req.usuario;

        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                mensaje: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

module.exports = verificarRol;