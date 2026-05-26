import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo', title: 'Por hacer', colorClass: 'bg-secondary', borderHex: '#6b7280' },
  { id: 'in-progress', title: 'En progreso', colorClass: 'bg-primary', borderHex: '#3b82f6' },
  { id: 'review', title: 'En revisión', colorClass: 'bg-info', borderHex: '#06b6d4' },
  { id: 'done', title: 'Terminadas', colorClass: 'bg-success', borderHex: '#10b981' }
];

export default function KanbanBoard({ tasks, onSaveTask, onEditTask, onAddTask }) {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDragCol, setActiveDragCol] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Drag & Drop event handlers
  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDragCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (activeDragCol !== colId) {
      setActiveDragCol(colId);
    }
  };

  const handleDragLeave = (e) => {
    // Check if we are actually leaving the column, not just hovering elements inside it
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setActiveDragCol(null);
    }
  };

  const handleDrop = async (e, colId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== colId) {
        const updatedTask = { ...task, status: colId };
        await onSaveTask(updatedTask);
      }
    }
    
    setDraggedTaskId(null);
    setActiveDragCol(null);
  };

  // Filter tasks based on search & priority dropdowns
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="kanban-page container-fluid py-2">
      {/* Board Controls (Search & Filters) */}
      <div className="glass-panel p-3 mb-4 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center border-0">
        <div className="d-flex flex-grow-1 w-100 flex-column flex-sm-row gap-2">
          {/* Search bar */}
          <InputGroup className="flex-grow-1 max-width-md" style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-transparent border-secondary border-opacity-25 text-muted">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por título o etiqueta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-secondary border-opacity-25 text-white"
            />
          </InputGroup>

          {/* Priority filter */}
          <Form.Select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent border-secondary border-opacity-25 text-white w-auto"
            style={{ minWidth: '160px' }}
          >
            <option value="" className="bg-dark text-white">Todas las prioridades</option>
            <option value="high" className="bg-dark text-white">Alta</option>
            <option value="medium" className="bg-dark text-white font-weight-bold">Media</option>
            <option value="low" className="bg-dark text-white">Baja</option>
          </Form.Select>
        </div>

        {/* Global Add Button */}
        <Button 
          id="btn-new-task-global"
          onClick={() => onAddTask()} 
          className="btn-gradient px-4 py-2 w-100 w-md-auto d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-plus-lg me-2 fw-bold"></i> Nueva Tarea
        </Button>
      </div>

      {/* Board Columns Grid */}
      <Row className="g-3 flex-nowrap overflow-x-auto pb-3" style={{ minHeight: 'calc(100vh - 260px)' }}>
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          
          return (
            <Col 
              key={col.id} 
              xs={12} 
              sm={6} 
              md={3} 
              style={{ minWidth: '280px', maxWidth: '380px' }}
            >
              <div 
                className={`kanban-column h-100 ${activeDragCol === col.id ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{ borderTop: `4px solid ${col.borderHex}` }}
              >
                {/* Column Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <h3 className="h6 text-white mb-0 fw-bold uppercase">{col.title}</h3>
                    <Badge bg="secondary" className="bg-opacity-25 text-white rounded-pill px-2" style={{ fontSize: '0.8rem' }}>
                      {colTasks.length}
                    </Badge>
                  </div>
                  {/* Quick-add button in column */}
                  <Button 
                    variant="link" 
                    className="p-0 text-muted hover-white text-decoration-none d-flex align-items-center justify-content-center" 
                    title={`Añadir tarea a ${col.title}`}
                    onClick={() => onAddTask(col.id)}
                  >
                    <i className="bi bi-plus-circle fs-5"></i>
                  </Button>
                </div>

                {/* Column Task List */}
                <div className="kanban-list">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-5 text-muted border border-secondary border-opacity-10 border-dashed rounded-3 my-2" style={{ borderStyle: 'dashed' }}>
                      <i className="bi bi-inbox fs-4 d-block mb-1"></i>
                      <span className="small">Arrastra una tarea aquí</span>
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={onEditTask}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedTaskId === task.id}
                      />
                    ))
                  )}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
