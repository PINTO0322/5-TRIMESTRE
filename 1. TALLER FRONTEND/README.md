# Taller 2: componentes reutilizables en JavaScript

Basado en el taller de Diego Casallas (SENA, octubre de 2026).

## Ejecutar

Desde esta carpeta:

```powershell
C:\xampp\php\php.exe -S localhost:8000
```

Abrir http://localhost:8000. También sirve `py -m http.server 8000`.
Se necesita un servidor HTTP por los módulos ES; no abrir index.html directamente como archivo.

## Implementación

- HeaderComponent: navegación mediante eventos `navigate`, con menú móvil.
- FooterComponent: pie reutilizable con Shadow DOM.
- AuthForm: cuatro vistas por atributo `type`, eventos `form-submit`, registro con usuario, correo, teléfono y confirmación.
- main.js: orquesta componentes, validación, carga, bloqueo y simulación con AbortController.
- Los ojos muestran cada contraseña de manera independiente.

Se conserva la arquitectura del PDF. Se completaron el footer como componente, los campos de registro, el acceso a reset, la validación y la cancelación efectiva, que el ejemplo deja parciales.

El envío es simulado: no hay registro real de usuarios, envío de correos ni cambio real de contraseña. No se guardan credenciales.
