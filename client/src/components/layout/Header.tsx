import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Menu, Search, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import NavDropdown from "./NavDropdown";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const isMobile = useIsMobile();
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // Programmatic navigation after logout
        navigate('/');
      }
    });
  };

  return (
    <header>
      {/* Top black bar */}
      <div className="bg-black py-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-6 px-2 flex items-center gap-1 text-white hover:text-white">
                    <User size={14} />
                    <span className="text-xs">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2" asChild>
                    <Link href="/preferences">
                      <Settings size={14} />
                      <span>Preferences</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem className="flex items-center gap-2" asChild>
                      <Link href="/admin/dashboard">
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-red-600" 
                    onClick={handleLogout}
                  >
                    <LogOut size={14} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <span className="text-white text-xs hover:underline cursor-pointer">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Main header with logo and white background */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          {/* Logo and search */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <img 
                    src={"/@fs/Users/lorinzhu/Library/Mobile Documents/com~apple~CloudDocs/Downloads/IMac Download Folder/Alll Projects/GSCNewsHub/main-logo.jpeg"} 
                    alt="GSC News Logo" 
                    className="h-12 md:h-16 w-auto object-contain"
                  />
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const searchQuery = formData.get("search") as string;
                    if (searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    }
                  }}
                  className="flex"
                >
                  <Input 
                    type="text" 
                    name="search" 
                    placeholder="Search" 
                    className="py-1 px-3 pr-8 rounded-none text-sm w-48 h-8 border-none focus-visible:ring-0"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    variant="ghost" 
                    className="absolute right-1 top-0 text-gray-600 h-8 w-8"
                  >
                    <Search size={16} />
                  </Button>
                </form>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-[#BB1919]"
              onClick={toggleMobileMenu}
            >
              <Menu />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Navigation - BBC style with white background */}
      <div className="border-t border-[#BB1919] nav-menu nav-sticky sticky top-0 z-[1100]">
        <div className="container mx-auto px-4">
          <nav className="hidden md:block overflow-visible relative">
            <div className="overflow-x-auto overflow-y-visible">
              <ul className="flex flex-nowrap text-gray-800 whitespace-nowrap" role="menubar">
              <li role="none">
                <Link href="/">
                  <span className={`nav-item inline-block ${location === '/' ? 'nav-item-active' : ''}`} role="menuitem">
                    Home
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/logistics">
                  <span className={`nav-item inline-block ${location === '/category/logistics' ? 'nav-item-active' : ''}`} role="menuitem">
                    Logistics
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/tech-digital">
                  <span className={`nav-item inline-block ${location === '/category/tech-digital' ? 'nav-item-active' : ''}`} role="menuitem">
                    Tech & Digital
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/e-commerce">
                  <span className={`nav-item inline-block ${location === '/category/e-commerce' ? 'nav-item-active' : ''}`} role="menuitem">
                    E-commerce
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/sustainability">
                  <span className={`nav-item inline-block ${location === '/category/sustainability' ? 'nav-item-active' : ''}`} role="menuitem">
                    Sustainability
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/market-insights">
                  <span className={`nav-item inline-block ${location === '/category/market-insights' ? 'nav-item-active' : ''}`} role="menuitem">
                    Market Insights
                  </span>
                </Link>
              </li>
              <li role="none" className="inline-block">
                <NavDropdown 
                  label="Industry Sectors" 
                  items={[
                    { label: "Warehousing", slug: "warehousing" },
                    { label: "Manufacturing", slug: "manufacturing" },
                    { label: "Cold Chain", slug: "cold-chain" },
                    { label: "Infrastructure", slug: "infrastructure" }
                  ]}
                />
              </li>
              <li role="none" className="inline-block">
                <NavDropdown 
                  label="Risk & Policy" 
                  items={[
                    { label: "Trade Policy", slug: "trade-policy" },
                    { label: "Risk & Security", slug: "risk-security" }
                  ]}
                />
              </li>
              <li role="none" className="inline-block">
                <NavDropdown 
                  label="More" 
                  items={[
                    { label: "Innovation", slug: "innovation" },
                    { label: "Events & Conferences", slug: "events-conferences" }
                  ]}
                  muted
                />
              </li>
              <li role="none" className="inline-block">
                <NavDropdown 
                  label="Logistics Networks" 
                  items={[
                    { label: "All Networks", slug: "logistics-networks" },
                    { label: "GLA (Global Logistics Alliance)", slug: "gla" },
                    { label: "WCA World", slug: "wca-world" },
                    { label: "JC Trans Networks", slug: "jc-trans-networks" }
                  ]}
                  muted
                />
              </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 py-2 bg-gray-100">
        <div className="relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const searchQuery = formData.get("mobile-search") as string;
              if (searchQuery.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
              }
            }}
            className="flex w-full"
          >
            <Input 
              type="text" 
              name="mobile-search"
              placeholder="Search GSC Supply Chain News" 
              className="w-full py-2 px-3 pr-8 rounded-none text-sm"
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 h-8 w-8"
            >
              <Search size={16} />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {showMobileMenu && (
        <nav className="md:hidden bg-gray-800" aria-label="Mobile menu">
          <ul className="text-white px-4 py-2">
            {user ? (
              <li>
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">Signed in as {user.username}</span>
                  <Button 
                    variant="ghost" 
                    className="text-gray-300 px-2 py-1 hover:text-white" 
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu(); // Also close the mobile menu
                    }}
                  >
                    <LogOut size={16} className="mr-1" />
                    <span>Log out</span>
                  </Button>
                </div>
              </li>
            ) : (
              <li>
                <Link href="/auth" onClick={() => toggleMobileMenu()}>
                  <span className="mobile-nav-link block py-2 border-b border-gray-700">
                    Sign in
                  </span>
                </Link>
              </li>
            )}
            <li>
              <Link href="/" onClick={() => toggleMobileMenu()}>
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Home</span>
              </Link>
            </li>
            {/* New primary navigation items */}
            <li>
              <Link href="/category/logistics">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Logistics</span>
              </Link>
            </li>
            <li>
              <Link href="/category/tech-digital">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Tech & Digital</span>
              </Link>
            </li>
            <li>
              <Link href="/category/e-commerce">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">E-commerce</span>
              </Link>
            </li>
            <li>
              <Link href="/category/sustainability">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Sustainability</span>
              </Link>
            </li>
            <li>
              <Link href="/category/market-insights">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Market Insights</span>
              </Link>
            </li>
            
            {/* Industry Sectors */}
            <li>
              <div className="block py-2 border-b border-gray-700 text-gray-400 text-sm font-semibold">INDUSTRY SECTORS</div>
            </li>
            <li>
              <Link href="/category/warehousing">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Warehousing</span>
              </Link>
            </li>
            <li>
              <Link href="/category/manufacturing">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Manufacturing</span>
              </Link>
            </li>
            <li>
              <Link href="/category/cold-chain">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Cold Chain</span>
              </Link>
            </li>
            <li>
              <Link href="/category/infrastructure">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Infrastructure</span>
              </Link>
            </li>
            
            {/* Risk & Policy */}
            <li>
              <div className="block py-2 border-b border-gray-700 text-gray-400 text-sm font-semibold">RISK & POLICY</div>
            </li>
            <li>
              <Link href="/category/trade-policy">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Trade Policy</span>
              </Link>
            </li>
            <li>
              <Link href="/category/risk-security">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Risk & Security</span>
              </Link>
            </li>
            
            {/* More */}
            <li>
              <div className="block py-2 border-b border-gray-700 text-gray-400 text-sm font-semibold">MORE</div>
            </li>
            <li>
              <Link href="/category/innovation">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Innovation</span>
              </Link>
            </li>
            <li>
              <Link href="/category/events-conferences">
                <span className="mobile-nav-link block py-2">Events & Conferences</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
