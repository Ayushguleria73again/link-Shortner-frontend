"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Link2, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const fetchUserData = async () => {
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    if (data.data) {
                        setUser(data.data);
                        localStorage.setItem('user', JSON.stringify(data.data));
                    }
                } catch (err) {
                    console.error("Failed to sync user data", err);
                    // Fallback to local storage if API fails
                    const localUser = localStorage.getItem('user');
                    if (localUser) setUser(JSON.parse(localUser));
                }
            }
        };

        fetchUserData();
    }, [pathname]);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/login');
    };

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Smart Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                setIsVisible(true); // Always show at top
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false); // Hide on scroll down
            } else {
                setIsVisible(true); // Show on scroll up
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isErrorPage = pathname.startsWith('/p/') || pathname === '/suspended';
    if (isAuthPage || isErrorPage) return null;

    return (
        <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto md:min-w-[700px] max-w-5xl bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-full shadow-2xl shadow-zinc-500/10 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0'}`}>
            <div className="px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl tracking-tighter group-hover:scale-110 transition-transform shadow-lg shadow-black/20 lowercase">
                        s
                    </div>
                    <span className="font-black text-xl tracking-tighter text-black lowercase">smol.</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/pricing" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Pricing
                            </Link>
                            <Link href="/dashboard" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Dashboard
                            </Link>

                            <div className="flex items-center gap-3 pl-6 border-l border-zinc-100">
                                {user?.plan && (
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${user.plan === 'starter' ? 'bg-emerald-100 text-emerald-600' :
                                        user.plan === 'pro' ? 'bg-indigo-100 text-indigo-600' :
                                            user.plan === 'business' ? 'bg-amber-100 text-amber-600' :
                                                'bg-zinc-100 text-zinc-500' // Free/Spark style
                                        }`}>
                                        {
                                            user.plan === 'starter' ? 'Growth' :
                                                user.plan === 'pro' ? 'Elite' :
                                                    user.plan === 'business' ? 'Scale' :
                                                        'Spark' // Free plan name
                                        }
                                    </span>
                                )}
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black uppercase">
                                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium hover:text-zinc-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Login
                            </Link>
                            <Link href="/pricing" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Pricing
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold transition-all hover:bg-zinc-800"
                            >
                                GET STARTED
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden z-50 relative p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-20 left-0 right-0 bg-white border border-zinc-100 p-6 md:hidden shadow-xl rounded-3xl"
                        >
                            <div className="flex flex-col gap-4">
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-black uppercase">
                                                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-sm">{user?.firstName} {user?.lastName}</p>
                                                    {user?.plan && (
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${user.plan === 'starter' ? 'bg-emerald-100 text-emerald-600' :
                                                            user.plan === 'pro' ? 'bg-indigo-100 text-indigo-600' :
                                                                user.plan === 'business' ? 'bg-amber-100 text-amber-600' :
                                                                    'bg-zinc-100 text-zinc-500'
                                                            }`}>
                                                            {
                                                                user.plan === 'starter' ? 'Growth' :
                                                                    user.plan === 'pro' ? 'Elite' :
                                                                        user.plan === 'business' ? 'Scale' :
                                                                            'Spark'
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/dashboard" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Dashboard
                                        </Link>
                                        <Link href="/pricing" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Pricing
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="text-lg font-medium py-2 text-left text-red-500 hover:translate-x-2 transition-transform"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Login
                                        </Link>
                                        <Link href="/pricing" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Pricing
                                        </Link>
                                        <Link href="/signup" className="mt-4 bg-black text-white py-4 rounded-xl text-center font-bold text-sm uppercase tracking-widest">
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
