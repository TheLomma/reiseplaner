import { useState, useEffect, useRef } from "react";

const THEMES = {
  dark: {
    bg: "#1e1a14", surface: "#26211a", card: "#2e2820", cardHover: "#38302a",
    border: "#4a3e2e", borderHover: "#6a5a40",
    text: "#ede0c8", textMuted: "#a89070", textFaint: "#786050",
    accent: "#c4a882", accentHover: "#d4b892", accentLight: "rgba(196,168,130,0.15)",
    success: "#8aab7a", successBg: "#1e2a16",
    warning: "#c4855a", warningBg: "#2e1a10",
    info: "#9ab4c0", infoBg: "#141e22",
    gold: "#d4a84b", goldBg: "rgba(212,168,75,0.1)",
    tag: "#2a2016", tagText: "#c8a96e",
    input: "#18140e", inputBorder: "#4a3e2e",
    navBg: "rgba(28,31,43,0.97)",
    shadow: "0 4px 24px rgba(0,0,0,0.5)",
    shadowHover: "0 8px 32px rgba(196,168,130,0.2)",
    skeleton: "#2e2820", skeletonShine: "#3a3028",
  },
  light: {
    bg: "#f0e8d8", surface: "#faf4e8", card: "#fffbf2", cardHover: "#fdf5e0",
    border: "#d8c8a8", borderHover: "#b8a888",
    text: "#2e2010", textMuted: "#6a5040", textFaint: "#a09070",
    accent: "#8b6a3e", accentHover: "#6e5030", accentLight: "rgba(139,106,62,0.1)",
    success: "#4a8a5a", successBg: "#eaf4ec",
    warning: "#b05a28", warningBg: "#faeadc",
    info: "#5a7a8a", infoBg: "#e8f0f4",
    gold: "#b8860b", goldBg: "rgba(184,134,11,0.1)",
    tag: "#e8d8b8", tagText: "#5a4020",
    input: "#f5ede0", inputBorder: "#d0b890",
    navBg: "rgba(240,235,224,0.97)",
    shadow: "0 4px 20px rgba(100,80,50,0.15)",
    shadowHover: "0 8px 32px rgba(139,106,62,0.2)",
    skeleton: "#e0d0b0", skeletonShine: "#ece0c4",
  }
};

if (typeof window !== "undefined" && !document.getElementById("pwa-icon-inject")) {
  // Generate a 180x180 canvas icon for iOS home screen
  const iconCanvas = document.createElement("canvas");
  iconCanvas.width = 180; iconCanvas.height = 180;
  const ctx = iconCanvas.getContext("2d");
  // Background gradient
  const grad = ctx.createLinearGradient(0,0,180,180);
  grad.addColorStop(0, "#2e2820"); grad.addColorStop(1, "#1e1a14");
  ctx.fillStyle = grad;
  const r = 36;
  ctx.beginPath(); ctx.moveTo(r,0); ctx.lineTo(180-r,0); ctx.quadraticCurveTo(180,0,180,r);
  ctx.lineTo(180,180-r); ctx.quadraticCurveTo(180,180,180-r,180);
  ctx.lineTo(r,180); ctx.quadraticCurveTo(0,180,0,180-r);
  ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0); ctx.closePath(); ctx.fill();
  // Globe circle
  ctx.strokeStyle = "#c4a882"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(90,80,46,0,Math.PI*2); ctx.stroke();
  // Meridian lines
  ctx.beginPath(); ctx.ellipse(90,80,22,46,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(44,80); ctx.lineTo(136,80); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(52,55); ctx.lineTo(128,55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(52,105); ctx.lineTo(128,105); ctx.stroke();
  // Plane emoji
  ctx.font = "bold 38px serif"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillText("✈", 90, 80);
  // Label
  ctx.fillStyle = "#c4a882"; ctx.font = "bold 16px 'Source Sans 3', sans-serif";
  ctx.textAlign="center"; ctx.textBaseline="alphabetic";
  ctx.fillText("Reiseplaner", 90, 158);
  const iconDataUrl = iconCanvas.toDataURL("image/png");
  // Inject apple-touch-icon
  const linkEl = document.createElement("link");
  linkEl.id = "pwa-icon-inject";
  linkEl.rel = "apple-touch-icon";
  linkEl.setAttribute("sizes", "180x180");
  linkEl.href = iconDataUrl;
  document.head.appendChild(linkEl);
  // iOS status bar
  const metaStatusBar = document.createElement("meta");
  metaStatusBar.name = "apple-mobile-web-app-status-bar-style";
  metaStatusBar.content = "black-translucent";
  document.head.appendChild(metaStatusBar);
  // iOS capable
  const metaCapable = document.createElement("meta");
  metaCapable.name = "apple-mobile-web-app-capable";
  metaCapable.content = "yes";
  document.head.appendChild(metaCapable);
  // App title
  const metaTitle = document.createElement("meta");
  metaTitle.name = "apple-mobile-web-app-title";
  metaTitle.content = "Reiseplaner";
  document.head.appendChild(metaTitle);
  // Favicon
  let fav = document.querySelector('link[rel="icon"]');
  if (!fav) { fav = document.createElement("link"); fav.rel="icon"; document.head.appendChild(fav); }
  fav.href = iconDataUrl;
}

if (typeof window !== "undefined" && !document.getElementById("app-theme-styles")) {
  const s = document.createElement("style");
  s.id = "app-theme-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');
    @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes markerPop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2);opacity:1} 100%{transform:scale(1);opacity:1} }
    @keyframes spin { to{transform:rotate(360deg)} }
    .card-anim { animation: fadeSlideIn 0.4s cubic-bezier(.22,1,.36,1) both; }
    .skeleton-anim { animation: skeletonPulse 1.4s ease-in-out infinite; }
    .app-card-hover { transition: box-shadow 0.25s, border-color 0.25s, transform 0.25s, background 0.25s; }
    .app-card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(139,106,62,0.18) !important; }
    .theme-toggle-btn { transition: background 0.2s, color 0.2s, box-shadow 0.2s; }
    .tab-btn { transition: background 0.15s, color 0.15s; font-family: 'Source Sans 3', system-ui, sans-serif; letter-spacing: 0.04em; text-transform: uppercase; font-size: 0.65rem !important; }
    .btn-primary { transition: background 0.15s, box-shadow 0.15s, transform 0.1s; font-family: 'Source Sans 3', system-ui, sans-serif; letter-spacing: 0.05em; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(139,106,62,0.3); }
    .btn-primary:active { transform: translateY(0); }
    .marker-pop { animation: markerPop 0.4s ease both; }
    h1, h2, h3 { font-family: 'Playfair Display', Georgia, serif !important; }
    body { font-family: 'Source Sans 3', system-ui, sans-serif; }
    @media print {
      body { background: #fff !important; }
      .no-print { display: none !important; }
      .print-card { break-inside: avoid; page-break-inside: avoid; border: 1px solid #ccc !important; border-radius: 8px !important; padding: 10px !important; margin-bottom: 10px !important; background: #fff !important; color: #000 !important; }
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { border-radius: 3px; }
  `;
  document.head.appendChild(s);
}

if (typeof window !== "undefined") {
  let vp = document.querySelector('meta[name="viewport"]');
  if (!vp) { vp = document.createElement('meta'); vp.name = 'viewport'; document.head.appendChild(vp); }
  vp.content = 'width=device-width, initial-scale=1, maximum-scale=1';
  if (!document.getElementById('mobile-fix')) {
    const s = document.createElement('style');
    s.id = 'mobile-fix';
    s.textContent = '* { box-sizing: border-box !important; } body, #root { overflow-x: hidden !important; max-width: 100vw !important; } input, select, textarea { font-size: 16px !important; } button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }';
    document.head.appendChild(s);
  }
}

const ThemeCtx = typeof window !== "undefined"
  ? (window.__ThemeCtx || (window.__ThemeCtx = { listeners: [], current: "dark" }))
  : { listeners: [], current: "dark" };

function useTheme() {
  const [mode, setMode] = useState(() => ThemeCtx.current);
  useEffect(() => {
    const fn = (m) => setMode(m);
    ThemeCtx.listeners.push(fn);
    return () => { ThemeCtx.listeners = ThemeCtx.listeners.filter(f => f !== fn); };
  }, []);
  return { mode, th: THEMES[mode] };
}

function toggleTheme() {
  ThemeCtx.current = ThemeCtx.current === "dark" ? "light" : "dark";
  ThemeCtx.listeners.forEach(fn => fn(ThemeCtx.current));
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
  const bar = (w, h = 10, mt = 0) => (
    <div className="skeleton-anim" style={{ width: w, height: h, borderRadius: 6, background: th.skeletonShine, marginTop: mt }} />
  );
  return (
    <div className="app-card-hover" style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 14, padding: "12px 14px" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="skeleton-anim" style={{ width: 36, height: 36, borderRadius: "50%", background: th.skeletonShine }} />
        <div style={{ flex: 1 }}>{bar("60%", 12)}{bar("40%", 8, 6)}</div>
      </div>
      {bar("90%", 8, 12)}{bar("75%", 8, 6)}{bar("50%", 8, 6)}
    </div>
  );
}

if (typeof window !== "undefined" && !window.L) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  document.head.appendChild(script);
}

const CITIES = {
  paris: {
    id: "paris", name: "Paris", emoji: "🗼", country: "🇫🇷",
    lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris",
    sampleLocations: [
      { id: 1, name: "Eiffelturm", type: "Sehenswürdigkeit", address: "Champ de Mars, 75007 Paris", lat: 48.8584, lng: 2.2945, area: "7. Arrondissement", duration: "1,5 Std.", icon: "🗼" },
      { id: 2, name: "Arc de Triomphe", type: "Sehenswürdigkeit", address: "Pl. Charles de Gaulle, 75008 Paris", lat: 48.8738, lng: 2.295, area: "8. Arrondissement", duration: "1 Std.", icon: "🏛️" },
      { id: 3, name: "Le Grand Véfour", type: "Restaurant", address: "17 Rue de Beaujolais, 75001 Paris", lat: 48.8637, lng: 2.337, area: "1. Arrondissement", duration: "2 Std.", icon: "🍽️" },
    ],
    demoLinks: ["https://maps.google.com/?q=eiffelturm", "https://maps.google.com/?q=arc+de+triomphe", "https://www.restaurant-levefour.fr"],
    linkMatchers: [
      { pattern: /eiffel|tour-eiffel/i, locationIndex: 0 },
      { pattern: /arc|triomphe/i, locationIndex: 1 },
      { pattern: /restaurant|cafe|vefour|maps/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Eiffelturm": { min: 11.80, max: 29.40, currency: "€", note: "je nach Etage" },
      "Arc de Triomphe": { min: 13.00, max: 13.00, currency: "€", note: "Erwachsene" },
      "Le Grand Véfour": { min: 80.00, max: 350.00, currency: "€", note: "Menü–À la carte" },
    },
    ratings: {
      "Eiffelturm": { stars: 4.8, reviews: 284000, price: "€€", badge: "Weltbekannt" },
      "Arc de Triomphe": { stars: 4.7, reviews: 98000, price: "€€", badge: "Muss man gesehen haben" },
      "Le Grand Véfour": { stars: 4.5, reviews: 1200, price: "€€€€", badge: "Michelin-Stern" },
    },
    locationInfo: {
      "Eiffelturm": { short: "Wahrzeichen von Paris, 330m hoch, 1889 erbaut.", highlights: ["Aussichtsplattform", "Abends Lichtshow", "Champ de Mars"] },
      "Arc de Triomphe": { short: "Triumphbogen am Place Charles de Gaulle.", highlights: ["Dachterrasse", "Grab des Unbekannten Soldaten", "Champs-Élysées"] },
      "Le Grand Véfour": { short: "Eines der ältesten Restaurants von Paris, seit 1784.", highlights: ["Historisches Interieur", "Sternküche", "Napoleon & Hugo"] },
    },
    openingHours: {
      "Eiffelturm": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–23:45" },
      "Arc de Triomphe": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–23:00" },
      "Le Grand Véfour": { mo: true, di: true, mi: true, do: true, fr: true, sa: false, so: false, hours: "12:00–14:00, 19:30–22:00", note: "Sa & So geschlossen" },
    },
    metroLines: {
      "7. Arrondissement -> 8. Arrondissement": { line: "M6", time: "12 min", stops: 3 },
      "8. Arrondissement -> 1. Arrondissement": { line: "M1", time: "18 min", stops: 5 },
    },
  },
  london: {
    id: "london", name: "London", emoji: "🎡", country: "🇬🇧",
    lat: 51.5074, lng: -0.1278, timezone: "Europe/London",
    sampleLocations: [
      { id: 1, name: "Tower of London", type: "Sehenswürdigkeit", address: "London EC3N 4AB", lat: 51.5081, lng: -0.0759, area: "City of London", duration: "2 Std.", icon: "🏰" },
      { id: 2, name: "Big Ben", type: "Sehenswürdigkeit", address: "Westminster, London SW1A 0AA", lat: 51.5007, lng: -0.1246, area: "Westminster", duration: "0,5 Std.", icon: "🕐" },
      { id: 3, name: "Borough Market", type: "Markt", address: "8 Southwark St, London SE1 1TL", lat: 51.5055, lng: -0.091, area: "Southwark", duration: "1,5 Std.", icon: "🥘" },
    ],
    demoLinks: ["https://maps.google.com/?q=tower+of+london", "https://maps.google.com/?q=big+ben", "https://maps.google.com/?q=borough+market"],
    linkMatchers: [
      { pattern: /tower.*london/i, locationIndex: 0 },
      { pattern: /big.*ben|westminster/i, locationIndex: 1 },
      { pattern: /borough.*market/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Tower of London": { min: 33.60, max: 33.60, currency: "£", note: "Erwachsene" },
      "Big Ben": { min: 0, max: 0, currency: "£", note: "Außenbesichtigung frei" },
      "Borough Market": { min: 0, max: 0, currency: "£", note: "Eintritt frei" },
    },
    ratings: {
      "Tower of London": { stars: 4.7, reviews: 112000, price: "€€", badge: "UNESCO Welterbe" },
      "Big Ben": { stars: 4.8, reviews: 198000, price: "Kostenlos", badge: "Ikone" },
      "Borough Market": { stars: 4.6, reviews: 67000, price: "€€", badge: "Foodie-Paradies" },
    },
    locationInfo: {
      "Tower of London": { short: "Historische Festung an der Themse, seit 1066.", highlights: ["Kronjuwelen", "Beefeater-Führung", "Raben des Towers"] },
      "Big Ben": { short: "Berühmter Uhrenturm am Palace of Westminster.", highlights: ["Fotomotiv #1", "Westminster Bridge", "Houses of Parliament"] },
      "Borough Market": { short: "Ältester Lebensmittelmarkt Londons.", highlights: ["Street Food", "Frische Produkte", "Eisenbahn-Bögen"] },
    },
    openingHours: {
      "Tower of London": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:30" },
      "Big Ben": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Außen immer sichtbar" },
      "Borough Market": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "10:00–17:00", note: "Mo & So geschlossen" },
    },
    metroLines: {},
  },
  berlin: {
    id: "berlin", name: "Berlin", emoji: "🐻", country: "🇩🇪",
    lat: 52.5200, lng: 13.4050, timezone: "Europe/Berlin",
    sampleLocations: [
      { id: 1, name: "Brandenburger Tor", type: "Sehenswürdigkeit", address: "Pariser Platz, 10117 Berlin", lat: 52.5163, lng: 13.3777, area: "Mitte", duration: "0,5 Std.", icon: "🏛️" },
      { id: 2, name: "Museumsinsel", type: "Museum", address: "10178 Berlin", lat: 52.5169, lng: 13.4019, area: "Mitte", duration: "3 Std.", icon: "🏛️" },
      { id: 3, name: "East Side Gallery", type: "Sehenswürdigkeit", address: "Mühlenstr. 3-100, 10243 Berlin", lat: 52.5053, lng: 13.4395, area: "Friedrichshain", duration: "1 Std.", icon: "🎨" },
    ],
    demoLinks: ["https://maps.google.com/?q=brandenburger+tor", "https://maps.google.com/?q=museumsinsel+berlin", "https://maps.google.com/?q=east+side+gallery"],
    linkMatchers: [
      { pattern: /brandenburger|brandenburg/i, locationIndex: 0 },
      { pattern: /museumsinsel/i, locationIndex: 1 },
      { pattern: /east.*side|gallery/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Brandenburger Tor": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Museumsinsel": { min: 12, max: 22, currency: "€", note: "Einzeln / Kombi" },
      "East Side Gallery": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Brandenburger Tor": { stars: 4.8, reviews: 180000, price: "Kostenlos", badge: "Symbol der Einheit" },
      "Museumsinsel": { stars: 4.7, reviews: 95000, price: "€€", badge: "UNESCO Welterbe" },
      "East Side Gallery": { stars: 4.6, reviews: 72000, price: "Kostenlos", badge: "Street Art" },
    },
    locationInfo: {
      "Brandenburger Tor": { short: "Symbol der deutschen Wiedervereinigung.", highlights: ["Pariser Platz", "Foto-Hotspot", "Nah am Reichstag"] },
      "Museumsinsel": { short: "Fünf weltberühmte Museen auf einer Insel.", highlights: ["Pergamonmuseum", "Nofretete-Büste", "Alte Nationalgalerie"] },
      "East Side Gallery": { short: "Längste Open-Air-Galerie der Welt.", highlights: ["Bruderkuss-Gemälde", "1,3 km Mauer-Kunst", "Spree-Ufer"] },
    },
    openingHours: {
      "Brandenburger Tor": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
      "Museumsinsel": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–18:00", note: "Mo geschlossen" },
      "East Side Gallery": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
    },
    metroLines: {},
  },
  rom: {
    id: "rom", name: "Rom", emoji: "🏛️", country: "🇮🇹",
    lat: 41.9028, lng: 12.4964, timezone: "Europe/Rome",
    sampleLocations: [
      { id: 1, name: "Kolosseum", type: "Sehenswürdigkeit", address: "Piazza del Colosseo, 00184 Roma", lat: 41.8902, lng: 12.4922, area: "Celio", duration: "2 Std.", icon: "🏟️" },
      { id: 2, name: "Vatikan", type: "Sehenswürdigkeit", address: "Viale Vaticano, 00165 Roma", lat: 41.9029, lng: 12.4534, area: "Vatikanstadt", duration: "3 Std.", icon: "⛪" },
      { id: 3, name: "Trevi-Brunnen", type: "Sehenswürdigkeit", address: "Piazza di Trevi, 00187 Roma", lat: 41.9009, lng: 12.4833, area: "Trevi", duration: "0,5 Std.", icon: "⛲" },
    ],
    demoLinks: ["https://maps.google.com/?q=kolosseum+rom", "https://maps.google.com/?q=vatikan", "https://maps.google.com/?q=trevi+brunnen"],
    linkMatchers: [
      { pattern: /kolosseum|colosseum|colosseo/i, locationIndex: 0 },
      { pattern: /vatikan|vatican/i, locationIndex: 1 },
      { pattern: /trevi/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Kolosseum": { min: 16, max: 22, currency: "€", note: "Erwachsene" },
      "Vatikan": { min: 17, max: 17, currency: "€", note: "Museen" },
      "Trevi-Brunnen": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Kolosseum": { stars: 4.8, reviews: 320000, price: "€€", badge: "UNESCO Welterbe" },
      "Vatikan": { stars: 4.7, reviews: 210000, price: "€€", badge: "Einzigartig" },
      "Trevi-Brunnen": { stars: 4.7, reviews: 280000, price: "Kostenlos", badge: "Romantisch" },
    },
    locationInfo: {
      "Kolosseum": { short: "Antikes Amphitheater, erbaut 70–80 n.Chr.", highlights: ["Arena & Untergeschosse", "Palatin-Hügel", "Sonnenuntergang"] },
      "Vatikan": { short: "Kleinster Staat der Welt mit Sixtinischer Kapelle.", highlights: ["Sixtinische Kapelle", "Petersdom", "Raffael-Stanzen"] },
      "Trevi-Brunnen": { short: "Größter Barockbrunnen Roms.", highlights: ["Münze werfen", "Abends beleuchtet", "Gelato nebenan"] },
    },
    openingHours: {
      "Kolosseum": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–19:00" },
      "Vatikan": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "08:00–18:00", note: "So geschlossen" },
      "Trevi-Brunnen": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
    },
    metroLines: {},
  },
  barcelona: {
    id: "barcelona", name: "Barcelona", emoji: "🎭", country: "🇪🇸",
    lat: 41.3874, lng: 2.1686, timezone: "Europe/Madrid",
    sampleLocations: [
      { id: 1, name: "Sagrada Familia", type: "Sehenswürdigkeit", address: "C/ de Mallorca, 401, 08013 Barcelona", lat: 41.4036, lng: 2.1744, area: "Eixample", duration: "2 Std.", icon: "⛪" },
      { id: 2, name: "Park Güell", type: "Park", address: "08024 Barcelona", lat: 41.4145, lng: 2.1527, area: "Gracia", duration: "1,5 Std.", icon: "🦎" },
      { id: 3, name: "La Boqueria", type: "Markt", address: "La Rambla, 91, 08001 Barcelona", lat: 41.3816, lng: 2.1719, area: "Ciutat Vella", duration: "1 Std.", icon: "🥘" },
    ],
    demoLinks: ["https://maps.google.com/?q=sagrada+familia", "https://maps.google.com/?q=park+guell", "https://maps.google.com/?q=la+boqueria"],
    linkMatchers: [
      { pattern: /sagrada|familia/i, locationIndex: 0 },
      { pattern: /guell|park/i, locationIndex: 1 },
      { pattern: /boqueria|rambla/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Sagrada Familia": { min: 26, max: 36, currency: "€", note: "mit/ohne Turm" },
      "Park Güell": { min: 10, max: 10, currency: "€", note: "Erwachsene" },
      "La Boqueria": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Sagrada Familia": { stars: 4.8, reviews: 240000, price: "€€", badge: "UNESCO Welterbe" },
      "Park Güell": { stars: 4.6, reviews: 175000, price: "€", badge: "Gaudi-Meisterwerk" },
      "La Boqueria": { stars: 4.5, reviews: 98000, price: "€€", badge: "Foodie-Paradies" },
    },
    locationInfo: {
      "Sagrada Familia": { short: "Gaudis unvollendete Basilika, Baubeginn 1882.", highlights: ["Fassaden", "Turmbesteigung", "Lichtspiel"] },
      "Park Güell": { short: "Gaudis bunter Stadtpark auf einem Hügel.", highlights: ["Mosaikbank", "Drachenskulptur", "Panorama"] },
      "La Boqueria": { short: "Berühmter Markt an der Rambla.", highlights: ["Frische Säfte", "Meeresfrüchte", "Tapas"] },
    },
    openingHours: {
      "Sagrada Familia": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–20:00" },
      "Park Güell": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:30–19:30" },
      "La Boqueria": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "08:00–20:30", note: "So geschlossen" },
    },
    metroLines: {},
  },
  wien: {
    id: "wien", name: "Wien", emoji: "🎵", country: "🇦🇹",
    lat: 48.2082, lng: 16.3738, timezone: "Europe/Vienna",
    sampleLocations: [
      { id: 1, name: "Schloss Schoenbrunn", type: "Sehenswürdigkeit", address: "Schönbrunner Schloßstraße 47, 1130 Wien", lat: 48.1845, lng: 16.3122, area: "Hietzing", duration: "2,5 Std.", icon: "🏰" },
      { id: 2, name: "Stephansdom", type: "Sehenswürdigkeit", address: "Stephansplatz 3, 1010 Wien", lat: 48.2082, lng: 16.3738, area: "Innere Stadt", duration: "1 Std.", icon: "⛪" },
      { id: 3, name: "Naschmarkt", type: "Markt", address: "1060 Wien", lat: 48.1988, lng: 16.3632, area: "Mariahilf", duration: "1,5 Std.", icon: "🥘" },
    ],
    demoLinks: ["https://maps.google.com/?q=schloss+schoenbrunn", "https://maps.google.com/?q=stephansdom+wien", "https://maps.google.com/?q=naschmarkt+wien"],
    linkMatchers: [
      { pattern: /schoenbrunn|schloss/i, locationIndex: 0 },
      { pattern: /stephansdom|stephan/i, locationIndex: 1 },
      { pattern: /naschmarkt/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Schloss Schoenbrunn": { min: 24, max: 29, currency: "€", note: "Imperial / Grand Tour" },
      "Stephansdom": { min: 0, max: 6, currency: "€", note: "Kirche frei / Turm 6€" },
      "Naschmarkt": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Schloss Schoenbrunn": { stars: 4.7, reviews: 125000, price: "€€", badge: "UNESCO Welterbe" },
      "Stephansdom": { stars: 4.8, reviews: 92000, price: "€", badge: "Wahrzeichen" },
      "Naschmarkt": { stars: 4.5, reviews: 55000, price: "€€", badge: "Kulinarisch" },
    },
    locationInfo: {
      "Schloss Schoenbrunn": { short: "Kaiserliche Sommerresidenz der Habsburger.", highlights: ["Prunkräume", "Schlossgarten", "Zoo"] },
      "Stephansdom": { short: "Gotische Kathedrale im Herzen Wiens.", highlights: ["Südturm", "Katakomben", "Pummerin"] },
      "Naschmarkt": { short: "Wiens beliebtester Markt seit dem 16. Jhd.", highlights: ["Internationale Küche", "Flohmarkt Sa", "Kaffeehäuser"] },
    },
    openingHours: {
      "Schloss Schoenbrunn": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Stephansdom": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–22:00" },
      "Naschmarkt": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "06:00–19:30", note: "So geschlossen" },
    },
    metroLines: {},
  },
  amsterdam: {
    id: "amsterdam", name: "Amsterdam", emoji: "🌷", country: "🇳🇱",
    lat: 52.3676, lng: 4.9041, timezone: "Europe/Amsterdam",
    sampleLocations: [
      { id: 1, name: "Rijksmuseum", type: "Museum", address: "Museumstraat 1, 1071 XX Amsterdam", lat: 52.3600, lng: 4.8852, area: "Museumplein", duration: "2,5 Std.", icon: "🎨" },
      { id: 2, name: "Anne Frank Haus", type: "Museum", address: "Prinsengracht 263-267, Amsterdam", lat: 52.3752, lng: 4.8840, area: "Jordaan", duration: "1,5 Std.", icon: "📖" },
      { id: 3, name: "Vondelpark", type: "Park", address: "1071 AA Amsterdam", lat: 52.3580, lng: 4.8686, area: "Oud-Zuid", duration: "1 Std.", icon: "🌳" },
    ],
    demoLinks: ["https://maps.google.com/?q=rijksmuseum", "https://maps.google.com/?q=anne+frank+haus", "https://maps.google.com/?q=vondelpark"],
    linkMatchers: [
      { pattern: /rijksmuseum/i, locationIndex: 0 },
      { pattern: /anne.*frank/i, locationIndex: 1 },
      { pattern: /vondelpark/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Rijksmuseum": { min: 22.50, max: 22.50, currency: "€", note: "Erwachsene" },
      "Anne Frank Haus": { min: 16, max: 16, currency: "€", note: "Nur online buchbar" },
      "Vondelpark": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Rijksmuseum": { stars: 4.8, reviews: 95000, price: "€€", badge: "Weltklasse" },
      "Anne Frank Haus": { stars: 4.7, reviews: 68000, price: "€", badge: "Bewegend" },
      "Vondelpark": { stars: 4.7, reviews: 120000, price: "Kostenlos", badge: "Oase" },
    },
    locationInfo: {
      "Rijksmuseum": { short: "Niederländisches Nationalmuseum mit Rembrandts Nachtwache.", highlights: ["Nachtwache", "Delfter Blau", "Museumsgarten"] },
      "Anne Frank Haus": { short: "Versteck der Familie Frank im Zweiten Weltkrieg.", highlights: ["Originales Hinterhaus", "Tagebuch-Ausstellung", "Früh buchen!"] },
      "Vondelpark": { short: "Größter Stadtpark Amsterdams.", highlights: ["Open-Air-Theater", "Cafes & Spielplätze", "Joggen & Radfahren"] },
    },
    openingHours: {
      "Rijksmuseum": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Anne Frank Haus": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–22:00" },
      "Vondelpark": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer geöffnet" },
    },
    metroLines: {},
  },
  prag: {
    id: "prag", name: "Prag", emoji: "🏰", country: "🇨🇿",
    lat: 50.0755, lng: 14.4378, timezone: "Europe/Prague",
    sampleLocations: [
      { id: 1, name: "Karlsbrücke", type: "Sehenswürdigkeit", address: "Karluv most, 110 00 Praha", lat: 50.0865, lng: 14.4114, area: "Altstadt", duration: "1 Std.", icon: "🌉" },
      { id: 2, name: "Prager Burg", type: "Sehenswürdigkeit", address: "Hradcany, 119 08 Praha", lat: 50.0911, lng: 14.4003, area: "Hradschin", duration: "2,5 Std.", icon: "🏰" },
      { id: 3, name: "Altstädter Ring", type: "Platz", address: "Staromestske nam., 110 00 Praha", lat: 50.0873, lng: 14.4213, area: "Altstadt", duration: "1 Std.", icon: "⏰" },
    ],
    demoLinks: ["https://maps.google.com/?q=karlsbruecke+prag", "https://maps.google.com/?q=prager+burg", "https://maps.google.com/?q=altstadter+ring+prag"],
    linkMatchers: [
      { pattern: /karlsbr|charles.*bridge|karluv/i, locationIndex: 0 },
      { pattern: /prager.*burg|prague.*castle|hrad/i, locationIndex: 1 },
      { pattern: /altstadter|old.*town.*square|staromest/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Karlsbrücke": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Prager Burg": { min: 10, max: 15, currency: "€", note: "Rundgang A/B" },
      "Altstädter Ring": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Karlsbrücke": { stars: 4.8, reviews: 185000, price: "Kostenlos", badge: "Ikonisch" },
      "Prager Burg": { stars: 4.7, reviews: 142000, price: "€", badge: "Größte Burg der Welt" },
      "Altstädter Ring": { stars: 4.7, reviews: 110000, price: "Kostenlos", badge: "Astronomische Uhr" },
    },
    locationInfo: {
      "Karlsbrücke": { short: "Gotische Steinbrücke über die Moldau, 1402.", highlights: ["30 Barockskulpturen", "Frühmorgens besuchen", "Straßenkünstler"] },
      "Prager Burg": { short: "Größte geschlossene Burganlage der Welt.", highlights: ["Veitsdom", "Goldenes Gässchen", "Panoramablick"] },
      "Altstädter Ring": { short: "Mittelalterlicher Marktplatz mit Astronomischer Uhr.", highlights: ["Uhr zur vollen Stunde", "Teynkirche", "Weihnachtsmarkt"] },
    },
    openingHours: {
      "Karlsbrücke": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
      "Prager Burg": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–22:00" },
      "Altstädter Ring": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
    },
    metroLines: {},
  },
  lissabon: {
    id: "lissabon", name: "Lissabon", emoji: "🚋", country: "🇵🇹",
    lat: 38.7223, lng: -9.1393, timezone: "Europe/Lisbon",
    sampleLocations: [
      { id: 1, name: "Torre de Belem", type: "Sehenswürdigkeit", address: "Av. Brasilia, 1400-038 Lisboa", lat: 38.6916, lng: -9.2160, area: "Belem", duration: "1 Std.", icon: "🏰" },
      { id: 2, name: "Alfama", type: "Stadtviertel", address: "Alfama, Lisboa", lat: 38.7114, lng: -9.1300, area: "Alfama", duration: "2 Std.", icon: "🏘️" },
      { id: 3, name: "Pasteis de Belem", type: "Cafe", address: "R. de Belem 84-92, Lisboa", lat: 38.6976, lng: -9.2030, area: "Belem", duration: "0,5 Std.", icon: "🥮" },
    ],
    demoLinks: ["https://maps.google.com/?q=torre+de+belem", "https://maps.google.com/?q=alfama+lissabon", "https://maps.google.com/?q=pasteis+de+belem"],
    linkMatchers: [
      { pattern: /torre.*belem/i, locationIndex: 0 },
      { pattern: /alfama/i, locationIndex: 1 },
      { pattern: /pasteis/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Torre de Belem": { min: 8, max: 8, currency: "€", note: "Erwachsene" },
      "Alfama": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Pasteis de Belem": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Torre de Belem": { stars: 4.6, reviews: 88000, price: "€", badge: "UNESCO Welterbe" },
      "Alfama": { stars: 4.7, reviews: 52000, price: "Kostenlos", badge: "Authentisch" },
      "Pasteis de Belem": { stars: 4.7, reviews: 110000, price: "€", badge: "Legendär" },
    },
    locationInfo: {
      "Torre de Belem": { short: "Wahrzeichen Lissabons am Tejo-Ufer.", highlights: ["Manuelinische Architektur", "Blick auf den Tejo", "UNESCO"] },
      "Alfama": { short: "Ältestes Viertel Lissabons mit Fado-Musik.", highlights: ["Fado-Lokale", "Miradouros", "Straßenbahn 28"] },
      "Pasteis de Belem": { short: "Berühmteste Pastel-de-Nata-Bäckerei seit 1837.", highlights: ["Original-Rezept", "Immer frisch", "Zimt & Zucker"] },
    },
    openingHours: {
      "Torre de Belem": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–17:30", note: "Mo geschlossen" },
      "Alfama": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
      "Pasteis de Belem": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "08:00–23:00" },
    },
    metroLines: {},
  },
  new_york: {
    id: "new_york", name: "New York", emoji: "🗽", country: "🇺🇸",
    lat: 40.7128, lng: -74.0060, timezone: "America/New_York",
    sampleLocations: [
      { id: 1, name: "Freiheitsstatue", type: "Sehenswürdigkeit", address: "Liberty Island, New York, NY 10004", lat: 40.6892, lng: -74.0445, area: "Liberty Island", duration: "3 Std.", icon: "🗽" },
      { id: 2, name: "Central Park", type: "Park", address: "New York, NY 10024", lat: 40.7829, lng: -73.9654, area: "Manhattan", duration: "2 Std.", icon: "🌳" },
      { id: 3, name: "Times Square", type: "Platz", address: "Manhattan, NY 10036", lat: 40.7580, lng: -73.9855, area: "Midtown", duration: "1 Std.", icon: "🌃" },
    ],
    demoLinks: ["https://maps.google.com/?q=statue+of+liberty", "https://maps.google.com/?q=central+park", "https://maps.google.com/?q=times+square"],
    linkMatchers: [
      { pattern: /statue.*liberty|freiheitsstatue/i, locationIndex: 0 },
      { pattern: /central.*park/i, locationIndex: 1 },
      { pattern: /times.*square/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Freiheitsstatue": { min: 24, max: 24, currency: "$", note: "Fähre + Pedestal" },
      "Central Park": { min: 0, max: 0, currency: "$", note: "Eintritt frei" },
      "Times Square": { min: 0, max: 0, currency: "$", note: "Eintritt frei" },
    },
    ratings: {
      "Freiheitsstatue": { stars: 4.7, reviews: 95000, price: "€€", badge: "Ikone" },
      "Central Park": { stars: 4.8, reviews: 310000, price: "Kostenlos", badge: "Oase" },
      "Times Square": { stars: 4.5, reviews: 220000, price: "Kostenlos", badge: "Elektrisierend" },
    },
    locationInfo: {
      "Freiheitsstatue": { short: "Geschenk Frankreichs an die USA, 1886 eingeweiht.", highlights: ["Fähre ab Battery Park", "Krone mit Voranmeldung", "Ellis Island"] },
      "Central Park": { short: "Ikonischer Stadtpark mitten in Manhattan.", highlights: ["Bethesda Fountain", "Bow Bridge", "Strawberry Fields"] },
      "Times Square": { short: "Das leuchtende Herz von Manhattan.", highlights: ["Broadway-Theater", "Neon-Reklamen", "TKTS Tickets"] },
    },
    openingHours: {
      "Freiheitsstatue": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Central Park": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–01:00" },
      "Times Square": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
    },
    metroLines: {},
  },
};

const DAY_COLORS = ["#e07b54","#5b8dd9","#6abf69","#d4a84b","#a66dd4","#4bb8c4","#d46d8a","#7aab7a","#c4a882","#8b6a3e","#5a8fa3","#c97a5a"];
function getDayColor(i) { return DAY_COLORS[i % DAY_COLORS.length]; }
const CITY_ORDER = ["paris","london","berlin","rom","barcelona","wien","amsterdam","prag","lissabon","new_york"];

const TRANSLATIONS = {
  de: {
    appName: "Reiseplaner", addPlace: "Ort hinzufügen", insertLink: "LINK EINFÜGEN",
    linkPlaceholder: "https://maps.google.com/ oder Website-URL", analyze: "Analysieren",
    analyzing: "Analyse...", visitDay: "BESUCHSTAG", demo: "Demo-Beispiele:",
    myPlaces: "Alle Orte", allDays: "Alle Tage", dragHint: "ziehen",
    route: "Route", timeline: "Timeline", pdf: "PDF",
    travelMode: "FORTBEWEGUNG", walking: "Zu Fuss", transit: "OEPNV", driving: "Auto",
    openInMaps: "In Google Maps öffnen", stops: "Stopps", timelineTitle: "TAGESPLAN",
    transfer: "+20 Min. Transfer", infoShow: "Info", infoHide: "Ausblenden",
    closedDay: "Geschlossen", unknownHours: "Öffnungszeiten unbekannt", reviews: "Bewertungen",
    budgetTitle: "Budget-Tracker", budgetTotal: "Gesamt", budgetExtras: "+ Extras:",
    budgetNote: "* Schätzungen.", savePlans: "Reisepläne", savedPlans: "Gespeicherte Pläne",
    planNamePlaceholder: "Planname", save: "Speichern", saved: "Gespeichert!",
    load: "Laden", noPlans: "Noch keine Pläne.", addFirst: "Füge Orte hinzu.",
    share: "Teilen", createLink: "Link erstellen", shareHint: "Teile diesen Link:",
    copy: "Kopieren", copied: "Kopiert!", warningTitle: "Achtung",
    warningClosed: "ist an dem gewählten Tag geschlossen!", warningHint: "Bitte Besuchstag ändern.",
    closed: "geschlossen", apiActive: "API aktiv", apiMissing: "API-Key fehlt",
    apiTitle: "OpenAI API-Key", apiHint: "Lokal gespeichert.", apiSave: "Speichern",
    apiSaved: "Gespeichert!", apiDelete: "Key löschen", footerText: "Reiseplaner v4.5",
    noRouteHint: "Füge mind. 2 Orte hinzu.", errorEmpty: "Bitte Link eingeben.",
    errorNotFound: "Link nicht erkannt.",
    days: ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    admission: "Eintritt", free: "Kostenlos", close: "Schliessen", places: "Orte",
    selectCity: "Stadt wählen", customCity: "Andere Stadt",
    customCityPlaceholder: "Stadtname", customCityAdd: "Hinzufügen",
    switchCity: "Stadt wechseln", currentCity: "Aktuelle Stadt",
    travelTime: "Reisezeit", walkingTime: "zu Fuss", transitTime: "mit ÖPNV",
    notePlaceholder: "Notiz (z.B. Tickets vorbuchen!)", noteLabel: "Notiz", noteHide: "Ausblenden",
    sectionTrip: "Reisezeitraum", sectionMap: "Karte", sectionRoute: "Route & Timeline",
    labelStartDate: "Startdatum", labelDays: "Reisetage", labelDaysSuffix: "Tage",
    packingList: "Packliste", weather: "Wetter", budget: "Budget",
  },
  en: {
    appName: "Travel Planner", addPlace: "Add Place", insertLink: "INSERT LINK",
    linkPlaceholder: "https://maps.google.com/ or website URL", analyze: "Analyze",
    analyzing: "Analyzing...", visitDay: "VISIT DAY", demo: "Demo examples:",
    myPlaces: "All Places", allDays: "All Days", dragHint: "drag",
    route: "Route", timeline: "Timeline", pdf: "PDF",
    travelMode: "TRAVEL MODE", walking: "Walking", transit: "Transit", driving: "Car",
    openInMaps: "Open in Google Maps", stops: "Stops", timelineTitle: "DAY PLAN",
    transfer: "+20 min transfer", infoShow: "Info", infoHide: "Hide",
    closedDay: "Closed", unknownHours: "Hours unknown", reviews: "reviews",
    budgetTitle: "Budget Tracker", budgetTotal: "Total", budgetExtras: "+ Extras:",
    budgetNote: "* Estimates.", savePlans: "Travel Plans", savedPlans: "Saved Plans",
    planNamePlaceholder: "Plan name", save: "Save", saved: "Saved!",
    load: "Load", noPlans: "No plans yet.", addFirst: "Add places first.",
    share: "Share", createLink: "Create Link", shareHint: "Share this link:",
    copy: "Copy", copied: "Copied!", warningTitle: "Warning",
    warningClosed: "is closed on the selected day!", warningHint: "Please change the visit day.",
    closed: "closed", apiActive: "API active", apiMissing: "API Key missing",
    apiTitle: "OpenAI API Key", apiHint: "Stored locally.", apiSave: "Save",
    apiSaved: "Saved!", apiDelete: "Delete key", footerText: "Travel Planner v4.5",
    noRouteHint: "Add at least 2 places.", errorEmpty: "Please enter a link.",
    errorNotFound: "Link not recognized.",
    days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    admission: "Admission", free: "Free", close: "Close", places: "Places",
    selectCity: "Select City", customCity: "Other City",
    customCityPlaceholder: "City name", customCityAdd: "Add",
    switchCity: "Switch City", currentCity: "Current City",
    travelTime: "Travel time", walkingTime: "walking", transitTime: "by transit",
    notePlaceholder: "Note (e.g. Book tickets!)", noteLabel: "Note", noteHide: "Hide",
    sectionTrip: "Travel Period", sectionMap: "Map", sectionRoute: "Route & Timeline",
    labelStartDate: "Start date", labelDays: "Travel days", labelDaysSuffix: "days",
    packingList: "Packing List", weather: "Weather", budget: "Budget",
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
  const short = lang === "de" ? shortDE[d.getDay()] : shortEN[d.getDay()];
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

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
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
  const current = Array.isArray(history[cursor]) ? history[cursor] : safeInitial;
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
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
    dayKey = getWeekdayKey(day);
  } else {
    dayKey = DAY_KEY_MAP[day] || null;
  }
  const isOpen = dayKey ? (info[dayKey] !== false) : true;
  return { isOpen, hours: info.hours, note: info.note };
}

function getMetroLine(loc1, loc2, city) {
  if (!loc1 || !loc2 || !city) return null;
  const lines = city.metroLines || {};
  const key = `${loc1.area} -> ${loc2.area}`;
  return lines[key] || null;
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

function PackingList({ locations, numDays, lang }) {
  const { th } = useTheme();
  const [checked, setChecked] = useState({});
  const [customItem, setCustomItem] = useState("");
  const [customItems, setCustomItems] = useState([]);
  const safeLocations = Array.isArray(locations) ? locations : [];
  const types = safeLocations.map(l => (l.type || "").toLowerCase());
  const hasMuseum = types.some(t => t.includes("museum"));
  const hasRestaurant = types.some(t => t.includes("restaurant") || t.includes("cafe"));
  const hasPark = types.some(t => t.includes("park"));
  const hasChurch = types.some(t => t.includes("kirche") || t.includes("dom"));
  const hasMarkt = types.some(t => t.includes("markt"));
  const longTrip = (numDays || 1) >= 5;
  const autoItems = [
    { id: "passport", label: lang==="de" ? "Reisepass / Ausweis" : "Passport / ID", always: true },
    { id: "phone", label: lang==="de" ? "Handy + Ladekabel" : "Phone + charger", always: true },
    { id: "money", label: lang==="de" ? "Karte + Bargeld" : "Card + cash", always: true },
    { id: "insurance", label: lang==="de" ? "Reiseversicherung" : "Travel insurance", always: true },
    { id: "clothes", label: lang==="de" ? `Kleidung fuer ${numDays} Tage` : `Clothes for ${numDays} days`, always: true },
    { id: "shoes", label: lang==="de" ? "Bequeme Schuhe" : "Comfortable shoes", cond: hasMuseum || hasPark },
    { id: "camera", label: lang==="de" ? "Kamera / Powerbank" : "Camera / powerbank", cond: hasMuseum || hasChurch },
    { id: "smart", label: lang==="de" ? "Schicke Kleidung" : "Smart clothes", cond: hasRestaurant },
    { id: "bag", label: lang==="de" ? "Einkaufstasche" : "Shopping bag", cond: hasMarkt },
    { id: "sun", label: lang==="de" ? "Sonnencreme" : "Sunscreen", cond: hasPark },
    { id: "cover", label: lang==="de" ? "Schulterbedeckung" : "Shoulder cover", cond: hasChurch },
    { id: "adapter", label: lang==="de" ? "Reiseadapter" : "Travel adapter", cond: longTrip },
    { id: "meds", label: lang==="de" ? "Medikamente" : "Medication", cond: longTrip },
    { id: "guide", label: lang==="de" ? "Reisefuehrer / Offline-Karten" : "Guidebook / offline maps", always: true },
  ].filter(item => item.always || item.cond);
  const allItems = [...autoItems, ...customItems.map((label, i) => ({ id: `custom_${i}`, label }))];
  const doneCount = allItems.filter(item => checked[item.id]).length;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
        <span style={{ fontSize:"0.75rem", color:th.textMuted }}>{doneCount}/{allItems.length}</span>
        <div style={{ height:5, flex:1, background:th.border, borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${allItems.length ? (doneCount/allItems.length)*100 : 0}%`, background:th.accent, borderRadius:4, transition:"width 0.3s" }} />
        </div>
      </div>
      {allItems.map(item => (
        <label key={item.id} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"6px 10px", borderRadius:8, background:checked[item.id] ? th.accentLight : th.surface, border:`1px solid ${checked[item.id] ? th.accent : th.border}` }}>
          <input type="checkbox" checked={!!checked[item.id]} onChange={() => setChecked(c => ({ ...c, [item.id]: !c[item.id] }))} style={{ accentColor:th.accent, width:15, height:15 }} />
          <span style={{ fontSize:"0.82rem", color:checked[item.id] ? th.textFaint : th.text, textDecoration:checked[item.id] ? "line-through" : "none" }}>{item.label}</span>
        </label>
      ))}
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        <input value={customItem} onChange={e => setCustomItem(e.target.value)}
          onKeyDown={e => { if(e.key==="Enter" && customItem.trim()) { setCustomItems(c => [...c, customItem.trim()]); setCustomItem(""); }}}
          placeholder={lang==="de" ? "Eigenes Item..." : "Custom item..."}
          style={{ flex:1, fontSize:"0.8rem", padding:"5px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={() => { if(customItem.trim()) { setCustomItems(c => [...c, customItem.trim()]); setCustomItem(""); }}}
          style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:"#fff", border:"none", cursor:"pointer", fontWeight:700 }}>+</button>
      </div>
    </div>
  );
}

const WEATHER_DATA = [
  { icon:"S", label:{de:"Sonnig",en:"Sunny"}, temp:[18,28], uv:8 },
  { icon:"C", label:{de:"Bewölkt",en:"Cloudy"}, temp:[12,18], uv:3 },
  { icon:"R", label:{de:"Regen",en:"Rain"}, temp:[9,14], uv:1 },
  { icon:"T", label:{de:"Gewitter",en:"Storm"}, temp:[8,13], uv:1 },
  { icon:"P", label:{de:"Leicht bewölkt",en:"Partly cloudy"}, temp:[14,22], uv:5 },
  { icon:"W", label:{de:"Windig",en:"Windy"}, temp:[11,17], uv:4 },
];

function WeatherWidget({ tripDays, lang, th }) {
  const safedays = Array.isArray(tripDays) ? tripDays : [];
  if (!safedays.length) return null;
  const weathers = safedays.map((d, i) => WEATHER_DATA[(i * 3 + 2) % WEATHER_DATA.length]);
  const icons = { S:"☀️", C:"🌥️", R:"🌧️", T:"⛈️", P:"⛅", W:"💨" };
  return (
    <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
      {safedays.map((day, i) => {
        const w = weathers[i];
        return (
          <div key={day} style={{ minWidth:72, background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:"8px 6px", textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:"0.65rem", color:th.textMuted, marginBottom:2 }}>{formatDateLabel(day, lang)}</div>
            <div style={{ fontSize:"1.3rem" }}>{icons[w.icon]}</div>
            <div style={{ fontSize:"0.62rem", color:th.textMuted, marginTop:1 }}>{w.label[lang]}</div>
            <div style={{ fontSize:"0.7rem", color:th.text, fontWeight:700, marginTop:2 }}>{w.temp[0]}–{w.temp[1]}°</div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const { mode, th } = useTheme();
  const [lang, setLang] = useState("de");
  const t = TRANSLATIONS[lang];

  const [cityId, setCityId] = useState("paris");
  const [customCities, setCustomCities] = useState([]);
  const city = CITIES[cityId] || customCities.find(c => c.id === cityId) || CITIES["paris"];

  const [locations, setLocations, { undo: undoLoc, redo: redoLoc, canUndo, canRedo }] = useUndoRedo([]);
  const safeLocations = Array.isArray(locations) ? locations : [];

  const [locationDays, setLocationDays] = useState({});
  const [locationNotes, setLocationNotes] = useState({});
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0,10));
  const [numDays, setNumDays] = useState(4);
  const [tripDays, setTripDays] = useState(() => generateTripDays(new Date().toISOString().slice(0,10), 4));

  useEffect(() => {
    const newDays = generateTripDays(startDate, numDays);
    setTripDays(newDays);
  }, [startDate, numDays]);

  const [linkInput, setLinkInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [activeTab, setActiveTab] = useState("route");
  const [travelMode, setTravelMode] = useState("walking");
  const [filterDay, setFilterDay] = useState("all");
  const [expandedInfo, setExpandedInfo] = useState({});
  const [expandedNote, setExpandedNote] = useState({});
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [savedPlans, setSavedPlans] = useState(() => {
    const raw = safeJsonParse(localStorage.getItem("travelPlans_v4"), []);
    return Array.isArray(raw) ? raw.map(normalizePlan).filter(Boolean) : [];
  });
  const [planName, setPlanName] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showCityPanel, setShowCityPanel] = useState(false);
  const [customCityInput, setCustomCityInput] = useState("");
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_api_key") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiSaved, setApiSaved] = useState(false);
  const [showSavePlans, setShowSavePlans] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPacking, setShowPacking] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const safeTripDays = Array.isArray(tripDays) ? tripDays : [];

  const filteredLocations = filterDay === "all"
    ? safeLocations
    : safeLocations.filter(loc => locationDays[loc.id] === filterDay);

  function analyzeLink(url) {
    const input = (url || linkInput).trim();
    if (!input) { setLinkError(t.errorEmpty); return; }
    setLinkError("");
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      const matchers = city?.linkMatchers || [];
      let matched = null;
      for (const m of matchers) {
        if (m.pattern.test(input)) {
          matched = (city?.sampleLocations || [])[m.locationIndex];
          break;
        }
      }
      if (!matched) {
        const allCities = [...Object.values(CITIES), ...customCities];
        for (const c of allCities) {
          for (const m of (c.linkMatchers || [])) {
            if (m.pattern.test(input)) {
              matched = (c.sampleLocations || [])[m.locationIndex];
              break;
            }
          }
          if (matched) break;
        }
      }
      if (!matched) { setLinkError(t.errorNotFound); return; }
      const newLoc = { ...matched, id: Date.now(), sourceUrl: input };
      setLocations(prev => {
        const p = Array.isArray(prev) ? prev : [];
        if (p.some(l => l.name === newLoc.name)) return p;
        return [...p, newLoc];
      });
      setLinkInput("");
    }, 800);
  }

  function removeLocation(id) {
    setLocations(prev => (Array.isArray(prev) ? prev : []).filter(l => l.id !== id));
    setLocationDays(d => { const nd = { ...d }; delete nd[id]; return nd; });
    setLocationNotes(n => { const nn = { ...n }; delete nn[id]; return nn; });
  }

  function handleDrop(targetIdx) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setLocations(prev => {
      const p = Array.isArray(prev) ? [...prev] : [];
      const [item] = p.splice(dragIdx, 1);
      p.splice(targetIdx, 0, item);
      return p;
    });
    setDragIdx(null);
    setDragOver(null);
  }

  function loadPlan(plan) {
    const p = normalizePlan(plan);
    if (!p) return;
    setCityId(p.cityId);
    setLocations(Array.isArray(p.locations) ? p.locations : []);
    setLocationDays(p.locationDays || {});
    setLocationNotes(p.locationNotes || {});
    setStartDate(p.startDate);
    setNumDays(p.numDays);
    setShowSavePlans(false);
  }

  function savePlan() {
    if (!planName.trim()) return;
    const plan = normalizePlan({
      id: Date.now(), name: planName, cityId, startDate, numDays,
      tripDays: safeTripDays, locations: safeLocations, locationDays, locationNotes
    });
    if (!plan) return;
    const updated = [...savedPlans.filter(p => p.name !== planName), plan];
    setSavedPlans(updated);
    localStorage.setItem("travelPlans_v4", JSON.stringify(updated));
    setSaveMsg(t.saved);
    setTimeout(() => setSaveMsg(""), 2000);
  }

  function deletePlan(id) {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem("travelPlans_v4", JSON.stringify(updated));
  }

  function createShareLink() {
    const data = { cityId, startDate, numDays, locations: safeLocations, locationDays };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    setShareUrl(window.location.href.split("?")[0] + "?plan=" + encoded);
    setShowShare(true);
  }

  function copyShareUrl() {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("plan");
    if (encoded) {
      try {
        const data = JSON.parse(decodeURIComponent(atob(encoded)));
        const p = normalizePlan(data);
        if (p) { setCityId(p.cityId); setLocations(p.locations); setLocationDays(p.locationDays); setStartDate(p.startDate); setNumDays(p.numDays); }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "map") return;
    const initMap = () => {
      if (!window.L || !mapRef.current) return;
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView([city.lat, city.lng], 13);
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OSM" }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView([city.lat, city.lng], 13);
      }
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      const locs = Array.isArray(filteredLocations) ? filteredLocations : [];
      locs.forEach((loc, i) => {
        if (!loc.lat || !loc.lng) return;
        const dayIdx = safeTripDays.indexOf(locationDays[loc.id]);
        const color = dayIdx >= 0 ? getDayColor(dayIdx) : th.accent;
        const icon = window.L.divIcon({
          className: "",
          html: `<div style="width:28px;height:28px;borderRadius:50%;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${i+1}</div>`,
          iconSize: [28,28], iconAnchor: [14,14]
        });
        const marker = window.L.marker([loc.lat, loc.lng], { icon }).addTo(mapInstanceRef.current);
        marker.bindPopup(`<b>${loc.name}</b><br>${loc.address || ""}`);
        markersRef.current.push(marker);
      });
      if (locs.length > 1) {
        const coords = locs.filter(l => l.lat && l.lng).map(l => [l.lat, l.lng]);
        if (coords.length > 1) {
          const poly = window.L.polyline(coords, { color: th.accent, weight: 3, opacity: 0.7, dashArray: "6 4" }).addTo(mapInstanceRef.current);
          markersRef.current.push(poly);
          mapInstanceRef.current.fitBounds(poly.getBounds(), { padding: [30,30] });
        }
      }
    };
    if (window.L) { initMap(); } else {
      const interval = setInterval(() => { if (window.L) { clearInterval(interval); initMap(); } }, 300);
      return () => clearInterval(interval);
    }
  }, [activeTab, safeLocations, filteredLocations, city, locationDays, travelMode]);

  const closedWarnings = safeLocations.filter(loc => {
    const day = locationDays[loc.id];
    if (!day) return false;
    const info = getOpeningInfo(loc.name, day, city);
    return info && info.isOpen === false;
  });

  const totalBudgetMin = safeLocations.reduce((sum, loc) => {
    const cost = getEntryCost(loc.name, city);
    return sum + (cost ? cost.min : 0);
  }, 0);
  const totalBudgetMax = safeLocations.reduce((sum, loc) => {
    const cost = getEntryCost(loc.name, city);
    return sum + (cost ? cost.max : 0);
  }, 0);

  const navBtn = (label, active, onClick) => (
    <button onClick={onClick} style={{
      padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:600,
      fontSize:"0.7rem", letterSpacing:"0.05em", textTransform:"uppercase",
      background: active ? th.accent : "transparent",
      color: active ? "#fff" : th.textMuted,
      transition:"all 0.15s"
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"'Source Sans 3', system-ui, sans-serif" }}>
      {/* NAVBAR */}
      <nav className="no-print" style={{
        position:"sticky", top:0, zIndex:100, background:th.navBg,
        borderBottom:`1px solid ${th.border}`, backdropFilter:"blur(12px)",
        padding:"0 16px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:"1.2rem", fontFamily:"'Playfair Display', serif", fontWeight:900, color:th.accent }}>
            {city.emoji} {t.appName}
          </span>
          <span style={{ fontSize:"0.65rem", color:th.textMuted, background:th.surface, padding:"2px 8px", borderRadius:10, border:`1px solid ${th.border}` }}>
            {city.country} {city.name}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <button onClick={undoLoc} disabled={!canUndo} title="Undo"
            style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${th.border}`, background:th.surface, cursor:canUndo?"pointer":"default", opacity:canUndo?1:0.35, color:th.text, fontSize:"0.85rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {"<"}
          </button>
          <button onClick={redoLoc} disabled={!canRedo} title="Redo"
            style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${th.border}`, background:th.surface, cursor:canRedo?"pointer":"default", opacity:canRedo?1:0.35, color:th.text, fontSize:"0.85rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {">"}
          </button>
          <button onClick={toggleTheme} className="theme-toggle-btn"
            style={{ width:30, height:30, borderRadius:"50%", border:`1px solid ${th.border}`, background:th.surface, cursor:"pointer", color:th.accent, fontSize:"0.85rem", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {mode === "dark" ? "L" : "D"}
          </button>
          <button onClick={() => setLang(l => l === "de" ? "en" : "de")}
            style={{ padding:"4px 10px", borderRadius:14, border:`1px solid ${th.border}`, background:th.surface, cursor:"pointer", color:th.textMuted, fontSize:"0.72rem", fontWeight:700 }}>
            {lang === "de" ? "EN" : "DE"}
          </button>
          <button onClick={() => setShowCityPanel(v => !v)}
            style={{ padding:"4px 10px", borderRadius:14, border:`1px solid ${th.border}`, background:th.surface, cursor:"pointer", color:th.textMuted, fontSize:"0.72rem" }}>
            {t.switchCity}
          </button>
          <button onClick={() => window.print()} className="no-print"
            style={{ padding:"4px 10px", borderRadius:14, border:`1px solid ${th.border}`, background:th.surface, cursor:"pointer", color:th.textMuted, fontSize:"0.72rem" }}>
            PDF
          </button>
        </div>
      </nav>

      {/* CITY PANEL */}
      {showCityPanel && (
        <div className="no-print" style={{ position:"fixed", top:52, right:0, zIndex:200, background:th.surface, border:`1px solid ${th.border}`, borderRadius:"0 0 0 16px", padding:16, minWidth:240, boxShadow:th.shadow }}>
          <div style={{ fontWeight:700, fontSize:"0.8rem", color:th.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.08em" }}>{t.selectCity}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {CITY_ORDER.map(id => {
              const c = CITIES[id];
              if (!c) return null;
              return (
                <button key={id} onClick={() => { setCityId(id); setShowCityPanel(false); }}
                  style={{ textAlign:"left", padding:"8px 12px", borderRadius:10, border:`1px solid ${cityId===id ? th.accent : th.border}`, background:cityId===id ? th.accentLight : th.card, cursor:"pointer", color:th.text, fontSize:"0.82rem", fontWeight:cityId===id ? 700 : 400 }}>
                  {c.emoji} {c.name} {c.country}
                </button>
              );
            })}
            {customCities.map(c => (
              <button key={c.id} onClick={() => { setCityId(c.id); setShowCityPanel(false); }}
                style={{ textAlign:"left", padding:"8px 12px", borderRadius:10, border:`1px solid ${cityId===c.id ? th.accent : th.border}`, background:cityId===c.id ? th.accentLight : th.card, cursor:"pointer", color:th.text, fontSize:"0.82rem" }}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
          <div style={{ marginTop:10, display:"flex", gap:6 }}>
            <input value={customCityInput} onChange={e => setCustomCityInput(e.target.value)}
              placeholder={t.customCityPlaceholder}
              style={{ flex:1, fontSize:"0.8rem", padding:"5px 8px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            <button onClick={() => {
              if (!customCityInput.trim()) return;
              const id = customCityInput.trim().toLowerCase().replace(/\s+/g,"_");
              const newCity = { id, name: customCityInput.trim(), emoji: "🌍", country: "", lat: 48.8566, lng: 2.3522, timezone: "UTC", sampleLocations: [], demoLinks: [], linkMatchers: [], entryCosts: {}, ratings: {}, locationInfo: {}, openingHours: {}, metroLines: {} };
              setCustomCities(prev => [...prev, newCity]);
              setCityId(id);
              setCustomCityInput("");
              setShowCityPanel(false);
            }} style={{ padding:"5px 10px", borderRadius:8, background:th.accent, color:"#fff", border:"none", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>
              {t.customCityAdd}
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth:720, margin:"0 auto", padding:"16px 12px" }}>

        {/* TRIP PERIOD */}
        <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t.sectionTrip}</div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
            <div>
              <label style={{ fontSize:"0.7rem", color:th.textMuted, display:"block", marginBottom:3 }}>{t.labelStartDate}</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                style={{ fontSize:"0.85rem", padding:"5px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            </div>
            <div>
              <label style={{ fontSize:"0.7rem", color:th.textMuted, display:"block", marginBottom:3 }}>{t.labelDays}</label>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => setNumDays(n => Math.max(1, n-1))}
                  style={{ width:28, height:28, borderRadius:"50%", border:`1px solid ${th.border}`, background:th.card, cursor:"pointer", color:th.text, fontWeight:700 }}>-</button>
                <span style={{ fontSize:"0.95rem", fontWeight:700, minWidth:24, textAlign:"center" }}>{numDays}</span>
                <button onClick={() => setNumDays(n => Math.min(30, n+1))}
                  style={{ width:28, height:28, borderRadius:"50%", border:`1px solid ${th.border}`, background:th.card, cursor:"pointer", color:th.text, fontWeight:700 }}>+</button>
                <span style={{ fontSize:"0.7rem", color:th.textMuted }}>{t.labelDaysSuffix}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {safeTripDays.map((day, i) => (
                <div key={day} style={{ fontSize:"0.65rem", padding:"3px 8px", borderRadius:10, background:th.card, border:`2px solid ${getDayColor(i)}`, color:th.text, fontWeight:600 }}>
                  {formatDateLabel(day, lang)}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WARNINGS */}
        {closedWarnings.length > 0 && (
          <div style={{ background:th.warningBg, border:`1px solid ${th.warning}`, borderRadius:12, padding:"10px 14px", marginBottom:12, fontSize:"0.8rem", color:th.warning }}>
            <strong>{t.warningTitle}:</strong>{" "}
            {closedWarnings.map(l => l.name).join(", ")} {t.warningClosed} {t.warningHint}
          </div>
        )}

        {/* LINK INPUT */}
        <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t.insertLink}</div>
          <div style={{ display:"flex", gap:8 }}>
            <input value={linkInput} onChange={e => setLinkInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && analyzeLink()}
              placeholder={t.linkPlaceholder}
              style={{ flex:1, fontSize:"0.85rem", padding:"8px 12px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${linkError ? th.warning : th.inputBorder}`, outline:"none" }} />
            <button onClick={() => analyzeLink()} disabled={analyzing} className="btn-primary"
              style={{ padding:"8px 16px", borderRadius:10, border:"none", cursor:"pointer", background:th.accent, color:"#fff", fontWeight:700, fontSize:"0.8rem", opacity:analyzing?0.7:1 }}>
              {analyzing ? t.analyzing : t.analyze}
            </button>
          </div>
          {linkError && <div style={{ color:th.warning, fontSize:"0.75rem", marginTop:6 }}>{linkError}</div>}
          {(city?.demoLinks || []).length > 0 && (
            <div style={{ marginTop:10 }}>
              <span style={{ fontSize:"0.68rem", color:th.textMuted }}>{t.demo} </span>
              {(city.demoLinks).map((link, i) => (
                <button key={i} onClick={() => analyzeLink(link)}
                  style={{ fontSize:"0.68rem", color:th.accent, background:"none", border:"none", cursor:"pointer", padding:"0 4px", textDecoration:"underline" }}>
                  {(city.sampleLocations || [])[i]?.name || link}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* TABS */}
        <div className="no-print" style={{ display:"flex", gap:4, marginBottom:12, background:th.surface, borderRadius:12, padding:4, border:`1px solid ${th.border}` }}>
          {["route","map","timeline"].map(tab => navBtn(t[tab], activeTab===tab, () => setActiveTab(tab)))}
          <div style={{ flex:1 }} />
          <button onClick={() => setShowWeather(v => !v)}
            style={{ padding:"5px 12px", borderRadius:10, border:`1px solid ${th.border}`, background:showWeather?th.accentLight:th.card, cursor:"pointer", color:th.textMuted, fontSize:"0.7rem" }}>
            {t.weather}
          </button>
          <button onClick={() => setShowPacking(v => !v)}
            style={{ padding:"5px 12px", borderRadius:10, border:`1px solid ${th.border}`, background:showPacking?th.accentLight:th.card, cursor:"pointer", color:th.textMuted, fontSize:"0.7rem" }}>
            {t.packingList}
          </button>
          <button onClick={() => setShowSavePlans(v => !v)}
            style={{ padding:"5px 12px", borderRadius:10, border:`1px solid ${th.border}`, background:showSavePlans?th.accentLight:th.card, cursor:"pointer", color:th.textMuted, fontSize:"0.7rem" }}>
            {t.savePlans}
          </button>
          <button onClick={createShareLink}
            style={{ padding:"5px 12px", borderRadius:10, border:`1px solid ${th.border}`, background:th.card, cursor:"pointer", color:th.textMuted, fontSize:"0.7rem" }}>
            {t.share}
          </button>
        </div>

        {/* WEATHER */}
        {showWeather && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t.weather}</div>
            <WeatherWidget tripDays={safeTripDays} lang={lang} th={th} />
          </section>
        )}

        {/* PACKING LIST */}
        {showPacking && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t.packingList}</div>
            <PackingList locations={safeLocations} numDays={numDays} lang={lang} />
          </section>
        )}

        {/* SAVE PLANS */}
        {showSavePlans && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t.savedPlans}</div>
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <input value={planName} onChange={e => setPlanName(e.target.value)}
                placeholder={t.planNamePlaceholder}
                style={{ flex:1, fontSize:"0.85rem", padding:"7px 12px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
              <button onClick={savePlan}
                style={{ padding:"7px 16px", borderRadius:10, background:th.accent, color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.8rem" }}>
                {saveMsg || t.save}
              </button>
            </div>
            {savedPlans.length === 0 ? (
              <div style={{ fontSize:"0.8rem", color:th.textMuted }}>{t.noPlans}</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {savedPlans.map(plan => (
                  <div key={plan.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", background:th.card, borderRadius:10, border:`1px solid ${th.border}` }}>
                    <span style={{ flex:1, fontSize:"0.82rem", color:th.text }}>{plan.name}</span>
                    <span style={{ fontSize:"0.68rem", color:th.textMuted }}>{(CITIES[plan.cityId]||{}).name || plan.cityId}</span>
                    <button onClick={() => loadPlan(plan)}
                      style={{ padding:"3px 10px", borderRadius:8, background:th.accent, color:"#fff", border:"none", cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}>
                      {t.load}
                    </button>
                    <button onClick={() => deletePlan(plan.id)}
                      style={{ padding:"3px 8px", borderRadius:8, background:th.warningBg, color:th.warning, border:`1px solid ${th.warning}`, cursor:"pointer", fontSize:"0.75rem" }}>
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SHARE */}
        {showShare && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, marginBottom:8 }}>{t.shareHint}</div>
            <div style={{ display:"flex", gap:8 }}>
              <input readOnly value={shareUrl} style={{ flex:1, fontSize:"0.75rem", padding:"6px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
              <button onClick={copyShareUrl}
                style={{ padding:"6px 14px", borderRadius:8, background:th.accent, color:"#fff", border:"none", cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}>
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </section>
        )}

        {/* DAY FILTER */}
        {safeLocations.length > 0 && (
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
            <button onClick={() => setFilterDay("all")} className="tab-btn"
              style={{ padding:"4px 12px", borderRadius:10, border:`1px solid ${filterDay==="all" ? th.accent : th.border}`, background:filterDay==="all" ? th.accentLight : th.card, color:filterDay==="all" ? th.accent : th.textMuted, cursor:"pointer" }}>
              {t.allDays}
            </button>
            {safeTripDays.map((day, i) => (
              <button key={day} onClick={() => setFilterDay(day)} className="tab-btn"
                style={{ padding:"4px 12px", borderRadius:10, border:`2px solid ${filterDay===day ? getDayColor(i) : th.border}`, background:filterDay===day ? "rgba(0,0,0,0.08)" : th.card, color:filterDay===day ? getDayColor(i) : th.textMuted, cursor:"pointer", fontWeight:filterDay===day ? 700 : 400 }}>
                {formatDateLabel(day, lang)}
              </button>
            ))}
          </div>
        )}

        {/* ROUTE TAB */}
        {activeTab === "route" && (
          <div>
            {safeLocations.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:th.textMuted, fontSize:"0.9rem" }}>
                <div style={{ fontSize:"2rem", marginBottom:8 }}>🗺️</div>
                <div>{t.addFirst}</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filteredLocations.map((loc, i) => {
                  const cost = getEntryCost(loc.name, city);
                  const rating = getRating(loc.name, city);
                  const info = getLocationInfo(loc.name, city);
                  const assignedDay = locationDays[loc.id];
                  const openInfo = assignedDay ? getOpeningInfo(loc.name, assignedDay, city) : null;
                  const isClosed = openInfo && openInfo.isOpen === false;
                  const dayIdx = safeTripDays.indexOf(assignedDay);
                  const dayColor = dayIdx >= 0 ? getDayColor(dayIdx) : th.border;
                  const travelInfo = i > 0 && filteredLocations[i-1] ? calcTravelTime(filteredLocations[i-1], loc) : null;
                  const note = locationNotes[loc.id] || "";

                  return (
                    <div key={loc.id}>
                      {travelInfo && (
                        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 12px", fontSize:"0.68rem", color:th.textMuted }}>
                          <div style={{ flex:1, height:1, background:th.border }} />
                          <span>{travelInfo.distKm} km</span>
                          <span>•</span>
                          <span>{travelMode === "walking" ? travelInfo.walkMin + " min " + t.walkingTime : travelInfo.transitMin + " min " + t.transitTime}</span>
                          <div style={{ flex:1, height:1, background:th.border }} />
                        </div>
                      )}
                      <div className="app-card-hover card-anim print-card"
                        draggable
                        onDragStart={() => setDragIdx(i)}
                        onDragOver={e => { e.preventDefault(); setDragOver(i); }}
                        onDrop={() => handleDrop(i)}
                        onDragEnd={() => { setDragIdx(null); setDragOver(null); }}
                        style={{
                          background: th.card, border: `2px solid ${isClosed ? th.warning : dragOver === i ? th.accent : dayColor}`,
                          borderRadius:14, padding:"12px 14px", cursor:"grab", position:"relative",
                          opacity: dragIdx === i ? 0.5 : 1
                        }}>
                        <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:"50%", background:dayColor, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0, color:"#fff" }}>
                            {i + 1}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                              <span style={{ fontWeight:700, fontSize:"0.95rem", color:th.text }}>{loc.name}</span>
                              {rating && (
                                <span style={{ fontSize:"0.65rem", background:th.goldBg, color:th.gold, padding:"1px 6px", borderRadius:8, fontWeight:700 }}>
                                  {rating.badge}
                                </span>
                              )}
                              {isClosed && (
                                <span style={{ fontSize:"0.65rem", background:th.warningBg, color:th.warning, padding:"1px 6px", borderRadius:8, fontWeight:700 }}>
                                  {t.closedDay}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:2 }}>{loc.type} • {loc.area} • {loc.duration}</div>
                            {rating && (
                              <div style={{ fontSize:"0.7rem", color:th.textMuted, marginTop:2 }}>
                                {"★".repeat(Math.round(rating.stars))}{"☆".repeat(5-Math.round(rating.stars))} {rating.stars} ({(rating.reviews/1000).toFixed(0)}k {t.reviews}) • {rating.price}
                              </div>
                            )}
                            {cost && (
                              <div style={{ fontSize:"0.7rem", color:th.accent, marginTop:2 }}>
                                {t.admission}: {cost.min === 0 ? t.free : `${cost.currency}${cost.min}${cost.max !== cost.min ? "–"+cost.max : ""}`}
                                {cost.note ? ` (${cost.note})` : ""}
                              </div>
                            )}
                            {openInfo && (
                              <div style={{ fontSize:"0.7rem", color:isClosed ? th.warning : th.success, marginTop:2 }}>
                                {isClosed ? t.closedDay : openInfo.hours}
                                {openInfo.note ? " • " + openInfo.note : ""}
                              </div>
                            )}
                          </div>
                          <button onClick={() => removeLocation(loc.id)}
                            style={{ padding:"3px 8px", borderRadius:8, background:th.warningBg, color:th.warning, border:"none", cursor:"pointer", fontSize:"0.7rem", fontWeight:700, flexShrink:0 }}>
                            X
                          </button>
                        </div>

                        {/* DAY ASSIGN */}
                        <div style={{ marginTop:10, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
                          <span style={{ fontSize:"0.65rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{t.visitDay}:</span>
                          <button onClick={() => setLocationDays(d => { const nd={...d}; delete nd[loc.id]; return nd; })}
                            style={{ padding:"2px 8px", borderRadius:8, border:`1px solid ${!assignedDay ? th.accent : th.border}`, background:!assignedDay ? th.accentLight : th.card, color:!assignedDay ? th.accent : th.textMuted, cursor:"pointer", fontSize:"0.65rem" }}>
                            -
                          </button>
                          {safeTripDays.map((day, di) => (
                            <button key={day} onClick={() => setLocationDays(d => ({ ...d, [loc.id]: day }))}
                              style={{ padding:"2px 8px", borderRadius:8, border:`2px solid ${assignedDay===day ? getDayColor(di) : th.border}`, background:assignedDay===day ? "rgba(0,0,0,0.06)" : th.card, color:assignedDay===day ? getDayColor(di) : th.textMuted, cursor:"pointer", fontSize:"0.65rem", fontWeight:assignedDay===day ? 700 : 400 }}>
                              {formatDateLabel(day, lang)}
                            </button>
                          ))}
                        </div>

                        {/* INFO TOGGLE */}
                        {info && (
                          <div style={{ marginTop:8 }}>
                            <button onClick={() => setExpandedInfo(e => ({ ...e, [loc.id]: !e[loc.id] }))}
                              style={{ fontSize:"0.7rem", color:th.accent, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                              {expandedInfo[loc.id] ? t.infoHide : t.infoShow}
                            </button>
                            {expandedInfo[loc.id] && (
                              <div style={{ marginTop:6, fontSize:"0.78rem", color:th.textMuted, background:th.surface, borderRadius:8, padding:"8px 10px" }}>
                                <div style={{ marginBottom:4 }}>{info.short}</div>
                                {(info.highlights || []).map((h, hi) => (
                                  <div key={hi} style={{ display:"flex", gap:6, alignItems:"flex-start" }}>
                                    <span style={{ color:th.accent, flexShrink:0 }}>•</span>
                                    <span>{h}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* NOTE */}
                        <div style={{ marginTop:6 }}>
                          <button onClick={() => setExpandedNote(e => ({ ...e, [loc.id]: !e[loc.id] }))}
                            style={{ fontSize:"0.7rem", color:th.textMuted, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                            {expandedNote[loc.id] ? t.noteHide : t.noteLabel}
                          </button>
                          {expandedNote[loc.id] && (
                            <textarea value={note}
                              onChange={e => setLocationNotes(n => ({ ...n, [loc.id]: e.target.value }))}
                              placeholder={t.notePlaceholder}
                              style={{ width:"100%", marginTop:4, fontSize:"0.78rem", padding:"6px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, resize:"vertical", minHeight:50 }} />
                          )}
                        </div>

                        {/* MAPS LINK */}
                        {loc.sourceUrl && (
                          <div style={{ marginTop:8 }}>
                            <a href={loc.sourceUrl} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize:"0.7rem", color:th.info, textDecoration:"none" }}>
                              {t.openInMaps}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === "map" && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, overflow:"hidden", marginBottom:14 }}>
            <div style={{ padding:"10px 14px", borderBottom:`1px solid ${th.border}`, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{t.sectionMap}</span>
              <div style={{ flex:1 }} />
              {[["walking", t.walking], ["transit", t.transit], ["driving", t.driving]].map(([m, label]) => (
                <button key={m} onClick={() => setTravelMode(m)}
                  style={{ padding:"3px 10px", borderRadius:10, border:`1px solid ${travelMode===m ? th.accent : th.border}`, background:travelMode===m ? th.accentLight : th.card, color:travelMode===m ? th.accent : th.textMuted, cursor:"pointer", fontSize:"0.68rem", fontWeight:travelMode===m ? 700 : 400 }}>
                  {label}
                </button>
              ))}
            </div>
            <div ref={mapRef} style={{ height:380, width:"100%" }} />
            {safeLocations.length === 0 && (
              <div style={{ padding:20, textAlign:"center", color:th.textMuted, fontSize:"0.85rem" }}>{t.addFirst}</div>
            )}
          </section>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>{t.timelineTitle}</div>
            {safeTripDays.length === 0 ? (
              <div style={{ color:th.textMuted, fontSize:"0.85rem" }}>{t.addFirst}</div>
            ) : safeTripDays.map((day, di) => {
              const dayLocs = safeLocations.filter(l => locationDays[l.id] === day);
              return (
                <div key={day} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", background:getDayColor(di) }} />
                    <span style={{ fontWeight:700, fontSize:"0.85rem", color:getDayColor(di) }}>{formatDateLabel(day, lang)}</span>
                    <span style={{ fontSize:"0.68rem", color:th.textMuted }}>({dayLocs.length} {t.stops})</span>
                  </div>
                  {dayLocs.length === 0 ? (
                    <div style={{ fontSize:"0.78rem", color:th.textFaint, paddingLeft:18 }}>{t.addFirst}</div>
                  ) : (
                    <div style={{ paddingLeft:18, borderLeft:`2px solid ${getDayColor(di)}`, display:"flex", flexDirection:"column", gap:8 }}>
                      {dayLocs.map((loc, li) => {
                        const travelInfo = li > 0 ? calcTravelTime(dayLocs[li-1], loc) : null;
                        const openInfo = getOpeningInfo(loc.name, day, city);
                        return (
                          <div key={loc.id}>
                            {travelInfo && (
                              <div style={{ fontSize:"0.65rem", color:th.textMuted, padding:"2px 0 2px 10px" }}>
                                {travelMode === "walking" ? travelInfo.walkMin + " min" : travelInfo.transitMin + " min"} ({travelInfo.distKm} km)
                              </div>
                            )}
                            <div style={{ background:th.card, borderRadius:10, padding:"8px 12px", border:`1px solid ${th.border}` }}>
                              <div style={{ fontWeight:700, fontSize:"0.85rem" }}>{loc.icon} {loc.name}</div>
                              <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{loc.duration} • {loc.area}</div>
                              {openInfo && (
                                <div style={{ fontSize:"0.68rem", color:openInfo.isOpen === false ? th.warning : th.success, marginTop:2 }}>
                                  {openInfo.isOpen === false ? t.closedDay : openInfo.hours}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* BUDGET */}
        {safeLocations.length > 0 && (
          <section style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:"0.75rem", color:th.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>{t.budgetTitle}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {safeLocations.map(loc => {
                const cost = getEntryCost(loc.name, city);
                if (!cost) return null;
                return (
                  <div key={loc.id} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8rem" }}>
                    <span style={{ color:th.text }}>{loc.name}</span>
                    <span style={{ color:th.accent, fontWeight:600 }}>
                      {cost.min === 0 ? t.free : `${cost.currency}${cost.min}${cost.max !== cost.min ? "–"+cost.max : ""}`}
                    </span>
                  </div>
                );
              })}
              <div style={{ borderTop:`1px solid ${th.border}`, paddingTop:8, display:"flex", justifyContent:"space-between", fontWeight:700 }}>
                <span style={{ color:th.text }}>{t.budgetTotal}</span>
                <span style={{ color:th.gold }}>
                  {totalBudgetMin === totalBudgetMax ? `€${totalBudgetMin.toFixed(0)}` : `€${totalBudgetMin.toFixed(0)}–${totalBudgetMax.toFixed(0)}`}
                </span>
              </div>
              <div style={{ fontSize:"0.65rem", color:th.textFaint }}>{t.budgetNote}</div>
            </div>
          </section>
        )}

        {/* FOOTER */}
        <div style={{ textAlign:"center", fontSize:"0.68rem", color:th.textFaint, padding:"16px 0 8px" }}>
          {t.footerText}
        </div>
      </div>
    </div>
  );
}
