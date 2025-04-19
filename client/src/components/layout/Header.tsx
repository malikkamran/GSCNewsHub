import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

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
      
      {/* Main red header */}
      <div className="bg-[#BB1919]">
        <div className="container mx-auto px-4">
          {/* Logo and search */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-white font-roboto font-bold text-2xl md:text-3xl cursor-pointer">
                  GSC Supply Chain News
                </span>
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
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
            >
              <Menu />
            </Button>
          </div>
          
          {/* Main Navigation */}
          <nav className="hidden md:block border-t border-b border-red-800 py-2">
            <ul className="flex flex-wrap space-x-6 text-white">
              <li>
                <Link href="/">
                  <span className={`font-medium hover:text-gray-200 cursor-pointer ${location === '/' ? 'text-white font-bold' : 'text-gray-200'}`}>
                    Home
                  </span>
                </Link>
              </li>
              {categories?.map(category => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`}>
                    <span className={`font-medium hover:text-gray-200 cursor-pointer ${location === `/category/${category.slug}` ? 'text-white font-bold' : 'text-gray-200'}`}>
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
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
        <nav className="md:hidden bg-gray-800">
          <ul className="text-white px-4 py-2">
            <li>
              <Link href="/">
                <span className="block py-2 border-b border-gray-700 cursor-pointer">Home</span>
              </Link>
            </li>
            {categories?.map((category, index) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <span className={`block py-2 cursor-pointer ${index < categories.length - 1 ? 'border-b border-gray-700' : ''}`}>
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
