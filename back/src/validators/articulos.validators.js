const MESSAGES = require('../constants/messages');

const validarArticulo = (datos) => {

    let {
        nombre,
        descripcion,
        precio,
        existencia,
        id_categoria
    } = datos;

    // Limpiar datos
    nombre = nombre?.trim();
    descripcion = descripcion?.trim() || '';

    // Campos obligatorios
    if (
        !nombre ||
        precio === undefined ||
        existencia === undefined ||
        id_categoria === undefined
    ) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    // Tipos de dato
    precio = Number(precio);
    existencia = Number(existencia);
    id_categoria = Number(id_categoria);

    if (Number.isNaN(precio)) {
        return {
            valido: false,
            mensaje: 'El precio debe ser un número.'
        };
    }

    if (Number.isNaN(existencia)) {
        return {
            valido: false,
            mensaje: 'La existencia debe ser un número.'
        };
    }

    if (Number.isNaN(id_categoria)) {
        return {
            valido: false,
            mensaje: 'La categoría es inválida.'
        };
    }

    // Rangos
    if (precio <= 0) {
        return {
            valido: false,
            mensaje: 'El precio debe ser mayor a cero.'
        };
    }

    if (existencia < 0) {
        return {
            valido: false,
            mensaje: 'La existencia no puede ser negativa.'
        };
    }

    // Longitudes
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
            descripcion,
            precio,
            existencia,
            id_categoria
        }
    };

};

module.exports = {
    validarArticulo
};

