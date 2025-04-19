import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";

interface NavDropdownItem {
  label: string;
  slug: string;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
}

export default function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  
  return (
    <div ref={dropdownRef} className="relative">
      <button
        className="font-medium hover:text-gray-200 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown size={16} className="ml-1" />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-sm w-48 py-1 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => (
            <Link 
              key={index} 
              href={`/category/${item.slug}`}
              onClick={() => setIsOpen(false)}
            >
              <span 
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-[#BB1919] hover:text-white cursor-pointer"
                role="menuitem"
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}