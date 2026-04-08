import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";
import html2pdf from 'html2pdf.js';

const getUniqueNames = (tasks) => {
  const names = new Set();
  tasks.forEach((task) => {
    if (task.who) {
      task.who.forEach((name) => names.add(name.trim()));
    }
    if (task.cc) {
      task.cc.split(";").forEach((name) => names.add(name.trim()));
    }
  });
  return [...names].sort();
};

// Helper function to format dates
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

export default function SpecialWeekTodos() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState(null);
  const [names, setNames] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // can be "all", "todo", "done"

  const generatePDF = async (e) => {
    e.preventDefault();
    try {
      const element = document.getElementById('schedule-block');
      if (!element) return;
      const opt = {
        margin: 0.5,
        filename: 'Rosey Special Week 2025.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 1920, windowHeight: 1080 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape', compress: true }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch(process.env.PUBLIC_URL + "/tasks.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (result) => {
          const formattedTasks = result.data.map((task, i) => ({
            ...task,
            id: task.id || `task-${i}`,
            who: task.who ? task.who.split(";") : [],
            cc: task.cc || "",
            due_date: formatDate(task.due_date),
          }));
          setTasks(formattedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
          setNames(getUniqueNames(formattedTasks));

          console.log("All parsed tasks:", formattedTasks);
        },
      });
    }

    async function fetchSchedule() {
      const response = await fetch(process.env.PUBLIC_URL + "/schedule.csv");
      const text = await response.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (result) => {
          const formattedSchedule = result.data.reduce((acc, row) => {
            const { date, time, start, end, event, location } = row;
            const formattedDate = formatDate(date);
            let day = acc.find((day) => day.date === formattedDate);
            if (!day) {
              day = { date: formattedDate, blocks: [] };
              acc.push(day);
            }
            day.blocks.push({ time, start, end, event, location });
            return acc;
          }, []);
          setSchedule(formattedSchedule);
        },
      });
    }

    fetchTasks();
    fetchSchedule();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const personParam = params.get("tasks");
    if (personParam) {
      const normalized = personParam.charAt(0).toUpperCase() + personParam.slice(1).toLowerCase();
      setFilter(normalized);
    }
  }, []);
  
  const filteredTasks = tasks.filter((task) => {
    // Apply status filter
    if (statusFilter === "todo" && task.status === "done") return false;
    if (statusFilter === "done" && task.status !== "done") return false;
  
    // Apply person filter
    if (!filter) return true;
    const isAssigned = task.who.some(name => name.trim().toLowerCase() === filter.toLowerCase());
    const isCCd = task.cc && task.cc.split(";").some(name => name.trim().toLowerCase() === filter.toLowerCase());
    return isAssigned || isCCd;
  });



  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="header-container">
        <img 
          src={process.env.PUBLIC_URL + "/rosey-lineaire-quadri.png"} 
          alt="Special Week Logo" 
          className="header-image"
        />
        <h1>Special Week 2025 - Schedule and To-Dos</h1>
      </div>

      <div className="section-header">
        <h2>Schedule</h2>
        <button className="hide-calendar-btn" onClick={() => setShowSchedule(!showSchedule)}>
          {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
        </button>
      </div>
      <div>
        <h4 id="schedule">
          Clicking the "Show Schedule" button will open up the daily schedule, starting on Tuesday the 13th of May and finishing Friday the 16th of May in the afternoon. If you want a pdf version of the schedule, <a href="#" onClick={generatePDF} className="calendar-link">click here</a>.
        </h4>
      </div>
      {showSchedule && (
        <div className="modal-overlay" onClick={() => setShowSchedule(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Special Week 2025</h2>
              <div className="modal-buttons">
                <button className="download-pdf-btn" onClick={generatePDF}>Download PDF</button>
                <button className="close-window-btn" onClick={() => setShowSchedule(false)}>Close Window</button>
              </div>
            </div>
            <div id="schedule-block" className="my-6">
              <ScheduleDisplay schedule={schedule} />
            </div>
          </div>
        </div>
      )}

      <div className="section-header">
        <h2>To-dos</h2>
      </div>
      <div>
        <h4 id="todos">
          Here is where I need your help 😊. By clicking on the button that shows your name,
          you'll see the information that is relevant for you - either because your feedback is needed (if your name is in the 👤 section), or on an FYI
          basis (📢).
        </h4>
      </div>
      <div className="mb-4">
        <button
          className={`filter-button ${!filter ? 'active' : ''}`}
          onClick={() => {
            setFilter(null);
            const url = new URL(window.location);
            url.searchParams.delete("tasks");
            window.history.replaceState({}, '', url);
          }}
        >
          All
        </button>
        {names.map((name) => (
          <button
            key={name}
            className={`filter-button ${filter === name ? 'active' : ''}`}
            onClick={() => {
              setFilter(name);
              const url = new URL(window.location);
              url.searchParams.set("tasks", encodeURIComponent(name));
              window.history.replaceState({}, '', url);
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <button
          className={`filter-button ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All Tasks
        </button>
        <button
          className={`filter-button ${statusFilter === "todo" ? "active" : ""}`}
          onClick={() => setStatusFilter("todo")}
        >
          To-Dos
        </button>
        <button
          className={`filter-button ${statusFilter === "done" ? "active" : ""}`}
          onClick={() => setStatusFilter("done")}
        >
          Done
        </button>
      </div>


      <ul className="todo-grid">
        {filteredTasks.map((todo) => {
          return (
            <li key={todo.id} className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
              <div className="flex items-center">
                {todo.status === "done" ? (
                <div className="mr-3 h-5 w-5 flex items-center justify-center rounded bg-green-100 border border-green-400 text-green-600 text-sm">
                  ✅
                </div>
                ) : (
                  <input
                    disabled
                    className="mr-3 h-5 w-5 text-blue-500 border-gray-300 rounded"
                    type="checkbox"
                    checked={false}
                  />
                )}
                <span className={`font-semibold text-lg ${todo.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
                  {todo.description}
                </span>
              </div>
              <div className="mt-2 ml-8 text-gray-700 text-sm space-y-1">
                {todo.status === "done" && todo.due_date && (
                  <div className="todo-detail">
                    <span className="font-semibold text-gray-900">📅</span> {todo.due_date}
                  </div>
                )}
                <div className="todo-detail">
                  <span className="font-semibold text-gray-900">👤</span> 
                  {todo.who ? todo.who.join(", ") : ""}
                </div>
                {todo.cc && (
                  <div className="todo-detail">
                    <span className="font-semibold text-gray-900">📢</span> {todo.cc.split(";").join(", ")}
                  </div>
                )}
                {todo.notes && <div className="todo-detail italic text-gray-600">📝 {todo.notes}</div>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
