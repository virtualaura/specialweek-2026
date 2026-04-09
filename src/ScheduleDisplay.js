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
const PX_PER_MINUTE_SCREEN = 1.8;
const PX_PER_MINUTE_PDF = 0.65;
const DAY_START = '08:30';
const MIN_BLOCK_HEIGHT_SCREEN = 42;
const MIN_BLOCK_HEIGHT_PDF = 26;
const HACKATHON_DISPLAY_MINUTES_SCREEN = 120;
const HACKATHON_DISPLAY_MINUTES_PDF = 60;

const rawData = [
  { day: 'Tuesday', start_time: '08:30', end_time: '10:10', event: 'Presentation: Introduction & Planning', location: 'Pitch Room' },
  { day: 'Tuesday', start_time: '10:15', end_time: '10:40', event: 'Gouter', location: 'on-site' },
  { day: 'Tuesday', start_time: '10:45', end_time: '11:15', event: 'Presentation: Problem Framing', location: 'Pitch Room' },
  { day: 'Tuesday', start_time: '11:20', end_time: '12:40', event: 'Team Work', location: 'on-site' },
  { day: 'Tuesday', start_time: '12:45', end_time: '13:45', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Tuesday', start_time: '13:50', end_time: '14:30', event: 'Presentation: User Feedback', location: 'Pitch Room' },
  { day: 'Tuesday', start_time: '14:35', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Wednesday', start_time: '08:30', end_time: '13:40', event: 'Off-Site Interviews & Box Lunch', location: 'off-site' },
  { day: 'Wednesday', start_time: '08:30', end_time: '12:40', event: 'Team Work: Planning and Coding Work', location: 'on-site' },
  { day: 'Wednesday', start_time: '12:45', end_time: '13:40', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Wednesday', start_time: '13:45', end_time: '14:15', event: 'Team Presentations: Problem Identification', location: 'on-site' },
  { day: 'Wednesday', start_time: '13:45', end_time: '14:15', event: 'Team Work', location: 'on-site' },
  { day: 'Wednesday', start_time: '14:20', end_time: '15:30', event: 'Presentation: Developing Solutions', location: 'Pitch Room' },
  { day: 'Thursday', start_time: '08:30', end_time: '09:10', event: 'Presentation: Solution Ideation & Prototyping', location: 'on-site' },
  { day: 'Thursday', start_time: '09:15', end_time: '10:10', event: 'Team Work', location: 'on-site' },  
  { day: 'Thursday', start_time: '10:15', end_time: '10:40', event: 'Gouter', location: 'on-site' },
  { day: 'Thursday', start_time: '10:45', end_time: '11:55', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '12:00', end_time: '12:40', event: 'Presentation: Assessing Pitches', location: 'Pitch Room' },
  { day: 'Thursday', start_time: '12:45', end_time: '13:30', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Thursday', start_time: '13:35', end_time: '16:30', event: 'Off-Site Interviews', location: 'off-site' },
  { day: 'Thursday', start_time: '13:35', end_time: '16:30', event: 'Team Work: Prototype and Pitch Preparations', location: 'on-site' },
  { day: 'Thursday', start_time: '17:00', end_time: '22:00', event: 'Hackathon', location: 'on-site' },
  { day: 'Friday', start_time: '08:30', end_time: '09:10', event: 'Presentation: Pitch Development', location: 'Pitch Room' },
  { day: 'Friday', start_time: '09:15', end_time: '10:10', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '10:15', end_time: '10:40', event: 'Gouter', location: 'on-site' },
  { day: 'Friday', start_time: '10:45', end_time: '11:55', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '12:00', end_time: '12:30', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Friday', start_time: '12:00', end_time: '12:55', event: 'Working Lunch', location: 'on-site' },
  { day: 'Friday', start_time: '12:30', end_time: '12:55', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '13:00', end_time: '16:00', event: 'Pitch Event and Prize Ceremony', location: 'Pitch Room' }
];

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
};

const getEventClass = (eventName) => {
  if (eventName.startsWith('Presentation:')) {
    return 'event--presentation';
  }
  if (eventName === 'Gouter' || eventName === 'Lunch') {
    return 'event--meal';
  }
  if (eventName === 'Working Lunch') {
    return 'event--working-lunch';
  }
  if (eventName.startsWith('Team Work')) {
    return 'event--teamwork';
  }
  if (eventName.startsWith('Team Presentations:')) {
    return 'event--team-presentations';
  }
  if (eventName.includes('Hackathon')) {
    return 'event--hackathon';
  }
  if (eventName.includes('Pitch Event')) {
    return 'event--pitch-event';
  }
  return 'event--default';
};

const layoutDayEvents = (events) => {
  const enriched = events.map((event) => ({
    ...event,
    eventStart: timeToMinutes(event.start_time),
    eventEnd: timeToMinutes(event.end_time)
  }));

  const clusters = [];
  let current = [];
  let currentMaxEnd = -1;

  enriched.forEach((event) => {
    if (current.length === 0 || event.eventStart < currentMaxEnd) {
      current.push(event);
      currentMaxEnd = Math.max(currentMaxEnd, event.eventEnd);
    } else {
      clusters.push(current);
      current = [event];
      currentMaxEnd = event.eventEnd;
    }
  });
  if (current.length > 0) {
    clusters.push(current);
  }

  return clusters.flatMap((cluster) => {
    const active = [];
    const laidOut = [];

    cluster.forEach((event) => {
      for (let i = active.length - 1; i >= 0; i -= 1) {
        if (active[i].end <= event.eventStart) {
          active.splice(i, 1);
        }
      }

      const usedLanes = new Set(active.map((item) => item.lane));
      let lane = 0;
      while (usedLanes.has(lane)) {
        lane += 1;
      }

      active.push({ end: event.eventEnd, lane });
      laidOut.push({ ...event, lane });
    });

    const laneCount = Math.max(...laidOut.map((item) => item.lane), 0) + 1;
    return laidOut.map((item) => ({ ...item, laneCount }));
  });
};

const ScheduleDisplay = ({ isPdfView = false }) => {
  const dayStartMinutes = timeToMinutes(DAY_START);
  const pixelsPerMinute = isPdfView ? PX_PER_MINUTE_PDF : PX_PER_MINUTE_SCREEN;
  const minBlockHeight = isPdfView ? MIN_BLOCK_HEIGHT_PDF : MIN_BLOCK_HEIGHT_SCREEN;
  const hackathonDisplayMinutes = isPdfView
    ? HACKATHON_DISPLAY_MINUTES_PDF
    : HACKATHON_DISPLAY_MINUTES_SCREEN;

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
      ),
      displayedDayMinutes: layoutDayEvents(
        [...events].sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time))
      ).reduce((maxEnd, event) => {
        const isHackathonEvent = event.event.includes('Hackathon');
        const displayDurationMinutes = isHackathonEvent
          ? hackathonDisplayMinutes
          : (event.eventEnd - event.eventStart);
        return Math.max(maxEnd, event.eventStart + displayDurationMinutes);
      }, dayStartMinutes) - dayStartMinutes
    }));
  }, [dayStartMinutes, hackathonDisplayMinutes]);

  return (
    <div className={`schedule-container ${isPdfView ? 'pdf-schedule-container' : ''}`}>
      {scheduleData.map(({ day, events, displayedDayMinutes }) => (
        <div key={day} className="schedule-day">
          <div className="schedule-day-name">{day}</div>
          <div
            className="schedule-bars timeline"
            style={{ height: `${displayedDayMinutes * pixelsPerMinute}px` }}
          >
            {events.map((event, index) => {
              const top = (event.eventStart - dayStartMinutes) * pixelsPerMinute;
              const isHackathonEvent = event.event.includes('Hackathon');
              const displayDurationMinutes = isHackathonEvent
                ? hackathonDisplayMinutes
                : (event.eventEnd - event.eventStart);
              const textContent = `${event.start_time} - ${event.end_time} ${event.event}`;
              const charsPerLine = event.laneCount > 1 ? 24 : 38;
              const estimatedLines = Math.ceil(textContent.length / charsPerLine);
              const textLineHeight = isPdfView ? 11 : 15;
              const estimatedTextHeight = Math.max(estimatedLines * textLineHeight + 10, minBlockHeight);
              const height = Math.max(displayDurationMinutes * pixelsPerMinute, estimatedTextHeight);
              const laneWidth = `calc(${100 / event.laneCount}% - 6px)`;
              const left = `calc(${(100 / event.laneCount) * event.lane}% + 3px)`;
              const offsiteClass = event.location === 'off-site' ? 'is-offsite' : '';

              return (
                <div
                  key={`${event.day}-${event.start_time}-${event.end_time}-${index}`}
                  className={`schedule-block ${getEventClass(event.event)} ${offsiteClass}`}
                  style={{ top: `${top}px`, height: `${height}px`, left, width: laneWidth }}
                >
                  <div className="block-content">
                    <div className="event-name">
                      {event.start_time} - {event.end_time} <strong>{event.event}</strong>
                    </div>
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
