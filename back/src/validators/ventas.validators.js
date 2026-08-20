const MESSAGES = require('../constants/messages');

const validarVenta = (datos) => {

    const { id_cliente } = datos;

    const idCliente = Number(id_cliente);

    if (!id_cliente || Number.isNaN(idCliente) || idCliente <= 0) {
        return {
            valido: false,
            mensaje: 'El cliente es obligatorio.'
        };
    }

    return {
        valido: true,
        datos: {
            id_cliente: idCliente
        }
    };
};


const validarDetalleVenta = (datos) => {

    const {
        id_venta,
        id_articulo,
        cantidad
    } = datos;

    const idVenta = Number(id_venta);
    const idArticulo = Number(id_articulo);
    const cantidadNum = Number(cantidad);

    if (!id_venta || !id_articulo || !cantidad) {
        return {
            valido: false,
            mensaje: MESSAGES.DATOS_OBLIGATORIOS
        };
    }

    if (
        Number.isNaN(idVenta) ||
        Number.isNaN(idArticulo) ||
        Number.isNaN(cantidadNum)
    ) {
        return {
            valido: false,
            mensaje: 'Los datos de la venta deben ser numéricos.'
        };
    }

    if (idVenta <= 0 || idArticulo <= 0) {
        return {
            valido: false,
            mensaje: 'Los identificadores no son válidos.'
        };
    }

    if (cantidadNum <= 0) {
        return {
            valido: false,
            mensaje: 'La cantidad debe ser mayor a cero.'
        };
    }

    return {
        valido: true,
        datos: {
            id_venta: idVenta,
            id_articulo: idArticulo,
            cantidad: cantidadNum
        }
    };
};


module.exports = {
    validarVenta,
    validarDetalleVenta
};