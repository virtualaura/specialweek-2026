import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";

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

const parseDueDate = (dateStr) => {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const formatDate = (date) => {
  if (!date) return "No due date";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-GB", options);
};

export default function SpecialWeekTodos() {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [filter, setFilter] = useState(null);
  const [names, setNames] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // can be "all", "todo", "done"

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
            dueDateObj: parseDueDate(task.due_date),
          }));
          const sortedTasks = [...formattedTasks].sort((a, b) => {
            const aTime = a.dueDateObj ? a.dueDateObj.getTime() : Number.POSITIVE_INFINITY;
            const bTime = b.dueDateObj ? b.dueDateObj.getTime() : Number.POSITIVE_INFINITY;
            return aTime - bTime;
          });
          setTasks(sortedTasks);
          setNames(getUniqueNames(formattedTasks));
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
        <h1>Special Week 2026 - Schedule and To-Dos</h1>
      </div>

      {showSchedule && (
        <div className="modal-overlay" onClick={() => setShowSchedule(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Special Week 2026</h2>
              <div className="modal-buttons">
                <button className="close-window-btn" onClick={() => setShowSchedule(false)} aria-label="Close schedule">X</button>
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
        <button className="hide-calendar-btn" onClick={() => setShowSchedule(!showSchedule)}>
          {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
        </button>
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
                <div className="todo-detail">
                  <span className="font-semibold text-gray-900">📅</span> {formatDate(todo.dueDateObj)}
                </div>
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
