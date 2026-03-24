import { useState, useEffect, useRef } from "react";

// ── City Database ──
const CITIES = {
  paris: {
    id: "paris", name: "Paris", emoji: "🗼", country: "🇫🇷",
    lat: 48.8566, lng: 2.3522, timezone: "Europe/Paris",
    sampleLocations: [
      { id: 1, name: "Eiffelturm", type: "Sehenswürdigkeit", address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris", lat: 48.8584, lng: 2.2945, area: "7. Arrondissement", duration: "1,5 Std.", icon: "✈️" },
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
      "Musée d'Orsay": { min: 16.00, max: 16.00, currency: "€", note: "Erwachsene" },
      "Sacré-Cœur": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Notre-Dame": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Palais Royal": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Eiffelturm": { stars: 4.8, reviews: 284000, price: "€€", badge: "Weltbekannt" },
      "Arc de Triomphe": { stars: 4.7, reviews: 98000, price: "€€", badge: "Muss man gesehen haben" },
      "Le Grand Véfour": { stars: 4.5, reviews: 1200, price: "€€€€", badge: "Michelin-Stern" },
      "Louvre": { stars: 4.7, reviews: 312000, price: "€€", badge: "Weltbekannt" },
      "Musée d'Orsay": { stars: 4.8, reviews: 76000, price: "€€", badge: "Top-Museum" },
      "Sacré-Cœur": { stars: 4.8, reviews: 134000, price: "Kostenlos", badge: "Geheimtipp" },
      "Notre-Dame": { stars: 4.8, reviews: 220000, price: "Kostenlos", badge: "Ikone" },
      "Palais Royal": { stars: 4.6, reviews: 42000, price: "Kostenlos", badge: "Verstecktes Juwel" },
    },
    locationInfo: {
      "Eiffelturm": { short: "Wahrzeichen von Paris, 330m hoch, 1889 erbaut.", highlights: ["Aussichtsplattform im 2. & 3. Stock", "Abends Lichtshow zur vollen Stunde", "Champ de Mars Picknick davor"] },
      "Arc de Triomphe": { short: "Triumphbogen am Place Charles de Gaulle, 1836 fertiggestellt.", highlights: ["Dachterrasse mit Panoramablick", "Grab des Unbekannten Soldaten", "Blick auf die Champs-Élysées"] },
      "Le Grand Véfour": { short: "Eines der ältesten Restaurants von Paris, seit 1784.", highlights: ["Historisches Interieur aus dem 18. Jhd.", "Sternküche", "Stammsitz von Napoleon & Victor Hugo"] },
      "Louvre": { short: "Größtes Kunstmuseum der Welt.", highlights: ["Mona Lisa (Saal 711)", "Venus von Milo", "Glaspyramide im Innenhof"] },
      "Musée d'Orsay": { short: "Impressionismus-Museum im ehemaligen Bahnhof.", highlights: ["Van Goghs Sternennacht", "Monets Seerosen-Serie", "Architektur des alten Bahnhofs"] },
      "Sacré-Cœur": { short: "Weiße Basilika auf dem Montmartre-Hügel.", highlights: ["Panoramablick über Paris", "Künstlerviertel Montmartre", "Place du Tertre"] },
      "Notre-Dame": { short: "Gotische Kathedrale aus dem 12. Jhd.", highlights: ["Gotische Architektur & Rosenfenster", "Türme & Wasserspeier", "Île de la Cité"] },
      "Palais Royal": { short: "Historischer Palast mit Arkadengängen.", highlights: ["Jardin du Palais Royal", "Les Deux Plateaux", "Luxusboutiquen"] },
    },
    openingHours: {
      "Eiffelturm": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–23:45" },
      "Arc de Triomphe": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–23:00" },
      "Le Grand Véfour": { mo: true, di: true, mi: true, do: true, fr: true, sa: false, so: false, hours: "12:00–14:00, 19:30–22:00", note: "Sa & So geschlossen" },
      "Louvre": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–18:00", note: "Mo geschlossen" },
      "Musée d'Orsay": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:30–18:00", note: "Mo geschlossen" },
      "Sacré-Cœur": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "06:00–22:30" },
      "Notre-Dame": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "08:00–19:00" },
      "Palais Royal": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "08:00–20:30" },
    },
    metroLines: {
      "7. Arrondissement -> 8. Arrondissement": { line: "M6", time: "12 min", stops: 3 },
      "8. Arrondissement -> 1. Arrondissement": { line: "M1", time: "18 min", stops: 5 },
      "1. Arrondissement -> 7. Arrondissement": { line: "M14", time: "22 min", stops: 6 },
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
      { pattern: /tower.*london|tower\+of/i, locationIndex: 0 },
      { pattern: /big.*ben|westminster/i, locationIndex: 1 },
      { pattern: /borough.*market/i, locationIndex: 2 },
    ],
    entryCosts: {
      "Tower of London": { min: 33.60, max: 33.60, currency: "£", note: "Erwachsene" },
      "Big Ben": { min: 0, max: 0, currency: "£", note: "Außenbesichtigung frei" },
      "Borough Market": { min: 0, max: 0, currency: "£", note: "Eintritt frei" },
      "British Museum": { min: 0, max: 0, currency: "£", note: "Eintritt frei" },
      "Buckingham Palace": { min: 30, max: 30, currency: "£", note: "Erwachsene (Sommer)" },
    },
    ratings: {
      "Tower of London": { stars: 4.7, reviews: 112000, price: "€€", badge: "UNESCO Welterbe" },
      "Big Ben": { stars: 4.8, reviews: 198000, price: "Kostenlos", badge: "Ikone" },
      "Borough Market": { stars: 4.6, reviews: 67000, price: "€€", badge: "Foodie-Paradies" },
      "British Museum": { stars: 4.8, reviews: 245000, price: "Kostenlos", badge: "Weltklasse" },
      "Buckingham Palace": { stars: 4.5, reviews: 89000, price: "€€", badge: "Royal" },
    },
    locationInfo: {
      "Tower of London": { short: "Historische Festung an der Themse, seit 1066.", highlights: ["Kronjuwelen besichtigen", "Beefeater-Führung", "Raben des Towers"] },
      "Big Ben": { short: "Berühmter Uhrenturm am Palace of Westminster.", highlights: ["Fotomotiv #1 in London", "Westminster Bridge", "Houses of Parliament"] },
      "Borough Market": { short: "Ältester Lebensmittelmarkt Londons.", highlights: ["Street Food aus aller Welt", "Frische lokale Produkte", "Atmosphäre unter Eisenbahn-Bögen"] },
    },
    openingHours: {
      "Tower of London": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:30" },
      "Big Ben": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Außen immer sichtbar" },
      "Borough Market": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "10:00–17:00", note: "Mo & So geschlossen" },
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
      "Vatikan": { min: 17, max: 17, currency: "€", note: "Museen, Erwachsene" },
      "Trevi-Brunnen": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
      "Pantheon": { min: 5, max: 5, currency: "€", note: "Erwachsene" },
    },
    ratings: {
      "Kolosseum": { stars: 4.8, reviews: 320000, price: "€€", badge: "UNESCO Welterbe" },
      "Vatikan": { stars: 4.7, reviews: 210000, price: "€€", badge: "Einzigartig" },
      "Trevi-Brunnen": { stars: 4.7, reviews: 280000, price: "Kostenlos", badge: "Romantisch" },
    },
    locationInfo: {
      "Kolosseum": { short: "Antikes Amphitheater, erbaut 70-80 n.Chr.", highlights: ["Arena & Untergeschosse", "Palatin-Hügel Kombiticket", "Sonnenuntergang-Blick"] },
      "Vatikan": { short: "Kleinster Staat der Welt mit Sixtinischer Kapelle.", highlights: ["Sixtinische Kapelle", "Petersdom & Kuppel", "Raffael-Stanzen"] },
      "Trevi-Brunnen": { short: "Größter Barockbrunnen Roms.", highlights: ["Münze werfen für Rückkehr", "Abends beleuchtet", "Gelato nebenan"] },
    },
    openingHours: {
      "Kolosseum": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–19:00" },
      "Vatikan": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: false, hours: "08:00–18:00", note: "So geschlossen (außer letzter So/Monat)" },
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
      { pattern: /güell|guell|park\+g/i, locationIndex: 1 },
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
      { id: 2, name: "Anne-Frank-Haus", type: "Museum", address: "Prinsengracht 263-267, 1016 GV Amsterdam", lat: 52.3752, lng: 4.8840, area: "Jordaan", duration: "1,5 Std.", icon: "📖" },
      { id: 3, name: "Vondelpark", type: "Park", address: "1071 AA Amsterdam", lat: 52.3580, lng: 4.8686, area: "Oud-Zuid", duration: "1 Std.", icon: "🌳" },
    ],
    demoLinks: ["https://maps.google.com/?q=rijksmuseum", "https://maps.google.com/?q=anne+frank+haus", "https://maps.google.com/?q=vondelpark"],
    linkMatchers: [
      { pattern: /rijksmuseum|rijks/i, locationIndex: 0 },
      { pattern: /anne.*frank/i, locationIndex: 1 },
      { pattern: /vondelpark|vondel/i, locationIndex: 2 },
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
      "Rijksmuseum": { short: "Niederländisches Nationalmuseum mit Rembrandts Nachtwache.", highlights: ["Nachtwache von Rembrandt", "Delfter Blau Sammlung", "Museumsgarten"] },
      "Anne-Frank-Haus": { short: "Versteck der Familie Frank im Zweiten Weltkrieg.", highlights: ["Originales Hinterhaus", "Tagebuch-Ausstellung", "Tickets früh buchen!"] },
      "Vondelpark": { short: "Größter Stadtpark Amsterdams.", highlights: ["Open-Air-Theater im Sommer", "Cafés & Spielplätze", "Joggen & Radfahren"] },
    },
    openingHours: {
      "Rijksmuseum": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–17:00" },
      "Anne-Frank-Haus": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "09:00–22:00" },
      "Vondelpark": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer geöffnet" },
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
      { pattern: /museumsinsel|museum.*insel/i, locationIndex: 1 },
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
      "Brandenburger Tor": { short: "Symbol der deutschen Wiedervereinigung.", highlights: ["Pariser Platz Atmosphäre", "Foto-Hotspot", "Nah am Reichstag"] },
      "Museumsinsel": { short: "Fünf weltberühmte Museen auf einer Insel.", highlights: ["Pergamonmuseum", "Nofretete-Büste", "Alte Nationalgalerie"] },
      "East Side Gallery": { short: "Längste Open-Air-Galerie der Welt, bemalt auf der Berliner Mauer.", highlights: ["Bruderkuss-Gemälde", "1,3 km Mauer-Kunst", "Spree-Ufer Spaziergang"] },
    },
    openingHours: {
      "Brandenburger Tor": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
      "Museumsinsel": { mo: false, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "10:00–18:00", note: "Mo teilw. geschlossen" },
      "East Side Gallery": { mo: true, di: true, mi: true, do: true, fr: true, sa: true, so: true, hours: "Immer zugänglich" },
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
      "Schloss Schönbrunn": { min: 24, max: 29, currency: "€", note: "Imperial Tour / Grand Tour" },
      "Stephansdom": { min: 0, max: 6, currency: "€", note: "Kirche frei / Turm 6€" },
      "Naschmarkt": { min: 0, max: 0, currency: "€", note: "Eintritt frei" },
    },
    ratings: {
      "Schloss Schönbrunn": { stars: 4.7, reviews: 125000, price: "€€", badge: "UNESCO Welterbe" },
      "Stephansdom": { stars: 4.8, reviews: 92000, price: "€", badge: "Wahrzeichen" },
      "Naschmarkt": { stars: 4.5, reviews: 55000, price: "€€", badge: "Kulinarisch" },
    },
    locationInfo: {
      "Schloss Schönbrunn": { short: "Kaiserliche Sommerresidenz der Habsburger.", highlights: ["Prunkräume besichtigen", "Schlossgarten & Gloriette", "Tiergarten (ältester Zoo der Welt)"] },
      "Stephansdom": { short: "Gotische Kathedrale im Herzen Wiens.", highlights: ["Südturm besteigen (343 Stufen)", "Katakomben-Führung", "Pummerin-Glocke"] },
      "Naschmarkt": { short: "Wiens beliebtester Markt seit dem 16. Jhd.", highlights: ["Internationale Küche", "Flohmarkt am Samstag", "Wiener Kaffeehäuser nebenan"] },
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
    demoLinks: ["https://maps.google.com/?q=karlsbrücke+prag", "https://maps.google.com/?q=prager+burg", "https://maps.google.com/?q=altstädter+ring+prag"],
    linkMatchers: [
      { pattern: /karls.*brücke|charles.*bridge|karluv/i, locationIndex: 0 },
      { pattern: /prager.*burg|prague.*castle|hrad/i, locationIndex: 1 },
      { pattern: /altstädter|old.*town.*square|staromest/i, locationIndex: 2 },
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
      "Karlsbrücke": { short: "Gotische Steinbrücke über die Moldau, 1402 fertiggestellt.", highlights: ["30 Barockskulpturen", "Frühmorgens ohne Massen", "Straßenkünstler"] },
      "Prager Burg": { short: "Größte geschlossene Burganlage der Welt.", highlights: ["Veitsdom", "Goldenes Gässchen", "Panoramablick über Prag"] },
      "Altstädter Ring": { short: "Mittelalterlicher Marktplatz mit Astronomischer Uhr.", highlights: ["Astronomische Uhr (jede volle Stunde)", "Teynkirche", "Weihnachtsmarkt im Winter"] },
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
      { id: 3, name: "Pastéis de Belém", type: "Café", address: "R. de Belém 84-92, 1300-085 Lisboa", lat: 38.6976, lng: -9.2030, area: "Belém", duration: "0,5 Std.", icon: "🥮" },
    ],
    demoLinks: ["https://maps.google.com/?q=torre+de+belem", "https://maps.google.com/?q=alfama+lissabon", "https://maps.google.com/?q=pasteis+de+belem"],
    linkMatchers: [
      { pattern: /torre.*bel[eé]m|belem.*tower/i, locationIndex: 0 },
      { pattern: /alfama/i, locationIndex: 1 },
      { pattern: /past[eé]is|bel[eé]m.*cafe/i, locationIndex: 2 },
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
      "Freiheitsstatue": { short: "Geschenk Frankreichs an die USA, 1886 eingeweiht.", highlights: ["Fähre ab Battery Park", "Krone nur mit Voranmeldung", "Ellis Island Museum"] },
      "Central Park": { short: "Ikonischer Stadtpark mitten in Manhattan.", highlights: ["Bethesda Fountain", "Bow Bridge", "Strawberry Fields (John Lennon Memorial)"] },
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

const CITY_ORDER = ["paris", "london", "rom", "barcelona", "amsterdam", "berlin", "wien", "prag", "lissabon", "new_york"];

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
    closedDay: "Geschlossen an diesem Tag",
    unknownHours: "⏰ Öffnungszeiten unbekannt – bitte vorab prüfen",
    reviews: "Bewertungen",
    budgetTitle: "Budget-Tracker",
    budgetTotal: "Gesamt",
    budgetExtras: "+ Extras (Essen, Shopping...):",
    budgetNote: "* Eintrittspreise sind Schätzungen.",
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
    shareHint: "Teile diesen Link mit deinen Reisebegleitern:",
    copy: "📋 Kopieren",
    copied: "✅ Kopiert!",
    warningTitle: "Achtung",
    warningClosed: "ist an dem gewählten Tag geschlossen!",
    warningHint: "Bitte ändere den Besuchstag oder wähle einen anderen Ort.",
    closed: "geschlossen",
    apiActive: "✅ API aktiv",
    apiMissing: "⚠️ API-Key fehlt",
    apiTitle: "🔐 OpenAI API-Key",
    apiHint: "Dein Key wird nur lokal gespeichert.",
    apiSave: "Speichern",
    apiSaved: "✅ Gespeichert!",
    apiDelete: "🗑️ Key löschen",
    footerText: "Reiseplaner v2.1 · Powered by KI",
    noRouteHint: "Füge mindestens 2 Orte hinzu für eine Route.",
    errorEmpty: "Bitte gib einen Link ein.",
    errorNotFound: "Link nicht erkannt. Tipp: API-Key eingeben!",
    days: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    admission: "Eintritt",
    free: "Kostenlos",
    close: "Schließen",
    places: "Orte",
    selectCity: "Stadt wählen",
    customCity: "✨ Andere Stadt",
    customCityPlaceholder: "Stadtname eingeben...",
    customCityAdd: "Stadt hinzufügen",
    customCityHint: "Eigene Stadt – Demo-Daten nur für vorgegebene Städte verfügbar.",
    switchCity: "Stadt wechseln",
    currentCity: "Aktuelle Stadt",
    helpButton: "❓",
    cityNoDemo: "Für diese Stadt sind keine Demo-Daten verfügbar. Nutze einen API-Key für volle Funktionalität.",
    travelTime: "Reisezeit",
    walkingTime: "zu Fuß",
    transitTime: "mit ÖPNV",
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
    closedDay: "Closed on this day",
    unknownHours: "⏰ Hours unknown – please check",
    reviews: "reviews",
    budgetTitle: "Budget Tracker",
    budgetTotal: "Total",
    budgetExtras: "+ Extras (food, shopping...):",
    budgetNote: "* Prices are estimates.",
    savePlans: "Travel Plans",
    savedPlans: "Saved Plans",
    planNamePlaceholder: "Plan name e.g. Paris Weekend...",
    save: "💾 Save",
    saved: "✅ Saved!",
    load: "Load",
    noPlans: "No plans saved yet.",
    addFirst: "Add places to save a plan.",
    share: "🤝 Share Plan",
    createLink: "🔗 Create Link",
    shareHint: "Share this link with your travel companions:",
    copy: "📋 Copy",
    copied: "✅ Copied!",
    warningTitle: "Warning",
    warningClosed: "is closed on the selected day!",
    warningHint: "Please change the visit day.",
    closed: "closed",
    apiActive: "✅ API active",
    apiMissing: "⚠️ API Key missing",
    apiTitle: "🔐 OpenAI API Key",
    apiHint: "Stored locally only.",
    apiSave: "Save",
    apiSaved: "✅ Saved!",
    apiDelete: "🗑️ Delete key",
    footerText: "Travel Planner v2.1 · Powered by AI",
    noRouteHint: "Add at least 2 places for a route.",
    errorEmpty: "Please enter a link.",
    errorNotFound: "Link not recognized. Tip: Enter an API key!",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    admission: "Admission",
    free: "Free",
    close: "Close",
    places: "Places",
    selectCity: "Select City",
    customCity: "✨ Other City",
    customCityPlaceholder: "Enter city name...",
    customCityAdd: "Add City",
    customCityHint: "Custom city – demo data only for preset cities.",
    switchCity: "Switch City",
    currentCity: "Current City",
    helpButton: "❓",
    cityNoDemo: "No demo data for this city. Use an API key for full functionality.",
    travelTime: "Travel time",
    walkingTime: "walking",
    transitTime: "by transit",
  }
};

const DAYS_DE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_KEY_MAP = { "Montag": "mo", "Dienstag": "di", "Mittwoch": "mi", "Donnerstag": "do", "Freitag": "fr", "Samstag": "sa", "Sonntag": "so", "Monday": "mo", "Tuesday": "di", "Wednesday": "mi", "Thursday": "do", "Friday": "fr", "Saturday": "sa", "Sunday": "so" };

// ── Helper functions ──
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
  const dayKey = DAY_KEY_MAP[day];
  const isOpen = dayKey ? info[dayKey] : true;
  return { isOpen, hours: info.hours, note: info.note };
}

// ── Travel time calculation (Haversine) ──
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcTravelTime(loc1, loc2) {
  if (!loc1.lat || !loc1.lng || !loc2.lat || !loc2.lng) return null;
  const dist = haversineDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
  const walkFactor = 1.3;
  const walkDist = dist * walkFactor;
  const walkSpeed = 4.5;
  const walkMin = Math.round((walkDist / walkSpeed) * 60);
  const transitSpeed = 25;
  const transitMin = Math.max(5, Math.round((walkDist / transitSpeed) * 60) + 3);
  return { distKm: Math.round(dist * 10) / 10, walkMin, transitMin };
}

function TravelTimeBadge({ from, to }) {
  const travel = calcTravelTime(from, to);
  if (!travel) return null;
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-full text-xs" style={{ background: "#1a1a2e", border: "1px solid #333" }}>
        <span style={{ color: "#888" }}>{travel.distKm} km</span>
        <span className="flex items-center gap-1" style={{ color: "#5dade2" }}>🚶 {travel.walkMin} Min.</span>
        <span className="flex items-center gap-1" style={{ color: "#f39c12" }}>🚇 {travel.transitMin} Min.</span>
      </div>
    </div>
  );
}

async function analyzeWithAI(url, apiKey, cityName) {
  const prompt = `Du bist ein Reiseassistent für ${cityName}. Analysiere diesen Link: "${url}"
Extrahiere (antworte NUR mit JSON):
{"name":"...","type":"Restaurant|Sehenswürdigkeit|Museum|Park|Bar|Café","address":"...","area":"Stadtteil","duration":"...","icon":"emoji","lat":0,"lng":0,"tip":"..."}`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.3 })
  });
  if (!res.ok) throw new Error("API Error: " + res.status);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content.trim().replace(/```json|```/g, "").trim());
}

async function geocodeCity(name) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=de`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const r = data.results[0];
      return { lat: r.latitude, lng: r.longitude, timezone: r.timezone, fullName: r.name, country: r.country_code };
    }
  } catch {}
  return null;
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
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < full ? "#f39c12" : "#444", fontSize: "0.7rem" }}>
          {i < full ? "★" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-xs font-bold" style={{ color: "#f39c12" }}>{stars}</span>
    </span>
  );
}

function MetroTag({ line, time }) {
  const colors = { M1: "bg-yellow-400 text-yellow-900", M6: "bg-green-500 text-white", M14: "bg-purple-600 text-white" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${colors[line] || "bg-gray-400 text-white"}`}>
      🚇 {line} · {time}
    </span>
  );
}

function LocationCard({ loc, day, onRemove, index, onDragStart, onDragOver, onDrop, isDragging, city, onDayChange, availableDays }) {
  const openInfo = day ? getOpeningInfo(loc.name, day, city) : null;
  const locInfo = getLocationInfo(loc.name, city);
  const rating = getRating(loc.name, city);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div draggable onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop}
      className="relative rounded-xl p-4 transition-all"
      style={{ background: isDragging ? "#3a1a1a" : "#2a2a2a", border: isDragging ? "2px dashed #e74c3c" : "1px solid #444", opacity: isDragging ? 0.5 : 1, cursor: "grab" }}>
      <div className="absolute top-2 left-2 w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</div>
      <button onClick={onRemove} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 text-lg leading-none">×</button>
      <div className="pl-8 pr-4 flex flex-col">
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
            <span className="text-xs" style={{ color: "#666" }}>({rating.reviews.toLocaleString("de-DE")})</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#2a1a3a", color: "#c39bd3", border: "1px solid #6c3483" }}>{rating.badge}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1a2a3a", color: "#5dade2", border: "1px solid #2d5a7a" }}>📍 {loc.area}</span>
          <span className="text-xs" style={{ color: "#888" }}>⏱ {loc.duration}</span>
        </div>
        {day && availableDays && onDayChange ? (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium" style={{ color: "#9b59b6" }}>📅</span>
            <select
              value={day}
              onChange={(e) => onDayChange(loc.id, e.target.value)}
              className="text-xs font-medium rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              style={{ background: "#1a1a2a", color: "#9b59b6", border: "1px solid #6c3483", appearance: "auto" }}>
              {availableDays.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        ) : day ? (
          <p className="text-xs mt-2 font-medium" style={{ color: "#9b59b6" }}>📅 {day}</p>
        ) : null}
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
  const items = locations.map((loc) => {
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
        <div key={loc.id}>
          <div className="flex gap-3">
            <div className="flex flex-col items-center w-16 flex-shrink-0">
              <span className="text-xs font-bold" style={{ color: "#e74c3c" }}>{start}</span>
              <div className="w-0.5 flex-1 my-1" style={{ background: "#444", minHeight: "40px" }}></div>
              <span className="text-xs" style={{ color: "#666" }}>{end}</span>
            </div>
            <div className="flex-1 mb-1 rounded-xl p-3" style={{ background: "#2a2a2a", border: "1px solid #444" }}>
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
              </div>
            </div>
          </div>
          {i < items.length - 1 && (
            <TravelTimeBadge from={locations[i]} to={locations[i + 1]} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── City Selector Component ──
function CitySelector({ currentCityId, onSelectCity, onAddCustomCity, t }) {
  const [showSelector, setShowSelector] = useState(false);
  const [customName, setCustomName] = useState("");
  const [searching, setSearching] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomCity = async () => {
    if (!customName.trim()) return;
    setSearching(true);
    const geo = await geocodeCity(customName.trim());
    setSearching(false);
    if (geo) {
      const flags = { DE: "🇩🇪", FR: "🇫🇷", GB: "🇬🇧", IT: "🇮🇹", ES: "🇪🇸", NL: "🇳🇱", AT: "🇦🇹", CZ: "🇨🇿", PT: "🇵🇹", US: "🇺🇸", JP: "🇯🇵", TH: "🇹🇭", AU: "🇦🇺", BR: "🇧🇷", MX: "🇲🇽", CA: "🇨🇦", GR: "🇬🇷", TR: "🇹🇷", HR: "🇭🇷", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮", PL: "🇵🇱", HU: "🇭🇺", IE: "🇮🇪", CH: "🇨🇭" };
      const country = flags[geo.country?.toUpperCase()] || "🌍";
      onAddCustomCity({
        id: customName.trim().toLowerCase().replace(/\s+/g, "_"),
        name: geo.fullName || customName.trim(),
        emoji: "📍",
        country,
        lat: geo.lat,
        lng: geo.lng,
        timezone: geo.timezone || "UTC",
        sampleLocations: [],
        demoLinks: [],
        linkMatchers: [],
        entryCosts: {},
        ratings: {},
        locationInfo: {},
        openingHours: {},
        metroLines: {},
      });
      setCustomName("");
      setShowCustom(false);
      setShowSelector(false);
    }
  };

  const currentCity = CITIES[currentCityId];

  return (
    <div className="relative">
      <button onClick={() => setShowSelector(v => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
        style={{ background: "#c0392b", color: "#fff", border: "2px solid #e74c3c" }}>
        <span className="text-lg">{currentCity?.emoji || "📍"}</span>
        <span>{currentCity?.name || currentCityId}</span>
        <span className="text-xs opacity-70">{showSelector ? "▲" : "▼"}</span>
      </button>

      {showSelector && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl p-4 z-50 space-y-3" style={{ background: "#1a1a1a", border: "1px solid #444", boxShadow: "0 10px 40px #000a" }}>
          <p className="text-xs font-bold" style={{ color: "#e74c3c" }}>{t.selectCity}</p>
          <div className="grid grid-cols-2 gap-2">
            {CITY_ORDER.map(cid => {
              const c = CITIES[cid];
              return (
                <button key={cid} onClick={() => { onSelectCity(cid); setShowSelector(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left"
                  style={currentCityId === cid
                    ? { background: "#c0392b", color: "#fff", border: "1px solid #e74c3c" }
                    : { background: "#2a2a2a", color: "#aaa", border: "1px solid #444" }}>
                  <span>{c.emoji}</span>
                  <span>{c.name}</span>
                  <span className="opacity-50">{c.country}</span>
                </button>
              );
            })}
          </div>
          <div className="border-t pt-3" style={{ borderColor: "#444" }}>
            {!showCustom ? (
              <button onClick={() => setShowCustom(true)} className="w-full text-center text-xs py-2 rounded-lg font-semibold" style={{ background: "#2a2a2a", color: "#5dade2", border: "1px solid #2d5a7a" }}>
                {t.customCity}
              </button>
            ) : (
              <div className="space-y-2">
                <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder={t.customCityPlaceholder}
                  className="w-full px-3 py-2 rounded-lg text-xs" style={{ background: "#2a2a2a", color: "#fff", border: "1px solid #444" }} />
                <button onClick={handleCustomCity} disabled={searching || !customName.trim()}
                  className="w-full py-2 rounded-lg text-xs font-bold" style={{ background: searching ? "#555" : "#c0392b", color: "#fff" }}>
                  {searching ? "Suche..." : t.customCityAdd}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ── MAIN APP ──
// ══════════════════════════════════════════════════════════════
export default function TravelPlanner() {
  const [lang, setLang] = useState("de");
  const t = TRANSLATIONS[lang];
  const DAYS_CURRENT = lang === "de" ? DAYS_DE : DAYS_EN;

  const [currentCityId, setCurrentCityId] = useState("paris");
  const [customCities, setCustomCities] = useState({});
  const allCities = { ...CITIES, ...customCities };
  const currentCity = allCities[currentCityId] || CITIES.paris;

  const [locations, setLocations] = useState([]);
  const [linkInput, setLinkInput] = useState("");
  const [selectedDay, setSelectedDay] = useState(DAYS_CURRENT[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiSaved, setApiSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("places");
  const [travelMode, setTravelMode] = useState("transit");
  const [filterDay, setFilterDay] = useState(null);

  const [planName, setPlanName] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [extras, setExtras] = useState(0);

  const [draggingIndex, setDraggingIndex] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("openai_api_key");
    if (stored) setApiKey(stored);
    const plans = localStorage.getItem("travel_plans");
    if (plans) setSavedPlans(JSON.parse(plans));
  }, []);

  const handleSelectCity = (cityId) => {
    setCurrentCityId(cityId);
    setLocations([]);
    setError("");
  };

  const handleAddCustomCity = (city) => {
    setCustomCities(prev => ({ ...prev, [city.id]: city }));
    setCurrentCityId(city.id);
    setLocations([]);
  };

  const changeLocationDay = (locId, newDay) => {
    setLocations(prev => prev.map(l => l.id === locId ? { ...l, day: newDay } : l));
  };

  const addLocation = async () => {
    setError("");
    if (!linkInput.trim()) { setError(t.errorEmpty); return; }
    const matchers = currentCity.linkMatchers || [];
    const match = matchers.find(m => m.pattern.test(linkInput));
    if (match) {
      const sample = currentCity.sampleLocations[match.locationIndex];
      const newLoc = { ...sample, id: Date.now(), day: selectedDay };
      setLocations(prev => [...prev, newLoc]);
      setLinkInput("");
      return;
    }
    if (apiKey) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeWithAI(linkInput, apiKey, currentCity.name);
        const newLoc = { ...result, id: Date.now(), day: selectedDay };
        setLocations(prev => [...prev, newLoc]);
        setLinkInput("");
      } catch { setError(t.errorNotFound); }
      setIsAnalyzing(false);
      return;
    }
    setError(t.errorNotFound);
  };

  const removeLocation = (id) => setLocations(prev => prev.filter(l => l.id !== id));

  const handleDragStart = (index) => setDraggingIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (dropIndex) => {
    if (draggingIndex === null || draggingIndex === dropIndex) return;
    setLocations(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(draggingIndex, 1);
      copy.splice(dropIndex, 0, moved);
      return copy;
    });
    setDraggingIndex(null);
  };

  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", apiKeyInput);
    setApiKey(apiKeyInput);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  const deleteApiKey = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setApiKeyInput("");
  };

  const savePlan = () => {
    if (!planName.trim() || locations.length === 0) return;
    const plan = { name: planName, city: currentCityId, locations, date: new Date().toISOString() };
    const updated = [...savedPlans, plan];
    setSavedPlans(updated);
    localStorage.setItem("travel_plans", JSON.stringify(updated));
    setPlanName("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const loadPlan = (plan) => {
    setCurrentCityId(plan.city);
    setLocations(plan.locations);
    setShowSaved(false);
  };

  const deletePlan = (index) => {
    const updated = savedPlans.filter((_, i) => i !== index);
    setSavedPlans(updated);
    localStorage.setItem("travel_plans", JSON.stringify(updated));
  };

  const createShareLink = () => {
    const data = btoa(JSON.stringify({ city: currentCityId, locations }));
    const link = `${window.location.origin}${window.location.pathname}?plan=${data}`;
    setShareLink(link);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLocations = filterDay ? locations.filter(l => l.day === filterDay) : locations;

  const totalBudget = locations.reduce((sum, loc) => {
    const cost = getEntryCost(loc.name, currentCity);
    return sum + (cost ? cost.max : 0);
  }, 0);

  const mapsUrl = locations.length >= 2
    ? `https://www.google.com/maps/dir/${locations.map(l => `${l.lat},${l.lng}`).join("/")}`
    : null;

  const warnings = locations.filter(loc => {
    const info = getOpeningInfo(loc.name, loc.day, currentCity);
    return info && !info.isOpen;
  });

  return (
    <div className="min-h-screen" style={{ background: "#111", color: "#f0ece0" }}>
      {/* Header */}
      <div className="relative" style={{ background: "linear-gradient(135deg, #1a0a0a 0%, #2a1a1a 50%, #1a0a0a 100%)", borderBottom: "2px solid #c0392b" }}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "Georgia,serif", color: "#e74c3c" }}>
              {currentCity.emoji} {t.appName}
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setLang(l => l === "de" ? "en" : "de")} className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: "#2a2a2a", color: "#aaa", border: "1px solid #444" }}>
                {lang === "de" ? "EN" : "DE"}
              </button>
              <button onClick={() => setShowApiInput(v => !v)} className="text-xs px-2 py-1 rounded-lg" style={{ background: apiKey ? "#1a2a1a" : "#2a1a1a", color: apiKey ? "#6dbf6d" : "#e74c3c", border: `1px solid ${apiKey ? "#2d5a2d" : "#7a2d2d"}` }}>
                {apiKey ? t.apiActive : t.apiMissing}
              </button>
            </div>
          </div>
          <div className="mt-4">
            <CitySelector currentCityId={currentCityId} onSelectCity={handleSelectCity} onAddCustomCity={handleAddCustomCity} t={t} />
          </div>
          {showApiInput && (
            <div className="mt-4 p-4 rounded-xl space-y-2" style={{ background: "#1a1a1a", border: "1px solid #444" }}>
              <p className="text-xs font-bold" style={{ color: "#e74c3c" }}>{t.apiTitle}</p>
              <p className="text-xs" style={{ color: "#888" }}>{t.apiHint}</p>
              <div className="flex gap-2">
                <input value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="sk-..." type="password"
                  className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: "#2a2a2a", color: "#fff", border: "1px solid #444" }} />
                <button onClick={saveApiKey} className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: "#c0392b", color: "#fff" }}>
                  {apiSaved ? t.apiSaved : t.apiSave}
                </button>
              </div>
              {apiKey && <button onClick={deleteApiKey} className="text-xs" style={{ color: "#e74c3c" }}>{t.apiDelete}</button>}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="rounded-xl p-4 space-y-2" style={{ background: "#2a1a1a", border: "1px solid #7a2d2d" }}>
            <p className="text-sm font-bold" style={{ color: "#e74c3c" }}>⚠️ {t.warningTitle}</p>
            {warnings.map(loc => (
              <p key={loc.id} className="text-xs" style={{ color: "#e74c3c" }}>
                <strong>{loc.name}</strong> {t.warningClosed} ({loc.day})
              </p>
            ))}
            <p className="text-xs" style={{ color: "#888" }}>{t.warningHint}</p>
          </div>
        )}

        {/* Add Location */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
          <h2 className="font-black text-lg" style={{ color: "#e74c3c", fontFamily: "Georgia,serif" }}>+ {t.addPlace}</h2>
          <div>
            <label className="text-xs font-bold tracking-wider mb-1 block" style={{ color: "#888" }}>{t.insertLink}</label>
            <div className="flex gap-2">
              <input value={linkInput} onChange={e => setLinkInput(e.target.value)} placeholder={t.linkPlaceholder}
                onKeyDown={e => e.key === "Enter" && addLocation()}
                className="flex-1 px-4 py-3 rounded-xl text-sm" style={{ background: "#2a2a2a", color: "#fff", border: "1px solid #444" }} />
              <button onClick={addLocation} disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: isAnalyzing ? "#555" : "#c0392b", color: "#fff" }}>
                {isAnalyzing ? t.analyzing : t.analyze}
              </button>
            </div>
            {error && <p className="text-xs mt-2" style={{ color: "#e74c3c" }}>{error}</p>}
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider mb-1 block" style={{ color: "#888" }}>{t.visitDay}</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_CURRENT.map(d => (
                <button key={d} onClick={() => setSelectedDay(d)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={selectedDay === d ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#888", border: "1px solid #444" }}>
                  {d.slice(0, 2)}
                </button>
              ))}
            </div>
          </div>
          {currentCity.demoLinks?.length > 0 && (
            <div className="pt-2 border-t" style={{ borderColor: "#333" }}>
              <p className="text-xs mb-2" style={{ color: "#555" }}>{t.demo}</p>
              <div className="space-y-1">
                {currentCity.demoLinks.map((link, i) => (
                  <button key={i} onClick={() => setLinkInput(link)} className="block text-xs truncate w-full text-left hover:underline" style={{ color: "#5dade2" }}>
                    {link}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {["places", "route", "timeline"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={activeTab === tab ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#888", border: "1px solid #444" }}>
              {tab === "places" ? `📍 ${t.places}` : tab === "route" ? `🗺 ${t.route}` : `⏰ ${t.timeline}`}
            </button>
          ))}
        </div>

        {/* Places Tab */}
        {activeTab === "places" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg" style={{ color: "#e74c3c", fontFamily: "Georgia,serif" }}>
                📍 {t.myPlaces} <span className="text-sm font-normal" style={{ color: "#666" }}>({locations.length})</span>
              </h2>
              <div className="flex gap-1">
                <button onClick={() => setFilterDay(null)}
                  className="px-2 py-1 rounded text-xs"
                  style={!filterDay ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#888" }}>
                  {t.allDays}
                </button>
                {DAYS_CURRENT.map(d => (
                  <button key={d} onClick={() => setFilterDay(d)}
                    className="px-2 py-1 rounded text-xs"
                    style={filterDay === d ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#888" }}>
                    {d.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
            {filteredLocations.length === 0 ? (
              <p className="text-center py-8 text-sm" style={{ color: "#555" }}>{t.addFirst}</p>
            ) : (
              <div className="space-y-1">
                {filteredLocations.map((loc, i) => (
                  <div key={loc.id}>
                    <LocationCard
                      loc={loc} day={loc.day} index={i}
                      onRemove={() => removeLocation(loc.id)}
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(i)}
                      isDragging={draggingIndex === i}
                      city={currentCity}
                      onDayChange={changeLocationDay}
                      availableDays={DAYS_CURRENT}
                    />
                    {i < filteredLocations.length - 1 && (
                      <TravelTimeBadge from={filteredLocations[i]} to={filteredLocations[i + 1]} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Route Tab */}
        {activeTab === "route" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold tracking-wider mb-2 block" style={{ color: "#888" }}>{t.travelMode}</label>
              <div className="flex gap-2">
                {[["walking", t.walking], ["transit", t.transit], ["driving", t.driving]].map(([mode, label]) => (
                  <button key={mode} onClick={() => setTravelMode(mode)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold"
                    style={travelMode === mode ? { background: "#c0392b", color: "#fff" } : { background: "#2a2a2a", color: "#888", border: "1px solid #444" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {mapsUrl ? (
              <div className="space-y-3">
                <div className="rounded-xl p-4" style={{ background: "#1a2a1a", border: "1px solid #2d5a2d" }}>
                  <p className="text-sm font-bold mb-2" style={{ color: "#6dbf6d" }}>🗺 {t.route} – {locations.length} {t.stops}</p>
                  {locations.map((loc, i) => (
                    <div key={loc.id}>
                      <div className="flex items-center gap-2 py-1">
                        <span className="w-6 h-6 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <span className="text-xs" style={{ color: "#ccc" }}>{loc.icon} {loc.name}</span>
                      </div>
                      {i < locations.length - 1 && (
                        <TravelTimeBadge from={locations[i]} to={locations[i + 1]} />
                      )}
                    </div>
                  ))}
                </div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{ background: "#c0392b", color: "#fff" }}>
                  🗺 {t.openInMaps}
                </a>
              </div>
            ) : (
              <p className="text-center py-8 text-sm" style={{ color: "#555" }}>{t.noRouteHint}</p>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h2 className="font-black text-base" style={{ color: "#e74c3c", fontFamily: "Georgia,serif" }}>
              ⏰ {t.timelineTitle}
            </h2>
            {locations.length > 0 ? (
              <Timeline locations={locations} />
            ) : (
              <p className="text-center py-8 text-sm" style={{ color: "#555" }}>{t.addFirst}</p>
            )}
          </div>
        )}

        {/* Budget Section */}
        <CollapsibleSection title={`💰 ${t.budgetTitle}`} rightContent={
          <span className="text-sm font-bold" style={{ color: "#f39c12" }}>{(totalBudget + extras).toFixed(2)} €</span>
        }>
          <div className="space-y-3">
            {locations.map(loc => {
              const cost = getEntryCost(loc.name, currentCity);
              return (
                <div key={loc.id} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "#333" }}>
                  <span className="text-xs" style={{ color: "#ccc" }}>{loc.icon} {loc.name}</span>
                  <span className="text-xs font-bold" style={{ color: cost && cost.max > 0 ? "#f39c12" : "#6dbf6d" }}>
                    {cost ? (cost.max > 0 ? `${cost.min === cost.max ? cost.max.toFixed(2) : `${cost.min.toFixed(2)}–${cost.max.toFixed(2)}`} ${cost.currency}` : t.free) : "?"}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs" style={{ color: "#888" }}>{t.budgetExtras}</span>
              <input type="number" value={extras} onChange={e => setExtras(Number(e.target.value) || 0)}
                className="w-24 px-2 py-1 rounded text-xs text-right" style={{ background: "#2a2a2a", color: "#f39c12", border: "1px solid #444" }} />
              <span className="text-xs" style={{ color: "#888" }}>€</span>
            </div>
            <div className="flex justify-between pt-2 border-t" style={{ borderColor: "#444" }}>
              <span className="text-sm font-bold" style={{ color: "#fff" }}>{t.budgetTotal}</span>
              <span className="text-sm font-bold" style={{ color: "#f39c12" }}>{(totalBudget + extras).toFixed(2)} €</span>
            </div>
            <p className="text-xs" style={{ color: "#555", fontStyle: "italic" }}>{t.budgetNote}</p>
          </div>
        </CollapsibleSection>

        {/* Save & Load Plans */}
        <CollapsibleSection title={`📋 ${t.savePlans}`} badge={savedPlans.length}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input value={planName} onChange={e => setPlanName(e.target.value)} placeholder={t.planNamePlaceholder}
                className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: "#2a2a2a", color: "#fff", border: "1px solid #444" }} />
              <button onClick={savePlan} disabled={!planName.trim() || locations.length === 0}
                className="px-4 py-2 rounded-lg text-xs font-bold" style={{ background: "#c0392b", color: "#fff", opacity: (!planName.trim() || locations.length === 0) ? 0.5 : 1 }}>
                {saveSuccess ? t.saved : t.save}
              </button>
            </div>
            {savedPlans.length > 0 && (
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: "#333" }}>
                <p className="text-xs font-bold" style={{ color: "#888" }}>{t.savedPlans}</p>
                {savedPlans.map((plan, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: "#2a2a2a" }}>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#ccc" }}>{plan.name}</p>
                      <p className="text-xs" style={{ color: "#666" }}>{(allCities[plan.city]?.emoji || "📍")} {allCities[plan.city]?.name || plan.city} · {plan.locations.length} {t.places}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => loadPlan(plan)} className="text-xs px-3 py-1 rounded font-bold" style={{ background: "#1a2a3a", color: "#5dade2" }}>{t.load}</button>
                      <button onClick={() => deletePlan(i)} className="text-xs px-2 py-1 rounded" style={{ color: "#e74c3c" }}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {savedPlans.length === 0 && <p className="text-xs text-center py-2" style={{ color: "#555" }}>{t.noPlans}</p>}
          </div>
        </CollapsibleSection>

        {/* Share Section */}
        <CollapsibleSection title={t.share}>
          <div className="space-y-3">
            <button onClick={(e) => { e.stopPropagation(); createShareLink(); }}
              className="w-full py-2 rounded-lg text-xs font-bold" style={{ background: "#c0392b", color: "#fff" }}>
              {t.createLink}
            </button>
            {shareLink && (
              <div className="space-y-2">
                <p className="text-xs" style={{ color: "#888" }}>{t.shareHint}</p>
                <div className="flex gap-2">
                  <input value={shareLink} readOnly className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: "#2a2a2a", color: "#5dade2", border: "1px solid #444" }} />
                  <button onClick={copyLink} className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: "#1a2a3a", color: "#5dade2" }}>
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs" style={{ color: "#333" }}>{t.footerText}</p>
        </div>
      </div>
    </div>
  );
}
