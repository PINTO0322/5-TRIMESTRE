require('dotenv').config();

require('./src/config/sqliteDb');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const servidor = app.listen(PORT, () => {
    console.log(`API de productos con SQLite en http://localhost:${PORT}`);
});

servidor.on('error', error => {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exitCode = 1;
});