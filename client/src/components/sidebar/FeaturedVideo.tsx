import { useQuery } from "@tanstack/react-query";
import { Video } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

export default function FeaturedVideo() {
  const { data: video, isLoading } = useQuery<Video>({
    queryKey: ['/api/videos/featured'],
  });
  
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4 font-roboto">Featured Video</h2>
      
      {isLoading ? (
        <div>
          <Skeleton className="w-full aspect-video mb-3" />
          <Skeleton className="h-6 w-4/5 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : video ? (
        <>
          <div className="relative aspect-video mb-3">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-[#BB1919] text-white rounded-full w-16 h-16 flex items-center justify-center">
                <Play size={24} />
              </button>
            </div>
          </div>
          <h3 className="font-bold mb-2">{video.title}</h3>
          <p className="text-sm text-gray-600">{video.description}</p>
        </>
      ) : (
        <div className="text-center py-4 border border-[#DDDDDD]">
          <p>No featured video available.</p>
        </div>
      )}
    </section>
  );
}
