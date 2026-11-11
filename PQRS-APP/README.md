# Proyecto PQRS

Proyecto desarrollado con CodeIgniter 4 siguiendo los talleres del instructor.

Incluye autenticación con JWT, usuarios, roles, módulos, permisos y asignación de permisos. El Front-End permite iniciar sesión y cargar el menú según los permisos del usuario.

## Requisitos

- PHP 8.2 o superior.
- Composer.
- MySQL o MariaDB.

## Instalación

Abrir una terminal dentro de PQRS-APP e instalar las dependencias:

```powershell
composer install
```

Crear la configuración local:

```powershell
Copy-Item env .env
```

En phpMyAdmin, crear la base de datos `pqrs_system` e importar:

```text
database/pqrs_system.sql
```

La importación debe hacerse en una base vacía porque el archivo contiene instrucciones que reemplazan tablas.

En `.env`, configurar los valores del equipo:

```ini
CI_ENVIRONMENT = development
database.default.hostname = localhost
database.default.database = pqrs_system
database.default.username = root
database.default.password =
database.default.DBDriver = MySQLi
database.default.port = 3306
JWT_SECRET = colocar_una_clave_privada
JWT_EXPIRE = 3600
```

Generar una clave y copiar el resultado en `JWT_SECRET`:

```powershell
php -r "echo bin2hex(random_bytes(32));"
```

El archivo `.env` contiene la configuración privada y no se sube a GitHub.

## Abrir el proyecto

Con MySQL o MariaDB encendido, ejecutar:

```powershell
php spark serve --host 127.0.0.1 --port 8081
```

Abrir en el navegador:

```text
http://127.0.0.1:8081/index.html
```

Dejar la terminal abierta mientras se usa la aplicación.

## Estado

La implementación de seguridad y la estructura inicial del Front-End están disponibles. Las pruebas finales del checklist del instructor están pendientes de completar.