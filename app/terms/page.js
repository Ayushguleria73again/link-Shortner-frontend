"use client";
import React from 'react';
import Navbar from '@/components/Navbar';

export default function Terms() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-2">Terms of Service</h1>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-12">Last Updated: February 2026</p>

        <div className="prose prose-zinc prose-sm md:prose-base font-medium text-zinc-600">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using Shorty ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>

          <h3>2. Usage Limits</h3>
          <p>The Service is provided in tiers (Free, Growth, Elite, Scale). You agree to abide by the usage limits of your selected tier. We reserve the right to throttle or suspend accounts that excessively exceed their limits to protect the integrity of the platform.</p>

          <h3>3. Prohibited Content</h3>
          <p>You may not use the Service to shorten links to illegal content, malware, phishing sites, or any content that violates applicable laws. We actively scan for abuse and will permanently terminate accounts found in violation.</p>

          <h3>4. Data Privacy</h3>
          <p>We respect your privacy. Analytics data is collected solely for the purpose of providing the dashboard features. We do not sell individual user data.</p>

          <h3>5. Service Availability</h3>
          <p>While we strive for 100% uptime, we do not guarantee uninterrupted access to the Service. We are not liable for any damages arising from service interruptions.</p>
        </div>
      </div>
    </div>
  );
}
