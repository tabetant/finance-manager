"use client";

import React from 'react';
import Link from 'next/link';
import { Globe, Bell, User, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
    onEddiClick?: () => void;
    currentPage?: string;
}

export function Navbar({ onEddiClick, currentPage = 'dashboard' }: NavbarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
        { id: 'courses', label: 'Courses', href: '/courses' },
        { id: 'progress', label: 'My Progress', href: '/progress' },
        { id: 'resources', label: 'Resources', href: '/resources' },
    ];

    return (
        <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg flex items-center justify-center shadow-lg">
                            <Globe className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">WorldEd</h1>
                            <p className="text-xs text-muted-foreground -mt-1">Master anything, anywhere</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`
                  text-sm font-medium transition-colors pb-1
                  ${currentPage === item.id
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }
                `}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:block w-80">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                placeholder="Search courses, modules, topics..."
                                className="pl-10 text-sm bg-[var(--input-background)] border-border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">
                        {/* Eddi AI Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onEddiClick}
                            className="bg-gradient-to-r from-[var(--worlded-purple)] to-[var(--worlded-pink)] text-white hover:opacity-90 shadow-md"
                        >
                            <Sparkles size={16} />
                            <span className="hidden sm:inline ml-2">Ask Eddi</span>
                        </Button>

                        {/* Notifications */}
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
                            <Bell size={20} className="text-muted-foreground" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
                        </button>

                        {/* User Avatar */}
                        <button className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-sm">
                            <User size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
