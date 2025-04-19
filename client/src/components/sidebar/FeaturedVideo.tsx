import { useQuery } from "@tanstack/react-query";
import { Video } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";

export default function FeaturedVideo() {
  const { data: video, isLoading } = useQuery<Video>({
    queryKey: ['/api/videos/featured'],
  });
  
  return (
    <section className="bg-[#F6F6F6] p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 font-roboto border-b-2 border-[#BB1919] pb-2 inline-block">Featured Video</h2>
      
      {isLoading ? (
        <div>
          <Skeleton className="w-full aspect-video mb-3" />
          <Skeleton className="h-6 w-4/5 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : video ? (
        <>
          <div className="relative aspect-video mb-3 group overflow-hidden">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-[#BB1919] text-white rounded-full w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play size={20} />
              </button>
            </div>
          </div>
          <h3 className="font-bold mb-2 text-base hover:text-[#BB1919] cursor-pointer">{video.title}</h3>
          <p className="text-sm text-gray-700">{video.description}</p>
        </>
      ) : (
        <div className="text-center py-4 border border-[#DDDDDD]">
          <p>No featured video available.</p>
        </div>
      )}
    </section>
  );
}
