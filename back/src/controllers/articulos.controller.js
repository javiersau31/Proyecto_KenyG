const db = require('../config/database');
const MESSAGES = require('../constants/messages');
const { validarArticulo } = require('../validators/articulos.validators');

// Obtener todos los articulos
exports.obtenerArticulos = async (req, res) => {
    try {
        const [articulos] = await db.query(
            `SELECT
                a.id_articulo,
                a.nombre,
                a.descripcion,
                a.precio,
                a.existencia,
                a.id_categoria,
                c.nombre AS categoria
            FROM articulos a
            INNER JOIN categorias c
                ON a.id_categoria = c.id_categoria
            WHERE a.activo = TRUE
            ORDER BY a.nombre ASC`
        );

        res.json(articulos);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener los articulos.'
        });
    }
};

// Obtener un articulo por ID
exports.obtenerArticuloPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({ mensaje: 'El ID del artículo es inválido.' });
        }

        const [articulos] = await db.query(
            `SELECT
                id_articulo,
                nombre,
                descripcion,
                precio,
                existencia,
                id_categoria
            FROM articulos
            WHERE id_articulo = ?
            AND activo = TRUE`,
            [id]
        );

        if (articulos.length === 0) {
            return res.status(404).json({ mensaje: 'Articulo no encontrado.' });
        }

        res.json(articulos[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener el articulo.' });
    }
};

// Crear un nuevo articulo
exports.crearArticulo = async (req, res) => {
    try {
        const validacion = validarArticulo(req.body);

        if (!validacion.valido) {
            return res.status(400).json({ mensaje: validacion.mensaje });
        }

        const { nombre, descripcion, precio, existencia, id_categoria } = validacion.datos;

        const [categoria] = await db.query(
            `SELECT id_categoria FROM categorias WHERE id_categoria = ? AND activo = TRUE`,
            [id_categoria]
        );

        if (categoria.length === 0) {
            return res.status(404).json({ mensaje: 'La categoría seleccionada no existe.' });
        }

        const [articulo] = await db.query(
            `SELECT id_articulo FROM articulos WHERE LOWER(nombre)=LOWER(?) AND activo = TRUE`,
            [nombre]
        );

        if (articulo.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un artículo con ese nombre.' });
        }

        const [resultado] = await db.query(
            `INSERT INTO articulos (nombre, descripcion, precio, existencia, id_categoria) VALUES (?, ?, ?, ?, ?)`,
            [nombre, descripcion, precio, existencia, id_categoria]
        );

        return res.status(201).json({
            mensaje: 'Artículo creado correctamente.',
            id_articulo: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: MESSAGES.ERROR_INTERNO });
    }
};

// Actualizar un artículo
exports.actualizarArticulo = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({ mensaje: 'ID de artículo inválido.' });
        }

        const validacion = validarArticulo(req.body);

        if (!validacion.valido) {
            return res.status(400).json({ mensaje: validacion.mensaje });
        }

        const { nombre, descripcion, precio, existencia, id_categoria } = validacion.datos;

        const [articuloActual] = await db.query(
            `SELECT id_articulo FROM articulos WHERE id_articulo = ? AND activo = TRUE`,
            [id]
        );

        if (articuloActual.length === 0) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado.' });
        }

        const [categoria] = await db.query(
            `SELECT id_categoria FROM categorias WHERE id_categoria = ? AND activo = TRUE`,
            [id_categoria]
        );

        if (categoria.length === 0) {
            return res.status(404).json({ mensaje: 'La categoría seleccionada no existe.' });
        }

        const [articuloDuplicado] = await db.query(
            `SELECT id_articulo FROM articulos WHERE LOWER(nombre) = LOWER(?) AND id_articulo <> ? AND activo = TRUE`,
            [nombre, id]
        );

        if (articuloDuplicado.length > 0) {
            return res.status(400).json({ mensaje: 'Ya existe un artículo con ese nombre.' });
        }

        await db.query(
            `UPDATE articulos SET nombre = ?, descripcion = ?, precio = ?, existencia = ?, id_categoria = ? WHERE id_articulo = ?`,
            [nombre, descripcion, precio, existencia, id_categoria, id]
        );

        return res.status(200).json({ mensaje: 'Artículo actualizado correctamente.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: MESSAGES.ERROR_INTERNO });
    }
};

// Desactivar un artículo (soft delete)
exports.desactivarArticulo = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({ mensaje: 'ID de artículo inválido.' });
        }

        await db.query(`UPDATE articulos SET activo = FALSE WHERE id_articulo = ?`, [id]);

        return res.json({ mensaje: 'Artículo desactivado correctamente.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: MESSAGES.ERROR_INTERNO });
    }
};

// Activar un artículo
exports.activarArticulo = async (req, res) => {
    try {
        const { id } = req.params;

        if (Number.isNaN(Number(id))) {
            return res.status(400).json({ mensaje: 'ID de artículo invalido.' });
        }

        await db.query(`UPDATE articulos SET activo = TRUE WHERE id_articulo = ?`, [id]);

        res.json({ mensaje: 'Artículo activado correctamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al activar el artículo.' });
    }
};
