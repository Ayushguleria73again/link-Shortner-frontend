"use client";
import React, { useState } from 'react';
import { ChevronDown, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FAQ() {
  const router = useRouter();
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
      answer: "Custom domains are available on Growth, Elite, and Scale plans. You can connect and verify domains via CNAME records to maintain brand consistency."
    },
    {
      question: "Do you offer API access?",
      answer: "Yes, the Elite and Scale plans include full access to our Developer API, allowing you to programmatically shorten links and retrieve metrics."
    },
    {
      question: "Can I create custom aliases?",
      answer: "Absolutely. Advanced tiers allow you to set custom short codes (e.g., smol.link/summer-sale) to maximize click-through rates and brand recognition."
    },
    {
      question: "What are 'Burn-on-Read' links?",
      answer: "This is a security feature where a link automatically deactivates after the first click. It's perfect for sharing sensitive documents or one-time codes."
    },
    {
      question: "How do QR codes work?",
      answer: "Every link you create automatically generates a high-resolution QR code identity. You can download these as SVG or PNG for print and digital marketing."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 14-day 'No Questions Asked' refund policy for all paid tiers if you're not satisfied with the intelligence depth of our Protocol."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption for all data at rest and in transit. Your link data is private and never sold to third parties."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="pt-16 pb-20 px-6 max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-400 hover:text-black mb-12 transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
        </button>
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
