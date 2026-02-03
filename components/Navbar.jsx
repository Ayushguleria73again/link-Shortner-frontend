"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Link2, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        setIsLoggedIn(!!token);
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
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

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isErrorPage = pathname.startsWith('/p/') || pathname === '/suspended';
    if (isAuthPage || isErrorPage) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl tracking-tighter group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                        S
                    </div>
                    <span className="font-black text-xl tracking-tighter text-black">SUTRA.</span>
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
                            className="absolute top-16 left-0 right-0 bg-white border-b border-zinc-100 p-6 md:hidden shadow-xl"
                        >
                            <div className="flex flex-col gap-4">
                                {isLoggedIn ? (
                                    <>
                                        <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-black uppercase">
                                                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{user?.firstName} {user?.lastName}</p>
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
