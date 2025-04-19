import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  FolderPlus, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const [onLoginPage] = useRoute("/admin/login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiRequest("/api/auth/check", {
          method: "GET",
        });
        
        setIsAuthenticated(response.authenticated === true);
        
        if (!response.authenticated && !onLoginPage) {
          setLocation("/admin/login");
        }
      } catch (error) {
        setIsAuthenticated(false);
        if (!onLoginPage) {
          setLocation("/admin/login");
        }
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [setLocation, onLoginPage]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      setLocation("/admin/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Don't show layout on login page
  if (onLoginPage) {
    return <>{children}</>;
  }
  
  // Show loading while checking authentication
  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB1919]"></div>
      </div>
    );
  }
  
  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated && !onLoginPage) {
    return null;
  }
  
  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: "/admin/articles", label: "Articles", icon: <FileText className="mr-2 h-4 w-4" /> },
    { href: "/admin/categories", label: "Categories", icon: <FolderPlus className="mr-2 h-4 w-4" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="mr-2 h-4 w-4" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="mr-2 h-4 w-4" /> },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#BB1919] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard">
              <a className="text-xl font-bold">GSC News CMS</a>
            </Link>
          </div>
          
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white hover:text-[#BB1919]"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        {!isMobile && (
          <aside className="w-64 bg-white shadow-md">
            <nav className="py-6">
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      {({ isActive }) => (
                        <a
                          className={`flex items-center px-4 py-3 text-sm ${
                            isActive
                              ? "bg-gray-100 text-[#BB1919] font-medium border-l-4 border-[#BB1919]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {link.icon}
                          {link.label}
                        </a>
                      )}
                    </Link>
                  </li>
                ))}
                <li className="px-4 pt-6">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-[#BB1919]"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </li>
              </ul>
            </nav>
          </aside>
        )}
        
        {/* Mobile menu */}
        {isMobile && isMobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-end">
            <div className="w-64 bg-white h-full animate-in slide-in-from-right">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="py-4">
                <ul className="space-y-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        {({ isActive }) => (
                          <a
                            className={`flex items-center px-4 py-3 text-sm ${
                              isActive
                                ? "bg-gray-100 text-[#BB1919] font-medium border-l-4 border-[#BB1919]"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {link.icon}
                            {link.label}
                          </a>
                        )}
                      </Link>
                    </li>
                  ))}
                  <li className="px-4 pt-6">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-[#BB1919]"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}