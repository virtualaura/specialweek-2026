import React from 'react';
import './App.css';
import ScheduleDisplay from './ScheduleDisplay';

function App() {
  const isPdfView = new URLSearchParams(window.location.search).get('view') === 'pdf';
  const openPdfView = () => {
    window.open(`${window.location.pathname}?view=pdf`, '_blank', 'noopener,noreferrer');
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

export default App;

/*
function App() {
  return (
    <Router basename="/specialweek-2025">
      <Routes>
        <Route path="/" element={<SpecialWeekTodos />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </Router>
  );
}

export default App;
*/
