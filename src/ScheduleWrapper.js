/* Compontent to move the logic from your current modal (parsing CSV, rendering ScheduleDisplay, 
and PDF download) into a standalone component,


import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import ScheduleDisplay from "./ScheduleDisplay";
import html2pdf from 'html2pdf.js';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function ScheduleWrapper({ standalone = false, onClose }) {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
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

    fetchSchedule();
  }, []);

  const generatePDF = () => {
    const element = document.getElementById("schedule-block");
    const opt = {
      margin: 0.5,
      filename: 'Rosey Special Week 2026.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 1920, windowHeight: 1080 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait', compress: true }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className={standalone ? "p-4 max-w-7xl mx-auto" : "modal-content"}>
      {standalone ? (
        <>
          <div className="header-container">
            <img 
              src={process.env.PUBLIC_URL + "/rosey-lineaire-quadri.png"} 
              alt="Special Week Logo" 
              className="header-image"
            />
            <h1>Special Week 2026 - Full Schedule</h1>
          </div>
        </>
      ) : (
        <div className="modal-header">
          <h2>Special Week 2026</h2>
          <div className="modal-buttons">
            <button className="download-pdf-btn" onClick={generatePDF}>Download PDF</button>
            <button className="close-window-btn" onClick={onClose}>Close Window</button>
          </div>
        </div>
      )}

      {standalone && (
        <div className="section-header">
          <h2>Schedule</h2>
          <button className="download-pdf-btn" onClick={generatePDF}>Download PDF</button>
        </div>
      )}

      <div id="schedule-block" className="my-6">
        <ScheduleDisplay schedule={schedule} />
      </div>
    </div>
  );
}
*/

import React from 'react';
import ScheduleDisplay from './ScheduleDisplay';
import { scheduleData } from './ScheduleData';

export default function ScheduleWrapper() {
  return (
    <div className="schedule-wrapper">
      <h1>Weekly Schedule</h1>
      <ScheduleDisplay data={scheduleData} />
    </div>
  );
}
