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
    <header className="bg-[#BB1919]">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <a className="text-white font-roboto font-bold text-2xl md:text-3xl">
                GSC Supply Chain News
              </a>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/sign-in">
              <a className="text-white hover:text-gray-200 flex items-center gap-1">
                <User size={18} />
                <span>Sign In</span>
              </a>
            </Link>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search" 
                className="py-1 px-3 pr-8 rounded-sm text-sm w-48 h-8"
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
        <nav className="hidden md:block border-t border-red-800 py-2">
          <ul className="flex flex-wrap space-x-6 text-white">
            <li>
              <Link href="/">
                <a className={`font-medium hover:text-gray-200 ${location === '/' ? 'text-white' : 'text-gray-200'}`}>
                  Home
                </a>
              </Link>
            </li>
            {categories?.map(category => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <a className={`font-medium hover:text-gray-200 ${location === `/category/${category.slug}` ? 'text-white' : 'text-gray-200'}`}>
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 py-2 bg-gray-100">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search GSC Supply Chain News" 
            className="w-full py-2 px-3 pr-8 rounded-sm text-sm"
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
            <li><Link href="/"><a className="block py-2 border-b border-gray-700">Home</a></Link></li>
            {categories?.map((category, index) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <a className={`block py-2 ${index < categories.length - 1 ? 'border-b border-gray-700' : ''}`}>
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
