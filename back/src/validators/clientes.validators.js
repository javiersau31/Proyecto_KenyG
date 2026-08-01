const MESSAGES = require('../constants/messages');

const validarCliente = (datos) => {

    let { nombre, direccion, telefono, correo } = datos;

    // Limpiar datos
    nombre = nombre?.trim();
    direccion = direccion?.trim() || null;
    telefono = telefono?.trim() || null;
    correo = correo?.trim().toLowerCase() || null;

    if (!nombre) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    if (correo) {
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        if (!correoValido) {
            return {
                valido: false,
                mensaje: 'El correo no tiene un formato válido.'
            };
        }
    }

    if (nombre.length > 100) {
        return {
            valido: false,
            mensaje: 'El nombre no puede exceder los 100 caracteres.'
        };
    }

    return {
        valido: true,
        datos: {
            nombre,
            direccion,
            telefono,
            correo
        }
    };

};

module.exports = {
    validarCliente
};