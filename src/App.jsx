import { useState, useEffect, useRef, useCallback } from "react";

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
    navBg: "rgba(28,24,18,0.97)",
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
    metroLines:{"7. Arrondissement -> 8. Arrondissement":{line:"M6",time:"12 min",stops:3},"8. Arrondissement -> 1. Arrondissement":{line:"M1",time:"18 min",stops:5}},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    metroLines:{},
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
    closedDay:"Geschlossen",unknownHours:"Öffnungszeiten unbekannt",reviews:"Bewertungen",
    budgetTitle:"Budget-Tracker",budgetTotal:"Gesamt",budgetExtras:"+ Extras:",
    budgetNote:"* Schätzungen.",savePlans:"Reisepläne",savedPlans:"Gespeicherte Pläne",
    planNamePlaceholder:"Planname",save:"Speichern",saved:"Gespeichert!",
    load:"Laden",noPlans:"Noch keine Pläne.",addFirst:"Füge Orte hinzu.",
    share:"Teilen",createLink:"Link erstellen",shareHint:"Teile diesen Link:",
    copy:"Kopieren",copied:"Kopiert!",warningTitle:"Achtung",
    warningClosed:"ist an dem gewählten Tag geschlossen!",warningHint:"Bitte Besuchstag ändern.",
    closed:"geschlossen",apiActive:"API aktiv",apiMissing:"API-Key fehlt",
    apiTitle:"OpenAI API-Key",apiHint:"Lokal gespeichert.",apiSave:"Speichern",
    apiSaved:"Gespeichert!",apiDelete:"Key löschen",footerText:"Reiseplaner v5.1",
    noRouteHint:"Füge mind. 2 Orte hinzu.",errorEmpty:"Bitte Link eingeben.",
    errorNotFound:"Link nicht erkannt.",
    days:["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"],
    admission:"Eintritt",free:"Kostenlos",close:"Schliessen",places:"Orte",
    selectCity:"Stadt wählen",customCity:"Andere Stadt",
    customCityPlaceholder:"Stadtname eingeben",customCityAdd:"Hinzufügen",
    switchCity:"Stadt wechseln",currentCity:"Aktuelle Stadt",
    travelTime:"Reisezeit",walkingTime:"zu Fuss",transitTime:"mit ÖPNV",
    notePlaceholder:"Notiz (z.B. Tickets vorbuchen!)",noteLabel:"Notiz",noteHide:"Ausblenden",
    sectionTrip:"Reisezeitraum",sectionMap:"Karte",sectionRoute:"Route & Timeline",
    labelStartDate:"Startdatum",labelDays:"Reisetage",labelDaysSuffix:"Tage",
    packingList:"Packliste",weather:"Wetter",budget:"Budget",
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
    closedDay:"Closed",unknownHours:"Hours unknown",reviews:"reviews",
    budgetTitle:"Budget Tracker",budgetTotal:"Total",budgetExtras:"+ Extras:",
    budgetNote:"* Estimates.",savePlans:"Travel Plans",savedPlans:"Saved Plans",
    planNamePlaceholder:"Plan name",save:"Save",saved:"Saved!",
    load:"Load",noPlans:"No plans yet.",addFirst:"Add places first.",
    share:"Share",createLink:"Create Link",shareHint:"Share this link:",
    copy:"Copy",copied:"Copied!",warningTitle:"Warning",
    warningClosed:"is closed on the selected day!",warningHint:"Please change the visit day.",
    closed:"closed",apiActive:"API active",apiMissing:"API Key missing",
    apiTitle:"OpenAI API Key",apiHint:"Stored locally.",apiSave:"Save",
    apiSaved:"Saved!",apiDelete:"Delete key",footerText:"Travel Planner v5.1",
    noRouteHint:"Add at least 2 places.",errorEmpty:"Please enter a link.",
    errorNotFound:"Link not recognized.",
    days:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    admission:"Admission",free:"Free",close:"Close",places:"Places",
    selectCity:"Select City",customCity:"Other City",
    customCityPlaceholder:"Enter city name",customCityAdd:"Add",
    switchCity:"Switch City",currentCity:"Current City",
    travelTime:"Travel time",walkingTime:"walking",transitTime:"by transit",
    notePlaceholder:"Note (e.g. Book tickets!)",noteLabel:"Note",noteHide:"Hide",
    sectionTrip:"Travel Period",sectionMap:"Map",sectionRoute:"Route & Timeline",
    labelStartDate:"Start date",labelDays:"Travel days",labelDaysSuffix:"days",
    packingList:"Packing List",weather:"Weather",budget:"Budget",
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
  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
    dayKey = getWeekdayKey(day);
  } else {
    dayKey = DAY_KEY_MAP[day] || null;
  }
  const isOpen = dayKey ? (info[dayKey] !== false) : true;
  return { isOpen, hours: info.hours, note: info.note };
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
  const bar = (w, h = 10, mt = 0) => (
    <div style={{ width: w, height: h, borderRadius: 6, background: th.skeletonShine, marginTop: mt }} />
  );
  return (
    <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 14, padding: "12px 14px" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: th.skeletonShine }} />
        <div style={{ flex: 1 }}>{bar("60%", 12)}{bar("40%", 8, 6)}</div>
      </div>
      {bar("90%", 8, 12)}{bar("75%", 8, 6)}{bar("50%", 8, 6)}
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
          <span key={i} style={{ fontSize:"0.75rem", color: i < full ? th.gold : (i === full && half ? th.gold : th.border) }}>
            {i < full ? "★" : (i === full && half ? "½" : "☆")}
          </span>
        ))}
      </div>
      <span style={{ fontSize:"0.72rem", color:th.textMuted }}>{stars}</span>
      {reviews && <span style={{ fontSize:"0.68rem", color:th.textFaint }}>({reviews.toLocaleString()} {lang==="de"?"Bew.":"rev."})</span>}
      {price && <span style={{ fontSize:"0.68rem", padding:"1px 6px", borderRadius:6, background:th.tag, color:th.tagText }}>{price}</span>}
      {badge && <span style={{ fontSize:"0.66rem", padding:"1px 6px", borderRadius:6, background:th.goldBg, color:th.gold, fontWeight:600 }}>{badge}</span>}
    </div>
  );
}

function TravelTimeBadge({ from, to, mode, th }) {
  const tt = calcTravelTime(from, to);
  if (!tt) return null;
  const time = mode === "walking" ? tt.walkMin : tt.transitMin;
  const icon = mode === "walking" ? "🚶" : "🚇";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.7rem", color:th.textMuted, padding:"3px 8px", background:th.surface, borderRadius:20, border:`1px solid ${th.border}` }}>
      <span>{icon}</span><span>{time} min</span><span style={{ color:th.textFaint }}>· {tt.distKm} km</span>
    </div>
  );
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
    { id:"passport", label:lang==="de"?"Reisepass / Ausweis":"Passport / ID", always:true },
    { id:"phone", label:lang==="de"?"Handy + Ladekabel":"Phone + charger", always:true },
    { id:"money", label:lang==="de"?"Karte + Bargeld":"Card + cash", always:true },
    { id:"insurance", label:lang==="de"?"Reiseversicherung":"Travel insurance", always:true },
    { id:"clothes", label:lang==="de"?`Kleidung für ${numDays} Tage`:`Clothes for ${numDays} days`, always:true },
    { id:"shoes", label:lang==="de"?"Bequeme Schuhe":"Comfortable shoes", cond:hasMuseum||hasPark },
    { id:"camera", label:lang==="de"?"Kamera / Powerbank":"Camera / powerbank", cond:hasMuseum||hasChurch },
    { id:"smart", label:lang==="de"?"Schicke Kleidung":"Smart clothes", cond:hasRestaurant },
    { id:"bag", label:lang==="de"?"Einkaufstasche":"Shopping bag", cond:hasMarkt },
    { id:"sun", label:lang==="de"?"Sonnencreme":"Sunscreen", cond:hasPark },
    { id:"cover", label:lang==="de"?"Schulterbedeckung":"Shoulder cover", cond:hasChurch },
    { id:"adapter", label:lang==="de"?"Reiseadapter":"Travel adapter", cond:longTrip },
    { id:"meds", label:lang==="de"?"Medikamente":"Medication", cond:longTrip },
    { id:"guide", label:lang==="de"?"Reiseführer / Offline-Karten":"Guidebook / offline maps", always:true },
  ].filter(item => item.always || item.cond);
  const allItems = [...autoItems, ...customItems.map((label, i) => ({ id:`custom_${i}`, label }))];
  const doneCount = allItems.filter(item => checked[item.id]).length;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
        <span style={{ fontSize:"0.75rem", color:th.textMuted }}>{doneCount}/{allItems.length}</span>
        <div style={{ height:5, flex:1, background:th.border, borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${allItems.length?(doneCount/allItems.length)*100:0}%`, background:th.accent, borderRadius:4, transition:"width 0.3s" }} />
        </div>
      </div>
      {allItems.map(item => (
        <label key={item.id} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"6px 10px", borderRadius:8, background:checked[item.id]?th.accentLight:th.surface, border:`1px solid ${checked[item.id]?th.accent:th.border}` }}>
          <input type="checkbox" checked={!!checked[item.id]} onChange={() => setChecked(c => ({ ...c, [item.id]:!c[item.id] }))} style={{ accentColor:th.accent, width:15, height:15 }} />
          <span style={{ fontSize:"0.82rem", color:checked[item.id]?th.textFaint:th.text, textDecoration:checked[item.id]?"line-through":"none" }}>{item.label}</span>
        </label>
      ))}
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        <input value={customItem} onChange={e => setCustomItem(e.target.value)}
          onKeyDown={e => { if(e.key==="Enter"&&customItem.trim()){setCustomItems(c=>[...c,customItem.trim()]);setCustomItem("");}}}
          placeholder={lang==="de"?"Eigenes Item...":"Custom item..."}
          style={{ flex:1, fontSize:"0.82rem", padding:"5px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
        <button onClick={() => { if(customItem.trim()){setCustomItems(c=>[...c,customItem.trim()]);setCustomItem("");}}}
          style={{ padding:"5px 12px", borderRadius:8, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700 }}>+</button>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, icon, children, defaultOpen = true, badge, th }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, overflow:"hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"13px 16px", background:"none", border:"none", cursor:"pointer", color:th.text }}>
        <span style={{ fontSize:"1rem" }}>{icon}</span>
        <span style={{ fontWeight:700, fontSize:"0.88rem", flex:1, textAlign:"left", color:th.text }}>{title}</span>
        {badge && <span style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:20, background:th.accentLight, color:th.accent, fontWeight:700 }}>{badge}</span>}
        <span style={{ fontSize:"0.75rem", color:th.textMuted, transition:"transform 0.2s", display:"inline-block", transform:open?"rotate(180deg)":"rotate(0deg)" }}>▼</span>
      </button>
      {open && <div style={{ padding:"0 16px 14px" }}>{children}</div>}
    </div>
  );
}

function LocationCard({ loc, index, dayColor, onRemove, onDayChange, tripDays, locationDays, locationNotes, onNoteChange, city, lang, t, travelMode }) {
  const { th } = useTheme();
  const [showInfo, setShowInfo] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const assignedDay = locationDays?.[loc.id] ?? (tripDays?.[0] || null);
  const rating = getRating(loc.name, city);
  const cost = getEntryCost(loc.name, city);
  const info = getLocationInfo(loc.name, city);
  const openInfo = getOpeningInfo(loc.name, assignedDay, city);
  const isClosed = openInfo && !openInfo.isOpen;
  const note = locationNotes?.[loc.id] || "";

  return (
    <div style={{
      background:th.card, border:`1px solid ${isClosed?th.warning:th.border}`,
      borderRadius:14, padding:"10px 12px", position:"relative",
      boxShadow:isClosed?`0 0 0 2px ${th.warning}22`:"none",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:dayColor?`${dayColor}22`:th.accentLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0, border:`2px solid ${dayColor||th.accent}` }}>
          {loc.icon || "📍"}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:"0.88rem", color:th.text, lineHeight:1.2 }}>{loc.name}</div>
          <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:2 }}>{loc.type}{loc.area ? ` · ${loc.area}` : ""}{loc.duration ? ` · ⏱ ${loc.duration}` : ""}</div>
          {rating && <StarRating {...rating} lang={lang} th={th} />}
          {cost && (
            <div style={{ fontSize:"0.7rem", color:th.textMuted, marginTop:4 }}>
              {t.admission}: {cost.min === 0 && cost.max === 0
                ? <span style={{ color:th.success, fontWeight:700 }}>{t.free}</span>
                : <span style={{ color:th.accent, fontWeight:600 }}>{cost.currency}{cost.min}{cost.max!==cost.min?`–${cost.currency}${cost.max}`:""}</span>}
              {cost.note && <span style={{ color:th.textFaint }}> · {cost.note}</span>}
            </div>
          )}
          {openInfo && (
            <div style={{ fontSize:"0.7rem", marginTop:3, color:isClosed?th.warning:th.success }}>
              {isClosed ? `⛔ ${t.closedDay}` : `✓ ${openInfo.hours||""}`}
              {openInfo.note && <span style={{ color:th.textFaint }}> · {openInfo.note}</span>}
            </div>
          )}
        </div>
        <button onClick={() => onRemove(loc.id)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"1rem", padding:"2px 4px", lineHeight:1 }}>×</button>
      </div>

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8, alignItems:"center" }}>
        <select value={assignedDay || ""} onChange={e => onDayChange(loc.id, e.target.value)}
          style={{ fontSize:"0.7rem", padding:"3px 6px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, flex:1, minWidth:120 }}>
          {(tripDays||[]).map((d,i) => (
            <option key={d} value={d}>{formatDateLabel(d, lang)} (Tag {i+1})</option>
          ))}
        </select>
        {info && (
          <button onClick={() => setShowInfo(v => !v)} style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, background:showInfo?th.accentLight:th.surface, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>
            {showInfo ? t.infoHide : t.infoShow}
          </button>
        )}
        <button onClick={() => setShowNote(v => !v)} style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, background:showNote?th.accentLight:th.surface, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>
          ✏️ {note ? t.noteHide : t.noteLabel}
        </button>
        {loc.lat && loc.lng && (
          <a href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:"0.68rem", padding:"3px 8px", borderRadius:8, background:th.surface, border:`1px solid ${th.border}`, color:th.info, cursor:"pointer", textDecoration:"none" }}>
            🗺
          </a>
        )}
      </div>

      {showInfo && info && (
        <div style={{ marginTop:8, padding:"8px 10px", borderRadius:10, background:th.surface, border:`1px solid ${th.border}` }}>
          <div style={{ fontSize:"0.78rem", color:th.text, marginBottom:6 }}>{info.short}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
            {(info.highlights||[]).map((h,i) => (
              <span key={i} style={{ fontSize:"0.68rem", padding:"2px 8px", borderRadius:20, background:th.tag, color:th.tagText }}>✦ {h}</span>
            ))}
          </div>
        </div>
      )}

      {showNote && (
        <textarea value={note} onChange={e => onNoteChange(loc.id, e.target.value)}
          placeholder={t.notePlaceholder} rows={2}
          style={{ width:"100%", marginTop:8, fontSize:"0.78rem", padding:"6px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, resize:"vertical", fontFamily:"inherit", boxSizing:"border-box" }} />
      )}
    </div>
  );
}

function BudgetPanel({ locations, city, lang, t, th }) {
  const safeLocations = Array.isArray(locations) ? locations : [];
  const [extras, setExtras] = useState(0);
  let total = 0;
  const rows = safeLocations.map(loc => {
    const cost = getEntryCost(loc.name, city);
    const mid = cost ? (cost.min + cost.max) / 2 : 0;
    total += mid;
    return { name: loc.name, cost, mid };
  });
  total += Number(extras) || 0;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {rows.map((r,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"0.8rem", padding:"5px 8px", borderRadius:8, background:th.card, border:`1px solid ${th.border}` }}>
          <span style={{ color:th.text }}>{r.name}</span>
          <span style={{ color:r.mid===0?th.success:th.accent, fontWeight:600 }}>
            {r.mid === 0 ? t.free : `~${r.cost?.currency}${Math.round(r.mid)}`}
          </span>
        </div>
      ))}
      <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.8rem", marginTop:4 }}>
        <span style={{ color:th.textMuted, whiteSpace:"nowrap" }}>{t.budgetExtras}</span>
        <input type="number" value={extras} onChange={e => setExtras(e.target.value)} min={0}
          style={{ width:80, padding:"4px 8px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, fontSize:"0.8rem" }} />
        <span style={{ color:th.textFaint }}>€</span>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", borderRadius:10, background:th.accentLight, border:`1px solid ${th.accent}`, marginTop:4 }}>
        <span style={{ fontWeight:700, color:th.text }}>{t.budgetTotal}</span>
        <span style={{ fontWeight:800, fontSize:"1.1rem", color:th.accent }}>~€{Math.round(total)}</span>
      </div>
      <div style={{ fontSize:"0.68rem", color:th.textFaint }}>{t.budgetNote}</div>
    </div>
  );
}

function RouteTimeline({ locations, locationDays, tripDays, travelMode, city, lang, t, th }) {
  const safeLocations = Array.isArray(locations) ? locations : [];
  const safeTripDays = Array.isArray(tripDays) ? tripDays : [];
  if (safeLocations.length < 2) {
    return <div style={{ color:th.textMuted, fontSize:"0.82rem", textAlign:"center", padding:"20px 0" }}>{t.noRouteHint}</div>;
  }
  const byDay = {};
  safeTripDays.forEach(d => { byDay[d] = []; });
  safeLocations.forEach(loc => {
    const day = locationDays?.[loc.id] ?? safeTripDays[0];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(loc);
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {safeTripDays.map((day, di) => {
        const dayLocs = byDay[day] || [];
        if (dayLocs.length === 0) return null;
        const color = getDayColor(di);
        return (
          <div key={day}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:color }} />
              <span style={{ fontWeight:700, fontSize:"0.82rem", color:th.text }}>{formatDateLabel(day, lang)} – Tag {di+1}</span>
              <span style={{ fontSize:"0.72rem", color:th.textMuted }}>{dayLocs.length} {t.stops}</span>
            </div>
            <div style={{ position:"relative", paddingLeft:20 }}>
              <div style={{ position:"absolute", left:4, top:0, bottom:0, width:2, background:`${color}44`, borderRadius:2 }} />
              {dayLocs.map((loc, li) => (
                <div key={loc.id}>
                  <div style={{ position:"relative", display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ position:"absolute", left:-20, top:8, width:10, height:10, borderRadius:"50%", background:color, border:`2px solid ${th.surface}`, zIndex:1 }} />
                    <div style={{ flex:1, background:th.card, border:`1px solid ${th.border}`, borderRadius:10, padding:"8px 10px" }}>
                      <div style={{ fontWeight:700, fontSize:"0.82rem", color:th.text }}>{loc.icon} {loc.name}</div>
                      <div style={{ fontSize:"0.7rem", color:th.textMuted, marginTop:2 }}>{loc.type}{loc.duration ? ` · ⏱ ${loc.duration}` : ""}</div>
                    </div>
                  </div>
                  {li < dayLocs.length - 1 && (
                    <div style={{ paddingLeft:0, marginBottom:6 }}>
                      <TravelTimeBadge from={loc} to={dayLocs[li+1]} mode={travelMode} th={th} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MapPlaceholder({ locations, locationDays, tripDays, city, th }) {
  const safeLocations = Array.isArray(locations) ? locations : [];
  const cityData = city || CITIES.paris;
  const center = { lat: cityData.lat, lng: cityData.lng };
  const svgW = 340, svgH = 200;
  const allLats = [center.lat, ...safeLocations.filter(l=>l.lat).map(l=>l.lat)];
  const allLngs = [center.lng, ...safeLocations.filter(l=>l.lng).map(l=>l.lng)];
  const minLat = Math.min(...allLats), maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs), maxLng = Math.max(...allLngs);
  const padLat = Math.max((maxLat - minLat) * 0.3, 0.01);
  const padLng = Math.max((maxLng - minLng) * 0.3, 0.01);
  const latRange = maxLat - minLat + padLat * 2;
  const lngRange = maxLng - minLng + padLng * 2;
  const toSvg = (lat, lng) => ({
    x: ((lng - minLng + padLng) / lngRange) * svgW,
    y: svgH - ((lat - minLat + padLat) / latRange) * svgH
  });
  const locPoints = safeLocations.filter(l=>l.lat&&l.lng).map((l,i) => {
    const day = locationDays?.[l.id] ?? (tripDays?.[0] || null);
    const dayIdx = tripDays ? tripDays.indexOf(day) : 0;
    return { ...toSvg(l.lat, l.lng), color: getDayColor(dayIdx < 0 ? 0 : dayIdx), label: l.icon || "📍", name: l.name, idx: i };
  });

  return (
    <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${th.border}`, background:th.card, position:"relative" }}>
      <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} style={{ display:"block" }}>
        <rect width={svgW} height={svgH} fill={th.surface} />
        <rect x={svgW*0.1} y={svgH*0.15} width={svgW*0.8} height={svgH*0.7} rx={8} fill={th.bg} stroke={th.border} strokeWidth={1} opacity={0.5}/>
        {[...Array(5)].map((_,i) => (
          <line key={`h${i}`} x1={0} y1={svgH*(i+1)/6} x2={svgW} y2={svgH*(i+1)/6} stroke={th.border} strokeWidth={0.5} opacity={0.4} />
        ))}
        {[...Array(6)].map((_,i) => (
          <line key={`v${i}`} x1={svgW*(i+1)/7} y1={0} x2={svgW*(i+1)/7} y2={svgH} stroke={th.border} strokeWidth={0.5} opacity={0.4} />
        ))}
        {locPoints.length > 1 && locPoints.map((pt, i) => i < locPoints.length - 1 && (
          <line key={`line${i}`} x1={pt.x} y1={pt.y} x2={locPoints[i+1].x} y2={locPoints[i+1].y} stroke={th.accent} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
        ))}
        {locPoints.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r={14} fill={pt.color} opacity={0.18} />
            <circle cx={pt.x} cy={pt.y} r={9} fill={pt.color} opacity={0.85} />
            <text x={pt.x} y={pt.y+4} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="bold">{i+1}</text>
          </g>
        ))}
        <text x={svgW/2} y={svgH-6} textAnchor="middle" fontSize={9} fill={th.textFaint}>{cityData.name} · {safeLocations.length} Orte</text>
      </svg>
    </div>
  );
}

function WeatherWidget({ city, startDate, numDays, lang, th }) {
  const conditions = ["☀️ Sonnig","🌤 Leicht bewölkt","⛅ Bewölkt","🌦 Wechselhaft","🌧 Regnerisch"];
  const temps = { paris:[14,16,17,15,13], london:[11,12,10,9,13], berlin:[12,15,14,11,10], rom:[20,22,21,19,18], barcelona:[18,20,19,21,17], wien:[13,15,14,12,11], amsterdam:[10,12,11,9,13], prag:[11,14,13,10,12], lissabon:[17,19,18,20,16], new_york:[13,15,14,12,11] };
  const cityTemps = temps[city?.id] || [15,16,14,13,15];
  const days = generateTripDays(startDate || new Date().toISOString().slice(0,10), Math.min(numDays||4, 5));
  return (
    <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
      {days.map((d,i) => {
        const cond = conditions[i % conditions.length];
        const temp = cityTemps[i % cityTemps.length];
        return (
          <div key={d} style={{ minWidth:70, textAlign:"center", padding:"8px 6px", borderRadius:10, background:th.card, border:`1px solid ${th.border}`, flexShrink:0 }}>
            <div style={{ fontSize:"0.65rem", color:th.textMuted, marginBottom:4 }}>{formatDateLabel(d, lang)}</div>
            <div style={{ fontSize:"1.2rem" }}>{cond.split(" ")[0]}</div>
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:th.text, marginTop:2 }}>{temp}°C</div>
            <div style={{ fontSize:"0.6rem", color:th.textFaint, marginTop:2 }}>{cond.split(" ").slice(1).join(" ")}</div>
          </div>
        );
      })}
    </div>
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 900);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

export default function App() {
  const { mode, th } = useTheme();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 640;
  const [lang, setLang] = useState("de");
  const t = TRANSLATIONS[lang];

  const [cityId, setCityId] = useState("paris");
  const city = CITIES[cityId] || CITIES.paris;

  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0,10));
  const [numDays, setNumDays] = useState(4);
  const [tripDays, setTripDays] = useState(() => generateTripDays(new Date().toISOString().slice(0,10), 4));

  const [locations, setLocations, { undo, redo, canUndo, canRedo }] = useUndoRedo([]);
  const [locationDays, setLocationDays] = useState({});
  const [locationNotes, setLocationNotes] = useState({});

  const [linkInput, setLinkInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  const [travelMode, setTravelMode] = useState("walking");
  const [activeTab, setActiveTab] = useState("route");
  const [filterDay, setFilterDay] = useState("all");

  const [savedPlans, setSavedPlans] = useState(() => safeLocalGet("rp_plans_v2", []));
  const [planName, setPlanName] = useState("");
  const [saveFlash, setSaveFlash] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copyFlash, setCopyFlash] = useState(false);

  const [apiKey, setApiKey] = useState(() => safeLocalGet("rp_apikey", ""));
  const [apiInput, setApiInput] = useState("");
  const [apiSaved, setApiSaved] = useState(false);
  const [showApiPanel, setShowApiPanel] = useState(false);

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [customCityInput, setCustomCityInput] = useState("");

  const safeLocations = Array.isArray(locations) ? locations : [];

  useEffect(() => {
    const newDays = generateTripDays(startDate, numDays);
    setTripDays(newDays);
    setLocationDays(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        if (!newDays.includes(updated[id])) updated[id] = newDays[0];
      });
      return updated;
    });
  }, [startDate, numDays]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      * { box-sizing: border-box; }
      body { margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      ::-webkit-scrollbar { width:5px; height:5px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:#5a4a30; border-radius:10px; }
      select option { background: #26211a; color: #ede0c8; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const analyzeLink = useCallback(async () => {
    if (!linkInput.trim()) { setLinkError(t.errorEmpty); return; }
    setLinkError("");
    setAnalyzing(true);
    setSkeletonVisible(true);
    await new Promise(r => setTimeout(r, 900));
    const url = linkInput.trim();
    let matched = null;
    for (const matcher of (city.linkMatchers || [])) {
      if (matcher.pattern.test(url)) {
        matched = city.sampleLocations?.[matcher.locationIndex];
        break;
      }
    }
    if (!matched) {
      const lower = url.toLowerCase();
      matched = city.sampleLocations?.find(loc =>
        lower.includes(loc.name.toLowerCase().split(" ")[0].toLowerCase())
      );
    }
    if (matched) {
      const newLoc = { ...matched, id: Date.now() + Math.random() };
      setLocations(prev => [...(Array.isArray(prev)?prev:[]), newLoc]);
      setLocationDays(prev => ({ ...prev, [newLoc.id]: tripDays[0] }));
      setLinkInput("");
    } else {
      setLinkError(t.errorNotFound);
    }
    setAnalyzing(false);
    setSkeletonVisible(false);
  }, [linkInput, city, tripDays, t, setLocations]);

  const addDemoLocation = useCallback((loc) => {
    const newLoc = { ...loc, id: Date.now() + Math.random() };
    setLocations(prev => [...(Array.isArray(prev)?prev:[]), newLoc]);
    setLocationDays(prev => ({ ...prev, [newLoc.id]: tripDays[0] }));
  }, [tripDays, setLocations]);

  const removeLocation = useCallback((id) => {
    setLocations(prev => (Array.isArray(prev)?prev:[]).filter(l => l.id !== id));
    setLocationDays(prev => { const n={...prev}; delete n[id]; return n; });
    setLocationNotes(prev => { const n={...prev}; delete n[id]; return n; });
  }, [setLocations]);

  const handleDayChange = useCallback((locId, day) => {
    setLocationDays(prev => ({ ...prev, [locId]: day }));
  }, []);

  const handleNoteChange = useCallback((locId, note) => {
    setLocationNotes(prev => ({ ...prev, [locId]: note }));
  }, []);

  const savePlan = () => {
    if (!safeLocations.length) return;
    const plan = normalizePlan({ id: Date.now(), name: planName || `${city.name} – ${startDate}`, cityId, startDate, numDays, tripDays, locations: safeLocations, locationDays, locationNotes });
    const updated = [plan, ...savedPlans.filter(p => p.name !== plan.name)].slice(0, 20);
    setSavedPlans(updated);
    safeLocalSet("rp_plans_v2", updated);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const loadPlan = (plan) => {
    const norm = normalizePlan(plan);
    if (!norm) return;
    setCityId(norm.cityId);
    setStartDate(norm.startDate);
    setNumDays(norm.numDays);
    setTripDays(norm.tripDays);
    setLocations(norm.locations);
    setLocationDays(norm.locationDays);
    setLocationNotes(norm.locationNotes);
    setPlanName(norm.name);
  };

  const deletePlan = (id) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    safeLocalSet("rp_plans_v2", updated);
  };

  const createShareLink = () => {
    try {
      const data = { cityId, startDate, numDays, locations: safeLocations, locationDays, locationNotes };
      const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
      const url = `${window.location.href.split("?")[0]}?plan=${encoded}`;
      setShareUrl(url);
    } catch { setShareUrl(""); }
  };

  const copyShareUrl = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyFlash(true);
      setTimeout(() => setCopyFlash(false), 2000);
    });
  };

  const saveApiKey = () => {
    safeLocalSet("rp_apikey", apiInput);
    setApiKey(apiInput);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  const deleteApiKey = () => {
    safeLocalSet("rp_apikey", "");
    setApiKey("");
    setApiInput("");
  };

  const filteredLocations = filterDay === "all"
    ? safeLocations
    : safeLocations.filter(l => (locationDays[l.id] ?? tripDays[0]) === filterDay);

  const closedWarnings = safeLocations.filter(loc => {
    const day = locationDays[loc.id] ?? tripDays[0];
    const info = getOpeningInfo(loc.name, day, city);
    return info && !info.isOpen;
  });

  const dayColorMap = {};
  tripDays.forEach((d,i) => { dayColorMap[d] = getDayColor(i); });

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, transition:"background 0.3s, color 0.3s" }}>
      {/* Navbar */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:th.navBg, borderBottom:`1px solid ${th.border}`, backdropFilter:"blur(12px)", padding:"0 16px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", gap:12, height:52 }}>
          <span style={{ fontSize:"1.2rem" }}>{city.emoji}</span>
          <span style={{ fontWeight:800, fontSize:"1rem", color:th.text, letterSpacing:"-0.02em" }}>{t.appName}</span>
          <span style={{ fontSize:"0.7rem", padding:"2px 8px", borderRadius:20, background:th.accentLight, color:th.accent, fontWeight:700 }}>v5.1</span>
          <div style={{ flex:1 }} />
          <button onClick={() => setShowCityPicker(v=>!v)} style={{ fontSize:"0.75rem", padding:"4px 10px", borderRadius:20, background:th.surface, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>
            {city.country} {city.name}
          </button>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{ fontSize:"0.75rem", padding:"4px 8px", borderRadius:20, background:th.surface, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>
            <option value="de">🇩🇪 DE</option>
            <option value="en">🇬🇧 EN</option>
          </select>
          <button onClick={toggleTheme} style={{ fontSize:"1rem", padding:"4px 8px", borderRadius:20, background:th.surface, border:`1px solid ${th.border}`, cursor:"pointer" }}>
            {mode === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setShowApiPanel(v=>!v)} style={{ fontSize:"0.65rem", padding:"3px 8px", borderRadius:20, background:apiKey?th.successBg:th.warningBg, border:`1px solid ${apiKey?th.success:th.warning}`, color:apiKey?th.success:th.warning, cursor:"pointer" }}>
            {apiKey ? t.apiActive : t.apiMissing}
          </button>}
        </div>
      </div>

      {/* City Picker */}
      {showCityPicker && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={() => setShowCityPicker(false)}>
          <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:20, width:"100%", maxWidth:480, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:"1rem", color:th.text, marginBottom:16 }}>🌍 {t.selectCity}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.values(CITIES).map(c => (
                <button key={c.id} onClick={() => { setCityId(c.id); setLocations([]); setLocationDays({}); setLocationNotes({}); setShowCityPicker(false); }}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:12, background:cityId===c.id?th.accentLight:th.card, border:`1px solid ${cityId===c.id?th.accent:th.border}`, cursor:"pointer", color:th.text, fontWeight:cityId===c.id?700:400 }}>
                  <span style={{ fontSize:"1.2rem" }}>{c.emoji}</span>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ fontSize:"0.82rem", fontWeight:700 }}>{c.name}</div>
                    <div style={{ fontSize:"0.68rem", color:th.textMuted }}>{c.country}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop:16, display:"flex", gap:8 }}>
              <input value={customCityInput} onChange={e=>setCustomCityInput(e.target.value)} placeholder={t.customCityPlaceholder}
                style={{ flex:1, fontSize:"0.82rem", padding:"8px 12px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
              <button onClick={() => { if(customCityInput.trim()){setCustomCityInput("");setShowCityPicker(false);}}}
                style={{ padding:"8px 14px", borderRadius:10, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700 }}>{t.customCityAdd}</button>
            </div>
            <button onClick={() => setShowCityPicker(false)} style={{ marginTop:12, width:"100%", padding:"8px", borderRadius:10, background:th.card, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>{t.close}</button>
          </div>
        </div>
      )}

      {/* API Panel */}
      {showApiPanel && (
        <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={() => setShowApiPanel(false)}>
          <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:20, padding:20, width:"100%", maxWidth:360 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800, fontSize:"1rem", color:th.text, marginBottom:8 }}>🔑 {t.apiTitle}</div>
            <div style={{ fontSize:"0.75rem", color:th.textMuted, marginBottom:12 }}>{t.apiHint}</div>
            <input type="password" value={apiInput} onChange={e=>setApiInput(e.target.value)} placeholder="sk-..."
              style={{ width:"100%", fontSize:"0.82rem", padding:"8px 12px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, marginBottom:10 }} />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={saveApiKey} style={{ flex:1, padding:"8px", borderRadius:10, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700 }}>
                {apiSaved ? t.apiSaved : t.apiSave}
              </button>
              <button onClick={deleteApiKey} style={{ padding:"8px 12px", borderRadius:10, background:th.warningBg, border:`1px solid ${th.warning}`, color:th.warning, cursor:"pointer" }}>
                {t.apiDelete}
              </button>
            </div>
            <button onClick={() => setShowApiPanel(false)} style={{ marginTop:10, width:"100%", padding:"7px", borderRadius:10, background:th.card, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>{t.close}</button>
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"16px 12px 40px" }}>

        {/* Closed Warnings */}
        {closedWarnings.length > 0 && (
          <div style={{ background:th.warningBg, border:`1px solid ${th.warning}`, borderRadius:12, padding:"10px 14px", marginBottom:12, animation:"fadeIn 0.3s ease" }}>
            <div style={{ fontWeight:700, fontSize:"0.82rem", color:th.warning, marginBottom:4 }}>⚠️ {t.warningTitle}</div>
            {closedWarnings.map(loc => (
              <div key={loc.id} style={{ fontSize:"0.78rem", color:th.warning }}>
                <b>{loc.name}</b> {t.warningClosed}
              </div>
            ))}
            <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:4 }}>{t.warningHint}</div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Left Column */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Trip Period */}
            <CollapsibleSection title={t.sectionTrip} icon="📅" th={th} defaultOpen={true}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:10, paddingTop:4 }}>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:"0.7rem", color:th.textMuted, fontWeight:600 }}>{t.labelStartDate}</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}
                    style={{ fontSize:"0.82rem", padding:"6px 10px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  <label style={{ fontSize:"0.7rem", color:th.textMuted, fontWeight:600 }}>{t.labelDays} ({numDays} {t.labelDaysSuffix})</label>
                  <input type="range" min={1} max={14} value={numDays} onChange={e=>setNumDays(Number(e.target.value))}
                    style={{ width:140, accentColor:th.accent, marginTop:6 }} />
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                {tripDays.map((d,i) => (
                  <div key={d} style={{ fontSize:"0.68rem", padding:"3px 10px", borderRadius:20, background:`${getDayColor(i)}22`, border:`1px solid ${getDayColor(i)}88`, color:th.text }}>
                    {formatDateLabel(d, lang)}
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Add Location */}
            <CollapsibleSection title={t.addPlace} icon="➕" th={th} defaultOpen={true}>
              <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={linkInput} onChange={e=>{setLinkInput(e.target.value);setLinkError("");}}
                    onKeyDown={e=>{if(e.key==="Enter")analyzeLink();}}
                    placeholder={t.linkPlaceholder}
                    style={{ flex:1, fontSize:"0.82rem", padding:"8px 12px", borderRadius:12, background:th.input, color:th.text, border:`1px solid ${linkError?th.warning:th.inputBorder}` }} />
                  <button onClick={analyzeLink} disabled={analyzing}
                    style={{ padding:"8px 14px", borderRadius:12, background:analyzing?th.surface:th.accent, color:analyzing?th.textMuted:th.bg, border:`1px solid ${th.border}`, cursor:analyzing?"not-allowed":"pointer", fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                    {analyzing ? <Spinner size={14} /> : null}
                    {analyzing ? t.analyzing : t.analyze}
                  </button>
                </div>
                {linkError && <div style={{ fontSize:"0.75rem", color:th.warning }}>{linkError}</div>}
                {skeletonVisible && <SkeletonCard th={th} />}
                <div>
                  <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:6 }}>{t.demo}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {(city.sampleLocations||[]).map(loc => (
                      <button key={loc.id} onClick={()=>addDemoLocation(loc)}
                        style={{ fontSize:"0.72rem", padding:"4px 10px", borderRadius:20, background:th.tag, border:`1px solid ${th.border}`, color:th.tagText, cursor:"pointer" }}>
                        {loc.icon} {loc.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Locations List */}
            {safeLocations.length > 0 && (
              <CollapsibleSection title={`${t.myPlaces} (${safeLocations.length})`} icon="📍" th={th} defaultOpen={true}
                badge={`${safeLocations.length} ${t.places}`}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10, paddingTop:4 }}>
                  <button onClick={()=>setFilterDay("all")} style={{ fontSize:"0.7rem", padding:"3px 10px", borderRadius:20, background:filterDay==="all"?th.accent:th.surface, color:filterDay==="all"?th.bg:th.textMuted, border:`1px solid ${th.border}`, cursor:"pointer" }}>{t.allDays}</button>
                  {tripDays.map((d,i) => (
                    <button key={d} onClick={()=>setFilterDay(d)} style={{ fontSize:"0.7rem", padding:"3px 10px", borderRadius:20, background:filterDay===d?getDayColor(i):th.surface, color:filterDay===d?th.bg:th.textMuted, border:`1px solid ${filterDay===d?getDayColor(i):th.border}`, cursor:"pointer" }}>
                      {formatDateLabel(d, lang)}
                    </button>
                  ))}
                </div>

                <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <button onClick={undo} disabled={!canUndo} style={{ fontSize:"0.72rem", padding:"3px 10px", borderRadius:8, background:th.surface, border:`1px solid ${th.border}`, color:canUndo?th.textMuted:th.textFaint, cursor:canUndo?"pointer":"default" }}>↩ Undo</button>
                  <button onClick={redo} disabled={!canRedo} style={{ fontSize:"0.72rem", padding:"3px 10px", borderRadius:8, background:th.surface, border:`1px solid ${th.border}`, color:canRedo?th.textMuted:th.textFaint, cursor:canRedo?"pointer":"default" }}>↪ Redo</button>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {filteredLocations.map((loc, i) => {
                    const day = locationDays[loc.id] ?? tripDays[0];
                    const dayIdx = tripDays.indexOf(day);
                    const color = getDayColor(dayIdx < 0 ? 0 : dayIdx);
                    return (
                      <LocationCard key={loc.id} loc={loc} index={i} dayColor={color}
                        onRemove={removeLocation} onDayChange={handleDayChange}
                        tripDays={tripDays} locationDays={locationDays}
                        locationNotes={locationNotes} onNoteChange={handleNoteChange}
                        city={city} lang={lang} t={t} travelMode={travelMode} />
                    );
                  })}
                </div>
              </CollapsibleSection>
            )}

            {/* Map */}
            <CollapsibleSection title={t.sectionMap} icon="🗺️" th={th} defaultOpen={true}>
              <div style={{ paddingTop:4 }}>
                <MapPlaceholder locations={safeLocations} locationDays={locationDays} tripDays={tripDays} city={city} th={th} />
              </div>
            </CollapsibleSection>

            {/* Route & Timeline */}
            <CollapsibleSection title={t.sectionRoute} icon="🧭" th={th} defaultOpen={true}>
              <div style={{ paddingTop:4 }}>
                <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
                  {["route","timeline"].map(tab => (
                    <button key={tab} onClick={()=>setActiveTab(tab)}
                      style={{ fontSize:"0.75rem", padding:"4px 12px", borderRadius:20, background:activeTab===tab?th.accent:th.surface, color:activeTab===tab?th.bg:th.textMuted, border:`1px solid ${th.border}`, cursor:"pointer", fontWeight:activeTab===tab?700:400 }}>
                      {tab==="route"?t.route:t.timeline}
                    </button>
                  ))}
                  <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
                    {["walking","transit"].map(mode => (
                      <button key={mode} onClick={()=>setTravelMode(mode)}
                        style={{ fontSize:"0.72rem", padding:"3px 10px", borderRadius:20, background:travelMode===mode?th.accentLight:th.surface, color:travelMode===mode?th.accent:th.textMuted, border:`1px solid ${travelMode===mode?th.accent:th.border}`, cursor:"pointer" }}>
                        {mode==="walking"?"🚶":"🚇"} {mode==="walking"?t.walking:t.transit}
                      </button>
                    ))}
                  </div>
                </div>
                <RouteTimeline locations={safeLocations} locationDays={locationDays} tripDays={tripDays} travelMode={travelMode} city={city} lang={lang} t={t} th={th} />
              </div>
            </CollapsibleSection>

          </div>

          {/* Right Column */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Weather */}
            <CollapsibleSection title={t.weather} icon="🌤" th={th} defaultOpen={true}>
              <div style={{ paddingTop:4 }}>
                <WeatherWidget city={city} startDate={startDate} numDays={numDays} lang={lang} th={th} />
              </div>
            </CollapsibleSection>

            {/* Budget */}
            {safeLocations.length > 0 && (
              <CollapsibleSection title={t.budgetTitle} icon="💰" th={th} defaultOpen={true}>
                <div style={{ paddingTop:4 }}>
                  <BudgetPanel locations={safeLocations} city={city} lang={lang} t={t} th={th} />
                </div>
              </CollapsibleSection>
            )}

            {/* Packing List */}
            <CollapsibleSection title={t.packingList} icon="🧳" th={th} defaultOpen={false}>
              <div style={{ paddingTop:4 }}>
                <PackingList locations={safeLocations} numDays={numDays} lang={lang} />
              </div>
            </CollapsibleSection>

            {/* Save Plans */}
            <CollapsibleSection title={t.savedPlans} icon="📂" th={th} defaultOpen={false}>
              <div style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:4 }}>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={planName} onChange={e=>setPlanName(e.target.value)} placeholder={t.planNamePlaceholder}
                    style={{ flex:1, fontSize:"0.8rem", padding:"6px 10px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
                  <button onClick={savePlan} style={{ padding:"6px 14px", borderRadius:10, background:saveFlash?th.success:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700, transition:"background 0.2s" }}>
                    {saveFlash ? t.saved : t.save}
                  </button>
                </div>
                {savedPlans.length === 0 && (
                  <div style={{ fontSize:"0.78rem", color:th.textFaint, textAlign:"center", padding:"10px 0" }}>{t.noPlans}</div>
                )}
                {savedPlans.map(plan => (
                  <div key={plan.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:10, background:th.card, border:`1px solid ${th.border}` }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"0.8rem", fontWeight:700, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{plan.name}</div>
                      <div style={{ fontSize:"0.68rem", color:th.textFaint }}>{plan.locations?.length || 0} {t.places} · {plan.startDate}</div>
                    </div>
                    <button onClick={()=>loadPlan(plan)} style={{ fontSize:"0.7rem", padding:"4px 10px", borderRadius:8, background:th.accentLight, border:`1px solid ${th.accent}`, color:th.accent, cursor:"pointer" }}>{t.load}</button>
                    <button onClick={()=>deletePlan(plan.id)} style={{ fontSize:"0.7rem", padding:"4px 8px", borderRadius:8, background:th.warningBg, border:`1px solid ${th.warning}`, color:th.warning, cursor:"pointer" }}>×</button>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Share */}
            <CollapsibleSection title={t.share} icon="🔗" th={th} defaultOpen={false}>
              <div style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:4 }}>
                <button onClick={createShareLink} style={{ padding:"8px 14px", borderRadius:10, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700 }}>
                  🔗 {t.createLink}
                </button>
                {shareUrl && (
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.shareHint}</div>
                    <div style={{ display:"flex", gap:6 }}>
                      <input readOnly value={shareUrl} style={{ flex:1, fontSize:"0.68rem", padding:"5px 8px", borderRadius:8, background:th.input, color:th.textMuted, border:`1px solid ${th.inputBorder}`, overflow:"hidden", textOverflow:"ellipsis" }} />
                      <button onClick={copyShareUrl} style={{ padding:"5px 10px", borderRadius:8, background:copyFlash?th.success:th.surface, border:`1px solid ${th.border}`, color:copyFlash?th.bg:th.textMuted, cursor:"pointer", fontWeight:700, transition:"background 0.2s" }}>
                        {copyFlash ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleSection>

          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", marginTop:32, fontSize:"0.72rem", color:th.textFaint }}>
          <div style={{ marginBottom:4 }}>✈️ {t.footerText}</div>
          <div style={{ color:th.textFaint, opacity:0.6 }}>Rheinische Post Mediengruppe · {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}
