import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';

export default function Navigation({ activeView, onViewChange }) {
  const [syncStatus, setSyncStatus] = useState({
    status: 'success',
    message: 'Base de datos inicializada.'
  });

  useEffect(() => {
    const handleSyncStatus = (event) => {
      setSyncStatus({
        status: event.detail.status,
        message: event.detail.message
      });
    };

    window.addEventListener('db-sync-status', handleSyncStatus);
    return () => {
      window.removeEventListener('db-sync-status', handleSyncStatus);
    };
  }, []);

  const getSyncIcon = () => {
    switch (syncStatus.status) {
      case 'loading':
        return <i className="bi bi-cloud-arrow-down-fill spin-slow me-2"></i>;
      case 'saving':
        return <i className="bi bi-cloud-arrow-up-fill spin-slow me-2"></i>;
      case 'success':
        return <i className="bi bi-cloud-check-fill me-2"></i>;
      case 'error':
        return <i className="bi bi-cloud-slash-fill me-2"></i>;
      default:
        return <i className="bi bi-cloud-fill me-2"></i>;
    }
  };

  return (
    <Navbar expand="lg" variant="dark" className="border-bottom border-secondary-subtle py-3 px-2 mb-4 glass-panel sticky-top" style={{ zIndex: 1020 }}>
      <Container fluid>
        <Navbar.Brand href="#" className="navbar-brand-custom fs-3 d-flex align-items-center">
          <i className="bi bi-activity me-2 text-primary fs-4"></i>
          Zenith Flow
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav" className="mt-2 mt-lg-0">
          <Nav className="me-auto gap-2">
            <Nav.Link 
              id="nav-link-dashboard"
              active={activeView === 'dashboard'} 
              onClick={() => onViewChange('dashboard')}
              className="nav-link-custom d-flex align-items-center"
            >
              <i className="bi bi-grid-1x2-fill me-2"></i> Panel
            </Nav.Link>
            <Nav.Link 
              id="nav-link-board"
              active={activeView === 'board'} 
              onClick={() => onViewChange('board')}
              className="nav-link-custom d-flex align-items-center"
            >
              <i className="bi bi-kanban-fill me-2"></i> Tablero Kanban
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <Badge 
              id="db-sync-badge"
              className={`sync-badge ${syncStatus.status}`} 
              title={syncStatus.message}
            >
              {getSyncIcon()}
              <span>{syncStatus.message}</span>
            </Badge>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
