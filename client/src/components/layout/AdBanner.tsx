import { useState } from "react";

interface AdBannerProps {
  slot: string;
  format: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({ slot, format, className = "" }: AdBannerProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Define ad dimensions and content based on format
  let adClass = "";
  let adTitle = "";
  let adContent = "";
  let adCTA = "Learn More";
  let adImage = "";
  
  // Set different featured content based on slot
  switch(slot) {
    case "sidebar":
      adTitle = "Supply Chain Optimization Services";
      adContent = "Maximize efficiency with our expert consulting services";
      adImage = "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
      break;
    case "article":
      adTitle = "Digital Transformation Solutions";
      adContent = "Accelerate your logistics digitalization journey";
      adImage = "https://images.unsplash.com/photo-1581091877018-dac6a371d50f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
      break;
    default:
      adTitle = "GSC Premium Partner";
      adContent = "Strategic supply chain services for global enterprises";
      adImage = "https://images.unsplash.com/photo-1493857671505-72967e2e2760?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80";
  }
  
  // Format-specific styles
  switch(format) {
    case "horizontal":
      adClass = "w-full h-20 md:h-24 flex flex-row items-center";
      break;
    case "vertical":
      adClass = "w-full h-96 flex flex-col";
      break;
    case "rectangle":
      adClass = "w-full h-64 flex flex-col";
      break;
  }
  
  return (
    <div 
      className={`border-b border-l border-r border-[#BB1919] bg-white shadow-sm transition-all duration-200 overflow-hidden ${isHovered ? 'shadow-md' : ''} ${adClass} ${className}`}
      aria-label="Featured Partner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {format === "horizontal" ? (
        <>
          <div className="h-full w-1/3 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-200"
              style={{ 
                backgroundImage: `url(${adImage})`,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
          </div>
          <div className="h-full w-2/3 p-3 flex flex-col justify-center">
            <p className="text-xs text-[#BB1919] font-semibold mb-1">FEATURED PARTNER</p>
            <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-1">{adTitle}</h4>
            <p className="text-xs text-gray-600 hidden md:block">{adContent}</p>
            <button className="text-xs text-[#BB1919] font-semibold mt-1 hover:underline self-start">
              {adCTA} →
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-1/2 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-200"
              style={{ 
                backgroundImage: `url(${adImage})`,
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            <div className="absolute top-2 left-2 bg-[#BB1919] text-white text-xs px-2 py-1 rounded-sm">
              FEATURED PARTNER
            </div>
          </div>
          <div className="w-full h-1/2 p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">{adTitle}</h4>
              <p className="text-sm text-gray-600">{adContent}</p>
            </div>
            <button 
              className={`text-sm text-white font-semibold mt-2 py-2 px-4 bg-[#BB1919] rounded transition-all ${isHovered ? 'bg-opacity-90' : ''}`}
            >
              {adCTA}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
