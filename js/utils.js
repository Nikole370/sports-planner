// ═══════════════════════════════════════════════════════
// utils.js — Funciones de utilidad
// ═══════════════════════════════════════════════════════

const uid = () => 'x' + Math.random().toString(36).substr(2, 8);

const getSport = id => AppState.sports.find(s => s.id === id);

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Lunes de la semana ISO que contiene `date` */
function weekStart(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Clave de semana: "YYYY-MM-DD" del lunes */
function weekKey(date) {
  const d = weekStart(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function fmtDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

function fmtDateInput(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Retorna la rutina activa para una fecha de semana (string YYYY-MM-DD) */
function getActiveRoutine(weekDateStr) {
  const wDate = parseDate(weekDateStr);
  return AppState.routines.find(r => {
    const ds = parseDate(r.dateStart);
    const de = parseDate(r.dateEnd);
    return wDate >= ds && wDate <= de;
  }) || null;
}

function getWeekSchedule(wk) {
  if (!AppState.weekExtra[wk]) AppState.weekExtra[wk] = {};
  return AppState.weekExtra[wk];
}

function getWeekNotes(wk) {
  if (!AppState.weekNotes[wk]) AppState.weekNotes[wk] = {};
  return AppState.weekNotes[wk];
}

function getWeekChecks(wk) {
  if (!AppState.weekChecks[wk]) AppState.weekChecks[wk] = {};
  return AppState.weekChecks[wk];
}

function populateSportSelect(elId) {
  const sel = document.getElementById(elId);
  sel.innerHTML = AppState.sports
    .map(s => `<option value="${s.id}">${s.emoji} ${s.name}</option>`)
    .join('');
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ═══════════════════════════════════════════════════════
// PERSISTENCIA — localStorage
// ═══════════════════════════════════════════════════════
const STORAGE_KEY = 'marsi-planner-v1';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sports:          AppState.sports,
      routines:        AppState.routines,
      weekChecks:      AppState.weekChecks,
      weekNotes:       AppState.weekNotes,
      weekExtra:       AppState.weekExtra,
      macroGoals:      AppState.macroGoals,
      monthObjectives: AppState.monthObjectives,
      weekMicros:      AppState.weekMicros,
    }));
  } catch(e) { console.warn('localStorage error:', e); }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (s.sports)          AppState.sports          = s.sports;
    if (s.routines)        AppState.routines        = s.routines;
    if (s.weekChecks)      AppState.weekChecks      = s.weekChecks;
    if (s.weekNotes)       AppState.weekNotes       = s.weekNotes;
    if (s.weekExtra)       AppState.weekExtra       = s.weekExtra;
    if (s.macroGoals)      AppState.macroGoals      = s.macroGoals;
    if (s.monthObjectives) AppState.monthObjectives = s.monthObjectives;
    if (s.weekMicros)      AppState.weekMicros      = s.weekMicros;
    return true;
  } catch(e) { console.warn('loadState error:', e); return false; }
}

let _saveTimer = null;
function debouncedSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(saveState, 500);
}
