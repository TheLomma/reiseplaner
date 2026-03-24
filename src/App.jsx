import { useState, useEffect, useRef } from "react";

// ── Translations ──
const TRANSLATIONS = {
  de: {
    appName: "Reiseplaner",
    addPlace: "Ort hinzufügen",
    insertLink: "LINK EINFÜGEN",
    linkPlaceholder: "https://maps.google.com/... oder Website-URL",
    analyze: "Analysieren",
    analyzing: "Analyse...",
    visitDay: "BESUCHSTAG",
    demo: "Demo-Beispiele – diese Links werden erkannt:",
    myPlaces: "Alle Orte",
    allDays: "Alle Tage",
    dragHint: "↕ ziehen zum sortieren",
    route: "Route",
    timeline: "Timeline",
    pdf: "PDF",
    travelMode: "FORTBEWEGUNGSMITTEL",
    walking: "🚶 Zu Fuß",
    transit: "🚇 ÖPNV + Fuß",
    driving: "🚗 Auto + Fuß",
    openInMaps: "In Google Maps öffnen",
    stops: "Stopps",
    timelineTitle: "TAGESPLAN – TIMELINE (ab 09:00 Uhr)",
    transfer: "+20 Min. Transfer",
    infoShow: "▼ Info & Highlights",
    infoHide: "▲ Info ausblenden",
    openedAt: "Geöffnet",
    closedDay: "Geschlossen an diesem Tag",
    unknownHours: "⏰ Öffnungszeiten unbekannt – bitte vorab prüfen",
    reviews: "Bewertungen",
    budgetTitle: "Budget-Tracker",
    budgetTotal: "Gesamt",
    budgetDetails: "Details",
    budgetExtras: "+ Extras (Essen, Shopping...):",
    budgetNote: "* Eintrittspreise sind Schätzungen. Bitte offizielle Website prüfen.",
    savePlans: "Reisepläne",
    savedPlans: "Gespeicherte Pläne",
    planNamePlaceholder: "Planname z.B. Paris-Wochenende...",
    save: "💾 Speichern",
    saved: "✅ Gespeichert!",
    load: "Laden",
    noPlans: "Noch keine Pläne gespeichert.",
    addFirst: "Füge Orte hinzu, um einen Plan zu speichern.",
    share: "🤝 Reiseplan teilen",
    createLink: "🔗 Link erstellen",
    shareHint: "Teile diesen Link mit deinen Reisebegleitern – sie sehen deinen kompletten Plan sofort:",
    copy: "📋 Kopieren",
    copied: "✅ Kopiert!",
    warningTitle: "Achtung",
    warningClosed: "ist an dem gewählten Tag geschlossen!",
    warningHint: "Bitte ändere den Besuchstag oder wähle einen anderen Ort.",
    closed: "geschlossen",
    apiActive: "✅ API aktiv",
    apiMissing: "⚠️ API-Key fehlt",
    apiTitle: "🔐 OpenAI API-Key",
    apiHint: "Dein Key wird nur lokal in deinem Browser gespeichert und nie übertragen.",
    apiSave: "Speichern",
    apiSaved: "✅ Gespeichert!",
    apiDelete: "🗑️ Key löschen",
    footerText: "Reiseplaner · Powered by KI",
    citiesMore: "Weitere Städte folgen",
    noRouteHint: "Füge mindestens einen weiteren Ort hinzu, um eine Route zu berechnen.",
    errorEmpty: "Bitte gib einen Link ein.",
    errorNotFound: "Link nicht erkannt. Tipp: API-Key eingeben für echte Analyse!",
    days: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    admission: "Eintritt",
    free: "Kostenlos",
    close: "Schließen",
    places: "Orte",
    helpTitle: "📖 Anleitung",
    helpButton: "❓ Wie funktioniert die App?",
    helpClose: "Schließen",
    helpIntro: "Willkommen beim Reiseplaner! Hier findest du eine Übersicht aller Funktionen:",
    helpAddPlace: "🔗 Ort hinzufügen",
    helpAddPlaceDesc: "Füge einen Google-Maps-Link oder eine Website-URL in das Eingabefeld ein und klicke auf \"Analysieren\". Der Ort wird automatisch erkannt und zu deiner Liste hinzugefügt. Wähle vorher den gewünschten Besuchstag aus.",
    helpPlaces: "📍 Alle Orte",
    helpPlacesDesc: "Zeigt alle hinzugefügten Orte als Karten an. Du kannst sie per Drag & Drop umsortieren, nach Tagen filtern und einzelne Orte entfernen. Jede Karte zeigt Bewertungen, Öffnungszeiten und Highlights.",
    helpRoute: "🗺️ Route",
    helpRouteDesc: "Berechnet eine Route zwischen allen Orten und zeigt sie auf einer interaktiven Karte an. Wähle zwischen Zu Fuß, ÖPNV oder Auto. Du kannst die Route direkt in Google Maps öffnen.",
    helpTimeline: "📅 Timeline",
    helpTimelineDesc: "Erstellt einen Tagesplan ab 09:00 Uhr mit automatisch berechneten Zeiten und 20 Minuten Transfer zwischen den Orten.",
    helpPDF: "📄 PDF-Export",
    helpPDFDesc: "Exportiert deinen kompletten Reiseplan als druckbare PDF-Datei mit allen Orten und Details.",
    helpBudget: "💰 Budget-Tracker",
    helpBudgetDesc: "Zeigt geschätzte Eintrittspreise für jeden Ort. Du kannst zusätzliche Kosten (Essen, Shopping) pro Ort eingeben. Die Gesamtsumme wird automatisch berechnet.",
    helpSave: "📋 Reisepläne speichern",
    helpSaveDesc: "Speichere deinen aktuellen Plan unter einem Namen. Gespeicherte Pläne bleiben in deinem Browser erhalten und können jederzeit geladen werden (max. 10 Pläne).",
    helpShare: "🤝 Plan teilen",
    helpShareDesc: "Erstelle einen teilbaren Link, den du an Reisebegleiter senden kannst. Sie sehen deinen kompletten Plan sofort im Browser.",
    helpAPI: "🔐 OpenAI API-Key",
    helpAPIDesc: "Ohne API-Key funktioniert die App im Demo-Modus und erkennt nur die 3 Beispiel-Links. Mit einem API-Key werden beliebige Links per KI analysiert.",
    helpAPISetup: "So richtest du den API-Key ein:",
    helpAPIStep1: "1. Gehe zu platform.openai.com und erstelle ein Konto.",
    helpAPIStep2: "2. Navigiere zu \"API Keys\" im Dashboard.",
    helpAPIStep3: "3. Klicke auf \"Create new secret key\" und kopiere den Key.",
    helpAPIStep4: "4. Füge den Key oben rechts über das \"⚠️ API-Key fehlt\"-Feld ein.",
    helpAPINote: "Dein Key wird nur lokal in deinem Browser gespeichert und niemals an unsere Server übertragen. Es fallen Kosten bei OpenAI an (ca. 0,01 € pro Analyse).",
    helpWeather: "🌤️ Wetter-Widget",
    helpWeatherDesc: "Zeigt das aktuelle Wetter in Paris mit Temperatur, Wind und einem passenden Tipp für deine Aktivitäten.",
    helpWarnings: "⚠️ Warnungen",
    helpWarningsDesc: "Falls ein Ort am gewählten Besuchstag geschlossen ist, erscheint automatisch eine Warnung mit einem Hinweis, den Tag zu ändern.",
  },
  en: {
    appName: "Travel Planner",
    addPlace: "Add Place",
    insertLink: "INSERT LINK",
    linkPlaceholder: "https://maps.google.com/... or website URL",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    visitDay: "VISIT DAY",
    demo: "Demo examples – these links are recognized:",
    myPlaces: "All Places",
    allDays: "All Days",
    dragHint: "↕ drag to sort",
    route: "Route",
    timeline: "Timeline",
    pdf: "PDF",
    travelMode: "TRAVEL MODE",
    walking: "🚶 Walking",
    transit: "🚇 Transit + Walk",
    driving: "🚗 Car + Walk",
    openInMaps: "Open in Google Maps",
    stops: "Stops",
    timelineTitle: "DAY PLAN – TIMELINE (from 09:00)",
    transfer: "+20 min transfer",
    infoShow: "▼ Info & Highlights",
    infoHide: "▲ Hide info",
    openedAt: "Open",
    closedDay: "Closed on this day",
    unknownHours: "⏰ Opening hours unknown – please check in advance",
    reviews: "reviews",
    budgetTitle: "Budget Tracker",
    budgetTotal: "Total",
    budgetDetails: "Details",
    budgetExtras: "+ Extras (food, shopping...):",
    budgetNote: "* Admission prices are estimates. Please check the official website.",
    savePlans: "Travel Plans",
    savedPlans: "Saved Plans",
    planNamePlaceholder: "Plan name e.g. Paris Weekend...",
    save: "💾 Save",
    saved: "✅ Saved!",
    load: "Load",
    noPlans: "No plans saved yet.",
    addFirst: "Add places to save a plan.",
    share: "🤝 Share Travel Plan",
    createLink: "🔗 Create Link",
    shareHint: "Share this link with your travel companions – they'll see your complete plan instantly:",
    copy: "📋 Copy",
    copied: "✅ Copied!",
    warningTitle: "Attention",
    warningClosed: "is closed on the selected day!",
    warningHint: "Please change the visit day or choose a different place.",
    closed: "closed",
    apiActive: "✅ API active",
    apiMissing: "⚠️ API Key missing",
    apiTitle: "🔐 OpenAI API Key",
    apiHint: "Your key is stored locally in your browser and never transmitted.",
    apiSave: "Save",
    apiSaved: "✅ Saved!",
    apiDelete: "🗑️ Delete key",
    footerText: "Travel Planner · Powered by AI",
    citiesMore: "More cities coming soon",
    noRouteHint: "Add at least one more place to calculate a route.",
    errorEmpty: "Please enter a link.",
    errorNotFound: "Link not recognized. Tip: Enter an API key for real analysis!",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    admission: "Admission",
    free: "Free",
    close: "Close",
    places: "Places",
    helpTitle: "📖 Guide",
    helpButton: "❓ How does the app work?",
    helpClose: "Close",
    helpIntro: "Welcome to the Travel Planner! Here's an overview of all features:",
    helpAddPlace: "🔗 Add Place",
    helpAddPlaceDesc: "Paste a Google Maps link or website URL into the input field and click \"Analyze\". The place will be automatically recognized and added to your list. Select the desired visit day beforehand.",
    helpPlaces: "📍 All Places",
    helpPlacesDesc: "Shows all added places as cards. You can reorder them via drag & drop, filter by day, and remove individual places. Each card shows ratings, opening hours, and highlights.",
    helpRoute: "🗺️ Route",
    helpRouteDesc: "Calculates a route between all places and displays it on an interactive map. Choose between walking, transit, or driving. You can open the route directly in Google Maps.",
    helpTimeline: "📅 Timeline",
    helpTimelineDesc: "Creates a day plan starting at 09:00 with automatically calculated times and 20-minute transfers between places.",
    helpPDF: "📄 PDF Export",
    helpPDFDesc: "Exports your complete travel plan as a printable PDF file with all places and details.",
    helpBudget: "💰 Budget Tracker",
    helpBudgetDesc: "Shows estimated admission prices for each place. You can enter additional costs (food, shopping) per place. The total is calculated automatically.",
    helpSave: "📋 Save Travel Plans",
    helpSaveDesc: "Save your current plan under a name. Saved plans are stored in your browser and can be loaded anytime (max. 10 plans).",
    helpShare: "🤝 Share Plan",
    helpShareDesc: "Create a shareable link that you can send to travel companions. They'll see your complete plan instantly in their browser.",
    helpAPI: "🔐 OpenAI API Key",
    helpAPIDesc: "Without an API key, the app runs in demo mode and only recognizes the 3 example links. With an API key, any link is analyzed by AI.",
    helpAPISetup: "How to set up the API key:",
    helpAPIStep1: "1. Go to platform.openai.com and create an account.",
    helpAPIStep2: "2. Navigate to \"API Keys\" in the dashboard.",
    helpAPIStep3: "3. Click \"Create new secret key\" and copy the key.",
    helpAPIStep4: "4. Paste the key in the \"⚠️ API Key missing\" field at the top right.",
    helpAPINote: "Your key is stored locally in your browser only and never transmitted to our servers. OpenAI charges apply (approx. $0.01 per analysis).",
    helpWeather: "🌤️ Weather Widget",
    helpWeatherDesc: "Shows the current weather in Paris with temperature, wind, and a helpful tip for your activities.",
    helpWarnings: "⚠️ Warnings",
    helpWarningsDesc: "If a place is closed on your selected visit day, a warning will automatically appear suggesting you change the day.",
  }
};
const DAYS_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SAMPLE_LOCATIONS = [
  { id: 1, name: "Eiffelturm", type: "Sehenswürdigkeit", address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris", lat: 48.8584, lng: 2.2945, area: "7. Arrondissement", duration: "1,5 Std.", icon: "✈️" },
  { id: 2, name: "Arc de Triomphe", type: "Sehenswürdigkeit", address: "Pl. Charles de Gaulle, 75008 Paris", lat: 48.8738, lng: 2.295, area: "8. Arrondissement", duration: "1 Std.", icon: "🏛️" },
  { id: 3, name: "Le Grand Véfour", type: "Restaurant", address: "17 Rue de Beaujolais, 75001 Paris", lat: 48.8637, lng: 2.337, area: "1. Arrondissement", duration: "2 Std.", icon: "🍽️" },
];

const ENTRY_COSTS = {
  "Eiffelturm": { min: 11.80, max: 29.40, currency: "€", note: "je nach Etage" },
  "Arc de Triomphe": { min: 13.00, max: 13.00, currency: "€", note: "Erwachsene" },
  "Le Grand Véfour": { min: 80.00, max: 350.00, currency: "€", note: "Mittagsmenü–À la carte" },
  "Louvre": { min: 22.00, max: 22.00, currency: "€", note: "Erwachsene" },
  "Musée d'Orsay": { min: 16.00, max: 16.00, currency: "€", note: "Erwachsene" },
  "Sacré-Cœur": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
  "Notre-Dame": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
  "Palais Royal": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
};

const RATINGS = {
  "Eiffelturm": { stars: 4.8, reviews: 284000, price: "€€", badge: "Weltbekannt" },
  "Arc de Triomphe": { stars: 4.7, reviews: 98000, price: "€€", badge: "Muss man gesehen haben" },
  "Le Grand Véfour": { stars: 4.5, reviews: 1200, price: "€€€€", badge: "Michelin-Stern" },
  "Louvre": { stars: 4.7, reviews: 312000, price: "€€", badge: "Weltbekannt" },
  "Musée d'Orsay": { stars: 4.8, reviews: 76000, price: "€€", badge: "Top-Museum" },
  "Sacré-Cœur": { stars: 4.8, reviews: 134000, price: "Kostenlos", badge: "Geheimtipp" },
  "Notre-Dame": { stars: 4.8, reviews: 220000, price: "Kostenlos", badge: "Ikone" },
  "Palais Royal": { stars: 4.6, reviews: 42000, price: "Kostenlos", badge: "Verstecktes Juwel" },
};

const LOCATION_INFO = {
  "Eiffelturm": { short: "Wahrzeichen von Paris, 330m hoch, 1889 erbaut.", highlights: ["Aussichtsplattform im 2. & 3. Stock", "Abends Lichtshow zur vollen Stunde", "Champ de Mars Picknick davor"], pdf: "Der Eiffelturm wurde 1889 von Gustave Eiffel für die Weltausstellung erbaut." },
  "Arc de Triomphe": { short: "Triumphbogen am Place Charles de Gaulle, 1836 fertiggestellt.", highlights: ["Dachterrasse mit Panoramablick", "Grab des Unbekannten Soldaten", "Blick auf die Champs-Élysées"], pdf: "Der Arc de Triomphe wurde 1836 fertiggestellt." },
  "Le Grand Véfour": { short: "Eines der ältesten Restaurants von Paris, seit 1784.", highlights: ["Historisches Interieur aus dem 18. Jhd.", "Sternküche", "Stammsitz von Napoleon & Victor Hugo"], pdf: "Le Grand Véfour seit 1784 im Palais Royal." },
  "Louvre": { short: "Größtes Kunstmuseum der Welt.", highlights: ["Mona Lisa (Saal 711)", "Venus von Milo", "Glaspyramide im Innenhof"], pdf: "Der Louvre ist das größte Kunstmuseum der Welt." },
  "Musée d'Orsay": { short: "Impressionismus-Museum im ehemaligen Bahnhof.", highlights: ["Van Goghs Sternennacht", "Monets Seerosen-Serie", "Architektur des alten Bahnhofs"], pdf: "Das Musée d'Orsay zeigt impressionistische Kunst." },
  "Sacré-Cœur": { short: "Weiße Basilika auf dem Montmartre-Hügel.", highlights: ["Panoramablick über Paris", "Künstlerviertel Montmartre", "Place du Tertre"], pdf: "Sacré-Cœur thront auf dem Montmartre." },
  "Notre-Dame": { short: "Gotische Kathedrale aus dem 12. Jhd.", highlights: ["Gotische Architektur & Rosenfenster", "Türme & Wasserspeier", "Île de la Cité"], pdf: "Notre-Dame ist eine der bedeutendsten Kathedralen." },
  "Palais Royal": { short: "Historischer Palast mit Arkadengängen.", highlights: ["Jardin du Palais Royal", "Les Deux Plateaux", "Luxusboutiquen"], pdf: "Das Palais Royal wurde im 17. Jahrhundert erbaut." },
};

const OPENING_HOURS = {
  "Eiffelturm": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–23:45", note: "" },
  "Arc de Triomphe": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–23:00", note: "" },
  "Le Grand Véfour": { mo: true, di: true, mi: true, do: true, fr: true, sa: false, so: false, hours: "12:00–14:00, 19:30–22:00", note: "Sa & So geschlossen" },
  "Louvre": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–18:00", note: "Mo geschlossen" },
  "Musée d'Orsay": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:30–18:00", note: "Mo geschlossen" },
  "Sacré-Cœur": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–22:30", note: "" },
  "Notre-Dame": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "08:00–19:00", note: "" },
  "Palais Royal": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "08:00–20:30", note: "" },
};

const DAY_KEY_MAP = { "Montag": "mo", "Dienstag": "di", "Mittwoch": "mi", "Donnerstag": "do", "Freitag": "fr", "Samstag": "sa", "Sonntag": "so" };

const METRO_LINES = {
  "7. Arrondissement -> 8. Arrondissement": { line: "M6", time: "12 min", stops: 3 },
  "8. Arrondissement -> 1. Arrondissement": { line: "M1", time: "18 min", stops: 5 },
  "1. Arrondissement -> 7. Arrondissement": { line: "M14", time: "22 min", stops: 6 },
};

// ── Helper functions ──
function getEntryCost(name) {
  const key = Object.keys(ENTRY_COSTS).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? ENTRY_COSTS[key] : null;
}

function getRating(name) {
  const key = Object.keys(RATINGS).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? RATINGS[key] : null;
}

function getLocationInfo(name) {
  const key = Object.keys(LOCATION_INFO).find(k => name.toLowerCase().includes(k.toLowerCase()));
  return key ? LOCATION_INFO[key] : null;
}

function getOpeningInfo(name, day) {
  const key = Object.keys(OPENING_HOURS).find(k => name.toLowerCase().includes(k.toLowerCase()));
  if (!key) return null;
  const info = OPENING_HOURS[key];
  const dayKey = DAY_KEY_MAP[day];
  const isOpen = dayKey ? info[dayKey] : true;
  return { isOpen, hours: info.hours, note: info.note };
}

async function analyzeWithAI(url, apiKey) {
  const prompt = `Du bist ein Reiseassistent für Paris. Analysiere diesen Link: "${url}"\nExtrahiere (antworte NUR mit JSON):\n{"name":"...","type":"Restaurant|Sehenswürdigkeit|Museum|Park|Bar|Café","address":"...","area":"X. Arrondissement","duration":"...","icon":"emoji","lat":0,"lng":0,"tip":"..."}`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.3 })
  });
  if (!res.ok) throw new Error("API Fehler: " + res.status);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g, "").trim());
}
// ── Reusable Components ──
function CollapsibleSection({ title, badge, rightContent, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#222", border: "1px solid #444" }}>
      <button onClick={() => setOpen(v => !v)} className="w-full px-5 py-3 flex items-center justify-between" style={{ borderBottom: open ? "1px solid #444" : "none", background: "#1a1a1a", cursor: "pointer" }}>
        <h2 className="font-black text-base flex items-center gap-2" style={{ color: "#e74c3c", fontFamily: "Georgia,serif", fontSize: "1.2rem" }}>
          {title}
          {badge !== undefined && <span className="text-xs font-normal" style={{ color: "#666" }}>({badge})</span>}
        </h2>
        <div className="flex items-center gap-2">
          {rightContent}
          <span className="text-xs" style={{ color: "#555" }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

function StarRating({ stars }) {
  const full = Math.floor(stars);
  const half = stars % 1 >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < full ? "#f39c12" : (i === full && half ? "#f39c12" : "#444"), fontSize: "0.7rem" }}>
          {i < full ? "★" : (i === full && half ? "⭐" : "☆")}
        </span>
      ))}
      <span className="ml-1 text-xs font-bold" style={{ color: "#f39c12" }}>{stars}</span>
    </span>
  );
}

function MetroTag({ line, time }) {
  const colors = { M1: "bg-yellow-400 text-yellow-900", M6: "bg-green-500 text-white", M14: "bg-purple-600 text-white", M4: "bg-pink-500 text-white" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${colors[line] || "bg-gray-400 text-white"}`}>
      🚇 {line} · {time}
    </span>
  );
}

function DragHandle() {
  return (
    <div className="cursor-grab active:cursor-grabbing flex flex-col gap-0.5 px-1 py-2 opacity-40 hover:opacity-80" title="Ziehen zum Sortieren">
      {[0, 1, 2].map(i => <div key={i} className="w-4 h-0.5 rounded" style={{ background: "#f0ece0" }}></div>)}
    </div>
  );
}

function LocationCard({ loc, day, onRemove, index, onDragStart, onDragOver, onDrop, isDragging }) {
  const openInfo = day ? getOpeningInfo(loc.name, day) : null;
  const locInfo = getLocationInfo(loc.name);
  const rating = getRating(loc.name);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
      className="relative rounded-xl p-4 transition-all"
      style={{ background: isDragging ? "#3a1a1a" : "#2a2a2a", border: isDragging ? "2px dashed #e74c3c" : "1px solid #444", opacity: isDragging ? 0.5 : 1, cursor: "grab" }}>
      <div className="absolute top-2 left-2 w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</div>
      <button onClick={onRemove} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-lg leading-none">×</button>
      <div className="pl-8 pr-4 flex flex-col">
        <div className="absolute top-1/2 -translate-y-1/2 right-8 opacity-30"><DragHandle /></div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{loc.icon}</span>
          <div>
            <p className="font-bold text-sm" style={{ color: "#f0ece0", fontFamily: "Georgia,serif" }}>{loc.name}</p>
            <p className="text-xs font-semibold" style={{ color: "#e67e22" }}>{loc.type}</p>
          </div>
        </div>
        <p className="text-xs mb-1" style={{ color: "#888", fontStyle: "italic" }}>{loc.address}</p>
        {rating && (
          <div className="flex items-center gap-2 flex-wrap mt-1 mb-1">
            <StarRating stars={rating.stars} />
            <span className="text-xs" style={{ color: "#666" }}>({rating.reviews.toLocaleString("de-DE")} Bewertungen)</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#2a1a3a", color: "#c39bd3", border: "1px solid #6c3483" }}>{rating.badge}</span>
            <span className="text-xs" style={{ color: "#888" }}>{rating.price}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1a2a3a", color: "#5dade2", border: "1px solid #2d5a7a" }}>📍 {loc.area}</span>
          <span className="text-xs" style={{ color: "#888" }}>⏱ {loc.duration}</span>
        </div>
        {day && <p className="text-xs mt-2 font-medium" style={{ color: "#9b59b6" }}>📅 {day}</p>}
        {openInfo ? (
          <div className="mt-2 rounded-lg px-2 py-1.5 flex items-start gap-2" style={openInfo.isOpen ? { background: "#1a2a1a", border: "1px solid #2d5a2d" } : { background: "#2a1a1a", border: "1px solid #7a2d2d" }}>
            <span className="text-xs mt-0.5">{openInfo.isOpen ? "✅" : "⚠️"}</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: openInfo.isOpen ? "#6dbf6d" : "#e74c3c" }}>
                {openInfo.isOpen ? `Geöffnet · ${openInfo.hours}` : "Geschlossen an diesem Tag"}
              </p>
              {openInfo.note && <p className="text-xs" style={{ color: "#888", fontStyle: "italic" }}>{openInfo.note}</p>}
            </div>
          </div>
        ) : (
          <div className="mt-2 rounded-lg px-2 py-1.5" style={{ background: "#2a2a1a", border: "1px solid #5a5a2d" }}>
            <p className="text-xs" style={{ color: "#aaa8", fontStyle: "italic" }}>⏰ Öffnungszeiten unbekannt</p>
          </div>
        )}
        {locInfo && (
          <div className="mt-2">
            <button onClick={() => setShowInfo(v => !v)} className="text-xs font-semibold flex items-center gap-1" style={{ color: showInfo ? "#e74c3c" : "#5dade2" }}>
              {showInfo ? "▲ Info ausblenden" : "▼ Info & Highlights"}
            </button>
            {showInfo && (
              <div className="mt-2 rounded-lg p-3 space-y-2" style={{ background: "#1a1a2a", border: "1px solid #2d2d5a" }}>
                <p className="text-xs" style={{ color: "#ccc" }}>{locInfo.short}</p>
                <ul className="space-y-1">
                  {locInfo.highlights.map((h, i) => (
                    <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: "#5dade2" }}>
                      <span style={{ color: "#e74c3c", flexShrink: 0 }}>✦</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Timeline({ locations }) {
  let currentMinutes = 9 * 60;
  const items = locations.map((loc, i) => {
    const durationMin = Math.round((parseFloat(loc.duration) || 1) * 60);
    const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const start = fmt(currentMinutes);
    const end = fmt(currentMinutes + durationMin);
    const item = { loc, start, end, durationMin };
    currentMinutes += durationMin + 20;
    return item;
  });

  return (
    <div className="space-y-0">
      {items.map(({ loc, start, end, durationMin }, i) => (
        <div key={loc.id} className="flex gap-3">
          <div className="flex flex-col items-center w-16 flex-shrink-0">
            <span className="text-xs font-bold" style={{ color: "#e74c3c" }}>{start}</span>
            <div className="w-0.5 flex-1 my-1" style={{ background: "#444", minHeight: "40px" }}></div>
            <span className="text-xs" style={{ color: "#666" }}>{end}</span>
          </div>
          <div className="flex-1 mb-4 rounded-xl p-3" style={{ background: "#2a2a2a", border: "1px solid #444" }}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{loc.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#f0ece0", fontFamily: "Georgia,serif" }}>{loc.name}</p>
                <p className="text-xs" style={{ color: "#e67e22" }}>{loc.type}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1a2a3a", color: "#5dade2", border: "1px solid #2d5a7a" }}>📍 {loc.area}</span>
              <span className="text-xs" style={{ color: "#888" }}>⏱ {durationMin} Min.</span>
              {i < items.length - 1 && <span className="text-xs" style={{ color: "#555" }}>🚶 +20 Min. Transfer</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
// ── Weather Hook ──
function useWeather() {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe/Paris")
      .then(r => r.json())
      .then(d => {
        const code = d.current.weathercode;
        const temp = d.current.temperature_2m;
        const wind = d.current.windspeed_10m;
        let icon = "🌤️", desc = "Teilweise bewölkt", tip = "Leichte Jacke empfohlen.";
        if (code === 0) { icon = "☀️"; desc = "Sonnig"; tip = "Perfektes Wetter! ☀️"; }
        else if (code <= 2) { icon = "🌤️"; desc = "Überwiegend sonnig"; tip = "Ideal für Spaziergänge."; }
        else if (code <= 48) { icon = "🌫️"; desc = "Bewölkt/Neblig"; tip = "Guter Tag für Museen!"; }
        else if (code <= 67) { icon = "🌧️"; desc = "Regen"; tip = "Regenschirm einpacken!"; }
        else if (code <= 77) { icon = "❄️"; desc = "Schnee"; tip = "Warme Kleidung!"; }
        else { icon = "⛈️"; desc = "Gewitter"; tip = "Lieber Museen besuchen."; }
        setWeather({ temp, wind, icon, desc, tip });
      })
      .catch(() => setWeather(null));
  }, []);
  return weather;
}

// ── Leaflet Map Hook ──
function useLeaflet(locations, showRoute) {
  const mapInstanceRef = useRef(null);
  useEffect(() => {
    if (!showRoute || locations.length < 2) return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const initMap = () => {
      if (!window.L) return;
      const container = document.getElementById("paris-map");
      if (!container) return;
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      const avgLat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
      const avgLng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;
      const map = window.L.map("paris-map").setView([avgLat, avgLng], 13);
      mapInstanceRef.current = map;
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
      const latlngs = [];
      locations.forEach((loc, i) => {
        const icon = window.L.divIcon({
          html: `<div style="background:#c0392b;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:13px;border:2px solid #fff;box-shadow:0 2px 6px #0006">${i + 1}</div>`,
          className: "", iconSize: [28, 28], iconAnchor: [14, 14]
        });
        window.L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(`<b>${loc.icon} ${loc.name}</b><br/>${loc.address}`);
        latlngs.push([loc.lat, loc.lng]);
      });
      window.L.polyline(latlngs, { color: "#c0392b", weight: 3, dashArray: "8,6" }).addTo(map);
      map.fitBounds(latlngs, { padding: [40, 40] });
    };
    if (window.L) initMap();
    else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [showRoute, locations]);
}
// ── Main App ──
export default function ParisTravelPlanner() {
  const [lang, setLang] = useState(() => localStorage.getItem("reiseplaner_lang") || "de");
  const t = TRANSLATIONS[lang];
  const DAYS_CURRENT = lang === "de" ? DAYS_DE : DAYS_EN;

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("paris_openai_key") || "");
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [selectedDay, setSelectedDay] = useState("Samstag");
  const [locations, setLocations] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [showRoute, setShowRoute] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [travelMode, setTravelMode] = useState("transit");
  const [draggingId, setDraggingId] = useState(null);
  const [extraBudget, setExtraBudget] = useState({});
  const [savedPlans, setSavedPlans] = useState(() => { try { return JSON.parse(localStorage.getItem("paris_plans") || "[]"); } catch { return []; } });
  const [planName, setPlanName] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const dragIndex = useRef(null);

  useLeaflet(locations, showRoute);
  const [filterDay, setFilterDay] = useState(null);
  const weather = useWeather();

  // Load shared plan from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const plan = params.get("plan");
      if (plan) {
        const data = JSON.parse(decodeURIComponent(atob(plan)));
        if (data.locations) setLocations(data.locations);
      }
    } catch {}
  }, []);

  const switchLang = (l) => { setLang(l); localStorage.setItem("reiseplaner_lang", l); };

  const saveApiKey = () => {
    localStorage.setItem("paris_openai_key", apiKeyInput);
    setApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => { setApiKeySaved(false); setShowApiSettings(false); }, 1500);
  };

  const clearApiKey = () => { localStorage.removeItem("paris_openai_key"); setApiKey(""); setApiKeyInput(""); };

  const handleAnalyze = async () => {
    if (!inputUrl.trim()) { setError(t.errorEmpty); return; }
    setError(""); setAnalyzing(true); setShowRoute(false);
    try {
      let found;
      if (apiKey) {
        const result = await analyzeWithAI(inputUrl, apiKey);
        if (result.error) { setError(result.error); setAnalyzing(false); return; }
        found = { ...result, id: Date.now() };
      } else {
        await new Promise(r => setTimeout(r, 1400));
        const lower = inputUrl.toLowerCase();
        if (lower.includes("eiffel") || lower.includes("tour-eiffel")) found = { ...SAMPLE_LOCATIONS[0], id: Date.now() };
        else if (lower.includes("arc") || lower.includes("triomphe")) found = { ...SAMPLE_LOCATIONS[1], id: Date.now() };
        else if (lower.includes("restaurant") || lower.includes("cafe") || lower.includes("vefour") || lower.includes("maps")) found = { ...SAMPLE_LOCATIONS[2], id: Date.now() };
        else { setError(t.errorNotFound); setAnalyzing(false); return; }
      }
      setLocations(prev => [...prev, { ...found, day: selectedDay }]);
      setInputUrl("");
    } catch (e) { setError("Fehler: " + e.message); }
    setAnalyzing(false);
  };

  const removeLocation = (id) => { setLocations(prev => prev.filter(l => l.id !== id)); setShowRoute(false); };

  const handleDragStart = (index) => { dragIndex.current = index; setDraggingId(locations[index].id); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (index) => {
    const from = dragIndex.current;
    if (from === null || from === index) { setDraggingId(null); return; }
    const updated = [...locations]; const [moved] = updated.splice(from, 1); updated.splice(index, 0, moved);
    setLocations(updated); setShowRoute(false); dragIndex.current = null; setDraggingId(null);
  };

  const savePlan = () => {
    if (!planName.trim() || locations.length === 0) return;
    const plan = { name: planName.trim(), locations, date: new Date().toLocaleDateString("de-DE"), id: Date.now() };
    const updated = [plan, ...savedPlans.filter(p => p.name !== planName.trim())].slice(0, 10);
    setSavedPlans(updated); localStorage.setItem("paris_plans", JSON.stringify(updated));
    setSavedFeedback(true); setPlanName(""); setTimeout(() => setSavedFeedback(false), 2000);
  };

  const loadPlan = (plan) => { setLocations(plan.locations); setShowRoute(false); };
  const deletePlan = (id) => { const updated = savedPlans.filter(p => p.id !== id); setSavedPlans(updated); localStorage.setItem("paris_plans", JSON.stringify(updated)); };

  const handleShare = (e) => {
    e.stopPropagation();
    if (locations.length === 0) return;
    const encoded = btoa(encodeURIComponent(JSON.stringify({ locations, v: "1.3" })));
    setShareUrl(`${window.location.href.split("?")[0]}?plan=${encoded}`);
  };

  const copyShareUrl = () => { navigator.clipboard.writeText(shareUrl).then(() => { setShareCopied(true); setTimeout(() => setShareCopied(false), 2000); }); };

  const buildGoogleMapsUrl = (locs, mode) => {
    if (locs.length < 2) return "";
    const origin = `${locs[0].lat},${locs[0].lng}`;
    const dest = `${locs[locs.length - 1].lat},${locs[locs.length - 1].lng}`;
    const waypoints = locs.slice(1, -1).map(l => `${l.lat},${l.lng}`).join("|");
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${mode}`;
    if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
    return url;
  };

  const handleExportPDF = () => {
    const html = `<html><head><title>Reiseplaner</title><style>body{font-family:Georgia,serif;color:#111;padding:32px;max-width:700px;margin:0 auto}h1{color:#c0392b;font-size:2rem}h2{color:#c0392b;border-bottom:2px solid #c0392b;padding-bottom:4px;margin-top:24px}.loc{border:1px solid #ddd;border-radius:8px;padding:12px 16px;margin-bottom:12px}.tag{display:inline-block;background:#f5f5f5;border-radius:4px;padding:2px 8px;font-size:.75rem;margin-right:6px}footer{margin-top:32px;font-size:.75rem;color:#aaa;text-align:center}</style></head><body><h1>🧳 ${t.appName}</h1><p style="color:#888">${new Date().toLocaleDateString("de-DE")}</p><h2>📍 ${t.myPlaces}</h2>${locations.map((loc, i) => `<div class="loc"><b>${i + 1}. ${loc.icon} ${loc.name}</b><br/><span style="color:#555">${loc.address}</span><br/><span class="tag">📅 ${loc.day}</span><span class="tag">📍 ${loc.area}</span><span class="tag">⏱ ${loc.duration}</span></div>`).join("")}<footer>🧳 ${t.footerText}</footer></body></html>`;
    const win = window.open("", "_blank"); win.document.write(html); win.document.close(); win.print();
  };

  const warnings = locations.filter(loc => { const info = getOpeningInfo(loc.name, loc.day); return info && !info.isOpen; });

  const usedDays = [...new Set(locations.map(l => l.day).filter(Boolean))];
  const filteredLocations = filterDay ? locations.filter(l => l.day === filterDay) : locations;

  const budgetItems = locations.map(loc => {
    const cost = getEntryCost(loc.name);
    const extra = parseFloat(extraBudget[loc.id] || 0);
    const base = cost ? cost.min : 0;
    return { loc, cost, base, extra, total: base + extra };
  });
  const totalBudget = budgetItems.reduce((s, b) => s + b.total, 0);

  const routeSteps = locations.map((loc, i) => {
    const next = locations[i + 1];
    const key = next ? (loc.area + " -> " + next.area) : null;
    const metro = key ? METRO_LINES[key] : null;
    return { loc, next, metro };
  });
  return (
    <div className="min-h-screen font-serif" style={{ background: "#1c1c1c", color: "#f0ece0" }}>
      {/* ── Header ── */}
      <div className="relative overflow-hidden" style={{ background: "#111", borderBottom: "4px solid #c0392b" }}>
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">🧳</span>
            <div>
              <h1 className="font-black tracking-tight" style={{ fontSize: "2.4rem", color: "#e74c3c", textShadow: "1px 1px 3px #000", fontFamily: "Georgia,serif" }}>{t.appName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs" style={{ color: "#666", fontStyle: "italic" }}>Vers. 1.6</p>
                <div className="flex gap-1 ml-2">
                  {["de", "en"].map(l => (
                    <button key={l} onClick={() => switchLang(l)} className="text-xs px-2 py-0.5 rounded font-bold"
                      style={lang === l ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#666", border: "1px solid #444" }}>
                      {l === "de" ? "🇩🇪 DE" : "🇬🇧 EN"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-4 text-xs">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#c0392b", color: "#fff" }}>🗼 Paris</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#2a2a2a", color: "#555", border: "1px solid #333" }}>🏙️ {t.citiesMore}</span>
            </div>
            <button onClick={() => { setShowApiSettings(!showApiSettings); setApiKeyInput(apiKey); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: apiKey ? "#1a3a1a" : "#3a1a1a", border: apiKey ? "1px solid #2d7a2d" : "1px solid #7a2d2d", color: apiKey ? "#6dbf6d" : "#e74c3c" }}>
              {apiKey ? t.apiActive : t.apiMissing}
            </button>
          </div>

          {showApiSettings && (
            <div className="mt-4 rounded-xl p-4 space-y-3" style={{ background: "#2a1a1a", border: "1px solid #7a2d2d" }}>
              <p className="text-xs font-bold" style={{ color: "#e74c3c", fontSize: "1rem" }}>{t.apiTitle}</p>
              <p className="text-xs" style={{ color: "#999", fontStyle: "italic" }}>{t.apiHint}</p>
              <div className="flex gap-2">
                <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="sk-proj-..."
                  className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none" style={{ background: "#1a1a1a", border: "1px solid #555", color: "#f0ece0" }} />
                <button onClick={saveApiKey} className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: "#c0392b", color: "#fff" }}>
                  {apiKeySaved ? t.apiSaved : t.apiSave}
                </button>
              </div>
              {apiKey && <button onClick={clearApiKey} className="text-xs" style={{ color: "#888", textDecoration: "underline" }}>{t.apiDelete}</button>}
            </div>
          )}
        </div>
        <div className="h-3 bg-amber-400"></div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Weather Widget */}
        {weather && (
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "#222", border: "1px solid #444" }}>
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <p className="font-bold text-sm" style={{ color: "#f0ece0" }}>Paris aktuell: {weather.temp}°C · {weather.desc}</p>
              <p className="text-xs" style={{ color: "#888" }}>💨 {weather.wind} km/h · {weather.tip}</p>
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "#2a1a1a", border: "1px solid #7a2d2d" }}>
            <p className="font-bold text-sm" style={{ color: "#e74c3c" }}>⚠️ {t.warningTitle}</p>
            {warnings.map(loc => (
              <p key={loc.id} className="text-xs" style={{ color: "#e74c3c" }}>• <b>{loc.name}</b> {t.warningClosed} ({loc.day})</p>
            ))}
            <p className="text-xs" style={{ color: "#888", fontStyle: "italic" }}>{t.warningHint}</p>
          </div>
        )}

        {/* Input Section */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#222", border: "1px solid #444" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid #444", background: "#1a1a1a" }}>
            <h2 className="font-black text-base flex items-center gap-2" style={{ color: "#e74c3c", fontFamily: "Georgia,serif", fontSize: "1.3rem" }}>
              🔗 {t.addPlace}
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#aaa", letterSpacing: "0.1em" }}>{t.insertLink}</label>
              <div className="flex gap-2">
                <input type="url" value={inputUrl} onChange={e => setInputUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAnalyze()}
                  placeholder={t.linkPlaceholder} className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                  style={{ background: "#2a2a2a", border: "1px solid #555", color: "#f0ece0" }} />
                <button onClick={handleAnalyze} disabled={analyzing}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                  style={{ background: "#c0392b", color: "#fff" }}>
                  {analyzing ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> {t.analyzing}</>) : (<>🔍 {t.analyze}</>)}
                </button>
              </div>
              {error && <p className="text-xs mt-1.5" style={{ color: "#e74c3c" }}>{error}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#aaa", letterSpacing: "0.1em" }}>{t.visitDay}</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_CURRENT.map(d => (
                  <button key={d} onClick={() => setSelectedDay(d)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                    style={selectedDay === d ? { background: "#c0392b", color: "#fff", borderColor: "#c0392b" } : { background: "#2a2a2a", color: "#888", borderColor: "#444" }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-3" style={{ background: "#1a2a1a", border: "1px solid #2d5a2d" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#6dbf6d" }}>💡 {t.demo}</p>
              <div className="space-y-1">
                {["https://maps.google.com/?q=eiffelturm", "https://maps.google.com/?q=arc+de+triomphe", "https://www.restaurant-levefour.fr"].map(ex => (
                  <button key={ex} onClick={() => setInputUrl(ex)} className="block text-xs truncate hover:underline" style={{ color: "#5dade2" }}>{ex}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Locations List */}
        {locations.length > 0 && (
          <CollapsibleSection title={`📍 ${t.myPlaces}`} badge={`${filteredLocations.length} ${t.places}`} defaultOpen={true}>
            <div className="space-y-3">
              {usedDays.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <button onClick={() => setFilterDay(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                    style={filterDay === null ? { background: "#9b59b6", color: "#fff", borderColor: "#9b59b6" } : { background: "#2a2a2a", color: "#888", borderColor: "#444" }}>
                    {t.allDays}
                  </button>
                  {usedDays.map(d => (
                    <button key={d} onClick={() => setFilterDay(d)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                      style={filterDay === d ? { background: "#9b59b6", color: "#fff", borderColor: "#9b59b6" } : { background: "#2a2a2a", color: "#888", borderColor: "#444" }}>
                      {d}
                    </button>
                  ))}
                </div>
              )}
              {filteredLocations.map((loc, i) => (
                <LocationCard key={loc.id} loc={loc} day={loc.day} index={i}
                  onRemove={() => removeLocation(loc.id)}
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  isDragging={draggingId === loc.id} />
              ))}
              <p className="text-xs text-center" style={{ color: "#555" }}>{t.dragHint}</p>
            </div>
          </CollapsibleSection>
        )}

        {/* Action Buttons */}
        {locations.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setShowRoute(true)} className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              style={{ background: "#c0392b", color: "#fff" }}>🗺️ {t.route}</button>
            <button onClick={() => setShowTimeline(v => !v)} className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              style={{ background: showTimeline ? "#2d5a7a" : "#1a2a3a", color: "#5dade2", border: "1px solid #2d5a7a" }}>📅 {t.timeline}</button>
            <button onClick={handleExportPDF} className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
              style={{ background: "#1a3a1a", color: "#6dbf6d", border: "1px solid #2d5a2d" }}>📄 {t.pdf}</button>
          </div>
        )}
        {/* Route & Map */}
        {showRoute && locations.length >= 2 && (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#222", border: "1px solid #444" }}>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid #444", background: "#1a1a1a" }}>
              <h2 className="font-black" style={{ color: "#e74c3c", fontFamily: "Georgia,serif", fontSize: "1.2rem" }}>🗺️ {t.route} · {locations.length} {t.stops}</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#aaa", letterSpacing: "0.1em" }}>{t.travelMode}</label>
                <div className="flex flex-wrap gap-2">
                  {[{ key: "walking", label: t.walking }, { key: "transit", label: t.transit }, { key: "driving", label: t.driving }].map(m => (
                    <button key={m.key} onClick={() => setTravelMode(m.key)} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={travelMode === m.key ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#888", border: "1px solid #444" }}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div id="paris-map" className="w-full rounded-xl overflow-hidden" style={{ height: "300px", background: "#1a1a1a" }}></div>
              <div className="space-y-2">
                {routeSteps.map(({ loc, next, metro }, i) => (
                  <div key={loc.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                      {next && <div className="w-0.5 flex-1 my-1 h-12" style={{ background: "#c0392b", opacity: 0.4 }}></div>}
                    </div>
                    <div className="rounded-xl p-3 flex-1" style={{ background: "#2a2a2a", border: "1px solid #444" }}>
                      <p className="font-semibold text-sm" style={{ color: "#f0ece0" }}>{loc.icon} {loc.name}</p>
                      {metro && <div className="mt-2"><MetroTag line={metro.line} time={metro.time} /></div>}
                    </div>
                  </div>
                ))}
              </div>
              <a href={buildGoogleMapsUrl(locations, travelMode)} target="_blank" rel="noopener noreferrer"
                className="block text-center py-2.5 rounded-xl text-sm font-bold" style={{ background: "#1a3a1a", color: "#6dbf6d", border: "1px solid #2d5a2d" }}>
                🗺️ {t.openInMaps}
              </a>
            </div>
          </div>
        )}

        {showRoute && locations.length < 2 && (
          <div className="rounded-2xl p-4" style={{ background: "#222", border: "1px solid #444" }}>
            <p className="text-xs text-center" style={{ color: "#888" }}>{t.noRouteHint}</p>
          </div>
        )}

        {/* Timeline */}
        {showTimeline && locations.length > 0 && (
          <CollapsibleSection title={`📅 ${t.timelineTitle}`} defaultOpen={true}>
            <Timeline locations={locations} />
          </CollapsibleSection>
        )}

        {/* Budget Tracker */}
        {locations.length > 0 && (
          <CollapsibleSection title={`💰 ${t.budgetTitle}`}
            rightContent={<span className="text-sm font-bold" style={{ color: "#f39c12" }}>{totalBudget.toFixed(2)} €</span>}>
            <div className="space-y-3">
              {budgetItems.map(({ loc, cost, extra, total }) => (
                <div key={loc.id} className="rounded-xl p-3 flex items-center justify-between gap-3" style={{ background: "#2a2a2a", border: "1px solid #444" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#f0ece0" }}>{loc.icon} {loc.name}</p>
                    {cost ? (
                      <p className="text-xs" style={{ color: "#888" }}>{t.admission}: {cost.min === cost.max ? `${cost.min.toFixed(2)} ${cost.currency}` : `${cost.min.toFixed(2)}–${cost.max.toFixed(2)} ${cost.currency}`} · {cost.note}</p>
                    ) : (
                      <p className="text-xs" style={{ color: "#6dbf6d" }}>{t.free}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: "#888" }}>{t.budgetExtras}</span>
                      <input type="number" min="0" step="5" value={extraBudget[loc.id] || ""}
                        onChange={e => setExtraBudget(prev => ({ ...prev, [loc.id]: e.target.value }))}
                        className="w-20 rounded px-2 py-1 text-xs focus:outline-none" style={{ background: "#1a1a1a", border: "1px solid #555", color: "#f0ece0" }} />
                      <span className="text-xs" style={{ color: "#888" }}>€</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap" style={{ color: "#f39c12" }}>{total.toFixed(2)} €</span>
                </div>
              ))}
              <p className="text-xs text-center" style={{ color: "#555", fontStyle: "italic" }}>{t.budgetNote}</p>
            </div>
          </CollapsibleSection>
        )}

        {/* Save & Load Plans */}
        <CollapsibleSection title={`📋 ${t.savePlans}`} badge={savedPlans.length}>
          <div className="space-y-3">
            {locations.length > 0 && (
              <div className="flex gap-2">
                <input type="text" value={planName} onChange={e => setPlanName(e.target.value)} placeholder={t.planNamePlaceholder}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none" style={{ background: "#2a2a2a", border: "1px solid #555", color: "#f0ece0" }} />
                <button onClick={savePlan} className="px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#c0392b", color: "#fff" }}>
                  {savedFeedback ? t.saved : t.save}
                </button>
              </div>
            )}
            {savedPlans.length === 0 ? (
              <p className="text-xs text-center" style={{ color: "#555" }}>{locations.length > 0 ? t.addFirst : t.noPlans}</p>
            ) : (
              <div className="space-y-2">
                {savedPlans.map(plan => (
                  <div key={plan.id} className="rounded-xl p-3 flex items-center justify-between" style={{ background: "#2a2a2a", border: "1px solid #444" }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#f0ece0" }}>{plan.name}</p>
                      <p className="text-xs" style={{ color: "#888" }}>{plan.locations.length} {t.places} · {plan.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => loadPlan(plan)} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#1a2a3a", color: "#5dade2", border: "1px solid #2d5a7a" }}>{t.load}</button>
                      <button onClick={() => deletePlan(plan.id)} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#2a1a1a", color: "#e74c3c", border: "1px solid #7a2d2d" }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Share Section */}
        {locations.length > 0 && (
          <CollapsibleSection title={t.share}
            rightContent={<button onClick={handleShare} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#c0392b", color: "#fff" }}>{t.createLink}</button>}>
            <div className="space-y-3">
              {shareUrl ? (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "#888" }}>{t.shareHint}</p>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={shareUrl} className="flex-1 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                      style={{ background: "#2a2a2a", border: "1px solid #555", color: "#5dade2" }} />
                    <button onClick={copyShareUrl} className="px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#1a3a1a", color: "#6dbf6d", border: "1px solid #2d5a2d" }}>
                      {shareCopied ? t.copied : t.copy}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-center" style={{ color: "#555" }}>Klicke auf "{t.createLink}" um einen teilbaren Link zu erstellen.</p>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Help Button & Panel */}
        <div className="text-center">
          <button onClick={() => setShowHelp(v => !v)} className="px-5 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: "#1a2a3a", color: "#5dade2", border: "1px solid #2d5a7a" }}>
            {t.helpButton}
          </button>
        </div>

        {showHelp && (
          <div className="rounded-2xl overflow-hidden" style={{ background: "#222", border: "1px solid #444" }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #444", background: "#1a1a1a" }}>
              <h2 className="font-black" style={{ color: "#e74c3c", fontFamily: "Georgia,serif", fontSize: "1.2rem" }}>{t.helpTitle}</h2>
              <button onClick={() => setShowHelp(false)} className="text-xs px-3 py-1 rounded-lg" style={{ background: "#2a2a2a", color: "#888", border: "1px solid #444" }}>{t.helpClose}</button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm" style={{ color: "#ccc" }}>{t.helpIntro}</p>
              {[
                { title: t.helpAddPlace, desc: t.helpAddPlaceDesc },
                { title: t.helpPlaces, desc: t.helpPlacesDesc },
                { title: t.helpRoute, desc: t.helpRouteDesc },
                { title: t.helpTimeline, desc: t.helpTimelineDesc },
                { title: t.helpPDF, desc: t.helpPDFDesc },
                { title: t.helpBudget, desc: t.helpBudgetDesc },
                { title: t.helpSave, desc: t.helpSaveDesc },
                { title: t.helpShare, desc: t.helpShareDesc },
                { title: t.helpWeather, desc: t.helpWeatherDesc },
                { title: t.helpWarnings, desc: t.helpWarningsDesc },
              ].map((section, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: "#2a2a2a", border: "1px solid #444" }}>
                  <p className="text-sm font-bold mb-1" style={{ color: "#f0ece0" }}>{section.title}</p>
                  <p className="text-xs" style={{ color: "#aaa" }}>{section.desc}</p>
                </div>
              ))}
              <div className="rounded-xl p-3" style={{ background: "#2a1a1a", border: "1px solid #7a2d2d" }}>
                <p className="text-sm font-bold mb-1" style={{ color: "#f0ece0" }}>{t.helpAPI}</p>
                <p className="text-xs mb-2" style={{ color: "#aaa" }}>{t.helpAPIDesc}</p>
                <p className="text-xs font-semibold mb-1" style={{ color: "#e74c3c" }}>{t.helpAPISetup}</p>
                <ul className="space-y-1">
                  {[t.helpAPIStep1, t.helpAPIStep2, t.helpAPIStep3, t.helpAPIStep4].map((step, i) => (
                    <li key={i} className="text-xs" style={{ color: "#aaa" }}>{step}</li>
                  ))}
                </ul>
                <p className="text-xs mt-2" style={{ color: "#888", fontStyle: "italic" }}>{t.helpAPINote}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-xs" style={{ color: "#444" }}>🧳 {t.footerText}</p>
        </footer>
      </div>
    </div>
  );
}
