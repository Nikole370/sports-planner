# 🏋️ Sports Planner — Marsi

Planner deportivo personal semanal. Sin frameworks, sin servidor, sin build steps.  
Un archivo HTML + CSS + JS modulares. Ábrelo en el navegador y listo.

**[→ Ver demo en vivo](https://tu-usuario.github.io/sports-planner)**

---

## ✨ Features

- **Rutinas con rango de fechas** — define una semana tipo, asígnale inicio y fin. Cuando termina el rango, creas una nueva rutina con los cambios que quieras. El planner detecta automáticamente qué rutina corresponde a cada semana.
- **Checklist por categoría por día** — cada día muestra bloques separados por deporte/categoría (Pre-entreno, Tenis, Gym, Run, Pliometría, Flexibilidad...). Dentro de cada bloque, lista de ejercicios con checkbox.
- **Los ejercicios vienen de la plantilla** y se reutilizan cada semana. Los checks se resetean cada lunes — marcas lo que hiciste ese día.
- **Barra de progreso** por día basada en ejercicios completados.
- **3 niveles de objetivos** — macro (generales), por mes y microobjetivos por semana con checkboxes.
- **Todo editable inline** — haz clic en cualquier texto para editarlo.
- **Exportar** como imagen PNG o imprimir como PDF.
- **Sidebar colapsable** con gestión de categorías deportivas.

---

## 📁 Estructura del proyecto

```
sports-planner/
│
├── index.html          # HTML puro, sin JS inline
│
├── css/
│   └── style.css       # Todos los estilos
│
├── js/
│   ├── data.js         # Estado global + datos iniciales (tu rutina de la tabla)
│   ├── utils.js        # Funciones de utilidad (fechas, colores, modales)
│   ├── week.js         # Vista semanal + lógica de checklist
│   ├── routines.js     # Tab de rutinas / plantillas
│   ├── objectives.js   # Tab de objetivos (macro / mes / semana)
│   └── app.js          # Sidebar, tabs, export, init
│
└── README.md
```

### Orden de carga de scripts (importante)

Los scripts se cargan al final del `<body>` en este orden:

```html
<script src="js/data.js"></script>       <!-- 1. Estado y datos -->
<script src="js/utils.js"></script>      <!-- 2. Helpers -->
<script src="js/week.js"></script>       <!-- 3. Vista semana -->
<script src="js/routines.js"></script>   <!-- 4. Rutinas -->
<script src="js/objectives.js"></script> <!-- 5. Objetivos -->
<script src="js/app.js"></script>        <!-- 6. Init -->
```

---

## 🚀 Cómo usar localmente

Solo abre `index.html` en tu navegador:

```bash
# Opción 1: doble clic en index.html

# Opción 2: con un servidor local (evita problemas de CORS en algunos browsers)
npx serve .
# o
python -m http.server 8000
```

> ⚠️ En algunos navegadores, abrir el archivo directamente con `file://` puede bloquear la fuente de Google Fonts. Con un servidor local funciona perfectamente.

---

## 🌐 Deploy en GitHub Pages

**1. Renombra / verifica que el archivo principal sea `index.html`** ✓

**2. Crea el repositorio**
- Ve a [github.com/new](https://github.com/new)
- Nombre: `sports-planner`
- Visibilidad: **Public**
- Sin README inicial (ya tienes este)

**3. Sube los archivos**

```bash
git init
git add .
git commit -m "Initial commit: sports planner"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sports-planner.git
git push -u origin main
```

**4. Activa GitHub Pages**
- Repositorio → **Settings** → **Pages**
- Source: `Deploy from a branch`
- Branch: `main` / Folder: `/ (root)`
- Clic en **Save**

**5. Tu planner estará en:**
```
https://TU-USUARIO.github.io/sports-planner
```

---

## ✏️ Personalizar tu rutina

Los datos iniciales (tu tabla semanal completa) están en `js/data.js`.

Para modificar ejercicios, editar directamente en el archivo:

```js
// js/data.js → DEFAULT_ROUTINE → days → lun / mar / mie ...
{
  id: 'b-lun-3', sportId: 's3', timeStart: '07:00', timeEnd: '08:30',
  exercises: [
    { id: 'e9',  text: 'Sentadilla 4×5', done: false },
    { id: 'e10', text: 'Peso muerto 3×5', done: false },
    // agrega o elimina aquí
  ]
}
```

Para agregar una categoría nueva, agrega un objeto en `DEFAULT_SPORTS`:

```js
{ id: 's9', name: 'Natación', emoji: '🏊', color: '#1e6b8c' }
```

---

## 🛠️ Tech

- HTML5 + CSS3 + JavaScript vanilla
- [Google Fonts](https://fonts.google.com) — Syne + Outfit
- [html2canvas](https://html2canvas.hertzen.com/) — exportar PNG (CDN)
- Sin npm, sin bundler, sin dependencias locales

---

## 📄 Licencia

MIT — úsalo, modifícalo, compártelo.