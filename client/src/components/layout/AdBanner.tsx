import { useState, useEffect, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

interface AdBannerProps {
  slot: string;
  className?: string;
}

interface AdData {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  altText: string | null;
  sponsorName: string | null;
  sponsorLogo: string | null;
  placementId: number;
  openInNewTab?: boolean;
  position?: string;
}

export default function AdBanner({ slot, className = "" }: AdBannerProps) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placementId, setPlacementId] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Responsive size map per slot (fallbacks)
  const getReservedHeight = (): number => {
    // desktop defaults
    if (slot.includes("bottom")) return 90;
    if (slot.includes("sidebar-middle") || slot.includes("sidebar-top")) return 250;
    if (slot.includes("sidebar")) return 250;
    if (slot.includes("content")) return 250;
    if (slot.includes("leaderboard")) return 90;
    return 100;
  };

  // First, get the placement ID for this slot
  useEffect(() => {
    const fetchPlacement = async () => {
      try {
        const placements = await apiRequest("GET", "/api/ad-placements");
        const data = await placements.json();
        
        if (!data.success) {
          setError("Failed to fetch ad placements");
          setLoading(false);
          return;
        }

        const placement = data.placements.find((p: any) => p.slot === slot);
        
        if (!placement) {
          // No placement found for this slot
          setLoading(false);
          return;
        }

        setPlacementId(placement.id);
      } catch (err) {
        console.error("Error fetching ad placement:", err);
        setError("Failed to fetch ad placement");
        setLoading(false);
      }
    };

    fetchPlacement();
  }, [slot]);

  // Then get the active ad for this placement
  useEffect(() => {
    if (!placementId) return;

    const fetchAd = async () => {
      try {
        const lastSeen = (() => {
          try {
            const raw = localStorage.getItem(`ad_seen_${slot}`);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            const dayMs = 24 * 60 * 60 * 1000;
            if (parsed && parsed.adId && parsed.ts && Date.now() - parsed.ts < dayMs) {
              return parsed.adId as number;
            }
            return null;
          } catch {
            return null;
          }
        })();

        const url = lastSeen
          ? `/api/advertisements/active/placement/${placementId}?exclude=${lastSeen}`
          : `/api/advertisements/active/placement/${placementId}`;
        const response = await apiRequest("GET", url);
        const data = await response.json();

        if (!response.ok) {
          // Not treating this as an error since it's expected in some cases
          setLoading(false);
          return;
        }

        if (data.success && data.advertisement) {
          setAd(data.advertisement);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching advertisement:", err);
        setLoading(false);
      }
    };

    fetchAd();
  }, [placementId]);

  // IntersectionObserver to track visibility and lazy-load
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setVisible(true);
          }
        });
      },
      { threshold: [0.5] }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [containerRef.current]);

  // Handler for ad clicks
  const handleAdClick = async () => {
    if (!ad) return;

    try {
      // Track click
      await apiRequest("POST", `/api/advertisements/${ad.id}/click`);
    } catch (err) {
      console.error("Error tracking ad click:", err);
    }
  };

  // Track view when visible
  useEffect(() => {
    const markView = async () => {
      if (!ad || !visible) return;
      try {
        await apiRequest("POST", `/api/advertisements/${ad.id}/view`);
        localStorage.setItem(
          `ad_seen_${slot}`,
          JSON.stringify({ adId: ad.id, ts: Date.now() })
        );
      } catch (err) {
        // silent fail
      }
    };
    markView();
  }, [visible, ad, slot]);

  if (loading) {
    return (
      <div className={`ad-placeholder ${className}`} style={{ minHeight: `${getReservedHeight()}px` }}>
        <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (!ad) {
    return null; // Don't show anything if no ad is available
  }

  // Determine position class based on the ad's position property
  const positionClass = ad.position === 'top' ? 'mb-4' : 
                       ad.position === 'bottom' ? 'mt-4' : 
                       'my-2'; // default for middle position

  return (
    <div ref={containerRef} className={`ad-banner ${className} ${positionClass}`} style={{ minHeight: `${getReservedHeight()}px` }}>
      <a 
        href={ad.linkUrl} 
        target={ad.openInNewTab !== false ? "_blank" : "_self"}
        rel="noopener noreferrer" 
        onClick={handleAdClick}
        className="block relative"
      >
        {visible && (
          <img 
            src={ad.imageUrl} 
            alt={ad.altText || ad.title} 
            className="w-full h-auto rounded"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {!imageLoaded && (
          <div className="bg-gray-200 w-full h-full rounded" style={{ minHeight: `${getReservedHeight()}px` }} />
        )}
        
        {/* Ad label and sponsor info */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
          <div className="flex items-center">
            {ad.sponsorName && (
              <div className="flex items-center">
                {ad.sponsorLogo && (
                  <img 
                    src={ad.sponsorLogo} 
                    alt={ad.sponsorName} 
                    className="h-4 w-auto mr-1"
                  />
                )}
                <span>{ad.sponsorName}</span>
              </div>
            )}
          </div>
          <span className="text-[10px] uppercase">Sponsored</span>
        </div>
      </a>
    </div>
  );
}
