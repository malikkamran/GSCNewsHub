import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({ slot, format, className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  // Define ad dimensions based on format
  let adClass = "";
  let adText = "";
  
  switch(format) {
    case "horizontal":
      adClass = "w-full h-20 md:h-24";
      adText = "ADVERTISEMENT - Google Ad Banner (728x90)";
      break;
    case "vertical":
      adClass = "w-full h-96";
      adText = "ADVERTISEMENT - Google Ad Banner (160x600)";
      break;
    case "rectangle":
      adClass = "w-full h-64";
      adText = "ADVERTISEMENT - Google Ad Banner (300x250)";
      break;
  }
  
  useEffect(() => {
    // This effect would normally initialize Google Ads
    // For now we'll just show the placeholder
    // In a real implementation, we would use something like:
    /*
    if (window.adsbygoogle && adRef.current) {
      const adElement = document.createElement('ins');
      adElement.className = 'adsbygoogle';
      adElement.style.display = 'block';
      adElement.dataset.adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
      adElement.dataset.adSlot = slot;
      adElement.dataset.adFormat = 'auto';
      adElement.dataset.fullWidthResponsive = 'true';
      
      adRef.current.innerHTML = '';
      adRef.current.appendChild(adElement);
      
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
    */
  }, [slot]);
  
  return (
    <div 
      ref={adRef} 
      className={`bg-[#F5F5F5] text-[#666] flex justify-center items-center text-center ${adClass} ${className}`}
      aria-label="Advertisement"
    >
      <div className="flex flex-col items-center">
        <p className="text-xs mb-1">ADVERTISEMENT</p>
        <div className="bg-gray-200 w-3/4 h-12 flex items-center justify-center rounded">
          <p className="text-xs text-gray-500">{adText}</p>
        </div>
      </div>
    </div>
  );
}
