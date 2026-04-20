import { useState, useEffect, useRef, useCallback } from "react";

const THEMES = {
  dark: {
    bg: "#1e1a14", surface: "#26211a", card: "#2e2820", cardHover: "#38302a",
    border: "#4a3e2e", borderHover: "#6a5a40",
    text: "#ede0c8", textMuted: "#a89070", textFaint: "#786050",
    accent: "#c4a882", accentHover: "#d4b892", accentLight: "rgba(196,168,130,0.15)",
    success: "#8aab7a",
    warning: "#c4855a", warningBg: "#2e1a10",

    gold: "#d4a84b", goldBg: "rgba(212,168,75,0.1)",
    tag: "#2a2016", tagText: "#c8a96e",
    input: "#18140e", inputBorder: "#4a3e2e",
    navBg: "rgba(28,24,18,0.97)",
    shadow: "0 4px 24px rgba(0,0,0,0.5)",
    shadowHover: "0 8px 32px rgba(196,168,130,0.2)",
    skeletonShine: "#3a3028",
  },
  light: {
    bg: "#f0e8d8", surface: "#faf4e8", card: "#fffbf2", cardHover: "#fdf5e0",
    border: "#d8c8a8", borderHover: "#b8a888",
    text: "#2e2010", textMuted: "#6a5040", textFaint: "#a09070",
    accent: "#8b6a3e", accentHover: "#6e5030", accentLight: "rgba(139,106,62,0.1)",
    success: "#4a8a5a",
    warning: "#b05a28", warningBg: "#faeadc",

    gold: "#b8860b", goldBg: "rgba(184,134,11,0.1)",
    tag: "#e8d8b8", tagText: "#5a4020",
    input: "#f5ede0", inputBorder: "#d0b890",
    navBg: "rgba(240,235,224,0.97)",
    shadow: "0 4px 20px rgba(100,80,50,0.15)",
    shadowHover: "0 8px 32px rgba(139,106,62,0.2)",
    skeletonShine: "#ece0c4",
  }
};

const ThemeCtx = { listeners: [], current: "dark" };

function useTheme() {
  const [mode, setMode] = useState(() => ThemeCtx.current);
  useEffect(() => {
    const fn = (m) => setMode(m);
    ThemeCtx.listeners.push(fn);
    return () => { ThemeCtx.listeners = ThemeCtx.listeners.filter(f => f !== fn); };
  }, []);
  return { mode, th: THEMES[mode] };
}

// ─── HOTELS BLOCK (mehrere Hotels) ──────────────────────────────────────────
function HotelsBlock({ hotels, setHotels, lang, th, tripDays }) {
  const [expanded, setExpanded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name:"", address:"", checkIn:"", checkOut:"", nights:"", price:"", confirmation:"" });

  const addHotel = () => {
    if (!form.name.trim()) return;
    const h = { ...form, id: Date.now() };
    setHotels(prev => [...(prev||[]), h]);
    setForm({ name:"", address:"", checkIn:"", checkOut:"", nights:"", price:"", confirmation:"" });
    setAdding(false);
  };
  const removeHotel = (id) => setHotels(prev => (prev||[]).filter(h => h.id !== id));

  const inp = (field, placeholder, type="text") => (
    <input type={type} placeholder={placeholder} value={form[field]}
      onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
      style={{ background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"6px 10px", fontSize:"0.82rem", color:th.text, width:"100%", marginBottom:6 }} />
  );

  return (
    <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }} onClick={()=>setExpanded(e=>!e)}>
        <div>
          <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase" }}>🏨 {lang==="de"?"Unterkunft":"Accommodation"}</div>
          <div style={{ fontSize:"0.8rem", color:th.textMuted, marginTop:3 }}>
            {(hotels||[]).length === 0
              ? (lang==="de"?"Noch kein Hotel eingetragen":"No hotel added yet")
              : (lang==="de"?`${hotels.length} Hotel${hotels.length>1?"s":""} eingetragen`:`${hotels.length} hotel${hotels.length>1?"s":""} added`)}
          </div>
        </div>
        <span style={{ color:th.textFaint, fontSize:"0.9rem" }}>{expanded?"▲":"▼"}</span>
      </div>

      {expanded && (
        <div style={{ marginTop:14 }}>
          {(hotels||[]).map((h, i) => (
            <div key={h.id} style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:12, padding:"12px 14px", marginBottom:10, position:"relative" }}>
              <button onClick={()=>removeHotel(h.id)} style={{ position:"absolute", top:8, right:10, background:"none", border:"none", color:th.textFaint, cursor:"pointer", fontSize:"0.9rem" }}>✕</button>
              <div style={{ fontWeight:700, color:th.accent, fontSize:"0.9rem", marginBottom:4 }}>🏨 {h.name}</div>
              {h.address && <div style={{ fontSize:"0.75rem", color:th.textMuted }}>📍 {h.address}</div>}
              <div style={{ display:"flex", gap:16, marginTop:6, flexWrap:"wrap" }}>
                {h.checkIn && <div style={{ fontSize:"0.75rem", color:th.textMuted }}>📅 {lang==="de"?"Check-in":"Check-in"}: <b style={{color:th.text}}>{h.checkIn}</b></div>}
                {h.checkOut && <div style={{ fontSize:"0.75rem", color:th.textMuted }}>📅 {lang==="de"?"Check-out":"Check-out"}: <b style={{color:th.text}}>{h.checkOut}</b></div>}
                {h.nights && <div style={{ fontSize:"0.75rem", color:th.textMuted }}>🌙 {h.nights} {lang==="de"?"Nächte":"nights"}</div>}
                {h.price && <div style={{ fontSize:"0.75rem", color:th.textMuted }}>💶 {h.price}</div>}
                {h.confirmation && <div style={{ fontSize:"0.75rem", color:th.textMuted }}>🔖 {h.confirmation}</div>}
              </div>
            </div>
          ))}

          {adding ? (
            <div style={{ background:th.surface, border:`1px solid ${th.accent}`, borderRadius:12, padding:"14px" }}>
              <div style={{ fontSize:"0.72rem", color:th.textFaint, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>{lang==="de"?"Neues Hotel":"New Hotel"}</div>
              {inp("name", lang==="de"?"Hotelname *":"Hotel name *")}
              {inp("address", lang==="de"?"Adresse":"Address")}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {inp("checkIn", "Check-in", "date")}
                {inp("checkOut", "Check-out", "date")}
                {inp("nights", lang==="de"?"Nächte":"Nights")}
                {inp("price", lang==="de"?"Preis":"Price")}
              </div>
              {inp("confirmation", lang==="de"?"Buchungsnummer":"Confirmation #")}
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button onClick={addHotel} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:9, padding:"7px 18px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer" }}>
                  {lang==="de"?"Hinzufügen":"Add"}
                </button>
                <button onClick={()=>setAdding(false)} style={{ background:"none", border:`1px solid ${th.border}`, borderRadius:9, padding:"7px 14px", color:th.textMuted, fontSize:"0.82rem", cursor:"pointer" }}>
                  {lang==="de"?"Abbrechen":"Cancel"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={()=>setAdding(true)} style={{ background:th.accentLight, border:`1px dashed ${th.accent}`, borderRadius:10, padding:"8px 18px", color:th.accent, fontWeight:700, fontSize:"0.82rem", cursor:"pointer", width:"100%", marginTop:4 }}>
              + {lang==="de"?"Hotel hinzufügen":"Add hotel"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TRIP SUMMARY DOC ────────────────────────────────────────────────────────
function TripSummaryDoc({ lang, th, locations, locationDays, locationNotes, locationTimes, tripDays, city, startDate, endDate, numDays, hotels }) {
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState(null);
  const [apiKey, setApiKey] = useState(() => safeLocalGet("rp_openai_key", ""));
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang];

  const assignedLocs = (locations||[]).filter(l => locationDays?.[l.id]);
  const packingItems = safeLocalGet("rp_packing", {});
  const dayNotes = safeLocalGet("rp_day_notes", {});
  const hasHotels = (hotels||[]).length > 0;
  const hasPacking = Object.values(packingItems).some(arr => arr && arr.length > 0);
  const hasDayNotes = Object.values(dayNotes).some(n => n && n.trim());

  const buildPrompt = () => {
    const lines = [];
    const cityName = city?.name || "?";
    lines.push(`Erstelle eine umfangreiche, schön formatierte Reisezusammenfassung auf ${lang==="de"?"Deutsch":"Englisch"} für folgende Reise:`);
    lines.push(`
🗺️ REISE: ${cityName} | ${startDate} – ${endDate} | ${numDays} Tage`);

    if (hasHotels) {
      lines.push("\n🏨 UNTERKUNFT:");
      (hotels||[]).forEach(h => {
        lines.push(`  • ${h.name}${h.address ? " | "+h.address : ""}${h.checkIn ? " | Check-in: "+h.checkIn : ""}${h.checkOut ? " | Check-out: "+h.checkOut : ""}${h.nights ? " | "+h.nights+" Nächte" : ""}${h.price ? " | "+h.price : ""}${h.confirmation ? " | Buchung: "+h.confirmation : ""}`);
      });
    }

    lines.push("\n📍 ORTE PRO TAG:");
    tripDays.forEach((day, di) => {
      const dayLocs = assignedLocs.filter(l => locationDays[l.id] === day);
      if (!dayLocs.length) return;
      lines.push(`
Tag ${di+1} (${formatDateLabel(day, lang)} – ${day}):`)
      dayLocs.forEach(loc => {
        const note = locationNotes?.[loc.id];
        const time = locationTimes?.[loc.id];
        const cost = city?.entryCosts?.[loc.name];
        const rating = city?.ratings?.[loc.name];
        const info = city?.locationInfo?.[loc.name];
        lines.push(`  ${loc.icon||"📍"} ${loc.name}${time ? " um "+time : ""}${loc.duration ? " (ca. "+loc.duration+")" : ""}`);
        if (info?.short) lines.push(`     → ${info.short}`);
        if (info?.highlights?.length) lines.push(`     Highlights: ${info.highlights.join(", ")}`);
        if (cost) lines.push(`     Eintritt: ${cost.currency}${cost.min}${cost.min!==cost.max?"–"+cost.currency+cost.max:""} ${cost.note||""}`)
        if (rating) lines.push(`     Bewertung: ⭐ ${rating.stars} (${(rating.reviews/1000).toFixed(0)}k) | ${rating.price||""} | ${rating.badge||""}`)
        if (note) lines.push(`     📝 Notiz: ${note}`);
      });
    });

    const unassigned = (locations||[]).filter(l => !locationDays?.[l.id]);
    if (unassigned.length > 0) {
      lines.push("\n📌 NICHT ZUGEWIESENE ORTE:");
      unassigned.forEach(l => lines.push(`  • ${l.icon||""} ${l.name}`));
    }

    if (hasPacking) {
      lines.push("\n🧳 PACKLISTE:");
      Object.entries(packingItems).forEach(([cat, items]) => {
        if (!items?.length) return;
        lines.push(`  ${cat}: ${items.map(i=>i.text||"").join(", ")}`);
      });
    }

    if (hasDayNotes) {
      lines.push("\n📝 TAGESNOTIZEN:");
      Object.entries(dayNotes).forEach(([day, note]) => {
        if (!note?.trim()) return;
        lines.push(`  ${day}: ${note}`);
      });
    }

    lines.push("\n🌤️ WETTERPROGNOSE:");
    lines.push(`  Hinweis: Echte Wetterdaten sind in dieser App nicht verfügbar. Bitte schreibe für jeden Reisetag 'Wetterprognose: nicht verfügbar' – außer du hast allgemeines Klimawissen für ${cityName} im ${new Date(startDate).toLocaleString(lang==="de"?"de-DE":"en-US",{month:"long"})} (dann kurze Klimainfo).`);

    lines.push("\n---");
    lines.push(`Strukturiere die Zusammenfassung schön mit Emojis, Überschriften und Abschnitten. Beginne mit einem Reise-Header mit Banner. Mache es umfangreich, informativ und reiseführerartig. Füge am Ende eine 'Wichtige Hinweise & Tipps' Sektion hinzu. Nur Inhalte einbeziehen, die oben angegeben sind – nichts erfinden.`);
    return lines.join("\n");
  };

  const generate = async () => {
    if (!apiKey) { setShowKeyInput(true); return; }
    setGenerating(true);
    setSummary(null);
    try {
      const prompt = buildPrompt();
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setSummary(data.choices?.[0]?.message?.content || "");
    } catch (e) {
      setSummary(`❌ Fehler: ${e.message}`);
    }
    setGenerating(false);
  };

  const copyText = () => {
    try { navigator.clipboard.writeText(summary); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printSummary = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const cityName = city?.name || "Reise";
    win.document.write(`<!DOCTYPE html><html><head><meta charset='utf-8'><title>Reisezusammenfassung ${cityName}</title><style>
      body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 30px; color: #2e2010; line-height: 1.7; }
      h1 { background: linear-gradient(135deg, #c4a882, #d4a84b); color: #1e1a14; padding: 20px 30px; border-radius: 12px; font-size: 1.6rem; margin-bottom: 8px; }
      .subtitle { color: #786050; font-size: 0.9rem; margin-bottom: 30px; padding: 0 4px; }
      pre { white-space: pre-wrap; font-family: Georgia, serif; font-size: 0.92rem; }
      @media print { body { margin: 20px; } }
    </style></head><body>
      <h1>${city?.emoji||"✈️"} Reiseplaner – ${cityName}</h1>
      <div class='subtitle'>${startDate} – ${endDate} · ${numDays} Tage · Erstellt am ${new Date().toLocaleDateString(lang==="de"?"de-DE":"en-US")}</div>
      <pre>${(summary||"")
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
        .replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")
        .replace(/^# (.+)$/gm,"<h2>$1</h2>")
        .replace(/^## (.+)$/gm,"<h3>$1</h3>")
        .replace(/^### (.+)$/gm,"<h4>$1</h4>")
      }</pre>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      {/* HEADER CARD */}
      <div style={{ background:`linear-gradient(135deg, ${th.gold}22, ${th.accent}18)`, border:`1.5px solid ${th.gold}`, borderRadius:18, padding:"20px 22px" }}>
        <div style={{ fontSize:"1.4rem", marginBottom:6 }}>🧾</div>
        <div style={{ fontWeight:800, fontSize:"1.1rem", color:th.gold, marginBottom:6 }}>
          {lang==="de"?"KI-Reisezusammenfassung":"AI Travel Summary"}
        </div>
        <div style={{ fontSize:"0.82rem", color:th.textMuted, lineHeight:1.7, marginBottom:14 }}>
          {lang==="de"
            ? `Die KI erstellt dir eine vollständige, druckfertige Reisezusammenfassung für ${city?.name||"deine Reise"} – mit Tagesplan, Sehenswürdigkeiten, Hotel, Wetter, Packliste und Tipps.`
            : `The AI creates a complete, print-ready travel summary for ${city?.name||"your trip"} – with daily plan, sights, hotel, weather, packing list and tips.`}
        </div>

        {/* INHALT PREVIEW */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
          {[{icon:"📍",de:`${assignedLocs.length} Orte`,en:`${assignedLocs.length} places`},{icon:"📅",de:`${numDays} Tage`,en:`${numDays} days`},{icon:"🏨",de:`${(hotels||[]).length} Hotel${(hotels||[]).length!==1?"s":""}`,en:`${(hotels||[]).length} hotel${(hotels||[]).length!==1?"s":""}`,show:(hotels||[]).length>0},{icon:"🧳",de:"Packliste",en:"Packing list",show:hasPacking},{icon:"📝",de:"Tagesnotizen",en:"Day notes",show:hasDayNotes},{icon:"🌤️",de:"Wetter",en:"Weather",show:true}].filter(x=>x.show!==false).map(item=>(
            <div key={item.icon} style={{ background:th.accentLight, border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 10px", fontSize:"0.75rem", color:th.accent, fontWeight:600 }}>
              {item.icon} {lang==="de"?item.de:item.en}
            </div>
          ))}
        </div>

        {showKeyInput && (
          <div style={{ marginBottom:12, background:th.card, borderRadius:10, padding:"10px 12px", border:`1px solid ${th.inputBorder}` }}>
            <div style={{ fontSize:"0.72rem", color:th.textFaint, marginBottom:6 }}>🔑 OpenAI API-Key</div>
            <div style={{ display:"flex", gap:8 }}>
              <input type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)}
                placeholder="sk-..." style={{ flex:1, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"6px 10px", fontSize:"0.82rem", color:th.text }} />
              <button onClick={()=>{safeLocalSet("rp_openai_key",apiKey);setShowKeyInput(false);}} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:8, padding:"6px 14px", fontWeight:700, cursor:"pointer", fontSize:"0.82rem" }}>
                {lang==="de"?"Speichern":"Save"}
              </button>
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={generate} disabled={generating || assignedLocs.length===0} style={{
            background: generating||assignedLocs.length===0 ? th.border : `linear-gradient(135deg, ${th.gold}, ${th.accent})`,
            color: generating||assignedLocs.length===0 ? th.textFaint : th.bg,
            border:"none", borderRadius:11, padding:"10px 24px",
            fontWeight:800, fontSize:"0.9rem", cursor: generating||assignedLocs.length===0 ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", gap:8,
            boxShadow: generating||assignedLocs.length===0 ? "none" : `0 4px 16px ${th.gold}44`,
          }}>
            {generating ? <><Spinner size={16} color={th.textMuted} />{lang==="de"?" Wird erstellt...":" Generating..."}</> : `✨ ${lang==="de"?"Zusammenfassung erstellen":"Create Summary"}`}
          </button>
          {!apiKey && (
            <button onClick={()=>setShowKeyInput(v=>!v)} style={{ background:"none", border:`1px solid ${th.border}`, borderRadius:10, padding:"8px 14px", color:th.textMuted, fontSize:"0.8rem", cursor:"pointer" }}>
              🔑 API-Key
            </button>
          )}
          {apiKey && (
            <button onClick={()=>setShowKeyInput(v=>!v)} style={{ background:th.accentLight, border:`1px solid ${th.border}`, borderRadius:10, padding:"8px 14px", color:th.accent, fontSize:"0.8rem", cursor:"pointer", fontWeight:700 }}>
              🔑 {lang==="de"?"API aktiv ✓":"API active ✓"}
            </button>
          )}
        </div>

        {assignedLocs.length===0 && (
          <div style={{ fontSize:"0.75rem", color:th.warning, marginTop:8 }}>
            ⚠ {lang==="de"?"Bitte zuerst Orte einem Tag zuweisen.":"Please assign places to days first."}
          </div>
        )}
      </div>

      {/* RESULT */}
      {summary && (
        <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, overflow:"hidden" }}>
          {/* Druckbarer Header */}
          <div style={{ background:`linear-gradient(135deg, ${th.gold}33, ${th.accent}22)`, padding:"16px 20px", borderBottom:`1px solid ${th.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:"1rem", color:th.gold }}>{city?.emoji||"✈️"} Reiseplaner · {city?.name||""}</div>
              <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:2 }}>{startDate} – {endDate} · {numDays} {lang==="de"?"Tage":"days"}</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={copyText} style={{ background:copied?th.success:th.accentLight, color:copied?"#fff":th.accent, border:`1px solid ${th.border}`, borderRadius:9, padding:"6px 14px", fontSize:"0.78rem", fontWeight:700, cursor:"pointer" }}>
                {copied?(lang==="de"?"✓ Kopiert!":"✓ Copied!"):(lang==="de"?"📋 Kopieren":"📋 Copy")}
              </button>
              <button onClick={printSummary} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:9, padding:"6px 14px", fontSize:"0.78rem", fontWeight:700, cursor:"pointer" }}>
                🖨️ {lang==="de"?"Drucken / PDF":"Print / PDF"}
              </button>
            </div>
          </div>
          <div style={{ padding:"18px 20px", whiteSpace:"pre-wrap", fontSize:"0.84rem", color:th.text, lineHeight:1.8, maxHeight:600, overflowY:"auto" }}>
            {summary.split("\n").map((line, i) => {
              if (line.startsWith("# ")) return <div key={i} style={{ fontWeight:800, fontSize:"1.1rem", color:th.gold, marginTop:16, marginBottom:4 }}>{line.slice(2)}</div>;
              if (line.startsWith("## ")) return <div key={i} style={{ fontWeight:700, fontSize:"0.95rem", color:th.accent, marginTop:12, marginBottom:3 }}>{line.slice(3)}</div>;
              if (line.startsWith("### ")) return <div key={i} style={{ fontWeight:700, fontSize:"0.88rem", color:th.text, marginTop:8, marginBottom:2 }}>{line.slice(4)}</div>;
              if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight:700, color:th.accent }}>{line.slice(2,-2)}</div>;
              if (line.trim()==="---" || line.trim()==="─────────────────") return <hr key={i} style={{ border:"none", borderTop:`1px solid ${th.border}`, margin:"12px 0" }} />;
              return <div key={i}>{line || <br/>}</div>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PWAInstallBanner({ lang, th }) {
  const [prompt, setPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => safeLocalGet("rp_pwa_dismissed", false));

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  const handleDismiss = () => { setDismissed(true); safeLocalSet("rp_pwa_dismissed", true); };

  if (installed || dismissed) return null;

  const isIOS = typeof navigator !== "undefined" && new RegExp("iphone|ipad|ipod","i").test(navigator.userAgent);
  const isStandalone = typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches;
  if (isStandalone) return null;

  if (!prompt && !isIOS) return null;

  return (
    <div style={{ background: th.accentLight, border: `1px solid ${th.accent}`, borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <span style={{ fontSize: "1.4rem" }}>📲</span>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: th.accent }}>
          {lang === "de" ? "App installieren" : "Install App"}
        </div>
        <div style={{ fontSize: "0.72rem", color: th.textMuted, marginTop: 2 }}>
          {isIOS
            ? (lang === "de" ? "Tippe auf Teilen → \"Zum Home-Bildschirm\"" : "Tap Share → \"Add to Home Screen\"")
            : (lang === "de" ? "Offline nutzbar, schneller Start" : "Works offline, faster launch")}
        </div>
      </div>
      {prompt && (
        <button onClick={handleInstall} style={{ background: th.accent, color: th.bg, border: "none", borderRadius: 9, padding: "6px 16px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
          {lang === "de" ? "Installieren" : "Install"}
        </button>
      )}
      <button onClick={handleDismiss} style={{ background: "none", border: "none", color: th.textFaint, cursor: "pointer", fontSize: "1rem", padding: "2px 6px" }}>✕</button>
    </div>
  );
}

function toggleTheme() {
  ThemeCtx.current = ThemeCtx.current === "dark" ? "light" : "dark";
  ThemeCtx.listeners.forEach(fn => fn(ThemeCtx.current));
}

function safeLocalGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function safeLocalSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

const CITIES = {
  paris: {
    id:"paris",name:"Paris",emoji:"🗼",country:"🇫🇷",lat:48.8566,lng:2.3522,timezone:"Europe/Paris",
    sampleLocations:[
      {id:1,name:"Eiffelturm",type:"Sehenswürdigkeit",address:"Champ de Mars, 75007 Paris",lat:48.8584,lng:2.2945,area:"7. Arrondissement",duration:"1,5 Std.",icon:"🗼"},
      {id:2,name:"Arc de Triomphe",type:"Sehenswürdigkeit",address:"Pl. Charles de Gaulle, 75008 Paris",lat:48.8738,lng:2.295,area:"8. Arrondissement",duration:"1 Std.",icon:"🏛️"},
      {id:3,name:"Le Grand Véfour",type:"Restaurant",address:"17 Rue de Beaujolais, 75001 Paris",lat:48.8637,lng:2.337,area:"1. Arrondissement",duration:"2 Std.",icon:"🍽️"},
    ],
    demoLinks:["https://maps.google.com/?q=eiffelturm","https://maps.google.com/?q=arc+de+triomphe","https://www.restaurant-legrandvefour.fr"],
    linkMatchers:[{pattern:/eiffel|tour-eiffel/i,locationIndex:0},{pattern:/arc|triomphe/i,locationIndex:1},{pattern:/restaurant|cafe|vefour|maps/i,locationIndex:2}],
    entryCosts:{"Eiffelturm":{min:11.80,max:29.40,currency:"€",note:"je nach Etage"},"Arc de Triomphe":{min:13,max:13,currency:"€",note:"Erwachsene"},"Le Grand Véfour":{min:80,max:350,currency:"€",note:"Menü–À la carte"}},
    ratings:{"Eiffelturm":{stars:4.8,reviews:284000,price:"€€",badge:"Weltbekannt"},"Arc de Triomphe":{stars:4.7,reviews:98000,price:"€€",badge:"Muss man gesehen haben"},"Le Grand Véfour":{stars:4.5,reviews:1200,price:"€€€€",badge:"Michelin-Stern"}},
    locationInfo:{"Eiffelturm":{short:"Wahrzeichen von Paris, 330m hoch, 1889 erbaut.",highlights:["Aussichtsplattform","Abends Lichtshow","Champ de Mars"]},"Arc de Triomphe":{short:"Triumphbogen am Place Charles de Gaulle.",highlights:["Dachterrasse","Grab des Unbekannten Soldaten","Champs-Élysées"]},"Le Grand Véfour":{short:"Eines der ältesten Restaurants von Paris, seit 1784.",highlights:["Historisches Interieur","Sternküche","Napoleon & Hugo"]}},
    openingHours:{"Eiffelturm":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–23:45"},"Arc de Triomphe":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"10:00–23:00"},"Le Grand Véfour":{mo:true,di:true,mi:true,do:true,fr:true,sa:false,so:false,hours:"12:00–14:00, 19:30–22:00",note:"Sa & So geschlossen"}},

  },
  london: {
    id:"london",name:"London",emoji:"🎡",country:"🇬🇧",lat:51.5074,lng:-0.1278,timezone:"Europe/London",
    sampleLocations:[
      {id:1,name:"Tower of London",type:"Sehenswürdigkeit",address:"London EC3N 4AB",lat:51.5081,lng:-0.0759,area:"City of London",duration:"2 Std.",icon:"🏰"},
      {id:2,name:"Big Ben",type:"Sehenswürdigkeit",address:"Westminster, London SW1A 0AA",lat:51.5007,lng:-0.1246,area:"Westminster",duration:"0,5 Std.",icon:"🕐"},
      {id:3,name:"Borough Market",type:"Markt",address:"8 Southwark St, London SE1 1TL",lat:51.5055,lng:-0.091,area:"Southwark",duration:"1,5 Std.",icon:"🥘"},
    ],
    demoLinks:["https://maps.google.com/?q=tower+of+london","https://maps.google.com/?q=big+ben","https://maps.google.com/?q=borough+market"],
    linkMatchers:[{pattern:/tower.*london/i,locationIndex:0},{pattern:/big.*ben|westminster/i,locationIndex:1},{pattern:/borough.*market/i,locationIndex:2}],
    entryCosts:{"Tower of London":{min:33.60,max:33.60,currency:"£",note:"Erwachsene"},"Big Ben":{min:0,max:0,currency:"£",note:"Außenbesichtigung frei"},"Borough Market":{min:0,max:0,currency:"£",note:"Eintritt frei"}},
    ratings:{"Tower of London":{stars:4.7,reviews:112000,price:"€€",badge:"UNESCO Welterbe"},"Big Ben":{stars:4.8,reviews:198000,price:"Kostenlos",badge:"Ikone"},"Borough Market":{stars:4.6,reviews:67000,price:"€€",badge:"Foodie-Paradies"}},
    locationInfo:{"Tower of London":{short:"Historische Festung an der Themse, seit 1066.",highlights:["Kronjuwelen","Beefeater-Führung","Raben des Towers"]},"Big Ben":{short:"Berühmter Uhrenturm am Palace of Westminster.",highlights:["Fotomotiv #1","Westminster Bridge","Houses of Parliament"]},"Borough Market":{short:"Ältester Lebensmittelmarkt Londons.",highlights:["Street Food","Frische Produkte","Eisenbahn-Bögen"]}},
    openingHours:{"Tower of London":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–17:30"},"Big Ben":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Außen immer sichtbar"},"Borough Market":{mo:false,di:true,mi:true,do:true,fr:true,sa:true,so:false,hours:"10:00–17:00",note:"Mo & So geschlossen"}},
  },
  berlin: {
    id:"berlin",name:"Berlin",emoji:"🐻",country:"🇩🇪",lat:52.5200,lng:13.4050,timezone:"Europe/Berlin",
    sampleLocations:[
      {id:1,name:"Brandenburger Tor",type:"Sehenswürdigkeit",address:"Pariser Platz, 10117 Berlin",lat:52.5163,lng:13.3777,area:"Mitte",duration:"0,5 Std.",icon:"🏛️"},
      {id:2,name:"Museumsinsel",type:"Museum",address:"10178 Berlin",lat:52.5169,lng:13.4019,area:"Mitte",duration:"3 Std.",icon:"🏛️"},
      {id:3,name:"East Side Gallery",type:"Sehenswürdigkeit",address:"Mühlenstr. 3-100, 10243 Berlin",lat:52.5053,lng:13.4395,area:"Friedrichshain",duration:"1 Std.",icon:"🎨"},
    ],
    demoLinks:["https://maps.google.com/?q=brandenburger+tor","https://maps.google.com/?q=museumsinsel+berlin","https://maps.google.com/?q=east+side+gallery"],
    linkMatchers:[{pattern:/brandenburger|brandenburg/i,locationIndex:0},{pattern:/museumsinsel/i,locationIndex:1},{pattern:/east.*side|gallery/i,locationIndex:2}],
    entryCosts:{"Brandenburger Tor":{min:0,max:0,currency:"€",note:"Eintritt frei"},"Museumsinsel":{min:12,max:22,currency:"€",note:"Einzeln / Kombi"},"East Side Gallery":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Brandenburger Tor":{stars:4.8,reviews:180000,price:"Kostenlos",badge:"Symbol der Einheit"},"Museumsinsel":{stars:4.7,reviews:95000,price:"€€",badge:"UNESCO Welterbe"},"East Side Gallery":{stars:4.6,reviews:72000,price:"Kostenlos",badge:"Street Art"}},
    locationInfo:{"Brandenburger Tor":{short:"Symbol der deutschen Wiedervereinigung.",highlights:["Pariser Platz","Foto-Hotspot","Nah am Reichstag"]},"Museumsinsel":{short:"Fünf weltberühmte Museen auf einer Insel.",highlights:["Pergamonmuseum","Nofretete-Büste","Alte Nationalgalerie"]},"East Side Gallery":{short:"Längste Open-Air-Galerie der Welt.",highlights:["Bruderkuss-Gemälde","1,3 km Mauer-Kunst","Spree-Ufer"]}},
    openingHours:{"Brandenburger Tor":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"},"Museumsinsel":{mo:false,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"10:00–18:00",note:"Mo geschlossen"},"East Side Gallery":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"}},
  },
  rom: {
    id:"rom",name:"Rom",emoji:"🏛️",country:"🇮🇹",lat:41.9028,lng:12.4964,timezone:"Europe/Rome",
    sampleLocations:[
      {id:1,name:"Kolosseum",type:"Sehenswürdigkeit",address:"Piazza del Colosseo, 00184 Roma",lat:41.8902,lng:12.4922,area:"Celio",duration:"2 Std.",icon:"🏟️"},
      {id:2,name:"Vatikan",type:"Sehenswürdigkeit",address:"Viale Vaticano, 00165 Roma",lat:41.9029,lng:12.4534,area:"Vatikanstadt",duration:"3 Std.",icon:"⛪"},
      {id:3,name:"Trevi-Brunnen",type:"Sehenswürdigkeit",address:"Piazza di Trevi, 00187 Roma",lat:41.9009,lng:12.4833,area:"Trevi",duration:"0,5 Std.",icon:"⛲"},
    ],
    demoLinks:["https://maps.google.com/?q=kolosseum+rom","https://maps.google.com/?q=vatikan","https://maps.google.com/?q=trevi+brunnen"],
    linkMatchers:[{pattern:/kolosseum|colosseum|colosseo/i,locationIndex:0},{pattern:/vatikan|vatican/i,locationIndex:1},{pattern:/trevi/i,locationIndex:2}],
    entryCosts:{"Kolosseum":{min:16,max:22,currency:"€",note:"Erwachsene"},"Vatikan":{min:17,max:17,currency:"€",note:"Museen"},"Trevi-Brunnen":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Kolosseum":{stars:4.8,reviews:320000,price:"€€",badge:"UNESCO Welterbe"},"Vatikan":{stars:4.7,reviews:210000,price:"€€",badge:"Einzigartig"},"Trevi-Brunnen":{stars:4.7,reviews:280000,price:"Kostenlos",badge:"Romantisch"}},
    locationInfo:{"Kolosseum":{short:"Antikes Amphitheater, erbaut 70–80 n.Chr.",highlights:["Arena & Untergeschosse","Palatin-Hügel","Sonnenuntergang"]},"Vatikan":{short:"Kleinster Staat der Welt mit Sixtinischer Kapelle.",highlights:["Sixtinische Kapelle","Petersdom","Raffael-Stanzen"]},"Trevi-Brunnen":{short:"Größter Barockbrunnen Roms.",highlights:["Münze werfen","Abends beleuchtet","Gelato nebenan"]}},
    openingHours:{"Kolosseum":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–19:00"},"Vatikan":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:false,hours:"08:00–18:00",note:"So geschlossen"},"Trevi-Brunnen":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"}},
  },
  barcelona: {
    id:"barcelona",name:"Barcelona",emoji:"🎭",country:"🇪🇸",lat:41.3874,lng:2.1686,timezone:"Europe/Madrid",
    sampleLocations:[
      {id:1,name:"Sagrada Familia",type:"Sehenswürdigkeit",address:"C/ de Mallorca, 401, 08013 Barcelona",lat:41.4036,lng:2.1744,area:"Eixample",duration:"2 Std.",icon:"⛪"},
      {id:2,name:"Park Güell",type:"Park",address:"08024 Barcelona",lat:41.4145,lng:2.1527,area:"Gracia",duration:"1,5 Std.",icon:"🦎"},
      {id:3,name:"La Boqueria",type:"Markt",address:"La Rambla, 91, 08001 Barcelona",lat:41.3816,lng:2.1719,area:"Ciutat Vella",duration:"1 Std.",icon:"🥘"},
    ],
    demoLinks:["https://maps.google.com/?q=sagrada+familia","https://maps.google.com/?q=park+guell","https://maps.google.com/?q=la+boqueria"],
    linkMatchers:[{pattern:/sagrada|familia/i,locationIndex:0},{pattern:/guell|park/i,locationIndex:1},{pattern:/boqueria|rambla/i,locationIndex:2}],
    entryCosts:{"Sagrada Familia":{min:26,max:36,currency:"€",note:"mit/ohne Turm"},"Park Güell":{min:10,max:10,currency:"€",note:"Erwachsene"},"La Boqueria":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Sagrada Familia":{stars:4.8,reviews:240000,price:"€€",badge:"UNESCO Welterbe"},"Park Güell":{stars:4.6,reviews:175000,price:"€",badge:"Gaudi-Meisterwerk"},"La Boqueria":{stars:4.5,reviews:98000,price:"€€",badge:"Foodie-Paradies"}},
    locationInfo:{"Sagrada Familia":{short:"Gaudis unvollendete Basilika, Baubeginn 1882.",highlights:["Fassaden","Turmbesteigung","Lichtspiel"]},"Park Güell":{short:"Gaudis bunter Stadtpark auf einem Hügel.",highlights:["Mosaikbank","Drachenskulptur","Panorama"]},"La Boqueria":{short:"Berühmter Markt an der Rambla.",highlights:["Frische Säfte","Meeresfrüchte","Tapas"]}},
    openingHours:{"Sagrada Familia":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–20:00"},"Park Güell":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:30–19:30"},"La Boqueria":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:false,hours:"08:00–20:30",note:"So geschlossen"}},
  },
  wien: {
    id:"wien",name:"Wien",emoji:"🎵",country:"🇦🇹",lat:48.2082,lng:16.3738,timezone:"Europe/Vienna",
    sampleLocations:[
      {id:1,name:"Schloss Schoenbrunn",type:"Sehenswürdigkeit",address:"Schönbrunner Schloßstraße 47, 1130 Wien",lat:48.1845,lng:16.3122,area:"Hietzing",duration:"2,5 Std.",icon:"🏰"},
      {id:2,name:"Stephansdom",type:"Sehenswürdigkeit",address:"Stephansplatz 3, 1010 Wien",lat:48.2082,lng:16.3738,area:"Innere Stadt",duration:"1 Std.",icon:"⛪"},
      {id:3,name:"Naschmarkt",type:"Markt",address:"1060 Wien",lat:48.1988,lng:16.3632,area:"Mariahilf",duration:"1,5 Std.",icon:"🥘"},
    ],
    demoLinks:["https://maps.google.com/?q=schloss+schoenbrunn","https://maps.google.com/?q=stephansdom+wien","https://maps.google.com/?q=naschmarkt+wien"],
    linkMatchers:[{pattern:/schoenbrunn|schloss/i,locationIndex:0},{pattern:/stephansdom|stephan/i,locationIndex:1},{pattern:/naschmarkt/i,locationIndex:2}],
    entryCosts:{"Schloss Schoenbrunn":{min:24,max:29,currency:"€",note:"Imperial / Grand Tour"},"Stephansdom":{min:0,max:6,currency:"€",note:"Kirche frei / Turm 6€"},"Naschmarkt":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Schloss Schoenbrunn":{stars:4.7,reviews:125000,price:"€€",badge:"UNESCO Welterbe"},"Stephansdom":{stars:4.8,reviews:92000,price:"€",badge:"Wahrzeichen"},"Naschmarkt":{stars:4.5,reviews:55000,price:"€€",badge:"Kulinarisch"}},
    locationInfo:{"Schloss Schoenbrunn":{short:"Kaiserliche Sommerresidenz der Habsburger.",highlights:["Prunkräume","Schlossgarten","Zoo"]},"Stephansdom":{short:"Gotische Kathedrale im Herzen Wiens.",highlights:["Südturm","Katakomben","Pummerin"]},"Naschmarkt":{short:"Wiens beliebtester Markt seit dem 16. Jhd.",highlights:["Internationale Küche","Flohmarkt Sa","Kaffeehäuser"]}},
    openingHours:{"Schloss Schoenbrunn":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–17:00"},"Stephansdom":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"06:00–22:00"},"Naschmarkt":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:false,hours:"06:00–19:30",note:"So geschlossen"}},
  },
  amsterdam: {
    id:"amsterdam",name:"Amsterdam",emoji:"🌷",country:"🇳🇱",lat:52.3676,lng:4.9041,timezone:"Europe/Amsterdam",
    sampleLocations:[
      {id:1,name:"Rijksmuseum",type:"Museum",address:"Museumstraat 1, 1071 XX Amsterdam",lat:52.3600,lng:4.8852,area:"Museumplein",duration:"2,5 Std.",icon:"🎨"},
      {id:2,name:"Anne Frank Haus",type:"Museum",address:"Prinsengracht 263-267, Amsterdam",lat:52.3752,lng:4.8840,area:"Jordaan",duration:"1,5 Std.",icon:"📖"},
      {id:3,name:"Vondelpark",type:"Park",address:"1071 AA Amsterdam",lat:52.3580,lng:4.8686,area:"Oud-Zuid",duration:"1 Std.",icon:"🌳"},
    ],
    demoLinks:["https://maps.google.com/?q=rijksmuseum","https://maps.google.com/?q=anne+frank+haus","https://maps.google.com/?q=vondelpark"],
    linkMatchers:[{pattern:/rijksmuseum/i,locationIndex:0},{pattern:/anne.*frank/i,locationIndex:1},{pattern:/vondelpark/i,locationIndex:2}],
    entryCosts:{"Rijksmuseum":{min:22.50,max:22.50,currency:"€",note:"Erwachsene"},"Anne Frank Haus":{min:16,max:16,currency:"€",note:"Nur online buchbar"},"Vondelpark":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Rijksmuseum":{stars:4.8,reviews:95000,price:"€€",badge:"Weltklasse"},"Anne Frank Haus":{stars:4.7,reviews:68000,price:"€",badge:"Bewegend"},"Vondelpark":{stars:4.7,reviews:120000,price:"Kostenlos",badge:"Oase"}},
    locationInfo:{"Rijksmuseum":{short:"Niederländisches Nationalmuseum mit Rembrandts Nachtwache.",highlights:["Nachtwache","Delfter Blau","Museumsgarten"]},"Anne Frank Haus":{short:"Versteck der Familie Frank im Zweiten Weltkrieg.",highlights:["Originales Hinterhaus","Tagebuch-Ausstellung","Früh buchen!"]},"Vondelpark":{short:"Größter Stadtpark Amsterdams.",highlights:["Open-Air-Theater","Cafes & Spielplätze","Joggen & Radfahren"]}},
    openingHours:{"Rijksmuseum":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–17:00"},"Anne Frank Haus":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–22:00"},"Vondelpark":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer geöffnet"}},
  },
  prag: {
    id:"prag",name:"Prag",emoji:"🏰",country:"🇨🇿",lat:50.0755,lng:14.4378,timezone:"Europe/Prague",
    sampleLocations:[
      {id:1,name:"Karlsbrücke",type:"Sehenswürdigkeit",address:"Karluv most, 110 00 Praha",lat:50.0865,lng:14.4114,area:"Altstadt",duration:"1 Std.",icon:"🌉"},
      {id:2,name:"Prager Burg",type:"Sehenswürdigkeit",address:"Hradcany, 119 08 Praha",lat:50.0911,lng:14.4003,area:"Hradschin",duration:"2,5 Std.",icon:"🏰"},
      {id:3,name:"Altstädter Ring",type:"Platz",address:"Staromestske nam., 110 00 Praha",lat:50.0873,lng:14.4213,area:"Altstadt",duration:"1 Std.",icon:"⏰"},
    ],
    demoLinks:["https://maps.google.com/?q=karlsbruecke+prag","https://maps.google.com/?q=prager+burg","https://maps.google.com/?q=altstadter+ring+prag"],
    linkMatchers:[{pattern:/karlsbr|charles.*bridge|karluv/i,locationIndex:0},{pattern:/prager.*burg|prague.*castle|hrad/i,locationIndex:1},{pattern:/altstadter|old.*town.*square|staromest/i,locationIndex:2}],
    entryCosts:{"Karlsbrücke":{min:0,max:0,currency:"€",note:"Eintritt frei"},"Prager Burg":{min:10,max:15,currency:"€",note:"Rundgang A/B"},"Altstädter Ring":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Karlsbrücke":{stars:4.8,reviews:185000,price:"Kostenlos",badge:"Ikonisch"},"Prager Burg":{stars:4.7,reviews:142000,price:"€",badge:"Größte Burg der Welt"},"Altstädter Ring":{stars:4.7,reviews:110000,price:"Kostenlos",badge:"Astronomische Uhr"}},
    locationInfo:{"Karlsbrücke":{short:"Gotische Steinbrücke über die Moldau, 1402.",highlights:["30 Barockskulpturen","Frühmorgens besuchen","Straßenkünstler"]},"Prager Burg":{short:"Größte geschlossene Burganlage der Welt.",highlights:["Veitsdom","Goldenes Gässchen","Panoramablick"]},"Altstädter Ring":{short:"Mittelalterlicher Marktplatz mit Astronomischer Uhr.",highlights:["Uhr zur vollen Stunde","Teynkirche","Weihnachtsmarkt"]}},
    openingHours:{"Karlsbrücke":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"},"Prager Burg":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"06:00–22:00"},"Altstädter Ring":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"}},
  },
  lissabon: {
    id:"lissabon",name:"Lissabon",emoji:"🚋",country:"🇵🇹",lat:38.7223,lng:-9.1393,timezone:"Europe/Lisbon",
    sampleLocations:[
      {id:1,name:"Torre de Belem",type:"Sehenswürdigkeit",address:"Av. Brasilia, 1400-038 Lisboa",lat:38.6916,lng:-9.2160,area:"Belem",duration:"1 Std.",icon:"🏰"},
      {id:2,name:"Alfama",type:"Stadtviertel",address:"Alfama, Lisboa",lat:38.7114,lng:-9.1300,area:"Alfama",duration:"2 Std.",icon:"🏘️"},
      {id:3,name:"Pasteis de Belem",type:"Cafe",address:"R. de Belem 84-92, Lisboa",lat:38.6976,lng:-9.2030,area:"Belem",duration:"0,5 Std.",icon:"🥮"},
    ],
    demoLinks:["https://maps.google.com/?q=torre+de+belem","https://maps.google.com/?q=alfama+lissabon","https://maps.google.com/?q=pasteis+de+belem"],
    linkMatchers:[{pattern:/torre.*belem/i,locationIndex:0},{pattern:/alfama/i,locationIndex:1},{pattern:/pasteis/i,locationIndex:2}],
    entryCosts:{"Torre de Belem":{min:8,max:8,currency:"€",note:"Erwachsene"},"Alfama":{min:0,max:0,currency:"€",note:"Eintritt frei"},"Pasteis de Belem":{min:0,max:0,currency:"€",note:"Eintritt frei"}},
    ratings:{"Torre de Belem":{stars:4.6,reviews:88000,price:"€",badge:"UNESCO Welterbe"},"Alfama":{stars:4.7,reviews:52000,price:"Kostenlos",badge:"Authentisch"},"Pasteis de Belem":{stars:4.7,reviews:110000,price:"€",badge:"Legendär"}},
    locationInfo:{"Torre de Belem":{short:"Wahrzeichen Lissabons am Tejo-Ufer.",highlights:["Manuelinische Architektur","Blick auf den Tejo","UNESCO"]},"Alfama":{short:"Ältestes Viertel Lissabons mit Fado-Musik.",highlights:["Fado-Lokale","Miradouros","Straßenbahn 28"]},"Pasteis de Belem":{short:"Berühmteste Pastel-de-Nata-Bäckerei seit 1837.",highlights:["Original-Rezept","Immer frisch","Zimt & Zucker"]}},
    openingHours:{"Torre de Belem":{mo:false,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"10:00–17:30",note:"Mo geschlossen"},"Alfama":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"},"Pasteis de Belem":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"08:00–23:00"}},
  },
  new_york: {
    id:"new_york",name:"New York",emoji:"🗽",country:"🇺🇸",lat:40.7128,lng:-74.0060,timezone:"America/New_York",
    sampleLocations:[
      {id:1,name:"Freiheitsstatue",type:"Sehenswürdigkeit",address:"Liberty Island, New York, NY 10004",lat:40.6892,lng:-74.0445,area:"Liberty Island",duration:"3 Std.",icon:"🗽"},
      {id:2,name:"Central Park",type:"Park",address:"New York, NY 10024",lat:40.7829,lng:-73.9654,area:"Manhattan",duration:"2 Std.",icon:"🌳"},
      {id:3,name:"Times Square",type:"Platz",address:"Manhattan, NY 10036",lat:40.7580,lng:-73.9855,area:"Midtown",duration:"1 Std.",icon:"🌃"},
    ],
    demoLinks:["https://maps.google.com/?q=statue+of+liberty","https://maps.google.com/?q=central+park","https://maps.google.com/?q=times+square"],
    linkMatchers:[{pattern:/statue.*liberty|freiheitsstatue/i,locationIndex:0},{pattern:/central.*park/i,locationIndex:1},{pattern:/times.*square/i,locationIndex:2}],
    entryCosts:{"Freiheitsstatue":{min:24,max:24,currency:"$",note:"Fähre + Pedestal"},"Central Park":{min:0,max:0,currency:"$",note:"Eintritt frei"},"Times Square":{min:0,max:0,currency:"$",note:"Eintritt frei"}},
    ratings:{"Freiheitsstatue":{stars:4.7,reviews:95000,price:"€€",badge:"Ikone"},"Central Park":{stars:4.8,reviews:310000,price:"Kostenlos",badge:"Oase"},"Times Square":{stars:4.5,reviews:220000,price:"Kostenlos",badge:"Elektrisierend"}},
    locationInfo:{"Freiheitsstatue":{short:"Geschenk Frankreichs an die USA, 1886 eingeweiht.",highlights:["Fähre ab Battery Park","Krone mit Voranmeldung","Ellis Island"]},"Central Park":{short:"Ikonischer Stadtpark mitten in Manhattan.",highlights:["Bethesda Fountain","Bow Bridge","Strawberry Fields"]},"Times Square":{short:"Das leuchtende Herz von Manhattan.",highlights:["Broadway-Theater","Neon-Reklamen","TKTS Tickets"]}},
    openingHours:{"Freiheitsstatue":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"09:00–17:00"},"Central Park":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"06:00–01:00"},"Times Square":{mo:true,di:true,mi:true,do:true,fr:true,sa:true,so:true,hours:"Immer zugänglich"}},
  },
};

const DEMO_TRIPS = {
  paris: {
    cityId: "paris",
    numDays: 3,
    startDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10),
    locations: [
      {id:101,name:"Eiffelturm",type:"Sehenswürdigkeit",address:"Champ de Mars, 75007 Paris",lat:48.8584,lng:2.2945,area:"7. Arrondissement",duration:"1,5 Std.",icon:"🗼"},
      {id:102,name:"Arc de Triomphe",type:"Sehenswürdigkeit",address:"Pl. Charles de Gaulle, 75008 Paris",lat:48.8738,lng:2.295,area:"8. Arrondissement",duration:"1 Std.",icon:"🏛️"},
      {id:103,name:"Le Grand Véfour",type:"Restaurant",address:"17 Rue de Beaujolais, 75001 Paris",lat:48.8637,lng:2.337,area:"1. Arrondissement",duration:"2 Std.",icon:"🍽️"},
      {id:104,name:"Louvre Museum",type:"Museum",address:"Rue de Rivoli, 75001 Paris",lat:48.8606,lng:2.3376,area:"1. Arrondissement",duration:"3 Std.",icon:"🖼️",openingHoursText:"09:00–18:00",closedDays:["Dienstag","Tuesday"]},
      {id:105,name:"Café de Flore",type:"Cafe",address:"172 Bd Saint-Germain, 75006 Paris",lat:48.8539,lng:2.3328,area:"Saint-Germain",duration:"1 Std.",icon:"☕",openingHoursText:"07:30–01:30",closedDays:[]},
      {id:106,name:"Sacré-Cœur",type:"Sehenswürdigkeit",address:"35 Rue du Chevalier de la Barre, 75018 Paris",lat:48.8867,lng:2.3431,area:"Montmartre",duration:"1 Std.",icon:"⛪",openingHoursText:"06:00–22:30",closedDays:[]},
      {id:107,name:"Marché d'Aligre",type:"Markt",address:"Place d'Aligre, 75012 Paris",lat:48.8498,lng:2.3747,area:"12. Arrondissement",duration:"1 Std.",icon:"🛒",openingHoursText:"Di–So 08:00–13:00",closedDays:["Montag","Monday"]},
      {id:108,name:"Brasserie Lipp",type:"Restaurant",address:"151 Bd Saint-Germain, 75006 Paris",lat:48.8540,lng:2.3330,area:"Saint-Germain",duration:"1,5 Std.",icon:"🥩",openingHoursText:"12:00–23:00",closedDays:[]},
      {id:109,name:"Musée d'Orsay",type:"Museum",address:"1 Rue de la Légion d'Honneur, 75007 Paris",lat:48.8600,lng:2.3266,area:"7. Arrondissement",duration:"2 Std.",icon:"🎨",openingHoursText:"09:30–18:00",closedDays:["Montag","Monday"]},
    ],
    locationDays: { 101: null, 102: null, 103: null, 104: null, 105: null, 106: null, 107: null, 108: null, 109: null },
    locationNotes: { 101: "Tickets online vorbuchen!", 104: "Mona Lisa – früh kommen!", 106: "Sonnenuntergang von der Kuppel" },
    assignDays: (startDate) => {
      const d = generateTripDays(startDate, 3);
      return { 101: d[0], 102: d[0], 103: d[0], 104: d[1], 105: d[1], 106: d[1], 107: d[2], 108: d[2], 109: d[2] };
    },
  },
  london: {
    cityId: "london",
    numDays: 3,
    locations: [
      {id:201,name:"Tower of London",type:"Sehenswürdigkeit",address:"London EC3N 4AB",lat:51.5081,lng:-0.0759,area:"City of London",duration:"2 Std.",icon:"🏰"},
      {id:202,name:"Big Ben",type:"Sehenswürdigkeit",address:"Westminster, London SW1A 0AA",lat:51.5007,lng:-0.1246,area:"Westminster",duration:"0,5 Std.",icon:"🕐"},
      {id:203,name:"Borough Market",type:"Markt",address:"8 Southwark St, London SE1 1TL",lat:51.5055,lng:-0.091,area:"Southwark",duration:"1,5 Std.",icon:"🥘"},
      {id:204,name:"The Ritz London",type:"Restaurant",address:"150 Piccadilly, London W1J 9BR",lat:51.5071,lng:-0.1422,area:"Mayfair",duration:"2 Std.",icon:"🍴",openingHoursText:"12:00–14:30, 18:00–22:00",closedDays:[]},
      {id:205,name:"British Museum",type:"Museum",address:"Great Russell St, London WC1B 3DG",lat:51.5194,lng:-0.1270,area:"Bloomsbury",duration:"2,5 Std.",icon:"🏛️",openingHoursText:"10:00–17:00",closedDays:[]},
      {id:206,name:"Notting Hill",type:"Stadtviertel",address:"Notting Hill, London W11",lat:51.5095,lng:-0.2005,area:"Notting Hill",duration:"1,5 Std.",icon:"🌸",openingHoursText:"Immer zugänglich",closedDays:[]},
      {id:207,name:"Dishoom Covent Garden",type:"Restaurant",address:"12 Upper St Martin's Ln, London WC2H 9FB",lat:51.5120,lng:-0.1269,area:"Covent Garden",duration:"1,5 Std.",icon:"🍛",openingHoursText:"08:00–23:00",closedDays:[]},
      {id:208,name:"Hyde Park",type:"Park",address:"London W2 2UH",lat:51.5073,lng:-0.1657,area:"Westminster",duration:"1 Std.",icon:"🌳",openingHoursText:"05:00–24:00",closedDays:[]},
    ],
    locationNotes: { 201: "Beefeater-Tour buchen!", 204: "Reservierung nötig", 205: "Rosetta Stone ansehen" },
    assignDays: (startDate) => {
      const d = generateTripDays(startDate, 3);
      return { 201: d[0], 202: d[0], 203: d[0], 204: d[1], 205: d[1], 206: d[1], 207: d[2], 208: d[2] };
    },
  },
  berlin: {
    cityId: "berlin",
    numDays: 3,
    locations: [
      {id:301,name:"Brandenburger Tor",type:"Sehenswürdigkeit",address:"Pariser Platz, 10117 Berlin",lat:52.5163,lng:13.3777,area:"Mitte",duration:"0,5 Std.",icon:"🏛️"},
      {id:302,name:"Museumsinsel",type:"Museum",address:"10178 Berlin",lat:52.5169,lng:13.4019,area:"Mitte",duration:"3 Std.",icon:"🏛️"},
      {id:303,name:"Zur letzten Instanz",type:"Restaurant",address:"Waisenstraße 14-16, 10179 Berlin",lat:52.5156,lng:13.4142,area:"Mitte",duration:"1,5 Std.",icon:"🍺",openingHoursText:"12:00–23:00",closedDays:["Montag","Monday"]},
      {id:304,name:"East Side Gallery",type:"Sehenswürdigkeit",address:"Mühlenstr. 3-100, 10243 Berlin",lat:52.5053,lng:13.4395,area:"Friedrichshain",duration:"1 Std.",icon:"🎨"},
      {id:305,name:"Markthalle Neun",type:"Markt",address:"Eisenbahnstraße 42-43, 10997 Berlin",lat:52.4994,lng:13.4274,area:"Kreuzberg",duration:"1 Std.",icon:"🛒",openingHoursText:"Do 17:00–22:00, Sa 10:00–18:00",closedDays:[]},
      {id:306,name:"Café Einstein Stammhaus",type:"Cafe",address:"Kurfürstenstraße 58, 10785 Berlin",lat:52.5044,lng:13.3598,area:"Tiergarten",duration:"1 Std.",icon:"☕",openingHoursText:"08:00–23:00",closedDays:[]},
      {id:307,name:"Berliner Dom",type:"Sehenswürdigkeit",address:"Am Lustgarten, 10178 Berlin",lat:52.5190,lng:13.4009,area:"Mitte",duration:"1 Std.",icon:"⛪",openingHoursText:"09:00–20:00",closedDays:[]},
      {id:308,name:"Prater Biergarten",type:"Restaurant",address:"Kastanienallee 7-9, 10435 Berlin",lat:52.5377,lng:13.4131,area:"Prenzlauer Berg",duration:"2 Std.",icon:"🌿",openingHoursText:"12:00–24:00",closedDays:[]},
    ],
    locationNotes: { 302: "Pergamonmuseum – Tickets vorbuchen!", 304: "Bruderkuss fotografieren", 306: "Wiener Frühstück probieren" },
    assignDays: (startDate) => {
      const d = generateTripDays(startDate, 3);
      return { 301: d[0], 302: d[0], 303: d[0], 304: d[1], 305: d[1], 306: d[1], 307: d[2], 308: d[2] };
    },
  },
};

const DAY_COLORS = ["#e07b54","#5b8dd9","#6abf69","#d4a84b","#a66dd4","#4bb8c4","#d46d8a","#7aab7a","#c4a882","#8b6a3e","#5a8fa3","#c97a5a"];
function getDayColor(i) { return DAY_COLORS[i % DAY_COLORS.length]; }

const TRANSLATIONS = {
  de: {
    appName:"Reiseplaner",addPlace:"Ort hinzufügen",insertLink:"LINK EINFÜGEN",
    linkPlaceholder:"https://maps.google.com/ oder Website-URL",analyze:"Analysieren",
    analyzing:"Analyse...",visitDay:"BESUCHSTAG",demo:"Demo-Beispiele:",
    myPlaces:"Alle Orte",allDays:"Alle Tage",dragHint:"ziehen",
    route:"Route",timeline:"Timeline",pdf:"PDF",
    travelMode:"FORTBEWEGUNG",walking:"Zu Fuss",transit:"ÖPNV",driving:"Auto",
    openInMaps:"In Google Maps öffnen",stops:"Stopps",timelineTitle:"TAGESPLAN",
    transfer:"+20 Min. Transfer",infoShow:"Info",infoHide:"Ausblenden",
    closedDay:"Geschlossen",unknownHours:"Öffnungszeiten unbekannt",
    budgetTitle:"Budget-Tracker",budgetTotal:"Gesamt",budgetExtras:"+ Extras:",
    budgetNote:"* Schätzungen.",savePlans:"Reisepläne",savedPlans:"Gespeicherte Pläne",
    planNamePlaceholder:"Planname",save:"Speichern",saved:"Gespeichert!",
    load:"Laden",noPlans:"Noch keine Pläne.",addFirst:"Füge Orte hinzu.",
    share:"Teilen",createLink:"Link erstellen",shareHint:"Teile diesen Link:",
    copy:"Kopieren",copied:"Kopiert!",warningTitle:"Achtung",
    warningClosed:"ist an dem gewählten Tag geschlossen!",warningHint:"Bitte Besuchstag ändern.",
    closed:"geschlossen",apiActive:"API aktiv",apiMissing:"API-Key fehlt",
    apiTitle:"OpenAI API-Key",apiHint:"Lokal gespeichert.",apiSave:"Speichern",
    apiSaved:"Gespeichert!",apiDelete:"Key löschen",footerText:"Reiseplaner v8.1",
    noRouteHint:"Füge mind. 2 Orte hinzu.",errorEmpty:"Bitte Link eingeben.",
    errorNotFound:"Link nicht erkannt.",
    searchPlaceholder:"Ort suchen, z.B. Eiffelturm Paris...",search:"Suchen",searching:"Suche...",searchNoResults:"Keine Ergebnisse gefunden.",searchTab:"Suche",linkTab:"Link",
    days:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    free:"Kostenlos",selectCity:"Stadt wählen",
    notePlaceholder:"Notiz (z.B. Tickets vorbuchen!)",noteLabel:"Notiz",noteHide:"Ausblenden",
    sectionTrip:"Reisezeitraum",sectionMap:"Karte",sectionRoute:"Route & Timeline",
    labelStartDate:"Startdatum",labelDays:"Reisetage",labelDaysSuffix:"Tage",
    packingList:"Packliste",packingAdd:"Hinzufügen",packingPlaceholder:"Neues Item...",packingEmpty:"Noch nichts auf der Liste.",packingClear:"Erledigte löschen",packingCats:{docs:"📄 Dokumente",clothes:"👕 Kleidung",tech:"🔌 Technik",hygiene:"🧴 Hygiene",other:"📦 Sonstiges"},weather:"Wetter",budget:"Budget",
  },
  en: {
    appName:"Travel Planner",addPlace:"Add Place",insertLink:"INSERT LINK",
    linkPlaceholder:"https://maps.google.com/ or website URL",analyze:"Analyze",
    analyzing:"Analyzing...",visitDay:"VISIT DAY",demo:"Demo examples:",
    myPlaces:"All Places",allDays:"All Days",dragHint:"drag",
    route:"Route",timeline:"Timeline",pdf:"PDF",
    travelMode:"TRAVEL MODE",walking:"Walking",transit:"Transit",driving:"Car",
    openInMaps:"Open in Google Maps",stops:"Stops",timelineTitle:"DAY PLAN",
    transfer:"+20 min transfer",infoShow:"Info",infoHide:"Hide",
    closedDay:"Closed",unknownHours:"Hours unknown",
    budgetTitle:"Budget Tracker",budgetTotal:"Total",budgetExtras:"+ Extras:",
    budgetNote:"* Estimates.",savePlans:"Travel Plans",savedPlans:"Saved Plans",
    planNamePlaceholder:"Plan name",save:"Save",saved:"Saved!",
    load:"Load",noPlans:"No plans yet.",addFirst:"Add places first.",
    share:"Share",createLink:"Create Link",shareHint:"Share this link:",
    copy:"Copy",copied:"Copied!",warningTitle:"Warning",
    warningClosed:"is closed on the selected day!",warningHint:"Please change the visit day.",
    closed:"closed",apiActive:"API active",apiMissing:"API Key missing",
    apiTitle:"OpenAI API Key",apiHint:"Stored locally.",apiSave:"Save",
    apiSaved:"Saved!",apiDelete:"Delete key",footerText:"Travel Planner v8.1",
    noRouteHint:"Add at least 2 places.",errorEmpty:"Please enter a link.",
    errorNotFound:"Link not recognized.",
    searchPlaceholder:"Search place, e.g. Eiffel Tower Paris...",search:"Search",searching:"Searching...",searchNoResults:"No results found.",searchTab:"Search",linkTab:"Link",
    days:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    free:"Free",selectCity:"Select City",
    notePlaceholder:"Note (e.g. Book tickets!)",noteLabel:"Note",noteHide:"Hide",
    sectionTrip:"Travel Period",sectionMap:"Map",sectionRoute:"Route & Timeline",
    labelStartDate:"Start date",labelDays:"Travel days",labelDaysSuffix:"days",
    packingList:"Packing List",packingAdd:"Add",packingPlaceholder:"New item...",packingEmpty:"Nothing on the list yet.",packingClear:"Remove checked",packingCats:{docs:"📄 Documents",clothes:"👕 Clothing",tech:"🔌 Tech",hygiene:"🧴 Hygiene",other:"📦 Other"},weather:"Weather",budget:"Budget",
  }
};

const DAY_KEY_MAP = {
  "Montag":"mo","Dienstag":"di","Mittwoch":"mi","Donnerstag":"do","Freitag":"fr","Samstag":"sa","Sonntag":"so",
  "Monday":"mo","Tuesday":"di","Wednesday":"mi","Thursday":"do","Friday":"fr","Saturday":"sa","Sunday":"so"
};

function getWeekdayKey(dateStr) {
  const keys = ["so","mo","di","mi","do","fr","sa"];
  const d = new Date(dateStr + "T12:00:00");
  return keys[d.getDay()];
}

function formatDateLabel(dateStr, lang) {
  const d = new Date(dateStr + "T12:00:00");
  const shortDE = ["So","Mo","Di","Mi","Do","Fr","Sa"];
  const shortEN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const short = (lang||"de") === "de" ? shortDE[d.getDay()] : shortEN[d.getDay()];
  const day = String(d.getDate()).padStart(2,"0");
  const month = String(d.getMonth()+1).padStart(2,"0");
  return short + " " + day + "." + month + ".";
}
function generateTripDays(startDate, numDays) {
    const days = [];
    const base = new Date(startDate + "T12:00:00");
    for (let i = 0; i < numDays; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d.toISOString().slice(0,10));
    }
    return days;
  }

function normalizePlan(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = raw.id ?? Date.now();
  const name = String(raw.name ?? "").trim() || "Untitled";
  const cityId = raw.cityId ?? raw.city ?? "paris";
  const startDate = raw.startDate ?? new Date().toISOString().slice(0,10);
  const numDays = Number(raw.numDays ?? 4) || 4;
  const tripDays = Array.isArray(raw.tripDays) && raw.tripDays.length ? raw.tripDays : generateTripDays(startDate, numDays);
  const locations = Array.isArray(raw.locations) ? raw.locations : [];
  const locationDays = (raw.locationDays && typeof raw.locationDays === "object") ? raw.locationDays : {};
  const locationNotes = (raw.locationNotes && typeof raw.locationNotes === "object") ? raw.locationNotes : {};
  return { id, name, cityId, startDate, numDays, tripDays, locations, locationDays, locationNotes };
}

function useUndoRedo(initial) {
  const safeInitial = Array.isArray(initial) ? initial : [];
  const [history, setHistory] = useState([safeInitial]);
  const [cursor, setCursor] = useState(0);
  const rawCurrent = history[cursor];
  const current = Array.isArray(rawCurrent) ? rawCurrent.filter(x => x != null) : safeInitial;
  const set = (val) => {
    const prev = Array.isArray(history[cursor]) ? history[cursor] : safeInitial;
    const next = typeof val === "function" ? val(prev) : val;
    const safeNext = Array.isArray(next) ? next : safeInitial;
    const newHistory = history.slice(0, cursor + 1).concat([safeNext]);
    const trimmed = newHistory.slice(-30);
    setHistory(trimmed);
    setCursor(trimmed.length - 1);
  };
  const undo = () => setCursor(c => Math.max(0, c - 1));
  const redo = () => setCursor(c => Math.min(history.length - 1, c + 1));
  const canUndo = cursor > 0;
  const canRedo = cursor < history.length - 1;
  return [current, set, { undo, redo, canUndo, canRedo }];
}

function getEntryCost(name, city) {
  if (!name || !city) return null;
  const costs = city.entryCosts || {};
  const key = Object.keys(costs).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? costs[key] : null;
}

function getRating(name, city) {
  if (!name || !city) return null;
  const ratings = city.ratings || {};
  const key = Object.keys(ratings).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? ratings[key] : null;
}

function getLocationInfo(name, city) {
  if (!name || !city) return null;
  const info = city.locationInfo || {};
  const key = Object.keys(info).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? info[key] : null;
}

function getOpeningInfo(name, day, city) {
  if (!name || !city) return null;
  const hours = city.openingHours || {};
  const key = Object.keys(hours).find(k => name.toLowerCase().includes(k.toLowerCase()));
  if (!key) return null;
  const info = hours[key];
  let dayKey;
  if (day && new RegExp("^\\d{4}-\\d{2}-\\d{2}$").test(day)) {
    dayKey = getWeekdayKey(day);
  } else {
    dayKey = DAY_KEY_MAP[day] || null;
  }
  const isOpen = dayKey ? (info[dayKey] !== false) : true;
  return { isOpen, hours: info.hours, note: info.note };
}

function parseDurationMin(durationStr) {
  if (!durationStr) return 60;
  const m = durationStr.replace(",",".").match(/(\d+\.?\d*)/);
  if (!m) return 60;
  return Math.round(parseFloat(m[1]) * 60);
}

function parseTimeMin(timeStr) {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function detectConflicts(locs, locationTimes) {
  const conflicts = [];
  const withTime = locs.map(loc => {
    const start = parseTimeMin(locationTimes?.[loc.id]);
    const dur = parseDurationMin(loc.duration);
    return { loc, start, end: start !== null ? start + dur : null };
  }).filter(x => x.start !== null);
  for (let i = 0; i < withTime.length; i++) {
    for (let j = i + 1; j < withTime.length; j++) {
      const a = withTime[i], b = withTime[j];
      if (a.start < b.end && b.start < a.end) {
        conflicts.push({ a: a.loc, b: b.loc });
      }
    }
  }
  return conflicts;
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcTravelTime(loc1, loc2) {
  if (!loc1?.lat || !loc1?.lng || !loc2?.lat || !loc2?.lng) return null;
  const dist = haversineDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
  const walkDist = dist * 1.3;
  const walkMin = Math.round((walkDist / 4.5) * 60);
  const transitMin = Math.max(5, Math.round((walkDist / 25) * 60) + 3);
  return { distKm: Math.round(dist * 10) / 10, walkMin, transitMin };
}

function Spinner({ size = 20, color }) {
  const { th } = useTheme();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: `2px solid ${th.border}`, borderTopColor: color || th.accent,
      animation: "spin 0.7s linear infinite", display: "inline-block", flexShrink: 0,
    }} />
  );
}

function SkeletonCard({ th }) {
  const isLight = th.bg === "#f0e8d8";
  const bar = (w, h = 10, mt = 0) => (
    <div style={{ width: w, height: h, borderRadius: 6, background: th.skeletonShine, marginTop: mt, animation:"pulse 1.4s ease infinite" }} />
  );
  return (
    <div style={{
      background: isLight ? "rgba(255,251,242,0.55)" : "rgba(46,40,32,0.5)",
      border: `1px solid ${isLight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 18, padding: "12px 14px",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      boxShadow: isLight ? "inset 0 1px 0 rgba(255,255,255,0.8)" : "inset 0 1px 0 rgba(255,255,255,0.07)",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: th.skeletonShine }} />
        <div style={{ flex: 1 }}>{bar("60%", 12)}{bar("40%", 8, 6)}</div>
      </div>
      {bar("90%", 8, 12)}{bar("75%", 8, 6)}{bar("50%", 8, 6)}
    </div>
  );
}

function generateICS(locations, locationDays, locationNotes, locationTimes, tripDays, city) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TravelPlanner//v5.6//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  const cityName = city ? city.name : "Reise";
  const toICSDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.replace(/-/g, "");
  };
  const toICSDateTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const base = dateStr.replace(/-/g, "");
    if (timeStr && new RegExp("^\\d{2}:\\d{2}$").test(timeStr)) {
      return base + "T" + timeStr.replace(":","") + "00";
    }
    return base;
  };
  const escapeICS = (s) => (s || "").replace(new RegExp("[\\r\\n]","g"), " ").replace(new RegExp(",","g"), "\\,").replace(new RegExp(";","g"), "\\;");
  const locsByDay = {};
  (locations || []).forEach(loc => {
    const day = locationDays?.[loc.id];
    if (!day) return;
    if (!locsByDay[day]) locsByDay[day] = [];
    locsByDay[day].push(loc);
  });
  Object.keys(locsByDay).sort().forEach(day => {
    locsByDay[day].forEach((loc, idx) => {
      const uid = `rp-${loc.id}-${day}@travelplanner`;
      const timeStr = locationTimes?.[loc.id] || null;
      const dtstart = toICSDateTime(day, timeStr);
      const dtend = dtstart;
      const note = locationNotes?.[loc.id] || "";
      const desc = [loc.type, loc.area, note].filter(Boolean).join(" · ");
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTAMP:${new Date().toISOString().replace(new RegExp("[-:]","g"),"").slice(0,15)}Z`);
      if (timeStr) {
        lines.push(`DTSTART:${dtstart}`);
        lines.push(`DTEND:${dtend}`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${toICSDate(day)}`);
        lines.push(`DTEND;VALUE=DATE:${toICSDate(day)}`);
      }
      lines.push(`SUMMARY:${escapeICS(loc.icon + " " + loc.name + " – " + cityName)}`);
      lines.push(`DESCRIPTION:${escapeICS(desc)}`);
      if (loc.address) lines.push(`LOCATION:${escapeICS(loc.address)}`);
      if (loc.lat && loc.lng) lines.push(`GEO:${loc.lat};${loc.lng}`);
      lines.push("END:VEVENT");
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function ICSExportPanel({ locations, locationDays, locationNotes, locationTimes, tripDays, city, lang, th }) {
  const [downloaded, setDownloaded] = useState(false);
  const assignedLocs = (locations || []).filter(l => locationDays?.[l.id]);
  const unassignedLocs = (locations || []).filter(l => !locationDays?.[l.id]);
  const cityName = city ? city.name : "Reise";
  const fileName = `Reiseplan_${cityName.replace(new RegExp("\\s+","g"),"_")}.ics`;

  const handleDownload = () => {
    const icsContent = generateICS(locations, locationDays, locationNotes, locationTimes, tripDays, city);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: "18px 18px" }}>
      <div style={{ fontSize: "0.7rem", color: th.textFaint, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>📅 {lang === "de" ? "Kalender-Export (.ics)" : "Calendar Export (.ics)"}</div>
      <div style={{ fontSize: "0.82rem", color: th.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
        {lang === "de"
          ? `Exportiert alle ${assignedLocs.length} zugewiesenen Orte als Kalendereinträge. Kompatibel mit Google Calendar, Apple Calendar und Outlook.`
          : `Exports all ${assignedLocs.length} assigned places as calendar events. Compatible with Google Calendar, Apple Calendar and Outlook.`}
      </div>
      {assignedLocs.length === 0 ? (
        <div style={{ color: th.textFaint, fontSize: "0.82rem", textAlign: "center", padding: "18px 0" }}>
          {lang === "de" ? "⚠ Noch keine Orte einem Tag zugewiesen." : "⚠ No places assigned to a day yet."}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 14 }}>
            {tripDays.map((day, di) => {
              const dayLocs = assignedLocs.filter(l => locationDays[l.id] === day);
              if (!dayLocs.length) return null;
              return (
                <div key={day} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: "0.72rem", color: getDayColor(di), fontWeight: 700, marginBottom: 5, letterSpacing: 0.5 }}>
                    📆 {formatDateLabel(day, lang)}
                  </div>
                  {dayLocs.map(loc => (
                    <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: th.surface, borderRadius: 9, marginBottom: 4, fontSize: "0.8rem", color: th.text }}>
                      <span>{loc.icon || "📍"}</span>
                      <span style={{ flex: 1 }}>{loc.name}</span>
                      {locationTimes?.[loc.id] && <span style={{ color: th.textMuted, fontSize: "0.72rem" }}>🕐 {locationTimes[loc.id]}</span>}
                      {locationNotes?.[loc.id] && <span style={{ color: th.textFaint, fontSize: "0.68rem" }}>📝</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          {unassignedLocs.length > 0 && (
            <div style={{ fontSize: "0.72rem", color: th.textFaint, marginBottom: 14 }}>
              ⚠ {unassignedLocs.length} {lang === "de" ? "Ort(e) ohne Tag – werden nicht exportiert." : "place(s) without a day – not exported."}
            </div>
          )}
          <button
            onClick={handleDownload}
            style={{ width: "100%", padding: "12px", borderRadius: 12, border: `1.5px solid ${th.accent}`, background: downloaded ? th.success : th.accentLight, color: downloaded ? "#fff" : th.accent, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>
            {downloaded ? (lang === "de" ? "✓ Heruntergeladen!" : "✓ Downloaded!") : (lang === "de" ? `📥 ${fileName} herunterladen` : `📥 Download ${fileName}`)}
          </button>
          <div style={{ fontSize: "0.68rem", color: th.textFaint, marginTop: 8, textAlign: "center" }}>
            {lang === "de" ? "Datei in Google Calendar / Apple Calendar importieren." : "Import file into Google Calendar / Apple Calendar."}
          </div>
        </>
      )}
    </div>
  );
}

function DayNotesPanel({ tripDays, lang, th }) {
  const [notes, setNotes] = useState(() => safeLocalGet("rp_daynotes", {}));
  useEffect(() => { safeLocalSet("rp_daynotes", notes); }, [notes]);
  const [activeDay, setActiveDay] = useState(tripDays[0] || "");
  useEffect(() => { if (!activeDay && tripDays.length) setActiveDay(tripDays[0]); }, [tripDays]);
  if (!tripDays || !tripDays.length) return null;
  return (
    <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:16,padding:"14px 16px"}}>
      <div style={{fontSize:"0.7rem",color:th.textFaint,letterSpacing:1.5,textTransform:"uppercase",marginBottom:12}}>📝 {lang==="de"?"Tagesnotizen":"Day Notes"}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {tripDays.map((d,i) => (
          <button key={d} onClick={()=>setActiveDay(d)}
            style={{padding:"4px 12px",borderRadius:9,border:`1.5px solid ${activeDay===d?getDayColor(i):th.border}`,background:activeDay===d?getDayColor(i)+"22":"transparent",color:activeDay===d?getDayColor(i):th.textMuted,fontWeight:activeDay===d?700:400,fontSize:"0.75rem",cursor:"pointer"}}>
            {formatDateLabel(d, lang||"de")}{dayConflicts.length > 0 && <span style={{ fontSize:"0.65rem", background:th.warningBg, color:th.warning, borderRadius:6, padding:"1px 7px", marginLeft:4, fontWeight:700 }}>⚠ {dayConflicts.length} {lang==="de"?"Konflikt":"Conflict"}{dayConflicts.length>1?"e":""}</span>}
            {notes[d] && notes[d].trim() && <span style={{marginLeft:4,color:getDayColor(i),fontSize:"0.6rem"}}>●</span>}
          </button>
        ))}
      </div>
      {activeDay && (
        <div>
          <div style={{fontSize:"0.72rem",color:th.textMuted,marginBottom:6,fontWeight:600}}>{formatDateLabel(activeDay,lang)}</div>
          <textarea
            value={notes[activeDay]||""}
            onChange={e=>setNotes(n=>({...n,[activeDay]:e.target.value}))}
            placeholder={lang==="de"?"Notizen, Tipps, Packliste für diesen Tag...": "Notes, tips, packing list for this day..."}
            rows={6}
            style={{width:"100%",background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:10,padding:"10px 12px",fontSize:"0.85rem",color:th.text,resize:"vertical",fontFamily:"inherit",lineHeight:1.6,boxSizing:"border-box"}}
          />
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
            <span style={{fontSize:"0.65rem",color:th.textFaint}}>{(notes[activeDay]||``).length} {lang==="de"?"Zeichen":"chars"}</span>
            {notes[activeDay] && (
              <button onClick={()=>setNotes(n=>({...n,[activeDay]:""}))} style={{background:"none",border:`1px solid ${th.border}`,borderRadius:7,padding:"2px 10px",color:th.textMuted,fontSize:"0.7rem",cursor:"pointer"}}>
                {lang==="de"?"Löschen":"Clear"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HotelBlock({ hotel, setHotel, lang, th }) {
  const [open, setOpen] = useState(false);
  const hasHotel = hotel && hotel.name;
  const label = lang==="de" ? "Unterkunft" : "Accommodation";
  return (
    <div style={{marginBottom:14,background:th.card,border:`1px solid ${hasHotel?th.accent:th.border}`,borderRadius:16,padding:"12px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        <div style={{fontSize:"0.7rem",color:th.textFaint,letterSpacing:1.5,textTransform:"uppercase"}}>
          🏨 {label}{hasHotel ? ` · ${hotel.name}` : ""}
        </div>
        <span style={{color:th.textFaint,fontSize:"0.8rem"}}>{open?"▲":"▼"}</span>
      </div>
      {hasHotel && !open && (
        <div style={{marginTop:6,display:"flex",gap:16,flexWrap:"wrap",fontSize:"0.75rem",color:th.textMuted}}>
          {hotel.checkin && <span>✈️ Check-in: <b style={{color:th.text}}>{hotel.checkin}{hotel.checkinTime ? " "+hotel.checkinTime : ""}</b></span>}
          {hotel.checkout && <span>🚪 Check-out: <b style={{color:th.text}}>{hotel.checkout}{hotel.checkoutTime ? " "+hotel.checkoutTime : ""}</b></span>}
        </div>
      )}
      {open && (
        <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <div style={{flex:2,minWidth:160}}>
              <label style={{fontSize:"0.7rem",color:th.textMuted,display:"block",marginBottom:3}}>{lang==="de"?"Hotelname / Unterkunft":"Hotel / Accommodation"}</label>
              <input value={hotel.name||""} onChange={e=>setHotel(h=>({...h,name:e.target.value}))} placeholder={lang==="de"?"z.B. Hotel Adlon":"e.g. Hotel Adlon"}
                style={{width:"100%",background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 10px",fontSize:"0.85rem",color:th.text}} />
            </div>
            <div style={{flex:1,minWidth:120}}>
              <label style={{fontSize:"0.7rem",color:th.textMuted,display:"block",marginBottom:3}}>{lang==="de"?"Bestätigungs-Nr.":"Confirmation No."}</label>
              <input value={hotel.confirmation||""} onChange={e=>setHotel(h=>({...h,confirmation:e.target.value}))} placeholder="#ABC123"
                style={{width:"100%",background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 10px",fontSize:"0.85rem",color:th.text}} />
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:120}}>
              <label style={{fontSize:"0.7rem",color:th.textMuted,display:"block",marginBottom:3}}>Check-in</label>
              <div style={{display:"flex",gap:4}}>
                <input type="date" value={hotel.checkin||""} onChange={e=>setHotel(h=>({...h,checkin:e.target.value}))}
                  style={{flex:1,background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 8px",fontSize:"0.82rem",color:th.text}} />
                <input type="time" value={hotel.checkinTime||""} onChange={e=>setHotel(h=>({...h,checkinTime:e.target.value}))}
                  style={{width:80,background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 8px",fontSize:"0.82rem",color:th.text}} />
              </div>
            </div>
            <div style={{flex:1,minWidth:120}}>
              <label style={{fontSize:"0.7rem",color:th.textMuted,display:"block",marginBottom:3}}>Check-out</label>
              <div style={{display:"flex",gap:4}}>
                <input type="date" value={hotel.checkout||""} onChange={e=>setHotel(h=>({...h,checkout:e.target.value}))}
                  style={{flex:1,background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 8px",fontSize:"0.82rem",color:th.text}} />
                <input type="time" value={hotel.checkoutTime||""} onChange={e=>setHotel(h=>({...h,checkoutTime:e.target.value}))}
                  style={{width:80,background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 8px",fontSize:"0.82rem",color:th.text}} />
              </div>
            </div>
          </div>
          <div>
            <label style={{fontSize:"0.7rem",color:th.textMuted,display:"block",marginBottom:3}}>{lang==="de"?"Adresse":"Address"}</label>
            <input value={hotel.address||""} onChange={e=>setHotel(h=>({...h,address:e.target.value}))} placeholder={lang==="de"?"Straße, Stadt":"Street, City"}
              style={{width:"100%",background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 10px",fontSize:"0.82rem",color:th.text}} />
          </div>
          <div>
            <label style={{fontSize:"0.7rem",color:th.textMuted,display:"block",marginBottom:3}}>{lang==="de"?"Notiz":"Note"}</label>
            <input value={hotel.note||""} onChange={e=>setHotel(h=>({...h,note:e.target.value}))} placeholder={lang==="de"?"z.B. Frühstück inklusive":"e.g. Breakfast included"}
              style={{width:"100%",background:th.input,border:`1px solid ${th.inputBorder}`,borderRadius:9,padding:"6px 10px",fontSize:"0.82rem",color:th.text}} />
          </div>
          {hotel.address && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.address)}`} target="_blank" rel="noopener noreferrer"
              style={{fontSize:"0.75rem",color:th.accent,textDecoration:"none"}}>🗺 {lang==="de"?"In Google Maps öffnen":"Open in Google Maps"}</a>
          )}
          <button onClick={()=>setHotel({})} style={{alignSelf:"flex-start",background:"none",border:`1px solid ${th.border}`,borderRadius:8,padding:"4px 12px",color:th.textMuted,fontSize:"0.75rem",cursor:"pointer"}}>
            {lang==="de"?"Zurücksetzen":"Reset"}
          </button>
        </div>
      )}
    </div>
  );
}

function StarRating({ stars, reviews, price, badge, lang, th }) {
  if (!stars) return null;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:6, marginTop:4 }}>
      <div style={{ display:"flex", gap:1 }}>
        {[...Array(5)].map((_,i) => (
          <span key={i} style={{ fontSize:"0.75rem", color: i < full ? "#f5a623" : (i === full && half ? "#f5a623" : th.border) }}>
            {i < full ? "★" : (i === full && half ? "⯨" : "☆")}
          </span>
        ))}
      </div>
      <span style={{ fontSize:"0.72rem", color:th.textMuted, fontWeight:600 }}>{stars.toFixed(1)}</span>
      {reviews && <span style={{ fontSize:"0.68rem", color:th.textFaint }}>({reviews >= 1000 ? (reviews/1000).toFixed(0)+"k" : reviews})</span>}
      {price && <span style={{ fontSize:"0.68rem", color:th.accent, background:th.accentLight, borderRadius:5, padding:"1px 6px" }}>{price}</span>}
      {badge && <span style={{ fontSize:"0.65rem", color:th.gold, background:th.goldBg, borderRadius:5, padding:"1px 6px", fontWeight:600 }}>✦ {badge}</span>}
    </div>
  );
}

function WeatherWidget({ tripDays, city, lang, th }) {
  function pseudoWeather(cityId, dateStr) {
    const seed = (s) => { let h=0; for(let i=0;i<s.length;i++){h=Math.imul(31,h)+s.charCodeAt(i)|0;} return Math.abs(h); };
    const s = seed(cityId + dateStr);
    const codes = [0,1,2,3,45,51,61,63,80,95];
    const code = codes[s % codes.length];
    const baseTemp = { paris:14, london:11, berlin:12, rom:20, barcelona:22, wien:13, amsterdam:11, prag:12, lissabon:19, new_york:15 };
    const base = baseTemp[cityId] || 15;
    const variance = (s % 11) - 5;
    const max = base + variance + 3;
    const min = base + variance - 4;
    const rain = (code >= 51 && code <= 95) ? ((s % 15) + 1) * 0.5 : 0;
    return { code, max, min, rain };
  }
  const wIcon = (c) => { const icons = ["☀️","⛅","☁️","🌫️","🌧️","❄️","🌦️","⛈️","🌡️"]; if(c===0)return icons[0]; if(c<=2)return icons[1]; if(c<=3)return icons[2]; if(c<=49)return icons[3]; if(c<=69)return icons[4]; if(c<=79)return icons[5]; if(c<=82)return icons[6]; if(c<=99)return icons[7]; return icons[8]; };
  const wLabel = (c) => { if(c===0)return lang==="de"?"Klar":"Clear"; if(c<=2)return lang==="de"?"Teils bew.":"Partly cloudy"; if(c<=3)return lang==="de"?"Bewölkt":"Cloudy"; if(c<=49)return lang==="de"?"Nebel":"Foggy"; if(c<=69)return lang==="de"?"Regen":"Rain"; if(c<=79)return lang==="de"?"Schnee":"Snow"; if(c<=82)return lang==="de"?"Schauer":"Showers"; if(c<=99)return lang==="de"?"Gewitter":"Storm"; return"?"; };
  if (!city || !tripDays || !tripDays.length) return null;
  const weatherData = tripDays.map(date => ({ date, ...pseudoWeather(city.id, date) }));
  const avgMax = Math.round(weatherData.reduce((s,w)=>s+w.max,0)/weatherData.length);
  const rainDays = weatherData.filter(w=>w.rain>0).length;
  return (
    <div style={{marginBottom:18,background:th.card,border:`1px solid ${th.border}`,borderRadius:16,padding:"14px 16px"}}>
      <div style={{fontSize:"0.7rem",color:th.textFaint,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>🌤 {lang==="de"?"Wettervorschau":"Weather Forecast"} — {city.name}</div>
      <div style={{fontSize:"0.72rem",color:th.textMuted,marginBottom:12}}>📊 {lang==="de"?`Ø ${avgMax}° · ${rainDays} Regentag${rainDays!==1?"e":""}`:`Avg ${avgMax}° · ${rainDays} rainy day${rainDays!==1?"s":""}`}</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:6}}>
        {weatherData.map((w,i) => (
          <div key={w.date} style={{minWidth:76,background:th.surface,border:`2px solid ${getDayColor(i)}44`,borderRadius:14,padding:"10px 8px",textAlign:"center",flexShrink:0}}>
            <div style={{fontSize:"0.65rem",color:getDayColor(i),fontWeight:700,marginBottom:3}}>{formatDateLabel(w.date,lang)}</div>
            <div style={{fontSize:"1.6rem",lineHeight:1.2,marginBottom:4}}>{wIcon(w.code)}</div>
            <div style={{fontSize:"0.82rem",color:th.text,fontWeight:800}}>{Math.round(w.max)}°</div>
            <div style={{fontSize:"0.72rem",color:th.textMuted,marginBottom:2}}>{Math.round(w.min)}°</div>
            {w.rain > 0 && <div style={{fontSize:"0.62rem",color:"#5b8dd9",marginTop:3}}>💧{w.rain.toFixed(1)}mm</div>}
            <div style={{fontSize:"0.6rem",color:th.textFaint,marginTop:3}}>{wLabel(w.code)}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,fontSize:"0.68rem",color:th.textFaint,fontStyle:"italic"}}>* {lang==="de"?"Prognose basiert auf Klimadaten":"Forecast based on climate data"}</div>
    </div>
  );
}

  function LocationCard({ loc, city, tripDays, locationDays, locationNotes, locationTimes, onDayChange, onNoteChange, onTimeChange, onRemove, lang, th, dragHandleProps, isDragging }) {
    const t = TRANSLATIONS[lang];
    const [showInfo, setShowInfo] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const assignedDay = locationDays[loc.id];
    const note = locationNotes[loc.id] || "";
    const assignedTime = locationTimes?.[loc.id] || "";
    const cost = getEntryCost(loc.name, city);
    const rating = getRating(loc.name, city);
    const info = getLocationInfo(loc.name, city);
    const opening = (() => {
      if (!assignedDay) return null;
      if (loc.closedDays && loc.closedDays.length > 0) {
        const d2 = new Date(assignedDay + "T12:00:00");
        const dNames = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
        const eNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const closed = loc.closedDays.some(cd => cd === dNames[d2.getDay()] || cd === eNames[d2.getDay()]);
        return { isOpen: !closed, hours: loc.openingHoursText || null, note: null, fromAI: true };
      }
      if (loc.openingHoursText) return { isOpen: true, hours: loc.openingHoursText, note: null, fromAI: true };
      return getOpeningInfo(loc.name, assignedDay, city);
    })();
    const dayIndex = tripDays.indexOf(assignedDay);
    const dayColor = dayIndex >= 0 ? getDayColor(dayIndex) : th.accent;
    const isClosed = opening && !opening.isOpen;
    return (
      <div style={{
        background: isDragging ? th.cardHover : th.card,
        border: `1px solid ${isClosed ? th.warning : (isDragging ? th.borderHover : th.border)}`,
        borderRadius: 16, padding: "12px 14px", marginBottom: 8,
        boxShadow: isDragging ? th.shadowHover : th.shadow,
        transition: "all 0.2s", cursor: "default",
        opacity: isDragging ? 0.85 : 1,
      }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
          <div {...dragHandleProps} style={{ cursor:"grab", color:th.textFaint, fontSize:"1.1rem", paddingTop:2, flexShrink:0 }}>⠿</div>
          <div style={{ fontSize:"1.6rem", flexShrink:0 }}>{loc.icon || "📍"}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <span style={{ fontWeight:700, fontSize:"0.95rem", color:th.text }}>{loc.name}</span>
              {loc.type && <span style={{ fontSize:"0.68rem", background:th.tag, color:th.tagText, borderRadius:6, padding:"1px 7px" }}>{loc.type}</span>}
              {isClosed && <span style={{ fontSize:"0.68rem", background:th.warningBg, color:th.warning, borderRadius:6, padding:"1px 7px", fontWeight:600 }}>⚠ {t.closed}</span>}
            </div>
            {loc.area && <div style={{ fontSize:"0.75rem", color:th.textMuted, marginTop:2 }}>📍 {loc.area}</div>}
            {loc.duration && <div style={{ fontSize:"0.72rem", color:th.textFaint, marginTop:1 }}>⏱ {loc.duration}</div>}
            {rating && <StarRating stars={rating.stars} reviews={rating.reviews} price={rating.price} badge={rating.badge} lang={lang} th={th} />}
            {cost && (
              <div style={{ fontSize:"0.75rem", color:th.textMuted, marginTop:4 }}>
                🎟 {cost.min === 0 && cost.max === 0 ? t.free : `${cost.currency}${cost.min}${cost.max !== cost.min ? "–"+cost.max : ""}${cost.note ? " (" + cost.note + ")" : ""}`}
              </div>
            )}
            {opening && (
              <div style={{ fontSize:"0.72rem", color: isClosed ? th.warning : th.textMuted, marginTop:2 }}>
                🕐 {isClosed ? t.closedDay : opening.hours || t.unknownHours}{opening.note ? " · " + opening.note : ""}
              </div>
            )}
            {showInfo && info && (
              <div style={{ marginTop:8, padding:"8px 10px", background:th.accentLight, borderRadius:10, fontSize:"0.78rem", color:th.text }}>
                <div style={{ marginBottom:4, fontStyle:"italic" }}>{info.short}</div>
                <ul style={{ margin:0, paddingLeft:16 }}>{info.highlights.map((h,i)=><li key={i} style={{ color:th.textMuted }}>{h}</li>)}</ul>
              </div>
            )}
            {assignedDay && (
              <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:"0.7rem", color:th.textFaint }}>🕐</span>
                <input
                  type="time"
                  value={assignedTime}
                  onChange={e => onTimeChange(loc.id, e.target.value)}
                  style={{ background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"3px 8px", fontSize:"0.78rem", color:th.text, cursor:"pointer" }}
                />
                {assignedTime && <span style={{ fontSize:"0.7rem", color:th.accent, fontWeight:600 }}>{assignedTime} Uhr</span>}
              </div>
            )}
            {showNote && (
              <div style={{ marginTop:6 }}>
                <input
                  value={note}
                  onChange={e => onNoteChange(loc.id, e.target.value)}
                  placeholder={t.notePlaceholder}
                  style={{ width:"100%", background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"5px 8px", fontSize:"0.78rem", color:th.text, boxSizing:"border-box" }}
                />
              </div>
            )}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
            <button onClick={()=>onRemove(loc.id)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"1rem", padding:"2px 4px" }} title="Entfernen">✕</button>
            {info && <button onClick={()=>setShowInfo(s=>!s)} style={{ background:"none", border:"none", cursor:"pointer", color:th.accent, fontSize:"0.7rem", padding:"2px 4px" }}>{showInfo ? t.infoHide : t.infoShow}</button>}
            <button onClick={()=>setShowNote(s=>!s)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textMuted, fontSize:"0.7rem", padding:"2px 4px" }}>📝</button>
          </div>
        </div>
        <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:"0.72rem", color:th.textFaint, textTransform:"uppercase", letterSpacing:1 }}>{t.visitDay}:</span>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {tripDays.map((d,i) => (
              <button key={d} onClick={()=>onDayChange(loc.id, assignedDay===d ? null : d)}
                style={{ fontSize:"0.7rem", padding:"2px 8px", borderRadius:8, border:`1.5px solid ${assignedDay===d ? getDayColor(i) : th.border}`, background: assignedDay===d ? getDayColor(i)+"22" : "transparent", color: assignedDay===d ? getDayColor(i) : th.textMuted, cursor:"pointer", fontWeight: assignedDay===d ? 700 : 400 }}>
                {formatDateLabel(d, lang||"de")}
              </button>
            ))}
          </div>
        </div>
        {loc.address && (
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`} target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-block", marginTop:6, fontSize:"0.72rem", color:th.accent, textDecoration:"none" }}>🗺 {t.openInMaps}</a>
        )}
      </div>
    );
  }

  function PlaceSearch({ onAdd, tripDays, lang, th }) {
    const t = TRANSLATIONS[lang];
    const [query, setQuery] = useState("");
    const [srchLoading, setSrchLoading] = useState(false);
    const [srchResults, setSrchResults] = useState([]);
    const [srchError, setSrchError] = useState("");
    const [srchDay, setSrchDay] = useState(null);
    const gIcon = (r) => { const tp=(r.type||"").toLowerCase(),cl=(r.class||"").toLowerCase(); if(tp==="restaurant")return"🍽️"; if(tp==="cafe")return"☕"; if(tp==="museum")return"🏛️"; if(tp==="park"||cl==="leisure")return"🌳"; if(cl==="tourism")return"🗺️"; return"📍"; };
    const gType = (r) => { const tp=(r.type||"").toLowerCase(),cl=(r.class||"").toLowerCase(); if(tp==="restaurant")return"Restaurant"; if(tp==="cafe")return"Cafe"; if(tp==="museum")return"Museum"; if(tp==="park"||cl==="leisure")return"Park"; if(cl==="tourism")return lang==="de"?"Sehenswürdigkeit":"Attraction"; return lang==="de"?"Ort":"Place"; };
    const doSearch = useCallback(async () => {
      if (!query.trim()) return;
      setSrchLoading(true); setSrchError(""); setSrchResults([]);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,{headers:{"Accept-Language":lang==="de"?"de":"en"}});
        const data = await res.json();
        if (!data.length) setSrchError(t.searchNoResults); else setSrchResults(data);
      } catch { setSrchError(lang==="de"?"Netzwerkfehler.":"Network error."); }
      setSrchLoading(false);
    }, [query, lang, t]);
    const addR = (r) => {
      onAdd({ id:Date.now()+Math.random(), name:r.name||r.display_name.split(",")[0], type:gType(r), icon:gIcon(r), address:r.display_name, area:r.address?.city||r.address?.town||r.address?.village||"", lat:parseFloat(r.lat), lng:parseFloat(r.lon), duration:"1 Std." }, srchDay);
      setSrchResults([]); setQuery("");
    };
    return (
      <div style={{ marginBottom:16, background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px" }}>
        <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>🔍 {t.searchTab}</div>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input value={query} onChange={e=>{setQuery(e.target.value);setSrchError("");}} onKeyDown={e=>e.key==="Enter"&&doSearch()}
            placeholder={t.searchPlaceholder}
            style={{ flex:1, background:th.input, border:`1px solid ${srchError?th.warning:th.inputBorder}`, borderRadius:10, padding:"8px 12px", fontSize:"0.85rem", color:th.text, outline:"none" }}/>
          <button onClick={doSearch} disabled={srchLoading}
            style={{ background:th.accent, color:th.bg, border:"none", borderRadius:10, padding:"8px 16px", fontWeight:700, fontSize:"0.85rem", cursor:srchLoading?"wait":"pointer", display:"flex", alignItems:"center", gap:6 }}>
            {srchLoading?<Spinner size={14} color={th.bg}/>:"🔍"} {srchLoading?t.searching:t.search}
          </button>
        </div>
        {srchError && <div style={{ fontSize:"0.75rem", color:th.warning, marginBottom:6 }}>{srchError}</div>}
        {srchResults.length>0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:6 }}>
            {tripDays.length>0 && (
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:4, alignItems:"center" }}>
                <span style={{ fontSize:"0.7rem", color:th.textFaint }}>{lang==="de"?"Tag:":"Day:"}</span>
                <button onClick={()=>setSrchDay(null)} style={{ fontSize:"0.68rem", padding:"1px 7px", borderRadius:7, border:`1px solid ${!srchDay?th.accent:th.border}`, background:!srchDay?th.accentLight:"transparent", color:!srchDay?th.accent:th.textMuted, cursor:"pointer" }}>{lang==="de"?"Kein":"None"}</button>
                {tripDays.map((d,i)=>(
                  <button key={d} onClick={()=>setSrchDay(srchDay===d?null:d)} style={{ fontSize:"0.68rem", padding:"1px 7px", borderRadius:7, border:`1.5px solid ${srchDay===d?getDayColor(i):th.border}`, background:srchDay===d?getDayColor(i)+"22":"transparent", color:srchDay===d?getDayColor(i):th.textMuted, cursor:"pointer", fontWeight:srchDay===d?700:400 }}>{formatDateLabel(d, lang||"de")}</button>
                ))}
              </div>
            )}
            {srchResults.map((r,i)=>(
              <div key={i} onClick={()=>addR(r)} style={{ display:"flex", alignItems:"center", gap:8, background:th.surface, border:`1px solid ${th.border}`, borderRadius:10, padding:"8px 10px", cursor:"pointer" }}>
                <span style={{ fontSize:"1.2rem", flexShrink:0 }}>{gIcon(r)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:"0.83rem", color:th.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.name||r.display_name.split(",")[0]}</div>
                  <div style={{ fontSize:"0.7rem", color:th.textMuted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.display_name}</div>
                </div>
                <span style={{ background:th.accent, color:th.bg, borderRadius:7, padding:"3px 10px", fontSize:"0.72rem", fontWeight:700, flexShrink:0 }}>+</span>
              </div>
            ))}
            <div style={{ fontSize:"0.65rem", color:th.textFaint, marginTop:2 }}>🌍 OpenStreetMap · Nominatim</div>
          </div>
        )}
      </div>
    );
  }

  function LinkAnalyzer({ city, onAdd, tripDays, lang, th }) {
    const t = TRANSLATIONS[lang];
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDemo, setShowDemo] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [apiKey, setApiKey] = useState(() => safeLocalGet("rp_openai_key", ""));
    const [showApiInput, setShowApiInput] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(() => safeLocalGet("rp_openai_key", ""));
    const [apiKeySaved, setApiKeySaved] = useState(false);

    const saveApiKey = () => {
      safeLocalSet("rp_openai_key", apiKeyInput);
      setApiKey(apiKeyInput);
      setApiKeySaved(true);
      setTimeout(() => { setApiKeySaved(false); setShowApiInput(false); }, 1500);
    };
    const deleteApiKey = () => {
      safeLocalSet("rp_openai_key", "");
      setApiKey(""); setApiKeyInput("");
    };

    const analyze = useCallback(async () => {
      const trimmed = url.trim();
      if (!trimmed) { setError(t.errorEmpty); return; }
      setLoading(true); setError("");
      if (apiKey) {
        try {
          const prompt = `Analysiere diese URL und extrahiere Ortsinformationen. URL: ${trimmed}

Antworte NUR mit JSON:
{"name":"Name","type":"Sehenswürdigkeit|Restaurant|Museum|Park|Markt|Cafe|Bar|Andere","address":"Adresse","area":"Stadtteil","lat":0.0,"lng":0.0,"duration":"1 Std.","icon":"Emoji","openingHoursText":"Öffnungszeiten oder null","closedDays":[],"entryCostText":"Preis oder null"}`;
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 400 }),
          });
          if (!res.ok) throw new Error("API Fehler " + res.status);
          const data = await res.json();
          const txt = data.choices[0].message.content.trim();
          const m = txt.match(/\{[\s\S]*\}/);
          if (!m) throw new Error("Kein JSON");
          const result = JSON.parse(m[0]);
          const loc = { id: Date.now() + Math.random(), name: result.name || "Unbekannt", type: result.type || "Sehenswürdigkeit", address: result.address || "", area: result.area || "", lat: result.lat || null, lng: result.lng || null, duration: result.duration || "", icon: result.icon || "📍", openingHoursText: result.openingHoursText || null, closedDays: result.closedDays || [], entryCostText: result.entryCostText || null, sourceUrl: trimmed };
          onAdd(loc, selectedDay); setUrl(""); setLoading(false); return;
        } catch(e) { setError("KI-Fehler: " + e.message); setLoading(false); return; }
      }
      setTimeout(() => {
        const matchers = city?.linkMatchers || [];
        const match = matchers.find(m => m.pattern.test(trimmed));
        if (match) {
          const loc = city.sampleLocations[match.locationIndex];
          if (loc) { onAdd({ ...loc, id: Date.now() + Math.random() }, selectedDay); setUrl(""); setLoading(false); return; }
        }
        setError(t.errorNotFound); setLoading(false);
      }, 900);
    }, [url, city, t, onAdd, apiKey, selectedDay]);
    return (
      <div style={{ marginBottom:16, background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase" }}>{t.insertLink}</div>
          <button onClick={()=>setShowApiInput(s=>!s)} style={{ fontSize:"0.68rem", padding:"2px 10px", borderRadius:7, border:`1px solid ${apiKey?th.success:th.warning}`, background:"transparent", color:apiKey?th.success:th.warning, cursor:"pointer", fontWeight:600 }}>
            {apiKey ? "✓ "+t.apiActive : "⚠ "+t.apiMissing}
          </button>
        </div>
        {showApiInput && (
          <div style={{ marginBottom:12, padding:"10px 12px", background:th.surface, borderRadius:10, border:`1px solid ${th.border}` }}>
            <div style={{ fontSize:"0.75rem", color:th.textMuted, marginBottom:6 }}>🔑 {t.apiTitle} · <span style={{color:th.textFaint}}>{t.apiHint}</span></div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <input type="password" value={apiKeyInput} onChange={e=>setApiKeyInput(e.target.value)} placeholder="sk-..." style={{ flex:1, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"5px 9px", fontSize:"0.8rem", color:th.text }} />
              <button onClick={saveApiKey} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:8, padding:"5px 12px", fontWeight:700, fontSize:"0.78rem", cursor:"pointer" }}>{apiKeySaved?t.apiSaved:t.apiSave}</button>
              {apiKey && <button onClick={deleteApiKey} style={{ background:"none", border:`1px solid ${th.border}`, borderRadius:8, padding:"5px 10px", color:th.warning, fontSize:"0.75rem", cursor:"pointer" }}>{t.apiDelete}</button>}
            </div>
            {apiKey ? <div style={{ marginTop:4, fontSize:"0.7rem", color:th.success }}>✓ Key aktiv — beliebige URLs werden per KI analysiert</div> : <div style={{ marginTop:4, fontSize:"0.7rem", color:th.textFaint }}>Ohne Key: nur Demo-Links erkennbar</div>}
          </div>
        )}
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <input value={url} onChange={e=>{setUrl(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&analyze()}
            placeholder={t.linkPlaceholder}
            style={{ flex:1, background:th.input, border:`1px solid ${error?th.warning:th.inputBorder}`, borderRadius:10, padding:"8px 12px", fontSize:"0.85rem", color:th.text, outline:"none" }}/>
          <button onClick={analyze} disabled={loading}
            style={{ background:th.accent, color:th.bg, border:"none", borderRadius:10, padding:"8px 16px", fontWeight:700, fontSize:"0.85rem", cursor:loading?"wait":"pointer", display:"flex", alignItems:"center", gap:6, alignItems:"center" }}>
            {loading ? <Spinner size={14} color={th.bg}/> : null}{loading ? t.analyzing : t.analyze}
          </button>
        </div>
        {error && <div style={{ marginTop:4, fontSize:"0.75rem", color:th.warning }}>{error}</div>}
        {city?.demoLinks && (
          <div style={{ marginTop:6 }}>
            <button onClick={()=>setShowDemo(s=>!s)} style={{ background:"none", border:"none", color:th.textMuted, fontSize:"0.75rem", cursor:"pointer", padding:0 }}>{t.demo} {showDemo?"▲":"▼"}</button>
            {showDemo && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:4 }}>
                {city.demoLinks.map((l,i)=>(
                  <button key={i} onClick={()=>setUrl(l)} style={{ fontSize:"0.68rem", background:th.accentLight, color:th.accent, border:`1px solid ${th.border}`, borderRadius:6, padding:"2px 8px", cursor:"pointer" }}>
                    {city.sampleLocations[i]?.icon} {city.sampleLocations[i]?.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function BudgetPanel({ locations, city, lang, th }) {
    const t = TRANSLATIONS[lang];
    const [extras, setExtras] = useState(0);
    let total = 0;
    const items = locations.map(loc => {
      const cost = getEntryCost(loc.name, city);
      const avg = cost ? (cost.min + cost.max) / 2 : 0;
      total += avg;
      return { name: loc.name, icon: loc.icon, cost, avg };
    });
    total += Number(extras) || 0;
    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginTop:12 }}>
        <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.accent, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>{t.budgetTitle}</div>
        {items.map((item,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"0.8rem", color:th.textMuted, marginBottom:4 }}>
            <span>{item.icon} {item.name}</span>
            <span style={{ color: item.avg===0 ? th.success : th.text, fontWeight:600 }}>
              {item.cost ? (item.avg===0 ? t.free : `${item.cost.currency}${item.avg.toFixed(2)}`) : "–"}
            </span>
          </div>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, borderTop:`1px solid ${th.border}`, paddingTop:8 }}>
          <span style={{ fontSize:"0.78rem", color:th.textMuted }}>{t.budgetExtras}</span>
          <input type="number" min="0" value={extras} onChange={e=>setExtras(e.target.value)}
            style={{ width:70, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:7, padding:"3px 7px", fontSize:"0.8rem", color:th.text }} />
        </div>
        <div style={{ marginTop:8, fontWeight:700, color:th.gold, fontSize:"1rem" }}>{t.budgetTotal}: {total.toFixed(2)}</div>
        <div style={{ fontSize:"0.68rem", color:th.textFaint, marginTop:2 }}>{t.budgetNote}</div>
      </div>
    );
  }

  function RouteOptimizer({ locations, locationDays, tripDays, travelMode, onApply, lang, th }) {
    const t = TRANSLATIONS[lang];
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState(null);
    const [error, setError] = useState("");
    const apiKey = safeLocalGet("rp_openai_key", "");

    const optimize = async () => {
      if (!apiKey) { setError(lang==="de" ? "Kein API-Key gesetzt." : "No API key set."); return; }
      const locs = locations.filter(l => locationDays[l.id]);
      if (locs.length < 2) { setError(lang==="de" ? "Mind. 2 Orte mit Tag nötig." : "Need at least 2 places with a day."); return; }
      setLoading(true); setError(""); setSuggestion(null);
      try {
        const locList = locs.map(l => `- ${l.name} (Tag: ${locationDays[l.id]}, Typ: ${l.type||""}, Öffnungszeiten: ${l.openingHoursText||"unbekannt"}, Koordinaten: ${l.lat||"?"},${l.lng||"?"})` ).join("\n");
        const prompt = `Du bist ein Reiseassistent. Optimiere die Reihenfolge dieser Orte pro Tag, um unnötige Wege zu vermeiden und Öffnungszeiten zu berücksichtigen.

Orte:
${locList}

Antworte NUR mit JSON:
{"days":{"DATUM":["Ortsname1","Ortsname2"],"DATUM2":[...]},"tips":["Tipp1","Tipp2","Tipp3"]}`;
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.3, max_tokens: 600 }),
        });
        if (!res.ok) throw new Error("API " + res.status);
        const data = await res.json();
        const txt = data.choices[0].message.content.trim();
        const m = txt.match(/\{[\s\S]*\}/);
        if (!m) throw new Error("Kein JSON");
        setSuggestion(JSON.parse(m[0]));
      } catch(e) { setError("Fehler: " + e.message); }
      setLoading(false);
    };

    const apply = () => {
      if (!suggestion?.days) return;
      const newDays = { ...locationDays };
      Object.entries(suggestion.days).forEach(([date, names]) => {
        names.forEach(name => {
          const loc = locations.find(l => l.name === name);
          if (loc) newDays[loc.id] = date;
        });
      });
      onApply(newDays);
      setSuggestion(null);
    };

    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:14, padding:"12px 14px", marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontWeight:700, fontSize:"0.82rem", color:th.accent }}>🤖 {lang==="de" ? "KI-Routenoptimierung" : "AI Route Optimization"}</div>
          <button onClick={optimize} disabled={loading} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:9, padding:"5px 14px", fontWeight:700, fontSize:"0.78rem", cursor:loading?"wait":"pointer", display:"flex", alignItems:"center", gap:6, alignItems:"center" }}>
            {loading ? <Spinner size={12} color={th.bg}/> : "✨"} {loading ? (lang==="de"?"Analysiere...":"Analyzing...") : (lang==="de"?"Route optimieren":"Optimize Route")}
          </button>
        </div>
        {!apiKey && <div style={{ fontSize:"0.72rem", color:th.warning }}>⚠ {lang==="de" ? "API-Key nötig für KI-Optimierung" : "API key required for AI optimization"}</div>}
        {error && <div style={{ fontSize:"0.72rem", color:th.warning, marginTop:4 }}>{error}</div>}
        {suggestion && (
          <div style={{ marginTop:8 }}>
            {suggestion.tips && suggestion.tips.length > 0 && (
              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:"0.72rem", color:th.textMuted, fontWeight:600, marginBottom:4 }}>💡 {lang==="de"?"KI-Tipps":"AI Tips"}:</div>
                {suggestion.tips.map((tip,i) => <div key={i} style={{ fontSize:"0.72rem", color:th.textMuted, marginBottom:2 }}>• {tip}</div>)}
              </div>
            )}
            {suggestion.days && Object.entries(suggestion.days).map(([date, names], di) => (
              <div key={date} style={{ marginBottom:6 }}>
                <div style={{ fontSize:"0.72rem", color:getDayColor(tripDays.indexOf(date)), fontWeight:700 }}>{formatDateLabel(date, lang||"de")}</div>
                {names.map((n,i) => <div key={i} style={{ fontSize:"0.75rem", color:th.text, paddingLeft:10 }}>{i+1}. {n}</div>)}
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:10 }}>
              <button onClick={apply} style={{ background:th.success, color:"#fff", border:"none", borderRadius:8, padding:"5px 14px", fontWeight:700, fontSize:"0.78rem", cursor:"pointer" }}>
                ✓ {lang==="de"?"Übernehmen":"Apply"}
              </button>
              <button onClick={()=>setSuggestion(null)} style={{ background:"none", border:`1px solid ${th.border}`, borderRadius:8, padding:"5px 10px", color:th.textMuted, fontSize:"0.75rem", cursor:"pointer" }}>
                {lang==="de"?"Verwerfen":"Discard"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function TripSummaryBar({ locations, locationDays, locationTimes, tripDays, travelMode, city, lang, th }) {
  const totalLocs = locations.filter(l => locationDays[l.id]).length;
  const unassigned = locations.length - totalLocs;

  // Gesamtzeit berechnen
  let totalMin = 0;
  tripDays.forEach(d => {
    const dayLocs = locations.filter(l => locationDays[l.id] === d);
    dayLocs.forEach(loc => {
      const m = (loc.duration || "").match(/(\d+[,.]?\d*)/);
      if (m) totalMin += Math.round(parseFloat(m[1].replace(",",".")) * 60);
    });
    for (let i = 1; i < dayLocs.length; i++) {
      const t = calcTravelTime(dayLocs[i-1], dayLocs[i]);
      if (t) {
        if (travelMode === "walking") totalMin += t.walkMin;
        else if (travelMode === "driving") totalMin += Math.max(3, Math.round(t.transitMin * 0.6));
        else totalMin += t.transitMin;
      }
    }
  });

  // Gesamtkosten
  let costMin = 0, costMax = 0;
  let currency = "€";
  locations.forEach(loc => {
    const c = getEntryCost(loc.name, city);
    if (c) { costMin += c.min; costMax += c.max; currency = c.currency; }
  });

  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const timeStr = hrs > 0 ? `${hrs}h ${mins > 0 ? mins+"min" : ""}` : `${mins}min`;

  if (locations.length === 0) return null;
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
      <div style={{ flex:1, minWidth:120, background:th.surface, border:`1px solid ${th.border}`, borderRadius:12, padding:"10px 14px", textAlign:"center" }}>
        <div style={{ fontSize:"0.62rem", color:th.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>⏱ {lang==="de"?"Gesamtzeit":"Total Time"}</div>
        <div style={{ fontSize:"1.1rem", fontWeight:800, color:th.accent }}>{totalMin > 0 ? timeStr : "–"}</div>
        <div style={{ fontSize:"0.65rem", color:th.textMuted, marginTop:2 }}>{lang==="de"?"inkl. Transfers":"incl. transfers"}</div>
      </div>
      <div style={{ flex:1, minWidth:120, background:th.surface, border:`1px solid ${th.border}`, borderRadius:12, padding:"10px 14px", textAlign:"center" }}>
        <div style={{ fontSize:"0.62rem", color:th.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>🎟 {lang==="de"?"Eintrittskosten":"Entry Costs"}</div>
        <div style={{ fontSize:"1.1rem", fontWeight:800, color:th.gold }}>{costMax > 0 ? `${currency}${costMin}–${costMax}` : lang==="de"?"Kostenlos":"Free"}</div>
        <div style={{ fontSize:"0.65rem", color:th.textMuted, marginTop:2 }}>{lang==="de"?"Schätzung":"estimate"}</div>
      </div>
      <div style={{ flex:1, minWidth:120, background:th.surface, border:`1px solid ${th.border}`, borderRadius:12, padding:"10px 14px", textAlign:"center" }}>
        <div style={{ fontSize:"0.62rem", color:th.textFaint, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>📍 {lang==="de"?"Orte":"Places"}</div>
        <div style={{ fontSize:"1.1rem", fontWeight:800, color:th.text }}>{totalLocs}<span style={{fontSize:"0.75rem",color:th.textFaint}}>/{locations.length}</span></div>
        <div style={{ fontSize:"0.65rem", color:th.textMuted, marginTop:2 }}>{unassigned > 0 ? `${unassigned} ${lang==="de"?"ohne Tag":"unassigned"}` : lang==="de"?"alle geplant":"all planned"}</div>
      </div>
    </div>
  );
}

function RouteTimeline({ locations, locationDays, locationTimes, tripDays, travelMode, city, lang, th, onDayChange }) {
      const t = TRANSLATIONS[lang];
      const [dragLoc, setDragLoc] = useState(null);
      const [dragOverDay, setDragOverDay] = useState(null);
      const byDay = {};
      tripDays.forEach(d => { byDay[d] = []; });
      locations.forEach(loc => {
        const d = locationDays[loc.id];
        if (d && byDay[d]) byDay[d].push(loc);
      });
      const allDays = tripDays;
      if (allDays.filter(d => (byDay[d]||[]).length > 0).length === 0) return <div style={{ color:th.textFaint, fontSize:"0.82rem", textAlign:"center", padding:"20px 0" }}>{t.noRouteHint}</div>;
      return (
        <div>
          {dragLoc && (
            <div style={{ fontSize:"0.72rem", color:th.accent, marginBottom:8, padding:"6px 12px", background:th.accentLight, borderRadius:9, border:`1px solid ${th.accent}` }}>
              🖱 {lang==="de" ? `"${dragLoc.name}" auf einen Tag ziehen` : `Drag "${dragLoc.name}" to a day`}
            </div>
          )}
          {allDays.map((d, di) => {
            const locs = byDay[d] || [];
            const color = getDayColor(tripDays.indexOf(d));
            const isOver = dragOverDay === d;
            const dayConflicts = detectConflicts(locs, locationTimes);
            const conflictIds = new Set(dayConflicts.flatMap(c => [c.a.id, c.b.id]));
            if (locs.length === 0 && !dragLoc) return null;
            return (
              <div key={d} style={{ marginBottom:20 }}
                onDragOver={e => { e.preventDefault(); setDragOverDay(d); }}
                onDragLeave={() => setDragOverDay(null)}
                onDrop={e => { e.preventDefault(); if (dragLoc && onDayChange) onDayChange(dragLoc.id, d); setDragLoc(null); setDragOverDay(null); }}
              >
                <div style={{ fontWeight:700, fontSize:"0.8rem", color, textTransform:"uppercase", letterSpacing:1, marginBottom:8, display:"flex", alignItems:"center", gap:8, background: isOver ? color+"18" : "transparent", borderRadius:8, padding: isOver ? "4px 8px" : "0", transition:"all 0.15s", border: isOver ? `1.5px dashed ${color}` : "1.5px solid transparent" }}>
                  <span style={{ width:10, height:10, borderRadius:"50%", background:color, display:"inline-block" }}/>
                  {formatDateLabel(d, lang||"de")}
                  {isOver && dragLoc && <span style={{ fontSize:"0.68rem", marginLeft:4 }}>⬇ {lang==="de"?"Hier ablegen":"Drop here"}</span>}
                  {dayConflicts.length > 0 && <span style={{ fontSize:"0.65rem", background:th.warningBg, color:th.warning, borderRadius:6, padding:"1px 7px", marginLeft:4, fontWeight:700 }}>⚠ {dayConflicts.length} {lang==="de"?"Konflikt":"Conflict"}{dayConflicts.length>1?"e":""}</span>}
                </div>
                {(() => {
                  let dayMin = 0;
                  locs.forEach(loc => { dayMin += parseDurationMin(loc.duration); });
                  for (let i = 1; i < locs.length; i++) {
                    const t = calcTravelTime(locs[i-1], locs[i]);
                    if (t) dayMin += travelMode==="walking" ? t.walkMin : travelMode==="driving" ? Math.max(3,Math.round(t.transitMin*0.6)) : t.transitMin;
                  }
                  let costMin = 0, costMax = 0, currency = "€";
                  locs.forEach(loc => { const c = getEntryCost(loc.name, city); if(c){costMin+=c.min;costMax+=c.max;currency=c.currency;} });
                  const hrs = Math.floor(dayMin/60), mins = dayMin%60;
                  const timeStr = hrs>0 ? `${hrs}h${mins>0?` ${mins}min`:""}` : `${mins}min`;
                  return locs.length > 0 ? (
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                      <span style={{ fontSize:"0.68rem", background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:"2px 9px", color:th.textMuted }}>⏱ {timeStr}</span>
                      <span style={{ fontSize:"0.68rem", background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:"2px 9px", color:th.textMuted }}>📍 {locs.length} {lang==="de"?"Orte":"places"}</span>
                      {costMax > 0 && <span style={{ fontSize:"0.68rem", background:th.goldBg, border:`1px solid ${th.gold}44`, borderRadius:20, padding:"2px 9px", color:th.gold }}>🎫 {currency}{costMin}{costMax!==costMin?`–${costMax}`:""}</span>}
                      {costMax === 0 && costMin === 0 && locs.some(l => getEntryCost(l.name,city)) && <span style={{ fontSize:"0.68rem", background:th.goldBg, border:`1px solid ${th.gold}44`, borderRadius:20, padding:"2px 9px", color:th.gold }}>🎫 {lang==="de"?"Kostenlos":"Free"}</span>}
                    </div>
                  ) : null;
                })()}
                {dayConflicts.length > 0 && (
                  <div style={{ background:th.warningBg, borderRadius:9, padding:"7px 12px", marginBottom:8, fontSize:"0.72rem", color:th.warning }}>
                    {dayConflicts.map((c,i) => <div key={i}>⏰ <b>{c.a.name}</b> & <b>{c.b.name}</b> {lang==="de"?"überlappen zeitlich":"overlap in time"}</div>)}
                  </div>
                )}
                {locs.map((loc, li) => {
                  const travel = li > 0 ? calcTravelTime(locs[li-1], loc) : null;
                  const hasConflict = conflictIds.has(loc.id);
                  return (
                    <div key={loc.id} draggable onDragStart={() => setDragLoc(loc)} onDragEnd={() => { setDragLoc(null); setDragOverDay(null); }} style={{ opacity: dragLoc?.id === loc.id ? 0.4 : 1, transition:"opacity 0.15s" }}>
                      {travel && (
                        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0 4px 18px", fontSize:"0.72rem", color:th.textFaint }}>
                          <span style={{ width:1, height:20, background:th.border, display:"inline-block" }}/>
                          {travelMode==="walking" ? `🚶 ${travel.walkMin} min` : travelMode==="transit" ? `🚇 ${travel.transitMin} min` : `🚗 ${Math.max(3,Math.round(travel.transitMin*0.6))} min`}
                          <span>· {travel.distKm} km</span>
                        </div>
                      )}
                      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 8px", background:th.surface, borderRadius:10, border:`1px solid ${hasConflict ? th.warning : th.border}`, cursor:"grab", marginBottom:4 }}>
                        <span style={{ color:th.textFaint, fontSize:"0.8rem" }}>⠿</span>
                        <span style={{ fontSize:"1.2rem" }}>{loc.icon||"📍"}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:"0.85rem", color:th.text }}>{loc.name}</div>
                          {loc.area && <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{loc.area}</div>}
                        </div>
                        {locationTimes?.[loc.id] && <span style={{ fontSize:"0.7rem", color: hasConflict ? th.warning : th.accent, fontWeight:600 }}>🕐 {locationTimes[loc.id]}</span>}
                        {loc.duration && <div style={{ fontSize:"0.72rem", color:th.textFaint }}>⏱ {loc.duration}</div>}
                        {hasConflict && <span style={{ fontSize:"0.7rem", color:th.warning, marginLeft:2 }}>⚠</span>}
                      </div>
                    </div>
                  );
                })}
                {locs.length === 0 && isOver && (
                  <div style={{ fontSize:"0.72rem", color, textAlign:"center", padding:"10px 0", border:`1.5px dashed ${color}`, borderRadius:9 }}>
                    {lang==="de"?"Hier ablegen":"Drop here"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    function MapView({ locations, locationDays, tripDays, travelMode, city, th, lang = "de" }) {
    const mapRef = useRef(null);
      const mapInstanceRef = useRef(null);
      const markersRef = useRef([]);
      const linesRef = useRef([]);
      const [exporting, setExporting] = useState(false);
      const [exportDone, setExportDone] = useState(false);

      const exportMapPNG = async () => {
        if (!mapRef.current) return;
        setExporting(true); setExportDone(false);
        // Load html2canvas if not present
        await new Promise((res, rej) => {
          if (window.html2canvas) { res(); return; }
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        try {
          const canvas = await window.html2canvas(mapRef.current, { useCORS: true, allowTaint: true, scale: 2 });
          const link = document.createElement("a");
          link.download = `reisekarte-${city?.name || "map"}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          setExportDone(true);
          setTimeout(() => setExportDone(false), 2000);
        } catch(e) { console.error(e); }
        setExporting(false);
      };

    useEffect(() => {
      if (!window.L) {
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
        if (!document.getElementById("leaflet-js")) {
          const script = document.createElement("script");
          script.id = "leaflet-js";
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = () => initMap();
          document.head.appendChild(script);
        }
      } else { initMap(); }
      return () => {
        if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      };
    }, []);

    useEffect(() => {
      if (window.L && mapInstanceRef.current) updateMarkers();
    }, [locations, locationDays, tripDays, travelMode]);

    function initMap() {
      if (mapInstanceRef.current || !mapRef.current) return;
      const center = city ? [city.lat, city.lng] : [48.8566, 2.3522];
      const map = window.L.map(mapRef.current).setView(center, 13);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap", maxZoom: 19 }).addTo(map);
      mapInstanceRef.current = map;
      updateMarkers();
    }

    async function updateMarkers() {
          const L = window.L; const map = mapInstanceRef.current;
          if (!L || !map) return;
          markersRef.current.forEach(m => map.removeLayer(m)); markersRef.current = [];
          linesRef.current.forEach(l => map.removeLayer(l)); linesRef.current = [];
          const valid = locations.filter(l => l.lat && l.lng);
          if (!valid.length) return;
          const bounds = [];
          valid.forEach(loc => {
            const di = tripDays.indexOf(locationDays[loc.id]);
            const col = di >= 0 ? DAY_COLORS[di % DAY_COLORS.length] : "#c4a882";
            const icon = L.divIcon({ className:"", html:`<div style="background:${col};width:34px;height:34px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${loc.icon||"\ud83d\udccd"}</div>`, iconSize:[34,34], iconAnchor:[17,17] });
            const cost = (() => { const c = city?.entryCosts; if (!c) return null; const k = Object.keys(c).find(k => loc.name?.toLowerCase().includes(k.toLowerCase())); return k ? c[k] : null; })();
            const rating = (() => { const r = city?.ratings; if (!r) return null; const k = Object.keys(r).find(k => loc.name?.toLowerCase().includes(k.toLowerCase())); return k ? r[k] : null; })();
            const costStr = cost ? (cost.min===0&&cost.max===0 ? '✅ Kostenlos' : `🎟 ${cost.currency}${cost.min}${cost.max!==cost.min?'–'+cost.max:''}`) : '';
            const ratingStr = rating ? `⭐ ${rating.stars.toFixed(1)} (${rating.reviews?.toLocaleString()})${rating.badge?' · '+rating.badge:''}` : '';
            const hoursStr = loc.openingHoursText ? `🕐 ${loc.openingHoursText}` : '';
            const areaStr = loc.area ? `📍 ${loc.area}` : '';
            const typeStr = loc.type ? `<span style="background:${col}22;color:${col};border-radius:4px;padding:1px 6px;font-size:11px;font-weight:600">${loc.type}</span>` : '';
            const popupHtml = `<div style="min-width:180px;max-width:220px;font-family:sans-serif">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                <div style="background:${col};width:10px;height:10px;border-radius:50%;flex-shrink:0"></div>
                <b style="font-size:14px">${loc.icon||'📍'} ${loc.name}</b>
              </div>
              ${typeStr ? `<div style="margin-bottom:5px">${typeStr}</div>` : ''}
              ${areaStr ? `<div style="font-size:12px;color:#666;margin-bottom:3px">${areaStr}</div>` : ''}
              ${hoursStr ? `<div style="font-size:12px;color:#555;margin-bottom:3px">${hoursStr}</div>` : ''}
              ${costStr ? `<div style="font-size:12px;color:#555;margin-bottom:3px">${costStr}</div>` : ''}
              ${ratingStr ? `<div style="font-size:12px;color:#b8860b;margin-bottom:3px">${ratingStr}</div>` : ''}
              ${loc.address ? `<div style="margin-top:6px"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}" target="_blank" style="font-size:11px;color:#5b8dd9">🗺 Google Maps öffnen</a></div>` : ''}
            </div>`;
            const m = L.marker([loc.lat,loc.lng],{icon}).addTo(map).bindPopup(popupHtml, {maxWidth:240});
            markersRef.current.push(m); bounds.push([loc.lat,loc.lng]);
          });
          const byDay = {};
          tripDays.forEach(d => { byDay[d] = []; });
          valid.forEach(loc => { const d = locationDays[loc.id]; if (d && byDay[d]) byDay[d].push(loc); });
          for (let di = 0; di < tripDays.length; di++) {
            const d = tripDays[di]; const locs = byDay[d]; if (locs.length < 2) continue;
            const col = DAY_COLORS[di % DAY_COLORS.length];
            const waypoints = locs.map(l => [l.lat, l.lng]);
            let drawCoords = waypoints;
            let drawStyle;
            if (travelMode === "transit") {
              drawStyle = {color:col, weight:4, dashArray:"6 10", opacity:0.8, lineCap:"round"};
              const line = L.polyline(drawCoords, drawStyle).addTo(map);
              linesRef.current.push(line);
              const arrows = locs.slice(1).map((loc, i) => {
                const prev = locs[i];
                const midLat = (prev.lat + loc.lat) / 2;
                const midLng = (prev.lng + loc.lng) / 2;
                const arrowIcon = L.divIcon({ className:"", html:`<div style="color:${col};font-size:14px;font-weight:bold;">➤</div>`, iconSize:[16,16], iconAnchor:[8,8] });
                return L.marker([midLat, midLng], {icon: arrowIcon, interactive: false}).addTo(map);
              });
              arrows.forEach(a => linesRef.current.push(a));
            } else {
              const profile = travelMode === "driving" ? "car" : "foot";
              const styleW = {color:col, weight:3, dashArray:"8 6", opacity:0.9, lineCap:"round"};
              const styleD = {color:col, weight:4, opacity:0.9, lineCap:"round"};
              drawStyle = travelMode === "walking" ? styleW : styleD;
              let usedReal = false;
              try {
                const coordStr = waypoints.map(([lat,lng]) => `${lng},${lat}`).join(";");
                const res = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coordStr}?overview=full&geometries=geojson`);
                if (res.ok) {
                  const data = await res.json();
                  if (data.code === "Ok" && data.routes?.[0]) {
                    drawCoords = data.routes[0].geometry.coordinates.map(([lng,lat]) => [lat,lng]);
                    usedReal = true;
                  }
                }
              } catch(e) {}
              if (!usedReal) drawStyle = {...drawStyle, dashArray:"6 10", opacity:0.5};
              linesRef.current.push(L.polyline(drawCoords, drawStyle).addTo(map));
            }
          }

        if (bounds.length > 1) map.fitBounds(bounds, {padding:[40,40]});
        else if (bounds.length === 1) map.setView(bounds[0], 15);
        }

      const activeDays = tripDays.filter(d => locations.some(l => locationDays[l.id] === d && l.lat && l.lng));
      return (
      <div>
          {/* Legende */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:6}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {activeDays.map(d => {
                const di = tripDays.indexOf(d);
                const col = DAY_COLORS[di % DAY_COLORS.length];
                const n = locations.filter(l => locationDays[l.id]===d && l.lat && l.lng).length;
                return <div key={d} style={{display:"flex",alignItems:"center",gap:4,background:col+"18",border:`1px solid ${col}55`,borderRadius:8,padding:"2px 8px"}}><div style={{width:8,height:8,borderRadius:"50%",background:col}}/><span style={{fontSize:"0.7rem",color:col,fontWeight:700}}>{formatDateLabel(d, lang||"de")}</span><span style={{fontSize:"0.65rem",color:col,opacity:0.8}}>{n} Ort{n!==1?"e":""}</span></div>;
              })}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{background:th.accentLight,color:th.accent,borderRadius:8,padding:"2px 10px",fontWeight:600,fontSize:"0.7rem"}}>{travelMode==="walking"?"🚶 Zu Fuß · OSRM":travelMode==="transit"?"🚇 ÖPNV · Luftlinie":"🚗 Auto · OSRM"}</span>
              <button onClick={exportMapPNG} disabled={exporting} style={{background:th.accentLight,color:th.accent,border:`1px solid ${th.border}`,borderRadius:8,padding:"3px 10px",fontSize:"0.72rem",fontWeight:700,cursor:exporting?"wait":"pointer",display:"flex",alignItems:"center",gap:4}}>
                {exporting ? <Spinner size={12} color={th.accent}/> : exportDone ? "✓" : "📷"} {exporting ? "Export..." : exportDone ? ((lang||"de")==="de"?"Gespeichert!":"Saved!") : "PNG"}
              </button>
            </div>
          </div>
          <div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${th.border}`,height:400,position:"relative"}}>
        <div ref={mapRef} style={{width:"100%",height:"100%"}} />
        {!locations.filter(l=>l.lat&&l.lng).length && (
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:th.surface,pointerEvents:"none"}}>
            <div style={{fontSize:"2.5rem"}}>🗺️</div>
            <div style={{fontSize:"0.82rem",color:th.textMuted,marginTop:6}}>Füge Orte mit Koordinaten hinzu</div>
            </div>
          )}
          </div>
          </div>
      );
    }

    function MapPlaceholder({ locations, city, th }) {
    const center = city || { lat:48.8566, lng:2.3522, name:"Paris" };
    return (
      <div style={{ position:"relative", background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, overflow:"hidden", height:220, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center", color:th.textMuted }}>
          <div style={{ fontSize:"2.5rem" }}>🗺️</div>
          <div style={{ fontSize:"0.82rem", marginTop:6 }}>{center.name}</div>
          {locations.length > 0 && <div style={{ fontSize:"0.72rem", marginTop:2, color:th.textFaint }}>{locations.length} Orte</div>}
        </div>
        <div style={{ position:"absolute", bottom:8, right:10, fontSize:"0.65rem", color:th.textFaint }}>Karte (Vorschau)</div>
      </div>
    );
  }
  function SavedPlansPanel({ lang, th, onLoad }) {
    const t = TRANSLATIONS[lang];
    const [plans, setPlans] = useState(() => safeLocalGet("rp_plans_v2", []));
    const [name, setName] = useState("");
    const [saved, setSaved] = useState(false);
    const currentPlan = safeLocalGet("rp_current_v2", null);
    const savePlan = () => {
      if (!currentPlan || !name.trim()) return;
      const plan = { ...currentPlan, name: name.trim(), id: Date.now() };
      const updated = [...plans.filter(p=>p.name!==plan.name), plan].slice(-20);
      safeLocalSet("rp_plans_v2", updated);
      setPlans(updated); setSaved(true);
      setTimeout(()=>setSaved(false), 1500);
    };
    const deletePlan = (id) => {
      const updated = plans.filter(p=>p.id!==id);
      safeLocalSet("rp_plans_v2", updated); setPlans(updated);
    };
    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginTop:12 }}>
        <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.accent, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>{t.savedPlans}</div>
        <div style={{ display:"flex", gap:6, marginBottom:10 }}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={t.planNamePlaceholder}
            style={{ flex:1, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"5px 9px", fontSize:"0.8rem", color:th.text }} />
          <button onClick={savePlan} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:8, padding:"5px 12px", fontWeight:700, fontSize:"0.8rem", cursor:"pointer" }}>
            {saved ? t.saved : t.save}
          </button>
        </div>
        {plans.length === 0 ? (
          <div style={{ fontSize:"0.78rem", color:th.textFaint }}>{t.noPlans}</div>
        ) : plans.map(p => (
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <span style={{ flex:1, fontSize:"0.8rem", color:th.text }}>{p.name}</span>
            <button onClick={()=>onLoad(p)} style={{ background:th.accentLight, color:th.accent, border:`1px solid ${th.border}`, borderRadius:7, padding:"2px 8px", fontSize:"0.75rem", cursor:"pointer" }}>{t.load}</button>
            <button onClick={()=>deletePlan(p.id)} style={{ background:"none", border:"none", color:th.textFaint, cursor:"pointer", fontSize:"0.9rem" }}>✕</button>
          </div>
        ))}
      </div>
    );
  }

  function SharePanel({ lang, th }) {
    const t = TRANSLATIONS[lang];
    const [link, setLink] = useState("");
    const [copied, setCopied] = useState(false);
    const create = () => {
      const data = safeLocalGet("rp_current_v2", {});
      try {
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        setLink(window.location.origin + "?plan=" + encoded);
      } catch { setLink("Fehler beim Erstellen."); }
    };
    const copy = () => {
      navigator.clipboard.writeText(link).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),1500); });
    };
    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginTop:12 }}>
        <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.accent, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>{t.share}</div>
        <button onClick={create} style={{ background:th.accentLight, color:th.accent, border:`1px solid ${th.border}`, borderRadius:9, padding:"6px 14px", fontWeight:600, fontSize:"0.82rem", cursor:"pointer" }}>{t.createLink}</button>
        {link && (
          <div style={{ marginTop:8 }}>
            <div style={{ fontSize:"0.72rem", color:th.textMuted, marginBottom:4 }}>{t.shareHint}</div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <input readOnly value={link} style={{ flex:1, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"4px 8px", fontSize:"0.72rem", color:th.textMuted }} />
              <button onClick={copy} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:8, padding:"4px 10px", fontWeight:700, fontSize:"0.75rem", cursor:"pointer" }}>{copied ? t.copied : t.copy}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function PDFExportPanel({ lang, th, locations, locationDays, locationNotes, tripDays, city, startDate, numDays }) {
      const t = TRANSLATIONS[lang];
      const [loading, setLoading] = useState(false);
      const [done, setDone] = useState(false);
      const loadJsPDF = () => new Promise((res, rej) => {
        if (window.jspdf) { res(); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
      const exportPDF = async () => {
        setLoading(true); setDone(false);
        try { await loadJsPDF(); } catch(e) { setLoading(false); return; }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
        const W=210, M=18; let y=20;
        const checkY = (n=14) => { if(y+n>278){doc.addPage();y=20;} };
        doc.setFillColor(30,26,20); doc.rect(0,0,W,297,"F");
        doc.setFontSize(26); doc.setTextColor(196,168,130); doc.setFont("helvetica","bold");
        doc.text(city.name, W/2, 100, {align:"center"});
        doc.setFontSize(12); doc.setTextColor(168,144,112); doc.setFont("helvetica","normal");
        doc.text(`${startDate}  |  ${numDays} ${lang==="de"?"Tage":"days"}  |  ${locations.length} ${lang==="de"?"Orte":"places"}`, W/2, 114, {align:"center"});
        doc.setFontSize(8); doc.setTextColor(100,80,64);
        doc.text("Reiseplaner v6.2", W/2, 280, {align:"center"});
        const byDay={}; tripDays.forEach(d=>{byDay[d]=[];});
        locations.forEach(loc=>{const d=locationDays[loc.id];if(d&&byDay[d])byDay[d].push(loc);});
        const activeDays=tripDays.filter(d=>byDay[d].length>0);
        activeDays.forEach((d,di)=>{
          doc.addPage(); y=0;
          doc.setFillColor(46,40,32); doc.rect(0,0,W,16,"F");
          doc.setFontSize(11); doc.setTextColor(196,168,130); doc.setFont("helvetica","bold");
          doc.text(`${lang==="de"?"Tag":"Day"} ${di+1} - ${d}`, M, 11);
          doc.setFontSize(8); doc.setTextColor(120,96,80);
          doc.text(`${byDay[d].length} ${lang==="de"?"Orte":"places"}`, W-M, 11, {align:"right"});
          y=24;
          byDay[d].forEach(loc=>{
            checkY(26);
            doc.setFillColor(40,34,26); doc.roundedRect(M,y,W-M*2,22,2,2,"F");
            doc.setFontSize(10); doc.setTextColor(237,224,200); doc.setFont("helvetica","bold");
            doc.text(loc.name, M+4, y+8);
            const meta=[loc.type,loc.area,loc.duration].filter(Boolean).join(" | ");
            if(meta){doc.setFontSize(7.5);doc.setTextColor(168,144,112);doc.setFont("helvetica","normal");doc.text(meta,M+4,y+15);}
            const note=locationNotes[loc.id];
            if(note){doc.setFontSize(7);doc.setTextColor(140,120,96);doc.setFont("helvetica","italic");doc.text(`Notiz: ${note}`,M+4,y+20);}
            y+=26;
          });
        });
        doc.addPage(); y=0;
        doc.setFillColor(46,40,32); doc.rect(0,0,W,16,"F");
        doc.setFontSize(11); doc.setTextColor(196,168,130); doc.setFont("helvetica","bold");
        doc.text(lang==="de"?"Budget":"Budget", M, 11);
        y=24; let total=0;
        locations.forEach(loc=>{
          checkY(9); const cost=getEntryCost(loc.name,city); const avg=cost?(cost.min+cost.max)/2:null;
          if(avg!==null)total+=avg;
          doc.setFontSize(9);doc.setTextColor(220,208,188);doc.setFont("helvetica","normal");
          doc.text(loc.name,M,y);
          doc.setTextColor(168,144,112);
          doc.text(avg!==null?(avg===0?(lang==="de"?"Kostenlos":"Free"):`${cost.currency}${avg.toFixed(2)}`):"?",W-M,y,{align:"right"});
          y+=8;
        });
        doc.setDrawColor(74,62,46);doc.line(M,y,W-M,y);y+=7;
        doc.setFontSize(11);doc.setTextColor(212,168,75);doc.setFont("helvetica","bold");
        doc.text(`${lang==="de"?"Gesamt":"Total"}: ${total.toFixed(2)}`,W-M,y,{align:"right"});
        const packItems=safeLocalGet("rp_packing_v1",[]);
        if(packItems.length>0){
          doc.addPage();y=0;
          doc.setFillColor(46,40,32);doc.rect(0,0,W,16,"F");
          doc.setFontSize(11);doc.setTextColor(196,168,130);doc.setFont("helvetica","bold");
          doc.text(lang==="de"?"Packliste":"Packing List",M,11);y=24;
          const catMap=t.packingCats; const byCat={};
          packItems.forEach(it=>{if(!byCat[it.cat])byCat[it.cat]=[];byCat[it.cat].push(it);});
          Object.entries(catMap).forEach(([k,label])=>{
            if(!byCat[k]?.length)return;checkY(10);
            doc.setFontSize(8);doc.setTextColor(120,96,80);doc.setFont("helvetica","bold");
            doc.text(label.replace(/[^\u0000-\u007F]/g,"").trim()||k,M,y);y+=7;
            byCat[k].forEach(it=>{
              checkY(7);doc.setFontSize(9);doc.setFont("helvetica","normal");
              doc.setTextColor(it.checked?110:220,it.checked?90:208,it.checked?70:188);
              doc.text(`${it.checked?"[x]":"[ ]"} ${it.label}`,M+4,y);y+=7;
            });y+=2;
          });
        }
        doc.save(`reiseplan-${city.id}-${startDate}.pdf`);
        setLoading(false);setDone(true);setTimeout(()=>setDone(false),2500);
      };
      const hasDays=tripDays.some(d=>locations.some(l=>locationDays[l.id]===d));
      const dayCount=tripDays.filter(d=>locations.some(l=>locationDays[l.id]===d)).length;
      return (
        <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:16,padding:"18px",marginTop:12}}>
          <div style={{fontWeight:700,fontSize:"0.85rem",color:th.accent,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>
            {lang==="de"?"PDF-Export":"PDF Export"}
          </div>
          <div style={{fontSize:"0.8rem",color:th.textMuted,marginBottom:14,lineHeight:1.5}}>
            {lang==="de"
              ?`Erstellt einen vollstaendigen Reiseplan als PDF: ${dayCount} Tage, Budget und Packliste.`
              :`Exports a complete travel plan as PDF: ${dayCount} days, budget and packing list.`}
          </div>
          {!hasDays&&<div style={{fontSize:"0.75rem",color:th.warning,marginBottom:10}}>{lang==="de"?"Noch keine Orte mit Tagen zugewiesen.":"No places assigned to days yet."}</div>}
          <button onClick={exportPDF} disabled={loading||!hasDays}
            style={{background:hasDays?th.accent:th.border,color:hasDays?th.bg:th.textFaint,border:"none",borderRadius:10,padding:"10px 22px",fontWeight:700,fontSize:"0.88rem",cursor:hasDays&&!loading?"pointer":"not-allowed",display:"flex",alignItems:"center",gap:8,opacity:hasDays?1:0.6}}>
            {loading&&<Spinner size={14} color={th.bg}/>}
            {loading?(lang==="de"?"Generiere...":"Generating..."):done?(lang==="de"?"Gespeichert!":"Saved!"):(lang==="de"?"PDF herunterladen":"Download PDF")}
          </button>
          {done&&<div style={{marginTop:8,fontSize:"0.75rem",color:th.success}}>{lang==="de"?"PDF wurde heruntergeladen.":"PDF downloaded."}</div>}
        </div>
      );
    }

  function PackingListPanel({ lang, th }) {
    const t = TRANSLATIONS[lang];
    const [items, setItems] = useState(() => safeLocalGet("rp_packing_v1", []));
    const [newLabel, setNewLabel] = useState("");
    const [newCat, setNewCat] = useState("other");

    const save = (updated) => {
      setItems(updated);
      safeLocalSet("rp_packing_v1", updated);
    };

    const addItem = () => {
      if (!newLabel.trim()) return;
      save([...items, { id: Date.now(), label: newLabel.trim(), cat: newCat, checked: false }]);
      setNewLabel("");
    };

    const toggle = (id) => save(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    const remove = (id) => save(items.filter(i => i.id !== id));
    const clearChecked = () => save(items.filter(i => !i.checked));

    const cats = Object.entries(t.packingCats);

    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px" }}>
        <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.accent, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>{t.packingList}</div>
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          <input
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addItem()}
            placeholder={t.packingPlaceholder}
            style={{ flex:1, minWidth:120, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"6px 10px", fontSize:"0.82rem", color:th.text }}
          />
          <select value={newCat} onChange={e => setNewCat(e.target.value)}
            style={{ background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"6px 8px", fontSize:"0.8rem", color:th.text }}>
            {cats.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button onClick={addItem}
            style={{ background:th.accent, color:th.bg, border:"none", borderRadius:8, padding:"6px 14px", fontWeight:700, fontSize:"0.82rem", cursor:"pointer" }}>
            {t.packingAdd}
          </button>
        </div>
        {items.length === 0 && <div style={{ color:th.textFaint, fontSize:"0.82rem" }}>{t.packingEmpty}</div>}
        {cats.map(([catKey, catLabel]) => {
          const catItems = items.filter(i => i.cat === catKey);
          if (!catItems.length) return null;
          return (
            <div key={catKey} style={{ marginBottom:10 }}>
              <div style={{ fontSize:"0.72rem", color:th.textMuted, fontWeight:700, marginBottom:4 }}>{catLabel}</div>
              {catItems.map(item => (
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${th.border}` }}>
                  <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)}
                    style={{ accentColor:th.accent, width:15, height:15, cursor:"pointer" }} />
                  <span style={{ flex:1, fontSize:"0.83rem", color: item.checked ? th.textFaint : th.text, textDecoration: item.checked ? "line-through" : "none" }}>
                    {item.label}
                  </span>
                  <button onClick={() => remove(item.id)}
                    style={{ background:"none", border:"none", color:th.textFaint, cursor:"pointer", fontSize:"0.9rem" }}>✕</button>
                </div>
              ))}
            </div>
          );
        })}
        {items.some(i => i.checked) && (
          <button onClick={clearChecked}
            style={{ marginTop:8, background:"none", border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 12px", color:th.textMuted, fontSize:"0.75rem", cursor:"pointer" }}>
            {t.packingClear}
          </button>
        )}
      </div>
    );
  }

    function CitySelector({ currentCityId, onSelect, lang, th, onLoadDemoTrip }) {
      const t = TRANSLATIONS[lang];
      const hasDemo = !!DEMO_TRIPS[currentCityId];
      return (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>{t.selectCity}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
            {Object.values(CITIES).map(c => (
              <button key={c.id} onClick={()=>onSelect(c.id)}
                style={{ fontSize:"0.8rem", padding:"5px 12px", borderRadius:10, border:`1.5px solid ${currentCityId===c.id ? th.accent : th.border}`, background: currentCityId===c.id ? th.accentLight : "transparent", color: currentCityId===c.id ? th.accent : th.textMuted, cursor:"pointer", fontWeight: currentCityId===c.id ? 700 : 400 }}>
                {c.country} {c.name}
              </button>
            ))}
          </div>
          {hasDemo && onLoadDemoTrip && (
            <button
              onClick={() => onLoadDemoTrip(currentCityId)}
              style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: `linear-gradient(135deg, ${th.gold}22, ${th.gold}11)`,
                border: `1.5px solid ${th.gold}`,
                borderRadius: 11,
                padding: "7px 18px",
                color: th.gold,
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                letterSpacing: 0.3,
                boxShadow: `0 2px 12px ${th.gold}22`,
                transition: "all 0.18s",
              }}
            >
              🧪 {lang === "de" ? `Demo-Reise laden · ${CITIES[currentCityId]?.name}` : `Load Demo Trip · ${CITIES[currentCityId]?.name}`}
            </button>
          )}
        </div>
      );
    }

      export default function App() {
      const { mode, th } = useTheme();
      const [lang, setLang] = useState(() => safeLocalGet("rp_lang", "de"));
      const t = TRANSLATIONS[lang];
      const [cityId, setCityId] = useState(() => safeLocalGet("rp_city", "paris"));
      const city = CITIES[cityId] || CITIES.paris;
      const [locations, setLocations, undoRedo] = useUndoRedo([]);
      const [locationDays, setLocationDays] = useState({});
      const [locationNotes, setLocationNotes] = useState({});
        const [locationTimes, setLocationTimes] = useState({});
      const [travelMode, setTravelMode] = useState("walking");
      const [activeTab, setActiveTab] = useState("route");
        const [hotel, setHotel] = useState(() => safeLocalGet("rp_hotel", {}));
        useEffect(() => { safeLocalSet("rp_hotel", hotel); }, [hotel]);
      const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0,10));
      const [numDays, setNumDays] = useState(4);
      const tripDays = generateTripDays(startDate, numDays);

      useEffect(() => { safeLocalSet("rp_lang", lang); }, [lang]);
      useEffect(() => { safeLocalSet("rp_city", cityId); }, [cityId]);
      useEffect(() => {
        const current = { cityId, startDate, numDays, tripDays, locations, locationDays, locationNotes };
        safeLocalSet("rp_current_v2", current);
      }, [cityId, startDate, numDays, locations, locationDays, locationNotes]);

      const addLocation = useCallback((loc, day) => {
      const newLoc = { ...loc, id: Date.now() + Math.random() };
      setLocations(prev => [...prev, newLoc]);
      if (day) setLocationDays(prev => ({ ...prev, [newLoc.id]: day }));
    }, [setLocations]);

    const removeLocation = useCallback((id) => {
        setLocations(prev => prev.filter(l => l.id !== id));
        setLocationDays(prev => { const n={...prev}; delete n[id]; return n; });
        setLocationNotes(prev => { const n={...prev}; delete n[id]; return n; });
        setLocationTimes(prev => { const n={...prev}; delete n[id]; return n; });
    }, [setLocations]);

    const setDay = useCallback((id, day) => {
      setLocationDays(prev => { const n={...prev}; if(day) n[id]=day; else delete n[id]; return n; });
    }, []);

    const setTime = useCallback((id, time) => {
        setLocationTimes(prev => ({...prev, [id]: time}));
      }, []);

      const setNote = useCallback((id, note) => {
      setLocationNotes(prev => ({...prev, [id]: note}));
    }, []);

    const loadPlan = useCallback((plan) => {
      const p = normalizePlan(plan);
      if (!p) return;
      setCityId(p.cityId);
      setStartDate(p.startDate);
      setNumDays(p.numDays);
      setLocations(p.locations);
      setLocationDays(p.locationDays);
      setLocationNotes(p.locationNotes);
    }, [setLocations]);

    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);

    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
    const handleDrop = (i) => {
      if (dragIdx === null || dragIdx === i) { setDragIdx(null); setDragOverIdx(null); return; }
      setLocations(prev => {
        const arr = [...prev];
        const [moved] = arr.splice(dragIdx, 1);
        arr.splice(i, 0, moved);
        return arr;
      });
      setDragIdx(null); setDragOverIdx(null);
    };

    const closedWarnings = locations.filter(loc => {
      const d = locationDays[loc.id];
      if (!d) return false;
      const o = getOpeningInfo(loc.name, d, city);
      return o && !o.isOpen;
    });

    return (
      <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"'Inter',sans-serif", transition:"background 0.3s,color 0.3s" }}>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:${th.border}; border-radius:3px; }
          input,button,select { font-family:inherit; }
        `}</style>

        {/* NAV */}
        <nav style={{ position:"sticky", top:0, zIndex:100, background:th.navBg, borderBottom:`1px solid ${th.border}`, backdropFilter:"blur(16px)", padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontWeight:800, fontSize:"1.1rem", color:th.accent, letterSpacing:1 }}>{city.emoji} {t.appName}</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>setLang(l=>l==="de"?"en":"de")} style={{ background:th.accentLight, color:th.accent, border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 10px", fontSize:"0.78rem", cursor:"pointer", fontWeight:600 }}>{lang==="de"?"EN":"DE"}</button>
            <button onClick={toggleTheme} style={{ background:th.accentLight, color:th.accent, border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 10px", fontSize:"0.78rem", cursor:"pointer" }}>{mode==="dark"?"☀️":"🌙"}</button>
            {undoRedo.canUndo && <button onClick={undoRedo.undo} style={{ background:"none", border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 8px", color:th.textMuted, cursor:"pointer", fontSize:"0.8rem" }}>↩</button>}
            {undoRedo.canRedo && <button onClick={undoRedo.redo} style={{ background:"none", border:`1px solid ${th.border}`, borderRadius:8, padding:"4px 8px", color:th.textMuted, cursor:"pointer", fontSize:"0.8rem" }}>↪</button>}
          </div>
        </nav>

        <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px" }}>

          {/* CITY SELECTOR + DEMO */}
            <CitySelector
              currentCityId={cityId}
              onSelect={id=>{setCityId(id);setLocations([]);setLocationDays({});setLocationNotes({});}}
              lang={lang} th={th}
              onLoadDemoTrip={(key)=>{
                const trip=DEMO_TRIPS[key];
                if(!trip) return;
                const sd=new Date(Date.now()+7*24*60*60*1000).toISOString().slice(0,10);
                setCityId(trip.cityId);
                setStartDate(sd);
                setNumDays(trip.numDays);
                setLocations(trip.locations.map(l=>({...l})));
                setLocationDays(trip.assignDays(sd));
                setLocationNotes(trip.locationNotes||{});
              }}
            />

            {/* TRIP PERIOD */}
          <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{t.sectionTrip}</div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
              <div>
                <label style={{ fontSize:"0.75rem", color:th.textMuted, display:"block", marginBottom:3 }}>{t.labelStartDate}</label>
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
                  style={{ background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:9, padding:"6px 10px", fontSize:"0.85rem", color:th.text, cursor:"pointer" }} />
              </div>
              <div>
                <label style={{ fontSize:"0.75rem", color:th.textMuted, display:"block", marginBottom:3 }}>{t.labelDays} ({numDays} {t.labelDaysSuffix})</label>
                <input type="range" min="1" max="14" value={numDays} onChange={e=>setNumDays(Number(e.target.value))}
                  style={{ width:120, accentColor:th.accent }} />
              </div>
            </div>
          </div>

          <PWAInstallBanner lang={lang} th={th} />
            <HotelBlock hotel={hotel} setHotel={setHotel} lang={lang} th={th} />
            <WeatherWidget tripDays={tripDays} city={city} lang={lang} th={th} />

            {/* WARNINGS */}
          {closedWarnings.length > 0 && (
            <div style={{ background:th.warningBg, border:`1px solid ${th.warning}`, borderRadius:12, padding:"10px 14px", marginBottom:12 }}>
              <div style={{ fontWeight:700, color:th.warning, fontSize:"0.82rem", marginBottom:4 }}>⚠ {t.warningTitle}</div>
              {closedWarnings.map(loc => (
                <div key={loc.id} style={{ fontSize:"0.78rem", color:th.warning }}>• {loc.name} {t.warningClosed}</div>
              ))}
              <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:4 }}>{t.warningHint}</div>
            </div>
          )}

          {/* LINK ANALYZER */}
          <PlaceSearch onAdd={addLocation} tripDays={tripDays} lang={lang} th={th} />
            <LinkAnalyzer city={city} onAdd={addLocation} tripDays={tripDays} lang={lang} th={th} />

          {/* LOCATIONS */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>
              {t.myPlaces} ({locations.length})
            </div>
            {locations.length === 0 ? (
              <div style={{ color:th.textFaint, fontSize:"0.82rem", textAlign:"center", padding:"24px 0" }}>{t.addFirst}</div>
            ) : locations.map((loc, i) => (
              <div key={loc.id}
                draggable
                onDragStart={()=>handleDragStart(i)}
                onDragOver={e=>handleDragOver(e,i)}
                onDrop={()=>handleDrop(i)}
                style={{ opacity: dragOverIdx===i && dragIdx!==i ? 0.5 : 1, transition:"opacity 0.15s" }}>
                <LocationCard
                  loc={loc} city={city} tripDays={tripDays}
                  locationDays={locationDays} locationNotes={locationNotes}
                  onDayChange={setDay} onNoteChange={setNote} onTimeChange={setTime} locationTimes={locationTimes} onRemove={removeLocation}
                  lang={lang} th={th}
                  dragHandleProps={{ onMouseDown:()=>{} }}
                  isDragging={dragIdx===i}
                />
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {["route","map","budget","plans","share","notes","packing","ics","pwa","summary","pdf"].map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)}
                style={{ padding:"6px 14px", borderRadius:10, border:`1.5px solid ${activeTab===tab?th.accent:th.border}`, background:activeTab===tab?th.accentLight:"transparent", color:activeTab===tab?th.accent:th.textMuted, fontWeight:activeTab===tab?700:400, fontSize:"0.8rem", cursor:"pointer" }}>
                {tab==="route"?t.route:tab==="map"?t.sectionMap:tab==="budget"?t.budget:tab==="plans"?t.savedPlans:tab==="share"?t.share:tab==="notes"?(lang==="de"?"📝 Notizen":"📝 Notes"):tab==="packing"?t.packingList:tab==="ics"?"📅 .ics":tab==="pwa"?"📲 PWA":tab==="summary"?"🧾 Zusammenfassung":"📄 PDF"}
              </button>
            ))}
          </div>

          {/* TRAVEL MODE (route tab) */}
          {activeTab==="route" && (
            <div style={{ display:"flex", gap:6, marginBottom:12, alignItems:"center" }}>
              <span style={{ fontSize:"0.72rem", color:th.textFaint, textTransform:"uppercase", letterSpacing:1 }}>{t.travelMode}:</span>
              {[["walking","🚶",t.walking],["transit","🚇",t.transit],["driving","🚗",t.driving]].map(([m,ic,lb])=>(
                <button key={m} onClick={()=>setTravelMode(m)}
                  style={{ padding:"4px 10px", borderRadius:8, border:`1.5px solid ${travelMode===m?th.accent:th.border}`, background:travelMode===m?th.accentLight:"transparent", color:travelMode===m?th.accent:th.textMuted, fontSize:"0.78rem", cursor:"pointer", fontWeight:travelMode===m?700:400 }}>
                  {ic} {lb}
                </button>
              ))}
            </div>
          )}

          {/* TAB CONTENT */}
          {activeTab==="route" && (
            <>
              <TripSummaryBar locations={locations} locationDays={locationDays} locationTimes={locationTimes} tripDays={tripDays} travelMode={travelMode} city={city} lang={lang} th={th} />
                <RouteOptimizer locations={locations} locationDays={locationDays} tripDays={tripDays} travelMode={travelMode} onApply={(newDays)=>setLocationDays(newDays)} lang={lang} th={th} />
              <RouteTimeline locations={locations} locationDays={locationDays} locationTimes={locationTimes} tripDays={tripDays} travelMode={travelMode} city={city} lang={lang} th={th} onDayChange={setDay} />
            </>
          )}
          {activeTab==="map" && <MapView locations={locations} locationDays={locationDays} tripDays={tripDays} travelMode={travelMode} city={city} th={th} lang={lang} />}
          {activeTab==="budget" && <BudgetPanel locations={locations} city={city} lang={lang} th={th} />}
          {activeTab==="plans" && <SavedPlansPanel lang={lang} th={th} onLoad={loadPlan} />}
          {activeTab==="share" && <SharePanel lang={lang} th={th} />}
          
            {activeTab==="notes" && <DayNotesPanel tripDays={tripDays} lang={lang} th={th} />}
            {activeTab==="packing" && <PackingListPanel lang={lang} th={th} />
            }
            {activeTab==="pwa" && <PWATab lang={lang} th={th} online={online} locations={locations} locationDays={locationDays} locationNotes={locationNotes} tripDays={tripDays} city={city} startDate={startDate} numDays={numDays} />}
              {activeTab==="ics" && <ICSExportPanel locations={locations} locationDays={locationDays} locationNotes={locationNotes} locationTimes={locationTimes} tripDays={tripDays} city={city} lang={lang} th={th} />}
            {activeTab==="pdf" && <PDFExportPanel lang={lang} th={th} locations={locations} locationDays={locationDays} locationNotes={locationNotes} tripDays={tripDays} city={city} startDate={startDate} numDays={numDays} />}

        </div>

        {/* FOOTER */}
        <footer style={{ textAlign:"center", padding:"20px 16px", color:th.textFaint, fontSize:"0.72rem", borderTop:`1px solid ${th.border}`, marginTop:20 }}>
          {t.footerText} · {mode==="dark"?"🌙":"☀️"} · {lang.toUpperCase()}
        </footer>
      </div>
    );
  }
