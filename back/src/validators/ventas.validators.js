const MESSAGES = require('../constants/messages');

const validarVenta = (datos) => {

    const { id_cliente } = datos;

    if (!id_cliente || Number.isNaN(Number(id_cliente))) {
        return {
            valido: false,
            mensaje: 'El cliente es obligatorio.'
        };
    }

    return {
        valido: true,
        datos: {
            id_cliente: Number(id_cliente)
        }
    };

};

const validarDetalleVenta = (datos) => {

    const { id_venta, id_articulo, cantidad, precio_unitario } = datos;

    if (!id_venta || !id_articulo || !cantidad || !precio_unitario) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    const cantidadNum = Number(cantidad);
    const precioNum = Number(precio_unitario);

    if (Number.isNaN(cantidadNum) || Number.isNaN(precioNum)) {
        return {
            valido: false,
            mensaje: 'Cantidad y precio unitario deben ser numéricos.'
        };
    }

    if (cantidadNum <= 0 || precioNum <= 0) {
        return {
            valido: false,
            mensaje: 'Cantidad y precio unitario deben ser mayores a cero.'
        };
    }

    return {
        valido: true,
        datos: {
            id_venta: Number(id_venta),
            id_articulo: Number(id_articulo),
            cantidad: cantidadNum,
            precio_unitario: precioNum
        }
    };

};

module.exports = {
    validarVenta,
    validarDetalleVenta
};