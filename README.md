# Zenith Flow

Zenith Flow es una aplicación web de productividad construida con React y Vite. Incluye un tablero Kanban, un panel de estadísticas y persistencia local con IndexedDB para simular un flujo de trabajo serverless sin exponer una base de datos externa.

## Características

- Tablero Kanban con arrastrar y soltar.
- Panel de productividad con métricas visuales.
- Búsqueda y filtrado por prioridad.
- Editor de tareas con modal y checklist.
- Persistencia local en el navegador con IndexedDB.
- Interfaz oscura con estilo glassmorphism.

## Tecnologías

- React 18
- Vite
- React Bootstrap
- Bootstrap 5
- Bootstrap Icons
- IndexedDB

## Requisitos

- Node.js 18 o superior.
- npm.

## Instalación

```bash
npm install
```

## Ejecutar en local

```bash
npm run dev
```

## Compilar para producción

```bash
npm run build
```

## Vista previa de la build

```bash
npm run preview
```

## Estructura del proyecto

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    Dashboard.jsx
    KanbanBoard.jsx
    Navigation.jsx
    TaskCard.jsx
    TaskModal.jsx
  services/
    db.js
    localDB.js
```

## Seguridad y publicación

Este proyecto no usa variables de entorno ni credenciales externas en el código actual. La persistencia se maneja con IndexedDB en el navegador, así que no hay base de datos remota que debas exponer al publicar el repositorio.

Antes de hacer push a GitHub, verifica que no incluyes archivos sensibles como:

- `.env`
- credenciales privadas
- archivos de configuración local del editor
- `node_modules/`
- `dist/`

## Notas

- Los datos se guardan localmente en el navegador.
- Si borras el almacenamiento del navegador, también se eliminarán las tareas guardadas.
- El proyecto puede usarse como base para conectarlo luego a una API o base de datos real.