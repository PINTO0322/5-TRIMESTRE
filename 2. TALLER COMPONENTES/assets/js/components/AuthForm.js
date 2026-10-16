/** Formulario dinámico basado en AuthForm del taller de Diego Casallas. */
export class AuthForm extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this.messageTimer = null; }
  static get observedAttributes() { return ['type']; }
  attributeChangedCallback(name, oldValue, newValue) { if (this.isConnected && oldValue !== newValue) this.render(); }
  connectedCallback() { this.render(); }
  disconnectedCallback() { clearTimeout(this.messageTimer); }
  render() {
    clearTimeout(this.messageTimer);
    const type = this.getAttribute('type') || 'login';
    const titles = { login: 'Iniciar sesión', register: 'Registro de usuario', forgot: 'Recuperar contraseña', reset: 'Nueva contraseña' };
    const buttons = { login: 'Ingresar', register: 'Registrarse', forgot: 'Enviar enlace', reset: 'Actualizar contraseña' };
    const field = (id, label, inputType, attributes = '') => `<label for="${id}">${label}</label><input id="${id}" name="${id}" type="${inputType}" ${attributes} required>`;
    const password = (id, label) => `<label for="${id}">${label}</label><div class="password-field">
      <input id="${id}" name="${id === 'confirm-password' ? 'confirm_password' : 'password'}" type="password" minlength="8" autocomplete="${type === 'login' ? 'current-password' : 'new-password'}" required>
      <button type="button" class="eye" data-target="${id}" aria-label="Mostrar u ocultar ${label}" aria-pressed="false" title="Mostrar contraseña">👁</button></div>`;
    let fields = '';
    if (type === 'login' || type === 'register') fields += field('username', 'Usuario', 'text', 'autocomplete="username" pattern="[a-zA-Z0-9_]{4,20}" title="Usa 4 a 20 letras, números o guiones bajos"');
    if (type === 'register' || type === 'forgot') fields += field('email', 'Correo electrónico', 'email', 'autocomplete="email"');
    if (type === 'register') fields += field('phone', 'Teléfono', 'tel', 'autocomplete="tel" placeholder="+57 3001234567"');
    if (type !== 'forgot') fields += password('password', type === 'reset' ? 'Nueva contraseña' : 'Contraseña');
    if (type === 'register' || type === 'reset') fields += '<p class="help">Mínimo 8 caracteres, una mayúscula, una minúscula y un número.</p>' + password('confirm-password', 'Confirmar contraseña');
    this.shadowRoot.innerHTML = `<style>
      :host { display: block; } * { box-sizing: border-box; }
      .form-container { display: flex; justify-content: center; padding: 2rem 1rem; }
      form { background: white; padding: 2rem; border-radius: 5px; box-shadow: 0 2px 4px #0002; width: 100%; max-width: 440px; }
      h2 { margin-top: 0; color: #237a3b; text-align: center; } label { display: block; margin-bottom: .5rem; font-size: .9rem; font-weight: bold; }
      input { width: 100%; padding: .75rem; margin-bottom: 1rem; border: 1px solid #777; border-radius: 5px; font: inherit; }
      button { padding: .75rem; border: 0; border-radius: 5px; cursor: pointer; font: inherit; }
      button[type=submit] { width: 100%; color: white; background: #237a3b; font-weight: bold; } button[type=submit]:hover { background: #195c2b; }
      button:disabled { opacity: .65; cursor: wait; } .form-links { margin-top: 1rem; display: flex; flex-direction: column; gap: .75rem; text-align: center; }
      a { color: #237a3b; } .help { font-size: .85rem; margin-top: -.5rem; }
      .password-field { position: relative; margin-bottom: 1rem; } .password-field input { padding-right: 3rem; margin: 0; }
      .eye { position: absolute; right: 0; top: 0; bottom: 0; width: 2.5rem; padding: 0; background: transparent; }
      .validation-message { display: none; margin-bottom: 1rem; padding: .75rem; border-radius: 5px; overflow-wrap: anywhere; }
      .error { background: #f8d7da; color: #842029; } .success { background: #d1e7dd; color: #0f5132; }
      :where(a,button,input):focus-visible { outline: 3px solid #174ea6; outline-offset: 2px; }
      @media(max-width:400px) { form { padding: 1.25rem; } }
    </style><div class="form-container"><form id="internal-form">
      <h2 tabindex="-1">${titles[type] || titles.login}</h2>
      <div id="validation-message" class="validation-message" role="status" aria-live="polite"></div>
      ${fields}<button type="submit">${buttons[type] || buttons.login}</button>
      <div class="form-links"><a href="#login" data-view="login">Inicio de sesión</a>
      <a href="#register" data-view="register">Crear cuenta</a><a href="#forgot" data-view="forgot">Recuperar contraseña</a>
      <a href="#reset" data-view="reset">Nueva contraseña (demostración)</a></div>
    </form></div>`;
    const form = this.shadowRoot.querySelector('form');
    form.addEventListener('input', () => form.querySelectorAll('input').forEach(input => input.setCustomValidity('')));
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('form-submit', { detail: { formData: new FormData(form), formElement: form }, bubbles: true, composed: true }));
    });
    this.shadowRoot.querySelectorAll('[data-view]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('navigate', { detail: { view: link.dataset.view }, bubbles: true, composed: true }));
    }));
    this.shadowRoot.querySelectorAll('.eye').forEach(eye => {
      const input = this.shadowRoot.getElementById(eye.dataset.target);
      const show = visible => { input.type = visible ? 'text' : 'password'; eye.setAttribute('aria-pressed', String(visible)); };
      eye.addEventListener('pointerenter', () => show(true));
      eye.addEventListener('pointerleave', () => show(false));
      eye.addEventListener('blur', () => show(false));
      eye.addEventListener('click', () => show(input.type === 'password'));
    });
  }
  validate() {
    const form = this.shadowRoot.querySelector('form');
    form.querySelectorAll('input').forEach(input => input.setCustomValidity(''));
    const email = form.querySelector('#email');
    const phone = form.querySelector('#phone');
    const password = form.querySelector('#password');
    const confirmation = form.querySelector('#confirm-password');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) email.setCustomValidity('Ingresa un correo válido.');
    if (phone && !/^\+?[0-9\s()\-]{7,20}$/.test(phone.value)) phone.setCustomValidity('Ingresa un teléfono válido.');
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password.value)) password.setCustomValidity('Usa mínimo 8 caracteres, una mayúscula, una minúscula y un número.');
    if (confirmation && confirmation.value !== password.value) confirmation.setCustomValidity('Las contraseñas no coinciden.');
    const invalid = form.querySelector(':invalid');
    if (invalid) { this.showMessage(invalid.validationMessage, 'error'); form.reportValidity(); return false; }
    return true;
  }
  setBusy(busy) {
    const form = this.shadowRoot.querySelector('form');
    form.setAttribute('aria-busy', String(busy));
    form.querySelectorAll('input').forEach(input => { input.readOnly = busy; });
    form.querySelectorAll('button').forEach(button => { button.disabled = busy; });
  }
  showMessage(message, type) {
    clearTimeout(this.messageTimer);
    const element = this.shadowRoot.getElementById('validation-message');
    element.textContent = message; element.className = `validation-message ${type}`; element.style.display = 'block';
    this.messageTimer = setTimeout(() => { element.style.display = 'none'; }, 5000);
  }
}
customElements.define('auth-form', AuthForm);
