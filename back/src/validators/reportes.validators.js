const MESSAGES = require('../constants/messages');

// Valida formato YYYY-MM-DD
const formatoFechaValido = (fecha) => /^\d{4}-\d{2}-\d{2}$/.test(fecha);

const validarRangoFechas = (datos) => {

    const { fecha_inicio, fecha_fin } = datos;

    if (!fecha_inicio || !fecha_fin) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    if (!formatoFechaValido(fecha_inicio) || !formatoFechaValido(fecha_fin)) {
        return {
            valido: false,
            mensaje: 'Las fechas deben tener el formato YYYY-MM-DD.'
        };
    }

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
        return {
            valido: false,
            mensaje: 'Las fechas ingresadas no son válidas.'
        };
    }

    if (inicio > fin) {
        return {
            valido: false,
            mensaje: 'La fecha de inicio no puede ser mayor a la fecha fin.'
        };
    }

    return {
        valido: true,
        datos: {
            fecha_inicio,
            fecha_fin
        }
    };

};

module.exports = {
    validarRangoFechas
};