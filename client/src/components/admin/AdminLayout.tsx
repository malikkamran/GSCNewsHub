import React, { useState, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        
        if (!data.authenticated) {
          navigate("/admin/login");
        } else {
          setUsername(data.user?.username || "Admin");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        
        navigate("/admin/login");
      } else {
        toast({
          title: "Logout error",
          description: "An error occurred during logout. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <div className="bg-[#BB1919] text-white font-bold px-3 py-1 rounded text-sm">
                GSC News
              </div>
              <span className="font-medium hidden sm:inline-block">Admin</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.href = "/"}
              className="ml-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline-block">View Site</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleNavigate("/admin/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <LayoutDashboard className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline-block">Dashboard</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <span className="hidden sm:inline-block">{username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside 
          className={`
            ${isMenuOpen ? "block" : "hidden"} 
            md:block bg-white border-r border-gray-200 w-full md:w-64 p-4
            md:sticky md:top-16 md:h-[calc(100vh-4rem)] 
            fixed inset-0 top-16 z-20 md:z-0 overflow-y-auto
          `}
        >
          <nav className="space-y-2 mt-2">
            <Link to="/admin/dashboard">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    isActive ? "bg-gray-100 text-[#BB1919] font-medium" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              )}
            </Link>
            
            <Link to="/admin/articles">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    isActive || location.includes("/admin/articles/") 
                      ? "bg-gray-100 text-[#BB1919] font-medium" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/articles")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Articles
                </Button>
              )}
            </Link>
            
            <Link to="/admin/categories">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    isActive ? "bg-gray-100 text-[#BB1919] font-medium" : ""
                  }`}
                  onClick={() => handleNavigate("/admin/categories")}
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Categories
                </Button>
              )}
            </Link>
          </nav>
          
          <div className="border-t border-gray-200 mt-6 pt-6">
            <Button variant="outline" size="sm" className="w-full text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}