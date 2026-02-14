"use client";
import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value, duration = 2000, suffix = "" }) {
    const [count, setCount] = useState(0);
    const target = parseFloat(value);

    useEffect(() => {
        let start = 0;
        const end = target;
        const range = end - start;
        let current = start;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);

    // Subtle live fluctuation simulation
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setCount(prev => prev + (Math.random() * 0.1));
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return <span>{count.toLocaleString(undefined, { maximumFractionDigits: 1 })}{suffix}</span>;
}
