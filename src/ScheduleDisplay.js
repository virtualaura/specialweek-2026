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

import React, { useMemo } from 'react';
import './App.css';
import './index.css';
import './SpecialWeek.css';

const MINUTES_PER_HOUR = 60;
const PX_PER_MINUTE = 1.8;
const DAY_START = '08:30';
const DAY_END = '22:00';
const MIN_BLOCK_HEIGHT = 42;

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

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
};

const getBlockColor = (eventName) => {
  const colorMap = {
    'Team Work': 'blue',
    Lunch: 'yellow',
    Gouter: 'yellow',
    'Interviews & Box Lunch': 'green',
    Keynote: 'blue',
    Hackathon: 'red',
    'Pitch Event': 'pitch-event',
    'Team Work - Interview Prep': 'blue',
    'Off-site Interviews': 'blue2',
    'Off-site Interviews & Team Work': 'blue2',
    'Box Lunch': 'green',
    'Mini-break': 'lightyellow'
  };
  return colorMap[eventName] || 'lightyellow';
};

const layoutDayEvents = (events) => {
  const active = [];
  const layout = [];

  events.forEach((event) => {
    const eventStart = timeToMinutes(event.start_time);
    const eventEnd = timeToMinutes(event.end_time);

    for (let i = active.length - 1; i >= 0; i -= 1) {
      if (active[i].end <= eventStart) {
        active.splice(i, 1);
      }
    }

    const usedLanes = new Set(active.map((item) => item.lane));
    let lane = 0;
    while (usedLanes.has(lane)) {
      lane += 1;
    }

    active.push({ end: eventEnd, lane });
    const laneCount = Math.max(...active.map((item) => item.lane)) + 1;

    layout.push({ ...event, eventStart, eventEnd, lane, laneCount });
  });

  return layout;
};

const ScheduleDisplay = ({ isPdfView = false }) => {
  const dayStartMinutes = timeToMinutes(DAY_START);
  const dayEndMinutes = timeToMinutes(DAY_END);
  const dayDuration = dayEndMinutes - dayStartMinutes;

  const scheduleData = useMemo(() => {
    const grouped = rawData.reduce((acc, event) => {
      if (!acc[event.day]) {
        acc[event.day] = [];
      }
      acc[event.day].push(event);
      return acc;
    }, {});

    return Object.entries(grouped).map(([day, events]) => ({
      day,
      events: layoutDayEvents(
        [...events].sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time))
      )
    }));
  }, []);

  const hourMarks = [];
  for (let minute = dayStartMinutes; minute <= dayEndMinutes; minute += 60) {
    const hour = String(Math.floor(minute / 60)).padStart(2, '0');
    hourMarks.push(`${hour}:00`);
  }

  return (
    <div className={`schedule-container ${isPdfView ? 'pdf-schedule-container' : ''}`}>
      {scheduleData.map(({ day, events }) => (
        <div key={day} className="schedule-day">
          <div className="schedule-day-name">{day}</div>
          <div
            className="schedule-bars timeline"
            style={{ height: `${dayDuration * PX_PER_MINUTE}px` }}
          >
            <div className="hour-lines">
              {hourMarks.map((mark) => {
                const top = (timeToMinutes(mark) - dayStartMinutes) * PX_PER_MINUTE;
                return (
                  <div key={mark} className="hour-line" style={{ top: `${top}px` }}>
                    <span className="hour-label">{mark}</span>
                  </div>
                );
              })}
            </div>

            {events.map((event, index) => {
              const top = (event.eventStart - dayStartMinutes) * PX_PER_MINUTE;
              const height = Math.max((event.eventEnd - event.eventStart) * PX_PER_MINUTE, MIN_BLOCK_HEIGHT);
              const laneWidth = `${100 / event.laneCount}%`;
              const left = `${(100 / event.laneCount) * event.lane}%`;

              return (
                <div
                  key={`${event.day}-${event.start_time}-${event.end_time}-${index}`}
                  className={`schedule-block ${getBlockColor(event.event)}`}
                  style={{ top: `${top}px`, height: `${height}px`, left, width: laneWidth }}
                >
                  <div className="block-content">
                    <div className="event-name">
                      {event.start_time} - {event.end_time} <strong>{event.event}</strong>
                    </div>
                    <div className="event-location">{event.location}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleDisplay;
