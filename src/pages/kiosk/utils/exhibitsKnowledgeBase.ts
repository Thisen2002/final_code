interface Exhibit {
  id: string;
  title: string;
  department: string;
  zone: string;
  location: string;
  description: string;
  creators?: string[];
  tags?: string[];
  specialFeatures?: string[];
}

export const exhibits: Record<string, Exhibit[]> = {
  "Civil Engineering": [
    {
      id: "CE001",
      title: "Smart Bridge Monitoring System",
      department: "Civil Engineering",
      zone: "Zone A",
      location: "Civil Engineering Building - Room 101",
      description: "Real-time structural health monitoring system for bridges using IoT sensors",
      creators: ["Team Bridge Tech"],
      tags: ["IoT", "Structural Health", "Smart Infrastructure"],
      specialFeatures: ["Live Demo", "Interactive Display"]
    },
    {
      id: "CE002",
      title: "Eco-Friendly Construction Materials",
      department: "Civil Engineering",
      zone: "Zone A",
      location: "Civil Engineering Building - Room 102",
      description: "Sustainable building materials made from recycled waste",
      creators: ["Green Build Team"],
      tags: ["Sustainability", "Recycling", "Green Building"]
    }
  ],
  "Mechanical Engineering": [
    {
      id: "ME001",
      title: "Autonomous Delivery Robot",
      department: "Mechanical Engineering",
      zone: "Zone B",
      location: "Mechanical Workshop",
      description: "Self-navigating robot for campus deliveries",
      creators: ["Robotics Team Alpha"],
      tags: ["Robotics", "AI", "Automation"],
      specialFeatures: ["Live Demo", "Test Drive Available"]
    },
    {
      id: "ME002",
      title: "Solar-Powered Vehicle",
      department: "Mechanical Engineering",
      zone: "Zone B",
      location: "Mechanical Lab 2",
      description: "Electric vehicle with integrated solar charging system",
      creators: ["Team Solar Drive"],
      tags: ["Renewable Energy", "Transportation", "Innovation"]
    }
  ],
  "Electrical & Electronic Engineering": [
    {
      id: "EE001",
      title: "Smart Grid System",
      department: "Electrical & Electronic Engineering",
      zone: "Zone C",
      location: "Power Systems Lab",
      description: "Intelligent power distribution and management system",
      creators: ["Power Tech Team"],
      tags: ["Smart Grid", "Power Systems", "Energy Management"],
      specialFeatures: ["Interactive Simulation"]
    },
    {
      id: "EE002",
      title: "IoT Weather Station",
      department: "Electrical & Electronic Engineering",
      zone: "Zone C",
      location: "Electronics Lab",
      description: "Connected weather monitoring and prediction system",
      creators: ["Weather Tech Team"],
      tags: ["IoT", "Weather", "Sensors"]
    }
  ],
  "Computer Engineering": [
    {
      id: "CE001",
      title: "AI-Powered Healthcare Assistant",
      department: "Computer Engineering",
      zone: "Zone D",
      location: "Computing Center",
      description: "Machine learning system for medical diagnosis assistance",
      creators: ["Health AI Team"],
      tags: ["AI", "Healthcare", "Machine Learning"],
      specialFeatures: ["Live Demo", "Interactive Testing"]
    },
    {
      id: "CE002",
      title: "Blockchain Voting System",
      department: "Computer Engineering",
      zone: "Zone D",
      location: "Software Lab",
      description: "Secure electronic voting system using blockchain",
      creators: ["Blockchain Innovation Team"],
      tags: ["Blockchain", "Security", "E-Governance"]
    }
  ],
  "Chemical & Process Engineering": [
    {
      id: "CP001",
      title: "Water Purification System",
      department: "Chemical & Process Engineering",
      zone: "Zone E",
      location: "Process Lab",
      description: "Advanced water treatment using novel filtration methods",
      creators: ["Water Tech Team"],
      tags: ["Water Treatment", "Environment", "Sustainability"],
      specialFeatures: ["Live Demonstration"]
    },
    {
      id: "CP002",
      title: "Biofuel Production Plant",
      department: "Chemical & Process Engineering",
      zone: "Zone E",
      location: "Chemical Engineering Lab",
      description: "Small-scale biofuel production from agricultural waste",
      creators: ["Bio Energy Team"],
      tags: ["Biofuel", "Renewable Energy", "Waste Management"]
    }
  ]
};

export const getExhibitsByDepartment = (department: string): Exhibit[] => {
  return exhibits[department] || [];
};

export const getExhibitsByZone = (zone: string): Exhibit[] => {
  return Object.values(exhibits)
    .flat()
    .filter(exhibit => exhibit.zone.toLowerCase() === zone.toLowerCase());
};

export const formatExhibitsResponse = (exhibits: Exhibit[]): string => {
  if (exhibits.length === 0) {
    return "No exhibits found for the specified department/zone.";
  }

  const response = ["Here are the exhibits:"];

  exhibits.forEach((exhibit, index) => {
    response.push(`\n${index + 1}. ${exhibit.title}`);
    response.push(`   📍 Location: ${exhibit.location}`);
    response.push(`   🏢 Department: ${exhibit.department}`);
    response.push(`   🎯 Zone: ${exhibit.zone}`);
    response.push(`   ℹ️ ${exhibit.description}`);
    
    if (exhibit.creators && exhibit.creators.length > 0) {
      response.push(`   👥 Created by: ${exhibit.creators.join(", ")}`);
    }
    
    if (exhibit.specialFeatures && exhibit.specialFeatures.length > 0) {
      response.push(`   ⭐ Special Features: ${exhibit.specialFeatures.join(", ")}`);
    }
    
    if (exhibit.tags && exhibit.tags.length > 0) {
      response.push(`   🏷️ Tags: ${exhibit.tags.join(", ")}`);
    }
  });

  return response.join("\n");
};