export class FooterComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        footer {
          background-color: var(--primary-color, #4CAF50);
          color: white;
          text-align: center;
          padding: 1rem;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          bottom: 0;
        }
        p {
          margin: 0;
          font-family: var(--font-family, 'Arial', sans-serif);
          font-size: 0.9rem;
        }
      </style>

      <footer>
        <p id="footer-text">
          &copy; 2026 Sinapsis Technologies. All rights reserved.
        </p>
      </footer>
    `;
  }

  connectedCallback() {
    const company = this.getAttribute('data-company');

    if (company) {
      this.shadowRoot.getElementById('footer-text').textContent =
        `\u00A9 2026 ${company}. All rights reserved.`;
    }
  }
}

customElements.define('app-footer', FooterComponent);