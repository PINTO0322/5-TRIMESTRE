/** Basado en HeaderComponent del taller de Diego Casallas. */
export class HeaderComponent extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        header { background: var(--primary-color, #4caf50); color: white; padding: 1rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        h1 { margin: 0; font-size: 1.5rem; }
        nav { margin-left: auto; }
        ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 1rem; flex-wrap: wrap; }
        a { color: white; text-decoration: none; }
        a:hover { text-decoration: underline; }
        button { display: none; padding: .5rem; background: transparent; color: white; border: 1px solid white; cursor: pointer; font-size: 1.25rem; }
        @media(max-width:600px) { h1 { flex: 1; } button { display: block; } nav { display: none; width: 100%; } nav.open { display: block; } ul { flex-direction: column; } }
      </style>
      <header>
        <h1></h1>
        <button type="button" aria-label="Abrir o cerrar menú" aria-expanded="false" aria-controls="navigation">☰</button>
        <nav id="navigation" aria-label="Principal"><ul>
          <li><a href="#login" data-view="login">Inicio</a></li>
          <li><a href="#register" data-view="register">Registro</a></li>
          <li><a href="#forgot" data-view="forgot">Recuperar</a></li>
          <li><a href="#reset" data-view="reset">Nueva contraseña (demo)</a></li>
        </ul></nav>
      </header>`;
    this.shadowRoot.querySelector('h1').textContent = this.getAttribute('title') || 'Sistema Web';
    const menu = this.shadowRoot.querySelector('button');
    const nav = this.shadowRoot.querySelector('nav');
    menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
    this.shadowRoot.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
      this.dispatchEvent(new CustomEvent('navigate', { detail: { view: link.dataset.view }, bubbles: true, composed: true }));
    }));
  }
}
customElements.define('header-component', HeaderComponent);
