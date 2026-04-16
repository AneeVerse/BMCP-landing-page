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
        display: "flex",
        alignItems: "center",
        gap: 10,
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

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${R} 0%, #5a1a14 100%)`, padding: "52px clamp(20px, 6vw, 160px) 48px", textAlign: "center", position: "relative" }}>
        <Link href="/" style={{ position: "absolute", top: 20, left: "clamp(20px, 6vw, 160px)", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Home
        </Link>
        <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fff", margin: 0 }}>
          Privacy Policy
        </h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px clamp(20px, 6vw, 60px) 80px" }}>

        {/* Intro box */}
        <div style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.85, marginBottom: 48, background: "#FDF8F8", border: `1px solid #F5D5D3`, borderLeft: `4px solid ${R}`, borderRadius: 8, padding: "18px 22px" }}>
          Dream Big Event Management Private Limited is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website www.bookmycorporateparty.com or use our services.
        </div>

        <Section title="1. Information We Collect">
          <Para>We may collect the following information:</Para>
          <Bullets items={[
            "Personal Information: Name, email address, phone number, and other details you provide during checkout or service requests.",
            "Payment Information: We collect payment details directly for processing transactions securely.",
            "Usage Data: Information about how you use our website, including IP address, browser type, pages visited, and time spent on pages.",
            "Cookies: We use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.",
          ]} />
        </Section>

        <Section title="2. How We Use Your Information">
          <Para>We use the collected information to:</Para>
          <Bullets items={[
            "Process and fulfil orders and deliver services.",
            "Communicate with you about your orders, inquiries, or other requests.",
            "Improve our website and services.",
            "Send promotional emails or newsletters, if you have opted in.",
          ]} />
        </Section>

        <Section title="3. Sharing of Information">
          <Para>We do not sell your personal information. However, we may share your data with:</Para>
          <Bullets items={[
            "Service Providers: Third-party vendors who assist us in operating our website, conducting our business, or servicing you.",
            "Legal Requirements: If required by law, we may disclose your information to comply with legal obligations or protect our rights.",
          ]} />
        </Section>

        <Section title="4. Data Security">
          <Para>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</Para>
        </Section>

        <Section title="5. Data Retention">
          <Para>We retain your personal information only as long as necessary to fulfil the purposes described in this policy or to comply with legal requirements. Afterward, data is securely deleted or anonymized.</Para>
        </Section>

        <Section title="6. Changes to This Policy">
          <Para>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</Para>
        </Section>

        <Section title="7. Your Rights">
          <Para>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:info@bookmycorporateparty.com" style={{ color: R, textDecoration: "none", fontWeight: 600 }}>info@bookmycorporateparty.com</a>. We will respond within 30 business days.</Para>
        </Section>

        <div style={{ marginBottom: 0, paddingBottom: 0 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: R, margin: "0 0 14px", fontFamily: "var(--font-playfair), serif" }}>
            8. Your Privacy Matters to Us
          </h2>
          <div style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.9 }}>
            <Para>In accordance with the Information Technology Act, 2000 and applicable rules, we are committed to addressing any concerns or feedback you may have regarding this Privacy Policy or the handling of your personal information.</Para>
            <Para>For any privacy-related questions, concerns, or feedback, please contact us at:</Para>
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
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>Terms & Conditions</Link>
        </p>
      </footer>
    </div>
  );
}
