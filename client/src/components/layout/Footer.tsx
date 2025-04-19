import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/lib/types";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <footer>
      {/* Top footer with links */}
      <div className="bg-[#222222] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* About column */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-roboto">GSC Supply Chain News</h3>
              <p className="text-gray-300 text-sm">
                Your trusted source for comprehensive coverage of global supply chain developments, 
                logistics innovations, and business insights.
              </p>
            </div>
            
            {/* Categories column */}
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm">Categories</h4>
              <ul className="space-y-2 text-gray-300">
                {categories?.slice(0, 6).map(category => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`}>
                      <span className="hover:text-white cursor-pointer">{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company column */}
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Advertise</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            {/* Connect column */}
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <Youtube size={20} />
                </a>
              </div>
              <h4 className="font-bold mb-2 uppercase text-sm">Subscribe to our Newsletter</h4>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Email address" 
                  className="py-2 px-3 w-full text-black rounded-none focus-visible:ring-0"
                />
                <Button 
                  className="bg-[#BB1919] text-white py-2 px-4 hover:bg-[#A00000] rounded-none"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} GSC Supply Chain News. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* BBC-style bottom black bar */}
      <div className="bg-black py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-2 md:mb-0">
              <a href="#" className="hover:text-white">Terms of Use</a>
              <a href="#" className="hover:text-white">About Us</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Cookies</a>
              <a href="#" className="hover:text-white">Accessibility Help</a>
              <a href="#" className="hover:text-white">Contact Us</a>
            </div>
            <p>© 2025 GSC Supply Chain News</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
