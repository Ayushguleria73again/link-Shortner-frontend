"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      question: "Is the tracking real-time?",
      answer: "Yes. Our Elite Intelligence engine processes clicks in under 50ms, updating your dashboard instantly with location, device, and referrer data."
    },
    {
      question: "What happens if I exceed my click limit?",
      answer: "Your links will NEVER break. We simply stop recording analytics for new clicks until your monthly cycle resets or you upgrade your plan."
    },
    {
      question: "Can I use my own domain?",
      answer: "Custom domains are available on the Scale plan. You can connect unlimited domains to maintain complete brand consistency."
    },
    {
      question: "Do you offer API access?",
      answer: "Yes, the Elite and Scale plans include full access to our Developer API, allowing you to programmatically shorten links and retrieve metrics."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption for all data at rest and in transit. Your link data is private and never sold to third parties."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Frequently Asked <span className="text-zinc-400">Questions.</span></h1>
          <p className="text-zinc-500 font-medium">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Accordion key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Accordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-100 rounded-2xl bg-zinc-50/50 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-zinc-50 transition-colors"
      >
        <span className="font-bold text-lg">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 text-zinc-500 font-medium leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
