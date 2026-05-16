"use client";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isHubPage = pathname.startsWith('/u/');
    const isRedirectionPage = pathname.startsWith('/r/');
    const isStandalonePage = ['/about', '/faq', '/contact'].includes(pathname);
    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname) || pathname.startsWith('/reset-password');

    return (
        <>
            {(!isAdminPage && !isStandalonePage && !isHubPage && !isRedirectionPage && !isAuthPage) && <Navbar />}
            <main className={`flex-grow ${isAdminPage ? 'bg-black' : ''}`}>
                {children}
            </main>
            {(!isAdminPage && !isStandalonePage && !isHubPage && !isRedirectionPage && !isAuthPage) && <Footer />}
        </>
    );
}
