"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Link2, LogOut, Menu, X, Activity } from 'lucide-react';
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
                            <Link href="/blog" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Blog
                            </Link>

                            <div className="flex items-center gap-6 pl-6 border-l border-zinc-100 relative group">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-3">
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
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black uppercase cursor-pointer ring-4 ring-transparent group-hover:ring-black/5 transition-all relative">
                                            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                        </div>
                                    </div>

                                    {/* Dropdown Menu - Bridged to prevent gap flickering */}
                                    <div className="absolute top-1/2 right-0 w-64 pt-12 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                                        <div className="bg-white border border-zinc-100 rounded-[24px] shadow-2xl overflow-hidden ring-1 ring-black/5">
                                            <div className="p-4 border-b border-zinc-50 bg-zinc-50/50">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 text-right">Authenticated as</p>
                                                <p className="text-sm font-bold text-black truncate text-right">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-[10px] font-medium text-zinc-500 truncate text-right">{user?.email}</p>
                                            </div>

                                            <div className="p-2">
                                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors group/item">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover/item:bg-white transition-colors">
                                                        <Link2 className="w-4 h-4 text-zinc-500" />
                                                    </div>
                                                    <span className="text-sm font-bold text-zinc-700">Command Center</span>
                                                </Link>

                                                {(user?.role === 'admin' || user?.email?.toLowerCase() === 'ayushguleria73@gmail.com') && (
                                                    <Link href="/admin/god-mode" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-500 transition-all group/admin">
                                                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover/admin:bg-white transition-colors">
                                                            <Activity className="w-4 h-4 text-red-500" />
                                                        </div>
                                                        <span className="text-sm font-bold text-red-600 group-hover/admin:text-white transition-colors">Mission Control</span>
                                                    </Link>
                                                )}

                                                <div className="h-px bg-zinc-50 my-2 mx-2" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group/logout text-left"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover/logout:bg-white transition-colors text-red-500">
                                                        <LogOut className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-bold text-red-600">Secure Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            <Link href="/blog" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Blog
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
                                        {(user?.role === 'admin' || user?.email?.toLowerCase() === 'ayushguleria73@gmail.com') && (
                                            <Link href="/admin/god-mode" className="text-lg font-black py-2 text-red-500 hover:translate-x-2 transition-transform uppercase tracking-tighter">
                                                Mission Control
                                            </Link>
                                        )}
                                        <Link href="/pricing" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Pricing
                                        </Link>
                                        <Link href="/blog" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Blog
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
                                        <Link href="/blog" className="text-lg font-medium py-2 hover:translate-x-2 transition-transform">
                                            Blog
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
