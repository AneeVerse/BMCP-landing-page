import { useState, useEffect, useRef } from "react";

const R = "#C0392B";
const D = "#1A1A1A";
const L = "#FFF5F5";
const G = "#6B7280";
const B = "#E5E7EB";

function useFadeIn() {
  const ref = useRef(null);
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

function Sec({ children, bg = "#fff", id }) {
  const f = useFadeIn();
  return (
    <section ref={f.ref} style={{ ...f.style, background: bg, padding: "72px 0" }} id={id}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>{children}</div>
    </section>
  );
}

function Badge({ text }) {
  return <span style={{ display: "inline-block", background: L, color: R, fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, letterSpacing: 0.8, textTransform: "uppercase" }}>{text}</span>;
}

function FAQItem({ q, a }) {
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

function VenueCard({ v }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        border: `1px solid ${hover ? R : B}`,
        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s",
        boxShadow: hover ? "0 12px 32px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.03)",
        transform: hover ? "translateY(-4px)" : "none",
        cursor: "pointer", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ height: 175, overflow: "hidden", position: "relative", background: "#eee" }}>
        <img src={v.img} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s", transform: hover ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "30px 18px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
          <h4 style={{ margin: 0, color: "#fff", fontSize: 17, fontWeight: 700 }}>{v.name}</h4>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
          {v.tags.map((t, j) => (
            <span key={j} style={{ fontSize: 11, fontWeight: 600, color: R, background: L, padding: "3px 10px", borderRadius: 20, border: "1px solid #FECACA" }}>✓ {t}</span>
          ))}
        </div>
        <p style={{ fontSize: 13, color: G, lineHeight: 1.6, margin: "0 0 12px", flex: 1 }}>{v.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: D, fontWeight: 500, marginBottom: 14 }}>
          <span>👥</span> Capacity: <strong>{v.capacity}</strong>
        </div>
        <button style={{
          width: "100%", padding: "11px 0",
          background: hover ? R : "#fff", color: hover ? "#fff" : R,
          border: `2px solid ${R}`, borderRadius: 8, fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.25s",
        }}>
          Get Venue Options →
        </button>
      </div>
    </div>
  );
}

export default function BMCPLanding() {
  const [formData, setFormData] = useState({ event: "", location: "", date: "", whatsapp: true });

  const venues = [
    { name: "Lounges & Clubs", img: "https://images.unsplash.com/photo-1566417713940-fe7c7c98e5cd?w=600&h=360&fit=crop", tags: ["DJ & Music", "Bar Setup"], desc: "High-energy venues with DJ, bar, and dance floor — ideal for team parties, R&R nights, and celebrations.", capacity: "30–150 guests" },
    { name: "Banquet Halls", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=360&fit=crop", tags: ["Large Events", "AV Setup"], desc: "Spacious halls with stage, AV, and flexible seating — perfect for annual parties and award nights.", capacity: "100–1000+ guests" },
    { name: "Fine Dine", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=360&fit=crop", tags: ["Premium", "Client Dinners"], desc: "Elegant restaurants for leadership meets, client entertainment, and intimate corporate dinners.", capacity: "20–80 guests" },
    { name: "Cafes", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=360&fit=crop", tags: ["Casual", "Budget-Friendly"], desc: "Relaxed spaces for team lunches, farewell parties, and casual get-togethers with small groups.", capacity: "15–50 guests" },
    { name: "Open Lawns", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=360&fit=crop", tags: ["Outdoor", "Team Activities"], desc: "Open-air venues for team outings, fun days, and large events with space for games and stages.", capacity: "50–500+ guests" },
    { name: "Resorts & Villas", img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=360&fit=crop", tags: ["Offsites", "Weekend Getaway"], desc: "Destination venues near Mumbai for offsites, leadership retreats, and team-building stays.", capacity: "20–200 guests" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: D, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${B}`, padding: "12px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: R, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 15 }}>B</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: D }}>BookMyCorporateParty</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="tel:+919333749333" style={{ fontSize: 13, color: G, textDecoration: "none", fontWeight: 500 }}>📞 +91 9333 74 9333</a>
            <button style={{ background: R, color: "#fff", border: "none", borderRadius: 7, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* ===== 1. HERO + FORM ===== */}
      <section style={{ background: `linear-gradient(135deg, ${D} 0%, #2D1F1F 100%)`, padding: "72px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, background: `radial-gradient(circle, rgba(192,57,43,0.12) 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 520px" }}>
            <Badge text="Mumbai's #1 Corporate Party Platform" />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4.5vw, 46px)", fontWeight: 700, color: "#fff", lineHeight: 1.18, margin: "18px 0 14px" }}>
              Corporate Party in Mumbai?{" "}
              <span style={{ color: R }}>Get Venue Options in 30 Minutes.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#B0B0B0", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 500 }}>
              Tell us your team size, budget, and date. We shortlist the best lounges, banquets, and party venues in Mumbai — so you don't have to call 20 places.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {["✓ 500+ Companies", "⚡ 30-Min Turnaround", "🎯 100% Free", "📞 WhatsApp Support"].map(t => (
                <span key={t} style={{ color: "#ccc", fontSize: 13, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>
          {/* Form */}
          <div style={{ flex: "1 1 380px", background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 700, color: D }}>Get Venue Options Free</h3>
            <p style={{ margin: "0 0 22px", fontSize: 13, color: G }}>Free for HR & Admin teams. Options within 30 minutes.</p>
            {[
              { label: "Event / Occasion", placeholder: "e.g. Annual Office Party", key: "event" },
              { label: "Preferred Location", placeholder: "e.g. Andheri, BKC, Powai", key: "location" },
              { label: "Event Date", placeholder: "Select date", key: "date", type: "date" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: D, marginBottom: 5 }}>{f.label} *</label>
                <input type={f.type || "text"} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} style={{ width: "100%", padding: "11px 13px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
              </div>
            ))}
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: G, marginBottom: 18, cursor: "pointer" }}>
              <input type="checkbox" checked={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.checked })} style={{ accentColor: R }} />
              Send me venue details on WhatsApp
            </label>
            <button style={{ width: "100%", padding: "13px 0", background: R, color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 14px rgba(192,57,43,0.2)" }}>
              NEXT STEPS →
            </button>
            <p style={{ fontSize: 11, color: "#999", textAlign: "center", margin: "10px 0 0" }}>By clicking, you accept our Terms & Conditions</p>
          </div>
        </div>
      </section>

      {/* ===== 2. WHY CHOOSE US ===== */}
      <Sec bg="#FAFAFA">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, margin: "0 0 8px" }}>Why HR Teams Choose <span style={{ color: R }}>BookMyCorporateParty</span></h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 480, margin: "0 auto" }}>Corporate-only. Curated. Handled end-to-end.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: "🎯", title: "100% Corporate Focus", desc: "Not a wedding directory. Every venue vetted for office events." },
            { icon: "⚡", title: "30-Minute Turnaround", desc: "Get 3–5 handpicked venues with pricing in 30 minutes." },
            { icon: "💰", title: "Negotiated Rates", desc: "We negotiate directly. Better pricing than booking on your own." },
            { icon: "🤝", title: "Full Coordination", desc: "DJ, food, decor, branding, activities — one contact, start to finish." },
          ].map((b, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: `1px solid ${B}`, textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{b.icon}</div>
              <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700 }}>{b.title}</h4>
              <p style={{ margin: 0, fontSize: 13, color: G, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== SCROLLING TRUST BAR ===== */}
      <div style={{ background: D, padding: "14px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 48, animation: "scrollBar 22s linear infinite" }}>
          {[...Array(2)].flatMap(() => ["500+ Companies Served", "30-Min Venue Matching", "Free for HR Teams", "DJ · Bar · AV Sorted", "Mumbai · Navi Mumbai · Thane", "Last-Minute Bookings OK", "Site Visits Arranged"]).map((t, i) => (
            <span key={i} style={{ color: "#888", fontSize: 13, fontWeight: 500 }}>
              <span style={{ color: R, marginRight: 8 }}>★</span>{t}
            </span>
          ))}
        </div>
        <style>{`@keyframes scrollBar { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* ===== 3. VENUE CARDS ===== */}
      <Sec>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge text="Explore venue types" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, margin: "14px 0 8px" }}>
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

      {/* ===== 4. HOW IT WORKS ===== */}
      <Sec bg="#FAFAFA">
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Badge text="How it works" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, margin: "14px 0 0" }}>From Enquiry to Event in <span style={{ color: R }}>5 Steps</span></h2>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { n: "1", t: "Share Details", d: "Event type, area, guest count, date, budget." },
            { n: "2", t: "We Shortlist", d: "3–5 handpicked Mumbai venues, vetted for corporate." },
            { n: "3", t: "Compare", d: "Photos, packages, pricing — side by side. Site visits on request." },
            { n: "4", t: "Finalize", d: "Pick your venue. Confirm in 30 minutes." },
            { n: "5", t: "We Coordinate", d: "Menu, DJ, decor, branding — handled until event day." },
          ].map((s, i) => (
            <div key={i} style={{ flex: "1 1 180px", maxWidth: 200, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: R, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, margin: "0 auto 12px" }}>{s.n}</div>
              <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{s.t}</h4>
              <p style={{ margin: 0, fontSize: 13, color: G, lineHeight: 1.55 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 5. OLD vs NEW ===== */}
      <Sec>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 480px", background: "#FEF2F2", borderRadius: 16, padding: 32, border: "1px solid #FECACA" }}>
            <h3 style={{ color: "#DC2626", fontSize: 18, margin: "0 0 18px", fontWeight: 700 }}>❌ The Old Way</h3>
            {["Google 'corporate party venues Mumbai' — 50 random listings mixed with weddings", "Call each venue. Half don't pick up. Half don't do corporate.", "Compare pricing on WhatsApp, Excel, and sticky notes.", "Spend 2–3 weeks. Boss asks for cost breakdown — you don't have one."].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ color: "#DC2626", flexShrink: 0 }}>•</span>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#7F1D1D" }}>{t}</p>
              </div>
            ))}
          </div>
          <div style={{ flex: "1 1 480px", background: "#F0FDF4", borderRadius: 16, padding: 32, border: "1px solid #BBF7D0" }}>
            <h3 style={{ color: "#16A34A", fontSize: 18, margin: "0 0 18px", fontWeight: 700 }}>✓ The BMCP Way</h3>
            {["Share event details — team size, budget, vibe, date.", "Get 3–5 handpicked venues with pricing in 30 minutes.", "Compare side by side. Schedule a site visit if needed.", "Finalize fast. We coordinate until your event is done."].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ color: "#16A34A", flexShrink: 0 }}>✓</span>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#14532D" }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ===== 6. TESTIMONIALS ===== */}
      <Sec bg="#FAFAFA">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Badge text="What HR teams say" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, margin: "14px 0 0" }}>Trusted by <span style={{ color: R }}>500+ Companies</span></h2>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { q: "We needed a lounge in Andheri for 80 people with DJ and bar. BMCP sent 5 options the same day. Finalized in one call.", n: "Priya S.", r: "HR Manager, SaaS Company", a: "Andheri" },
            { q: "Our annual party used to take 3 weeks. This year — 3 days. They handled venue, food, DJ, everything.", n: "Rohan M.", r: "Admin Lead, Fintech Startup", a: "Navi Mumbai" },
            { q: "Sent one WhatsApp message. Got 4 venue options with pricing by evening. Booked a banquet in Powai for 200 people.", n: "Sneha K.", r: "People Ops, IT Services", a: "BKC" },
          ].map((t, i) => (
            <div key={i} style={{ flex: "1 1 300px", background: "#fff", border: `1px solid ${B}`, borderRadius: 14, padding: 26, minWidth: 280 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FBBF24", fontSize: 16 }}>★</span>)}</div>
              <p style={{ fontSize: 14, color: D, lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic" }}>"{t.q}"</p>
              <p style={{ fontSize: 13, color: G, margin: 0 }}><strong style={{ color: D }}>{t.n}</strong> — {t.r}, {t.a}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 7. COMPARISON TABLE ===== */}
      <Sec>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge text="Why us" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "14px 0 0" }}>BookMyCorporateParty vs Generic Venue Sites</h2>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${B}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: D, color: "#fff", fontWeight: 700, fontSize: 13 }}>
            <div style={{ padding: "12px 16px" }}></div>
            <div style={{ padding: "12px 16px", borderLeft: "1px solid #333", color: R }}>BookMyCorporateParty</div>
            <div style={{ padding: "12px 16px", borderLeft: "1px solid #333" }}>Other Platforms</div>
          </div>
          {[
            ["Focus", "100% corporate events", "Weddings + birthdays + corporate mixed"],
            ["Speed", "Curated options in 30 min", "Browse 100s of listings yourself"],
            ["Venue quality", "Handpicked & vetted", "Open marketplace"],
            ["Pricing", "Negotiated rates + breakdown", "Per-plate range, details later"],
            ["Event support", "DJ, food, decor — handled", "You deal with venue directly"],
            ["Last-minute", "Priority support", "No dedicated support"],
            ["Site visits", "Arranged on request", "Self-service only"],
          ].map(([f, b, vl], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: i % 2 === 0 ? "#FAFAFA" : "#fff", borderBottom: `1px solid ${B}` }}>
              <div style={{ padding: "12px 16px", fontWeight: 600, fontSize: 13, color: D }}>{f}</div>
              <div style={{ padding: "12px 16px", fontSize: 13, color: D, borderLeft: `1px solid ${B}` }}><span style={{ color: "#16A34A", marginRight: 5 }}>✓</span>{b}</div>
              <div style={{ padding: "12px 16px", fontSize: 13, color: G, borderLeft: `1px solid ${B}` }}><span style={{ color: "#DC2626", marginRight: 5 }}>✗</span>{vl}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 8. FAQ ===== */}
      <Sec bg="#FAFAFA" id="faq">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge text="FAQ" />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: "14px 0 0" }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FAQItem q="Is there any charge for using BookMyCorporateParty?" a="No. Completely free for HR and Admin teams. We earn through venue partnerships — you pay the venue directly. No middleman markup." />
          <FAQItem q="How fast can I finalize a venue in Mumbai?" a="Within 30 minutes after reviewing our shortlisted options. For last-minute bookings, we provide priority support — subject to availability." />
          <FAQItem q="What corporate events can I book?" a="Annual parties, team outings, R&R events, offsites, Diwali/Christmas celebrations, award nights, client dinners, product launches, startup celebrations, farewell parties, and leadership retreats." />
          <FAQItem q="Can I book for a small team of 15–20 people?" a="Absolutely. Cafes, lounges, and private dining rooms work great for smaller groups. We customize options for 20-member startups to 2,000+ employee companies." />
          <FAQItem q="What venues do you have in Mumbai?" a="Lounges, nightclubs, fine dine, banquets, open lawns, rooftops, cafes, resorts, and villas — across Andheri, BKC, Lower Parel, Powai, Bandra, Goregaon, Navi Mumbai, and Thane." />
          <FAQItem q="Do you handle full event planning?" a="Yes. Food & beverage, DJ, stage, branding, team-building activities, vendor coordination — all managed. One contact for everything." />
          <FAQItem q="Can I visit the venue before confirming?" a="Yes. We arrange site visits for corporate clients before finalizing. Just let us know." />
        </div>
      </Sec>

      {/* ===== 9. FINAL CTA ===== */}
      <section style={{ background: `linear-gradient(135deg, ${D} 0%, #2D1F1F 100%)`, padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", color: "#fff", margin: "0 0 14px", lineHeight: 1.25 }}>
            Your Team Deserves a Great Party.{" "}
            <span style={{ color: R }}>You Deserve an Easy Booking.</span>
          </h2>
          <p style={{ fontSize: 16, color: "#B0B0B0", margin: "0 0 28px", lineHeight: 1.6 }}>One enquiry. Curated Mumbai venues. Real pricing. No cold calls. Finalize in 30 minutes.</p>
          <button style={{ background: R, color: "#fff", border: "none", borderRadius: 8, padding: "16px 40px", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 24px rgba(192,57,43,0.25)" }}>
            Get Venue Options Free →
          </button>
          <p style={{ fontSize: 12, color: "#777", marginTop: 14 }}>Takes 60 seconds. Free for HR & Admin teams. No obligations.</p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: D, padding: "44px 0 28px", borderTop: "1px solid #333" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 28 }}>
            <div style={{ flex: "1 1 260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, background: R, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>B</div>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>BookMyCorporateParty</span>
              </div>
              <p style={{ fontSize: 12, color: "#999", lineHeight: 1.7, margin: 0 }}>India's corporate party booking platform.<br />One enquiry. Multiple venue options. Zero hassle.</p>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Venue Types</h4>
              {["Lounges & Clubs", "Fine Dine", "Banquets", "Cafes", "Open Lawns", "Resorts & Villas", "Catering"].map(v => <p key={v} style={{ color: "#999", fontSize: 12, margin: "0 0 6px" }}>{v}</p>)}
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Mumbai Areas</h4>
              {["Andheri", "BKC", "Lower Parel", "Powai", "Bandra", "Goregaon", "Navi Mumbai", "Thane"].map(v => <p key={v} style={{ color: "#999", fontSize: 12, margin: "0 0 6px" }}>{v}</p>)}
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Contact</h4>
              <p style={{ color: "#999", fontSize: 12, margin: "0 0 6px" }}>📞 +91 9333 74 9333</p>
              <p style={{ color: "#999", fontSize: 12, margin: "0 0 6px" }}>💬 WhatsApp: +91 9333 74 9333</p>
              <p style={{ color: "#999", fontSize: 12, margin: "0 0 6px" }}>✉️ info@bookmycorporateparty.com</p>
              <p style={{ color: "#999", fontSize: 12, margin: "0 0 6px" }}>📍 Kharghar, Navi Mumbai</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <p style={{ color: "#666", fontSize: 11, margin: 0 }}>© 2026 BookMyCorporateParty. All rights reserved.</p>
            <div style={{ display: "flex", gap: 18 }}>{["About Us", "Partner With Us", "Terms", "Privacy"].map(l => <span key={l} style={{ color: "#666", fontSize: 11, cursor: "pointer" }}>{l}</span>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
