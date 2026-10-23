import './components/NavComponent.js';
import './components/FooterComponent.js';
import './components/RegisterComponent.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Aplicación de componentes inicializada correctamente.');

  // Escuchar evento de navegación desde el componente nav
  document.addEventListener('app-navigate', (e) => {
    const route = e.detail.route;
    console.log(`Navegación solicitada hacia la ruta: ${route}`);
  });

  // Escuchar evento de registro exitoso desde el componente register
  document.addEventListener('user-registered', (e) => {
    const userData = e.detail.data;
    console.log('Nuevo usuario registrado procesado en el orquestador:', userData);
  });
});
