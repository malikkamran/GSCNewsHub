import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

// Map our formats to Google Ad sizes
const adSizeMap = {
  horizontal: { 
    desktop: [728, 90],  // Leaderboard
    mobile: [320, 100]   // Large Mobile Banner
  },
  rectangle: { 
    desktop: [300, 250], // Medium Rectangle
    mobile: [300, 250]   // Medium Rectangle (same)
  },
  vertical: { 
    desktop: [300, 600], // Large Skyscraper
    mobile: [300, 250]   // Medium Rectangle fallback
  }
};

// Map our slots to Google Ad Unit IDs (these would be provided by Google AdSense)
const slotIdMap: Record<string, string> = {
  "top-leaderboard": "gsc-top-leaderboard",
  "bottom-leaderboard": "gsc-bottom-leaderboard",
  "sidebar-top": "gsc-sidebar-top",
  "sidebar-middle": "gsc-sidebar-middle",
  "in-article": "gsc-in-article"
};

// Setup Google AdSense in the page
const setupAdSense = () => {
  if (typeof window !== 'undefined' && !window.document.getElementById('google-adsense-script')) {
    const script = document.createElement('script');
    script.id = 'google-adsense-script';
    script.async = true;
    script.crossOrigin = 'anonymous';
    // Replace with your actual AdSense Publisher ID when available
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
    document.head.appendChild(script);
  }
};

export default function AdBanner({ slot, format, className = "" }: AdBannerProps) {
  const adContainer = useRef<HTMLDivElement>(null);
  
  // Get dimensions based on format
  const adSize = adSizeMap[format] || adSizeMap.rectangle;
  const adUnitId = slotIdMap[slot] || "gsc-default";
  
  // Setup AdSense and initialize ads
  useEffect(() => {
    setupAdSense();
    
    // Attempt to load the ad after the script is loaded
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && adContainer.current) {
        try {
          // Push the ad configuration
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    };
    
    // Check if AdSense is loaded
    if (window.adsbygoogle) {
      loadAd();
    } else {
      // If not loaded yet, wait for script to load
      const scriptElement = document.getElementById('google-adsense-script');
      if (scriptElement) {
        scriptElement.addEventListener('load', loadAd);
      }
    }
    
    // Cleanup
    return () => {
      const scriptElement = document.getElementById('google-adsense-script');
      if (scriptElement) {
        scriptElement.removeEventListener('load', loadAd);
      }
    };
  }, [slot, format]);
  
  // Set dimensions based on format
  let styleHeight, styleWidth;
  
  switch(format) {
    case "horizontal":
      styleWidth = adSize.desktop[0];
      styleHeight = adSize.desktop[1];
      break;
    case "vertical":
      styleWidth = adSize.desktop[0];
      styleHeight = adSize.desktop[1];
      break;
    case "rectangle":
      styleWidth = adSize.desktop[0];
      styleHeight = adSize.desktop[1];
      break;
  }
  
  return (
    <div 
      ref={adContainer}
      className={`ad-container flex justify-center items-center bg-gray-100 ${className}`}
      style={{ minHeight: styleHeight, overflow: 'hidden' }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: `${styleWidth}px`,
          height: `${styleHeight}px`,
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your Publisher ID
        data-ad-slot={adUnitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
