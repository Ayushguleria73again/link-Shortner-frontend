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
        <div className="prose prose-zinc prose-sm md:prose-base font-medium text-zinc-600 space-y-8">
          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">1. Acceptance of Protocol</h3>
            <p>By initializing a session with smol (the "Protocol"), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and smol Elite Intelligence. If you do not agree to these terms, you must terminate your connection immediately.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">2. User Account Security</h3>
            <p>Users are responsible for maintaining the confidentiality of their access credentials, including API keys and passwords. smol is not liable for any unauthorized access resulting from user negligence. Any activity originating from your account is deemed your sole responsibility.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">3. Operational Usage Limits</h3>
            <p>The Protocol is provided across multiple tiers: Spark (Free), Growth, Elite, and Scale. Each tier carries specific limitations regarding active links, monthly hits, and custom domain capacity. smol reserves the right to implement automated throttling or temporary suspension if usage patterns exceed tier limits or interfere with Protocol stability.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">4. Content Prohibitions & Anti-Spam</h3>
            <p>The use of smol for the following activities is strictly prohibited and will result in immediate termination without refund:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Distribution of malware, ransomware, or malicious code.</li>
              <li>Phishing, spoofing, or deceptive redirection.</li>
              <li>Dissemination of illegal, hate-filled, or copyright-infringing material.</li>
              <li>Mass automated spam shifting within short temporal windows.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">5. Intellectual Property</h3>
            <p>The smol interface, brand assets, redirection algorithms, and underlying code are the exclusive property of smol Elite. Users are granted a non-exclusive, non-transferable license to utilize the Protocol within the bounds of their subscription plan.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">6. Payment & Subscription</h3>
            <p>Subscription fees are billed in advance on a recurring monthly or annual basis. All fees are non-refundable unless required by local law. smol reserves the right to adjust pricing following a 30-day notice period via the provided email channel.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">7. Privacy & Data Handling</h3>
            <p>We process click analytics (IP, location, device) to provide your dashboard intelligence. While we strive for GDPR compliance, users are responsible for ensuring that their use of redirection links complies with the privacy laws of their specific jurisdiction.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">8. Limitation of Liability</h3>
            <p>smol is provided "as is" and "as available." In no event shall smol be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the Protocol, including but not limited to loss of revenue or data.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">9. Termination</h3>
            <p>We reserve the right to suspend or terminate access to the Protocol at any time, with or without cause, including but not limited to breach of these Terms. Upon termination, your right to use the Protocol will immediately cease.</p>
          </section>

          <section>
            <h3 className="text-black font-black uppercase text-sm tracking-widest mb-4">10. Governing Law</h3>
            <p>These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
}
