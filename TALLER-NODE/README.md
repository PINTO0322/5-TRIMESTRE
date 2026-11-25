# Taller de almacenamiento con Node.js

Autor: Jesús Miguel Pinto Moncada.

Desarrollo basado en la guía y la clase del instructor.
Se completaron las operaciones CRUD y se probaron en Postman.

## Versiones

- mi-api-productos: archivo JSON.
- mi-api-productos-2: SQLite.
- mi-api-productos-3: MySQL.

Cada carpeta contiene una aplicación independiente.
Ejecutar una aplicación a la vez porque utilizan el puerto 3000.

## Instalación y ejecución

1. Abrir una terminal dentro de la versión elegida.
2. Ejecutar npm ci.
3. Solo para MySQL, copiar .env.example como .env y ajustar sus valores.
4. Para MySQL, iniciar el servicio y ejecutar taller_node.sql.
5. Ejecutar npm run dev.
6. Probar la API en Postman.

JSON y SQLite crean automáticamente sus archivos de almacenamiento.
Detener el servidor con Ctrl + C.

## API de productos

Dirección base: http://localhost:3000/api/productos

- GET /: listar productos.
- GET /:id: consultar un producto.
- POST /: crear un producto.
- PUT /:id: actualizar un producto.
- DELETE /:id: eliminar un producto.

El identificador se agrega después de /api/productos.
En POST y PUT se utiliza Body, raw, JSON.

Ejemplo de creación:

{
  "nombre": "Laptop HP",
  "precio": 2500000,
  "stock": 10
}

Respuestas comprobadas: 200, 201, 204, 400 y 404.
La persistencia se verificó reiniciando cada servidor.

## Reflexión

El pool reutiliza conexiones con MySQL y limita cuántas pueden estar
abiertas al mismo tiempo.

Las consultas parametrizadas separan los valores enviados del código SQL.
Se utiliza ? para que esos valores no se interpreten como instrucciones SQL.

JSON permite guardar datos en un archivo sencillo.
SQLite proporciona SQL en una base local.
MySQL utiliza un servidor de base de datos.

## Alcance

Ejercicio académico para pruebas secuenciales.
No incluye autenticación.