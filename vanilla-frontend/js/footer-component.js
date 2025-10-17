// Custom Footer Component
class CustomFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('../css/global.css');
      </style>
      <footer class="container center">
        <div class="divider"></div>
        <p>
          © <span id="year">${new Date().getFullYear()}</span> <span id="name">Lam Chun Wing (Marco)</span>. All rights reserved.
        </p>
        <p class="small">Your content is saved in your browser storage. Clearing site data will reset it.</p>
      </footer>
    `;
  }
}

// Define the custom element
customElements.define('custom-footer', CustomFooter);
