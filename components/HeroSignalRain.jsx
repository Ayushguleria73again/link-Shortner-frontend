"use client";
import React from 'react';
import { motion } from 'framer-motion';

const HeroSignalRain = () => {
    // Generate 40-50 particles for a "large scale" feel
    const particles = [...Array(45)];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="flex justify-around w-full h-full px-4">
                {particles.map((_, i) => {
                    const duration = 2 + Math.random() * 4;
                    const delay = Math.random() * 5;
                    const opacity = 0.05 + Math.random() * 0.15;
                    const height = 20 + Math.random() * 100;
                    const left = `${Math.random() * 100}%`;

                    return (
                        <motion.div
                            key={i}
                            initial={{ y: -200, opacity: 0 }}
                            animate={{
                                y: [null, 1000],
                                opacity: [0, opacity, 0]
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: delay
                            }}
                            style={{
                                position: 'absolute',
                                left: left,
                                width: '1px',
                                height: `${height}px`,
                                background: 'linear-gradient(to bottom, transparent, #6366f1)',
                            }}
                        />
                    );
                })}
            </div>
            {/* Horizontal Grid lines for a more "Metrics/Matrix" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100%_40px] pointer-events-none" />
        </div>
    );
};

export default HeroSignalRain;
