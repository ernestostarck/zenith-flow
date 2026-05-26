import React from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';

export default function TaskCard({ task, onEdit, onDragStart, onDragEnd, isDragging }) {
  // Checklist counts
  const totalItems = task.checklist ? task.checklist.length : 0;
  const completedItems = task.checklist ? task.checklist.filter(i => i.done).length : 0;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Due date format / style
  const todayStr = new Date().toISOString().split('T')[0];
  const isOverdue = task.status !== 'done' && task.dueDate && task.dueDate < todayStr;
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return '#f43f5e';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#cbd5e1';
    }
  };

  const getTagStyle = (tag) => {
    const normalized = String(tag).trim().toLowerCase();
    let hash = 0;

    for (let i = 0; i < normalized.length; i += 1) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const backgroundColor = `hsla(${hue}, 78%, 22%, 0.96)`;
    const borderColor = `hsla(${hue}, 82%, 58%, 0.45)`;
    const textColor = `hsl(${hue}, 100%, 92%)`;

    return { backgroundColor, borderColor, color: textColor };
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task.id);
  };

  return (
    <Card 
      id={`task-card-${task.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(task)}
      className={`glass-card mb-3 border-0 text-white ${isDragging ? 'card-dragging' : ''}`}
      style={{ cursor: 'grab', userSelect: 'none' }}
    >
      {/* Decorative colored top border representing priority */}
      <div 
        style={{ 
          height: '4px', 
          width: '100%', 
          backgroundColor: getPriorityColor(task.priority),
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}
      />
      
      <Card.Body className="p-3">
        {/* Title */}
        <h5 className="card-title fs-6 text-white mb-2 text-wrap" style={{ lineHeight: '1.4' }}>
          {task.title}
        </h5>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag, idx) => (
              <Badge 
                key={idx} 
                bg="dark" 
                className="task-tag-badge py-1 px-2"
                style={{ ...getTagStyle(tag), fontSize: '0.72rem', fontWeight: '700' }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Bottom Metadata Line */}
        <div className="d-flex align-items-center justify-content-between text-muted small mt-2">
          {/* Due date indicator */}
          {task.dueDate ? (
            <div 
              className={`d-flex align-items-center ${isOverdue ? 'text-danger fw-semibold' : 'text-muted'}`}
              title={isOverdue ? '¡Tarea Vencida!' : 'Fecha de vencimiento'}
            >
              <i className={`bi ${isOverdue ? 'bi-clock-fill text-danger' : 'bi-calendar3'} me-1`}></i>
              <span style={{ fontSize: '0.75rem' }}>{formatDate(task.dueDate)}</span>
            </div>
          ) : (
            <div />
          )}

          {/* Checklist progress */}
          {totalItems > 0 && (
            <div className="d-flex align-items-center gap-2" title="Progreso de sub-tareas">
              <i className="bi bi-check2-square text-success"></i>
              <span style={{ fontSize: '0.75rem' }}>{completedItems}/{totalItems}</span>
            </div>
          )}
        </div>

        {/* Mini progress bar for checklists */}
        {totalItems > 0 && (
          <div className="mt-2">
            <ProgressBar 
              now={progressPercent} 
              variant={progressPercent === 100 ? "success" : "primary"} 
              style={{ height: '3px', background: 'rgba(255, 255, 255, 0.05)' }} 
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
