"use client";
import React, { useState, useEffect } from 'react';

export default function ScrambleText({ text, delay = 0 }) {
    const [displayText, setDisplayText] = useState('');
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_!@#$%^&*()';

    useEffect(() => {
        let timeout;
        let iteration = 0;
        const totalIterations = 15;

        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayText(prev => {
                    return text.split('').map((char, index) => {
                        if (char === ' ' || char === '.' || char === '\n') return char;
                        if (index < iteration / (totalIterations / text.length)) {
                            return text[index];
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    }).join('');
                });

                iteration++;
                if (iteration >= totalIterations * 2) {
                    setDisplayText(text);
                    clearInterval(interval);
                }
            }, 50);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [text, delay]);

    return <span>{displayText || ' '}</span>;
}
