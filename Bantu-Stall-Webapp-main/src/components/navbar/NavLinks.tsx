
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { mainNavLinks, communityLinks } from './navigationData';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavLinksProps {
  isScrolled: boolean;
  onMobileClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isScrolled, onMobileClick }) => {
  return (
    <NavigationMenu className={cn(
      "transition-colors duration-300",
      "text-gray-800"
    )}>
      <NavigationMenuList>
        {/* Main Navigation Links */}
        {mainNavLinks.map((link) => (
          <NavigationMenuItem key={link.path}>
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-gray-100/50 flex items-center gap-2 transition-all duration-300 text-gray-800 hover:text-bantu-orange"
              )}
              asChild
            >
              <Link to={link.path} onClick={onMobileClick} className="flex items-center gap-2">
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        {/* Community & Platform Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "bg-transparent hover:bg-gray-100/50 transition-all duration-300 text-gray-800 hover:text-bantu-orange"
          )}>
            Platform
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2 bg-white border border-gray-200 rounded-2xl shadow-lg">
              {communityLinks.map((link) => (
                link.disabled ? (
                  <div
                    key={link.path}
                    className="group select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <link.icon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="text-sm font-semibold text-gray-400">
                        {link.title}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                      {link.description}
                    </p>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onMobileClick}
                    className="group select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gray-50 hover:shadow-md focus:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-bantu-orange/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <link.icon className="h-4 w-4 text-bantu-orange" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-bantu-orange transition-colors duration-300">
                        {link.title}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-600">
                      {link.description}
                    </p>
                  </Link>
                )
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavLinks;
