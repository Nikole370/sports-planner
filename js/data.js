// ═══════════════════════════════════════════════════════
// data.js — Estado y datos iniciales del planner
// ═══════════════════════════════════════════════════════

const COLORS = ['#2d5a27','#c4622d','#1e6b8c','#7c3d8a','#b5860d','#1a5e5e','#c4365a','#4a6741','#3b4da8','#7d5c1e','#555555','#1a7a4a'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_KEYS = ['lun','mar','mie','jue','vie','sab','dom'];
const DAY_NAMES = { lun:'Lun', mar:'Mar', mie:'Mié', jue:'Jue', vie:'Vie', sab:'Sáb', dom:'Dom' };
const DAY_FULL  = { lun:'Lunes', mar:'Martes', mie:'Miércoles', jue:'Jueves', vie:'Viernes', sab:'Sábado', dom:'Domingo' };

// ── Deportes / columnas ─────────────────────────────────
const DEFAULT_SPORTS = [
  { id:'s1', name:'Pre-entreno',         emoji:'⚡', color:'#7c3d8a' },
  { id:'s2', name:'Tenis',              emoji:'🎾', color:'#2d5a27' },
  { id:'s3', name:'Gym',                emoji:'💪', color:'#c4622d' },
  { id:'s4', name:'Intensidad Gym',     emoji:'🔥', color:'#b5860d' },
  { id:'s5', name:'Run',                emoji:'🏃', color:'#1e6b8c' },
  { id:'s6', name:'Pliometría',         emoji:'🦘', color:'#4a6741' },
  { id:'s7', name:'Flexibilidad',       emoji:'🧘', color:'#1a5e5e' },
  { id:'s8', name:'Extra',              emoji:'➕', color:'#555555' },
];

// ── Rutina base (cargada desde la tabla de la imagen) ───
const DEFAULT_ROUTINE = {
  id: 'r1',
  name: 'Rutina base',
  dateStart: '2025-03-03',
  dateEnd: '2027-12-31',
  days: {
    lun: [
      {
        id: 'b-lun-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e1',  text: 'Pre-tenis: movilidad tobillo + activación glúteo', done: false },
          { id: 'e2',  text: 'Pre-tenis: mini band walks', done: false },
          { id: 'e3',  text: 'Pre-tenis: skipping', done: false },
          { id: 'e4',  text: 'Pre-gym: warm up progresivo sentadilla', done: false },
          { id: 'e5',  text: 'Pre-gym: core activación', done: false },
        ]
      },
      {
        id: 'b-lun-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e6',  text: 'Consistencia', done: false },
          { id: 'e7',  text: 'Técnica derecha/revés', done: false },
          { id: 'e8',  text: 'Footwork suave', done: false },
        ]
      },
      {
        id: 'b-lun-3', sportId: 's3', timeStart: '07:00', timeEnd: '08:30',
        exercises: [
          { id: 'e9',  text: 'Sentadilla 4×5', done: false },
          { id: 'e10', text: 'Peso muerto 3×5', done: false },
          { id: 'e11', text: 'Bulgarian split squat 3×8', done: false },
          { id: 'e12', text: 'Hip thrust 3×8', done: false },
          { id: 'e13', text: 'Core anti-rotación 3×12', done: false },
        ]
      },
      {
        id: 'b-lun-4', sportId: 's4', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e14', text: 'Fuerza base', done: false },
          { id: 'e15', text: 'RPE 7-8', done: false },
          { id: 'e16', text: 'NO fallo muscular', done: false },
          { id: 'e17', text: 'Última serie exigente pero limpia', done: false },
        ]
      },
      {
        id: 'b-lun-5', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e18', text: '10-20 min post gym o tenis', done: false },
          { id: 'e19', text: 'Couch stretch 2×45s', done: false },
          { id: 'e20', text: 'Hamstring stretch 2×45s', done: false },
          { id: 'e21', text: 'Glute stretch 2×45s', done: false },
        ]
      },
      {
        id: 'b-lun-6', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e22', text: 'Día protector de rodillas + base atlética', done: false },
        ]
      },
    ],

    mar: [
      {
        id: 'b-mar-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e23', text: 'Pre-tenis: ladder drills', done: false },
          { id: 'e24', text: 'Pre-tenis: reaction drills', done: false },
          { id: 'e25', text: 'Pre-run: skipping + A-runs + movilidad cadera', done: false },
        ]
      },
      {
        id: 'b-mar-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e26', text: 'Drills velocidad', done: false },
          { id: 'e27', text: 'Puntos cortos', done: false },
          { id: 'e28', text: 'Saques', done: false },
        ]
      },
      {
        id: 'b-mar-3', sportId: 's5', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e29', text: '10 × 100m sprint', done: false },
          { id: 'e30', text: 'Descanso 45-60s', done: false },
        ]
      },
      {
        id: 'b-mar-4', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e31', text: 'Adductor stretch', done: false },
          { id: 'e32', text: 'Ankle mobility', done: false },
          { id: 'e33', text: 'Spine rotation', done: false },
        ]
      },
      {
        id: 'b-mar-5', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e34', text: 'Natación — mejora resistencia de partido', done: false },
        ]
      },
    ],

    mie: [
      {
        id: 'b-mie-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e35', text: 'Pre-gym técnico: PVC drills snatch', done: false },
          { id: 'e36', text: 'Pre-gym técnico: overhead mobility', done: false },
          { id: 'e37', text: 'Pre-gym técnico: thoracic activation', done: false },
          { id: 'e38', text: 'Pre-tenis: footwork suave', done: false },
        ]
      },
      {
        id: 'b-mie-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e39', text: 'Peloteo controlado', done: false },
          { id: 'e40', text: 'Timing', done: false },
        ]
      },
      {
        id: 'b-mie-3', sportId: 's3', timeStart: '07:00', timeEnd: '08:30',
        exercises: [
          { id: 'e41', text: 'Snatch técnico 6×2', done: false },
          { id: 'e42', text: 'Overhead squat 3×5', done: false },
          { id: 'e43', text: 'Snatch pull 3×4', done: false },
          { id: 'e44', text: 'Mobility hombro 15 min', done: false },
        ]
      },
      {
        id: 'b-mie-4', sportId: 's4', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e45', text: 'Técnica neural', done: false },
          { id: 'e46', text: 'RPE 6', done: false },
          { id: 'e47', text: '100% técnica', done: false },
          { id: 'e48', text: 'Si falla técnica → bajar peso', done: false },
        ]
      },
      {
        id: 'b-mie-5', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e49', text: '10-20 min post gym o tenis', done: false },
          { id: 'e50', text: 'Shoulder CARs', done: false },
          { id: 'e51', text: 'Overhead stretch', done: false },
          { id: 'e52', text: 'Thoracic extension', done: false },
        ]
      },
      {
        id: 'b-mie-6', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e53', text: 'Día neuromuscular + coordinación', done: false },
        ]
      },
    ],

    jue: [
      {
        id: 'b-jue-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e54', text: 'Pre-gym upper: rotadores hombro', done: false },
          { id: 'e55', text: 'Pre-gym upper: activación escápula', done: false },
          { id: 'e56', text: 'Pre-tenis: movilidad dinámica', done: false },
        ]
      },
      {
        id: 'b-jue-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e57', text: 'Tenis medio (1.5-2h)', done: false },
        ]
      },
      {
        id: 'b-jue-3', sportId: 's3', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e58', text: 'Press banca 4×5', done: false },
          { id: 'e59', text: 'Remo barra o polea 4×6', done: false },
          { id: 'e60', text: 'Press militar 3×6', done: false },
          { id: 'e61', text: 'Face pulls 3×12', done: false },
          { id: 'e62', text: 'Core rotacional 3×10', done: false },
        ]
      },
      {
        id: 'b-jue-4', sportId: 's4', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e63', text: 'Upper power', done: false },
          { id: 'e64', text: 'RPE 7', done: false },
          { id: 'e65', text: 'Press banca NO al fallo', done: false },
        ]
      },
      {
        id: 'b-jue-5', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e66', text: '10-20 min post gym o tenis', done: false },
          { id: 'e67', text: 'Pec stretch', done: false },
          { id: 'e68', text: 'Lat stretch', done: false },
          { id: 'e69', text: 'Rotadores hombro', done: false },
        ]
      },
      {
        id: 'b-jue-6', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e70', text: 'Natación — mejora potencia saque + estabilidad hombro', done: false },
        ]
      },
    ],

    vie: [
      {
        id: 'b-vie-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e71', text: 'Pre-pliometría: pogos suaves', done: false },
          { id: 'e72', text: 'Pre-pliometría: skips', done: false },
          { id: 'e73', text: 'Pre-pliometría: landing mechanics', done: false },
        ]
      },
      {
        id: 'b-vie-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e74', text: 'Tenis táctico (2h)', done: false },
          { id: 'e75', text: 'Sets estratégicos', done: false },
          { id: 'e76', text: 'Puntos largos', done: false },
        ]
      },
      {
        id: 'b-vie-3', sportId: 's5', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e77', text: '20-25 min ritmo medio', done: false },
        ]
      },
      {
        id: 'b-vie-4', sportId: 's6', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e78', text: '— Nivel actual —', done: false },
          { id: 'e79', text: 'Skipping en sitio', done: false },
          { id: 'e80', text: 'Saltos laterales cortos', done: false },
          { id: 'e81', text: 'Jump rope (cuerda)', done: false },
          { id: 'e82', text: 'Split jumps', done: false },
          { id: 'e83', text: '— Nivel medio —', done: false },
          { id: 'e84', text: 'Box jumps', done: false },
          { id: 'e85', text: 'Lateral bounds cortos', done: false },
          { id: 'e86', text: 'Pogo jumps', done: false },
          { id: 'e87', text: '— Nivel avanzado —', done: false },
          { id: 'e88', text: 'Reactive jumps', done: false },
          { id: 'e89', text: 'Drop jumps', done: false },
          { id: 'e90', text: 'Shuffle + salto', done: false },
        ]
      },
      {
        id: 'b-vie-5', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e91', text: 'Hip flexor', done: false },
          { id: 'e92', text: 'Hamstring', done: false },
          { id: 'e93', text: 'Calf', done: false },
        ]
      },
      {
        id: 'b-vie-6', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e94', text: 'Simula fatiga real de partido', done: false },
        ]
      },
    ],

    sab: [
      {
        id: 'b-sab-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e95', text: 'Pre-halterofilia: cleans con barra vacía', done: false },
          { id: 'e96', text: 'Pre-halterofilia: saltos suaves', done: false },
          { id: 'e97', text: 'Pre-halterofilia: activación core', done: false },
        ]
      },
      {
        id: 'b-sab-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e98', text: 'Tenis libre o partido', done: false },
        ]
      },
      {
        id: 'b-sab-3', sportId: 's3', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e99',  text: 'Power clean 5×3', done: false },
          { id: 'e100', text: 'Hang clean 4×3', done: false },
          { id: 'e101', text: 'Push press 4×4', done: false },
          { id: 'e102', text: 'Jump squat 3×5', done: false },
          { id: 'e103', text: 'Medicine ball throws', done: false },
        ]
      },
      {
        id: 'b-sab-4', sportId: 's4', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e104', text: 'Potencia máxima', done: false },
          { id: 'e105', text: 'RPE 8-9', done: false },
          { id: 'e106', text: 'Pero pocas reps', done: false },
          { id: 'e107', text: '⚠️ Halterofilia NUNCA al fallo', done: false },
        ]
      },
      {
        id: 'b-sab-5', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e108', text: '10-20 min post gym o tenis', done: false },
        ]
      },
      {
        id: 'b-sab-6', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e109', text: 'Si partido 3h → NO hacer gym ese día', done: false },
          { id: 'e110', text: 'Natación', done: false },
        ]
      },
    ],

    dom: [
      {
        id: 'b-dom-1', sportId: 's1', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e111', text: 'Solo movilidad + activación ligera', done: false },
        ]
      },
      {
        id: 'b-dom-2', sportId: 's2', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e112', text: 'Partido', done: false },
        ]
      },
      {
        id: 'b-dom-3', sportId: 's7', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e113', text: '— Cadera —', done: false },
          { id: 'e114', text: 'Couch stretch', done: false },
          { id: 'e115', text: 'Frog stretch', done: false },
          { id: 'e116', text: 'Hip CARs', done: false },
          { id: 'e117', text: 'Middle split progression', done: false },
          { id: 'e118', text: '— Isquios —', done: false },
          { id: 'e119', text: 'Pancake stretch', done: false },
          { id: 'e120', text: 'Jefferson curl ligero', done: false },
          { id: 'e121', text: 'Active hamstring raises', done: false },
          { id: 'e122', text: '— Tobillo —', done: false },
          { id: 'e123', text: 'Dorsiflexión movilidad', done: false },
          { id: 'e124', text: '— Hombro —', done: false },
          { id: 'e125', text: 'Shoulder CARs', done: false },
          { id: 'e126', text: 'Wall slides', done: false },
          { id: 'e127', text: 'Overhead mobility', done: false },
        ]
      },
      {
        id: 'b-dom-4', sportId: 's8', timeStart: '', timeEnd: '',
        exercises: [
          { id: 'e128', text: 'Partido fuerte', done: false },
          { id: 'e129', text: 'Movilidad + stretching', done: false },
        ]
      },
    ],
  }
};

// ── Estado global ────────────────────────────────────────
const AppState = {
  sports:       JSON.parse(JSON.stringify(DEFAULT_SPORTS)),
  routines:     [JSON.parse(JSON.stringify(DEFAULT_ROUTINE))],
  weekChecks:   {},   // weekKey → dayKey → blockId → exerciseId → bool
  weekNotes:    {},   // weekKey → dayKey → string
  weekExtra:    {},   // weekKey → dayKey → [block]
  macroGoals: [
    { id:'m1', sportId:'s2', text:'Mejorar nivel competitivo en tenis', desc:'Jugar partidos con desconocidos sintiéndome segura y consistente', deadline:'Mayo 2025' },
    { id:'m2', sportId:'s3', text:'Desarrollar potencia y fuerza base', desc:'4 días/semana de gym sostenidos, progresar en levantamientos', deadline:'Abril 2025' },
    { id:'m3', sportId:'s5', text:'Mejorar resistencia aeróbica', desc:'Series cortas 2×/semana para aguantar sets largos', deadline:'Mayo 2025' },
  ],
  monthObjectives: {
    '2025-03': [
      { id:'mo1', sportId:'s2', text:'Consistencia en rally: 10+ golpes seguidos' },
      { id:'mo2', sportId:'s3', text:'Completar los 4 días de gym cada semana' },
    ],
    '2025-04': [{ id:'mo3', sportId:'s3', text:'Aumentar peso en press banca' }],
    '2025-05': [
      { id:'mo4', sportId:'s2', text:'Jugar partido con desconocidos ✨' },
      { id:'mo5', sportId:'s2', text:'Aguantar 3 sets completos sin bajar el nivel' },
    ],
  },
  weekMicros: {
    '2025-03-03': [
      { id:'wm1', text:'Mejorar primer servicio', done:false, sportId:'s2' },
      { id:'wm2', text:'Sentadilla 4×5 con buena técnica', done:false, sportId:'s3' },
    ],
    '2025-03-10': [
      { id:'wm3', text:'Rally 10 golpes 3 veces por sesión', done:false, sportId:'s2' },
    ],
  },
};
