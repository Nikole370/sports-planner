// ═══════════════════════════════════════════════════════
// objectives.js — Tab de objetivos (macro / mes / semana)
// ═══════════════════════════════════════════════════════

let moMonth = '2025-03';

// ── Macro goals ─────────────────────────────────────────
function renderMacroGoals() {
  const list = document.getElementById('macro-goals-list');
  list.innerHTML = '';

  AppState.macroGoals.forEach((g, i) => {
    const sp = getSport(g.sportId);
    const c  = document.createElement('div');
    c.className = 'macro-goal-card';
    c.innerHTML = `
      <div class="macro-goal-num"
           style="background:${sp ? hexToRgba(sp.color, 0.12) : '#eee'};color:${sp?.color || '#888'}">${i + 1}</div>
      <div class="macro-goal-body">
        <div class="macro-sport-tag" style="color:${sp?.color || '#888'}">${sp?.emoji || ''} ${sp?.name || 'General'}</div>
        <input class="macro-goal-text" value="${g.text}" placeholder="Objetivo...">
        <textarea class="macro-goal-desc" placeholder="Descripción...">${g.desc}</textarea>
        <input class="macro-goal-deadline" value="${g.deadline}" placeholder="Fecha límite">
      </div>
      <button class="macro-goal-del" onclick="delMacroGoal('${g.id}')">×</button>
    `;
    c.querySelector('.macro-goal-text').addEventListener('input',    e => { g.text     = e.target.value; });
    c.querySelector('.macro-goal-desc').addEventListener('input',    e => { g.desc     = e.target.value; });
    c.querySelector('.macro-goal-deadline').addEventListener('input', e => { g.deadline = e.target.value; });
    list.appendChild(c);
  });
}

function addMacroGoal() {
  populateSportSelect('macro-sp-sel');
  document.getElementById('macro-text').value     = '';
  document.getElementById('macro-desc').value     = '';
  document.getElementById('macro-deadline').value = '';
  openModal('modal-macro');
}

function saveMacroGoal() {
  const sid = document.getElementById('macro-sp-sel').value;
  const t   = document.getElementById('macro-text').value.trim();
  const d   = document.getElementById('macro-desc').value;
  const dl  = document.getElementById('macro-deadline').value;
  if (!t) return;
  AppState.macroGoals.push({ id: uid(), sportId: sid, text: t, desc: d, deadline: dl });
  debouncedSave();
  closeModal('modal-macro');
  renderMacroGoals();
}

function delMacroGoal(id) {
  AppState.macroGoals = AppState.macroGoals.filter(g => g.id !== id);
  debouncedSave();
  renderMacroGoals();
}

// ── Month objectives ─────────────────────────────────────
function prevMO() {
  const [y, m] = moMonth.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  moMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  renderMonthObjectives();
}

function nextMO() {
  const [y, m] = moMonth.split('-').map(Number);
  const d = new Date(y, m, 1);
  moMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  renderMonthObjectives();
}

function renderMonthObjectives() {
  const [y, m] = moMonth.split('-').map(Number);
  document.getElementById('mo-month-name').textContent = `${MONTHS[m - 1]} ${y}`;

  if (!AppState.monthObjectives[moMonth]) AppState.monthObjectives[moMonth] = [];

  const list = document.getElementById('month-goals-list');
  list.innerHTML = '';

  AppState.monthObjectives[moMonth].forEach(g => {
    const sp = getSport(g.sportId);
    const r  = document.createElement('div');
    r.className = 'month-goal-card';
    r.innerHTML = `
      <div class="month-goal-dot" style="background:${sp?.color || '#ccc'}"></div>
      <textarea class="month-goal-text" placeholder="Objetivo del mes...">${g.text}</textarea>
      <button class="month-goal-del" onclick="delMonthGoal('${g.id}')">×</button>
    `;
    r.querySelector('.month-goal-text').addEventListener('input', e => { g.text = e.target.value; });
    list.appendChild(r);
  });

  renderWeekMicros();
}

function addMonthGoal() {
  debouncedSave();
  AppState.monthObjectives[moMonth].push({
    id: uid(), sportId: AppState.sports[0]?.id || '', text: ''
  });
  renderMonthObjectives();
}

function delMonthGoal(id) {
  AppState.monthObjectives[moMonth] = AppState.monthObjectives[moMonth].filter(g => g.id !== id);
  debouncedSave();
  renderMonthObjectives();
}

// ── Weekly micros ────────────────────────────────────────
function renderWeekMicros() {
  const [y, m] = moMonth.split('-').map(Number);
  const firstDay = new Date(y, m - 1, 1);
  const lastDay  = new Date(y, m, 0);

  // collect Mondays in this month
  const mondays = [];
  let d = new Date(firstDay);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  while (d <= lastDay) { mondays.push(new Date(d)); d.setDate(d.getDate() + 7); }
  if (!mondays.length) mondays.push(new Date(firstDay));

  const container = document.getElementById('week-micro-list');
  container.innerHTML = '';

  mondays.forEach((mon, i) => {
    const wk   = weekKey(mon);
    const wEnd = addDays(mon, 6);
    if (!AppState.weekMicros[wk]) AppState.weekMicros[wk] = [];

    const row = document.createElement('div');
    row.className = 'week-row';
    row.innerHTML = `
      <div class="week-row-hdr" onclick="this.parentElement.classList.toggle('open')">
        <span class="week-num">Semana ${i + 1}</span>
        <span class="week-dates-label">${fmtDate(mon)} – ${fmtDate(wEnd)}</span>
        <span class="week-chevron">▼</span>
      </div>
      <div class="week-body">
        <div id="wmicros-${wk}"></div>
        <button class="btn-sm" style="width:auto;padding:5px 10px" onclick="addMicro('${wk}')">+ Agregar objetivo</button>
        <br>
        <button class="week-go-btn" onclick="goToWeek('${wk}')">Ver horario de esta semana →</button>
      </div>
    `;
    container.appendChild(row);
    renderMicros(wk);
  });
}

function renderMicros(wk) {
  const c = document.getElementById(`wmicros-${wk}`);
  if (!c) return;
  c.innerHTML = '';

  (AppState.weekMicros[wk] || []).forEach(mg => {
    const sp   = getSport(mg.sportId);
    const item = document.createElement('div');
    item.className = 'micro-item';
    item.innerHTML = `
      <div class="micro-check${mg.done ? ' done' : ''}" onclick="toggleMicro('${wk}','${mg.id}')">
        ${mg.done ? '✓' : ''}
      </div>
      <div style="width:7px;height:7px;border-radius:50%;background:${sp?.color || '#ccc'};flex-shrink:0;margin-top:3px"></div>
      <textarea class="micro-text${mg.done ? ' done' : ''}" placeholder="Objetivo...">${mg.text}</textarea>
      <button class="micro-del" onclick="delMicro('${wk}','${mg.id}')">×</button>
    `;
    item.querySelector('.micro-text').addEventListener('input', e => { mg.text = e.target.value; });
    c.appendChild(item);
  });
}

function toggleMicro(wk, id) {
  const mg = (AppState.weekMicros[wk] || []).find(m => m.id === id);
  if (mg) { mg.done = !mg.done; debouncedSave(); renderMicros(wk); }
}

function delMicro(wk, id) {
  debouncedSave();
  if (AppState.weekMicros[wk])
    AppState.weekMicros[wk] = AppState.weekMicros[wk].filter(m => m.id !== id);
  renderMicros(wk);
}

function addMicro(wk) {
  if (!AppState.weekMicros[wk]) AppState.weekMicros[wk] = [];
  debouncedSave();
  AppState.weekMicros[wk].push({ id: uid(), text: '', done: false, sportId: AppState.sports[0]?.id || '' });
  renderMicros(wk);
}

function goToWeek(wk) {
  currentWeekDate = parseDate(wk);
  switchTab('semana');
}
