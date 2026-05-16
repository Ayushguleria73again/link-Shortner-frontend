"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simplified World Map SVG Paths (Major Regions for high-fidelity feel)
// This is a partial map for demonstration, in a real scenario we'd use a full TopoJSON or larger SVG set.
const WORLD_PATHS = [
  { id: "IN", name: "India", d: "M714,357 L716,365 L722,367 L726,373 L728,382 L724,390 L718,392 L712,398 L710,405 L716,412 L724,420 L720,425 L712,422 L705,430 L700,420 L695,410 L698,398 L692,390 L685,385 L688,375 L695,368 L705,360 Z" },
  { id: "US", name: "United States", d: "M150,150 L250,150 L250,230 L200,250 L140,240 L120,200 Z" },
  { id: "RU", name: "Russia", d: "M550,50 L850,50 L850,150 L700,180 L500,150 Z" },
  { id: "CN", name: "China", d: "M700,200 L800,220 L780,300 L720,320 L680,280 Z" },
  { id: "BR", name: "Brazil", d: "M280,350 L350,380 L350,450 L300,480 L250,430 Z" },
  { id: "AU", name: "Australia", d: "M750,450 L850,480 L850,550 L780,580 L720,530 Z" },
  // ... adding more generalized paths for visual completeness
  { id: "AF", name: "Africa", d: "M450,250 L550,280 L580,350 L550,450 L480,480 L420,430 L400,320 Z" },
  { id: "EU", name: "Europe", d: "M450,100 L550,100 L550,180 L480,200 L440,150 Z" }
];

export default function GeoHeatmap({ stats = [] }) {
    const [hovered, setHovered] = useState(null);

    // Filter and map incoming stats to our paths
    const getIntensity = (countryId) => {
        const country = stats.find(s => s.name.toUpperCase().includes(countryId) || (countryId === 'US' && s.name === 'United States'));
        if (!country) return 0;
        // Normalize intensity based on value (mock calculation)
        return Math.min(country.value / 100, 1); 
    };

    return (
        <div className="relative w-full h-full min-h-[400px] bg-zinc-950 rounded-[40px] overflow-hidden border border-zinc-800 group">
            {/* Background Map Image (Abstract) */}
            <div className="absolute inset-0 opacity-20 grayscale scale-110 blur-[1px]">
                <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
            </div>

            {/* Radar Sweep Animation */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 animate-[spin_10s_linear_infinite]" />
            </div>

            {/* SVG Map Overlay */}
            <svg viewBox="0 0 1000 600" className="relative z-20 w-full h-full p-12">
                {WORLD_PATHS.map((path) => {
                    const intensity = getIntensity(path.id);
                    const isActive = intensity > 0;
                    
                    return (
                        <g 
                            key={path.id}
                            onMouseEnter={() => setHovered({ ...path, value: intensity * 100 })}
                            onMouseLeave={() => setHovered(null)}
                            className="cursor-crosshair transition-all duration-500"
                        >
                            <motion.path
                                d={path.d}
                                initial={false}
                                animate={{
                                    fill: isActive ? `rgba(99, 102, 241, ${0.2 + intensity * 0.8})` : 'rgba(255, 255, 255, 0.05)',
                                    stroke: isActive ? '#818cf8' : 'rgba(255, 255, 255, 0.1)',
                                    strokeWidth: hovered?.id === path.id ? 2 : 0.5
                                }}
                                className="transition-colors hover:fill-indigo-400/50"
                            />
                            {isActive && (
                                <motion.circle
                                    cx={path.d.split(' ')[0].substring(1).split(',')[0]}
                                    cy={path.d.split(' ')[0].substring(1).split(',')[1]}
                                    r={4 + intensity * 10}
                                    className="fill-indigo-500/30 stroke-indigo-400 stroke-2 animate-pulse"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip Popup */}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-12 left-12 z-30 bg-black/80 backdrop-blur-xl border border-zinc-700 p-6 rounded-3xl shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-white">{hovered.name} Registry</h4>
                        </div>
                        <p className="text-3xl font-black font-mono text-white italic">
                            {hovered.value > 0 ? Math.round(hovered.value) : '0'} 
                            <span className="text-[10px] text-zinc-500 ml-2 uppercase tracking-tighter not-italic">Hits</span>
                        </p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mt-2">Uplink Status: Optimized</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Technical Overlay Markers */}
            <div className="absolute top-12 right-12 z-30 text-right space-y-2 pointer-events-none">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Satellite G-14 // Sync Active</div>
                <div className="flex items-center gap-2 justify-end">
                    <div className="w-12 h-0.5 bg-zinc-800 overflow-hidden rounded-full">
                        <motion.div 
                            className="h-full bg-indigo-500"
                            animate={{ x: [-48, 48] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    </div>
                    <span className="text-[10px] font-black font-mono text-zinc-400">99.8%</span>
                </div>
            </div>
        </div>
    );
}
