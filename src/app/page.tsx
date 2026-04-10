"use client";

import { useState, useEffect, useRef } from "react";

const R = "#80281F";
const D = "#1A1A1A";
const L = "#FDF0EF";
const G = "#6B7280";
const B = "#E5E7EB";

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.6s ease, transform 0.6s ease" } };
}

const Sec = ({ children, bg = "transparent", id, style }: { children: React.ReactNode; bg?: string; id?: string, style?: any }) => {
  const f = useFadeIn();
  return (
    <section ref={f.ref as React.RefObject<HTMLElement>} id={id} style={{ ...f.style, background: bg, padding: "50px 24px", ...style }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>{children}</div>
    </section>
  );
};

function Badge({ text }: { text: string }) {
  return <span style={{ display: "inline-block", background: L, color: R, fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, letterSpacing: 0.8, textTransform: "uppercase" }}>{text}</span>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${B}`, cursor: "pointer", padding: "18px 0" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: D, paddingRight: 16 }}>{q}</h4>
        <span style={{ fontSize: 22, color: R, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease, opacity 0.3s", opacity: open ? 1 : 0 }}>
        <p style={{ fontSize: 15, color: G, lineHeight: 1.7, margin: "12px 0 0", paddingRight: 40 }}>{a}</p>
      </div>
    </div>
  );
}

type Venue = { name: string; img: string; tags: string[]; desc: string; capacity: string };

function VenueCard({ v }: { v: Venue }) {
  return (
    <div style={{ 
      background: "#fff", 
      borderRadius: 12, 
      overflow: "hidden", 
      border: `1px solid ${B}`, 
      transition: "transform 0.2s",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
      <div style={{ height: 180, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <img src={v.img} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
          <h4 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 700 }}>{v.name}</h4>
        </div>
      </div>
      <div style={{ padding: "20px 18px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", flexShrink: 0 }}>
          {v.tags.map((t, j) => (
            <span key={j} style={{ fontSize: 11, fontWeight: 600, color: R, background: L, padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 10 }}>✓</span> {t}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 13.5, color: G, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{v.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: D, fontWeight: 700, marginBottom: 20, flexShrink: 0 }}>
          <span style={{ color: "#5D5FEF", fontSize: 16 }}>👥</span>
          <span>Capacity: {v.capacity}</span>
        </div>
        <button style={{ 
          width: "100%", padding: "12px 0", 
          background: "none", color: R, 
          border: `1px solid ${R}`, borderRadius: 8, 
          fontSize: 14, fontWeight: 700, 
          cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", 
          transition: "all 0.2s ease",
          flexShrink: 0
        }} onMouseEnter={e => { e.currentTarget.style.background = R; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = R; }}>
          Get Venue Options →
        </button>
      </div>
    </div>
  );
}

export default function BMCPLanding() {
  const [formData, setFormData] = useState({ event: "", location: "", date: "", whatsapp: true });

  const venues: Venue[] = [
    { name: "Lounges & Clubs", img: "/images/687e0608c0d8f.jpg", tags: ["DJ & Music", "Bar Setup"], desc: "High-energy venues with DJ, bar, and dance floor — ideal for team parties, R&R nights, and celebrations.", capacity: "30–150 guests" },
    { name: "Banquet Halls", img: "/images/69d0ec17600a2.jpg", tags: ["Large Events", "AV Setup"], desc: "Spacious halls with stage, AV, and flexible seating — perfect for annual parties and award nights.", capacity: "100–1000+ guests" },
    { name: "Fine Dine", img: "/images/6878994b943ac.jpg", tags: ["Premium", "Client Dinners"], desc: "Elegant restaurants for leadership meets, client entertainment, and intimate corporate dinners.", capacity: "20–80 guests" },
    { name: "Cafes", img: "/images/687ddcbbb03f3.jpg", tags: ["Casual", "Budget-Friendly"], desc: "Relaxed spaces for team lunches, farewell parties, and casual get-togethers with small groups.", capacity: "15–50 guests" },
    { name: "Open Lawns", img: "/images/6884fe622ce3c.jpg", tags: ["Outdoor", "Team Activities"], desc: "Open-air venues for team outings, fun days, and large events with space for games and stages.", capacity: "50–500+ guests" },
    { name: "Resorts & Villas", img: "/images/69882f2f67edd.jpeg", tags: ["Offsites", "Weekend Getaway"], desc: "Destination venues near Mumbai for offsites, leadership retreats, and team-building stays.", capacity: "20–200 guests" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: D, overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${B}`, padding: "12px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 42, height: 42, overflow: "hidden", display: "flex", alignItems: "center" }}>
              <img src="/images/logo-lg.png" alt="" style={{ height: 42, width: "auto", maxWidth: "none", objectFit: "cover", objectPosition: "left" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#000", letterSpacing: "-0.5px", fontFamily: "'DM Sans', sans-serif" }}>BOOK MY CORPORATE</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#000", letterSpacing: "-0.5px", fontFamily: "'DM Sans', sans-serif" }}>PARTY.COM</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", gap: 24, marginRight: 20 }} className="nav-links">
              {[
                { name: "Why Us", href: "#why-us" },
                { name: "Venues", href: "#venues" },
                { name: "Process", href: "#how-it-works" },
                { name: "FAQ", href: "#faq" }
              ].map(link => (
                <a key={link.href} href={link.href} style={{ fontSize: 13, fontWeight: 600, color: D, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = R} onMouseLeave={e => e.currentTarget.style.color = D}>{link.name}</a>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ color: R, display: "flex", alignItems: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <a href="tel:+919333749333" style={{ fontSize: 13.5, color: D, textDecoration: "none", fontWeight: 700, letterSpacing: "0.2px" }}>+91 9333 74 9333</a>
            </div>
            <button style={{ background: R, color: "#fff", border: "none", borderRadius: 7, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* ===== 1. HERO + FORM ===== */}
      <section style={{
        background: `linear-gradient(RGBA(0, 0, 0, 0.4), RGBA(0, 0, 0, 0.4)), url('/images/home_banner.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "80px 0 100px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, background: `radial-gradient(circle, rgba(192,57,43,0.12) 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 520px" }}>
            <Badge text="Mumbai's #1 Corporate Party Platform" />
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 700, color: "#fff", lineHeight: 1.18, margin: "18px 0 14px" }}>
              Corporate Party in Mumbai?{" "}
              <span style={{ color: "#FF5252" }}>Get Venue Options in 30 Minutes.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#E0E0E0", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 500 }}>
              Tell us your team size, budget, and date. We shortlist the best lounges, banquets, and party venues in Mumbai — so you don't have to call 20 places.
            </p>
            <div style={{ display: "flex", gap: 18, marginTop: 24, alignItems: "center" }}>
              {[
                { label: "500+ Companies", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
                { label: "30-Min Turnaround", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
                { label: "100% Free", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
                { label: "WhatsApp Support", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L22 4z"></path></svg> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", color: "#E0E0E0", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
                  <span style={{ color: "#FF5252", display: "flex", alignItems: "center" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          {/* Form */}
          <div style={{ flex: "1 1 380px", background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 700, color: D }}>Get Venue Options Free</h3>
            <p style={{ margin: "0 0 22px", fontSize: 13, color: G }}>Free for HR & Admin teams. Options within 30 minutes.</p>
            {(
              [
                { label: "Event / Occasion", placeholder: "e.g. Annual Office Party", key: "event" },
                { label: "Preferred Location", placeholder: "e.g. Andheri, BKC, Powai", key: "location" },
                { label: "Event Date", placeholder: "Select date", key: "date", type: "date" },
              ] as { label: string; placeholder: string; key: "event" | "location" | "date"; type?: string }[]
            ).map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D, marginBottom: 5 }}>{f.label} *</label>
                <input type={f.type || "text"} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} style={{ width: "100%", padding: "11px 13px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
              </div>
            ))}
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: G, marginBottom: 18, cursor: "pointer" }}>
              <input type="checkbox" checked={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.checked })} style={{ accentColor: R }} />
              Send me venue details on WhatsApp
            </label>
            <button style={{ width: "100%", padding: "13px 0", background: R, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", boxShadow: "0 4px 14px rgba(192,57,43,0.2)" }}>
              NEXT STEPS →
            </button>
            <p style={{ fontSize: 11, color: "#999", textAlign: "center", margin: "10px 0 0" }}>By clicking, you accept our Terms & Conditions</p>
          </div>
        </div>
      </section>

      {/* ===== 2. WHY CHOOSE US ===== */}
      <Sec bg="#FAFAFA" id="why-us">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, margin: "0 0 8px" }}>Why HR Teams Choose <span style={{ color: R }}>BookMyCorporateParty</span></h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 480, margin: "0 auto" }}>Corporate-only. Curated. Handled end-to-end.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, title: "100% Corporate Focus", desc: "Not a wedding directory. Every venue vetted for office events." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>, title: "30-Minute Turnaround", desc: "Get 3–5 handpicked venues with pricing in 30 minutes." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, title: "Negotiated Rates", desc: "We negotiate directly. Better pricing than booking on your own." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, title: "Full Coordination", desc: "DJ, food, decor, branding, activities — one contact, start to finish." },
          ].map((b, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: `1px solid ${B}`, textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: R, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {b.icon}
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: D }}>{b.title}</h4>
              <p style={{ margin: 0, fontSize: 13, color: G, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== PREMIUM SCROLLING TICKER ===== */}
      <div style={{ background: R, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .ticker-content { display: flex; white-space: nowrap; animation: scrollTicker 30s linear infinite; width: max-content; }
        `}</style>
        <div className="ticker-content">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 60, paddingRight: 60 }}>
              {[
                "500+ Companies Served", "30-Min Venue Matching", "100% Free Service", 
                "DJ · Bar · AV Sorted", "Mumbai · Navi Mumbai · Thane", "Last-Minute Bookings"
              ].map((text, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#fff" }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>◆</span>
                  {text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== 3. VENUE CARDS ===== */}
      <Sec id="venues">
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <Badge text="Explore venue types" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "14px 0 8px" }}>
            Corporate Party Venues in <span style={{ color: R }}>Mumbai</span>
          </h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 480, margin: "0 auto" }}>
            Choose your venue type and submit your requirements. We'll shortlist the best options for your team.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
          {venues.map((v, i) => <VenueCard key={i} v={v} />)}
        </div>
        <p style={{ textAlign: "center", color: G, fontSize: 13, marginTop: 28 }}>
          📍 Andheri · BKC · Lower Parel · Powai · Bandra · Goregaon · Navi Mumbai · Thane
        </p>
      </Sec>

      {/* ===== 4. HOW IT WORKS (PEARL GRAY) ===== */}
      <Sec bg="#F5F5F7" id="how-it-works">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="HOW IT WORKS" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>
            From Enquiry to Event in <span style={{ color: R }}>5 Steps</span>
          </h2>
        </div>
        <div style={{ position: "relative", maxWidth: 1060, margin: "0 auto" }}>
          {/* Connecting Line (Dashed) */}
          <div style={{ position: "absolute", top: 26, left: "10%", right: "10%", height: 0, borderTop: `2px dashed ${B}`, zIndex: 0 }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            {[
              { t: "Share Details", d: "Event type, area, guest count, date, budget." },
              { t: "We Shortlist", d: "3–5 handpicked Mumbai venues, vetted for corporate." },
              { t: "Compare", d: "Photos, packages, pricing — side by side. Site visits on request." },
              { t: "Finalize", d: "Pick your venue. Confirm in 30 minutes." },
              { t: "We Coordinate", d: "Menu, DJ, decor, branding — handled until event day." },
            ].map((s, i) => (
              <div key={i} style={{ flex: "1 1 180px", textAlign: "center", transition: "transform 0.3s ease" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ width: 52, height: 52, background: R, color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, margin: "0 auto 20px", boxShadow: "0 8px 20px rgba(192,57,43,0.15)" }}>
                  {i + 1}
                </div>
                <h4 style={{ fontSize: 15.5, fontWeight: 700, margin: "0 0 10px", color: D, letterSpacing: "-0.2px" }}>{s.t}</h4>
                <p style={{ fontSize: 13, color: G, lineHeight: 1.7, margin: "0 auto", padding: "0 5px", maxWidth: 170 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ===== 5. THE COMPARISON BOARD (WHITE) ===== */}
      <Sec bg="#fff" id="comparison-board">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="The Comparison" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>Why HRs Prefer Our <span style={{ color: R }}>Streamlined</span> Process</h2>
        </div>
        
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 30 }}>
          {/* THE OLD WAY */}
          <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${B}`, padding: "40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#E5E7EB" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
              <div style={{ color: "#9CA3AF" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#6B7280", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>The Old Way</h3>
            </div>
            {[
              "Google 'corporate party venues Mumbai' — 50 random listings mixed with weddings",
              "Call each venue. Half don't pick up. Half don't do corporate.",
              "Compare pricing on WhatsApp, Excel, and sticky notes.",
              "Spend 2–3 weeks. Boss asks for cost breakdown — you don't have one."
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1D5DB", marginTop: 7, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* THE BMCP WAY */}
          <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${B}`, padding: "40px", position: "relative", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: R }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
              <div style={{ color: R }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: D, margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>The BMCP Way</h3>
            </div>
            {[
              "Share event details — team size, budget, vibe, date.",
              "Get 3–5 handpicked venues with pricing in 30 minutes.",
              "Compare side by side. Schedule a site visit if needed.",
              "Finalize fast. We coordinate until your event is done."
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={{ color: R, marginTop: 3, flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: D, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ===== 6. TESTIMONIALS (PEARL GRAY) ===== */}
      <Sec bg="#F5F5F7">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="Reviews" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>Trusted by <span style={{ color: R }}>500+ Companies</span></h2>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { q: "We needed a lounge in Andheri for 80 people with DJ and bar. BMCP sent 5 options the same day. Finalized in one call.", n: "Priya S.", r: "HR Manager, SaaS Company", a: "Andheri" },
            { q: "Our annual party used to take 3 weeks. This year — 3 days. They handled venue, food, DJ, everything.", n: "Rohan M.", r: "Admin Lead, Fintech Startup", a: "Navi Mumbai" },
            { q: "Sent one WhatsApp message. Got 4 venue options with pricing by evening. Booked a banquet in Powai for 200 people.", n: "Sneha K.", r: "People Ops, IT Services", a: "BKC" },
          ].map((t, i) => (
            <div key={i} style={{ flex: "1 1 300px", background: "#fff", border: `1px solid ${B}`, borderRadius: 16, padding: "32px 28px", maxWidth: 380, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p style={{ fontSize: 14.5, color: D, lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>
                "{t.q}"
              </p>
              <div style={{ borderTop: `1px solid ${B}`, paddingTop: 16 }}>
                <p style={{ fontSize: 13.5, color: D, margin: 0 }}><strong style={{ fontWeight: 700 }}>{t.n}</strong></p>
                <p style={{ fontSize: 12, color: G, margin: "2px 0 0" }}>{t.r}, {t.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 7. COMPARISON TABLE (WHITE) ===== */}
      <Sec bg="#fff" id="comparison">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="The Choice" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>BookMyCorporateParty vs Others</h2>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", borderRadius: 16, overflow: "hidden", border: `1px solid ${B}`, boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
          {/* Header Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.5fr", background: D, color: "#fff", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1px" }}>
            <div style={{ padding: "20px 24px" }}>Platform Focus</div>
            <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.05)", textAlign: "center", color: "#fff" }}>BookMyCorporateParty</div>
            <div style={{ padding: "20px 24px", textAlign: "center", opacity: 0.6 }}>Other Sites</div>
          </div>
          
          {[
            ["Audience Focus", "100% corporate events", "Weddings, birthdays, everything"],
            ["Shortlisting Speed", "Options in 30 minutes", "Browse listings yourself for days"],
            ["Venue Quality", "Handpicked & curated", "Open unverified marketplace"],
            ["Pricing Control", "Negotiated corporate rates", "Listed rack rates / call to know"],
            ["End-to-End Support", "DJ, Food, AV — all coordinated", "You coordinate with venue directly"],
            ["Last-Minute Booking", "Dedicated priority support", "No dedicated support team"],
            ["Site Inspection", "Arranged & coordinated", "Self-service only"],
          ].map(([feat, ours, theirs], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.5fr", background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: i === 6 ? "none" : `1px solid ${B}` }}>
              <div style={{ padding: "16px 24px", fontWeight: 600, fontSize: 14, color: D, display: "flex", alignItems: "center" }}>{feat}</div>
              
              {/* Our Column */}
              <div style={{ padding: "16px 24px", fontSize: 14, color: D, fontWeight: 700, background: "rgba(192,57,43,0.02)", borderLeft: `1px solid ${B}`, borderRight: `1px solid ${B}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#16A34A", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                {ours}
              </div>

              {/* Their Column */}
              <div style={{ padding: "16px 24px", fontSize: 13.5, color: G, display: "flex", alignItems: "center", gap: 10, textAlign: "center" }}>
                <div style={{ color: "#9CA3AF", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                {theirs}
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 8. FAQ (PEARL GRAY) ===== */}
      <Sec id="faq" bg="#F5F5F7">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="FAQ" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, margin: "10px 0 0" }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FAQItem q="Is there any charge for using BookMyCorporateParty?" a="No. Our service is completely free for HR and Admin teams. We earn through venue partnerships — you pay the venue directly. No middleman markup on your bill." />
          <FAQItem q="How fast can I finalize a corporate party venue in Mumbai?" a="In most cases, you can finalize within 30 minutes after reviewing our shortlisted options. For last-minute or urgent bookings, we provide priority support — subject to venue availability." />
          <FAQItem q="What types of corporate events can I book?" a="Annual office parties, team outings, R&R events, corporate offsites, Diwali and Christmas celebrations, award nights, client entertainment, product launches, startup celebrations, farewell get-togethers, and leadership retreats. If it's a corporate occasion, we cover it." />
          <FAQItem q="Can I book for a small team of 15–20 people?" a="Absolutely. Whether you're a 20-member startup or a 2,000+ employee company, we customize venue options to match your team size and budget. Cafes, lounges, and private dining rooms work perfectly for smaller teams." />
          <FAQItem q="What kind of venues do you have in Mumbai?" a="Lounges and nightclubs, fine dine restaurants, banquet halls, open lawns, rooftop spaces, cafes, resorts, and villas. Across areas like Andheri, BKC, Lower Parel, Powai, Bandra, Goregaon, Navi Mumbai, and Thane." />
          <FAQItem q="Do you only handle venue booking or full event planning?" a="Both. Apart from venue booking, we assist with food and beverage management, DJ and entertainment, stage setup, corporate branding, team-building activities, and end-to-end vendor coordination. One point of contact for everything." />
          <FAQItem q="Can I visit the venue before confirming?" a="Yes. We arrange site visits for corporate clients before you finalize the booking. Just let us know and we'll coordinate it." />
        </div>
      </Sec>

      {/* ===== 9. FINAL CTA (DIAMOND WHITE) ===== */}
      <section style={{ background: "#fff", padding: "80px 24px", textAlign: "center", position: "relative", borderTop: `1px solid ${B}` }}>
        <div style={{ maxWidth: 840, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: L, padding: "7px 18px", borderRadius: 30, color: R, fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 26, border: `1px solid ${B}` }}>
            The Mumbai Corporate Choice
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(34px, 5.5vw, 48px)", color: D, margin: "0 0 24px", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
            Your Team Deserves a Great Party.<br />
            <span style={{ color: R }}>You Deserve an Easy Booking.</span>
          </h2>
          <p style={{ fontSize: 18, color: G, margin: "0 auto 40px", lineHeight: 1.7, maxWidth: 640 }}>
            One enquiry. Curated Mumbai venues. Real pricing. <br />
            Shortlist and finalize everything in 30 minutes.
          </p>
          
          <button style={{ background: R, color: "#fff", border: "none", borderRadius: 12, padding: "20px 52px", fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", boxShadow: "0 12px 30px rgba(192,57,43,0.3)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            GET VENUE OPTIONS FREE →
          </button>
          
          <p style={{ fontSize: 13, color: G, marginTop: 18, marginBottom: 32 }}>
            Takes 60 seconds. Free for HR & Admin teams. No obligations.
          </p>

          <div style={{ color: G, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> 100% Free Service</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Trusted by 500+ HRs</span>
          </div>
        </div>
      </section>

      {/* ===== 10. EXECUTIVE FOOTER (BRAND RED THEME) ===== */}
      <footer style={{ background: R, padding: "80px 0 40px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap", marginBottom: 60 }}>
            {/* Logo & About */}
            <div style={{ flex: "2 1 300px" }}>
              <div style={{ marginBottom: 24 }}>
                <img src="/images/logo-lg.png" alt="BookMyCorporateParty" style={{ height: 52, width: "auto" }} />
              </div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: "0 0 28px", maxWidth: 320 }}>
                India's premier corporate party booking platform. One enquiry, 30-minute shortlisting, and zero-hassle execution for your team celebrations.
              </p>
              
              {/* Social Media Icons */}
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { name: "Instagram", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                  { name: "LinkedIn", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                  { name: "Facebook", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
                  { name: "X", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z M4 20l6.768 -6.768 M12.456 11.544l7.544 -7.544"></path></svg> },
                ].map((s, i) => (
                  <a key={i} href="#" style={{ color: "rgba(255,255,255,0.7)", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "none"; }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div style={{ flex: "1 1 140px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 800, marginBottom: 24, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>Venue Types</h4>
              {["Lounges & Clubs", "Fine Dine", "Banquets", "Cafes", "Open Lawns", "Resorts & Villas", "Catering"].map(v => (
                <p key={v} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 12px", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>{v}</p>
              ))}
            </div>

            <div style={{ flex: "1 1 140px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 800, marginBottom: 24, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>Mumbai Areas</h4>
              {["Andheri", "BKC", "Lower Parel", "Powai", "Bandra", "Goregaon", "Navi Mumbai", "Thane"].map(v => (
                <p key={v} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 12px", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>{v}</p>
              ))}
            </div>

            {/* Contact Details */}
            <div style={{ flex: "1.5 1 240px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 800, marginBottom: 24, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>Contact Us</h4>
              {[
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>, text: "+91 9333 74 9333" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L22 4z"></path></svg>, text: "WhatsApp Support" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, text: "info@bookmycorporateparty.com" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>, text: "Kharghar, Navi Mumbai" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>{c.icon}</div>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0 }}>
              © 2026 BookMyCorporateParty. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 30 }}>
              {["About Us", "Partner With Us", "Terms", "Privacy"].map(l => (
                <span key={l} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING VIP CONCIERGE (WHATSAPP) ===== */}
      <a href="https://wa.me/919333749333" target="_blank" rel="noopener noreferrer" style={{ position: "fixed", bottom: 32, right: 32, width: 64, height: 64, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(37,211,102,0.45)", zIndex: 1000, transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15) rotate(8deg)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path></svg>
      </a>
    </div>
  );
}
