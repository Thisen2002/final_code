import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, HelpCircle, MapPin, Calendar, Building } from 'lucide-react'
import { geminiService } from './utils/geminiService'
import './ChatBot.css'
import mapImage from './kioskAssets/map.jpg'

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string; // Optional image to display in the message
}

const ChatBotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: geminiService.isApiKeyConfigured() 
        ? 'Hello! 👋 Welcome to EngEx! I\'m Gemini, your AI assistant for this amazing engineering exhibition. I\'m here to help you navigate the campus, find events, and discover all the incredible projects on display. What would you like to explore first?'
        : 'Hello! 👋 Welcome to EngEx! I\'m your friendly assistant for this amazing engineering exhibition. I\'m here to help you navigate the campus, find events, and discover all the incredible projects on display. What would you like to explore first?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Predefined quick questions
  const quickQuestions = [
    { icon: MapPin, text: 'Where is the main auditorium?', category: 'navigation' },
    { icon: Calendar, text: 'What events are happening today?', category: 'events' },
    { icon: Building, text: 'Show me the campus map', category: 'map' },
    { icon: HelpCircle, text: 'How do I get to the canteen?', category: 'help' }
  ]

  // Get bot response using Gemini AI or fallback responses
  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      return await geminiService.generateResponse(userMessage)
    } catch (error) {
      console.error('Error getting bot response:', error)
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our event coordinators at +94 81 239 3000 for assistance.'
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    const currentInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Get bot response from Gemini AI
      const responseText = await getBotResponse(currentInput)
      
      // Check if the response should include the campus map
      const shouldShowMap = currentInput.toLowerCase().includes('map') || 
                           currentInput.toLowerCase().includes('show') && currentInput.toLowerCase().includes('campus') ||
                           currentInput.toLowerCase().includes('where is')
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        imageUrl: shouldShowMap ? mapImage : undefined
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our event coordinators for assistance.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (questionText: string) => {
    setInputText(questionText)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full w-full flex flex-col animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">EngEx AI Assistant</h1>
            <p className="text-slate-300">Ask me anything about the exhibition</p>
          </div>
        </div>
        
        {/* API Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${geminiService.isApiKeyConfigured() ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
          <span className="text-xs text-slate-400">
            {geminiService.isApiKeyConfigured() ? 'Gemini 2.0' : 'Basic Mode'}
          </span>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="py-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Questions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question.text)}
                className="p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-white/10 rounded-xl transition-all duration-200 text-left group hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <question.icon className="h-5 w-5 text-blue-400 mt-0.5 group-hover:text-blue-300 transition-colors" />
                  <span className="text-slate-200 text-sm leading-relaxed">{question.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 chat-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-12'
                  : 'bg-slate-700/80 backdrop-blur-sm text-slate-100 border border-white/10'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
              
              {/* Display map image if included in the message */}
              {message.imageUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border-2 border-white/20 shadow-xl">
                  <img 
                    src={message.imageUrl} 
                    alt="Campus Map" 
                    className="w-full h-auto object-contain bg-white"
                  />
                  <div className="bg-slate-800/90 p-2 text-center">
                    <p className="text-xs text-slate-300">
                      🗺️ Faculty of Engineering Campus Map - Click to view larger
                    </p>
                  </div>
                </div>
              )}
              
              <span className="text-xs opacity-70 mt-2 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {message.sender === 'user' && (
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="bg-slate-700/80 backdrop-blur-sm border border-white/10 p-4 rounded-2xl shadow-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse animation-delay-200"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/20 pt-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about events, directions, facilities..."
            className="w-full p-4 pr-14 bg-slate-700/50 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 min-h-[56px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}

export default ChatBotPage