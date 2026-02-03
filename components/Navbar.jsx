"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Link2, LogOut } from 'lucide-react';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        setIsLoggedIn(!!token);
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/login');
    };

    // Condition check AFTER all hooks have been called
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isErrorPage = pathname.startsWith('/p/') || pathname === '/suspended';
    if (isAuthPage || isErrorPage) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <Link2 className="w-5 h-5" />
                    <span>SHORTY</span>
                </Link>

                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium hover:text-zinc-500 transition-colors">
                                Dashboard
                            </Link>

                            <div className="flex items-center gap-3 pl-6 border-l border-zinc-100">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black uppercase">
                                    {user?.email?.charAt(0) || 'U'}
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
                            <Link
                                href="/signup"
                                className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold transition-all hover:bg-zinc-800"
                            >
                                GET STARTED
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
