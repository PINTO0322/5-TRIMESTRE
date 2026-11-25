const Producto = require('../models/productoModelMysql');

const listar = async (req, res) => {
    res.json(await Producto.getAll());
};

const obtener = async (req, res) => {
    const producto = await Producto.getById(req.params.id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
};

const crear = async (req, res) => {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
};

const actualizar = async (req, res) => {
    const producto = await Producto.update(req.params.id, req.body);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
};

const eliminar = async (req, res) => {
    const eliminado = await Producto.remove(req.params.id);

    if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(204).end();
};

module.exports = { listar, obtener, crear, actualizar, eliminar };