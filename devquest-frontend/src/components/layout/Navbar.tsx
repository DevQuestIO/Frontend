'use client';

import { Code2, Search, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href}
    className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
  >
    {children}
  </Link>
);

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-800">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-indigo-500" />
            <span className="text-lg font-semibold text-white">DevQuest.IO</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/analytics">Analytics</NavLink>
            <NavLink href="/problems">Problems</NavLink>
          </div>
        </div>

        {/* Right side - Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-60 bg-gray-800 text-gray-100 text-sm rounded-md 
                pl-9 pr-4 py-2 border border-gray-700
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                placeholder-gray-400 outline-none"
            />
          </div>

          {/* Notification */}
          <button className="p-2 rounded-md hover:bg-gray-800">
            <Bell className="h-5 w-5 text-gray-300" />
          </button>

          {/* Profile */}
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
            <div className="h-8 w-8 bg-gray-800 rounded-md flex items-center justify-center">
              <User className="h-5 w-5 text-gray-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}