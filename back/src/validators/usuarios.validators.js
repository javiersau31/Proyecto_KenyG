const MESSAGES = require('../constants/messages');

// esCreacion = true exige contrasena osea obligatoria (para crear) en update es opcional
const validarUsuario = (datos, esCreacion = true) => {

    let {
        nombre,
        correo,
        telefono,
        contrasena,
        id_rol
    } = datos;

    // Limpiar datos
    nombre = nombre?.trim();
    correo = correo?.trim().toLowerCase();
    telefono = telefono?.trim() || null;

    // Campos obligatorios
    if (
        !nombre ||
        !correo ||
        id_rol === undefined ||
        (esCreacion && !contrasena)
    ) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    // Formato de correo (validación simple)
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!correoValido) {
        return {
            valido: false,
            mensaje: 'El correo no tiene un formato válido.'
        };
    }

    id_rol = Number(id_rol);

    if (Number.isNaN(id_rol)) {
        return {
            valido: false,
            mensaje: 'El rol es inválido.'
        };
    }

    if (nombre.length > 150) {
        return {
            valido: false,
            mensaje: 'El nombre no puede exceder los 150 caracteres.'
        };
    }

    if (contrasena && contrasena.length < 6) {
        return {
            valido: false,
            mensaje: 'La contraseña debe tener al menos 6 caracteres.'
        };
    }

    return {
        valido: true,
        datos: {
            nombre,
            correo,
            telefono,
            contrasena,
            id_rol
        }
    };

};

module.exports = {
    validarUsuario
};