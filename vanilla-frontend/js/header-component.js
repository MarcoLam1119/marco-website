// Custom Header Component
class CustomHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const currentPath = window.location.pathname.replace(/\/$/, ''); // Remove trailing slash for /
    const linkMap = {
      '/': 'Home',
      '/about.html': 'About me',
      '/photo-library.html': 'Photos',
      '/calendar.html': 'Calendar',
      '/tools.html': 'Tools',
      '/payment-calculator.html': 'Payment Calculator',
      '/words-spelling.html': 'Words Spelling',
      '/creator-panel.html': 'Creator Panel'
    };
    const activePage = linkMap[currentPath] || 'Home';

    this.shadowRoot.innerHTML = `
      <style>
        @import url('../css/global.css');
        /* Additional styles for shadow root if needed */
      </style>
      <header>
        <div class="container nav">
          <div class="brand">
            <div class="logo" aria-hidden="true"></div>
            <span>My Personal Web</span>
          </div>
          <nav class="navlinks" id="navlinks" aria-label="Primary">
            <a href="/" class="${activePage === 'Home' ? 'active' : ''}">Home</a>
            <a href="about.html" class="${activePage === 'About me' ? 'active' : ''}">About me</a>
            <a href="photo-library.html" class="${activePage === 'Photos' ? 'active' : ''}">Photos</a>
            <a href="calendar.html" class="${activePage === 'Calendar' ? 'active' : ''}">Calendar</a>
            <a href="tools.html" class="${activePage === 'Tools' ? 'active' : ''}">Tools</a>
          </nav>
          <div class="nav-rt">
            <button class="icon-btn" title="Toggle theme" aria-label="Toggle theme" onclick="toggleTheme()">🌓</button>
          </div>
        </div>
      </header>
    `;

    // Ensure toggleTheme is accessible
    if (typeof toggleTheme === 'function') {
      this.shadowRoot.querySelector('button').onclick = toggleTheme;
    }
  }
}

// Define the custom element
customElements.define('custom-header', CustomHeader);
