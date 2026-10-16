/** Pie de página reutilizable: extensión del ejemplo, cuyo footer era estático. */
export class FooterComponent extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  connectedCallback() {
    this.shadowRoot.innerHTML = `<style>
      :host { display: block; } footer { padding: 1rem; text-align: center; color: white; background: var(--primary-color, #4caf50); } p { margin: 0; }
    </style><footer><p>© 2026 Sinapsis Technologies. Componentes Web.</p></footer>`;
  }
}
customElements.define('footer-component', FooterComponent);
