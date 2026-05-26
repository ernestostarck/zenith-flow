import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import localDatabase from './services/localDB';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('board'); // Board default
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      let loadedTasks = await localDatabase.getTasks();
      
      // Seed default tasks if database is empty on first boot
      if (loadedTasks.length === 0) {
        loadedTasks = await localDatabase.seedDefaultData();
      }
      
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const handleSaveTask = async (task) => {
    try {
      await localDatabase.saveTask(task);
      await loadTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await localDatabase.deleteTask(taskId);
      await loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleAddTask = (initialStatus = 'todo') => {
    setSelectedTask({
      title: '',
      description: '',
      status: initialStatus,
      priority: 'medium',
      dueDate: '',
      tags: [],
      checklist: []
    });
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100 pb-5">
      {/* Global Navigation Header */}
      <Navigation activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content Area */}
      <Container fluid className="px-4">
        {activeView === 'dashboard' ? (
          <Dashboard tasks={tasks} onEditTask={handleEditTask} />
        ) : (
          <KanbanBoard 
            tasks={tasks} 
            onSaveTask={handleSaveTask} 
            onEditTask={handleEditTask} 
            onAddTask={handleAddTask} 
          />
        )}
      </Container>

      {/* Shared Task Creator & Editor Modal */}
      <TaskModal 
        show={showModal} 
        task={selectedTask} 
        onClose={() => setShowModal(false)} 
        onSave={handleSaveTask} 
        onDelete={handleDeleteTask} 
      />
    </div>
  );
}
