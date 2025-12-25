interface Event {
  time: string;
  title: string;
  location: string;
  description: string;
  department?: string;
  speakers?: string[];
}

interface DailySchedule {
  date: string;
  events: Event[];
}

export const eventSchedule: DailySchedule[] = [
  {
    date: "2025-10-15", // Today's date
    events: [
      {
        time: "09:00 AM - 10:00 AM",
        title: "Registration & Welcome",
        location: "Main Entrance Lobby",
        description: "Registration for all visitors, distribution of event materials and badges."
      },
      {
        time: "10:00 AM - 11:30 AM",
        title: "Opening Ceremony",
        location: "Prof. E.O.E. Pereira Theatre",
        description: "Official inauguration of EngEx 2025 with keynote speeches",
        speakers: ["Faculty Dean", "Chief Guest - Industry Leader"]
      },
      {
        time: "11:30 AM - 01:00 PM",
        title: "Department Project Exhibitions",
        location: "Department Buildings",
        description: "Showcase of final year projects from all departments",
        department: "All Departments"
      },
      {
        time: "01:00 PM - 02:00 PM",
        title: "Lunch Break & Networking",
        location: "Faculty Grounds",
        description: "Networking session with industry partners"
      },
      {
        time: "02:00 PM - 03:30 PM",
        title: "Robotics Competition",
        location: "Civil Engineering Auditorium",
        description: "Inter-university robotics competition finals",
        department: "Mechanical Engineering"
      },
      {
        time: "03:30 PM - 05:00 PM",
        title: "Innovation Awards Ceremony",
        location: "Prof. E.O.E. Pereira Theatre",
        description: "Recognition of outstanding student projects and innovations"
      }
    ]
  }
];

export const getEventsForDate = (date: string): Event[] => {
  const schedule = eventSchedule.find(day => day.date === date);
  return schedule ? schedule.events : [];
};

export const getCurrentEvents = (): Event[] => {
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const todayEvents = getEventsForDate(
    now.toISOString().split('T')[0]
  );

  return todayEvents.filter(event => {
    const [startTime] = event.time.split(' - ')[0].split(' ')[0].split(':');
    const eventHour = parseInt(startTime);
    return eventHour >= now.getHours();
  });
};

export const formatEventResponse = (events: Event[]): string => {
  if (events.length === 0) {
    return "There are no more events scheduled for today.";
  }

  const response = ["Here are the events:"];
  
  events.forEach((event, index) => {
    response.push(`\n${index + 1}. ${event.title}`);
    response.push(`   ⏰ Time: ${event.time}`);
    response.push(`   📍 Location: ${event.location}`);
    if (event.department) {
      response.push(`   🏛️ Department: ${event.department}`);
    }
    if (event.description) {
      response.push(`   ℹ️ ${event.description}`);
    }
    if (event.speakers && event.speakers.length > 0) {
      response.push(`   🎤 Speakers: ${event.speakers.join(", ")}`);
    }
  });

  return response.join("\n");
};