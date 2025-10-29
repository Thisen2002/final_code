import React from 'react';
// import the dashboard component from the Maps folder 
import Dashboard from '../Maps/Dashboard';

// Define the props interface for MapPageTailwind (currently empty)
interface MapPageTailwindProps {}

// Define the MapPageTailwind functional component
const MapPageTailwind: React.FC<MapPageTailwindProps> = () => {
  
  // Render the Dashboard component in kiosk mode
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-1 w-full h-full">
        <Dashboard kiosk_mode={true}/>
      </div>
    </div>
  );
};

export default MapPageTailwind;
