'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, ChartBarIcon, BookOpenIcon, Trophy,
  Users, GitBranch, Settings, Menu, X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Problems', href: '/problems', icon: BookOpenIcon },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Repositories', href: '/repositories', icon: GitBranch },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-16 pb-4 
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <nav className="h-full px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
