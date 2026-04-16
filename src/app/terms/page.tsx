"use client";

import Link from "next/link";

const R = "#80281F";
const D = "#1A1A1A";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40, paddingBottom: 40, borderBottom: "1px solid #F0F0F0" }}>
      <h2 style={{
        fontSize: 17,
        fontWeight: 700,
        color: R,
        margin: "0 0 14px",
        fontFamily: "var(--font-playfair), serif",
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.9 }}>
        {children}
      </div>
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 10px" }}>{children}</p>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "8px 0 10px", paddingLeft: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
          <span style={{ color: R, fontWeight: 700, marginTop: 2, flexShrink: 0 }}>•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${R} 0%, #5a1a14 100%)`, padding: "52px clamp(20px, 6vw, 160px) 48px", textAlign: "center", position: "relative" }}>
        <Link href="/" style={{ position: "absolute", top: 20, left: "clamp(20px, 6vw, 160px)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </Link>
        <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fff", margin: 0 }}>
          Terms & Conditions
        </h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px clamp(20px, 6vw, 60px) 80px" }}>

        {/* Intro box */}
        <div style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.85, marginBottom: 48, background: "#FDF8F8", border: `1px solid #F5D5D3`, borderLeft: `4px solid ${R}`, borderRadius: 8, padding: "18px 22px" }}>
          This document is an electronic record generated under the provisions of the Information Technology Act, 2000 and the applicable rules, including any amendments. This document is published in line with Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011, which mandates the publication of the website&apos;s terms of use, privacy policy, and rules for user access and interaction on www.bookmycorporateparty.com.
        </div>

        <Section title="1. Introduction">
          <Para>These terms and conditions shall govern your use of our website.</Para>
          <Para>By using our website, you accept these terms and conditions in full; accordingly, if you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website. If you register with our website, submit any material to our website or use any of our website services, we will ask you to expressly agree to these terms and conditions.</Para>
          <Para>By using our website or agreeing to these terms and conditions, you warrant and represent to us that you are at least 18 years of age. Our website uses cookies; by using our website or agreeing to these terms and conditions, you consent to our use of cookies in accordance with the terms of our <Link href="/privacy" style={{ color: R, textDecoration: "none", fontWeight: 600 }}>privacy policy</Link>.</Para>
        </Section>

        <Section title="2. Acceptable Use">
          <Para>You must not:</Para>
          <Bullets items={[
            "Use our website in any way or take any action that causes, or may cause, damage to the website or impairment of the performance, availability or accessibility of the website.",
            "Use our website in any way that is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.",
            "Use our website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.",
            "Conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to our website without our express written consent.",
            "Access or otherwise interact with our website using any robot, spider or other automated means except for the purpose of search engine indexing.",
            "Use data collected from our website for any direct marketing activity (including without limitation email marketing, SMS marketing, telemarketing and direct mailing).",
          ]} />
          <Para>You must ensure that all the information you supply to us through our website, or in relation to our website, is true, accurate, current, complete and non-misleading.</Para>
          <Para>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the site. Prohibited behaviour includes transmitting offensive or unlawful content or disrupting the normal operation of the site.</Para>
        </Section>

        <Section title="3. User Accounts">
          <Para>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account details and are fully responsible for all activities that occur under your account. We may:</Para>
          <Bullets items={[
            "Suspend your account",
            "Cancel your account",
            "Edit your account details",
          ]} />
          <Para>...at any time in our sole discretion without notice or explanation. You may cancel your account on our website using your account control panel.</Para>
        </Section>

        <Section title="4. Product & Service Information">
          <Para>We aim to provide accurate descriptions and pricing of our products and services on the website. However, we do not guarantee that the information, including availability and pricing, is always accurate, complete, or current. We reserve the right to correct errors and update information without prior notice.</Para>
        </Section>

        <Section title="5. Third-Party Links">
          <Para>Our website may contain links to third-party websites that are not under our control. We are not responsible for the content, policies, or practices of these external sites. Accessing third-party links is at your own risk.</Para>
        </Section>

        <Section title="6. Intellectual Property Rights">
          <Para>All content on this site — including text, images, graphics, logos, and software — is owned or licensed by Dream Big Event Management Private Limited and protected by applicable intellectual property laws. You may not reproduce, distribute, or use our content without our prior written consent.</Para>
        </Section>

        <Section title="7. Limitation of Liability">
          <Para>To the extent permitted by law, Dream Big Event Management Private Limited shall not be liable for any indirect, incidental, or consequential damages arising out of or related to your use of the website, including but not limited to damages for loss of profits, data, or other intangible losses.</Para>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <Para>This website is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that the site will always be available, secure, or free from errors or viruses.</Para>
        </Section>

        <Section title="9. Indemnity">
          <Para>You agree to indemnify, defend, and hold harmless Dream Big Event Management Private Limited, its affiliates, directors, officers, employees, and agents from and against all claims, liabilities, damages, losses, or expenses, including reasonable legal fees, arising out of your use of the website or your violation of these Terms & Conditions.</Para>
        </Section>

        <Section title="10. Changes to Terms">
          <Para>We reserve the right to modify or update these Terms & Conditions at any time without prior notice. Changes will be effective once posted on this page. We recommend checking this page periodically for updates.</Para>
        </Section>

        <Section title="11. Governing Law">
          <Para>These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising from or relating to these terms, your use of the website, or our services shall be subject to the exclusive jurisdiction of the courts located in Mumbai, India.</Para>
        </Section>

        <div style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: R, margin: "0 0 14px", fontFamily: "var(--font-playfair), serif" }}>
            12. Contact Us
          </h2>
          <div style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.9 }}>
            <Para>If you have any questions or concerns about these Terms & Conditions, please contact us at:</Para>
            <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 20px", marginTop: 8 }}>
              <p style={{ margin: "0 0 6px" }}>Email: <a href="mailto:info@bookmycorporateparty.com" style={{ color: R, fontWeight: 600, textDecoration: "none" }}>info@bookmycorporateparty.com</a></p>
              <p style={{ margin: "0 0 6px" }}>Phone: <a href="tel:+919333749333" style={{ color: D, textDecoration: "none" }}>+91 9333 74 9333</a></p>
              <p style={{ margin: 0 }}>Address: 1907, 19th Floor, Kamdhenu Commerz Commercial Business Park, Block J, Raghunath Vihar, Sector 14, Kharghar, Navi Mumbai, Maharashtra 410210.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: R, padding: "28px clamp(20px, 6vw, 160px)", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0 }}>
          © 2025 BookMyCorporateParty.com. All rights reserved. |{" "}
          <Link href="/privacy" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Privacy Policy</Link>
        </p>
      </footer>
    </div>
  );
}
