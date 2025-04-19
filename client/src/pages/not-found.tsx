import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] py-12 px-4">
      <Helmet>
        <title>Page Not Found | GSC Supply Chain News</title>
      </Helmet>
      
      <div className="text-[#BB1919] font-bold text-3xl mb-2">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Page Not Found</h1>
      <p className="text-gray-600 mb-8 text-center max-w-lg">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </Button>
        
        <Button asChild className="bg-[#BB1919] hover:bg-[#A10000]">
          <Link to="/admin/dashboard">
            Admin Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}