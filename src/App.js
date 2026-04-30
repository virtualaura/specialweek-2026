import React from 'react';
import './App.css';
import ScheduleDisplay from './ScheduleDisplay';
import SpecialWeekTodos from './SpecialWeekTodos';
import { HashRouter, Route, Routes } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

function SchedulePage({ isPdfView = false }) {
  const openPdfView = async () => {
    const element = document.getElementById('schedule-export-root');
    if (!element) return;

    const opt = {
      margin: 0.3,
      filename: 'Special Week 2026.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: 'a3',
        orientation: 'portrait',
        compress: true
      }
    };

    const worker = html2pdf().set(opt).from(element).toPdf();
    const pdf = await worker.get('pdf');
    const blobUrl = pdf.output('bloburl');
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
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
      <div id="schedule-export-root">
        <ScheduleDisplay isPdfView={isPdfView} />
      </div>
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
