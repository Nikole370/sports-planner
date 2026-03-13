// ═══════════════════════════════════════════════════════
// week.js — Vista semanal + checklist colapsable
// ═══════════════════════════════════════════════════════

let currentWeekDate = weekStart(new Date());

// Guarda qué bloques están expandidos: "wk-dk-bid" → bool
// Por default hoy expandido, resto colapsado
const expandedBlocks = new Set();

function prevWeek() { currentWeekDate = addDays(currentWeekDate, -7); renderWeekView(); }
function nextWeek() { currentWeekDate = addDays(currentWeekDate,  7); renderWeekView(); }

function toggleBlock(key) {
  if (expandedBlocks.has(key)) expandedBlocks.delete(key);
  else expandedBlocks.add(key);
  // Solo re-renderiza el bloque, no toda la vista
  const wrap = document.getElementById('bwrap-' + key);
  if (wrap) _applyBlockExpand(wrap, key);
}

function _applyBlockExpand(wrap, key) {
  const body    = wrap.querySelector('.block-body');
  const chevron = wrap.querySelector('.block-chevron');
  const isOpen  = expandedBlocks.has(key);
  body.style.display    = isOpen ? 'block' : 'none';
  chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
}

function renderWeekView() {
  const wk      = weekKey(currentWeekDate);
  const wStart  = weekStart(currentWeekDate);
  const routine = getActiveRoutine(wk);

  // nav label
  const wEnd = addDays(wStart, 6);
  document.getElementById('week-nav-label').textContent =
    `${fmtDate(wStart)} – ${fmtDate(wEnd)} ${wStart.getFullYear()}`;

  // routine badge
  const badge = document.getElementById('active-routine-badge');
  badge.innerHTML = routine
    ? `<span class="routine-badge">🔁 ${routine.name}</span>`
    : `<span class="no-routine-badge">Sin rutina asignada</span>`;

  const checks = getWeekChecks(wk);
  const notes  = getWeekNotes(wk);
  const extras = getWeekSchedule(wk);

  const todayWk  = weekKey(new Date());
  const todayIdx = (new Date().getDay() || 7) - 1;

  const grid = document.getElementById('week-grid');
  grid.innerHTML = '';

  DAY_KEYS.forEach((dk, i) => {
    const dayDate = addDays(wStart, i);
    const isToday = wk === todayWk && i === todayIdx;

    const templateBlocks = routine?.days[dk] || [];
    const extraBlocks    = extras[dk] || [];
    const allBlocks      = [...templateBlocks, ...extraBlocks];

    // day-level progress
    let total = 0, done = 0;
    allBlocks.forEach(b => {
      b.exercises.forEach(ex => {
        total++;
        if (checks[dk]?.[b.id]?.[ex.id]) done++;
      });
    });
    const pct = total > 0 ? Math.round(done / total * 100) : 0;

    const col = document.createElement('div');
    col.className = 'day-col' + (isToday ? ' today' : '');
    col.innerHTML = `
      <div class="day-header">
        <div>
          <div class="day-name">${DAY_NAMES[dk]}</div>
          <div class="day-date">${fmtDate(dayDate)}</div>
        </div>
        ${total > 0 ? `<div class="day-done-badge" style="color:${pct===100?'var(--accent)':'var(--accent2)'}">${done}/${total}</div>` : ''}
      </div>
      ${total > 0 ? `
        <div class="day-progress" title="${done}/${total} ejercicios">
          <div class="day-progress-fill" style="width:${pct}%;background:${pct === 100 ? 'var(--accent)' : 'var(--accent2)'}"></div>
        </div>` : ''}
      <div class="day-body" id="dbody-${dk}"></div>
      <button class="btn-add-block" onclick="openAddWeekBlock('${wk}','${dk}')">+ bloque</button>
      <div class="day-note-wrap">
        <textarea class="day-note" placeholder="📝 Nota...">${notes[dk] || ''}</textarea>
      </div>
    `;
    grid.appendChild(col);

    col.querySelector('.day-note').addEventListener('input', e => {
      notes[dk] = e.target.value;
      debouncedSave();
    });

    const body = col.querySelector(`#dbody-${dk}`);
    const templateIds = new Set(templateBlocks.map(b => b.id));

    allBlocks.forEach(block => {
      renderWeekBlock(body, block, wk, dk, templateIds.has(block.id), isToday);
    });
  });
}

// ── Render one sport block (colapsable) ──────────────────
function renderWeekBlock(container, block, wk, dk, isTemplate, isToday) {
  const sp = getSport(block.sportId);
  if (!sp) return;

  const checks = getWeekChecks(wk);
  if (!checks[dk])           checks[dk]           = {};
  if (!checks[dk][block.id]) checks[dk][block.id] = {};

  // block-level progress
  let bTotal = 0, bDone = 0;
  block.exercises.forEach(ex => {
    bTotal++;
    if (checks[dk][block.id][ex.id]) bDone++;
  });
  const bPct  = bTotal > 0 ? Math.round(bDone / bTotal * 100) : 0;
  const bFull = bTotal > 0 && bDone === bTotal;

  const key = `${wk}-${dk}-${block.id}`;

  // Auto-expand today's blocks on first render
  if (isToday && !expandedBlocks.has('_init_' + key)) {
    expandedBlocks.add(key);
    expandedBlocks.add('_init_' + key);
  }

  const isOpen = expandedBlocks.has(key);
  const hasTime = block.timeStart || block.timeEnd;

  const wrap = document.createElement('div');
  wrap.className = 'sport-block' + (bFull ? ' block-complete' : '');
  wrap.id = 'bwrap-' + key;
  wrap.style.background  = hexToRgba(sp.color, bFull ? 0.15 : 0.08);
  wrap.style.borderColor = hexToRgba(sp.color, bFull ? 0.4 : 0.18);
  wrap.style.color       = sp.color;

  // mini progress dots
  const dots = bTotal > 0
    ? `<div class="block-dots">${Array.from({length: bTotal}, (_, i) =>
        `<div class="block-dot${i < bDone ? ' done' : ''}" style="background:${i < bDone ? sp.color : 'transparent'};border-color:${sp.color}"></div>`
      ).join('')}</div>`
    : '';

  wrap.innerHTML = `
    <div class="sport-block-header" onclick="toggleBlock('${key}')" style="cursor:pointer">
      <div class="sport-block-title">
        ${bFull ? '✓' : sp.emoji} ${sp.name}
        ${dots}
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        ${hasTime ? `<span class="block-time-chip">${block.timeStart}${block.timeEnd ? '–'+block.timeEnd : ''}</span>` : ''}
        <button class="sport-block-del" onclick="event.stopPropagation();delWeekBlock('${wk}','${dk}','${block.id}',${isTemplate})">×</button>
        <span class="block-chevron" style="font-size:9px;transition:transform .2s;transform:${isOpen?'rotate(180deg)':'rotate(0deg)'}">▼</span>
      </div>
    </div>

    <div class="block-body" style="display:${isOpen ? 'block' : 'none'}">
      ${hasTime ? `
        <div class="block-time-edit">
          <input data-f="start" value="${block.timeStart}" placeholder="inicio" style="color:${sp.color}">
          <span style="opacity:.4;font-size:10px">–</span>
          <input data-f="end"   value="${block.timeEnd}"   placeholder="fin"    style="color:${sp.color}">
        </div>` : ''}
      <div class="check-list" id="cl-${wk}-${dk}-${block.id}"></div>
      <button class="btn-add-check" onclick="addCheckItem('${wk}','${dk}','${block.id}',${isTemplate})">+ ejercicio</button>
    </div>
  `;

  wrap.querySelectorAll('.block-time-edit input').forEach(inp => {
    inp.addEventListener('click', e => e.stopPropagation());
    inp.addEventListener('change', e => {
      if (e.target.dataset.f === 'start') block.timeStart = e.target.value;
      else block.timeEnd = e.target.value;
      debouncedSave();
    });
  });

  container.appendChild(wrap);
  renderCheckList(block, wk, dk);
}

// ── Checklist items ──────────────────────────────────────
function renderCheckList(block, wk, dk) {
  const cl = document.getElementById(`cl-${wk}-${dk}-${block.id}`);
  if (!cl) return;
  cl.innerHTML = '';

  const checks = getWeekChecks(wk);
  if (!checks[dk])           checks[dk]           = {};
  if (!checks[dk][block.id]) checks[dk][block.id] = {};

  const sp = getSport(block.sportId);

  block.exercises.forEach(ex => {
    const done    = !!checks[dk][block.id][ex.id];
    const isHeader = ex.text.startsWith('—') && ex.text.endsWith('—');

    if (isHeader) {
      // render as section separator
      const sep = document.createElement('div');
      sep.className = 'check-section-header';
      sep.style.color = sp?.color || '#888';
      sep.textContent = ex.text;
      cl.appendChild(sep);
      return;
    }

    const item = document.createElement('div');
    item.className = 'check-item';
    item.innerHTML = `
      <div class="check-box${done ? ' done' : ''}"
           style="border-color:${sp?.color || '#888'}"
           onclick="toggleCheck('${wk}','${dk}','${block.id}','${ex.id}')"></div>
      <input class="check-label${done ? ' done' : ''}"
             value="${ex.text}"
             placeholder="Ejercicio..."
             style="color:${sp?.color || 'inherit'}">
      <button class="check-item-del"
              onclick="delCheckItem('${wk}','${dk}','${block.id}','${ex.id}',false)">×</button>
    `;
    item.querySelector('.check-label').addEventListener('input', e => {
      ex.text = e.target.value;
      debouncedSave();
    });
    cl.appendChild(item);
  });
}

function toggleCheck(wk, dk, bid, eid) {
  const checks = getWeekChecks(wk);
  if (!checks[dk])      checks[dk]      = {};
  if (!checks[dk][bid]) checks[dk][bid] = {};
  checks[dk][bid][eid] = !checks[dk][bid][eid];
  debouncedSave();
  // Refresh only the block header (dots + color) + day header (progress)
  // Full re-render is simpler and fast enough
  renderWeekView();
}

function addCheckItem(wk, dk, bid, isTemplate) {
  const block = _findBlock(wk, dk, bid, isTemplate);
  if (!block) return;
  block.exercises.push({ id: uid(), text: '', done: false });
  debouncedSave();
  renderWeekView();
}

function delCheckItem(wk, dk, bid, eid, isTemplate) {
  const block = _findBlock(wk, dk, bid, isTemplate);
  if (!block) return;
  block.exercises = block.exercises.filter(e => e.id !== eid);
  debouncedSave();
  renderWeekView();
}

function delWeekBlock(wk, dk, bid, isTemplate) {
  if (isTemplate) {
    AppState.routines.forEach(r => {
      if (r.days[dk]) r.days[dk] = r.days[dk].filter(b => b.id !== bid);
    });
  } else {
    const extras = getWeekSchedule(wk);
    if (extras[dk]) extras[dk] = extras[dk].filter(b => b.id !== bid);
  }
  debouncedSave();
  renderWeekView();
}

function openAddWeekBlock(wk, dk) {
  window._modalCtx = { mode: 'week', wk, wdk: dk };
  populateSportSelect('block-sport-sel');
  document.getElementById('block-time-start').value = '';
  document.getElementById('block-time-end').value   = '';
  document.getElementById('modal-add-block-title').textContent = 'Agregar bloque a esta semana';
  openModal('modal-add-block');
}

function saveBlock() {
  const sid = document.getElementById('block-sport-sel').value;
  const ts  = document.getElementById('block-time-start').value;
  const te  = document.getElementById('block-time-end').value;
  const ctx = window._modalCtx;

  if (ctx.mode === 'template') {
    const r = AppState.routines.find(r => r.id === ctx.rid);
    if (!r) return;
    if (!r.days[ctx.dk]) r.days[ctx.dk] = [];
    r.days[ctx.dk].push({ id: uid(), sportId: sid, timeStart: ts, timeEnd: te, exercises: [] });
    closeModal('modal-add-block');
    renderRoutines();
  } else {
    const extras = getWeekSchedule(ctx.wk);
    if (!extras[ctx.wdk]) extras[ctx.wdk] = [];
    extras[ctx.wdk].push({ id: uid(), sportId: sid, timeStart: ts, timeEnd: te, exercises: [{ id: uid(), text: '', done: false }] });
    debouncedSave();
    closeModal('modal-add-block');
    renderWeekView();
  }
}

// ── Internal helper ──────────────────────────────────────
function _findBlock(wk, dk, bid, isTemplate) {
  if (isTemplate) {
    for (const r of AppState.routines) {
      const b = (r.days[dk] || []).find(b => b.id === bid);
      if (b) return b;
    }
  } else {
    const extras = getWeekSchedule(wk);
    return (extras[dk] || []).find(b => b.id === bid) || null;
  }
  return null;
}

function toggleAllBlocks() {
  const btn = document.getElementById('btn-collapse-all');
  const anyOpen = DAY_KEYS.some(dk =>
    document.querySelector(`#dbody-${dk} .block-body[style*="block"]`)
  );
  if (anyOpen) {
    // Contraer todos
    expandedBlocks.forEach(k => { if (!k.startsWith('_init_')) expandedBlocks.delete(k); });
    document.querySelectorAll('.block-body').forEach(b => b.style.display = 'none');
    document.querySelectorAll('.block-chevron').forEach(c => c.style.transform = 'rotate(0deg)');
    btn.textContent = '⊞ Expandir todo';
  } else {
    // Expandir todos
    document.querySelectorAll('[id^="bwrap-"]').forEach(wrap => {
      const key = wrap.id.replace('bwrap-', '');
      expandedBlocks.add(key);
      wrap.querySelector('.block-body').style.display = 'block';
      wrap.querySelector('.block-chevron').style.transform = 'rotate(180deg)';
    });
    btn.textContent = '⊟ Contraer todo';
  }
}