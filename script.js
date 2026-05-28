// script.js - search, render, and copy logic only

document.addEventListener('DOMContentLoaded', () => {
  const data = {
    'navigation bar': {
      title: 'Generic Navigation Bar',
      desc: 'Responsive nav with a mobile toggle. Includes plain HTML/CSS, vanilla JS toggle, and React JSX variant.',
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
/* example CSS omitted per request if desired */
</style>`,
      js: `// Toggle mobile nav (vanilla JS)
document.querySelectorAll('.nav-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const ul = document.querySelector('.nav-list');
    if (!ul) return;
    ul.classList.toggle('show');
    btn.setAttribute('aria-expanded', ul.classList.contains('show'));
  });
});`,
      jsx: `// React NavBar (JSX)
import React, { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="container">
        <a className="brand" href="#">MySite</a>
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="nav-toggle">☰</button>
        <ul className={\`nav-list ${open ? 'show' : ''}\`}>
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
    // add more entries as needed
  };

  const keys = Object.keys(data);
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
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  function render(entry) {
    exampleTitle.textContent = entry.title;
    exampleDesc.textContent = entry.desc;
    htmlCode.textContent = entry.html;
    jsCode.textContent = entry.js;
    jsxCode.textContent = entry.jsx;
    resultCard.classList.remove('hidden');
    noResult.classList.add('hidden');
  }

  function hideResults() {
    resultCard.classList.add('hidden');
    noResult.classList.add('hidden');
  }

  function showNoResults() {
    resultCard.classList.add('hidden');
    noResult.classList.remove('hidden');
  }

  function findMatch(query) {
    if (!query) return null;
    const q = query.toLowerCase().trim();

    for (const key of keys) {
      if (key.includes(q)) return data[key];
    }

    for (const key of keys) {
      const entry = data[key];
      if (entry.title.toLowerCase().includes(q) || entry.desc.toLowerCase().includes(q)) {
        return entry;
      }
    }

    return null;
  }

  function search() {
    const query = searchInput.value;
    const match = findMatch(query);
    if (match) {
      render(match);
    } else {
      showNoResults();
    }
  }

  searchBtn.addEventListener('click', search);
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      search();
    }
  });

  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const target = document.getElementById(targetId);
      if (!target) return;

      const textToCopy = target.textContent;
      if (!navigator.clipboard) {
        statusMessage.textContent = 'Clipboard not supported';
        statusMessage.classList.remove('hidden');
        return;
      }

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          statusMessage.textContent = 'Copied ✓';
          statusMessage.classList.remove('hidden');
          setTimeout(() => {
            statusMessage.classList.add('hidden');
          }, 1800);
        })
        .catch(() => {
          statusMessage.textContent = 'Copy failed';
          statusMessage.classList.remove('hidden');
        });
    });
  });

  hideResults();
});
