import React from 'react';
import './App.css';
import ScheduleDisplay from './ScheduleDisplay';
import SpecialWeekTodos from './SpecialWeekTodos';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function SchedulePage() {
  return (
    <div className="App">
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
      <ScheduleDisplay isPdfView={false} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<SchedulePage />} />
        <Route path="/tasks" element={<SpecialWeekTodos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
