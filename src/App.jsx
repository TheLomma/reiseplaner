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

if (typeof window !== "undefined" && !document.getElementById("app-theme-styles")) {
  const s = document.createElement("style");
  s.id = "app-theme-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@300;400;600;700&display=swap');
    @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes markerBounce { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-10px) scale(1.1)} 60%{transform:translateY(-5px) scale(1.05)} }
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
      .print-header { font-size: 1.4rem; font-weight: 900; margin-bottom: 4px; }
      .print-meta { font-size: 0.8rem; color: #555; margin-bottom: 16px; }
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
      { id: 1, name: "Eiffelturm", type: "Sehenswürdigkeit", address: "Champ de Mars, 75007 Paris", lat: 48.8584, lng: 2.2945, area: "7. Arrondissement", duration: "1,5 Std.", icon: "✈️" },
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
      "Le Grand Véfour": { min: 80.00, max: 350.00, currency: "€", note: "Mittagsmenü–À la carte" },
      "Louvre": { min: 22.00, max: 22.00, currency: "€", note: "Erwachsene" },
      "Sacré-Cœur": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Eiffelturm": { stars: 4.8, reviews: 284000, price: "€€", badge: "Weltbekannt" },
      "Arc de Triomphe": { stars: 4.7, reviews: 98000, price: "€€", badge: "Muss man gesehen haben" },
      "Le Grand Véfour": { stars: 4.5, reviews: 1200, price: "€€€€", badge: "Michelin-Stern" },
      "Louvre": { stars: 4.7, reviews: 312000, price: "€€", badge: "Weltbekannt" },
      "Sacré-Cœur": { stars: 4.8, reviews: 134000, price: "Kostenlos", badge: "Geheimtipp" },
    },
    locationInfo: {
      "Eiffelturm": { short: "Wahrzeichen von Paris, 330m hoch, 1889 erbaut.", highlights: ["Aussichtsplattform im 2. & 3. Stock", "Abends Lichtshow", "Champ de Mars Picknick"] },
      "Arc de Triomphe": { short: "Triumphbogen am Place Charles de Gaulle.", highlights: ["Dachterrasse mit Panoramablick", "Grab des Unbekannten Soldaten", "Champs-Élysées"] },
      "Le Grand Véfour": { short: "Eines der ältesten Restaurants von Paris, seit 1784.", highlights: ["Historisches Interieur", "Sternküche", "Napoleon & Victor Hugo"] },
      "Louvre": { short: "Größtes Kunstmuseum der Welt.", highlights: ["Mona Lisa", "Venus von Milo", "Glaspyramide"] },
      "Sacré-Cœur": { short: "Weiße Basilika auf dem Montmartre-Hügel.", highlights: ["Panoramablick über Paris", "Künstlerviertel", "Place du Tertre"] },
    },
    openingHours: {
      "Eiffelturm": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–23:45" },
      "Arc de Triomphe": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–23:00" },
      "Le Grand Véfour": { mo: true, di: true, mi: true, do: true, fr: true, sa: false, so: false, hours: "12:00–14:00, 19:30–22:00", note: "Sa & So geschlossen" },
      "Louvre": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–18:00", note: "Mo geschlossen" },
      "Sacré-Cœur": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–22:30" },
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
      "Museumsinsel": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–18:00", note: "Mo teilw. geschlossen" },
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
      "Kolosseum": { short: "Antikes Amphitheater, erbaut 70–80 n.Chr.", highlights: ["Arena & Untergeschosse", "Palatin-Hügel", "Sonnenuntergang-Blick"] },
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
      { id: 1, name: "Sagrada Família", type: "Sehenswürdigkeit", address: "C/ de Mallorca, 401, 08013 Barcelona", lat: 41.4036, lng: 2.1744, area: "Eixample", duration: "2 Std.", icon: "⛪" },
      { id: 2, name: "Park Güell", type: "Park", address: "08024 Barcelona", lat: 41.4145, lng: 2.1527, area: "Gràcia", duration: "1,5 Std.", icon: "🦎" },
      { id: 3, name: "La Boqueria", type: "Markt", address: "La Rambla, 91, 08001 Barcelona", lat: 41.3816, lng: 2.1719, area: "Ciutat Vella", duration: "1 Std.", icon: "🥘" },
    ],
    demoLinks: ["https://maps.google.com/?q=sagrada+familia", "https://maps.google.com/?q=park+guell", "https://maps.google.com/?q=la+boqueria"],
    linkMatchers: [
      { pattern: /sagrada|familia/i, locationIndex: 0 },
      { pattern: /güell|guell/i, locationIndex: 1 },
      { pattern: /boqueria|rambla/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Sagrada Família": { min: 26, max: 36, currency: "€", note: "mit/ohne Turm" },
      "Park Güell": { min: 10, max: 10, currency: "€", note: "Erwachsene" },
      "La Boqueria": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Sagrada Família": { stars: 4.8, reviews: 240000, price: "€€", badge: "UNESCO Welterbe" },
      "Park Güell": { stars: 4.6, reviews: 175000, price: "€", badge: "Gaudí-Meisterwerk" },
      "La Boqueria": { stars: 4.5, reviews: 98000, price: "€€", badge: "Foodie-Paradies" },
    },
    locationInfo: {
      "Sagrada Família": { short: "Gaudís unvollendete Basilika, Baubeginn 1882.", highlights: ["Fassaden: Geburt & Passion", "Turmbesteigung", "Lichtspiel im Inneren"] },
      "Park Güell": { short: "Gaudís bunter Stadtpark auf einem Hügel.", highlights: ["Mosaikbank mit Panorama", "Drachenskulptur", "Hypostyl-Halle"] },
      "La Boqueria": { short: "Berühmter Markt an der Rambla.", highlights: ["Frische Säfte & Tapas", "Meeresfrüchte-Stände", "Bunte Obst-Displays"] },
    },
    openingHours: {
      "Sagrada Família": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–20:00" },
      "Park Güell": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:30–19:30" },
      "La Boqueria": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "08:00–20:30", note: "So geschlossen" },
    },
    metroLines: {},
  },
  amsterdam: {
    id: "amsterdam", name: "Amsterdam", emoji: "🌷", country: "🇳🇱",
    lat: 52.3676, lng: 4.9041, timezone: "Europe/Amsterdam",
    sampleLocations: [
      { id: 1, name: "Rijksmuseum", type: "Museum", address: "Museumstraat 1, 1071 XX Amsterdam", lat: 52.3600, lng: 4.8852, area: "Museumplein", duration: "2,5 Std.", icon: "🎨" },
      { id: 2, name: "Anne-Frank-Haus", type: "Museum", address: "Prinsengracht 263-267, Amsterdam", lat: 52.3752, lng: 4.8840, area: "Jordaan", duration: "1,5 Std.", icon: "📖" },
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
      "Anne-Frank-Haus": { min: 16, max: 16, currency: "€", note: "Nur online buchbar" },
      "Vondelpark": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Rijksmuseum": { stars: 4.8, reviews: 95000, price: "€€", badge: "Weltklasse" },
      "Anne-Frank-Haus": { stars: 4.7, reviews: 68000, price: "€", badge: "Bewegend" },
      "Vondelpark": { stars: 4.7, reviews: 120000, price: "Kostenlos", badge: "Oase" },
    },
    locationInfo: {
      "Rijksmuseum": { short: "Niederländisches Nationalmuseum mit Rembrandts Nachtwache.", highlights: ["Nachtwache", "Delfter Blau", "Museumsgarten"] },
      "Anne-Frank-Haus": { short: "Versteck der Familie Frank im Zweiten Weltkrieg.", highlights: ["Originales Hinterhaus", "Tagebuch-Ausstellung", "Früh buchen!"] },
      "Vondelpark": { short: "Größter Stadtpark Amsterdams.", highlights: ["Open-Air-Theater", "Cafés & Spielplätze", "Joggen & Radfahren"] },
    },
    openingHours: {
      "Rijksmuseum": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Anne-Frank-Haus": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–22:00" },
      "Vondelpark": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer geöffnet" },
    },
    metroLines: {},
  },
  wien: {
    id: "wien", name: "Wien", emoji: "🎵", country: "🇦🇹",
    lat: 48.2082, lng: 16.3738, timezone: "Europe/Vienna",
    sampleLocations: [
      { id: 1, name: "Schloss Schönbrunn", type: "Sehenswürdigkeit", address: "Schönbrunner Schloßstraße 47, 1130 Wien", lat: 48.1845, lng: 16.3122, area: "Hietzing", duration: "2,5 Std.", icon: "🏰" },
      { id: 2, name: "Stephansdom", type: "Sehenswürdigkeit", address: "Stephansplatz 3, 1010 Wien", lat: 48.2082, lng: 16.3738, area: "Innere Stadt", duration: "1 Std.", icon: "⛪" },
      { id: 3, name: "Naschmarkt", type: "Markt", address: "1060 Wien", lat: 48.1988, lng: 16.3632, area: "Mariahilf", duration: "1,5 Std.", icon: "🥘" },
    ],
    demoLinks: ["https://maps.google.com/?q=schloss+schoenbrunn", "https://maps.google.com/?q=stephansdom+wien", "https://maps.google.com/?q=naschmarkt+wien"],
    linkMatchers: [
      { pattern: /schönbrunn|schoenbrunn|schloss/i, locationIndex: 0 },
      { pattern: /stephansdom|stephan/i, locationIndex: 1 },
      { pattern: /naschmarkt/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Schloss Schönbrunn": { min: 24, max: 29, currency: "€", note: "Imperial / Grand Tour" },
      "Stephansdom": { min: 0, max: 6, currency: "€", note: "Kirche frei / Turm 6€" },
      "Naschmarkt": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Schloss Schönbrunn": { stars: 4.7, reviews: 125000, price: "€€", badge: "UNESCO Welterbe" },
      "Stephansdom": { stars: 4.8, reviews: 92000, price: "€", badge: "Wahrzeichen" },
      "Naschmarkt": { stars: 4.5, reviews: 55000, price: "€€", badge: "Kulinarisch" },
    },
    locationInfo: {
      "Schloss Schönbrunn": { short: "Kaiserliche Sommerresidenz der Habsburger.", highlights: ["Prunkräume", "Schlossgarten & Gloriette", "Ältester Zoo der Welt"] },
      "Stephansdom": { short: "Gotische Kathedrale im Herzen Wiens.", highlights: ["Südturm (343 Stufen)", "Katakomben-Führung", "Pummerin-Glocke"] },
      "Naschmarkt": { short: "Wiens beliebtester Markt seit dem 16. Jhd.", highlights: ["Internationale Küche", "Flohmarkt am Samstag", "Kaffeehäuser"] },
    },
    openingHours: {
      "Schloss Schönbrunn": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Stephansdom": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–22:00" },
      "Naschmarkt": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "06:00–19:30", note: "So geschlossen" },
    },
    metroLines: {},
  },
  prag: {
    id: "prag", name: "Prag", emoji: "🏰", country: "🇨🇿",
    lat: 50.0755, lng: 14.4378, timezone: "Europe/Prague",
    sampleLocations: [
      { id: 1, name: "Karlsbrücke", type: "Sehenswürdigkeit", address: "Karlův most, 110 00 Praha", lat: 50.0865, lng: 14.4114, area: "Altstadt", duration: "1 Std.", icon: "🌉" },
      { id: 2, name: "Prager Burg", type: "Sehenswürdigkeit", address: "Hradčany, 119 08 Praha", lat: 50.0911, lng: 14.4003, area: "Hradschin", duration: "2,5 Std.", icon: "🏰" },
      { id: 3, name: "Altstädter Ring", type: "Platz", address: "Staroměstské nám., 110 00 Praha", lat: 50.0873, lng: 14.4213, area: "Altstadt", duration: "1 Std.", icon: "⏰" },
    ],
    demoLinks: ["https://maps.google.com/?q=karlsbruecke+prag", "https://maps.google.com/?q=prager+burg", "https://maps.google.com/?q=altstadter+ring+prag"],
    linkMatchers: [
      { pattern: /karls.*br[üu]cke|charles.*bridge|karluv/i, locationIndex: 0 },
      { pattern: /prager.*burg|prague.*castle|hrad/i, locationIndex: 1 },
      { pattern: /altstädter|altstadter|old.*town.*square|staromest/i, locationIndex: 2 },
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
      "Karlsbrücke": { short: "Gotische Steinbrücke über die Moldau, 1402 fertiggestellt.", highlights: ["30 Barockskulpturen", "Frühmorgens besuchen", "Straßenkünstler"] },
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
      { id: 1, name: "Torre de Belém", type: "Sehenswürdigkeit", address: "Av. Brasília, 1400-038 Lisboa", lat: 38.6916, lng: -9.2160, area: "Belém", duration: "1 Std.", icon: "🏰" },
      { id: 2, name: "Alfama", type: "Stadtviertel", address: "Alfama, Lisboa", lat: 38.7114, lng: -9.1300, area: "Alfama", duration: "2 Std.", icon: "🏘️" },
      { id: 3, name: "Pastéis de Belém", type: "Café", address: "R. de Belém 84-92, Lisboa", lat: 38.6976, lng: -9.2030, area: "Belém", duration: "0,5 Std.", icon: "🥮" },
    ],
    demoLinks: ["https://maps.google.com/?q=torre+de+belem", "https://maps.google.com/?q=alfama+lissabon", "https://maps.google.com/?q=pasteis+de+belem"],
    linkMatchers: [
      { pattern: /torre.*bel[eé]m/i, locationIndex: 0 },
      { pattern: /alfama/i, locationIndex: 1 },
      { pattern: /past[eé]is/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Torre de Belém": { min: 8, max: 8, currency: "€", note: "Erwachsene" },
      "Alfama": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Pastéis de Belém": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Torre de Belém": { stars: 4.6, reviews: 88000, price: "€", badge: "UNESCO Welterbe" },
      "Alfama": { stars: 4.7, reviews: 52000, price: "Kostenlos", badge: "Authentisch" },
      "Pastéis de Belém": { stars: 4.7, reviews: 110000, price: "€", badge: "Legendär" },
    },
    locationInfo: {
      "Torre de Belém": { short: "Wahrzeichen Lissabons am Tejo-Ufer.", highlights: ["Manuelinische Architektur", "Blick auf den Tejo", "UNESCO Welterbe"] },
      "Alfama": { short: "Ältestes Viertel Lissabons mit Fado-Musik.", highlights: ["Fado-Lokale", "Miradouro-Aussichtspunkte", "Straßenbahn 28"] },
      "Pastéis de Belém": { short: "Berühmteste Pastel-de-Nata-Bäckerei seit 1837.", highlights: ["Original-Rezept seit 1837", "Immer frisch gebacken", "Zimt & Puderzucker"] },
    },
    openingHours: {
      "Torre de Belém": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–17:30", note: "Mo geschlossen" },
      "Alfama": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
      "Pastéis de Belém": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "08:00–23:00" },
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
      "Freiheitsstatue": { short: "Geschenk Frankreichs an die USA, 1886 eingeweiht.", highlights: ["Fähre ab Battery Park", "Krone mit Voranmeldung", "Ellis Island Museum"] },
      "Central Park": { short: "Ikonischer Stadtpark mitten in Manhattan.", highlights: ["Bethesda Fountain", "Bow Bridge", "Strawberry Fields"] },
      "Times Square": { short: "Das leuchtende Herz von Manhattan.", highlights: ["Broadway-Theater", "Neon-Reklamen bei Nacht", "TKTS für günstige Tickets"] },
    },
    openingHours: {
      "Freiheitsstatue": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Central Park": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–01:00" },
      "Times Square": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
    },
    metroLines: {},
  },
};

const DAY_COLORS = [
  "#e07b54", "#5b8dd9", "#6abf69", "#d4a84b", "#a66dd4", "#4bb8c4", "#d46d8a", "#7aab7a",
  "#c4a882", "#8b6a3e", "#5a8fa3", "#c97a5a"
];

function getDayColor(index) {
  return DAY_COLORS[index % DAY_COLORS.length];
}

const CITY_ORDER = ["paris","london","berlin","rom","barcelona","amsterdam","wien","prag","lissabon","new_york"];

const TRANSLATIONS = {
  de: {
    appName: "Reiseplaner", addPlace: "Ort hinzufügen", insertLink: "LINK EINFÜGEN",
    linkPlaceholder: "https://maps.google.com/ oder Website-URL", analyze: "Analysieren",
    analyzing: "Analyse...", visitDay: "BESUCHSTAG", demo: "Demo-Beispiele:",
    myPlaces: "Alle Orte", allDays: "Alle Tage", dragHint: "↕ ziehen",
    route: "Route", timeline: "Timeline", pdf: "PDF",
    travelMode: "FORTBEWEGUNG", walking: "🚶 Zu Fuß", transit: "🚇 ÖPNV", driving: "🚗 Auto",
    openInMaps: "In Google Maps öffnen", stops: "Stopps", timelineTitle: "TAGESPLAN – TIMELINE",
    transfer: "+20 Min. Transfer", infoShow: "▼ Info", infoHide: "▲ Ausblenden",
    closedDay: "Geschlossen", unknownHours: "⏰ Öffnungszeiten unbekannt", reviews: "Bewertungen",
    budgetTitle: "Budget-Tracker", budgetTotal: "Gesamt", budgetExtras: "+ Extras:",
    budgetNote: "* Schätzungen.", savePlans: "Reisepläne", savedPlans: "Gespeicherte Pläne",
    planNamePlaceholder: "Planname", save: "💾 Speichern", saved: "✅ Gespeichert!",
    load: "Laden", noPlans: "Noch keine Pläne.", addFirst: "Füge Orte hinzu.",
    share: "🤝 Teilen", createLink: "🔗 Link erstellen", shareHint: "Teile diesen Link:",
    copy: "📋 Kopieren", copied: "✅ Kopiert!", warningTitle: "Achtung",
    warningClosed: "ist an dem gewählten Tag geschlossen!", warningHint: "Bitte Besuchstag ändern.",
    closed: "geschlossen", apiActive: "✅ API aktiv", apiMissing: "⚠️ API-Key fehlt",
    apiTitle: "🔐 OpenAI API-Key", apiHint: "Lokal gespeichert.", apiSave: "Speichern",
    apiSaved: "✅ Gespeichert!", apiDelete: "🗑️ Key löschen", footerText: "Reiseplaner v4.2",
    noRouteHint: "Füge mind. 2 Orte hinzu.", errorEmpty: "Bitte Link eingeben.",
    errorNotFound: "Link nicht erkannt.",
    days: ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    admission: "Eintritt", free: "Kostenlos", close: "Schließen", places: "Orte",
    selectCity: "Stadt wählen", customCity: "✨ Andere Stadt",
    customCityPlaceholder: "Stadtname", customCityAdd: "Hinzufügen",
    switchCity: "Stadt wechseln", currentCity: "Aktuelle Stadt",
    helpButton: "❓", cityNoDemo: "Keine Demo-Daten.",
    travelTime: "Reisezeit", walkingTime: "zu Fuß", transitTime: "mit ÖPNV",
    notePlaceholder: "Notiz (z.B. Tickets vorbuchen!)", noteLabel: "📝 Notiz", noteHide: "📝 Ausblenden",
    sectionTrip: "🗓 Reisezeitraum", sectionMap: "🗺 Karte", sectionRoute: "📅 Route & Timeline",
    labelStartDate: "Startdatum", labelDays: "Reisetage", labelDaysSuffix: "Tage",
  },
  en: {
    appName: "Travel Planner", addPlace: "Add Place", insertLink: "INSERT LINK",
    linkPlaceholder: "https://maps.google.com/ or website URL", analyze: "Analyze",
    analyzing: "Analyzing...", visitDay: "VISIT DAY", demo: "Demo examples:",
    myPlaces: "All Places", allDays: "All Days", dragHint: "↕ drag",
    route: "Route", timeline: "Timeline", pdf: "PDF",
    travelMode: "TRAVEL MODE", walking: "🚶 Walking", transit: "🚇 Transit", driving: "🚗 Car",
    openInMaps: "Open in Google Maps", stops: "Stops", timelineTitle: "DAY PLAN – TIMELINE",
    transfer: "+20 min transfer", infoShow: "▼ Info", infoHide: "▲ Hide",
    closedDay: "Closed", unknownHours: "⏰ Hours unknown", reviews: "reviews",
    budgetTitle: "Budget Tracker", budgetTotal: "Total", budgetExtras: "+ Extras:",
    budgetNote: "* Estimates.", savePlans: "Travel Plans", savedPlans: "Saved Plans",
    planNamePlaceholder: "Plan name", save: "💾 Save", saved: "✅ Saved!",
    load: "Load", noPlans: "No plans yet.", addFirst: "Add places first.",
    share: "🤝 Share", createLink: "🔗 Create Link", shareHint: "Share this link:",
    copy: "📋 Copy", copied: "✅ Copied!", warningTitle: "Warning",
    warningClosed: "is closed on the selected day!", warningHint: "Please change the visit day.",
    closed: "closed", apiActive: "✅ API active", apiMissing: "⚠️ API Key missing",
    apiTitle: "🔐 OpenAI API Key", apiHint: "Stored locally.", apiSave: "Save",
    apiSaved: "✅ Saved!", apiDelete: "🗑️ Delete key", footerText: "Travel Planner v4.2",
    noRouteHint: "Add at least 2 places.", errorEmpty: "Please enter a link.",
    errorNotFound: "Link not recognized.",
    days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    admission: "Admission", free: "Free", close: "Close", places: "Places",
    selectCity: "Select City", customCity: "✨ Other City",
    customCityPlaceholder: "City name", customCityAdd: "Add",
    switchCity: "Switch City", currentCity: "Current City",
    helpButton: "❓", cityNoDemo: "No demo data.",
    travelTime: "Travel time", walkingTime: "walking", transitTime: "by transit",
    notePlaceholder: "Note (e.g. Book tickets!)", noteLabel: "📝 Note", noteHide: "📝 Hide",
    sectionTrip: "🗓 Travel Period", sectionMap: "🗺 Map", sectionRoute: "📅 Route & Timeline",
    labelStartDate: "Start date", labelDays: "Travel days", labelDaysSuffix: "days",
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
  const startDate = raw.startDate ?? raw.tripStart ?? new Date().toISOString().slice(0,10);
  const numDays = Number(raw.numDays ?? raw.tripLen ?? 4) || 4;
  const tripDays = Array.isArray(raw.tripDays) && raw.tripDays.length ? raw.tripDays : generateTripDays(startDate, numDays);
  const locations = Array.isArray(raw.locations) ? raw.locations : [];
  const locationDays = raw.locationDays && typeof raw.locationDays === "object" ? raw.locationDays : {};
  const locationNotes = raw.locationNotes && typeof raw.locationNotes === "object" ? raw.locationNotes : {};
  return { id, name, cityId, startDate, numDays, tripDays, locations, locationDays, locationNotes };
}

function getEntryCost(name, city) {
  const costs = city?.entryCosts || {};
  const key = Object.keys(costs).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? costs[key] : null;
}

function getRating(name, city) {
  const ratings = city?.ratings || {};
  const key = Object.keys(ratings).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? ratings[key] : null;
}

function getLocationInfo(name, city) {
  const info = city?.locationInfo || {};
  const key = Object.keys(info).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? info[key] : null;
}

function getOpeningInfo(name, day, city) {
  const hours = city?.openingHours || {};
  const key = Object.keys(hours).find(k => name.toLowerCase().includes(k.toLowerCase()));
  if (!key) return null;
  const info = hours[key];
  let dayKey;
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
    dayKey = getWeekdayKey(day);
  } else {
    dayKey = DAY_KEY_MAP[day];
  }
  const isOpen = dayKey ? info[dayKey] : true;
  return { isOpen, hours: info.hours, note: info.note };
}

function getMetroLine(loc1, loc2, city) {
  const lines = city?.metroLines || {};
  const key = `${loc1.area} -> ${loc2.area}`;
  return lines[key] || null;
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function calcTravelTime(loc1, loc2) {
  if (!loc1?.lat||!loc1?.lng||!loc2?.lat||!loc2?.lng) return null;
  const dist = haversineDistance(loc1.lat,loc1.lng,loc2.lat,loc2.lng);
  const walkDist = dist*1.3;
  const walkMin = Math.round((walkDist/4.5)*60);
  const transitMin = Math.max(5,Math.round((walkDist/25)*60)+3);
  return { distKm: Math.round(dist*10)/10, walkMin, transitMin };
}

function PackingList({ locations, numDays, t, lang }) {
  const { th } = useTheme();
  const [checked, setChecked] = useState({});
  const [customItem, setCustomItem] = useState("");
  const [customItems, setCustomItems] = useState([]);

  const types = locations.map(l => (l.type || "").toLowerCase());
  const hasMuseum = types.some(t => t.includes("museum"));
  const hasRestaurant = types.some(t => t.includes("restaurant") || t.includes("café") || t.includes("cafe"));
  const hasPark = types.some(t => t.includes("park") || t.includes("garten"));
  const hasChurch = types.some(t => t.includes("kirche") || t.includes("dom") || t.includes("basilika"));
  const hasMarkt = types.some(t => t.includes("markt"));
  const longTrip = numDays >= 5;

  const autoItems = [
    { id: "passport", label: lang==="de" ? "🛂 Reisepass / Ausweis" : "🛂 Passport / ID", always: true },
    { id: "phone", label: lang==="de" ? "📱 Handy + Ladekabel" : "📱 Phone + charger", always: true },
    { id: "money", label: lang==="de" ? "💳 Karte + Bargeld" : "💳 Card + cash", always: true },
    { id: "insurance", label: lang==="de" ? "🏥 Reiseversicherung" : "🏥 Travel insurance", always: true },
    { id: "clothes", label: lang==="de" ? `👕 Kleidung für ${numDays} Tage` : `👕 Clothes for ${numDays} days`, always: true },
    { id: "shoes_comfy", label: lang==="de" ? "👟 Bequeme Schuhe" : "👟 Comfortable shoes", cond: hasMuseum || hasPark },
    { id: "camera", label: lang==="de" ? "📷 Kamera / Powerbank" : "📷 Camera / powerbank", cond: hasMuseum || hasChurch },
    { id: "smartclothes", label: lang==="de" ? "👔 Schicke Kleidung (Restaurant)" : "👔 Smart clothes (restaurant)", cond: hasRestaurant },
    { id: "bag_market", label: lang==="de" ? "🛍 Einkaufstasche" : "🛍 Shopping bag", cond: hasMarkt },
    { id: "sunscreen", label: lang==="de" ? "☀️ Sonnencreme" : "☀️ Sunscreen", cond: hasPark },
    { id: "dresscode", label: lang==="de" ? "🧣 Schulterbedeckung (Kirche)" : "🧣 Shoulder cover (church)", cond: hasChurch },
    { id: "adapter", label: lang==="de" ? "🔌 Reiseadapter" : "🔌 Travel adapter", cond: longTrip },
    { id: "meds", label: lang==="de" ? "💊 Medikamente" : "💊 Medication", cond: longTrip },
    { id: "guidebook", label: lang==="de" ? "📖 Reiseführer / Offline-Karten" : "📖 Guidebook / offline maps", always: true },
  ].filter(item => item.always || item.cond);

  const allItems = [...autoItems, ...customItems.map((label, i) => ({ id: `custom_${i}`, label }))];
  const doneCount = allItems.filter(item => checked[item.id]).length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <span style={{ fontSize:"0.75rem", color:th.textMuted }}>
          {lang==="de" ? `${doneCount} von ${allItems.length} gepackt` : `${doneCount} of ${allItems.length} packed`}
        </span>
        <div style={{ height:6, flex:1, maxWidth:120, background:th.border, borderRadius:4, marginLeft:12, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${allItems.length ? (doneCount/allItems.length)*100 : 0}%`,
            background:th.accent, borderRadius:4, transition:"width 0.3s" }} />
        </div>
      </div>
      {allItems.map(item => (
        <label key={item.id} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer",
          padding:"6px 10px", borderRadius:8, background:checked[item.id] ? th.accentLight : th.surface,
          border:`1px solid ${checked[item.id] ? th.accent : th.border}`, transition:"all 0.15s" }}>
          <input type="checkbox" checked={!!checked[item.id]}
            onChange={() => setChecked(c => ({ ...c, [item.id]: !c[item.id] }))}
            style={{ accentColor:th.accent, width:15, height:15, cursor:"pointer" }} />
          <span style={{ fontSize:"0.82rem", color:checked[item.id] ? th.textFaint : th.text,
            textDecoration:checked[item.id] ? "line-through" : "none", transition:"all 0.15s" }}>
            {item.label}
          </span>
        </label>
      ))}
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        <input value={customItem} onChange={e => setCustomItem(e.target.value)}
          onKeyDown={e => { if(e.key==="Enter" && customItem.trim()) { setCustomItems(c => [...c, customItem.trim()]); setCustomItem(""); } }}
          placeholder={lang==="de" ? "Eigenes Item hinzufügen..." : "Add custom item..."}
          style={{ flex:1, fontSize:"0.78rem", padding:"5px 10px", borderRadius:8,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={() => { if(customItem.trim()) { setCustomItems(c => [...c, customItem.trim()]); setCustomItem(""); } }}
          style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:"white",
            border:"none", cursor:"pointer", fontSize:"0.78rem", fontWeight:700 }}>+</button>
      </div>
    </div>
  );
}

// ── NEAREST-NEIGHBOR ROUTE OPTIMIZER ──────────────────────────────────────
function optimizeRoute(locations) {
  if (locations.length < 3) return [...locations];
  const locs = locations.map(l => ({ ...l }));
  // find start: loc with lat/lng, else first
  const startIdx = locs.findIndex(l => l.lat && l.lng);
  if (startIdx < 0) return [...locations]; // no coords at all
  const visited = [locs[startIdx]];
  const remaining = locs.filter((_, i) => i !== startIdx);
  while (remaining.length > 0) {
    const last = visited[visited.length - 1];
    let minDist = Infinity, minIdx = 0;
    remaining.forEach((loc, i) => {
      if (!loc.lat || !loc.lng || !last.lat || !last.lng) return;
      const d = haversineDistance(last.lat, last.lng, loc.lat, loc.lng);
      if (d < minDist) { minDist = d; minIdx = i; }
    });
    visited.push(remaining[minIdx]);
    remaining.splice(minIdx, 1);
  }
  return visited;
}

// ── HEATMAP COMPONENT ──────────────────────────────────────────────────────
function AreaHeatmap({ locations, th }) {
  if (locations.length === 0) return <div style={{ fontSize:"0.78rem", color:th.textMuted }}>Keine Orte vorhanden.</div>;
  const counts = {};
  locations.forEach(l => {
    const area = l.area || "Unbekannt";
    counts[area] = (counts[area] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  const max = entries[0]?.[1] || 1;
  const heatColors = ["#c8a96e","#d4a84b","#e07b54","#c97a5a","#a05a30"];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:4 }}>📍 Orte pro Stadtteil</div>
      {entries.map(([area, count], i) => {
        const pct = (count / max) * 100;
        const heat = heatColors[Math.min(Math.floor((count/max)*heatColors.length), heatColors.length-1)];
        return (
          <div key={area}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", marginBottom:3 }}>
              <span style={{ color:th.text, fontWeight:600 }}>{area}</span>
              <span style={{ color:heat, fontWeight:700 }}>{count} {count===1?"Ort":"Orte"}</span>
            </div>
            <div style={{ height:10, background:th.border, borderRadius:6, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:heat, borderRadius:6,
                transition:"width 0.5s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TravelTimeBadge({ from, to }) {
  const { th } = useTheme();
  const travel = calcTravelTime(from, to);
  if (!travel) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"4px 0" }}>
      <div style={{
        display:"flex", alignItems:"center", gap:10, padding:"4px 12px",
        borderRadius:20, fontSize:"0.7rem", background:th.tag, border:`1px solid ${th.border}`
      }}>
        <span style={{ color:th.textFaint }}>{travel.distKm} km</span>
        <span style={{ color:th.info }}>🚶 {travel.walkMin} Min.</span>
        <span style={{ color:th.gold }}>🚇 {travel.transitMin} Min.</span>
      </div>
    </div>
  );
}

async function analyzeWithAI(url, apiKey, cityName) {
  const prompt = `Du bist ein Reiseassistent für ${cityName}. Analysiere diesen Link: "${url}"
Extrahiere (antworte NUR mit JSON):
{"name":"","type":"Restaurant|Sehenswürdigkeit|Museum|Park|Bar|Café","address":"","area":"Stadtteil","duration":"","icon":"emoji","lat":0,"lng":0,"tip":""}`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${apiKey}`},
    body: JSON.stringify({ model:"gpt-4o-mini", messages:[{role:"user",content:prompt}], temperature:0.3 })
  });
  if (!res.ok) throw new Error("API Error: "+res.status);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g,"").trim());
}

async function geocodeCity(name) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=de`);
    const data = await res.json();
    if (data.results && data.results[0]) {
      const r = data.results[0];
      return { lat: r.latitude, lng: r.longitude, name: r.name, country: r.country };
    }
    return null;
  } catch { return null; }
}

function CollapsibleSection({ title, icon, children, defaultOpen = false, th, badge }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          background:th.surface, border:`1px solid ${th.border}`, borderRadius: open ? "12px 12px 0 0" : 12,
          padding:"10px 14px", cursor:"pointer", color:th.text, fontWeight:700, fontSize:"0.82rem" }}>
        <span>{icon} {title} {badge ? <span style={{marginLeft:6,background:th.accent,color:"white",borderRadius:10,padding:"1px 7px",fontSize:"0.7rem"}}>{badge}</span> : null}</span>
        <span style={{ color:th.textMuted, fontSize:"0.75rem" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ background:th.card, border:`1px solid ${th.border}`, borderTop:"none",
          borderRadius:"0 0 12px 12px", padding:"12px 14px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function StarRating({ stars, reviews, price, badge, th }) {
  if (!stars) return null;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginTop:4 }}>
      <span style={{ color:th.gold, fontSize:"0.8rem" }}>
        {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5-full-(half?1:0))}
      </span>
      <span style={{ fontSize:"0.72rem", color:th.textMuted }}>{stars} ({reviews ? (reviews/1000).toFixed(0)+"k" : "-"})</span>
      {price && <span style={{ fontSize:"0.7rem", color:th.accent, fontWeight:700 }}>{price}</span>}
      {badge && <span style={{ fontSize:"0.65rem", background:th.goldBg, color:th.gold, borderRadius:8, padding:"1px 7px", fontWeight:700 }}>{badge}</span>}
    </div>
  );
}

function MetroTag({ line, time, th }) {
  if (!line) return null;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, background:th.infoBg,
      color:th.info, borderRadius:8, padding:"2px 8px", fontSize:"0.68rem", fontWeight:700 }}>
      🚇 {line} · {time}
    </span>
  );
}

function LocationCard({ loc, index, city, t, lang, tripDays, locationDays, locationNotes,
  onDayChange, onNoteChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast, travelMode, th }) {
  const [showInfo, setShowInfo] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const cost = getEntryCost(loc.name, city);
  const rating = getRating(loc.name, city);
  const info = getLocationInfo(loc.name, city);
  const assignedDay = locationDays[loc.id];
  const note = locationNotes[loc.id] || "";
  const openInfo = assignedDay ? getOpeningInfo(loc.name, assignedDay, city) : null;
  const isClosed = openInfo && openInfo.isOpen === false;
  const dayColor = assignedDay ? getDayColor(tripDays.indexOf(assignedDay)) : th.border;

  return (
    <div className="app-card-hover card-anim print-card" style={{
      background: th.card, border: `2px solid ${isClosed ? th.warning : dayColor}`,
      borderRadius: 14, padding: "12px 14px", position:"relative"
    }}>
      {isClosed && (
        <div style={{ background:th.warningBg, color:th.warning, borderRadius:8, padding:"4px 10px",
          fontSize:"0.72rem", fontWeight:700, marginBottom:8 }}>
          ⚠️ {t.warningTitle}: {loc.name} {t.warningClosed} {t.warningHint}
        </div>
      )}
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <div style={{ fontSize:"1.6rem", lineHeight:1, flexShrink:0 }}>{loc.icon || "📍"}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:"0.92rem", color:th.text, marginBottom:2 }}>{loc.name}</div>
          <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{loc.type} · {loc.area}</div>
          {loc.address && <div style={{ fontSize:"0.68rem", color:th.textFaint, marginTop:2 }}>{loc.address}</div>}
          <StarRating stars={rating?.stars} reviews={rating?.reviews} price={rating?.price} badge={rating?.badge} th={th} />
          {openInfo && (
            <div style={{ fontSize:"0.7rem", color: openInfo.isOpen ? th.success : th.warning, marginTop:3 }}>
              {openInfo.isOpen ? "✅" : "❌"} {openInfo.hours} {openInfo.note ? `(${openInfo.note})` : ""}
            </div>
          )}
          {cost && (
            <div style={{ fontSize:"0.7rem", color:th.gold, marginTop:3 }}>
              💰 {cost.min === 0 && cost.max === 0 ? t.free : `${cost.currency}${cost.min}${cost.max !== cost.min ? `–${cost.max}` : ""}`}
              {cost.note ? ` (${cost.note})` : ""}
            </div>
          )}
          {loc.duration && <div style={{ fontSize:"0.7rem", color:th.textMuted, marginTop:2 }}>⏱ {loc.duration}</div>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
          <button onClick={() => onRemove(loc.id)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"1rem", padding:2 }}>✕</button>
          {!isFirst && <button onClick={() => onMoveUp(index)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textMuted, fontSize:"0.9rem", padding:2 }}>▲</button>}
          {!isLast && <button onClick={() => onMoveDown(index)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textMuted, fontSize:"0.9rem", padding:2 }}>▼</button>}
        </div>
      </div>

      <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        <select value={assignedDay || ""} onChange={e => onDayChange(loc.id, e.target.value || null)}
          style={{ fontSize:"0.72rem", padding:"3px 8px", borderRadius:8, background:th.input,
            color:th.text, border:`1px solid ${assignedDay ? dayColor : th.inputBorder}`, fontWeight:700 }}>
          <option value="">{t.allDays}</option>
          {tripDays.map((d, i) => (
            <option key={d} value={d}>{formatDateLabel(d, lang)} (Tag {i+1})</option>
          ))}
        </select>
        {info && (
          <button onClick={() => setShowInfo(v => !v)}
            style={{ fontSize:"0.68rem", padding:"3px 10px", borderRadius:8,
              background: showInfo ? th.accentLight : th.tag, color: showInfo ? th.accent : th.textMuted,
              border:`1px solid ${showInfo ? th.accent : th.border}`, cursor:"pointer" }}>
            {showInfo ? t.infoHide : t.infoShow}
          </button>
        )}
        <button onClick={() => setShowNote(v => !v)}
          style={{ fontSize:"0.68rem", padding:"3px 10px", borderRadius:8,
            background: showNote ? th.accentLight : th.tag, color: showNote ? th.accent : th.textMuted,
            border:`1px solid ${showNote ? th.accent : th.border}`, cursor:"pointer" }}>
          {showNote ? t.noteHide : t.noteLabel}
        </button>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + (loc.address || ""))}`}
          target="_blank" rel="noopener noreferrer"
          style={{ fontSize:"0.68rem", color:th.info, textDecoration:"none" }}>🗺 Maps</a>
      </div>

      {showInfo && info && (
        <div style={{ marginTop:10, padding:"8px 12px", background:th.surface, borderRadius:10,
          border:`1px solid ${th.border}`, fontSize:"0.78rem", color:th.textMuted }}>
          <div style={{ color:th.text, marginBottom:6 }}>{info.short}</div>
          {info.highlights && info.highlights.map((h,i) => (
            <div key={i} style={{ color:th.accent }}>✦ {h}</div>
          ))}
        </div>
      )}
      {showNote && (
        <textarea value={note} onChange={e => onNoteChange(loc.id, e.target.value)}
          placeholder={t.notePlaceholder}
          style={{ marginTop:8, width:"100%", fontSize:"0.78rem", padding:"6px 10px",
            borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`,
            resize:"vertical", minHeight:50 }} />
      )}
    </div>
  );
}

function MapView({ locations, city, th }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [exporting, setExporting] = useState(false);
  const { mode } = useTheme();

  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    if (map) { map.remove(); }
    const center = city ? [city.lat, city.lng] : [48.8566, 2.3522];
    const m = window.L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView(center, 13);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { crossOrigin: true }).addTo(m);
    const allLocs = locations.length > 0 ? locations : (city?.sampleLocations || []);
    allLocs.forEach((loc, i) => {
      if (!loc.lat || !loc.lng) return;
      const color = DAY_COLORS[i % DAY_COLORS.length];
      const icon = window.L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2.5px solid white;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.35);">${i+1}</div>`,
        iconSize: [28, 28], iconAnchor: [14, 14]
      });
      window.L.marker([loc.lat, loc.lng], { icon }).addTo(m).bindPopup(`<b>${loc.name}</b>`);
    });
    if (allLocs.length > 1) {
      const pts = allLocs.filter(l => l.lat && l.lng).map(l => [l.lat, l.lng]);
      window.L.polyline(pts, { color: 'rgba(196,168,130,0.85)', weight: 2, dashArray: '8,6' }).addTo(m);
    }
    if (allLocs.length > 0 && allLocs[0].lat) {
      const pts = allLocs.filter(l => l.lat && l.lng).map(l => [l.lat, l.lng]);
      if (pts.length > 1) m.fitBounds(pts, { padding: [30, 30] });
    }
    setMap(m);
    return () => { m.remove(); setMap(null); };
  }, [locations, city]);

  const exportPng = async () => {
    if (!map || !mapRef.current) return;
    setExporting(true);
    await new Promise(r => setTimeout(r, 300));
    const size = map.getSize();
    const canvas = document.createElement('canvas');
    canvas.width = size.x || 600;
    canvas.height = size.y || 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e8dfc8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const mapRect = mapRef.current.getBoundingClientRect();
    const tiles = Array.from(mapRef.current.querySelectorAll('.leaflet-tile-pane img.leaflet-tile'));
    await Promise.all(tiles.map(img => new Promise(res => {
      const p = new Image();
      p.crossOrigin = 'anonymous';
      p.onload = () => {
        const r = img.getBoundingClientRect();
        try { ctx.drawImage(p, Math.round(r.left - mapRect.left), Math.round(r.top - mapRect.top), Math.round(r.width), Math.round(r.height)); } catch {}
        res();
      };
      p.onerror = () => res();
      p.src = img.src;
    })));
    const W = canvas.width, H = canvas.height;
    const allLocs = locations.length > 0 ? locations : (city?.sampleLocations || []);
    const pts = allLocs.filter(l => l.lat && l.lng).map(l => map.latLngToContainerPoint([l.lat, l.lng]));
    if (pts.length > 1) {
      ctx.beginPath();
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = 'rgba(196,168,130,0.85)';
      ctx.lineWidth = 2;
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    allLocs.forEach((loc, i) => {
      if (!loc.lat || !loc.lng) return;
      const pt = map.latLngToContainerPoint([loc.lat, loc.lng]);
      const color = DAY_COLORS[i % DAY_COLORS.length];
      ctx.beginPath(); ctx.arc(pt.x + 1, pt.y + 2, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 13, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.strokeStyle = 'white'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = 'white'; ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), pt.x, pt.y);
    });
    const lH = 26;
    ctx.fillStyle = 'rgba(30,26,20,0.82)';
    ctx.fillRect(0, H - lH, W, lH);
    ctx.fillStyle = '#ede0c8'; ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('\u2708 ' + (city?.name || '') + ' \u00b7 ' + allLocs.length + ' Orte \u00b7 Reiseplaner v4.2', 10, H - lH / 2);
    const link = document.createElement('a');
    link.download = 'reisekarte.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    setExporting(false);
  };

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: 280, borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${th.border}`, background: th.surface }} />
      <button onClick={exportPng} disabled={exporting}
        style={{ marginTop: 8, width: '100%', padding: '8px 0', borderRadius: 10, fontSize: '0.74rem',
          background: exporting ? th.surface : th.tag,
          color: exporting ? th.textMuted : th.tagText,
          border: `1px solid ${th.border}`, cursor: exporting ? 'default' : 'pointer',
          fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 0.2s' }}>
        {exporting ? <><Spinner size={14} /> Exportiere…</> : '🗺️ Karte als PNG exportieren'}
      </button>
    </div>
  );
}

function BudgetTracker({ locations, city, lang, t, th }) {
  const [extras, setExtras] = useState("");
  const [extrasVal, setExtrasVal] = useState(0);
  const items = locations.map(loc => {
    const cost = getEntryCost(loc.name, city);
    return { name: loc.name, cost };
  }).filter(i => i.cost);
  const total = items.reduce((s, i) => s + (i.cost.min + i.cost.max) / 2, 0) + extrasVal;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {items.length === 0 && <div style={{ fontSize:"0.78rem", color:th.textMuted }}>{t.addFirst}</div>}
      {items.map((item, i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8rem",
          padding:"5px 10px", background:th.surface, borderRadius:8, border:`1px solid ${th.border}` }}>
          <span style={{ color:th.text }}>{item.name}</span>
          <span style={{ color:th.gold, fontWeight:700 }}>
            {item.cost.min === 0 && item.cost.max === 0 ? t.free :
              `${item.cost.currency}${item.cost.min}${item.cost.max !== item.cost.min ? `–${item.cost.max}` : ""}`}
          </span>
        </div>
      ))}
      <div style={{ display:"flex", gap:8, alignItems:"center", marginTop:4 }}>
        <span style={{ fontSize:"0.75rem", color:th.textMuted }}>{t.budgetExtras}</span>
        <input type="number" value={extras} onChange={e => { setExtras(e.target.value); setExtrasVal(parseFloat(e.target.value)||0); }}
          placeholder="0" style={{ width:70, fontSize:"0.78rem", padding:"3px 8px", borderRadius:8,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
      </div>
      {items.length > 0 && (
        <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px",
          background:th.goldBg, borderRadius:8, border:`1px solid ${th.gold}`, marginTop:4 }}>
          <span style={{ fontWeight:700, fontSize:"0.85rem", color:th.text }}>{t.budgetTotal}</span>
          <span style={{ fontWeight:900, fontSize:"0.95rem", color:th.gold }}>~€{total.toFixed(2)}</span>
        </div>
      )}
      <div style={{ fontSize:"0.65rem", color:th.textFaint }}>{t.budgetNote}</div>
    </div>
  );
}

function ShareSection({ locations, cityId, startDate, numDays, locationDays, locationNotes, t, th }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const generate = () => {
    const data = { cityId, startDate, numDays, locations, locationDays, locationNotes };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = window.location.href.split("?")[0] + "?plan=" + encoded;
    setShareUrl(url);
  };
  const copy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <button onClick={generate} className="btn-primary"
        style={{ padding:"8px 16px", borderRadius:10, background:th.accent, color:"white",
          border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>
        {t.createLink}
      </button>
      {shareUrl && (
        <>
          <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.shareHint}</div>
          <div style={{ display:"flex", gap:6 }}>
            <input readOnly value={shareUrl}
              style={{ flex:1, fontSize:"0.68rem", padding:"5px 8px", borderRadius:8,
                background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            <button onClick={copy}
              style={{ padding:"5px 12px", borderRadius:8, background: copied ? th.success : th.tag,
                color: copied ? "white" : th.text, border:"none", cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}>
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SavedPlans({ plans, onSave, onLoad, onDelete, planName, setPlanName, saveMsg, t, th, locations }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", gap:6 }}>
        <input value={planName} onChange={e => setPlanName(e.target.value)}
          placeholder={t.planNamePlaceholder}
          style={{ flex:1, fontSize:"0.78rem", padding:"5px 10px", borderRadius:8,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={onSave} className="btn-primary"
          style={{ padding:"5px 14px", borderRadius:8, background:th.accent, color:"white",
            border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.78rem" }}>
          {saveMsg ? t.saved : t.save}
        </button>
      </div>
      {plans.length === 0 ? (
        <div style={{ fontSize:"0.78rem", color:th.textMuted }}>{t.noPlans}</div>
      ) : plans.map(p => (
        <div key={p.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 10px",
          background:th.surface, borderRadius:10, border:`1px solid ${th.border}` }}>
          <span style={{ flex:1, fontSize:"0.8rem", color:th.text, fontWeight:600 }}>{p.name}</span>
          <span style={{ fontSize:"0.68rem", color:th.textMuted }}>{p.locations?.length || 0} {t.places}</span>
          <button onClick={() => onLoad(p)}
            style={{ padding:"3px 10px", borderRadius:8, background:th.accentLight, color:th.accent,
              border:`1px solid ${th.accent}`, cursor:"pointer", fontSize:"0.72rem", fontWeight:700 }}>
            {t.load}
          </button>
          <button onClick={() => onDelete(p.id)}
            style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"0.9rem" }}>✕</button>
        </div>
      ))}
    </div>
  );
}

// ── TRIP DASHBOARD ────────────────────────────────────────────────────────
  function TripDashboard({ plans, onLoad, onDelete, onNew, th, lang }) {
    if (plans.length === 0) return (
      <div style={{ textAlign:"center", padding:"24px 0", color:th.textMuted, fontSize:"0.82rem" }}>
        {lang==="de" ? "Noch keine gespeicherten Reisen." : "No saved trips yet."}
        <br/>
        <button onClick={onNew} style={{ marginTop:12, padding:"8px 20px", borderRadius:10,
          background:th.accent, color:"white", border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>
          {lang==="de" ? "+ Neue Reise starten" : "+ Start new trip"}
        </button>
      </div>
    );
    return (
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
        {plans.map(p => {
          const city = CITIES[p.cityId];
          return (
            <div key={p.id} className="app-card-hover"
              style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:14,
                padding:"14px 14px 10px", display:"flex", flexDirection:"column", gap:6, cursor:"pointer" }}
              onClick={() => onLoad(p)}>
              <div style={{ fontSize:"2rem", lineHeight:1 }}>{city?.emoji || "✈️"}</div>
              <div style={{ fontWeight:700, fontSize:"0.88rem", color:th.text }}>{p.name}</div>
              <div style={{ fontSize:"0.72rem", color:th.textMuted }}>
                {city?.name || p.cityId} · {p.numDays} {lang==="de" ? "Tage" : "days"}
              </div>
              <div style={{ fontSize:"0.68rem", color:th.textFaint }}>
                📍 {p.locations?.length || 0} {lang==="de" ? "Orte" : "places"}
              </div>
              <div style={{ display:"flex", gap:6, marginTop:4 }}>
                <button onClick={e => { e.stopPropagation(); onLoad(p); }}
                  style={{ flex:1, padding:"4px 0", borderRadius:8, background:th.accentLight,
                    color:th.accent, border:`1px solid ${th.accent}`, cursor:"pointer",
                    fontWeight:700, fontSize:"0.7rem" }}>
                  {lang==="de" ? "Laden" : "Load"}
                </button>
                <button onClick={e => { e.stopPropagation(); onDelete(p.id); }}
                  style={{ padding:"4px 8px", borderRadius:8, background:th.warningBg,
                    color:th.warning, border:`1px solid ${th.warning}`, cursor:"pointer", fontSize:"0.7rem" }}>🗑</button>
              </div>
            </div>
          );
        })}
        <div className="app-card-hover"
          style={{ background:th.surface, border:`2px dashed ${th.border}`, borderRadius:14,
            padding:"14px", display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:8, cursor:"pointer", minHeight:130 }}
          onClick={onNew}>
          <div style={{ fontSize:"1.8rem" }}>➕</div>
          <div style={{ fontSize:"0.78rem", color:th.textMuted, textAlign:"center" }}>
            {lang==="de" ? "Neue Reise" : "New trip"}
          </div>
        </div>
      </div>
    );
  }

  // ── DAY CALENDAR (ZEITSLOTS) ────────────────────────────────────────────
  function DayCalendar({ locations, locationDays, tripDays, th, lang }) {
    const HOURS = Array.from({length:15}, (_,i) => i+8); // 08–22
    const [slots, setSlots] = useState(() => {
      const init = {};
      locations.forEach(loc => {
        const day = locationDays[loc.id];
        if (day) {
          if (!init[day]) init[day] = {};
          // assign default hour if not set
          const usedHours = Object.values(init[day]).map(Number);
          let h = 9;
          while (usedHours.includes(h) && h < 22) h++;
          init[day][loc.id] = h;
        }
      });
      return init;
    });
    const [selDay, setSelDay] = useState(tripDays[0] || "");

    const dayLocs = locations.filter(l => locationDays[l.id] === selDay);

    const assignedHours = slots[selDay] || {};

    const setHour = (locId, hour) => {
      setSlots(prev => ({ ...prev, [selDay]: { ...(prev[selDay]||{}), [locId]: Number(hour) } }));
    };

    return (
      <div>
        {/* Day selector */}
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
          {tripDays.map((d,i) => (
            <button key={d} onClick={() => setSelDay(d)} className="tab-btn"
              style={{ padding:"3px 10px", borderRadius:8, fontSize:"0.65rem",
                background: selDay===d ? th.accentLight : th.tag,
                color: selDay===d ? th.accent : th.textMuted,
                border:`1px solid ${selDay===d ? th.accent : th.border}`,
                fontWeight: selDay===d ? 700 : 400 }}>
              {formatDateLabel(d, lang)}
            </button>
          ))}
        </div>
        {/* Timeline grid */}
        <div style={{ position:"relative", overflowX:"auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"44px 1fr", gap:0, minWidth:260 }}>
            {HOURS.map(h => {
              const locsAtHour = dayLocs.filter(l => (assignedHours[l.id]||9) === h);
              return (
                <>
                  <div key={`h-${h}`} style={{ fontSize:"0.65rem", color:th.textFaint,
                    paddingRight:8, paddingTop:4, textAlign:"right", height:44,
                    borderRight:`1px solid ${th.border}`, lineHeight:"44px" }}>
                    {String(h).padStart(2,"0")}:00
                  </div>
                  <div key={`s-${h}`} style={{ minHeight:44, borderBottom:`1px dashed ${th.border}`,
                    padding:"3px 6px", display:"flex", gap:4, flexWrap:"wrap", alignItems:"flex-start" }}>
                    {locsAtHour.map(loc => (
                      <div key={loc.id} style={{ background:th.accentLight, border:`1px solid ${th.accent}`,
                        borderRadius:8, padding:"2px 8px", fontSize:"0.72rem", color:th.accent,
                        fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
                        {loc.icon} {loc.name}
                        <select value={assignedHours[loc.id]||9} onChange={e => setHour(loc.id, e.target.value)}
                          style={{ fontSize:"0.62rem", background:th.input, color:th.text,
                            border:"none", borderRadius:4, cursor:"pointer", marginLeft:2 }}>
                          {HOURS.map(hh => <option key={hh} value={hh}>{String(hh).padStart(2,"0")}:00</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </>
              );
            })}
          </div>
        </div>
        {dayLocs.length === 0 && (
          <div style={{ fontSize:"0.78rem", color:th.textMuted, textAlign:"center", padding:"16px 0" }}>
            {lang==="de" ? "Keine Orte für diesen Tag." : "No places for this day."}
          </div>
        )}
      </div>
    );
  }

  // ── RECURRING ACTIVITIES ────────────────────────────────────────────────
  function RecurringActivities({ tripDays, th, lang }) {
    const PRESETS = lang==="de" ? [
      { id:"breakfast", icon:"🍳", label:"Frühstück", time:"08:00", days:"täglich" },
      { id:"dinner", icon:"🍽️", label:"Abendessen", time:"19:00", days:"täglich" },
      { id:"coffee", icon:"☕", label:"Morgenkaffee", time:"07:30", days:"täglich" },
      { id:"walk", icon:"🚶", label:"Abendspaziergang", time:"20:00", days:"täglich" },
    ] : [
      { id:"breakfast", icon:"🍳", label:"Breakfast", time:"08:00", days:"daily" },
      { id:"dinner", icon:"🍽️", label:"Dinner", time:"19:00", days:"daily" },
      { id:"coffee", icon:"☕", label:"Morning coffee", time:"07:30", days:"daily" },
      { id:"walk", icon:"🚶", label:"Evening walk", time:"20:00", days:"daily" },
    ];
    const [active, setActive] = useState({});
    const [custom, setCustom] = useState("");
    const [customTime, setCustomTime] = useState("10:00");
    const [customList, setCustomList] = useState([]);

    const toggle = (id) => setActive(a => ({ ...a, [id]: !a[id] }));
    const addCustom = () => {
      if (!custom.trim()) return;
      setCustomList(c => [...c, { id:`c_${Date.now()}`, icon:"📌", label:custom.trim(), time:customTime, days: lang==="de" ? "täglich" : "daily" }]);
      setCustom("");
    };

    const allItems = [...PRESETS, ...customList];
    const activeItems = allItems.filter(i => active[i.id]);

    return (
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {allItems.map(item => (
            <button key={item.id} onClick={() => toggle(item.id)}
              style={{ padding:"6px 14px", borderRadius:20, fontSize:"0.78rem", cursor:"pointer",
                background: active[item.id] ? th.accentLight : th.surface,
                color: active[item.id] ? th.accent : th.textMuted,
                border:`1.5px solid ${active[item.id] ? th.accent : th.border}`,
                fontWeight: active[item.id] ? 700 : 400, transition:"all 0.15s" }}>
              {item.icon} {item.label} · {item.time}
            </button>
          ))}
        </div>
        {/* Custom */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <input value={custom} onChange={e => setCustom(e.target.value)}
            onKeyDown={e => e.key==="Enter" && addCustom()}
            placeholder={lang==="de" ? "Eigene Aktivität..." : "Custom activity..."}
            style={{ flex:1, minWidth:120, fontSize:"0.78rem", padding:"5px 10px", borderRadius:8,
              background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)}
            style={{ fontSize:"0.78rem", padding:"5px 8px", borderRadius:8,
              background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <button onClick={addCustom}
            style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:"white",
              border:"none", cursor:"pointer", fontWeight:700 }}>+</button>
        </div>
        {/* Preview */}
        {activeItems.length > 0 && (
          <div style={{ marginTop:4 }}>
            <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:6 }}>
              {lang==="de" ? `Wird auf alle ${tripDays.length} Reisetage angewendet:` : `Applied to all ${tripDays.length} trip days:`}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {activeItems.map(item => (
                <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8,
                  padding:"5px 10px", background:th.surface, borderRadius:8, border:`1px solid ${th.border}` }}>
                  <span style={{ fontSize:"1rem" }}>{item.icon}</span>
                  <span style={{ fontSize:"0.8rem", color:th.text, fontWeight:600 }}>{item.label}</span>
                  <span style={{ fontSize:"0.7rem", color:th.textMuted, marginLeft:"auto" }}>⏰ {item.time} · {item.days}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── PRE-DEPARTURE CHECKLIST ─────────────────────────────────────────────
  function PreDepartureChecklist({ th, lang, city, startDate }) {
    const DEFAULT_TASKS = lang==="de" ? [
      { id:"hotel", label:"🏨 Hotel / Unterkunft bestätigt", cat:"Buchung" },
      { id:"flights", label:"✈️ Flüge / Tickets gebucht", cat:"Buchung" },
      { id:"transfer", label:"🚌 Transfer / Anreise organisiert", cat:"Buchung" },
      { id:"insurance", label:"🏥 Reiseversicherung abgeschlossen", cat:"Dokumente" },
      { id:"passport", label:"🛂 Reisepass gültig (>6 Monate)", cat:"Dokumente" },
      { id:"visa", label:"📋 Visum beantragt (falls nötig)", cat:"Dokumente" },
      { id:"currency", label:"💱 Fremdwährung besorgt", cat:"Finanzen" },
      { id:"notify_bank", label:"💳 Bank über Reise informiert", cat:"Finanzen" },
      { id:"phone_plan", label:"📱 Roaming / SIM-Karte", cat:"Kommunikation" },
      { id:"offline_maps", label:"🗺️ Offline-Karten heruntergeladen", cat:"Kommunikation" },
      { id:"emergency", label:"🆘 Notfallnummern gespeichert", cat:"Sicherheit" },
      { id:"photos", label:"📸 Dokumente fotografiert", cat:"Sicherheit" },
    ] : [
      { id:"hotel", label:"🏨 Hotel / accommodation confirmed", cat:"Booking" },
      { id:"flights", label:"✈️ Flights / tickets booked", cat:"Booking" },
      { id:"transfer", label:"🚌 Transfer / arrival organized", cat:"Booking" },
      { id:"insurance", label:"🏥 Travel insurance taken out", cat:"Documents" },
      { id:"passport", label:"🛂 Passport valid (>6 months)", cat:"Documents" },
      { id:"visa", label:"📋 Visa applied (if needed)", cat:"Documents" },
      { id:"currency", label:"💱 Foreign currency obtained", cat:"Finance" },
      { id:"notify_bank", label:"💳 Bank notified of travel", cat:"Finance" },
      { id:"phone_plan", label:"📱 Roaming / SIM card", cat:"Communication" },
      { id:"offline_maps", label:"🗺️ Offline maps downloaded", cat:"Communication" },
      { id:"emergency", label:"🆘 Emergency numbers saved", cat:"Safety" },
      { id:"photos", label:"📸 Documents photographed", cat:"Safety" },
    ];

    const [checked, setChecked] = useState({});
    const [customTask, setCustomTask] = useState("");
    const [customTasks, setCustomTasks] = useState([]);

    const allTasks = [...DEFAULT_TASKS, ...customTasks.map((label,i) => ({ id:`ct_${i}`, label, cat:lang==="de"?"Eigene":"Custom" }))];
    const cats = [...new Set(allTasks.map(t => t.cat))];
    const done = allTasks.filter(t => checked[t.id]).length;
    const pct = allTasks.length ? Math.round((done/allTasks.length)*100) : 0;

    // Days until trip
    const daysLeft = startDate ? Math.ceil((new Date(startDate+"T12:00:00") - new Date()) / 86400000) : null;

    return (
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
          background:th.goldBg, borderRadius:10, border:`1px solid ${th.gold}` }}>
          <span style={{ fontSize:"1.5rem" }}>{city?.emoji || "✈️"}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.82rem", fontWeight:700, color:th.text }}>
              {city?.name || ""} {startDate ? `· ${startDate}` : ""}
            </div>
            {daysLeft !== null && (
              <div style={{ fontSize:"0.7rem", color: daysLeft <= 7 ? th.warning : th.textMuted }}>
                {daysLeft > 0
                  ? (lang==="de" ? `Noch ${daysLeft} Tage bis zur Abreise` : `${daysLeft} days until departure`)
                  : (lang==="de" ? "Reise hat begonnen! 🎉" : "Trip has started! 🎉")}
              </div>
            )}
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"1.2rem", fontWeight:900, color:th.gold }}>{pct}%</div>
            <div style={{ fontSize:"0.65rem", color:th.textMuted }}>{done}/{allTasks.length}</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height:6, background:th.border, borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:pct===100?th.success:th.accent,
            borderRadius:4, transition:"width 0.4s" }} />
        </div>
        {/* Tasks by category */}
        {cats.map(cat => (
          <div key={cat}>
            <div style={{ fontSize:"0.68rem", fontWeight:700, color:th.textMuted,
              textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{cat}</div>
            {allTasks.filter(t => t.cat===cat).map(task => (
              <label key={task.id} style={{ display:"flex", alignItems:"center", gap:10,
                padding:"6px 10px", borderRadius:8, cursor:"pointer", marginBottom:3,
                background: checked[task.id] ? th.successBg : th.surface,
                border:`1px solid ${checked[task.id] ? th.success : th.border}`,
                transition:"all 0.15s" }}>
                <input type="checkbox" checked={!!checked[task.id]}
                  onChange={() => setChecked(c => ({ ...c, [task.id]: !c[task.id] }))}
                  style={{ accentColor:th.success, width:15, height:15, cursor:"pointer" }} />
                <span style={{ fontSize:"0.8rem",
                  color: checked[task.id] ? th.textFaint : th.text,
                  textDecoration: checked[task.id] ? "line-through" : "none",
                  transition:"all 0.15s" }}>{task.label}</span>
              </label>
            ))}
          </div>
        ))}
        {/* Custom task */}
        <div style={{ display:"flex", gap:6, marginTop:4 }}>
          <input value={customTask} onChange={e => setCustomTask(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter" && customTask.trim()) { setCustomTasks(c => [...c, customTask.trim()]); setCustomTask(""); } }}
            placeholder={lang==="de" ? "Eigene Aufgabe..." : "Custom task..."}
            style={{ flex:1, fontSize:"0.78rem", padding:"5px 10px", borderRadius:8,
              background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <button onClick={() => { if(customTask.trim()) { setCustomTasks(c => [...c, customTask.trim()]); setCustomTask(""); } }}
            style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:"white",
              border:"none", cursor:"pointer", fontWeight:700 }}>+</button>
        </div>
        {pct===100 && (
          <div style={{ textAlign:"center", padding:"10px", background:th.successBg,
            borderRadius:10, border:`1px solid ${th.success}`, fontSize:"0.82rem",
            color:th.success, fontWeight:700 }}>
            {lang==="de" ? "✅ Alles erledigt – gute Reise! 🎉" : "✅ All done – have a great trip! 🎉"}
          </div>
        )}
      </div>
    );
  }

  function ApiKeySection({ apiKey, setApiKey, t, th }) {
  const [input, setInput] = useState(apiKey || "");
  const [saved, setSaved] = useState(false);
  const save = () => { setApiKey(input.trim()); localStorage.setItem("openai_key", input.trim()); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const del = () => { setApiKey(""); localStorage.removeItem("openai_key"); setInput(""); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.apiHint}</div>
      <div style={{ display:"flex", gap:6 }}>
        <input type="password" value={input} onChange={e => setInput(e.target.value)}
          placeholder="sk-..." style={{ flex:1, fontSize:"0.78rem", padding:"5px 10px", borderRadius:8,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={save}
          style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:"white",
            border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.75rem" }}>
          {saved ? t.apiSaved : t.apiSave}
        </button>
      </div>
      {apiKey && (
        <button onClick={del}
          style={{ alignSelf:"flex-start", padding:"3px 10px", borderRadius:8,
            background:th.warningBg, color:th.warning, border:`1px solid ${th.warning}`,
            cursor:"pointer", fontSize:"0.72rem" }}>
          {t.apiDelete}
        </button>
      )}
    </div>
  );
}

export default function App() {
  const { mode, th } = useTheme();
  const [lang, setLang] = useState("de");
  const t = TRANSLATIONS[lang];

  const [cityId, setCityId] = useState("paris");
  const [customCityName, setCustomCityName] = useState("");
  const [customCityInput, setCustomCityInput] = useState("");
  const [customCityData, setCustomCityData] = useState(null);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const city = customCityData || CITIES[cityId] || CITIES.paris;

  const today = new Date().toISOString().slice(0,10);
  const [startDate, setStartDate] = useState(today);
  const [numDays, setNumDays] = useState(4);
  const tripDays = generateTripDays(startDate, numDays);

  const [locations, setLocations] = useState([]);
  const [locationDays, setLocationDays] = useState({});
  const [locationNotes, setLocationNotes] = useState({});

  const [linkInput, setLinkInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  const [travelMode, setTravelMode] = useState("transit");
  const [optimizeMsg, setOptimizeMsg] = useState(false);

  const handleOptimize = () => {
    setLocations(prev => {
      const result = optimizeRoute(prev);
      return result;
    });
    setOptimizeMsg(true);
    setTimeout(() => setOptimizeMsg(false), 2000);
  };
  const [activeTab, setActiveTab] = useState("route");
  const [filterDay, setFilterDay] = useState("all");

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai_key") || "");
  const [planName, setPlanName] = useState("");
  const [savedPlans, setSavedPlans] = useState(() => safeJsonParse(localStorage.getItem("travel_plans"), []));
  const [saveMsg, setSaveMsg] = useState(false);

  // Load from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      if (plan) {
        const data = JSON.parse(decodeURIComponent(escape(atob(plan))));
        const norm = normalizePlan(data);
        if (norm) {
          setCityId(norm.cityId);
          setStartDate(norm.startDate);
          setNumDays(norm.numDays);
          setLocations(norm.locations);
          setLocationDays(norm.locationDays);
          setLocationNotes(norm.locationNotes);
        }
      }
    } catch {}
  }, []);

  const addLocation = async () => {
    const url = linkInput.trim();
    if (!url) { setLinkError(t.errorEmpty); return; }
    setLinkError("");
    setAnalyzing(true);
    setSkeletonVisible(true);
    try {
      let loc = null;
      if (apiKey) {
        try { loc = await analyzeWithAI(url, apiKey, city.name); } catch {}
      }
      if (!loc) {
        const matchers = city.linkMatchers || [];
        const match = matchers.find(m => m.pattern.test(url));
        if (match !== undefined && city.sampleLocations[match.locationIndex]) {
          loc = { ...city.sampleLocations[match.locationIndex] };
        }
      }
      if (!loc) { setLinkError(t.errorNotFound); setAnalyzing(false); setSkeletonVisible(false); return; }
      loc.id = Date.now();
      if (!loc.lat || !loc.lng) {
        const geo = await geocodeCity(loc.name + " " + city.name);
        if (geo) { loc.lat = geo.lat; loc.lng = geo.lng; }
      }
      setLocations(prev => [...prev, loc]);
      setLinkInput("");
    } catch (e) { setLinkError(String(e)); }
    setAnalyzing(false);
    setSkeletonVisible(false);
  };

  const addDemoLocation = (loc) => {
    if (locations.find(l => l.name === loc.name)) return;
    setLocations(prev => [...prev, { ...loc, id: Date.now() + Math.random() }]);
  };

  const removeLocation = (id) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    setLocationDays(prev => { const n = {...prev}; delete n[id]; return n; });
    setLocationNotes(prev => { const n = {...prev}; delete n[id]; return n; });
  };

  const moveLocation = (index, dir) => {
    setLocations(prev => {
      const arr = [...prev];
      const swap = index + dir;
      if (swap < 0 || swap >= arr.length) return arr;
      [arr[index], arr[swap]] = [arr[swap], arr[index]];
      return arr;
    });
  };

  const savePlan = () => {
    if (!planName.trim()) return;
    const plan = normalizePlan({ id: Date.now(), name: planName.trim(), cityId: city.id || cityId,
      startDate, numDays, tripDays, locations, locationDays, locationNotes });
    const updated = [...savedPlans.filter(p => p.name !== plan.name), plan];
    setSavedPlans(updated);
    localStorage.setItem("travel_plans", JSON.stringify(updated));
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2000);
  };

  const loadPlan = (plan) => {
    const norm = normalizePlan(plan);
    if (!norm) return;
    setCityId(norm.cityId);
    setStartDate(norm.startDate);
    setNumDays(norm.numDays);
    setLocations(norm.locations);
    setLocationDays(norm.locationDays);
    setLocationNotes(norm.locationNotes);
    setCustomCityData(null);
  };

  const deletePlan = (id) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem("travel_plans", JSON.stringify(updated));
  };

  const addCustomCity = async () => {
    if (!customCityInput.trim()) return;
    const geo = await geocodeCity(customCityInput.trim());
    const name = geo?.name || customCityInput.trim();
    setCustomCityData({ id: "custom", name, emoji: "🌍", country: "🌐",
      lat: geo?.lat || 48.8566, lng: geo?.lng || 2.3522,
      sampleLocations: [], demoLinks: [], linkMatchers: [],
      entryCosts: {}, ratings: {}, locationInfo: {}, openingHours: {}, metroLines: {} });
    setCityId("custom");
    setShowCityPicker(false);
    setCustomCityInput("");
  };

  const filteredLocations = filterDay === "all" ? locations
    : locations.filter(l => locationDays[l.id] === filterDay);

  const dayGroups = tripDays.map((day, i) => ({
    day, index: i,
    locs: locations.filter(l => locationDays[l.id] === day)
  })).filter(g => g.locs.length > 0);

  const unassigned = locations.filter(l => !locationDays[l.id]);

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"'Source Sans 3',system-ui,sans-serif" }}>
      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:100, background:th.navBg,
        borderBottom:`1px solid ${th.border}`, padding:"10px 16px",
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:"1.3rem" }}>✈️</span>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:"1.1rem", color:th.accent }}>{t.appName}</span>
          <span style={{ fontSize:"0.75rem", background:th.tag, color:th.tagText, borderRadius:8, padding:"2px 8px" }}>
            {city.emoji} {city.name}
          </span>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <button onClick={() => setLang(l => l==="de" ? "en" : "de")}
            style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, background:th.tag,
              color:th.tagText, border:`1px solid ${th.border}`, cursor:"pointer", fontWeight:700 }}>
            {lang==="de" ? "EN" : "DE"}
          </button>
          <button onClick={toggleTheme} className="theme-toggle-btn"
            style={{ fontSize:"0.9rem", padding:"4px 8px", borderRadius:8, background:th.tag,
              color:th.text, border:`1px solid ${th.border}`, cursor:"pointer" }}>
            {mode==="dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={() => window.print()} className="no-print"
            style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, background:th.tag,
              color:th.tagText, border:`1px solid ${th.border}`, cursor:"pointer" }}>🖨️</button>
        </div>
      </nav>

      <div style={{ maxWidth:520, margin:"0 auto", padding:"16px 12px 80px" }}>

        {/* CITY PICKER */}
        <CollapsibleSection title={t.switchCity} icon="🏙️" th={th} defaultOpen={false}
          badge={city.emoji + " " + city.name}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
            {CITY_ORDER.map(cid => {
              const c = CITIES[cid];
              return (
                <button key={cid} onClick={() => { setCityId(cid); setCustomCityData(null); }}
                  style={{ padding:"4px 10px", borderRadius:10, fontSize:"0.75rem", cursor:"pointer",
                    background: cityId===cid && !customCityData ? th.accentLight : th.tag,
                    color: cityId===cid && !customCityData ? th.accent : th.text,
                    border:`1px solid ${cityId===cid && !customCityData ? th.accent : th.border}`,
                    fontWeight: cityId===cid && !customCityData ? 700 : 400 }}>
                  {c.emoji} {c.name}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <input value={customCityInput} onChange={e => setCustomCityInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && addCustomCity()}
              placeholder={t.customCityPlaceholder}
              style={{ flex:1, fontSize:"0.78rem", padding:"5px 10px", borderRadius:8,
                background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            <button onClick={addCustomCity}
              style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:"white",
                border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.78rem" }}>
              {t.customCityAdd}
            </button>
          </div>
        </CollapsibleSection>

        {/* TRIP DATES */}
        <CollapsibleSection title={t.sectionTrip} icon="" th={th} defaultOpen={true}>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:"0.7rem", color:th.textMuted }}>{t.labelStartDate}</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                style={{ fontSize:"0.82rem", padding:"5px 10px", borderRadius:8,
                  background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:"0.7rem", color:th.textMuted }}>{t.labelDays}</label>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <input type="number" min={1} max={30} value={numDays}
                  onChange={e => setNumDays(Math.max(1,Math.min(30,parseInt(e.target.value)||1)))}
                  style={{ width:60, fontSize:"0.82rem", padding:"5px 8px", borderRadius:8,
                    background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
                <span style={{ fontSize:"0.78rem", color:th.textMuted }}>{t.labelDaysSuffix}</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:10 }}>
            {tripDays.map((d, i) => (
              <div key={d} style={{ padding:"3px 8px", borderRadius:8, fontSize:"0.68rem",
                background:th.tag, color:getDayColor(i), fontWeight:700, border:`1px solid ${getDayColor(i)}44` }}>
                {formatDateLabel(d, lang)}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* ADD PLACE */}
        <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:14,
          padding:"14px", marginBottom:12 }}>
          <div style={{ fontSize:"0.7rem", fontWeight:700, color:th.textMuted, letterSpacing:"0.08em",
            textTransform:"uppercase", marginBottom:8 }}>{t.insertLink}</div>
          <div style={{ display:"flex", gap:6 }}>
            <input value={linkInput} onChange={e => setLinkInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && addLocation()}
              placeholder={t.linkPlaceholder}
              style={{ flex:1, fontSize:"0.82rem", padding:"8px 12px", borderRadius:10,
                background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            <button onClick={addLocation} disabled={analyzing} className="btn-primary"
              style={{ padding:"8px 14px", borderRadius:10, background:th.accent, color:"white",
                border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.8rem",
                display:"flex", alignItems:"center", gap:6, opacity: analyzing ? 0.7 : 1 }}>
              {analyzing ? <Spinner size={16} color="white" /> : null}
              {analyzing ? t.analyzing : t.analyze}
            </button>
          </div>
          {linkError && <div style={{ fontSize:"0.72rem", color:th.warning, marginTop:6 }}>⚠️ {linkError}</div>}
          {apiKey ? (
            <div style={{ fontSize:"0.68rem", color:th.success, marginTop:4 }}>✅ AI {t.apiActive}</div>
          ) : (
            <div style={{ fontSize:"0.68rem", color:th.textFaint, marginTop:4 }}>⚠️ {t.apiMissing} — Demo-Modus</div>
          )}

          {/* DEMO LINKS */}
          {city.sampleLocations && city.sampleLocations.length > 0 && (
            <div style={{ marginTop:10 }}>
              <div style={{ fontSize:"0.68rem", color:th.textMuted, marginBottom:4 }}>{t.demo}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {city.sampleLocations.map((loc, i) => (
                  <button key={i} onClick={() => addDemoLocation(loc)}
                    style={{ padding:"3px 10px", borderRadius:10, fontSize:"0.72rem", cursor:"pointer",
                      background:th.tag, color:th.tagText, border:`1px solid ${th.border}` }}>
                    {loc.icon} {loc.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SKELETON */}
        {skeletonVisible && <div style={{ marginBottom:12 }}><SkeletonCard th={th} /></div>}

        {/* ROUTE OPTIMIZE */}
          {locations.length > 2 && (
            <div style={{ marginBottom:10 }}>
              <button onClick={handleOptimize} className="btn-primary"
                style={{ width:"100%", padding:"9px 0", borderRadius:12, background:th.accent,
                  color:"white", border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.8rem",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                ⚡️ Route optimieren — kürzester Weg
              </button>
            </div>
          )}

          {/* TRAVEL MODE */}
        {locations.length > 0 && (
          <div style={{ display:"flex", gap:4, marginBottom:10, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:"0.65rem", color:th.textMuted, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" }}>{t.travelMode}:</span>
            {[["walking",t.walking],["transit",t.transit],["driving",t.driving]].map(([m,label]) => (
              <button key={m} onClick={() => setTravelMode(m)} className="tab-btn"
                style={{ padding:"3px 10px", borderRadius:8, fontSize:"0.65rem",
                  background: travelMode===m ? th.accentLight : th.tag,
                  color: travelMode===m ? th.accent : th.textMuted,
                  border:`1px solid ${travelMode===m ? th.accent : th.border}`,
                  fontWeight: travelMode===m ? 700 : 400 }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* DAY FILTER */}
        {locations.length > 0 && (
          <div style={{ display:"flex", gap:4, marginBottom:10, flexWrap:"wrap" }}>
            <button onClick={() => setFilterDay("all")} className="tab-btn"
              style={{ padding:"3px 10px", borderRadius:8,
                background: filterDay==="all" ? th.accentLight : th.tag,
                color: filterDay==="all" ? th.accent : th.textMuted,
                border:`1px solid ${filterDay==="all" ? th.accent : th.border}`,
                fontWeight: filterDay==="all" ? 700 : 400, fontSize:"0.65rem" }}>
              {t.allDays} ({locations.length})
            </button>
            {tripDays.map((d, i) => {
              const cnt = locations.filter(l => locationDays[l.id]===d).length;
              if (cnt === 0) return null;
              return (
                <button key={d} onClick={() => setFilterDay(d)} className="tab-btn"
                  style={{ padding:"3px 10px", borderRadius:8,
                    background: filterDay===d ? th.accentLight : th.tag,
                    color: filterDay===d ? getDayColor(i) : th.textMuted,
                    border:`1px solid ${filterDay===d ? getDayColor(i) : th.border}`,
                    fontWeight: filterDay===d ? 700 : 400, fontSize:"0.65rem" }}>
                  {formatDateLabel(d, lang)} ({cnt})
                </button>
              );
            })}
          </div>
        )}

        {/* LOCATION CARDS */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:12 }}>
          {filteredLocations.map((loc, i) => (
            <>
              <LocationCard key={loc.id} loc={loc} index={locations.indexOf(loc)} city={city}
                t={t} lang={lang} tripDays={tripDays} locationDays={locationDays}
                locationNotes={locationNotes}
                onDayChange={(id, day) => setLocationDays(prev => day ? {...prev,[id]:day} : (()=>{const n={...prev};delete n[id];return n;})())}
                onNoteChange={(id, note) => setLocationNotes(prev => ({...prev,[id]:note}))}
                onRemove={removeLocation}
                onMoveUp={(idx) => moveLocation(idx, -1)}
                onMoveDown={(idx) => moveLocation(idx, 1)}
                isFirst={locations.indexOf(loc)===0}
                isLast={locations.indexOf(loc)===locations.length-1}
                travelMode={travelMode} th={th} />
              {i < filteredLocations.length-1 && filterDay==="all" && (
                <TravelTimeBadge from={loc} to={filteredLocations[i+1]} />
              )}
            </>
          ))}
        </div>

        {/* MAP */}
        {locations.length > 0 && (
          <CollapsibleSection title={t.sectionMap} icon="" th={th} defaultOpen={true}>
            <MapView locations={filteredLocations} city={city} th={th} />
          </CollapsibleSection>
        )}

        {/* TIMELINE */}
        {locations.length > 0 && (
          <CollapsibleSection title={t.sectionRoute} icon="" th={th} defaultOpen={false}
            badge={`${locations.length} ${t.stops}`}>
            <div style={{ display:"flex", gap:4, marginBottom:10 }}>
              {[["route",t.route],["timeline",t.timeline]].map(([tab,label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="tab-btn"
                  style={{ padding:"4px 12px", borderRadius:8,
                    background: activeTab===tab ? th.accentLight : th.tag,
                    color: activeTab===tab ? th.accent : th.textMuted,
                    border:`1px solid ${activeTab===tab ? th.accent : th.border}`,
                    fontWeight: activeTab===tab ? 700 : 400, fontSize:"0.68rem" }}>
                  {label}
                </button>
              ))}
            </div>

            {activeTab==="route" && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {dayGroups.map(({ day, index: di, locs }) => (
                  <div key={day}>
                    <div style={{ fontSize:"0.72rem", fontWeight:700, color:getDayColor(di),
                      marginBottom:4, display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:getDayColor(di) }} />
                      Tag {di+1} – {formatDateLabel(day, lang)}
                    </div>
                    {locs.map((loc, li) => (
                      <div key={loc.id}>
                        <div style={{ display:"flex", gap:8, alignItems:"center",
                          padding:"6px 10px", background:th.surface, borderRadius:8,
                          border:`1px solid ${th.border}`, marginBottom:4 }}>
                          <div style={{ width:22, height:22, borderRadius:"50%", background:getDayColor(di),
                            color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"0.7rem", fontWeight:900, flexShrink:0 }}>{li+1}</div>
                          <span style={{ fontSize:"0.8rem", color:th.text }}>{loc.icon} {loc.name}</span>
                          <span style={{ fontSize:"0.68rem", color:th.textMuted, marginLeft:"auto" }}>{loc.duration}</span>
                        </div>
                        {li < locs.length-1 && <TravelTimeBadge from={loc} to={locs[li+1]} />}
                      </div>
                    ))}
                  </div>
                ))}
                {unassigned.length > 0 && (
                  <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:4 }}>
                    📌 {unassigned.length}x {t.allDays}
                  </div>
                )}
                {locations.length < 2 && (
                  <div style={{ fontSize:"0.75rem", color:th.textFaint }}>{t.noRouteHint}</div>
                )}
              </div>
            )}

            {activeTab==="timeline" && (
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {dayGroups.map(({ day, index: di, locs }) => (
                  <div key={day} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:700, color:getDayColor(di), marginBottom:6 }}>
                      📅 Tag {di+1} – {formatDateLabel(day, lang)}
                    </div>
                    {locs.map((loc, li) => (
                      <div key={loc.id} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:6 }}>
                        <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:getDayColor(di),
                            color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"0.65rem", fontWeight:900 }}>{li+1}</div>
                          {li < locs.length-1 && <div style={{ width:2, height:24, background:th.border, margin:"2px 0" }} />}
                        </div>
                        <div style={{ flex:1, background:th.surface, borderRadius:8,
                          border:`1px solid ${th.border}`, padding:"6px 10px" }}>
                          <div style={{ fontSize:"0.8rem", fontWeight:700, color:th.text }}>{loc.icon} {loc.name}</div>
                          <div style={{ fontSize:"0.68rem", color:th.textMuted }}>{loc.type} · {loc.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* HEATMAP */}
          {locations.length > 0 && (
            <CollapsibleSection title={lang==="de" ? "Stadtteil-Heatmap" : "District Heatmap"} icon="🔥" th={th} defaultOpen={false}>
              <AreaHeatmap locations={locations} th={th} />
            </CollapsibleSection>
          )}

          {/* BUDGET */}
        {locations.length > 0 && (
          <CollapsibleSection title={t.budgetTitle} icon="💰" th={th} defaultOpen={false}>
            <BudgetTracker locations={locations} city={city} lang={lang} t={t} th={th} />
          </CollapsibleSection>
        )}

        {/* PACKING LIST */}
          {locations.length > 0 && (
            <CollapsibleSection title={lang==="de" ? "Packliste" : "Packing List"} icon="🎒" th={th} defaultOpen={false}>
              <PackingList locations={locations} numDays={numDays} t={t} lang={lang} />
            </CollapsibleSection>
          )}

          {/* DAY CALENDAR */}
          {locations.length > 0 && (
            <CollapsibleSection title={lang==="de" ? "🕐 Tagesplan mit Zeitslots" : "🕐 Day Schedule"} icon="" th={th} defaultOpen={false}>
              <DayCalendar locations={locations} locationDays={locationDays} tripDays={tripDays} th={th} lang={lang} />
            </CollapsibleSection>
          )}

          {/* RECURRING ACTIVITIES */}
          <CollapsibleSection title={lang==="de" ? "🔁 Wiederkehrende Aktivitäten" : "🔁 Recurring Activities"} icon="" th={th} defaultOpen={false}>
            <RecurringActivities tripDays={tripDays} th={th} lang={lang} />
          </CollapsibleSection>

          {/* PRE-DEPARTURE CHECKLIST */}
          <CollapsibleSection title={lang==="de" ? "✅ Vor-Abreise-Checkliste" : "✅ Pre-Departure Checklist"} icon="" th={th} defaultOpen={false}>
            <PreDepartureChecklist th={th} lang={lang} city={city} startDate={startDate} />
          </CollapsibleSection>

        {/* TRIP DASHBOARD */}
          <CollapsibleSection title={lang==="de" ? "🗂 Alle Reisen" : "🗂 All Trips"} icon="" th={th} defaultOpen={false}
            badge={savedPlans.length > 0 ? savedPlans.length : null}>
            <TripDashboard plans={savedPlans} onLoad={loadPlan} onDelete={deletePlan}
              onNew={() => { setLocations([]); setLocationDays({}); setLocationNotes({}); }}
              th={th} lang={lang} />
          </CollapsibleSection>

          {/* SAVED PLANS */}
          <CollapsibleSection title={t.savedPlans} icon="💾" th={th} defaultOpen={false}
          badge={savedPlans.length > 0 ? savedPlans.length : null}>
          <SavedPlans plans={savedPlans} onSave={savePlan} onLoad={loadPlan} onDelete={deletePlan}
            planName={planName} setPlanName={setPlanName} saveMsg={saveMsg} t={t} th={th} locations={locations} />
        </CollapsibleSection>

        {/* SHARE */}
        <CollapsibleSection title={t.share} icon="🔗" th={th} defaultOpen={false}>
          <ShareSection locations={locations} cityId={city.id || cityId} startDate={startDate}
            numDays={numDays} locationDays={locationDays} locationNotes={locationNotes} t={t} th={th} />
        </CollapsibleSection>

        {/* API KEY */}
        <CollapsibleSection title={t.apiTitle} icon="" th={th} defaultOpen={false}>
          <ApiKeySection apiKey={apiKey} setApiKey={setApiKey} t={t} th={th} />
        </CollapsibleSection>

        {/* FOOTER */}
        <div style={{ textAlign:"center", fontSize:"0.68rem", color:th.textFaint, marginTop:24, paddingTop:16,
          borderTop:`1px solid ${th.border}` }}>
          {t.footerText} · {city.emoji} {city.name} · {mode === "dark" ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  );
}

