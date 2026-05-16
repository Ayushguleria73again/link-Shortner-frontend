"use client";
import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    CreditCard,
    Settings,
    Link as LinkIcon,
    LogOut,
    Home,
    Search,
    UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandMenu = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle with Cmd+K
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-start justify-center pt-[20vh] px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
                >
                    <Command className="w-full">
                        <div className="flex items-center px-4 border-b border-zinc-100">
                            <Search className="w-5 h-5 text-zinc-400 mr-3" />
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="w-full h-16 outline-none text-lg font-medium placeholder:text-zinc-400 text-black"
                            />
                        </div>

                        <Command.List className="p-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                            <Command.Empty className="py-6 text-center text-sm text-zinc-500 font-medium">
                                No results found.
                            </Command.Empty>

                            <Command.Group heading="Navigation" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 py-2 mb-1 select-none">
                                <Item icon={<Home />} label="Home" onSelect={() => runCommand(() => router.push('/'))} />
                                <Item icon={<LayoutDashboard />} label="Dashboard" onSelect={() => runCommand(() => router.push('/dashboard'))} />
                                <Item icon={<CreditCard />} label="Plans & Pricing" onSelect={() => runCommand(() => router.push('/pricing'))} />
                            </Command.Group>

                            <Command.Group heading="Account" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2 py-2 mb-1 mt-2 select-none">
                                <Item icon={<UserCircle />} label="My Profile" onSelect={() => runCommand(() => router.push('/dashboard?view=settings'))} />
                                <Item icon={<LogOut className="text-rose-500" />} label="Logout" activeClassName="data-[selected=true]:bg-rose-50 data-[selected=true]:text-rose-600" onSelect={() => runCommand(() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    router.push('/login');
                                })} />
                            </Command.Group>
                        </Command.List>

                        <div className="bg-zinc-50 px-4 py-2 border-t border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 bg-white border border-zinc-200 px-1.5 py-0.5 rounded shadow-sm">esc</span>
                                <span className="text-[10px] text-zinc-400 font-medium">to close</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 bg-white border border-zinc-200 px-1.5 py-0.5 rounded shadow-sm">↵</span>
                                <span className="text-[10px] text-zinc-400 font-medium">to select</span>
                            </div>
                        </div>
                    </Command>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const Item = ({ icon, label, onSelect, activeClassName = "data-[selected=true]:bg-zinc-100 data-[selected=true]:text-black" }) => {
    return (
        <Command.Item
            onSelect={onSelect}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 transition-all cursor-pointer select-none ${activeClassName}`}
        >
            {React.cloneElement(icon, { className: "w-4 h-4" })}
            {label}
        </Command.Item>
    );
};

export default CommandMenu;
