import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Analysis, Analyst } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisWithAnalyst extends Analysis {
  analyst?: Analyst;
}

export default function ExpertAnalysis() {
  const { data: analysisArticles, isLoading } = useQuery<AnalysisWithAnalyst[]>({
    queryKey: ['/api/analysis'],
  });
  
  return (
    <section className="bg-[#F8F8F8] p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 font-roboto border-b border-[#DDDDDD] pb-2">Expert Analysis</h2>
      <div className="space-y-4">
        {isLoading ? (
          [...Array(2)].map((_, index) => (
            <article key={index} className={index === 0 ? "pb-4 border-b border-[#DDDDDD]" : ""}>
              <div className="flex items-center space-x-3 mb-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-5 w-4/5" />
            </article>
          ))
        ) : analysisArticles && analysisArticles.length > 0 ? (
          analysisArticles.map((analysis, index) => (
            <article 
              key={analysis.id} 
              className={index === 0 ? "pb-4 border-b border-[#DDDDDD]" : ""}
            >
              <div className="flex items-center space-x-3 mb-2">
                <img 
                  src={analysis.analyst?.imageUrl} 
                  alt={`${analysis.analyst?.name} portrait`} 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold">{analysis.analyst?.name}</h4>
                  <p className="text-sm text-gray-600">{analysis.analyst?.title}</p>
                </div>
              </div>
              <h3 className="font-bold mb-2">
                <Link href={`/analysis/${analysis.slug}`}>
                  <a className="hover:text-[#BB1919]">{analysis.title}</a>
                </Link>
              </h3>
            </article>
          ))
        ) : (
          <p className="text-center py-2">No analysis articles available.</p>
        )}
      </div>
    </section>
  );
}
