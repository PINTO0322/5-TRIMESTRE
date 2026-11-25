require('dotenv').config();

const app = require('./src/app');
const { pool, initDB } = require('./src/config/mysqlDb');

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
    await initDB();

    const servidor = app.listen(PORT, () => {
        console.log(`API de productos con MySQL en http://localhost:${PORT}`);
    });

    servidor.on('error', async (error) => {
        console.error('No se pudo iniciar el servidor:', error.message);
        await pool.end();
        process.exitCode = 1;
    });
};

iniciar().catch(async (error) => {
    console.error('Error al conectar con MySQL:', error.message);
    await pool.end();
    process.exitCode = 1;
});