// ═══════════════════════════════════════════════════════
// routines.js — Gestión de plantillas de rutina
// ═══════════════════════════════════════════════════════

function renderRoutines() {
  const grid = document.getElementById('routines-grid');
  grid.innerHTML = '';
  AppState.routines.forEach(r => grid.appendChild(buildRoutineCard(r)));
}

function buildRoutineCard(r) {
  const card = document.createElement('div');
  card.className = 'routine-card';

  card.innerHTML = `
    <div class="routine-card-header">
      <input class="routine-name" value="${r.name}" placeholder="Nombre de rutina">
      <div class="routine-dates">
        <span>Del</span>
        <input type="date" class="routine-date-input" value="${r.dateStart}"
               onchange="updateRoutineDate('${r.id}','start',this.value)">
        <span>al</span>
        <input type="date" class="routine-date-input" value="${r.dateEnd}"
               onchange="updateRoutineDate('${r.id}','end',this.value)">
      </div>
      <button class="routine-del" onclick="delRoutine('${r.id}')">×</button>
    </div>
    <div class="routine-days" id="rdays-${r.id}"></div>
  `;

  card.querySelector('.routine-name').addEventListener('input', e => { r.name = e.target.value; });

  const daysEl = card.querySelector(`#rdays-${r.id}`);
  DAY_KEYS.forEach(dk => {
    const dc = document.createElement('div');
    dc.className = 'routine-day';
    dc.innerHTML = `
      <div class="routine-day-name">${DAY_NAMES[dk]}</div>
      <div class="routine-day-body" id="rdb-${r.id}-${dk}"></div>
      <button class="btn-add-sport-block" onclick="openAddTemplateBlock('${r.id}','${dk}')">+ bloque</button>
    `;
    daysEl.appendChild(dc);
    renderTemplateBlocks(r, dk);
  });

  return card;
}

function renderTemplateBlocks(r, dk) {
  const body = document.getElementById(`rdb-${r.id}-${dk}`);
  if (!body) return;
  body.innerHTML = '';

  (r.days[dk] || []).forEach(block => {
    const sp = getSport(block.sportId);
    if (!sp) return;

    const div = document.createElement('div');
    div.className = 'routine-sport-block';
    div.style.background = hexToRgba(sp.color, 0.1);
    div.style.color = sp.color;

    div.innerHTML = `
      <div class="routine-sport-label">
        ${sp.emoji} ${sp.name}
        <button class="routine-block-del" onclick="delTemplateBlock('${r.id}','${dk}','${block.id}')">×</button>
      </div>
      <div class="routine-exercise-list" id="rex-${block.id}"></div>
      <button class="btn-add-ex" onclick="addTemplateEx('${r.id}','${dk}','${block.id}')">+ ejercicio</button>
    `;
    body.appendChild(div);
    renderTemplateExercises(block);
  });
}

function renderTemplateExercises(block) {
  const list = document.getElementById(`rex-${block.id}`);
  if (!list) return;
  list.innerHTML = '';

  block.exercises.forEach(ex => {
    const item = document.createElement('div');
    item.className = 'routine-exercise';
    item.innerHTML = `
      <span style="opacity:.4;font-size:9px">—</span>
      <input value="${ex.text}" placeholder="Ejercicio...">
      <button class="ex-del" onclick="delTemplateEx('${block.id}','${ex.id}')">×</button>
    `;
    item.querySelector('input').addEventListener('input', e => { ex.text = e.target.value; });
    list.appendChild(item);
  });
}

function openAddTemplateBlock(rid, dk) {
  window._modalCtx = { mode: 'template', rid, dk };
  populateSportSelect('block-sport-sel');
  document.getElementById('block-time-start').value = '';
  document.getElementById('block-time-end').value   = '';
  document.getElementById('modal-add-block-title').textContent = 'Agregar bloque a plantilla';
  openModal('modal-add-block');
}

function addTemplateEx(rid, dk, bid) {
  const r = AppState.routines.find(r => r.id === rid);
  if (!r) return;
  const b = (r.days[dk] || []).find(b => b.id === bid);
  if (!b) return;
  b.exercises.push({ id: uid(), text: '', done: false });
  debouncedSave();
  renderTemplateBlocks(r, dk);
}

function delTemplateEx(bid, eid) {
  AppState.routines.forEach(r => {
    DAY_KEYS.forEach(dk => {
      const b = (r.days[dk] || []).find(b => b.id === bid);
      if (b) b.exercises = b.exercises.filter(e => e.id !== eid);
  debouncedSave();
    });
  });
  renderRoutines();
}

function delTemplateBlock(rid, dk, bid) {
  const r = AppState.routines.find(r => r.id === rid);
  if (!r) return;
  r.days[dk] = (r.days[dk] || []).filter(b => b.id !== bid);
  debouncedSave();
  renderTemplateBlocks(r, dk);
}

function delRoutine(id) {
  if (!confirm('¿Eliminar esta rutina?')) return;
  AppState.routines = AppState.routines.filter(r => r.id !== id);
  debouncedSave();
  renderRoutines();
}

function updateRoutineDate(id, field, val) {
  const r = AppState.routines.find(r => r.id === id);
  if (!r) return;
  if (field === 'start') r.dateStart = val;
  else r.dateEnd = val;
}

function addRoutine() {
  const today = new Date();
  const end   = new Date(today);
  end.setMonth(end.getMonth() + 2);
  AppState.routines.push({
    id: uid(), name: 'Nueva rutina',
    dateStart: fmtDateInput(today),
    dateEnd:   fmtDateInput(end),
    days: { lun:[], mar:[], mie:[], jue:[], vie:[], sab:[], dom:[] }
  });
  renderRoutines();
}
