import { useState, useEffect, useRef, useCallback } from 'react'
import HomePageTailwind from './HomePage'
import SchedulePageTailwind from './SchedulePage'
import ExhibitsPageTailwind from './ExhibitsPage'
import MapPageTailwind from './MapPage'
import HeatMapPageTailwind from './HeatMapPage'
import ChatBotPage from './ChatBotPage'
import IntroVideoTailwind from './IntroVideo'
import NavigationTailwind from './Navigation'
import FooterTailwind from './Footer'
import NotificationsPage from './NotificationsPage';


const AppKiosk: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(true);
  const inactivityTimerRef = useRef<number | null>(null);

  // Combined: include both NotificationsPage and ChatBotPage
  const pages = [
    HomePageTailwind,
    SchedulePageTailwind,
    ExhibitsPageTailwind,
    MapPageTailwind,
    HeatMapPageTailwind,
    NotificationsPage,
    ChatBotPage
  ];

  // ✅ Fixed function
  const handleUserActivity = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set a 60-second inactivity timer to reset to Home
    inactivityTimerRef.current = window.setTimeout(() => {
      setCurrentPage(0);
      setShowIntroVideo(true); // optionally go back to intro after inactivity
    }, 60000);
  }, []);

  const handleIntroVideoClick = () => {
    setShowIntroVideo(false);
    setCurrentPage(0);
    handleUserActivity();
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    handleUserActivity();
    // Emit page change event for ChatbotIcon
    const event = new CustomEvent('kioskPageChange', { detail: { pageIndex } });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'] as const;
    const addEventListeners = () => events.forEach(event => document.addEventListener(event, handleUserActivity, true));
    const removeEventListeners = () => events.forEach(event => document.removeEventListener(event, handleUserActivity, true));

    // Add listener for chat icon clicks
    const handleChatIconClick = (e: CustomEvent) => {
      setCurrentPage(e.detail.pageIndex);
      handleUserActivity();
      // Emit page change event for ChatbotIcon
      const pageChangeEvent = new CustomEvent('kioskPageChange', { detail: { pageIndex: e.detail.pageIndex } });
      window.dispatchEvent(pageChangeEvent);
    };
    window.addEventListener('switchToChat', handleChatIconClick as EventListener);

    // Listen for kiosk navigation requests (from internal components)
    const handleKioskNavigate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail || {};
        const pageIndex = typeof detail.pageIndex === 'number' ? detail.pageIndex : 3; // default to Map page
        setCurrentPage(pageIndex);
        handleUserActivity();
        const pageChangeEvent = new CustomEvent('kioskPageChange', { detail: { pageIndex } });
        window.dispatchEvent(pageChangeEvent);
      } catch (err) {
        console.error('handleKioskNavigate error', err);
      }
    };
    window.addEventListener('kioskNavigate', handleKioskNavigate as EventListener);

    if (!showIntroVideo) {
      addEventListeners();
      handleUserActivity();
    } else {
      removeEventListeners();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }

    return () => {
      removeEventListeners();
      window.removeEventListener('switchToChat', handleChatIconClick as EventListener);
      window.removeEventListener('kioskNavigate', handleKioskNavigate as EventListener);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [showIntroVideo, handleUserActivity]);

  const CurrentComponent = pages[currentPage];

  if (showIntroVideo) return <IntroVideoTailwind onVideoClick={handleIntroVideoClick} />;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 relative flex flex-col overflow-hidden text-base">
      {/* Overlay gradients */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 80%, rgba(56,189,248,0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(59,130,246,0.08) 0%, transparent 50%),
                       radial-gradient(circle at 40% 40%, rgba(6,182,212,0.12) 0%, transparent 50%),
                       linear-gradient(180deg, rgba(56,189,248,0.05) 0%, transparent 100%)`
        }}
      />

      {/* Navigation */}
      <NavigationTailwind currentPage={currentPage} onPageClick={handlePageClick} pages={pages} />

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-[220px] mr-5 mt-2 mb-2 h-[calc(100vh-60px)]">
        <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden flex flex-col bg-slate-700/30 backdrop-blur-xl rounded-3xl mb-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.15)] scroll-smooth scrollbar-thin scrollbar-thumb-sky-400/60 scrollbar-track-slate-800/30">
          <CurrentComponent />
        </div>

        {/* Scrolling Contact Info - only show if NOT home page */}
        {currentPage !== 0 && (
          <div className="w-full overflow-hidden py-2 border-t border-white/20">
            <div className="animate-marquee-fast text-yellow-400 text-3xl font-bold whitespace-nowrap">
              <span className="mx-8">• University Security: +94 81 239 4914</span>
              <span className="mx-8">• University Medical Center: +94 81 239 2361</span>
              <span className="mx-8">• Event Coordinator: +94 81 239 3000</span>
              <span className="mx-8">• Technical Support: +94 81 239 3001</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <FooterTailwind />
      </div>

      {/* Marquee Animation Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 10s linear infinite;
          }
          @keyframes marquee-fast {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee-fast {
            animation: marquee-fast 30s linear infinite;
          }
        `
        }}
      />
    </div>
  );
};

export default AppKiosk;
