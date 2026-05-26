import { DatabaseService } from './db';

const DB_NAME = 'ZenithFlowDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

// Simulated latency to mimic a serverless database roundtrip (in milliseconds)
const LATENCY_MS = 600;

export class LocalDatabaseService extends DatabaseService {
  constructor() {
    super();
    this.dbPromise = this._initDB();
  }

  // Initialize IndexedDB
  _initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB open error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  // Helper function to simulate serverless network delay
  _delay(ms = LATENCY_MS) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Helper to trigger database sync status events
  _notifyStatus(status, message) {
    const event = new CustomEvent('db-sync-status', {
      detail: { status, message, timestamp: new Date() }
    });
    window.dispatchEvent(event);
  }

  /**
   * Fetch all tasks from IndexedDB.
   */
  async getTasks() {
    this._notifyStatus('loading', 'Obteniendo datos del servidor serverless...');
    await this._delay();
    const db = await this.dbPromise;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const tasks = request.result || [];
        this._notifyStatus('success', 'Datos sincronizados desde la base de datos.');
        resolve(tasks);
      };

      request.onerror = (event) => {
        this._notifyStatus('error', 'Error al obtener datos del servidor.');
        reject(event.target.error);
      };
    });
  }

  /**
   * Create or update a task.
   */
  async saveTask(task) {
    this._notifyStatus('saving', 'Sincronizando cambios con la nube local...');
    await this._delay();
    const db = await this.dbPromise;

    // Ensure taskId exists
    if (!task.id) {
      task.id = 'task_' + Math.random().toString(36).substr(2, 9);
      task.createdAt = new Date().toISOString();
    }
    task.updatedAt = new Date().toISOString();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(task);

      request.onsuccess = () => {
        this._notifyStatus('success', 'Cambios guardados en la base de datos serverless.');
        resolve(task);
      };

      request.onerror = (event) => {
        this._notifyStatus('error', 'Error al guardar los cambios.');
        reject(event.target.error);
      };
    });
  }

  /**
   * Delete a task.
   */
  async deleteTask(taskId) {
    this._notifyStatus('saving', 'Borrando tarea del servidor...');
    await this._delay();
    const db = await this.dbPromise;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(taskId);

      request.onsuccess = () => {
        this._notifyStatus('success', 'Tarea eliminada exitosamente.');
        resolve(true);
      };

      request.onerror = (event) => {
        this._notifyStatus('error', 'Error al eliminar la tarea.');
        reject(event.target.error);
      };
    });
  }

  /**
   * Seed the database with high-quality default data.
   */
  async seedDefaultData() {
    const existing = await this.getTasks();
    if (existing && existing.length > 0) {
      return existing;
    }

    const defaultTasks = [
      {
        id: 'default_1',
        title: 'Configurar Repositorio y Entorno',
        description: 'Inicializar el proyecto React + Vite con Bootstrap 5 para el portafolio, estructurando los componentes y assets básicos.',
        status: 'done',
        priority: 'high',
        tags: ['Configuración', 'Frontend'],
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
        checklist: [
          { id: 'c1_1', text: 'Crear configuración en package.json', done: true },
          { id: 'c1_2', text: 'Estructurar carpetas del código fuente', done: true },
          { id: 'c1_3', text: 'Configurar Bootstrap e iconos', done: true }
        ],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'default_2',
        title: 'Implementar Base de Datos Serverless Simulado',
        description: 'Construir el adaptador de base de datos local utilizando `IndexedDB` con retrasos de red artificiales (`setTimeout`) y eventos de sincronización para simular un backend en la nube.',
        status: 'in-progress',
        priority: 'high',
        tags: ['Almacenamiento', 'IndexedDB'],
        dueDate: new Date().toISOString().split('T')[0], // today
        checklist: [
          { id: 'c2_1', text: 'Crear interfaz abstracta en db.js', done: true },
          { id: 'c2_2', text: 'Configurar IndexedDB en localDB.js', done: true },
          { id: 'c2_3', text: 'Crear sistema de alertas de sincronización', done: false }
        ],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'default_3',
        title: 'Construir Tablero Kanban Dinámico',
        description: 'Desarrollar la interfaz visual del tablero con soporte para drag-and-drop nativo de HTML5 para mover tareas entre columnas (Por hacer, En progreso, En revisión, Completadas).',
        status: 'todo',
        priority: 'medium',
        tags: ['UI', 'Kanban'],
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        checklist: [
          { id: 'c3_1', text: 'Diseñar columnas responsivas de Bootstrap', done: false },
          { id: 'c3_2', text: 'Implementar eventos de arrastrar y soltar (drag & drop)', done: false },
          { id: 'c3_3', text: 'Integrar con persistencia en IndexedDB al soltar', done: false }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'default_4',
        title: 'Crear Dashboard de Estadísticas',
        description: 'Crear una vista de control atractiva y premium que muestre gráficas interactivas basadas en SVG o Canvas con las tasas de finalización de tareas, distribución por prioridad y tiempos de entrega.',
        status: 'todo',
        priority: 'medium',
        tags: ['UI', 'Analytics'],
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        checklist: [
          { id: 'c4_1', text: 'Calcular métricas en base a tareas cargadas', done: false },
          { id: 'c4_2', text: 'Implementar gráficos dinámicos SVG autogenerados', done: false }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'default_5',
        title: 'Editor Markdown para Detalles de Tareas',
        description: 'Permitir al usuario ver los detalles de una tarea y editar su descripción usando un editor con previsualización en tiempo real y soporte para sintaxis Markdown.',
        status: 'todo',
        priority: 'low',
        tags: ['Frontend', 'Markdown'],
        dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
        checklist: [
          { id: 'c5_1', text: 'Integrar parser básico de Markdown en React', done: false },
          { id: 'c5_2', text: 'Crear modal interactivo para edición de detalles', done: false }
        ],
        createdAt: new Date().toISOString()
      }
    ];

    for (const task of defaultTasks) {
      await this.saveTask(task);
    }

    return defaultTasks;
  }
}

// Export a single instance to be used across the application
export const localDatabase = new LocalDatabaseService();
export default localDatabase;
