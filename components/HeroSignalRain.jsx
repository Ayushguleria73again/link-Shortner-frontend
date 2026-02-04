"use client";
import React from 'react';
import { motion } from 'framer-motion';

const HeroSignalRain = () => {
    // Branded colors
    const colors = ['#6366f1', '#10b981', '#f43f5e', '#a855f7'];
    const bits = ['0', '1'];

    // Memoize the particle properties so they don't change on re-render
    const particles = React.useMemo(() => {
        return [...Array(100)].map((_, i) => ({
            id: i,
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 5,
            opacity: 0.1 + Math.random() * 0.4,
            fontSize: 10 + Math.random() * 14,
            left: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            char: bits[Math.floor(Math.random() * bits.length)]
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="relative w-full h-full">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{
                            y: [null, 1000],
                            opacity: [0, p.opacity, 0]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay
                        }}
                        className="font-mono font-bold select-none"
                        style={{
                            position: 'absolute',
                            left: p.left,
                            fontSize: `${p.fontSize}px`,
                            color: p.color,
                            textShadow: `0 0 8px ${p.color}40`,
                        }}
                    >
                        {p.char}
                    </motion.div>
                ))}
            </div>
            {/* Horizontal Grid lines for a more "Metrics/Matrix" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />
        </div>
    );
};

export default HeroSignalRain;
