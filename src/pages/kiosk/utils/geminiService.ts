import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null

  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    
    if (apiKey && apiKey !== 'your_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      return this.getFallbackResponse(prompt)
    }

    try {
      // Comprehensive training prompt with full EngEx and Faculty knowledge
      const enhancedPrompt = `You are Gemini, a highly knowledgeable AI assistant at EngEx 2025 (Engineering Exhibition) at the University of Peradeniya, Sri Lanka. You have been trained with comprehensive information about the exhibition and the faculty.

YOUR CORE KNOWLEDGE - ENGEX EXHIBITION:

ABOUT ENGEX:
- EngEx is the flagship annual event of Faculty of Engineering, University of Peradeniya
- Showcases innovative engineering projects by undergraduate students from all 8 departments
- Features: Project exhibitions, robotics competitions, keynote speeches, industry partnerships, career fair, innovation awards
- Completely FREE entry for all visitors

DEPARTMENTS EXHIBITING (8 total):
1. Civil Engineering - Infrastructure, construction, sustainable development
2. Mechanical Engineering - Robotics, automation, manufacturing
3. Electrical & Electronic Engineering - Power systems, electronics, renewable energy
4. Computer Engineering - AI/ML, software systems, embedded systems
5. Chemical & Process Engineering - Process optimization, chemical innovations
6. Production Engineering - Manufacturing systems, industrial engineering
7. Materials Engineering - Advanced materials, nanotechnology
8. Engineering Mathematics - Computational methods, data science

TODAY'S EVENT SCHEDULE WITH DETAILED LOCATIONS & ROUTES:

Morning:
• 09:00 AM - Registration & Welcome (Main Entrance Lobby)
  Route: Enter through main gate → Registration desk on right side of lobby

• 10:00 AM - Opening Ceremony (Main Auditorium, Central Building, Ground Floor)
  Route from Main Entrance: Enter lobby → Straight 50m → Left at Faculty Office → Right 20m (2-3 mins)
  Program: Chief Guest speech, Dean's address, Department presentations

• 11:30 AM - Tech Innovation Showcase (Exhibition Hall A, East Wing, Ground Floor)
  Route from Auditorium: Exit right → East corridor 100m → Hall on left (3-4 mins)
  Route from Main Entrance: Enter → Right → Green signs → East corridor → End (5 mins)
  Features: Top 20 projects, Interactive demos, 5 themed zones

Afternoon:
• 01:00 PM - Lunch Break
  Main Canteen (Student Center, West Wing): From Hall A → Back corridor → West Wing → Student Center 50m left (5 mins)
  
• 02:00 PM - Student Project Presentations (Main Auditorium - same as Opening Ceremony)
  Route from Canteen: Exit → Right to Central Building → Left at office → Auditorium right (3 mins)
  Program: Best Project Competition finals, Live demos, Q&A

• 03:30 PM - Robotics Competition (Sports Ground, Behind Main Building, Outdoor)
  Route from Auditorium: Rear exit → Back stairs → Outside → Ground 50m ahead (3 mins)
  Route from Main Entrance: Through lobby → Straight through building → Rear exit → 50m ahead (5 mins)
  Features: Line following, Maze solving, Sumo battles, Spectator seating

Evening:
• 04:00 PM - Industry Panel: "Future of Engineering in Sri Lanka" (Conference Hall, Admin Block, 2nd Floor)
  Route from Sports Ground: Main building rear → Elevator to 2nd floor → Right → 3rd door left (5 mins)
  Route from Main Entrance: Enter → Left at office → Elevator to 2nd → Right → 3rd door left (4 mins)

• 05:30 PM - Awards Ceremony (Main Auditorium - same as Opening)
  Route from Conference Hall: Elevator down to ground → Left → Auditorium right (2 mins)
  
• 06:00 PM - Drone Show (Front Lawn, Main Building - Outdoor)
  Route: Exit main entrance → Front lawn area (1 min) - Weather permitting

• 06:30 PM - Networking Session (Exhibition Hall B, West Wing)
  Route from Front Lawn: Re-enter → Left to West Wing → Hall B at end (4 mins)
  Features: Meet creators, Industry reps, Career fair, Refreshments

EXHIBITION ZONES:
• Zone A - Civil & Construction
• Zone B - Mechanical & Robotics  
• Zone C - Electrical & Electronics
• Zone D - Computer & IT
• Zone E - Chemical & Materials

CAMPUS LOCATIONS WITH DETAILED NAVIGATION:

Main Venues:
• Main Auditorium - Central Building, Ground Floor (800 seats, AC)
  From Entrance: Enter → Straight 50m → Left at Faculty Office → Right 20m (2-3 mins)
  From Parking: Follow blue "Auditorium" signs → Central Building → Ground floor
  Events: Opening (10 AM), Presentations (2 PM), Awards (5:30 PM)
  
• Exhibition Hall A - East Wing, Ground Floor (Main project displays)
  From Entrance: Enter → Right → Green signs → East corridor → End (5 mins)
  From Auditorium: Exit right → East corridor 100m → Hall left (3-4 mins)
  Contains: 5 project zones (Civil, Mechanical, Electrical, Computer, Chemical)
  
• Exhibition Hall B - West Wing, Ground Floor (Department booths, Networking)
  From Entrance: Enter → Left → West corridor → End (5 mins)
  From Hall A: Back to main corridor → West Wing → End (7-8 mins)
  
• Conference Hall - Administrative Block, 2nd Floor (200 seats)
  From Entrance: Enter → Left at office → Elevator/Stairs to 2nd → Right → 3rd door left (4-5 mins)
  Event: Industry Panel (4 PM)
  
• Sports Ground - Behind Main Building (Outdoor)
  From Entrance: Through lobby → Straight through → Rear exit → 50m ahead (5 mins)
  From Auditorium: Rear exit → Back stairs → Outside → Straight 50m (3 mins)
  Events: Robotics Competition (3:30 PM), Drone Show viewing

Food & Dining Locations:
• Main Canteen - Student Center, West Wing, Ground Floor (7 AM - 8 PM)
  From Entrance: Enter → Left to West Wing → Student Center 50m left (4 mins)
  From Hall A: Back corridor → Past entrance → West Wing → Student Center (5 mins)
  Menu: Rice & curry, Short eats, Beverages (Cash/Cards, 200+ seats)
  
• Food Court - Near Exhibition Hall B, West Wing (10 AM - 7 PM)
  Adjacent to Hall B area, Quick bites and snacks
  
• Coffee Shop - Library Building, Behind main building (8 AM - 6 PM)
  From Entrance: Through to rear → Library area → Ground floor (6 mins)
  Offers: Coffee, Tea, Pastries, Quiet atmosphere

Washroom Locations:
• Ground Floor - Near main entrance (right side of lobby, 10m from entrance)
• Ground Floor - Near registration area (behind registration desk)
• Ground Floor - Near Main Canteen (adjacent to Student Center canteen)
• First Floor - Both East & West wings (next to elevators in each wing)
• Second Floor - Near Conference Hall (beside seminar rooms)
• All include accessible washrooms, clearly marked with signage
• Accessible washrooms in each building

Services:
• Information Desks - Main entrance, Exhibition Halls A & B
• First Aid - Near main canteen (red cross sign)
• Parking - Front & rear lots (free)
• ATM - Main building, ground floor

CAMPUS MAP INFORMATION:
When someone asks for a map, directions, or where buildings are located, tell them:
"I can help you find your way! The campus is organized into zones A-F. You can view the detailed campus map on the Map page in this kiosk - just navigate to the 'Map' section. The map shows all 29 buildings including departments, labs, lecture halls, the library, canteen, and all facilities. Key buildings include: Building 1 (Chemical Engineering), Buildings 8-9 (Electrical & Computer), Building 18 (Thermodynamics), Building 27 (Library), Building 29 (Faculty Canteen). The main entrance is at the bottom right, with clear pathways marked throughout campus."

Key Campus Buildings (refer to official map):
• Zone A - Main academic area
• Zone B - Building 1 (Chemical & Process Engineering)
• Zone C - Buildings 8, 11, 12, 13 (Central buildings, Electrical, Computer Engineering)
• Zone D - Buildings 16-18, 22-23 (Labs: Mechanics, Thermodynamics)
• Zone E - Buildings 2-3 (Engineering Mathematics, Computer Center)
• Building 27 - Engineering Library
• Building 29 - Faculty Canteen
• Buildings 20-21 - Engineering Workshop & Carpentry Shop
• Main entrance/exit clearly marked on map

EMERGENCY CONTACTS:
• Event Coordinators: +94 81 239 3000
• Technical Support: +94 81 239 3001
• Security: +94 81 239 4914
• Medical Center: +94 81 239 2361

UNIVERSITY OF PERADENIYA - ENGINEERING FACULTY:

PRESTIGE & HISTORY:
• Founded in 1950 - Pioneer and first Engineering Faculty in Sri Lanka
• Shifted to current Peradeniya location in 1964
• #1 ranked Engineering Faculty in Sri Lanka
• Part of University of Peradeniya - Most prestigious university in Sri Lanka
• Located in Peradeniya, Kandy District (5km from Kandy city)
• Idyllic setting on banks of Mahaweli River at foothills of Hantana mountain range
• Known for rigorous academics and excellent graduate outcomes
• Over 6000+ students have graduated from this faculty
• Contact: Dean's Office +94 81 239 3302, deanoffice@eng.pdn.ac.lk

PROGRAMS:
• 4-year BSc Engineering Honours in 8 disciplines
• Annual intake: 550-600 students
• Postgraduate: MEng, MPhil, PhD programs
• Medium: English
• Nearly 100% employability rate for graduates

ACHIEVEMENTS:
• Strong research output in international journals
• Alumni at top global companies (Google, Microsoft, Amazon)
• Winners of international engineering competitions
• Strong industry partnerships
• Member of prestigious global engineering education networks

SPECIAL ATTRACTIONS TODAY:
• VR/AR Demonstrations
• Drone Show at 6 PM
• 3D Printing Live demos
• Robot Battles competition
• Interactive hands-on displays
• Career Fair with top companies

YOUR PERSONALITY & RESPONSE STYLE:
- Warm, enthusiastic, and genuinely helpful
- Conversational and natural (like chatting with a knowledgeable friend)
- You can answer ANY question - both EngEx-specific and general knowledge
- Provide clear, accurate, and engaging answers
- Use this knowledge to give specific, detailed responses about EngEx/Faculty
- For general questions (science, tech, etc.): Give helpful answers, then relate to EngEx if relevant
- Keep responses concise but informative (2-5 sentences)
- Use natural language with contractions (I'm, you're, it's)
- Use emojis sparingly when appropriate
- Show enthusiasm about the exhibition and faculty
- End with engaging follow-up questions when appropriate

EXAMPLES:

User: "Tell me about the engineering faculty"
You: "The Faculty of Engineering at University of Peradeniya is the #1 ranked and oldest engineering faculty in Sri Lanka, established in 1960! We offer 8 engineering programs with about 550-600 students annually. It's known for excellent academics, 95%+ graduate employment, and our alumni work at top companies like Google and Microsoft. The campus is beautiful too - right along the Mahaweli River near Kandy. What specific aspect interests you?"

User: "What projects can I see?"
You: "You'll see amazing projects across 5 zones! Zone A has civil engineering (bridge designs, smart cities), Zone B features robotics and automation, Zone C showcases renewable energy and electronics, Zone D has AI/ML and software systems, and Zone E displays chemical processes and materials science. The Top 20 projects are in Exhibition Hall A at 11:30 AM. Which area interests you most?"

User: "Where can I eat?"
You: "Great question! You have three options: Main Canteen (ground floor, Student Center, 7 AM-8 PM), Food Court (East Wing, 10 AM-7 PM), or the Coffee Shop (Library Building, 8 AM-6 PM). The Main Canteen has the most variety and is closest to Exhibition Hall A. Lunch break is at 1 PM if you want to sync with the schedule. Hungry now? 😊"

Now respond naturally and knowledgeably to:
User: ${prompt}`

      const result = await this.model.generateContent(enhancedPrompt)
      const response = await result.response
      const text = response.text()
      
      return text || this.getFallbackResponse(prompt)
    } catch (error) {
      console.error('Gemini 2.0 Flash API error:', error)
      return this.getFallbackResponse(prompt)
    }
  }

  private getFallbackResponse(prompt: string): string {
    const message = prompt.toLowerCase()
    
    // Greetings
    if (message.includes('hi') || message.includes('hello') || message.includes('hey') || message === 'h') {
      return 'Hello! 👋 Welcome to EngEx 2025! I\'m Gemini, and I\'m here to help with anything you need - whether it\'s about the exhibition, finding your way around campus, or just chatting. The exhibition features amazing projects from all 8 engineering departments. What\'s on your mind?'
    }

    // About EngEx
    if (message.includes('what is engex') || message.includes('about engex') || message.includes('tell me about')) {
      return 'EngEx is the flagship annual engineering exhibition organized by the Faculty of Engineering, University of Peradeniya - the #1 engineering faculty in Sri Lanka! It showcases innovative student projects from all 8 departments: Civil, Mechanical, Electrical, Computer, Chemical, Production, Materials, and Engineering Mathematics. Today we have project displays, robotics competitions, industry panels, and awards. Entry is completely FREE! What would you like to explore?'
    }

    // Faculty information
    if (message.includes('faculty') || message.includes('university') || message.includes('peradeniya')) {
      return 'The Faculty of Engineering at University of Peradeniya is the oldest (est. 1960) and #1 ranked engineering faculty in Sri Lanka! We have 8 engineering programs with 550-600 students annually. Located in beautiful Peradeniya near Kandy, it\'s known for rigorous academics and 95%+ graduate employment. Our alumni work at top companies like Google, Microsoft, and Amazon worldwide! What specific aspect interests you?'
    }

    // Schedule/Events  
    if (message.includes('event') || message.includes('schedule') || message.includes('program') || message.includes('time')) {
      return 'Today\'s exciting schedule:\n🌅 Morning: 10 AM Opening Ceremony, 11:30 AM Tech Innovation Showcase\n☀️ Afternoon: 2 PM Student Presentations, 3:30 PM Robotics Competition\n🌆 Evening: 4 PM Industry Panel, 5:30 PM Awards, 6:30 PM Networking\n\nThere\'s also a Drone Show at 6 PM! Which event interests you?'
    }

    // Departments
    if (message.includes('department') || message.includes('which projects') || message.includes('what can i see')) {
      return 'You can explore projects from 8 engineering departments across 5 zones:\n• Zone A: Civil Engineering (infrastructure, bridges)\n• Zone B: Mechanical (robotics, automation)\n• Zone C: Electrical (renewable energy, electronics)\n• Zone D: Computer (AI/ML, software)\n• Zone E: Chemical & Materials (processes, nanotechnology)\n\nThe Top 20 projects showcase is at Exhibition Hall A, 11:30 AM! Which area interests you most?'
    }
    
    // General questions - AI/Technology
    if (message.includes('what is ai') || message.includes('artificial intelligence')) {
      return 'Great question! AI (Artificial Intelligence) is technology that enables computers to learn, reason, and solve problems like humans do. It powers things like voice assistants, recommendation systems, and even me! 😊 Speaking of which, Zone D has amazing AI/ML projects from Computer Engineering students - from chatbots to computer vision systems. Want to check them out?'
    }

    if (message.includes('who made you') || message.includes('who created you')) {
      return 'I\'m Gemini, created by Google! I\'m an AI assistant powered by advanced machine learning. Right now I\'m trained specifically to help EngEx visitors with information about the exhibition, campus navigation, and general questions. Interestingly, you can see similar AI projects being built by our Computer Engineering students in Zone D! What else would you like to know?'
    }

    if (message.includes('how are you') || message.includes('how r u')) {
      return 'I\'m doing fantastic, thank you for asking! 😊 I\'m really excited to be here at EngEx 2025 - there are so many incredible projects on display today from all 8 engineering departments! The energy here is amazing with hundreds of visitors exploring innovations. How are you doing? What brings you to EngEx today?'
    }
    
    // Locations
    if (message.includes('auditorium') || message.includes('hall') || message.includes('ceremony')) {
      return 'The Main Auditorium is in the Central Building - just follow the blue signs from the main entrance! It seats 800 people and hosts the Opening Ceremony (10 AM), Student Presentations (2 PM), and Awards Ceremony (5:30 PM) today. It\'s about a 3-minute walk straight ahead from the entrance. Heading there now?'
    }
    
    if (message.includes('map') || message.includes('navigation') || message.includes('direction') || message.includes('where is') || message.includes('campus map') || message.includes('show me map') || message.includes('show map')) {
      return '🗺️ Here\'s the detailed campus map of the Faculty of Engineering, University of Peradeniya!\n\nThe campus is organized into zones A-F with 29 buildings:\n\n📍 Key Locations:\n• Zone A - Main academic area\n• Zone B - Building 1 (Chemical & Process Engineering)\n• Zone C - Buildings 8-9 (Electrical & Computer Engineering)\n• Zone D - Buildings 16-18 (Mechanics, Thermodynamics Labs)\n• Building 27 - Engineering Library\n• Building 29 - Faculty Canteen\n\n🚶 The main entrance is at the bottom right of the campus. All pathways and buildings are clearly marked on the map above.\n\nWhere would you like to go? I can give you specific walking directions!'
    }
    
    if (message.includes('canteen') || message.includes('food') || message.includes('eat') || message.includes('hungry') || message.includes('lunch') || message.includes('dinner')) {
      return 'Hungry? You have three great options! 🍽️\n• Main Canteen - Ground floor, Student Center (7 AM - 8 PM) - Most variety!\n• Food Court - East Wing (10 AM - 7 PM) - Quick bites\n• Coffee Shop - Library Building (8 AM - 6 PM) - Snacks & beverages\n\nLunch break is at 1 PM. The Main Canteen is closest to Exhibition Hall A. What sounds good?'
    }
    
    if (message.includes('washroom') || message.includes('restroom') || message.includes('toilet') || message.includes('bathroom')) {
      return 'Washrooms are conveniently located throughout campus:\n• Ground floor - Near main entrance & registration\n• First floor - Next to elevators (both East & West wings)\n• Second floor - Beside conference rooms\n• Accessible washrooms available in each building\n\nAll clearly marked with signage. The nearest from here is ground floor near the main entrance. Need directions?'
    }

    if (message.includes('parking') || message.includes('park my car')) {
      return 'Parking is available at two locations - both FREE for visitors! 🚗\n• Front parking lot (main entrance area)\n• Rear parking lot (behind sports ground)\n\nSpaces are limited, so we recommend arriving early or using public transport. Buses and tuk-tuks run regularly from Kandy city (5km away). Already parked, or still on your way?'
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('contact') || message.includes('emergency')) {
      return 'I\'m here to help! For immediate assistance:\n📞 Event Coordinators: +94 81 239 3000\n💻 Technical Support: +94 81 239 3001\n🚨 Security: +94 81 239 4914\n⚕️ Medical Center: +94 81 239 2361\n\nInformation desks are at the main entrance and both exhibition halls. First aid station is near the main canteen (look for red cross). What do you need help with?'
    }

    if (message.includes('robot') || message.includes('competition')) {
      return 'The Robotics Competition is at 3:30 PM today at the Sports Ground! 🤖 It features line following challenges, maze solving, and sumo robot battles created by Mechanical and Computer Engineering students. It\'s one of the most exciting events - definitely worth watching! There are also robotics displays in Zone B (Exhibition Hall). Planning to check it out?'
    }

    if (message.includes('award') || message.includes('prize')) {
      return 'The Awards Ceremony is at 5:30 PM in the Main Auditorium! 🏆 Categories include Best Project Award, Innovation Award, and department-specific prizes. Winners are selected from today\'s presentations and judging. It\'s followed by the networking session at 6:30 PM. The competition has been fierce - some amazing projects this year! Excited to see who wins?'
    }
    
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      return 'You\'re very welcome! I\'m really happy I could help make your EngEx experience great. 😊 If you have any other questions as you explore the exhibition, don\'t hesitate to come back and ask. Enjoy discovering all the innovative projects, and have an amazing time at EngEx 2025! 🎉'
    }

    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return 'Goodbye! Thanks so much for visiting EngEx 2025! 👋 I hope you have an incredible time exploring all the innovative engineering projects and connecting with our talented students. Feel free to come back if you need anything. Enjoy the rest of the exhibition! 🌟'
    }
    
    // General knowledge fallback
    if (message.includes('what') || message.includes('how') || message.includes('why') || message.includes('when') || message.includes('who')) {
      return 'That\'s an interesting question! While I have detailed knowledge about EngEx and the Faculty of Engineering, I can try to help with general questions too. For the most comprehensive answers, I recommend adding your Google Gemini API key. In the meantime, feel free to ask me about:\n• EngEx exhibition details and schedule\n• The 8 engineering departments and their projects\n• Campus facilities and directions\n• University of Peradeniya Faculty history\n• Specific events happening today\n\nWhat would you like to know? 😊'
    }
    
    // Default friendly response
    return 'Hi there! Welcome to EngEx 2025! 🎉 I\'m Gemini, your AI assistant with comprehensive knowledge about this amazing engineering exhibition. I can help you with:\n• Exhibition schedule and events\n• Information about all 8 engineering departments\n• Campus navigation and facilities\n• Faculty of Engineering history and achievements\n• Specific project locations and details\n• General questions about engineering and technology\n\nWhat would you like to explore? Just ask me anything!'
  }

  isApiKeyConfigured(): boolean {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
    return apiKey && apiKey !== 'your_api_key_here'
  }
}

export const geminiService = new GeminiService()