const { pool } = require('../config/mysqlDb');

const validar = (producto) => {
    if (!producto || typeof producto !== 'object' || Array.isArray(producto)) {
        const error = new Error('Se esperaba un objeto con nombre y precio');
        error.status = 400;
        throw error;
    }

    if (!producto.nombre || producto.precio === undefined) {
        const error = new Error('nombre y precio son obligatorios');
        error.status = 400;
        throw error;
    }
};

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.execute(
        'SELECT * FROM productos WHERE id = ?',
        [id]
    );

    return rows[0] || null;
};

const create = async (producto) => {
    validar(producto);

    const [result] = await pool.execute(
        'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
        [producto.nombre, producto.precio, producto.stock ?? 0]
    );

    return getById(result.insertId);
};

const update = async (id, datos) => {
    const existente = await getById(id);

    if (!existente) {
        return null;
    }

    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        const error = new Error('Se esperaba un objeto con los datos del producto');
        error.status = 400;
        throw error;
    }

    const actualizado = { ...existente, ...datos };
    validar(actualizado);

    await pool.execute(
        'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
        [
            actualizado.nombre,
            actualizado.precio,
            actualizado.stock,
            id,
        ]
    );

    return getById(id);
};

const remove = async (id) => {
    const [result] = await pool.execute(
        'DELETE FROM productos WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };