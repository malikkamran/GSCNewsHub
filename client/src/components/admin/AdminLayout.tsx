import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  ImageIcon,
  BarChart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Header from "@/components/layout/Header";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        
        if (!data.authenticated) {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when navigating
  const handleNavigate = (to: string) => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
    navigate(to);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Website Header */}
      <Header />

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Sidebar Navigation */}
        <aside 
          className={`
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 transition-transform duration-300 ease-in-out
            bg-white border-r border-gray-200 w-64 p-4
            fixed inset-y-0 left-0 z-20 md:static md:h-[calc(100vh-140px)] 
            top-[140px] overflow-y-auto
          `}
        >
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Content Management
          </h3>
          <nav className="space-y-1 mb-6">
            <Link href="/admin/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  location === "/admin/dashboard" ? "bg-gray-100 text-[#BB1919] font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleNavigate("/admin/dashboard")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/admin/articles">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  location === "/admin/articles" || location.includes("/admin/articles/") 
                    ? "bg-gray-100 text-[#BB1919] font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleNavigate("/admin/articles")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Manage Articles
              </Button>
            </Link>
            
            <Link href="/admin/categories">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  location === "/admin/categories" ? "bg-gray-100 text-[#BB1919] font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleNavigate("/admin/categories")}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>

            <Link href="/admin/site-statistics">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  location === "/admin/site-statistics" ? "bg-gray-100 text-[#BB1919] font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleNavigate("/admin/site-statistics")}
              >
                <BarChart className="h-4 w-4 mr-2" />
                Site Statistics
              </Button>
            </Link>
          </nav>
          
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            User Management
          </h3>
          <nav className="space-y-1 mb-6">
            <Link href="/admin/users">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  location === "/admin/users" ? "bg-gray-100 text-[#BB1919] font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleNavigate("/admin/users")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </nav>
          
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Advertising
          </h3>
          <nav className="space-y-1">
            <Link href="/admin/ads">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start ${
                  location === "/admin/ads" ? "bg-gray-100 text-[#BB1919] font-medium" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleNavigate("/admin/ads")}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Manage Advertisements
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}