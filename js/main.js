const BASE = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
  ? ''
  : '';

async function fetchJSON(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error('fetch failed: ' + path);
  return res.json();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Mark active nav link
document.querySelectorAll('nav a').forEach(a => {
  if (a.href === location.href || (a.pathname !== '/' && location.pathname.startsWith(a.pathname))) {
    a.classList.add('active');
  }
});

// ---- Home page ----
async function loadHome() {
  const postsList = document.getElementById('posts-list');
  const projectsGrid = document.getElementById('projects-grid');
  if (!postsList && !projectsGrid) return;

  if (postsList) {
    try {
      const posts = await fetchJSON('/data/posts.json');
      if (!posts.length) { postsList.innerHTML = '<p class="empty">Aucun article pour l\'instant.</p>'; }
      else {
        postsList.innerHTML = posts.slice(0, 5).map(p => `
          <li>
            <a class="post-title" href="/posts/${p.slug}.html">${p.title}</a>
            <span class="post-date">${formatDate(p.date)}</span>
          </li>`).join('');
      }
    } catch { postsList.innerHTML = '<p class="loading">Chargement…</p>'; }
  }

  if (projectsGrid) {
    try {
      const projects = await fetchJSON('/data/projects.json');
      if (!projects.length) { projectsGrid.innerHTML = '<p class="empty">Aucun projet pour l\'instant.</p>'; }
      else {
        projectsGrid.innerHTML = projects.map(p => `
          <div class="project-card">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <div class="links">
              ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">GitHub →</a>` : ''}
              ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Demo →</a>` : ''}
            </div>
          </div>`).join('');
      }
    } catch { projectsGrid.innerHTML = '<p class="loading">Chargement…</p>'; }
  }
}

// ---- Blog page ----
async function loadBlog() {
  const list = document.getElementById('all-posts');
  if (!list) return;
  try {
    const posts = await fetchJSON('/data/posts.json');
    if (!posts.length) { list.innerHTML = '<p class="empty">Aucun article pour l\'instant.</p>'; return; }
    list.innerHTML = '<ul class="post-list">' + posts.map(p => `
      <li>
        <a class="post-title" href="/posts/${p.slug}.html">${p.title}</a>
        <span class="post-date">${formatDate(p.date)}</span>
      </li>`).join('') + '</ul>';
  } catch { list.innerHTML = '<p class="loading">Erreur de chargement.</p>'; }
}

// ---- Portfolio page ----
async function loadPortfolio() {
  const grid = document.getElementById('all-projects');
  if (!grid) return;
  try {
    const projects = await fetchJSON('/data/projects.json');
    if (!projects.length) { grid.innerHTML = '<p class="empty">Aucun projet pour l\'instant.</p>'; return; }
    grid.innerHTML = '<div class="project-grid">' + projects.map(p => `
      <div class="project-card">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="links">
          ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener">GitHub →</a>` : ''}
          ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Demo →</a>` : ''}
        </div>
      </div>`).join('') + '</div>';
  } catch { grid.innerHTML = '<p class="loading">Erreur de chargement.</p>'; }
}

loadHome();
loadBlog();
loadPortfolio();
