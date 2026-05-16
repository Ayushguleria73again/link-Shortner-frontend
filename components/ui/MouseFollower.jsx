"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MouseFollower = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999]"
            animate={{
                x: mousePosition.x - 5,
                y: mousePosition.y - 5,
                backgroundColor: ["#6366f1", "#10b981", "#f43f5e", "#6366f1"],
                boxShadow: [
                    "0 0 10px rgba(99, 102, 241, 0.4)",
                    "0 0 10px rgba(16, 185, 129, 0.4)",
                    "0 0 10px rgba(244, 63, 94, 0.4)",
                    "0 0 10px rgba(99, 102, 241, 0.4)"
                ]
            }}
            transition={{
                x: { type: 'spring', damping: 25, stiffness: 350, restDelta: 0.001 },
                y: { type: 'spring', damping: 25, stiffness: 350, restDelta: 0.001 },
                backgroundColor: { repeat: Infinity, duration: 3, ease: "linear" },
                boxShadow: { repeat: Infinity, duration: 3, ease: "linear" }
            }}
        />
    );
};

export default MouseFollower;
