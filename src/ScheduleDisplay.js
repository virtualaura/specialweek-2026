/* import React from 'react';
import './ScheduleDisplay.css';

export default function ScheduleDisplay({ data }) {
  return (
    <div className="schedule-display">
      {data.map((day, index) => (
        <div key={index} className="day-column">
          <h2>{day.day}</h2>
          {day.slots.map((slot, i) => (
            <div key={i} className="slot">
              <div><strong>{slot.time}</strong></div>
              <div>{slot.activity}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
*/

import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import './SpecialWeek.css';
//import { eventScheduleData } from '../data/eventScheduleData';

const ScheduleDisplay = () => {
  const [scheduleData, setScheduleData] = useState([]);

useEffect(() => {
    // Directly create the data structure
    const rawData = [
  { day: 'Tuesday', start_time: '08:40', end_time: '10:10', event: 'Presentation: Introduction & Planning', location: 'Auditoire' },
  { day: 'Tuesday', start_time: '10:15', end_time: '10:45', event: 'Gouter', location: 'on-site' },
  { day: 'Tuesday', start_time: '10:45', end_time: '11:15', event: 'Presentation: Problem Framing', location: 'Auditoire' },
  { day: 'Tuesday', start_time: '11:15', end_time: '12:45', event: 'Team Work', location: 'on-site' },
  { day: 'Tuesday', start_time: '11:15', end_time: '11:50', event: 'Team Work', location: 'on-site' },
  { day: 'Tuesday', start_time: '11:50', end_time: '12:00', event: 'Mini-break', location: 'on-site' },
  { day: 'Tuesday', start_time: '12:10', end_time: '12:45', event: 'Team Work', location: 'on-site' },
  { day: 'Tuesday', start_time: '12:45', end_time: '13:45', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Tuesday', start_time: '13:45', end_time: '14:30', event: 'Presentation: User Feedback', location: 'Auditoire' },
  { day: 'Tuesday', start_time: '14:30', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Wednesday', start_time: '08:40', end_time: '09:40', event: 'Team Work - Interview Prep', location: 'Auditoire' },
  { day: 'Wednesday', start_time: '09:40', end_time: '12:45', event: 'Off-site Interviews & Team Work', location: 'off-site' },
  { day: 'Wednesday', start_time: '12:45', end_time: '13:45', event: 'Box Lunch', location: 'off-site' },  
  { day: 'Wednesday', start_time: '13:45', end_time: '14:15', event: 'Team Presentations: Problem Identification', location: 'on-site' },
  { day: 'Wednesday', start_time: '14:15', end_time: '14:45', event: 'Presentation: Developing Solutions', location: 'Auditoire' },
  { day: 'Wednesday', start_time: '14:45', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '08:40', end_time: '09:10', event: 'Presentation: Solution Ideation & Prototyping', location: 'on-site' },
  { day: 'Thursday', start_time: '09:10', end_time: '10:10', event: 'Team Work', location: 'on-site' },  
  { day: 'Thursday', start_time: '10:15', end_time: '10:45', event: 'Gouter', location: 'on-site' },
  { day: 'Thursday', start_time: '10:30', end_time: '12:00', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '12:00', end_time: '12:45', event: 'Presentation: Assessing Pitches', location: 'Auditoire' },
  { day: 'Thursday', start_time: '12:45', end_time: '13:45', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Thursday', start_time: '13:45', end_time: '16:30', event: 'Off-site Interviews & Team Work', location: 'off-site' },
  { day: 'Thursday', start_time: '18:00', end_time: '22:00', event: '**OPTIONAL** Hackathon', location: 'on-site' },
  { day: 'Friday', start_time: '08:40', end_time: '09:10', event: 'Presentation: Pitch Development', location: 'Auditoire' },
  { day: 'Friday', start_time: '09:10', end_time: '10:15', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '10:15', end_time: '10:45', event: 'Gouter', location: 'on-site' },
  { day: 'Friday', start_time: '10:45', end_time: '11:45', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '11:45', end_time: '12:00', event: 'Mini-break', location: 'on-site' },
  { day: 'Friday', start_time: '12:00', end_time: '12:45', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '12:45', end_time: '13:45', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Friday', start_time: '14:00', end_time: '16:00', event: 'Pitch Event', location: 'Auditoire' }
];
  
    // Group by day
    const groupedSchedule = rawData.reduce((acc, event) => {
      if (!acc[event.day]) {
        acc[event.day] = [];
      }
      acc[event.day].push(event);
      return acc;
    }, {});

    // Convert to array 
    const processedSchedule = Object.entries(groupedSchedule)
      .map(([day, events]) => ({ day, events }));

    setScheduleData(processedSchedule);
  }, []);

  // Color mapping function
  const getBlockColor = (event) => {
    const colorMap = {
      'Team Work': 'blue',
      'Lunch': 'yellow',
      'Gouter': 'yellow',
      'Interviews & Box Lunch': 'green',
      'Keynote': 'blue',
      'Hackathon': 'red',
      'Pitch Event': 'pitch-event',
      'Team Work - Interview Prep': 'blue',
      'Off-site Interviews': 'blue2',
      'Box Lunch': 'green',
      'Mini-break': 'lightyellow-100'
    };
    return colorMap[event] || 'lightyellow';
  };

  // Convert time to pixel height with improved scaling
const calculateHeight = (startTime, endTime, isHackathon = false) => {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const duration = end - start;

  // Keep Hackathon with fixed height if needed
  if (isHackathon) {
    return {
      height: '3.5rem'
    };
  }

  // Base height for 30-minute blocks
  const baseHeight = 30;
  const calculatedHeight = Math.max(
    baseHeight,
    (duration / 30) * baseHeight
  );

  return {
    height: `${calculatedHeight}px`
  };
};


  return (
    <div className="schedule-container">
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="schedule-day">
          <div className="schedule-day-name">{day}</div>
          <div className="schedule-bars">
            {events.map((event, index) => {
        const positionStyle = calculateHeight(
          event.start_time,
          event.end_time,
          event.event === 'Hackathon'
        );
      
        return (
          <div
            key={index}
            className={`schedule-block ${getBlockColor(event.event)}`}
            style={{ height: positionStyle.height, marginBottom: '8px' }} // Add 8px spacing here
          >
            <div className="block-content">
              <div className="event-name">
                {event.start_time} – {event.end_time} <strong>{event.event}</strong>
              </div>
              <div className="event-location">{event.location}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; // 👈 this closing brace was missing

export default ScheduleDisplay;
