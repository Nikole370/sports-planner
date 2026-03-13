// ═══════════════════════════════════════════════════════
// app.js — Sidebar, tabs, modals, export, init
// ═══════════════════════════════════════════════════════

// ── Sidebar ──────────────────────────────────────────────
function toggleSB() {
  const sb   = document.getElementById('sidebar');
  const btn  = document.getElementById('stoggle');
  const back = document.getElementById('sb-backdrop');
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    const open = sb.classList.toggle('mobile-open');
    back.classList.toggle('open', open);
    btn.textContent = open ? '✕' : '☰';
  } else {
    sb.classList.toggle('collapsed');
    const c = sb.classList.contains('collapsed');
    btn.textContent = c ? '▶' : '◀';
    btn.classList.toggle('col', c);
  }
}

function closeSBMobile() {
  const sb   = document.getElementById('sidebar');
  const btn  = document.getElementById('stoggle');
  const back = document.getElementById('sb-backdrop');
  sb.classList.remove('mobile-open');
  back.classList.remove('open');
  btn.textContent = '☰';
}

// ── Tabs ─────────────────────────────────────────────────
let currentTab = 'semana';

function switchTab(tab) {
  currentTab = tab;
  const order = ['semana', 'rutinas', 'objetivos'];
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', order[i] === tab)
  );
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');

  if (tab === 'semana')    renderWeekView();
  if (tab === 'rutinas')   renderRoutines();
  if (tab === 'objetivos') { renderMacroGoals(); renderMonthObjectives(); }
}

// ── Sports sidebar ────────────────────────────────────────
function renderSports() {
  const list = document.getElementById('sport-list');
  list.innerHTML = '';

  AppState.sports.forEach(sp => {
    const d = document.createElement('div');
    d.className = 'sport-item';
    d.innerHTML = `
      <div class="sport-dot" style="background:${sp.color}"></div>
      <span class="sport-emoji" contenteditable="true" spellcheck="false">${sp.emoji}</span>
      <span class="sport-name"  contenteditable="true" spellcheck="false">${sp.name}</span>
      <button class="sport-del" onclick="delSport('${sp.id}')">×</button>
    `;
    d.querySelector('.sport-emoji').addEventListener('input', e => { sp.emoji = e.target.textContent.trim() || sp.emoji; });
    d.querySelector('.sport-name').addEventListener('input',  e => { sp.name  = e.target.textContent.trim() || sp.name;  });
    list.appendChild(d);
  });
}

function delSport(id) {
  if (AppState.sports.length <= 1) return;
  AppState.sports = AppState.sports.filter(s => s.id !== id);
  debouncedSave();
  renderSports();
}

function openAddSport() {
  window._selColor = COLORS[0];
  document.getElementById('sp-name').value  = '';
  document.getElementById('sp-emoji').value = '🏋️';
  renderColorGrid();
  openModal('modal-sport');
}

function saveSport() {
  const n = document.getElementById('sp-name').value.trim();
  const e = document.getElementById('sp-emoji').value.trim();
  if (!n) return;
  AppState.sports.push({ id: uid(), name: n, emoji: e || '🏅', color: window._selColor });
  debouncedSave();
  closeModal('modal-sport');
  renderSports();
}

function renderColorGrid() {
  const g = document.getElementById('color-grid');
  g.innerHTML = '';
  COLORS.forEach(c => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (c === window._selColor ? ' selected' : '');
    sw.style.background = c;
    sw.onclick = () => {
      window._selColor = c;
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
    };
    g.appendChild(sw);
  });
}

// ── Export ────────────────────────────────────────────────
function exportPNG() {
  const btn = document.getElementById('btn-export-png');
  btn.textContent = '⏳'; btn.disabled = true;

  const hideQ = '.btn-add-block,.btn-export,.sidebar-toggle,.sport-block-del,.check-item-del,.btn-sm,.week-go-btn,.btn-add-check,.btn-add-macro,.tabs,.btn-add-routine';
  document.querySelectorAll(hideQ).forEach(el => el.style.visibility = 'hidden');

  html2canvas(document.querySelector('.main'), {
    backgroundColor: '#f7f5f0', scale: 2, useCORS: true, logging: false
  }).then(canvas => {
    const a = document.createElement('a');
    a.download = 'marsi-planner.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }).finally(() => {
    document.querySelectorAll(hideQ).forEach(el => el.style.visibility = '');
    btn.innerHTML = '🖼️ PNG'; btn.disabled = false;
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(o =>
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); })
  );

  loadState();
  renderSports();
  renderWeekView();
});

// ── Auto-save on text edits anywhere in the app ───────────
document.addEventListener('input', () => debouncedSave());
