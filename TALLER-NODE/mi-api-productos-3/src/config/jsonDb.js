const fs = require('fs/promises');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'productos.json');

const asegurarArchivo = async () => {
    try {
        const stats = await fs.stat(filePath);

        if (stats.size === 0) {
            await fs.writeFile(filePath, '[]', 'utf-8');
        }
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;

        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, '[]', 'utf-8');
    }
};

const leerDatos = async () => {
    await asegurarArchivo();

    const buffer = await fs.readFile(filePath);
    let texto = buffer.toString('utf-8');

    if (texto.charCodeAt(0) === 0xfeff) {
        texto = texto.slice(1);
    }

    if (texto.trim() === '') {
        return [];
    }

    return JSON.parse(texto);
};

const escribirDatos = async (datos) => {
    await fs.writeFile(filePath, JSON.stringify(datos, null, 2), 'utf-8');
};

const inicializarDB = async () => {
    await asegurarArchivo();
    console.log('JSON DB lista en:', filePath);
};

module.exports = { inicializarDB, leerDatos, escribirDatos };