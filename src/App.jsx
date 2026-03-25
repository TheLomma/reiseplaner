import { useState, useEffect, useRef } from "react";

const THEMES = {
  dark: {
    bg: "#0f1117", surface: "#1a1d27", card: "#1e2130", cardHover: "#252840",
    border: "#2d3150", borderHover: "#4a5080",
    text: "#e8eaf6", textMuted: "#8b90b8", textFaint: "#4a4f70",
    accent: "#6c63ff", accentHover: "#8b84ff", accentLight: "rgba(108,99,255,0.15)",
    success: "#4caf7d", successBg: "#0d2318",
    warning: "#ff6b6b", warningBg: "#2a0d0d",
    info: "#42a5f5", infoBg: "#0a1929",
    gold: "#ffd700", goldBg: "rgba(255,215,0,0.08)",
    tag: "#1a2040", tagText: "#7b8cde",
    input: "#12151f", inputBorder: "#2d3150",
    navBg: "rgba(15,17,23,0.95)",
    shadow: "0 4px 24px rgba(0,0,0,0.4)",
    shadowHover: "0 8px 32px rgba(108,99,255,0.25)",
    skeleton: "#1e2130", skeletonShine: "#252840",
  },
  light: {
    bg: "#f0f2ff", surface: "#ffffff", card: "#ffffff", cardHover: "#f5f6ff",
    border: "#dde1f5", borderHover: "#b0b8e8",
    text: "#1a1d40", textMuted: "#5a5f8a", textFaint: "#9096c0",
    accent: "#5c52f0", accentHover: "#4840d0", accentLight: "rgba(92,82,240,0.1)",
    success: "#2e9a5c", successBg: "#eafaf1",
    warning: "#e53935", warningBg: "#fdecea",
    info: "#1565c0", infoBg: "#e3f2fd",
    gold: "#f9a825", goldBg: "rgba(249,168,37,0.1)",
    tag: "#eef0fc", tagText: "#5c68c8",
    input: "#f8f9ff", inputBorder: "#dde1f5",
    navBg: "rgba(240,242,255,0.95)",
    shadow: "0 4px 20px rgba(90,85,200,0.1)",
    shadowHover: "0 8px 32px rgba(92,82,240,0.2)",
    skeleton: "#eef0f8", skeletonShine: "#f5f6ff",
  }
};

if (typeof window !== "undefined" && !document.getElementById("app-theme-styles")) {
  const s = document.createElement("style");
  s.id = "app-theme-styles";
  s.textContent = `
    @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes markerBounce { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-10px) scale(1.1)} 60%{transform:translateY(-5px) scale(1.05)} }
    @keyframes markerPop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2);opacity:1} 100%{transform:scale(1);opacity:1} }
    @keyframes spin { to{transform:rotate(360deg)} }
    .card-anim { animation: fadeSlideIn 0.35s cubic-bezier(.22,1,.36,1) both; }
    .skeleton-anim { animation: skeletonPulse 1.4s ease-in-out infinite; }
    .app-card-hover { transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s, background 0.2s; }
    .app-card-hover:hover { transform: translateY(-2px); }
    .theme-toggle-btn { transition: background 0.2s, color 0.2s, box-shadow 0.2s; }
    .tab-btn { transition: background 0.15s, color 0.15s; }
    .btn-primary { transition: background 0.15s, box-shadow 0.15s, transform 0.1s; }
    .btn-primary:hover { transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
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
    apiSaved: "✅ Gespeichert!", apiDelete: "🗑️ Key löschen", footerText: "Reiseplaner v3.5",
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
    apiSaved: "✅ Saved!", apiDelete: "🗑️ Delete key", footerText: "Travel Planner v3.5",
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
    if (data.results?.length > 0) {
      const r = data.results[0];
      return { lat:r.latitude, lng:r.longitude, timezone:r.timezone, fullName:r.name, country:r.country_code };
    }
  } catch {}
  return null;
}

function CollapsibleSection({ title, badge, rightContent, children, defaultOpen=false }) {
  const { th } = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="app-card-hover" style={{
      background:th.surface, border:`1px solid ${th.border}`,
      borderRadius:16, overflow:"hidden", boxShadow:th.shadow,
    }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:8, padding:"12px 16px", borderBottom: open ? `1px solid ${th.border}` : "none",
          background:th.card, cursor:"pointer", border:"none" }}>
        <h2 style={{ color:th.accent, fontFamily:"system-ui,sans-serif", fontSize:"0.9rem",
          fontWeight:900, letterSpacing:"-0.01em", margin:0, display:"flex", alignItems:"center", gap:8 }}>
          {title}
          {badge !== undefined && <span style={{ color:th.textFaint, fontSize:"0.75rem", fontWeight:400 }}>({badge})</span>}
        </h2>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {rightContent}
          <span style={{ color:th.textFaint, fontSize:"0.75rem" }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && <div style={{ padding:"14px 16px" }}>{children}</div>}
    </div>
  );
}

function StarRating({ stars }) {
  const { th } = useTheme();
  const full = Math.floor(stars);
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:2 }}>
      {Array.from({length:5}).map((_,i) => (
        <span key={i} style={{ color:i<full?th.gold:th.textFaint, fontSize:"0.7rem" }}>{i<full?"★":"☆"}</span>
      ))}
      <span style={{ marginLeft:4, fontSize:"0.75rem", fontWeight:700, color:th.gold }}>{stars}</span>
    </span>
  );
}

function MetroTag({ line, time }) {
  const { th } = useTheme();
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:6,
      padding:"2px 10px", borderRadius:999, fontSize:"0.72rem", fontWeight:800,
      background:th.tag, color:th.accent, border:`1px solid ${th.border}`, whiteSpace:"nowrap",
    }}>
      🚇 {line} · {time}
    </span>
  );
}

function LocationCard({ loc, day, onRemove, index, onDragStart, onDragOver, onDrop, isDragging, city, onDayChange, availableDays, onNoteChange, t, getDayLabel }) {
  const { th } = useTheme();
  const openInfo = day ? getOpeningInfo(loc.name, day, city) : null;
  const locInfo = getLocationInfo(loc.name, city);
  const rating = getRating(loc.name, city);
  const cost = getEntryCost(loc.name, city);
  const [showInfo, setShowInfo] = useState(false);
  const [showNote, setShowNote] = useState(!!loc.note);

  const isClosed = openInfo && !openInfo.isOpen;
  const cardBorder = isClosed ? th.warning : th.border;

  return (
    <div draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
      className="card-anim app-card-hover"
      style={{
        background:th.card, border:`1px solid ${cardBorder}`,
        borderRadius:14, padding:"10px 12px", cursor:"grab", opacity:isDragging?0.5:1,
        boxShadow: isClosed ? `0 0 0 1px ${th.warning}22` : th.shadow,
      }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:"1.1rem", flexShrink:0,
          background:th.accentLight, border:`1px solid ${th.border}`,
        }}>{loc.icon || "📍"}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
            <span style={{ fontWeight:700, fontSize:"0.875rem", color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {loc.name}
            </span>
            <button onClick={() => onRemove(loc.id)}
              style={{ color:th.textFaint, background:"none", border:"none", cursor:"pointer", padding:"0 2px", fontSize:"1rem", flexShrink:0 }}>×</button>
          </div>
          <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:2 }}>
            {loc.type}{loc.area ? ` · ${loc.area}` : ""}{loc.duration ? ` · ⏱ ${loc.duration}` : ""}
          </div>
          {rating && (
            <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <StarRating stars={rating.stars} />
              <span style={{ fontSize:"0.68rem", color:th.textFaint }}>{rating.reviews.toLocaleString()} {t.reviews}</span>
              {rating.badge && (
                <span style={{ fontSize:"0.65rem", padding:"1px 6px", borderRadius:6,
                  background:th.accentLight, color:th.accent, fontWeight:700 }}>{rating.badge}</span>
              )}
            </div>
          )}
          {cost && (
            <div style={{ fontSize:"0.7rem", color:th.textMuted, marginTop:3 }}>
              💰 {t.admission}: {cost.min === 0 && cost.max === 0 ? <span style={{ color:th.success }}>{t.free}</span>
                : `${cost.currency}${cost.min}${cost.max !== cost.min ? `–${cost.currency}${cost.max}` : ""}`}
              {cost.note ? <span style={{ color:th.textFaint }}> ({cost.note})</span> : null}
            </div>
          )}
          {openInfo && (
            <div style={{ fontSize:"0.7rem", marginTop:3,
              color: openInfo.isOpen ? th.success : th.warning }}>
              {openInfo.isOpen ? `✅ ${openInfo.hours}` : `❌ ${t.closedDay}`}
              {openInfo.note ? <span style={{ color:th.textFaint }}> – {openInfo.note}</span> : null}
            </div>
          )}
          {isClosed && (
            <div style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:6, marginTop:4,
              background:th.warningBg, color:th.warning, fontWeight:600 }}>
              ⚠️ {loc.name} {t.warningClosed}
            </div>
          )}
        </div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8, alignItems:"center" }}>
        {availableDays && availableDays.length > 0 && (
          <select value={day || ""} onChange={e => onDayChange(loc.id, e.target.value || null)}
            style={{ fontSize:"0.7rem", padding:"3px 6px", borderRadius:8,
              background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`,
              cursor:"pointer", maxWidth:130 }}>
            <option value="">{t.allDays}</option>
            {availableDays.map(d => (
              <option key={d} value={d}>{getDayLabel ? getDayLabel(d) : d}</option>
            ))}
          </select>
        )}
        {locInfo && (
          <button onClick={() => setShowInfo(v => !v)}
            style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, cursor:"pointer",
              background:showInfo?th.accentLight:"transparent", color:showInfo?th.accent:th.textMuted,
              border:`1px solid ${th.border}` }}>
            {showInfo ? t.infoHide : t.infoShow}
          </button>
        )}
        <button onClick={() => setShowNote(v => !v)}
          style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, cursor:"pointer",
            background:showNote?th.accentLight:"transparent", color:showNote?th.accent:th.textMuted,
            border:`1px solid ${th.border}` }}>
          {showNote ? t.noteHide : t.noteLabel}
        </button>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.name)}`} target="_blank" rel="noreferrer"
          style={{ fontSize:"0.68rem", color:th.info, textDecoration:"none" }}>🗺 Maps</a>
        <span style={{ marginLeft:"auto", fontSize:"0.68rem", color:th.textFaint, cursor:"grab" }}>{t.dragHint}</span>
      </div>
      {showInfo && locInfo && (
        <div style={{ marginTop:8, padding:"8px 10px", borderRadius:10,
          background:th.surface, border:`1px solid ${th.border}`, fontSize:"0.72rem" }}>
          <div style={{ color:th.textMuted, marginBottom:6 }}>{locInfo.short}</div>
          {locInfo.highlights?.map((h,i) => (
            <div key={i} style={{ color:th.text, marginBottom:3 }}>✓ {h}</div>
          ))}
        </div>
      )}
      {showNote && (
        <textarea value={loc.note || ""} onChange={e => onNoteChange(loc.id, e.target.value)}
          placeholder={t.notePlaceholder} rows={2}
          style={{ marginTop:8, width:"100%", fontSize:"0.72rem", padding:"6px 8px",
            borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`,
            resize:"vertical", fontFamily:"inherit" }} />
      )}
    </div>
  );
}

function MapView({ locations, city }) {
  const { th } = useTheme();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const init = () => {
      if (!window.L) { setTimeout(init, 300); return; }
      if (mapInstance.current) {
        try { mapInstance.current.remove(); } catch {}
        mapInstance.current = null;
      }
      const center = city ? [city.lat, city.lng] : [48.8566, 2.3522];
      mapInstance.current = window.L.map(mapRef.current, { zoomControl: true }).setView(center, 13);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(mapInstance.current);

      const locs = locations && locations.length > 0 ? locations : (city?.sampleLocations || []);
      locs.forEach((loc, i) => {
        if (!loc.lat || !loc.lng) return;
        const icon = window.L.divIcon({
          html: `<div style="background:${th.accent};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);animation:markerPop 0.4s ease both;animation-delay:${i*0.08}s">${i+1}</div>`,
          className: "", iconSize: [28,28], iconAnchor: [14,14]
        });
        window.L.marker([loc.lat, loc.lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>${loc.name}</b><br/>${loc.address||""}`);
      });

      if (locs.length > 1) {
        const bounds = locs.filter(l => l.lat && l.lng).map(l => [l.lat, l.lng]);
        if (bounds.length > 1) {
          try { mapInstance.current.fitBounds(bounds, { padding: [30,30] }); } catch {}
        }
      }
    };
    init();
    return () => {
      if (mapInstance.current) {
        try { mapInstance.current.remove(); } catch {}
        mapInstance.current = null;
      }
    };
  }, [locations, city]);

  return (
    <div ref={mapRef} style={{
      width:"100%", height:320, borderRadius:12, overflow:"hidden",
      border:`1px solid ${th.border}`, background:th.card
    }} />
  );
}

function RouteView({ locations, city, travelMode, t }) {
  const { th } = useTheme();
  const locs = locations.filter(l => l.lat && l.lng);
  if (locs.length < 2) return (
    <div style={{ textAlign:"center", color:th.textFaint, fontSize:"0.8rem", padding:"20px 0" }}>
      {t.noRouteHint}
    </div>
  );
  let totalWalk = 0, totalTransit = 0, totalDist = 0;
  const segments = [];
  for (let i = 0; i < locs.length - 1; i++) {
    const travel = calcTravelTime(locs[i], locs[i+1]);
    if (travel) {
      totalWalk += travel.walkMin;
      totalTransit += travel.transitMin;
      totalDist += travel.distKm;
      segments.push(travel);
    } else {
      segments.push(null);
    }
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", gap:12, padding:"8px 12px", borderRadius:12,
        background:th.surface, border:`1px solid ${th.border}`, flexWrap:"wrap" }}>
        <span style={{ fontSize:"0.72rem", color:th.textMuted }}>
          📍 {locs.length} {t.stops} · {totalDist.toFixed(1)} km
        </span>
        <span style={{ fontSize:"0.72rem", color:th.info }}>🚶 {totalWalk} Min. gesamt</span>
        <span style={{ fontSize:"0.72rem", color:th.gold }}>🚇 {totalTransit} Min. gesamt</span>
      </div>
      {locs.map((loc, i) => {
        const seg = segments[i];
        const metro = i < locs.length - 1 ? getMetroLine(loc, locs[i+1], city) : null;
        return (
          <div key={loc.id}>
            <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:th.accent,
                  color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.75rem", fontWeight:800 }}>{i+1}</div>
                {i < locs.length - 1 && <div style={{ width:2, height:32, background:th.border, margin:"4px 0" }} />}
              </div>
              <div style={{ flex:1, paddingBottom:4 }}>
                <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.text }}>{loc.icon} {loc.name}</div>
                <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{loc.area || loc.address}</div>
              </div>
            </div>
            {seg && i < locs.length - 1 && (
              <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:38, paddingBottom:4 }}>
                <div style={{ fontSize:"0.68rem", color:th.textFaint,
                  display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                  <span style={{ color:th.info }}>🚶 {seg.walkMin} Min.</span>
                  <span style={{ color:th.gold }}>🚇 {seg.transitMin} Min.</span>
                  <span>({seg.distKm} km)</span>
                  {metro && <MetroTag line={metro.line} time={metro.time} />}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TimelineView({ locations, day, city, travelMode, t }) {
  const { th } = useTheme();
  const filtered = day ? locations.filter(l => l._day === day) : locations;
  if (filtered.length === 0) return (
    <div style={{ textAlign:"center", color:th.textFaint, fontSize:"0.8rem", padding:"20px 0" }}>
      {t.noRouteHint}
    </div>
  );
  let time = 9 * 60;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {filtered.map((loc, i) => {
        const startH = Math.floor(time/60);
        const startM = time % 60;
        const durMatch = (loc.duration||"").match(/[\d,.]+/);
        const durMin = durMatch ? Math.round(parseFloat(durMatch[0].replace(",","."))*60) : 60;
        time += durMin;
        const endH = Math.floor(time/60);
        const endM = time % 60;
        const travel = i < filtered.length-1 ? calcTravelTime(loc, filtered[i+1]) : null;
        const transferMin = travelMode === "walking" ? travel?.walkMin : travel?.transitMin;
        time += transferMin || 20;
        return (
          <div key={loc.id}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{
                  width:32, height:32, borderRadius:"50%", background:th.accent,
                  color:"white", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"0.8rem", fontWeight:800
                }}>{i+1}</div>
                {i < filtered.length-1 && <div style={{ width:2, flex:1, minHeight:30, background:th.border, margin:"4px 0" }} />}
              </div>
              <div style={{ flex:1, paddingBottom:12 }}>
                <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:2 }}>
                  {String(startH).padStart(2,"0")}:{String(startM).padStart(2,"0")} – {String(endH).padStart(2,"0")}:{String(endM).padStart(2,"0")}
                </div>
                <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.text }}>{loc.icon} {loc.name}</div>
                <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{loc.area} · {loc.duration}</div>
                {travel && i < filtered.length-1 && (
                  <div style={{ fontSize:"0.68rem", color:th.textFaint, marginTop:4 }}>
                    → {travelMode === "walking" ? `🚶 ${travel.walkMin} Min.` : `🚇 ${travel.transitMin} Min.`} ({travel.distKm} km)
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BudgetTracker({ locations, city, t }) {
  const { th } = useTheme();
  const [extras, setExtras] = useState([{ label:"Hotel", amount:150 }, { label:"Essen", amount:80 }]);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const locationCosts = locations.map(loc => {
    const c = getEntryCost(loc.name, city);
    return c ? { name:loc.name, cost:c } : null;
  }).filter(Boolean);

  const locTotal = locationCosts.reduce((s,l) => s + (l.cost.min+l.cost.max)/2, 0);
  const extTotal = extras.reduce((s,e) => s + (Number(e.amount)||0), 0);
  const total = locTotal + extTotal;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {locationCosts.length === 0 && (
        <div style={{ color:th.textFaint, fontSize:"0.8rem" }}>{t.addFirst}</div>
      )}
      {locationCosts.map((l,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"6px 10px", borderRadius:10, background:th.surface, border:`1px solid ${th.border}` }}>
          <span style={{ fontSize:"0.8rem", color:th.text }}>{l.name}</span>
          <span style={{ fontSize:"0.8rem", fontWeight:700, color:th.accent }}>
            {l.cost.min === 0 && l.cost.max === 0 ? <span style={{ color:th.success }}>{t.free}</span>
              : `${l.cost.currency}${Math.round((l.cost.min+l.cost.max)/2)}`}
          </span>
        </div>
      ))}
      <div style={{ fontSize:"0.75rem", color:th.textMuted, marginTop:4 }}>{t.budgetExtras}</div>
      {extras.map((e,i) => (
        <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input value={e.label} onChange={ev => setExtras(ex => ex.map((x,j) => j===i?{...x,label:ev.target.value}:x))}
            style={{ flex:1, fontSize:"0.75rem", padding:"4px 8px", borderRadius:8,
              background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <input type="number" value={e.amount} onChange={ev => setExtras(ex => ex.map((x,j) => j===i?{...x,amount:ev.target.value}:x))}
            style={{ width:70, fontSize:"0.75rem", padding:"4px 8px", borderRadius:8,
              background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <button onClick={() => setExtras(ex => ex.filter((_,j) => j!==i))}
            style={{ color:th.warning, background:"none", border:"none", cursor:"pointer", fontSize:"1rem" }}>×</button>
        </div>
      ))}
      <div style={{ display:"flex", gap:8 }}>
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label"
          style={{ flex:1, fontSize:"0.75rem", padding:"4px 8px", borderRadius:8,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="€"
          style={{ width:70, fontSize:"0.75rem", padding:"4px 8px", borderRadius:8,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={() => { if(newLabel) { setExtras(ex => [...ex,{label:newLabel,amount:Number(newAmount)||0}]); setNewLabel(""); setNewAmount(""); } }}
          className="btn-primary"
          style={{ padding:"4px 10px", borderRadius:8, background:th.accent, color:"white",
            border:"none", cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}>+</button>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", borderRadius:10,
        background:th.accentLight, border:`1px solid ${th.border}`, marginTop:4 }}>
        <span style={{ fontWeight:800, color:th.accent }}>{t.budgetTotal}</span>
        <span style={{ fontWeight:800, color:th.accent }}>€{Math.round(total)}</span>
      </div>
      <div style={{ fontSize:"0.65rem", color:th.textFaint }}>{t.budgetNote}</div>
    </div>
  );
}

function SavedPlans({ locations, cityId, tripDays, locationDays, locationNotes, t, onLoad }) {
  const { th } = useTheme();
  const [plans, setPlans] = useState(() => {
      const raw = safeJsonParse(localStorage.getItem("travelPlans_v2"), []);
      return (Array.isArray(raw) ? raw : []).filter(Boolean);
    });
  const [planName, setPlanName] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  const save = () => {
    if (!planName.trim()) return;
    const plan = { id:Date.now(), name:planName.trim(), cityId, tripDays, locations, locationDays, locationNotes };
    const next = [plan, ...plans.slice(0,9)];
    setPlans(next);
    localStorage.setItem("travelPlans_v2", JSON.stringify(next));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
    setPlanName("");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", gap:8 }}>
        <input value={planName} onChange={e => setPlanName(e.target.value)} placeholder={t.planNamePlaceholder}
          style={{ flex:1, fontSize:"0.8rem", padding:"6px 10px", borderRadius:10,
            background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={save} className="btn-primary"
          style={{ padding:"6px 14px", borderRadius:10, background:th.accent, color:"white",
            border:"none", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>
          {savedMsg ? t.saved : t.save}
        </button>
      </div>
      {(plans || []).filter(Boolean).length === 0 ? (
        <div style={{ color:th.textFaint, fontSize:"0.8rem" }}>{t.noPlans}</div>
      ) : (plans || []).filter(Boolean).map(p => (
        <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"8px 12px", borderRadius:10, background:th.surface, border:`1px solid ${th.border}` }}>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.8rem", color:th.text }}>{p.name}</div>
            <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{CITIES[p.cityId]?.name || p.cityId} · {p.locations?.length||0} {t.places}</div>
          </div>
          <button onClick={() => onLoad && onLoad(p)}
            style={{ padding:"4px 10px", borderRadius:8, background:th.accentLight, color:th.accent,
              border:`1px solid ${th.border}`, cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}>
            {t.load}
          </button>
        </div>
      ))}
    </div>
  );
}

function SharePanel({ locations, cityId, t }) {
  const { th } = useTheme();
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const createLink = () => {
    const data = { cityId, locs: locations.map(l => ({ n:l.name, t:l.type, a:l.area })) };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    setLink(`${window.location.origin}?plan=${encoded}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <button onClick={createLink} className="btn-primary"
        style={{ padding:"8px 16px", borderRadius:10, background:th.accent, color:"white",
          border:"none", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>
        {t.createLink}
      </button>
      {link && (
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ flex:1, fontSize:"0.72rem", padding:"6px 10px", borderRadius:10,
            background:th.input, color:th.textMuted, border:`1px solid ${th.inputBorder}`,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link}</div>
          <button onClick={copyLink} className="btn-primary"
            style={{ padding:"6px 12px", borderRadius:10, background:th.accent, color:"white",
              border:"none", cursor:"pointer", fontSize:"0.75rem", fontWeight:700, whiteSpace:"nowrap" }}>
            {copied ? t.copied : t.copy}
          </button>
        </div>
      )}
      <div style={{ fontSize:"0.7rem", color:th.textFaint }}>{t.shareHint}</div>
    </div>
  );
}

export default function App() {
  const { mode, th } = useTheme();
  const [lang, setLang] = useState("de");
  const t = TRANSLATIONS[lang];

  const [cityId, setCityId] = useState("paris");
  const [customCities, setCustomCities] = useState({});
  const [customCityName, setCustomCityName] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const allCities = { ...CITIES, ...customCities };
  const city = allCities[cityId] || CITIES.paris;

  const [locations, setLocations] = useState([]);
  const [locationDays, setLocationDays] = useState({});
  const [locationNotes, setLocationNotes] = useState({});
  const [linkInput, setLinkInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [filterDay, setFilterDay] = useState(null);
  const [travelMode, setTravelMode] = useState("transit");
  const [viewTab, setViewTab] = useState("route");
  const [dragIdx, setDragIdx] = useState(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("oai_key") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiSaved, setApiSaved] = useState(false);
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  const today = new Date().toISOString().slice(0,10);
  const [startDate, setStartDate] = useState(today);
  const [numDays, setNumDays] = useState(4);
  const tripDays = generateTripDays(startDate, numDays);

  const getDayLabel = (d) => formatDateLabel(d, lang);

  const locWithDays = locations.map(l => ({
    ...l,
    _day: locationDays[l.id] || null,
    note: locationNotes[l.id] || "",
  }));

  const filteredLocs = filterDay
    ? locWithDays.filter(l => l._day === filterDay)
    : locWithDays;

  const closedWarnings = locWithDays.filter(l => {
    if (!l._day) return false;
    const info = getOpeningInfo(l.name, l._day, city);
    return info && !info.isOpen;
  });

  const analyzeLink = async () => {
    const url = linkInput.trim();
    if (!url) { setError(t.errorEmpty); return; }
    setError("");
    setAnalyzing(true);
    setSkeletonVisible(true);

    if (apiKey) {
      try {
        const result = await analyzeWithAI(url, apiKey, city.name);
        const newLoc = { ...result, id: Date.now() };
        setLocations(prev => [...prev, newLoc]);
        setLinkInput("");
        setSkeletonVisible(false);
        setAnalyzing(false);
        return;
      } catch (e) {
        console.warn("AI failed, falling back:", e);
      }
    }

    await new Promise(r => setTimeout(r, 900));
    const matcher = city.linkMatchers?.find(m => m.pattern.test(url));
    if (matcher) {
      const sample = city.sampleLocations[matcher.locationIndex];
      if (sample) {
        setLocations(prev => [...prev, { ...sample, id: Date.now() }]);
        setLinkInput("");
        setSkeletonVisible(false);
        setAnalyzing(false);
        return;
      }
    }
    setError(t.errorNotFound);
    setSkeletonVisible(false);
    setAnalyzing(false);
  };

  const addDemo = (idx) => {
    const sample = city.sampleLocations[idx];
    if (!sample) return;
    if (locations.find(l => l.name === sample.name)) return;
    setLocations(prev => [...prev, { ...sample, id: Date.now() }]);
  };

  const removeLocation = (id) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    setLocationDays(prev => { const n = {...prev}; delete n[id]; return n; });
    setLocationNotes(prev => { const n = {...prev}; delete n[id]; return n; });
  };

  const handleDayChange = (id, day) => setLocationDays(prev => ({ ...prev, [id]: day || null }));
  const handleNoteChange = (id, note) => setLocationNotes(prev => ({ ...prev, [id]: note }));

  const handleDragStart = (i) => setDragIdx(i);
  const handleDragOver = (e, i) => { e.preventDefault(); };
  const handleDrop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...locations];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setLocations(next);
    setDragIdx(null);
  };

  const addCustomCity = async () => {
    const name = customCityName.trim();
    if (!name) return;
    setGeocoding(true);
    const geo = await geocodeCity(name);
    const id = name.toLowerCase().replace(/\s+/g,"_");
    const newCity = {
      id, name, emoji:"🌍", country: geo?.country || "🌐",
      lat: geo?.lat || 48.8566, lng: geo?.lng || 2.3522,
      timezone: geo?.timezone || "Europe/Berlin",
      sampleLocations: [], demoLinks: [], linkMatchers: [],
      entryCosts: {}, ratings: {}, locationInfo: {}, openingHours: {}, metroLines: {},
    };
    setCustomCities(prev => ({ ...prev, [id]: newCity }));
    setCityId(id);
    setCustomCityName("");
    setAddingCustom(false);
    setShowCityPicker(false);
    setGeocoding(false);
  };

  const saveApiKey = () => {
    localStorage.setItem("oai_key", apiKeyInput);
    setApiKey(apiKeyInput);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  return (
    <div style={{ minHeight:"100vh", background:th.bg, transition:"background 0.3s" }}>
      {/* NAVBAR */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:th.navBg, backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${th.border}`,
        padding:"0 16px", height:52,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:"1.3rem" }}>{city.emoji}</span>
          <span style={{ fontWeight:900, fontSize:"0.95rem", color:th.accent }}>{t.appName}</span>
          <button onClick={() => setShowCityPicker(v => !v)}
            style={{ fontSize:"0.72rem", padding:"3px 10px", borderRadius:20,
              background:th.accentLight, color:th.accent, border:`1px solid ${th.border}`,
              cursor:"pointer", fontWeight:700 }}>
            {city.country} {city.name}
          </button>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => setShowApiPanel(v => !v)}
            style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8,
              background:apiKey?th.successBg:th.warningBg, color:apiKey?th.success:th.warning,
              border:`1px solid ${apiKey?th.success:th.warning}22`, cursor:"pointer" }}>
            {apiKey ? t.apiActive : t.apiMissing}
          </button>
          <button onClick={() => setLang(l => l === "de" ? "en" : "de")}
            style={{ fontSize:"0.72rem", padding:"3px 10px", borderRadius:20,
              background:th.tag, color:th.tagText, border:`1px solid ${th.border}`,
              cursor:"pointer", fontWeight:800 }}>
            {lang === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
          </button>
          <button onClick={toggleTheme} className="theme-toggle-btn"
            style={{ width:34, height:34, borderRadius:"50%", border:`1px solid ${th.border}`,
              background:th.card, color:th.text, cursor:"pointer", fontSize:"1rem",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* CITY PICKER */}
      {showCityPicker && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}
          onClick={() => setShowCityPicker(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:20,
              padding:20, width:"min(400px,92vw)", maxHeight:"80vh", overflowY:"auto",
              boxShadow:th.shadow }}>
            <h3 style={{ color:th.accent, fontWeight:900, margin:"0 0 14px", fontSize:"1rem" }}>{t.selectCity}</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {CITY_ORDER.map(cid => {
                const c = allCities[cid];
                if (!c) return null;
                const active = cid === cityId;
                return (
                  <button key={cid} onClick={() => { setCityId(cid); setShowCityPicker(false); }}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                      borderRadius:12, border:`1px solid ${active?th.accent:th.border}`,
                      background:active?th.accentLight:th.card, cursor:"pointer",
                      color:active?th.accent:th.text, fontWeight:active?800:500, fontSize:"0.82rem" }}>
                    <span style={{ fontSize:"1.2rem" }}>{c.emoji}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
              {Object.keys(customCities).map(cid => {
                const c = customCities[cid];
                const active = cid === cityId;
                return (
                  <button key={cid} onClick={() => { setCityId(cid); setShowCityPicker(false); }}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
                      borderRadius:12, border:`1px solid ${active?th.accent:th.border}`,
                      background:active?th.accentLight:th.card, cursor:"pointer",
                      color:active?th.accent:th.text, fontWeight:active?800:500, fontSize:"0.82rem" }}>
                    <span style={{ fontSize:"1.2rem" }}>{c.emoji}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop:12 }}>
              {!addingCustom ? (
                <button onClick={() => setAddingCustom(true)}
                  style={{ width:"100%", padding:"8px", borderRadius:10, border:`1px dashed ${th.border}`,
                    background:"transparent", color:th.textMuted, cursor:"pointer", fontSize:"0.8rem" }}>
                  {t.customCity}
                </button>
              ) : (
                <div style={{ display:"flex", gap:8 }}>
                  <input value={customCityName} onChange={e => setCustomCityName(e.target.value)}
                    placeholder={t.customCityPlaceholder} onKeyDown={e => e.key==="Enter" && addCustomCity()}
                    style={{ flex:1, fontSize:"0.8rem", padding:"6px 10px", borderRadius:10,
                      background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
                  <button onClick={addCustomCity} disabled={geocoding}
                    style={{ padding:"6px 12px", borderRadius:10, background:th.accent, color:"white",
                      border:"none", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>
                    {geocoding ? "..." : t.customCityAdd}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API PANEL */}
      {showApiPanel && (
        <div style={{ margin:"8px 16px", padding:"12px 16px", borderRadius:14,
          background:th.card, border:`1px solid ${th.border}`, boxShadow:th.shadow }}>
          <div style={{ fontWeight:700, fontSize:"0.85rem", color:th.accent, marginBottom:8 }}>{t.apiTitle}</div>
          <div style={{ display:"flex", gap:8 }}>
            <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)}
              placeholder="sk-..." style={{ flex:1, fontSize:"0.8rem", padding:"6px 10px", borderRadius:10,
                background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            <button onClick={saveApiKey} className="btn-primary"
              style={{ padding:"6px 12px", borderRadius:10, background:th.accent, color:"white",
                border:"none", cursor:"pointer", fontSize:"0.8rem", fontWeight:700 }}>
              {apiSaved ? t.apiSaved : t.apiSave}
            </button>
            {apiKey && (
              <button onClick={() => { localStorage.removeItem("oai_key"); setApiKey(""); setApiKeyInput(""); }}
                style={{ padding:"6px 10px", borderRadius:10, background:th.warningBg, color:th.warning,
                  border:`1px solid ${th.warning}22`, cursor:"pointer", fontSize:"0.8rem" }}>
                {t.apiDelete}
              </button>
            )}
          </div>
          <div style={{ fontSize:"0.68rem", color:th.textFaint, marginTop:6 }}>{t.apiHint}</div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth:700, margin:"0 auto", padding:"16px", display:"flex", flexDirection:"column", gap:14 }}>

        {/* CLOSED WARNINGS */}
        {closedWarnings.length > 0 && (
          <div style={{ padding:"10px 14px", borderRadius:12, background:th.warningBg,
            border:`1px solid ${th.warning}44`, color:th.warning, fontSize:"0.8rem", fontWeight:600 }}>
            ⚠️ {t.warningTitle}: {closedWarnings.map(l => l.name).join(", ")} {t.warningClosed}
            <div style={{ fontWeight:400, fontSize:"0.72rem", marginTop:4, color:th.warning }}>{t.warningHint}</div>
          </div>
        )}

        {/* TRIP SETTINGS */}
        <CollapsibleSection title={t.sectionTrip} defaultOpen={true}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.labelStartDate}</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                style={{ fontSize:"0.8rem", padding:"5px 10px", borderRadius:10,
                  background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              <label style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.labelDays}</label>
              <input type="number" min={1} max={30} value={numDays} onChange={e => setNumDays(Math.max(1,parseInt(e.target.value)||1))}
                style={{ width:70, fontSize:"0.8rem", padding:"5px 10px", borderRadius:10,
                  background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            </div>
            <div style={{ fontSize:"0.72rem", color:th.textMuted, alignSelf:"flex-end", paddingBottom:6 }}>
              {tripDays.length} {t.labelDaysSuffix} · {getDayLabel(tripDays[0])} – {getDayLabel(tripDays[tripDays.length-1])}
            </div>
          </div>
        </CollapsibleSection>

        {/* ADD PLACE */}
        <CollapsibleSection title={`➕ ${t.addPlace}`} defaultOpen={true}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:"0.72rem", color:th.textMuted, fontWeight:700, letterSpacing:"0.05em" }}>{t.insertLink}</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={linkInput} onChange={e => setLinkInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyzeLink()}
                placeholder={t.linkPlaceholder}
                style={{ flex:1, fontSize:"0.82rem", padding:"8px 12px", borderRadius:12,
                  background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`,
                  outline:"none" }} />
              <button onClick={analyzeLink} disabled={analyzing} className="btn-primary"
                style={{ padding:"8px 16px", borderRadius:12, background:th.accent, color:"white",
                  border:"none", cursor:"pointer", fontSize:"0.82rem", fontWeight:800,
                  display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap" }}>
                {analyzing ? <><Spinner size={14} color="white" /> {t.analyzing}</> : t.analyze}
              </button>
            </div>
            {error && <div style={{ fontSize:"0.75rem", color:th.warning }}>{error}</div>}
            {skeletonVisible && <SkeletonCard th={th} />}
            {city.sampleLocations?.length > 0 && (
              <div>
                <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:6 }}>{t.demo}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {city.sampleLocations.map((loc, i) => (
                    <button key={i} onClick={() => addDemo(i)}
                      style={{ fontSize:"0.72rem", padding:"4px 10px", borderRadius:20,
                        background:th.tag, color:th.tagText, border:`1px solid ${th.border}`,
                        cursor:"pointer" }}>
                      {loc.icon} {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* LOCATIONS */}
        <CollapsibleSection title={`📍 ${t.myPlaces}`} badge={locations.length} defaultOpen={true}
          rightContent={
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => setFilterDay(null)}
                className="tab-btn"
                style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:20,
                  background:!filterDay?th.accent:"transparent",
                  color:!filterDay?"white":th.textMuted,
                  border:`1px solid ${!filterDay?th.accent:th.border}`, cursor:"pointer" }}>
                {t.allDays}
              </button>
              {tripDays.map(d => (
                <button key={d} onClick={() => setFilterDay(d === filterDay ? null : d)}
                  className="tab-btn"
                  style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:20,
                    background:filterDay===d?th.accent:"transparent",
                    color:filterDay===d?"white":th.textMuted,
                    border:`1px solid ${filterDay===d?th.accent:th.border}`, cursor:"pointer",
                    whiteSpace:"nowrap" }}>
                  {getDayLabel(d)}
                </button>
              ))}
            </div>
          }>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {filteredLocs.length === 0 ? (
              <div style={{ color:th.textFaint, fontSize:"0.8rem", textAlign:"center", padding:"16px 0" }}>{t.addFirst}</div>
            ) : filteredLocs.map((loc, i) => (
              <div key={loc.id}>
                <LocationCard
                  loc={loc} day={loc._day} index={i}
                  onRemove={removeLocation}
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={() => handleDrop(i)}
                  isDragging={dragIdx === i}
                  city={city}
                  onDayChange={handleDayChange}
                  onNoteChange={handleNoteChange}
                  availableDays={tripDays}
                  t={t}
                  getDayLabel={getDayLabel}
                />
                {i < filteredLocs.length - 1 && (
                  <TravelTimeBadge from={loc} to={filteredLocs[i+1]} />
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* MAP */}
        <CollapsibleSection title={t.sectionMap} defaultOpen={true}>
          <MapView locations={filteredLocs} city={city} />
        </CollapsibleSection>

        {/* ROUTE / TIMELINE */}
        <CollapsibleSection title={t.sectionRoute} defaultOpen={false}
          rightContent={
            <div style={{ display:"flex", gap:4 }}>
              {["route","timeline"].map(tab => (
                <button key={tab} onClick={() => setViewTab(tab)} className="tab-btn"
                  style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:20,
                    background:viewTab===tab?th.accent:"transparent",
                    color:viewTab===tab?"white":th.textMuted,
                    border:`1px solid ${viewTab===tab?th.accent:th.border}`, cursor:"pointer" }}>
                  {tab === "route" ? t.route : t.timeline}
                </button>
              ))}
            </div>
          }>
          <div>
            <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontSize:"0.72rem", color:th.textMuted, alignSelf:"center" }}>{t.travelMode}:</span>
              {[["walking",t.walking],["transit",t.transit],["driving",t.driving]].map(([mode, label]) => (
                <button key={mode} onClick={() => setTravelMode(mode)} className="tab-btn"
                  style={{ fontSize:"0.72rem", padding:"3px 10px", borderRadius:20,
                    background:travelMode===mode?th.accent:"transparent",
                    color:travelMode===mode?"white":th.textMuted,
                    border:`1px solid ${travelMode===mode?th.accent:th.border}`, cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>
            {viewTab === "route" ? (
              <RouteView locations={filteredLocs} city={city} travelMode={travelMode} t={t} />
            ) : (
              <TimelineView locations={filteredLocs} day={filterDay} city={city} travelMode={travelMode} t={t} />
            )}
          </div>
        </CollapsibleSection>

        {/* BUDGET */}
        <CollapsibleSection title={`💰 ${t.budgetTitle}`} defaultOpen={false}>
          <BudgetTracker locations={locations} city={city} t={t} />
        </CollapsibleSection>

        {/* SHARE */}
        <CollapsibleSection title={`${t.share}`} defaultOpen={false}>
          <SharePanel locations={locations} cityId={cityId} t={t} />
        </CollapsibleSection>

        {/* SAVED PLANS */}
        <CollapsibleSection title={`💾 ${t.savedPlans}`} defaultOpen={false}>
          <SavedPlans
              locations={locations} cityId={cityId}
              tripDays={tripDays} locationDays={locationDays} locationNotes={locationNotes}
              t={t}
              onLoad={(p) => {
                const plan = normalizePlan(p);
                if (!plan) return;
                setCityId(plan.cityId);
                setLocations(plan.locations.map(l => ({ ...l, id: l.id ?? Date.now() + Math.random() })));
                setLocationDays(plan.locationDays);
                setLocationNotes(plan.locationNotes);
                setStartDate(plan.startDate);
                setNumDays(plan.numDays);
                setFilterDay(null);
              }}
            />
        </CollapsibleSection>

        {/* FOOTER */}
        <div style={{ textAlign:"center", padding:"16px 0 8px",
          fontSize:"0.72rem", color:th.textFaint, borderTop:`1px solid ${th.border}` }}>
          {t.footerText} · {city.emoji} {city.name} · {mode === "dark" ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  );
}
