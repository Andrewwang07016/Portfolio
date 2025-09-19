// Partials loader: inserts header, navbar, footer, and builds consistent links across all pages
(function(){
  function getPrefix(){
    const p = location.pathname.replace(/\\/g,'/');
    if(p.includes('/pages/admin/')) return '../../';
    if(p.includes('/pages/')) return '../';
    return '';
  }
  // THEME: light/dark support
  function getStoredTheme(){
    try { return localStorage.getItem('theme') || 'light'; } catch { return 'light'; }
  }
  function storeTheme(theme){
    try { localStorage.setItem('theme', theme); } catch {}
  }
  function applyTheme(theme){
    const root = document.documentElement;
    if(theme === 'dark') root.setAttribute('data-theme','dark');
    else root.removeAttribute('data-theme');
  }
  function initTheme(){
    const theme = getStoredTheme();
    applyTheme(theme);
  }
  function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
    updateThemeToggleLabel();
  }
  function updateThemeToggleLabel(){
    const btn = document.querySelector('.theme-toggle');
    if(!btn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  function ensureFavicon(prefix){
    const head = document.head || document.getElementsByTagName('head')[0];
    let link = head.querySelector('link[rel="icon"]');
    if(!link){
      link = document.createElement('link');
      link.rel = 'icon';
      head.appendChild(link);
    }
    link.href = prefix + 'favicon.ico';
  }
  function ensureGlobalStyles(prefix){
    const head = document.head || document.getElementsByTagName('head')[0];
    const href = prefix + 'css/styles.css';
    const exists = [...head.querySelectorAll('link[rel="stylesheet"]')].some(l => (l.getAttribute('href')||'').endsWith('css/styles.css'));
    if(!exists){
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      // Insert before other styles if possible
      const firstStyle = head.querySelector('link[rel="stylesheet"]');
      if(firstStyle) head.insertBefore(link, firstStyle);
      else head.appendChild(link);
    }
  }
  async function inject(selector, url, position){
    try{
      const res = await fetch(url);
      const html = await res.text();
      const tpl = document.createElement('template');
      tpl.innerHTML = html.trim();
      if(position === 'start') document.body.prepend(tpl.content);
      else if(position === 'after-header'){
        const header = document.querySelector('header.site-header');
        if(header) header.insertAdjacentElement('afterend', tpl.content.firstElementChild);
        else document.body.prepend(tpl.content);
      } else document.body.append(tpl.content);
    }catch(err){ console.warn('Partial load failed:', url, err); }
  }
  function buildNavbar(prefix){
    let nav = document.querySelector('nav.navbar');
    if(!nav){
      nav = document.createElement('nav');
      nav.className = 'navbar';
      document.body.prepend(nav);
    }
    const links = [
      {href: prefix + 'index.html', label: 'Home'},
      {href: prefix + 'pages/products.html', label: 'Products'},
      {href: prefix + 'pages/shoppingcart.html', label: 'Cart'},
      {href: prefix + 'pages/checkout.html', label: 'Checkout'},
      {href: prefix + 'pages/account.html', label: 'Account'},
      {href: prefix + 'pages/login.html', label: 'Login'},
      {href: prefix + 'pages/register.html', label: 'Register'},
      {href: prefix + 'pages/admin/index.html', label: 'Admin'},
    ];
    const currPath = location.pathname.replace(/\\/g,'/');
    const linksHtml = links.map(l => {
      const linkPath = new URL(l.href, location.href).pathname.replace(/\\/g,'/');
      const isActive = currPath === linkPath;
      const active = isActive ? ' aria-current="page" class="active"' : '';
      return `<a href="${l.href}"${active}>${l.label}</a>`;
    }).join('');
    const toggleHtml = `<button class="theme-toggle" type="button" aria-pressed="false" style="margin-left:auto"></button>`;
    nav.innerHTML = linksHtml + toggleHtml;
    // Attach toggle behavior
    const toggle = nav.querySelector('.theme-toggle');
    if(toggle){ toggle.addEventListener('click', toggleTheme); }
    updateThemeToggleLabel();
  }
  async function loadPartials(){
    const prefix = getPrefix();
    initTheme();
    ensureFavicon(prefix);
    ensureGlobalStyles(prefix);
    await inject('nav', prefix + 'partials/navbar.html', 'after-header');
    buildNavbar(prefix);
    await inject('footer', prefix + 'partials/footer.html', 'end');
  }
  window.loadPartials = loadPartials;
})();
