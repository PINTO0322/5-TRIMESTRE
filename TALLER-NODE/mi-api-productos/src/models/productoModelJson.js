const { leerDatos, escribirDatos } = require('../config/jsonDb');

const getAll = async () => {
    const productos = await leerDatos();
    return productos;
};

const getById = async (id) => {
    const productos = await leerDatos();
    return productos.find((p) => p.id === String(id)) || null;
};

const create = async (producto) => {
    if (!producto || typeof producto !== 'object' || Array.isArray(producto)) {
        const error = new Error('Se esperaba un objeto con nombre y precio');
        error.status = 400;
        throw error;
    }

    const { nombre, precio, stock } = producto;

    if (!nombre || precio === undefined) {
        const error = new Error('nombre y precio son obligatorios');
        error.status = 400;
        throw error;
    }

    const productos = await leerDatos();

    const nuevo = {
        id: Date.now().toString(),
        nombre,
        precio: Number(precio),
        stock: Number(stock ?? 0),
    };

    productos.push(nuevo);
    await escribirDatos(productos);

    return nuevo;
};

const update = async (id, datos) => {
    const productos = await leerDatos();
    const index = productos.findIndex((p) => p.id === String(id));

    if (index === -1) {
        return null;
    }

    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        const error = new Error('Se esperaba un objeto con los datos del producto');
        error.status = 400;
        throw error;
    }

    const actualizado = {
        ...productos[index],
        ...datos,
        id: productos[index].id,
    };

    productos[index] = actualizado;
    await escribirDatos(productos);

    return actualizado;
};

const remove = async (id) => {
    const productos = await leerDatos();
    const filtrados = productos.filter((p) => p.id !== String(id));

    if (filtrados.length === productos.length) {
        return false;
    }

    await escribirDatos(filtrados);
    return true;
};

module.exports = { getAll, getById, create, update, remove };