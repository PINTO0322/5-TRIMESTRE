require('dotenv').config();

const app = require('./src/app');
const { inicializarDB } = require('./src/config/jsonDb');

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
    await inicializarDB();

    const servidor = app.listen(PORT, () => {
        console.log(`API de productos con JSON en http://localhost:${PORT}`);
    });

    servidor.on('error', error => {
        console.error('No se pudo iniciar el servidor:', error.message);
        process.exitCode = 1;
    });
};

iniciar().catch(error => {
    console.error('Error al inicializar JSON:', error.message);
    process.exitCode = 1;
});