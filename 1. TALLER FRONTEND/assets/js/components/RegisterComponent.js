export class RegisterComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        .form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem 1rem;
        }
        form {
          background-color: white;
          padding: 2rem;
          border-radius: var(--border-radius, 5px);
          box-shadow: var(--box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
          width: 100%;
          max-width: 400px;
          box-sizing: border-box;
        }
        h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
          color: var(--primary-color, #4CAF50);
          font-family: var(--font-family, 'Arial', sans-serif);
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
          font-size: 0.9rem;
          font-family: var(--font-family, 'Arial', sans-serif);
          color: var(--text-color, #333);
        }
        input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: var(--border-radius, 5px);
          box-sizing: border-box;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--primary-color, #4CAF50);
          color: white;
          border: none;
          border-radius: var(--border-radius, 5px);
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
          font-size: 1rem;
        }
        button:hover {
          background-color: #45a049;
        }
        .validation-message {
          margin-bottom: 1rem;
          padding: 0.5rem;
          border-radius: var(--border-radius, 5px);
          display: none;
          font-size: 0.9rem;
          text-align: center;
          color: white;
        }
        .validation-message.error {
          background-color: var(--secondary-color, #f44336);
        }
        .validation-message.success {
          background-color: var(--primary-color, #4CAF50);
        }
      </style>

      <div class="form-container">
        <form id="reg-form">
          <h2>Registro de Usuario</h2>
          <div class="validation-message" id="val-msg"></div>

          <label for="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            pattern="^[a-zA-Z0-9_]{4,20}$"
            title="Debe tener 4-20 caracteres, solo letras, números y guiones bajos"
            placeholder="Username"
            required
          >

          <label for="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="correo@ejemplo.com"
            required
          >

          <label for="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+57 3001234567"
            required
          >

          <label for="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
            title="Debe tener al menos una letra minúscula, una letra mayúscula y un número"
            placeholder="Password"
            required
          >

          <button type="submit">Registrarse</button>
        </form>
      </div>
    `;
  }

  connectedCallback() {
    const shadow = this.shadowRoot;
    const form = shadow.getElementById('reg-form');
    const msgBox = shadow.getElementById('val-msg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = shadow.getElementById('username').value;
      const email = shadow.getElementById('email').value;
      const phone = shadow.getElementById('phone').value;
      const password = shadow.getElementById('password').value;

      // Validación con Expresiones Regulares
      if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) {
        this.showMessage(
          'Username inválido (4-20 caracteres alfanuméricos).',
          'error'
        );
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.showMessage('Formato de correo electrónico inválido.', 'error');
        return;
      }

      if (!/^\+?[0-9\s\-()]+$/.test(phone)) {
        this.showMessage('Formato de teléfono inválido.', 'error');
        return;
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password) ||
          password.length < 8) {
        this.showMessage(
          'La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.',
          'error'
        );
        return;
      }

      this.showMessage('¡Registro exitoso!', 'success');

      // Disparar evento personalizado con los datos del formulario
      const formData = { username, email, phone };

      this.dispatchEvent(new CustomEvent('user-registered', {
        detail: { data: formData },
        bubbles: true,
        composed: true
      }));
    });
  }

  showMessage(text, type) {
    const msgBox = this.shadowRoot.getElementById('val-msg');

    msgBox.textContent = text;
    msgBox.className = `validation-message ${type}`;
    msgBox.style.display = 'block';

    setTimeout(() => {
      msgBox.style.display = 'none';
    }, 4000);
  }
}

customElements.define('app-register', RegisterComponent);