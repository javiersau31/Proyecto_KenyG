const MESSAGES = require('../constants/messages');

const validarCategoria = (datos) => {

    let { nombre, descripcion } = datos;

    // Limpiar datos
    nombre = nombre?.trim();
    descripcion = descripcion?.trim() || null;

    // Campos obligatorios
    if (!nombre) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    if (nombre.length > 100) {
        return {
            valido: false,
            mensaje: 'El nombre no puede exceder los 100 caracteres.'
        };
    }

    if (descripcion && descripcion.length > 255) {
        return {
            valido: false,
            mensaje: 'La descripción no puede exceder los 255 caracteres.'
        };
    }

    return {
        valido: true,
        datos: {
            nombre,
            descripcion
        }
    };

};

module.exports = {
    validarCategoria
};