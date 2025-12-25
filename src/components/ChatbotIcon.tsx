import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const ChatbotIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isKiosk = location.pathname.startsWith('/kiosk');
  
  // Subscribe to currentPage changes
  const [currentKioskPage, setCurrentKioskPage] = useState(0);
  
  useEffect(() => {
    const handlePageChange = (e: CustomEvent) => {
      setCurrentKioskPage(e.detail.pageIndex);
    };
    
    window.addEventListener('kioskPageChange', handlePageChange as EventListener);
    return () => {
      window.removeEventListener('kioskPageChange', handlePageChange as EventListener);
    };
  }, []);

  // Don't render the icon if we're in kiosk mode and on the chat page (index 5)
  if (isKiosk && currentKioskPage === 5) {
    return null;
  }

  const handleClick = () => {
    if (isKiosk) {
      // If already in kiosk mode, switch to the chat page (index 5 in the pages array)
      const event = new CustomEvent('switchToChat', { detail: { pageIndex: 5 } });
      window.dispatchEvent(event);
    } else {
      // If not in kiosk mode, navigate to kiosk chat page
      navigate('/kiosk');
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
      onClick={handleClick}
      title="Open Chatbot"
    >
      <MessageCircle size={24} />
    </div>
  );
};

export default ChatbotIcon;