const conexion = require('../config/database');
const MESSAGES = require('../constants/messages');
const { validarCategoria } = require('../validators/categorias.validators');

// Obtener todas las categorías activas
exports.obtenerCategorias = async (req, res) => {

    try {

        const [categorias] = await conexion.query(
            `SELECT
                id_categoria,
                nombre,
                descripcion
            FROM categorias
            WHERE activo = TRUE
            ORDER BY nombre ASC`
        );

        res.json(categorias);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID de la categoría es inválido.'
            });
        }

        const [categorias] = await conexion.query(
            `SELECT
                id_categoria,
                nombre,
                descripcion
            FROM categorias
            WHERE id_categoria = ?
            AND activo = TRUE`,
            [id]
        );

        if (categorias.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        res.json(categorias[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {

    try {

        const validacion = validarCategoria(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { nombre, descripcion } = validacion.datos;

        // Verificar nombre repetido
        const [categoriaExistente] = await conexion.query(
            `SELECT id_categoria
             FROM categorias
             WHERE LOWER(nombre) = LOWER(?)
             AND activo = TRUE`,
            [nombre]
        );

        if (categoriaExistente.length > 0) {
            return res.status(400).json({
                mensaje: 'Ya existe una categoría con ese nombre.'
            });
        }

        const [resultado] = await conexion.query(
            `INSERT INTO categorias (nombre, descripcion)
             VALUES (?, ?)`,
            [nombre, descripcion]
        );

        return res.status(201).json({
            mensaje: 'Categoría creada correctamente.',
            id_categoria: resultado.insertId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID de la categoría es inválido.'
            });
        }

        const validacion = validarCategoria(req.body);

        if (!validacion.valido) {
            return res.status(400).json({
                mensaje: validacion.mensaje
            });
        }

        const { nombre, descripcion } = validacion.datos;

        // Verificar que la categoría exista
        const [categoriaActual] = await conexion.query(
            `SELECT id_categoria
             FROM categorias
             WHERE id_categoria = ?
             AND activo = TRUE`,
            [id]
        );

        if (categoriaActual.length === 0) {
            return res.status(404).json({
                mensaje: MESSAGES.NO_ENCONTRADO
            });
        }

        // Verificar nombre duplicado en otra categoría
        const [categoriaDuplicada] = await conexion.query(
            `SELECT id_categoria
             FROM categorias
             WHERE LOWER(nombre) = LOWER(?)
             AND id_categoria <> ?
             AND activo = TRUE`,
            [nombre, id]
        );

        if (categoriaDuplicada.length > 0) {
            return res.status(400).json({
                mensaje: 'Ya existe una categoría con ese nombre.'
            });
        }

        await conexion.query(
            `UPDATE categorias
             SET nombre = ?, descripcion = ?
             WHERE id_categoria = ?`,
            [nombre, descripcion, id]
        );

        return res.status(200).json({
            mensaje: 'Categoría actualizada correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Desactivar una categoría (soft delete ajale de nuevo)
exports.desactivarCategoria = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID de la categoría es inválido.'
            });
        }

        // Evitar desactivar una categoría que aún tiene artículos activos
        const [articulosAsociados] = await conexion.query(
            `SELECT id_articulo
             FROM articulos
             WHERE id_categoria = ?
             AND activo = TRUE
             LIMIT 1`,
            [id]
        );

        if (articulosAsociados.length > 0) {
            return res.status(400).json({
                mensaje: 'No se puede desactivar: hay artículos activos en esta categoría.'
            });
        }

        await conexion.query(
            `UPDATE categorias
             SET activo = FALSE
             WHERE id_categoria = ?`,
            [id]
        );

        return res.json({
            mensaje: 'Categoría desactivada correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};

// Activar una categoría
exports.activarCategoria = async (req, res) => {

    try {

        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({
                mensaje: 'El ID de la categoría es inválido.'
            });
        }

        await conexion.query(
            `UPDATE categorias
             SET activo = TRUE
             WHERE id_categoria = ?`,
            [id]
        );

        return res.json({
            mensaje: 'Categoría activada correctamente.'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensaje: MESSAGES.ERROR_INTERNO
        });

    }

};