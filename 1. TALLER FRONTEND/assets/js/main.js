import './components/HeaderComponent.js';
import './components/FooterComponent.js';
import './components/AuthForm.js';

const appContainer = document.getElementById('app-container');
const preloader = document.getElementById('preloader');
const allowedViews = new Set(['login', 'register', 'forgot', 'reset']);
let pending = null;

document.addEventListener('navigate', event => {
  const view = event.detail.view;
  if (!allowedViews.has(view)) return;
  pending?.abort();
  preloader.hidden = true;
  const auth = appContainer.querySelector('auth-form');
  auth.setAttribute('type', view);
  auth.shadowRoot.querySelector('h2').focus();
});

document.addEventListener('form-submit', async event => {
  const auth = appContainer.querySelector('auth-form');
  if (pending || event.detail.formElement !== auth.shadowRoot.querySelector('form') || !auth.validate()) return;
  const controller = new AbortController();
  pending = controller;
  auth.setBusy(true);
  preloader.hidden = false;
  document.getElementById('cancel-request').focus();
  try {
    await simulateRequest(controller.signal);
    auth.showMessage('¡Operación ejecutada con éxito mediante componentes! Demostración: no se enviaron datos ni se modificaron cuentas.', 'success');
  } catch (error) {
    if (auth.shadowRoot.querySelector('form') !== event.detail.formElement) return;
    if (error.name === 'AbortError') auth.showMessage('Operación cancelada.', 'error');
    else auth.showMessage('No se pudo completar la operación.', 'error');
  } finally {
    if (auth.shadowRoot.querySelector('form') === event.detail.formElement) auth.setBusy(false);
    if (pending === controller) { pending = null; preloader.hidden = true; }
    if (auth.shadowRoot.querySelector('form') === event.detail.formElement) auth.shadowRoot.querySelector('button[type=submit]').focus();
  }
});

document.getElementById('cancel-request').addEventListener('click', () => pending?.abort());
window.addEventListener('pagehide', () => pending?.abort());

function simulateRequest(signal) {
  // Simulación cancelable: no usa red ni almacena contraseñas.
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { signal.removeEventListener('abort', cancel); resolve(); }, 1200);
    function cancel() { clearTimeout(timer); signal.removeEventListener('abort', cancel); reject(new DOMException('Cancelada', 'AbortError')); }
    signal.addEventListener('abort', cancel, { once: true });
    if (signal.aborted) cancel();
  });
}
