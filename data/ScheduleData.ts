export interface EventScheduleItem {
  day: string;
  start_time: string;
  end_time: string;
  event: string;
  location: string;
}

export const eventScheduleData: EventScheduleItem[] = [
  { day: 'Tuesday', start_time: '08:40', end_time: '10:10', event: 'Presentation: Introduction & Planning', location: 'Pitch Room' },
  { day: 'Tuesday', start_time: '10:15', end_time: '10:40', event: 'Gouter', location: 'on-site' },
  { day: 'Tuesday', start_time: '10:45', end_time: '11:15', event: 'Presentation: Problem Framing', location: 'Pitch Room' },
  { day: 'Tuesday', start_time: '11:20', end_time: '12:40', event: 'Team Work', location: 'on-site' },
  { day: 'Tuesday', start_time: '12:45', end_time: '13:40', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Tuesday', start_time: '13:45', end_time: '14:30', event: 'Presentation: User Feedback', location: 'Pitch Room' },
  { day: 'Tuesday', start_time: '14:35', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Wednesday', start_time: '08:40', end_time: '12:40', event: 'Interviews & Box Lunch', location: 'off-site' },
  { day: 'Wednesday', start_time: '08:40', end_time: '12:40', event: 'Team Work: Planning and Coding', location: 'on-site' },
  { day: 'Wednesday', start_time: '12:45', end_time: '13:40', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Wednesday', start_time: '13:45', end_time: '14:15', event: 'Team Presentations: Problem Identification', location: 'on-site' },
  { day: 'Wednesday', start_time: '14:20', end_time: '14:45', event: 'Presentation: Developing Solutions', location: 'Pitch Room' },
  { day: 'Wednesday', start_time: '14:50', end_time: '15:30', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '08:40', end_time: '09:10', event: 'Presentation: Solution Ideation & Prototyping', location: 'on-site' },
  { day: 'Thursday', start_time: '09:15', end_time: '10:10', event: 'Team Work', location: 'on-site' },  
  { day: 'Thursday', start_time: '10:15', end_time: '10:40', event: 'Gouter', location: 'on-site' },
  { day: 'Thursday', start_time: '10:45', end_time: '12:10', event: 'Team Work', location: 'on-site' },
  { day: 'Thursday', start_time: '12:15', end_time: '12:40', event: 'Presentation: Assessing Pitches', location: 'Pitch Room' },
  { day: 'Thursday', start_time: '12:45', end_time: '13:40', event: 'Lunch', location: 'Rosey Dining Hall' },
  { day: 'Thursday', start_time: '13:45', end_time: '16:30', event: 'Interviews', location: 'off-site' },
  { day: 'Thursday', start_time: '17:00', end_time: '22:00', event: 'Hackathon', location: 'on-site' },
  { day: 'Friday', start_time: '08:40', end_time: '09:10', event: 'Presentation: Pitch Development', location: 'Pitch Room' },
  { day: 'Friday', start_time: '09:15', end_time: '10:10', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '10:15', end_time: '10:40', event: 'Gouter', location: 'on-site' },
  { day: 'Friday', start_time: '10:45', end_time: '12:00', event: 'Team Work', location: 'on-site' },
  { day: 'Friday', start_time: '12:05', end_time: '12:50', event: 'Working Lunch', location: 'Rosey Dining Hall' },
  { day: 'Friday', start_time: '13:00', end_time: '14:00', event: 'Round 1 Pitches', location: 'Salles Polyvalentes' },
  { day: 'Friday', start_time: '14:30', end_time: '17:00', event: 'Final Pitch Event and Prize Ceremony', location: 'Pitch Room' }
];
