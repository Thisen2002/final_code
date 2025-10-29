import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Exhibit {
  exhibit_id: string;
  exhibit_name: string;
  location: string;
  building_name: string;
  tag: string;
  tags: string[]; // Array to hold all tags for this exhibit
}

interface BuildingResponse {
  building_id: number;
  building_name: string;
  exhibits: string[];
  zone_id: number;
  exhibit_tags: {
    [key: string]: string[];
  };
}

// Predefined tags - moved outside component to avoid re-renders
const PREDEFINED_TAGS: string[] = [
  'Electronics and Embedded Systems',
    'Artificial Intelligence Machine Learning and Data Science',
    'Biomedical Engineering and Mechatronics',
    'Information Technology and Computing',
    'Science, Entertainment and Mathematics of Engineering',
    'Materials and Nanotechnology',
    'Energy Environment and Sustainability & Nature Based Technologies',
    'Road Safety, Transportation Planning and Engineering Survey',
    'Pilot Plant',
    'Renewable energy and sustainability',
    'Automobile',
    'Additive Manufacturing and 3D Printing',
    'Computer Numerical Control (CNC)',
    'Robotics and Automation',
    'Power Systems and Smart Grids'
]

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ExhibitsPageTailwindProps {}

const ExhibitsPageTailwind: React.FC<ExhibitsPageTailwindProps> = () => {
  // State management
  const [allExhibits, setAllExhibits] = useState<Exhibit[]>([]) // All exhibits
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('') // Empty for all
  const [searchQuery, setSearchQuery] = useState<string>('') // Search input
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false) // Dropdown state
  const navigate = useNavigate()

  // Color mapping for different tag categories
  const getTagColor = (tag: string): { bg: string; text: string; border: string } => {
    const colors = {
      'Electronics and Embedded Systems': { bg: '#001aff', text: '#FFFFFF', border: '#001affff' },
      'Artificial Intelligence Machine Learning and Data Science': { bg: '#098bee', text: '#FFFFFF', border: '#098beeff' },
      'Biomedical Engineering and Mechatronics': { bg: '#eea933', text: '#FFFFFF', border: '#eea933' },
      'Information Technology and Computing': { bg: '#a5a74d', text: '#FFFFFF', border: '#a5a74d' },
      'Science, Entertainment and Mathematics of Engineering': { bg: '#EC4899', text: '#FFFFFF', border: '#EC4899' },
      'Materials and Nanotechnology': { bg: '#8b9894', text: '#FFFFFF', border: '#8b9894' },
      'Energy Environment and Sustainability & Nature Based Technologies': { bg: '#06B6D4', text: '#FFFFFF', border: '#06B6D4' },
      'Road Safety, Transportation Planning and Engineering Survey': { bg: '#9658b6', text: '#FFFFFF', border: '#9658b6ff' },
      'Pilot Plant': { bg: '#c57b70', text: '#FFFFFF', border: '#c57b70' },
      'Renewable energy and sustainability': { bg: '#37795d', text: '#FFFFFF', border: '#37795d' },
      'Automobile': { bg: '#02102b', text: '#FFFFFF', border: '#02102b' },
      'Additive Manufacturing and 3D Printing': { bg: '#4d2040', text: '#FFFFFF', border: '#4d2040' },
      'Computer Numerical Control (CNC)': { bg: '#585c19', text: '#FFFFFF', border: '#585c19' },
      'Robotics and Automation': { bg: '#6a3c3f', text: '#FFFFFF', border: '#6a3c3f' },
      'Power Systems and Smart Grids': { bg: '#323073', text: '#FFFFFF', border: '#323073' }
    }
    return colors[tag as keyof typeof colors] || { bg: '#6B7280', text: '#FFFFFF', border: '#9CA3AF' } // Default gray
  }

  // Fetch exhibits data from API
  useEffect(() => {
    // Transform building response to exhibit format
    const transformBuildingToExhibits = (buildings: BuildingResponse[], tag: string): Exhibit[] => {
      const exhibits: Exhibit[] = []
      
      buildings.forEach(building => {
        building.exhibits.forEach((exhibitName, index) => {
          // Extract all tags for this exhibit from exhibit_tags with proper null checking
          const exhibitTags = (building.exhibit_tags && building.exhibit_tags[exhibitName]) || ['Other']
          const primaryTag = exhibitTags[0] || tag || 'Other'
          
          exhibits.push({
            exhibit_id: `${building.building_id}-${index}`,
            exhibit_name: exhibitName,
            location: `Zone ${building.zone_id}`,
            building_name: building.building_name,
            tag: primaryTag, // Primary tag for compatibility
            tags: exhibitTags // All tags for this exhibit
          })
        })
      })
      
      return exhibits
    }

    const fetchExhibits = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let url: string
        
        if (selectedTag) {
          // Use filterByTag for specific tags
          url = `http://localhost:5003/buildings/filterByTag?tag=${selectedTag}`
        } else {
          // Use filterByTag without parameters for all categories
          url = `http://localhost:5003/buildings/filterByTag`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          // Handle 404 specifically - no exhibits found for this tag
          if (response.status === 404) {
            console.log(`No exhibits found for tag: ${selectedTag || 'All Categories'}`)
            setAllExhibits([]) // Set empty array instead of error
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: BuildingResponse[] = await response.json()
        
        // Transform the building data to exhibit format
        const exhibitData = transformBuildingToExhibits(data, selectedTag || 'Other')
        setAllExhibits(exhibitData)
      } catch (err) {
        console.error('Error fetching exhibits:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch exhibits')
      } finally {
        setLoading(false)
      }
    }

    fetchExhibits()
  }, [selectedTag]) // Re-fetch when selectedTag changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Filter function based on selected tag and search query
  const getDisplayExhibits = (): Exhibit[] => {
    let filtered = allExhibits

    // Filter by tag - check if exhibit has the selected tag in its tags array
    if (selectedTag) {
      filtered = filtered.filter(exhibit => exhibit.tags.includes(selectedTag))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(exhibit => 
        exhibit.exhibit_name.toLowerCase().includes(query) ||
        exhibit.location.toLowerCase().includes(query) ||
        exhibit.building_name.toLowerCase().includes(query) ||
        exhibit.tags.some(tag => tag.toLowerCase().includes(query)) // Search in all tags
      )
    }

    return filtered
  }

  const displayExhibits = getDisplayExhibits()

  return (
    <div className="w-full h-full p-0 box-border overflow-visible animate-fadeIn">
      <div className="max-w-7xl mx-auto p-8 h-auto w-full">
        
        {/* Page Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl text-white mb-8 font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            {selectedTag ? `${selectedTag} Exhibits` : 'All Exhibits'}
          </h1>
          
          {/* Description */}
          <p className="text-white/80 text-lg mb-6">
            Browse exhibits by category or search by name, location, or category
          </p>
          
          {/* Search Bar and Category Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search exhibits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60 backdrop-blur-md"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/60 backdrop-blur-md transition-all duration-200 min-w-[200px] justify-between"
              >
                <span>{selectedTag || 'All Categories'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 border border-white/20 rounded-xl backdrop-blur-md shadow-xl z-10 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedTag('')
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 text-white hover:bg-blue-500/20 hover:border-l-4 hover:border-blue-400 transition-all duration-200 cursor-pointer ${
                      selectedTag === '' ? 'bg-blue-500/30 border-l-4 border-blue-400' : ''
                    }`}
                  >
                    All Categories
                  </button>
                  {PREDEFINED_TAGS.map((tag) => {
                    const tagColors = getTagColor(tag)
                    const isActive = selectedTag === tag
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTag(tag)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 text-white transition-all duration-200 cursor-pointer ${
                          isActive ? 'border-l-4' : ''
                        }`}
                        style={{
                          backgroundColor: isActive ? `${tagColors.bg}40` : 'transparent',
                          borderLeftColor: isActive ? tagColors.border : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = `${tagColors.bg}20`
                            e.currentTarget.style.borderLeft = `4px solid ${tagColors.border}`
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.borderLeft = '4px solid transparent'
                          }
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: tagColors.bg }}
                          ></span>
                          {tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Exhibits Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {loading ? (
            <div className="text-center p-16 col-span-2">
              <div className="space-y-6">
                {/* Cute Loading Animation */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 flex items-center justify-center backdrop-blur-md border border-white/20">
                      <div className="text-4xl animate-spin"></div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-white text-2xl font-semibold">Loading exhibits...</p>
                  <p className="text-white/70 text-lg">
                    {selectedTag ? `Fetching ${selectedTag} exhibits` : 'Gathering all amazing exhibits'} ✨
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center p-12 col-span-2">
              <p className="text-red-400 text-xl mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-blue-500/30 text-white rounded-xl border border-blue-400/60 hover:bg-blue-500/50 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          ) : displayExhibits.length > 0 ? (
            displayExhibits.map((exhibit, index) => (
              <div 
                  key={exhibit.exhibit_id || index} 
                  className="relative bg-transparent backdrop-blur-xl rounded-2xl border-2 border-[rgba(59,130,246,0.6)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] animate-slideIn"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                {/* Multiple Tag Badges */}
                <div className="absolute top-4 left-4 right-4 overflow-x-hidden whitespace-nowrap">
                  
                  {/* Inline keyframes */}
                  <style>
                    {`
                      @keyframes scroll-horizontal {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                      }
                    `}
                  </style>

                  <div
                    className="flex gap-2"
                    style={{
                      display: "inline-flex",
                      animation: "scroll-horizontal 15s linear infinite",
                    }}
                  >
                    {exhibit.tags.map((tagName, tagIndex) => (
                      <div 
                        key={tagIndex}
                        className="px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg border-2 flex-shrink-0"
                        style={{ 
                          backgroundColor: getTagColor(tagName).bg,
                          borderColor: getTagColor(tagName).border,
                          color: getTagColor(tagName).text,
                        }}
                      >
                        <span style={{ fontSize: "0.75rem", lineHeight: "1rem" }}>
                          {tagName.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Exhibit Information */}
                <div className="mt-8 flex justify-between items-start flex-wrap gap-4">
                  <div className="mb-2 flex-1">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {exhibit.exhibit_name}
                    </h3>
                    <p className="text-blue-300 text-lg mb-2">
                      Building: {exhibit.building_name}
                    </p>
                  </div>
                  
                  {/* Location Container */}
                  <div className="flex gap-8 items-start"> 
                    <div className="flex flex-col gap-2 text-right min-w-[200px] items-end"> 
                      <span className="text-white/100 text-2xl font-medium block mb-1">Location</span>
                      <span className="text-[#FDE103] text-xl">
                        {exhibit.location}
                      </span>
                    </div>
                  </div>

          <button
            className="absolute right-4 bottom-4 py-2 px-3 rounded-lg font-medium text-white bg-green-600 border border-green-600 hover:bg-green-700 transition-colors text-sm flex items-center justify-center z-10"
                      onClick={() => {
                        if (!exhibit.location) {
                          alert('No location set for this exhibit');
                          return;
                        }

                        // If we're inside the kiosk app (path starts with /kiosk), switch pages
                        // by dispatching a custom event and update the URL query param so
                        // the MapExtra component can pick it up on mount.
                        try {
                          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/kiosk')) {
                            const url = new URL(window.location.href);
                            url.searchParams.set('location', exhibit.location);
                            // Use replaceState so we don't add history entries
                            window.history.replaceState({}, '', url.toString());
                            window.dispatchEvent(new CustomEvent('kioskNavigate', { detail: { pageIndex: 3 } }));
                            return;
                          }
                        } catch (e) {
                          // ignore and fall back to router navigation
                          console.error('kiosk navigate fallback error', e);
                        }

                        // Fallback: navigate to the regular /map route (non-kiosk)
                        navigate(`/map?location=${encodeURIComponent(exhibit.location)}`);
                      }}
                      title="Navigate to location"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="22" 
                      height="22" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </button>

                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-16 col-span-2">
              <div className="space-y-8">
                {/* Cute Empty State Illustration */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Main container with glow effect */}
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(168,85,247,0.4)]">
                      {/* Cute mascot/icon */}
                      <div className="text-6xl animate-bounce">
                        🔍
                      </div>
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-400/60 animate-ping"></div>
                    <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-blue-400/60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute top-1/3 -right-4 w-2 h-2 rounded-full bg-green-400/60 animate-ping" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
                
                {/* Main Message */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">
                    Oops! No exhibits here yet
                  </h3>
                  <p className="text-xl text-white/80">
                    {selectedTag 
                      ? `We couldn't find any exhibits in the "${selectedTag}" category.`
                      : 'No exhibits are currently available.'
                    }
                  </p>
                  <p className="text-lg text-white/60">
                    {selectedTag 
                      ? "Don't worry, try exploring other categories or check back soon!" 
                      : "Our team is working hard to add exciting exhibits. Check back soon!"
                    }
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                  {selectedTag && (
                    <button
                      onClick={() => {
                        setSelectedTag('')
                        setSearchQuery('')
                      }}
                      className="group px-8 py-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white rounded-2xl border border-blue-400/60 hover:from-blue-500/50 hover:to-purple-500/50 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                    >
                      <span className="text-2xl"></span>
                      <span className="font-semibold">View All Categories</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="group px-8 py-4 bg-gradient-to-r from-green-500/30 to-teal-500/30 text-white rounded-2xl border border-green-400/60 hover:from-green-500/50 hover:to-teal-500/50 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                  >
                    <span className="text-2xl group-hover:animate-spin"></span>
                    <span className="font-semibold">Refresh</span>
                  </button>
                </div>

                {/* Motivational message */}
                <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                  <p className="text-white/70 text-lg italic">
                    "Great things are coming! Stay tuned for amazing exhibits." 
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          .animate-slideIn { animation: slideIn 0.5s ease-out forwards; }
        `
      }} />
      
      {/* Add custom styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .tab-btn { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 0.5rem; 
            padding: 0.75rem 1.5rem; 
            background: rgba(255, 255, 255, 0.1); 
            color: #e2e8f0; 
            border: 2px solid transparent; 
            border-radius: 9999px; 
            font-size: 0.9rem; 
            font-weight: 600; 
            cursor: pointer; 
            transition: all 0.3s ease; 
            backdrop-filter: blur(10px); 
          }
          .tab-btn:hover { 
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .tab-btn.active { 
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
        `
      }} />
    </div>
  )
}

export default ExhibitsPageTailwind