# PQRS con Node.js

Talleres de las partes 1, 2 y 3 del instructor Diego Casallas.
Aprendiz: Jesus Miguel Pinto Moncada.

El proyecto permite iniciar sesion, seleccionar un rol, administrar usuarios,
perfiles, roles y modulos, registrar PQRS, asignarlas y responderlas.
Las notas internas se muestran al administrador o al personal asignado.

## Guias utilizadas

- [Partes 1 y 2](https://github.com/diehercasvan/Back-end/tree/back-end-v2/Node.js/pqrs-backend/documents).
- [Parte 3](https://github.com/diehercasvan/Back-end/tree/back-end-v2/Node.js/pqrs-backend/documents/Parte%203).
- [Codigo del instructor](https://github.com/diehercasvan/Back-end/tree/back-end-v2/Node.js/pqrs-backend).

Se tomo como base el codigo del instructor de la rama `back-end-v2`,
revision `a94bc1a2e4c083ce62307d1775d62de58c8043c8`.

## Requisitos

- Node.js 18 o superior y npm.
- MySQL o MariaDB. En este equipo se utiliza MySQL de XAMPP.

## Instalacion

Abrir una terminal dentro de `PQRS-NODE` y ejecutar:

```powershell
npm ci
Copy-Item .env.example .env
```

Abrir `.env` y ajustar la conexion a MySQL. El nombre de la base es
`pqrs_node_system`, para conservar por separado el proyecto PHP `PQRS-APP`.

Generar una clave para JWT:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copiar el resultado en `JWT_SECRET` dentro de `.env`.
No subir este archivo ni el token de acceso a GitHub.

### Preparar la base de datos

Iniciar MySQL en XAMPP. Los siguientes comandos estan preparados para
Windows, XAMPP instalado en `C:\xampp` y el usuario local root sin clave:

```powershell
npm run db:import
npm run db:migrate
npm run add:is-internal
npm run fix:seed
npm run seed:manager
```

**Importante:** `db:import` reconstruye las tablas de `pqrs_node_system`.
Usarlo al instalar; si ya tiene informacion que se desea conservar,
hacer primero un respaldo. No modifica `pqrs_system` de CodeIgniter.

Si MySQL tiene otra ruta o credenciales, importar `db/pqrs_system.sql`
y ejecutar `db/pqrs_system_2.sql` desde el cliente MySQL, en esta base.
Despues ejecutar los tres scripts Node indicados arriba.

## Abrir el proyecto

```powershell
npm run dev
```

Tambien se puede usar `npm start`. Ejecutar solo uno a la vez.

- Comprobar el servidor: http://localhost:3000/api/v1/health
- Consultar y probar la API en Swagger: http://localhost:3000/api-docs/
- Definicion de Swagger: http://localhost:3000/api-docs.json

Estas direcciones funcionan mientras el servidor este encendido en ese equipo.
Si el puerto 3000 esta ocupado por el taller de productos, detener ese servidor.

## Usuarios de demostracion

Despues de ejecutar los scripts de datos de prueba:

| Usuario | Contrasena | Rol |
| --- | --- | --- |
| admin | admin123 | Administrador |
| juan | admin123 | Usuario |
| carlos | carlos123 | Gestor |

Son cuentas de demostracion de la guia, para uso local.

## Postman

Importar `postman/PQRS.postman_collection.json`. Contiene 52 peticiones
agrupadas por Auth, Catalogos, Roles, Users, Profiles, Modules y PQRS.
La variable `baseUrl` apunta a `http://localhost:3000/api/v1`.

Comenzar con **Login admin**. La respuesta contiene el token en `data.token`;
esa peticion lo guarda en la variable `token` de la coleccion.
Para probar con juan o carlos, copiar el token de su respuesta a esa variable.
La coleccion guardada en Git deja el token vacio.

## Partes realizadas

1. Configuracion, modelos Sequelize, servidor, JWT y seleccion de rol.
2. Control de permisos, catalogos, roles, usuarios, perfiles y modulos.
3. Radicacion, consulta, asignacion, estados, respuestas y notas internas.
4. Ajustes finales de la Parte 3: permisos del rol activo, estadisticas,
   Swagger y coleccion Postman.

En Node los permisos se asignan al rol mediante `role_module_permission`,
como indica la Parte 2. Es un esquema distinto al proyecto CodeIgniter.

## Verificacion realizada

Se ejecutaron pruebas HTTP locales con MySQL, siguiendo los casos de las guias:

- Parte 1: 17 comprobaciones de servidor, login, token y seleccion de rol.
- Parte 2: 56 comprobaciones de catalogos, permisos y operaciones de seguridad.
- Parte 3: 25 comprobaciones de PQRS, respuestas, privacidad y estados.
- Cierre: 16 comprobaciones de permisos, estadisticas, Swagger y concurrencia.
- Se reviso la sintaxis de 61 archivos JavaScript.

Estas pruebas se ejecutaron automaticamente contra la API local;
no significan que cada peticion se haya repetido manualmente en Postman.

## Ajustes respecto al ejemplo

- Se uso otra base de datos para conservar los datos del proyecto PHP.
- En la migracion se elimino un segundo `DROP TABLE module_role_user`
  que intentaba borrar una tabla ya eliminada por el mismo script.
- Se corrigio el filtro de busqueda para que no muestre PQRS ajenas.
- El radicado toma el ultimo correlativo existente y serializa las altas,
  evitando colisiones al borrar registros intermedios o crear simultaneamente.
- Swagger incluye tambien las rutas finales de permisos y estadisticas.

Se conservaron las reglas y la estructura del instructor. El rol `user`
del ejemplo tiene permisos de consulta y creacion de PQRS, pero no `delete`;
una peticion DELETE con ese rol devuelve 403. No se agregaron permisos extra.

La interfaz grafica del proyecto Node no forma parte de estas tres partes.

