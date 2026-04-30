import React from 'react';
import './App.css';
import ScheduleDisplay from './ScheduleDisplay';
import SpecialWeekTodos from './SpecialWeekTodos';
import { HashRouter, Route, Routes } from 'react-router-dom';

function SchedulePage({ isPdfView = false }) {
  const openPdfView = () => {
    const basePath = process.env.PUBLIC_URL || '';
    window.open(`${basePath}/#/print`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`App ${isPdfView ? 'pdf-view' : ''}`}>
      <div className="header-container">
        <img
          src={`${process.env.PUBLIC_URL}/rosey-lineaire-quadri.png`}
          alt="Le Rosey crest"
          className="header-image"
        />
        <div>
          <h1>Special Week Schedule</h1>
          <h2>12 - 15 May 2026</h2>
        </div>
      </div>
      <div className="schedule-actions">
        {!isPdfView && (
          <button onClick={openPdfView} className="download-pdf-btn">
            Open PDF View
          </button>
        )}
        {isPdfView && (
          <button onClick={() => window.print()} className="download-pdf-btn">
            Save / Print PDF
          </button>
        )}
      </div>
      <ScheduleDisplay isPdfView={isPdfView} />
    </div>
  );
}

function App() {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<SchedulePage isPdfView={false} />} />
        <Route path="/print" element={<SchedulePage isPdfView={true} />} />
        <Route path="/tasks" element={<SpecialWeekTodos />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
