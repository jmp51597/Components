// script.js - searches examples, displays code, enables copy buttons
document.addEventListener('DOMContentLoaded', () => {
  const data = {
    // key terms to match; each entry has title, desc, html, js, jsx
    "navigation bar": {
      title: "Generic Navigation Bar",
      desc: "Simple responsive nav with links. Includes vanilla JS toggle for mobile and a React JSX version.",
      html: `<nav class="navbar">
  <div class="container">
    <a class="brand" href="#">MySite</a>
    <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
    <ul class="nav-list">
      <li><a href="#">Home</a></li>
      <li><a href="#">Projects</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </div>
</nav>

<style>
.navbar{background:#fff;padding:0.5rem 1rem;border-radius:8px;display:block}
.navbar .container{display:flex;align-items:center;justify-content:space-between;gap:12px}
.brand{font-weight:700}
.nav-list{list-style:none;display:flex;gap:12px;margin:0;padding:0}
.nav-toggle{display:none;background:transparent;border:0;font-size:1.25rem}
@media (max-width:768px){
  .nav-list{display:none;flex-direction:column;gap:8px}
  .nav-toggle{display:inline-block}
  .nav-list.show{display:flex}
}
</style>`,

      js: `// Toggle mobile nav (vanilla JS)
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const ul = document.querySelector('.nav-list');
    ul.classList.toggle('show');
    btn.setAttribute('aria-expanded', ul.classList.contains('show'));
  });
});`,

      jsx: `// React functional NavBar (JSX)
import React, {useState} from 'react';

export default function NavBar(){
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="container">
        <a className="brand" href="#">MySite</a>
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="nav-toggle">☰</button>
        <ul className={\`nav-list \${open ? 'show' : ''}\`}>
          <li><a href="#">Home</a></li>
          <li><a href="#">Projects</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}`

    }
    // You can add more searchable entries here with other keys/aliases
  };

  const indexKeys = Object.keys(data);
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultCard = document.getElementById('resultCard');
  const noResult = document.getElementById('noResult');
  const exampleTitle = document.getElementById('exampleTitle');
  const exampleDesc = document.getElementById('exampleDesc');
  const htmlCode = document.getElementById('htmlCode');
  const jsCode = document.getElementById('jsCode');
  const jsxCode = document.getElementById('jsxCode');
  const statusMessage = document.getElementById('statusMessage');

  function showStatus(msg = 'Copied!'){
    statusMessage.textContent = msg;
    statusMessage.classList.remove('d-none');
    setTimeout(() => statusMessage.classList.add('d-none'), 1400);
  }

  function escapeHtml(s){ return s.replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderEntry(entry){
    exampleTitle.textContent = entry.title;
    exampleDesc.textContent = entry.desc;
    htmlCode.innerHTML = escapeHtml(entry.html);
    jsCode.innerHTML = escapeHtml(entry.js);
    jsxCode.innerHTML = escapeHtml(entry.jsx);
    resultCard.classList.remove('d-none');
    noResult.classList.add('d-none');
  }

  function clearResults(){
    resultCard.classList.add('d-none');
    noResult.classList.add('d-none');
  }

  function findMatch(q){
    if(!q) return null;
    q = q.toLowerCase();
    // simple matching: check keys and also title/desc
    for(const key of indexKeys){
      if(key.includes(q)) return data[key];
      const d = data[key];
      if(d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)) return d;
    }
    // partial-match by words
    for(const key of indexKeys){
      const words = key.split(/\s+/);
      if(words.some(w => q.includes(w) || w.includes(q))) return data[key];
    }
    return null;
  }

  searchBtn.addEventListener('click', () => {
    const q = searchInput.value.trim();
    if(!q){ clearResults(); return; }
    const match = findMatch(q);
    if(match) renderEntry(match);
    else {
      resultCard.classList.add('d-none');
      noResult.classList.remove('d-none');
    }
  });

  searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){ e.preventDefault(); searchBtn.click(); }
  });

  // Copy buttons
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-btn');
    if(!btn) return;
    const targetId = btn.getAttribute('data-target');
    const el = document.getElementById(targetId);
    if(!el) return;
    try {
      await navigator.clipboard.writeText(el.innerText);
      showStatus('Copied to clipboard');
    } catch (err) {
      showStatus('Copy failed');
    }
  });

  // show current year
  document.getElementById('year').textContent = new Date().getFullYear();
});
