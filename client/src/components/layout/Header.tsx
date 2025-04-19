import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import NavDropdown from "./NavDropdown";

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

  return (
    <header>
      {/* Top black bar */}
      <div className="bg-black py-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-end">
            <Link href="/sign-in">
              <span className="text-white text-xs hover:underline cursor-pointer">Sign in</span>
            </Link>
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
                    src="/gsc-logo.svg" 
                    alt="GSC News Logo" 
                    className="h-12 w-12 md:h-16 md:w-16 mr-3"
                  />
                  <span className="text-[#BB1919] font-bold text-lg md:text-2xl" style={{fontFamily: 'Helvetica, Arial, sans-serif'}}>
                    Supply Chain News
                  </span>
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="py-1 px-3 pr-8 rounded-none text-sm w-48 h-8 border-none focus-visible:ring-0"
                />
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="absolute right-1 top-0 text-gray-600 h-8 w-8"
                >
                  <Search size={16} />
                </Button>
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
      <div className="border-t border-[#BB1919] nav-menu">
        <div className="container mx-auto px-4">
          <nav className="hidden md:block">
            <ul className="flex flex-wrap text-gray-800" role="menubar">
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
                <Link href="/category/warehousing">
                  <span className={`nav-item inline-block ${location === '/category/warehousing' ? 'nav-item-active' : ''}`} role="menuitem">
                    Warehousing
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/procurement">
                  <span className={`nav-item inline-block ${location === '/category/procurement' ? 'nav-item-active' : ''}`} role="menuitem">
                    Procurement
                  </span>
                </Link>
              </li>
              <li role="none">
                <Link href="/category/manufacturing">
                  <span className={`nav-item inline-block ${location === '/category/manufacturing' ? 'nav-item-active' : ''}`} role="menuitem">
                    Manufacturing
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
              <li role="none" className="nav-item inline-block">
                <NavDropdown 
                  label="More" 
                  items={[
                    { label: "Trade Policy", slug: "trade-policy" },
                    { label: "Risk & Security", slug: "risk-security" },
                    { label: "E-commerce", slug: "e-commerce" },
                    { label: "Infrastructure", slug: "infrastructure" },
                    { label: "Cold Chain", slug: "cold-chain" },
                    { label: "Events & Conferences", slug: "events-conferences" },
                    { label: "Company Profiles", slug: "company-profiles" },
                    { label: "Innovation", slug: "innovation" }
                  ]}
                />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 py-2 bg-gray-100">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search GSC Supply Chain News" 
            className="w-full py-2 px-3 pr-8 rounded-none text-sm"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 h-8 w-8"
          >
            <Search size={16} />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {showMobileMenu && (
        <nav className="md:hidden bg-gray-800" aria-label="Mobile menu">
          <ul className="text-white px-4 py-2">
            <li>
              <Link href="/">
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
              <Link href="/category/warehousing">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Warehousing</span>
              </Link>
            </li>
            <li>
              <Link href="/category/procurement">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Procurement</span>
              </Link>
            </li>
            <li>
              <Link href="/category/manufacturing">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Manufacturing</span>
              </Link>
            </li>
            <li>
              <Link href="/category/tech-digital">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Tech & Digital</span>
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
            
            {/* More dropdown items */}
            <li>
              <div className="block py-2 border-b border-gray-700 text-gray-400 text-sm font-semibold">MORE CATEGORIES</div>
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
            <li>
              <Link href="/category/e-commerce">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">E-commerce</span>
              </Link>
            </li>
            <li>
              <Link href="/category/infrastructure">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Infrastructure</span>
              </Link>
            </li>
            <li>
              <Link href="/category/cold-chain">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Cold Chain</span>
              </Link>
            </li>
            <li>
              <Link href="/category/events-conferences">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Events & Conferences</span>
              </Link>
            </li>
            <li>
              <Link href="/category/company-profiles">
                <span className="mobile-nav-link block py-2 border-b border-gray-700">Company Profiles</span>
              </Link>
            </li>
            <li>
              <Link href="/category/innovation">
                <span className="mobile-nav-link block py-2">Innovation</span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
