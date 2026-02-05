"use client";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isStandalonePage = ['/about', '/faq', '/contact'].includes(pathname);

    return (
        <>
            {(!isAdminPage && !isStandalonePage) && <Navbar />}
            <main className={`flex-grow ${isAdminPage ? 'bg-black' : ''}`}>
                {children}
            </main>
            {(!isAdminPage && !isStandalonePage) && <Footer />}
        </>
    );
}
