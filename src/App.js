import React from 'react';
import './App.css';
import ScheduleDisplay from './ScheduleDisplay';

function App() {
  return (
    <div className="App">
      <h1>Special Week Schedule</h1>
      <ScheduleDisplay />
      <button onClick={() => window.print()} style={{ marginBottom: '1rem' }}>
        Print Schedule
      </button>
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
