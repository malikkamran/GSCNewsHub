import { ReactNode, useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronDown,
  ChevronRightIcon,
  Menu,
  X,
  LayoutDashboard,
  FileEdit,
  Settings,
  FolderOpen,
  LogOut,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [location] = useLocation();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("/api/auth/check", {
          method: "GET",
        });
        
        if (response && response.authenticated) {
          setIsAuthenticated(true);
          setUser(response.user);
        } else {
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setLocation("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [setLocation]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      setLocation("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={`bg-white shadow-md z-20 fixed inset-y-0 left-0 transition-transform duration-300 transform ${
          sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        } ${isMobile ? "w-64" : "w-64"} lg:static lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#BB1919] rounded-md flex items-center justify-center text-white font-bold mr-2">
                GSC
              </div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            {isMobile && (
              <button onClick={toggleSidebar} className="lg:hidden">
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link href="/admin/dashboard">
              {({ isActive }) => (
                <a
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location === "/admin/dashboard"
                      ? "bg-gray-100 text-[#BB1919]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  <span>Dashboard</span>
                </a>
              )}
            </Link>

            <Link href="/admin/articles">
              {({ isActive }) => (
                <a
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location.startsWith("/admin/articles")
                      ? "bg-gray-100 text-[#BB1919]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FileEdit className="h-5 w-5 mr-3" />
                  <span>Articles</span>
                </a>
              )}
            </Link>

            <Link href="/admin/categories">
              {({ isActive }) => (
                <a
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    location === "/admin/categories"
                      ? "bg-gray-100 text-[#BB1919]"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FolderOpen className="h-5 w-5 mr-3" />
                  <span>Categories</span>
                </a>
              )}
            </Link>

            <div className="pt-4 pb-2">
              <div className="px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Coming Soon
              </div>
            </div>

            <a
              className="flex items-center px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              <span>Analytics</span>
            </a>

            <a
              className="flex items-center px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Users</span>
            </a>

            <a
              className="flex items-center px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </a>
          </nav>

          {/* User profile footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 bg-[#BB1919]">
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              {isMobile && (
                <button onClick={toggleSidebar} className="mr-4 lg:hidden">
                  <Menu className="h-6 w-6" />
                </button>
              )}
              <div className="text-xl font-semibold"></div>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-[#BB1919]"
              >
                View Website
              </a>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50"
          onClick={closeSidebar}
        >
          {children}
        </main>
      </div>
    </div>
  );
}