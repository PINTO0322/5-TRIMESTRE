const express = require('express');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

app.use(express.json());
app.use('/api/productos', productoRoutes);

app.use((error, req, res, next) => {
    const estado = error.status || 500;

    if (estado >= 500) {
        console.error(error);
    }

    res.status(estado).json({
        error: estado >= 500 ? 'Error interno del servidor' : error.message
    });
});

module.exports = app;