import React from 'react';
import { Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';

export default function Dashboard({ tasks, onEditTask }) {
  // Statistics calculations
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;

  // Checklist statistics
  let totalChecklistItems = 0;
  let completedChecklistItems = 0;
  tasks.forEach(task => {
    if (task.checklist && task.checklist.length > 0) {
      totalChecklistItems += task.checklist.length;
      completedChecklistItems += task.checklist.filter(item => item.done).length;
    }
  });

  const checklistCompletionRate = totalChecklistItems > 0 
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100) 
    : 0;

  // Task completion percentage
  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Priority count
  const lowPriority = tasks.filter(t => t.priority === 'low').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const highPriority = tasks.filter(t => t.priority === 'high').length;

  // Overdue tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasksList = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < todayStr);
  const overdueCount = overdueTasksList.length;

  // Upcoming tasks (due in the next 3 days, excluding completed ones)
  const threeDaysFromNow = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  const upcomingTasks = tasks
    .filter(t => t.status !== 'done' && t.dueDate && t.dueDate >= todayStr && t.dueDate <= threeDaysFromNow)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Circular gauge config
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const getPriorityBadgeClass = (p) => {
    if (p === 'high') return 'bg-danger';
    if (p === 'medium') return 'bg-warning text-dark';
    return 'bg-success';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'todo': return <Badge bg="secondary">Por hacer</Badge>;
      case 'in-progress': return <Badge bg="primary">En progreso</Badge>;
      case 'review': return <Badge bg="info" className="text-dark">Revisión</Badge>;
      case 'done': return <Badge bg="success">Hecho</Badge>;
      default: return null;
    }
  };

  return (
    <div className="dashboard-page container-fluid py-2">
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 id="dashboard-title" className="h2 text-white mb-1">Panel de Productividad</h1>
          <p className="text-muted">Análisis en tiempo real de tu flujo de trabajo serverless.</p>
        </div>
      </div>

      {/* Numerical Stats Widgets */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} md={3}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <p className="text-muted small text-uppercase mb-1">Tareas Activas</p>
                <h3 className="mb-0 fs-2 fw-bold text-white">{(totalTasks - doneTasks)}</h3>
                <span className="text-muted small">Total: {totalTasks}</span>
              </div>
              <div className="rounded-circle p-3 bg-primary bg-opacity-10 text-primary fs-3">
                <i className="bi bi-list-task"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <p className="text-muted small text-uppercase mb-1">En Progreso</p>
                <h3 className="mb-0 fs-2 fw-bold text-info">{inProgressTasks}</h3>
                <span className="text-muted small">Revisión: {reviewTasks}</span>
              </div>
              <div className="rounded-circle p-3 bg-info bg-opacity-10 text-info fs-3">
                <i className="bi bi-gear-fill spin-slow"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <p className="text-muted small text-uppercase mb-1">Vencidas</p>
                <h3 className={`mb-0 fs-2 fw-bold ${overdueCount > 0 ? 'text-danger' : 'text-muted'}`}>
                  {overdueCount}
                </h3>
                <span className="text-muted small">Requieren atención</span>
              </div>
              <div className={`rounded-circle p-3 bg-opacity-10 fs-3 ${overdueCount > 0 ? 'bg-danger text-danger' : 'bg-secondary text-muted'}`}>
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="d-flex align-items-center justify-content-between p-4">
              <div>
                <p className="text-muted small text-uppercase mb-1">Checklist Completado</p>
                <h3 className="mb-0 fs-2 fw-bold text-success">{checklistCompletionRate}%</h3>
                <span className="text-muted small">{completedChecklistItems}/{totalChecklistItems} sub-tareas</span>
              </div>
              <div className="rounded-circle p-3 bg-success bg-opacity-10 text-success fs-3">
                <i className="bi bi-check2-square"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Visual Analytics Row */}
      <Row className="g-4 mb-4">
        {/* SVG Donut Progress Chart */}
        <Col xs={12} md={5}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <h4 className="card-title text-start w-100 mb-4 fs-5 text-white">Progreso General</h4>
              
              <div className="position-relative d-inline-flex justify-content-center align-items-center my-3">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {/* Background Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="12"
                  />
                  {/* Foreground Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="url(#purpleGradient)"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 80 80)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                  />
                  {/* Gradients Definitions */}
                  <defs>
                    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Centered Percentage */}
                <div className="position-absolute text-center">
                  <h2 className="mb-0 fw-bold fs-2 text-white">{completionPercentage}%</h2>
                  <span className="text-muted small text-uppercase">Completado</span>
                </div>
              </div>

              <div className="text-center mt-3 w-100">
                <div className="d-flex justify-content-around text-muted small">
                  <div>
                    <span className="priority-indicator bg-secondary me-2"></span>
                    Por hacer ({todoTasks})
                  </div>
                  <div>
                    <span className="priority-indicator bg-primary me-2"></span>
                    Haciendo ({inProgressTasks + reviewTasks})
                  </div>
                  <div>
                    <span className="priority-indicator bg-success me-2"></span>
                    Terminado ({doneTasks})
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Priority and Distribution charts */}
        <Col xs={12} md={7}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="p-4">
              <h4 className="card-title mb-4 fs-5 text-white">Distribución por Prioridad</h4>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Prioridad Alta</span>
                  <span className="text-danger fw-semibold">{highPriority} tareas</span>
                </div>
                <ProgressBar 
                  now={totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0} 
                  variant="danger" 
                  style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Prioridad Media</span>
                  <span className="text-warning fw-semibold">{mediumPriority} tareas</span>
                </div>
                <ProgressBar 
                  now={totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0} 
                  variant="warning" 
                  style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}
                />
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Prioridad Baja</span>
                  <span className="text-success fw-semibold">{lowPriority} tareas</span>
                </div>
                <ProgressBar 
                  now={totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0} 
                  variant="success" 
                  style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Row for Lists (Overdue / Upcoming) */}
      <Row className="g-4">
        {/* Upcoming Deadlines */}
        <Col xs={12} md={6}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="p-4">
              <h4 className="card-title mb-3 fs-5 text-white">
                <i className="bi bi-calendar-event text-info me-2"></i>Próximos Vencimientos (3 días)
              </h4>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-emoji-smile fs-3 d-block mb-2"></i>
                  <span>No hay tareas con vencimiento próximo.</span>
                </div>
              ) : (
                <div className="list-group list-group-flush" style={{ background: 'transparent' }}>
                  {upcomingTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="list-group-item d-flex justify-content-between align-items-center border-secondary border-opacity-10 px-0 py-3" 
                      style={{ background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}
                      onClick={() => onEditTask(task)}
                    >
                      <div className="me-2 text-truncate">
                        <div className="fw-semibold text-white text-truncate">{task.title}</div>
                        <div className="small text-muted mt-1">
                          Vence: <span className="text-info">{task.dueDate}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {getStatusBadge(task.status)}
                        <Badge bg="" className={getPriorityBadgeClass(task.priority)}>{task.priority}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Overdue tasks detail */}
        <Col xs={12} md={6}>
          <Card className="glass-panel text-white h-100 border-0">
            <Card.Body className="p-4">
              <h4 className="card-title mb-3 fs-5 text-white">
                <i className="bi bi-alarm text-danger me-2"></i>Tareas Vencidas
              </h4>
              {overdueTasksList.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-check-circle-fill text-success fs-3 d-block mb-2"></i>
                  <span>¡Excelente! No tienes tareas vencidas pendientes.</span>
                </div>
              ) : (
                <div className="list-group list-group-flush" style={{ background: 'transparent' }}>
                  {overdueTasksList.map(task => (
                    <div 
                      key={task.id} 
                      className="list-group-item d-flex justify-content-between align-items-center border-secondary border-opacity-10 px-0 py-3" 
                      style={{ background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}
                      onClick={() => onEditTask(task)}
                    >
                      <div className="me-2 text-truncate">
                        <div className="fw-semibold text-white text-truncate">{task.title}</div>
                        <div className="small text-danger mt-1">
                          Venció el: {task.dueDate}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {getStatusBadge(task.status)}
                        <Badge bg="" className={getPriorityBadgeClass(task.priority)}>{task.priority}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
