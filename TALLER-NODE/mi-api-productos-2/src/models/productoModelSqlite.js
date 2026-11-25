const db = require('../config/sqliteDb');

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
    return db.prepare('SELECT * FROM productos').all();
};

const getById = async (id) => {
    return db.prepare('SELECT * FROM productos WHERE id = ?').get(id) || null;
};

const create = async (producto) => {
    validar(producto);

    const stmt = db.prepare(
        'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)'
    );

    const info = stmt.run(
        producto.nombre,
        producto.precio,
        producto.stock ?? 0
    );

    return getById(info.lastInsertRowid);
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

    db.prepare(`
        UPDATE productos
        SET nombre = ?, precio = ?, stock = ?
        WHERE id = ?
    `).run(
        actualizado.nombre,
        actualizado.precio,
        actualizado.stock,
        id
    );

    return getById(id);
};

const remove = async (id) => {
    const info = db.prepare('DELETE FROM productos WHERE id = ?').run(id);
    return info.changes > 0;
};

module.exports = { getAll, getById, create, update, remove };