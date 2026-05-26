import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Tabs, Tab, Badge, ListGroup, InputGroup } from 'react-bootstrap';

// Simple lightweight Markdown to HTML parser for task preview
const parseMarkdownToHtml = (text) => {
  if (!text) return '<p class="text-muted italic">Sin descripción. Escribe algo usando Markdown...</p>';
  
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h5 class="text-white mt-3 mb-2">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 class="text-white mt-3 mb-2">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 class="text-white mt-4 mb-3">$1</h3>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Code inline
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // List items
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>');
  
  // Wrap list items
  // Find sequences of <li> and wrap in <ul>
  // A simplistic way is:
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="ps-3 my-2">$1</ul>');

  // Paragraphs (double line breaks)
  html = html.replace(/\n\n/g, '</p><p>');
  // Single line breaks
  html = html.replace(/\n/g, '<br />');
  
  return `<p>${html}</p>`;
};

export default function TaskModal({ show, task, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');
  const [activeTab, setActiveTab] = useState('editor');

  // Load task values when opening the modal
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate || '');
      setTags(task.tags || []);
      setChecklist(task.checklist || []);
      setActiveTab('editor');
    } else {
      // Setup defaults for a brand new task
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setTags([]);
      setChecklist([]);
      setActiveTab('editor');
    }
  }, [task, show]);

  // Handle Save
  const handleSave = () => {
    if (!title.trim()) return;

    const savedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      tags,
      checklist
    };
    onSave(savedTask);
    onClose();
  };

  // Tag Management
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = newTagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Checklist (Subtasks) Management
  const handleAddSubtask = (e) => {
    e.preventDefault();
    const text = newSubtaskInput.trim();
    if (text) {
      const newItem = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        text,
        done: false
      };
      setChecklist([...checklist, newItem]);
      setNewSubtaskInput('');
    }
  };

  const handleToggleSubtask = (itemId) => {
    setChecklist(checklist.map(item => 
      item.id === itemId ? { ...item, done: !item.done } : item
    ));
  };

  const handleRemoveSubtask = (itemId) => {
    setChecklist(checklist.filter(item => item.id !== itemId));
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      size="lg" 
      centered 
      contentClassName="modal-content-custom"
    >
      <Modal.Header closeButton closeVariant="white" className="modal-header-custom">
        <Modal.Title className="fs-5 fw-bold text-white d-flex align-items-center">
          <i className="bi bi-pencil-square me-2 text-primary"></i>
          {task?.id ? 'Detalles de Tarea' : 'Crear Nueva Tarea'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Form>
          {/* Task Title */}
          <Form.Group className="mb-4">
            <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Título de la Tarea</Form.Label>
            <Form.Control
              id="task-title-input"
              type="text"
              placeholder="Ej. Configurar base de datos serverless"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="fs-5 py-2 fw-semibold"
              required
            />
          </Form.Group>

          {/* Task Metadata (Row 1) */}
          <Row className="g-3 mb-4">
            <Col xs={12} sm={4}>
              <Form.Group>
                <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Estado</Form.Label>
                <Form.Select 
                  id="task-status-select"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="todo">Por hacer</option>
                  <option value="in-progress">En progreso</option>
                  <option value="review">En revisión</option>
                  <option value="done">Completada</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} sm={4}>
              <Form.Group>
                <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Prioridad</Form.Label>
                <Form.Select 
                  id="task-priority-select"
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} sm={4}>
              <Form.Group>
                <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Vencimiento</Form.Label>
                <Form.Control
                  id="task-due-date-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Tags Section */}
          <Form.Group className="mb-4">
            <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Etiquetas</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  bg="secondary" 
                  className="bg-opacity-15 text-white border border-secondary border-opacity-30 d-flex align-items-center gap-2 py-2 px-3"
                  style={{ borderRadius: '50px' }}
                >
                  {tag}
                  <i 
                    className="bi bi-x-circle-fill hover-white cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                    style={{ cursor: 'pointer' }}
                  ></i>
                </Badge>
              ))}
            </div>
            <Form onSubmit={handleAddTag} className="d-flex" style={{ maxWidth: '300px' }}>
              <InputGroup>
                <Form.Control
                  id="task-tag-input"
                  type="text"
                  placeholder="Agregar etiqueta..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  size="sm"
                />
                <Button 
                  id="btn-add-tag"
                  type="submit" 
                  variant="outline-secondary" 
                  className="border-opacity-25"
                  size="sm"
                >
                  Agregar
                </Button>
              </InputGroup>
            </Form>
          </Form.Group>

          {/* Tabs for Markdown Editor vs HTML Preview */}
          <Form.Group className="mb-4">
            <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Descripción (Markdown)</Form.Label>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3 border-secondary border-opacity-25"
            >
              <Tab eventKey="editor" title="Editor">
                <Form.Control
                  id="task-description-input"
                  as="textarea"
                  rows={5}
                  placeholder="Describe la tarea aquí... Puedes usar # H1, **negrita**, o `código`."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="font-monospace"
                  style={{ fontSize: '0.9rem' }}
                />
              </Tab>
              <Tab eventKey="preview" title="Vista Previa">
                <div 
                  className="markdown-preview" 
                  dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(description) }}
                />
              </Tab>
            </Tabs>
          </Form.Group>

          {/* Checklist Section (Subtasks) */}
          <Form.Group className="mb-4">
            <Form.Label className="small text-muted text-uppercase fw-semibold mb-2">Sub-tareas (Checklist)</Form.Label>
            
            {checklist.length > 0 && (
              <ListGroup className="mb-3 border-0 bg-transparent">
                {checklist.map(item => (
                  <ListGroup.Item 
                    key={item.id} 
                    className="d-flex justify-content-between align-items-center bg-transparent border-secondary border-opacity-10 px-0 py-2 text-white"
                  >
                    <div className="d-flex align-items-center">
                      <Form.Check 
                        type="checkbox"
                        id={`subtask-check-${item.id}`}
                        checked={item.done}
                        onChange={() => handleToggleSubtask(item.id)}
                        className="me-3 cursor-pointer"
                      />
                      <span className={item.done ? 'text-decoration-line-through text-muted' : ''}>
                        {item.text}
                      </span>
                    </div>
                    <Button 
                      variant="link" 
                      onClick={() => handleRemoveSubtask(item.id)} 
                      className="text-danger p-0 border-0"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            <Form onSubmit={handleAddSubtask} className="d-flex">
              <InputGroup>
                <Form.Control
                  id="task-subtask-input"
                  type="text"
                  placeholder="Agregar sub-tarea..."
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                />
                <Button 
                  id="btn-add-subtask"
                  type="submit" 
                  variant="outline-secondary" 
                  className="border-opacity-25"
                >
                  + Añadir
                </Button>
              </InputGroup>
            </Form>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer className="modal-footer-custom px-4 py-3 justify-content-between">
        <div>
          {task?.id && (
            <Button 
              id="btn-delete-task"
              variant="outline-danger" 
              onClick={() => {
                if (window.confirm('¿Seguro que deseas eliminar esta tarea?')) {
                  onDelete(task.id);
                  onClose();
                }
              }}
            >
              <i className="bi bi-trash3-fill me-2"></i>Eliminar Tarea
            </Button>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={onClose} className="border-opacity-25 text-white">
            Cancelar
          </Button>
          <Button 
            id="btn-save-task"
            className="btn-gradient px-4" 
            onClick={handleSave}
            disabled={!title.trim()}
          >
            Guardar Cambios
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
