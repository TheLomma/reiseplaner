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
const CITY_ORDER = ["paris","london","berlin","rom","barcelona","wien","amsterdam","prag","lissabon","new_york"];

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
    apiSaved:"Gespeichert!",apiDelete:"Key löschen",footerText:"Reiseplaner v4.8",
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
    apiSaved:"Saved!",apiDelete:"Delete key",footerText:"Travel Planner v4.8",
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
    <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 14, padding: "12px 14px" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div className="skeleton-anim" style={{ width: 36, height: 36, borderRadius: "50%", background: th.skeletonShine }} />
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
    <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:16, overflow:"hidden", marginBottom:0 }}>
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

function LocationCard({ loc, index, dayColor, onRemove, onDayChange, tripDays, locationDays, locationNotes, onNoteChange, city, lang, t, travelMode, showSkeleton }) {
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

  if (showSkeleton) return <SkeletonCard th={th} />;

  return (
    <div className="app-card-hover card-anim" style={{
      background:th.card, border:`1px solid ${isClosed?th.warning:th.border}`,
      borderRadius:14, padding:"10px 12px", position:"relative",
      boxShadow:isClosed?`0 0 0 2px ${th.warning}22`:"none",
      animationDelay:`${index*0.05}s`
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
              {t.admission}: {cost.min === 0 && cost.max === 0 ? <span style={{ color:th.success, fontWeight:700 }}>{t.free}</span> : <span style={{ color:th.accent, fontWeight:600 }}>{cost.currency}{cost.min}{cost.max!==cost.min?`–${cost.currency}${cost.max}`:""}</span>}
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
          style={{ width:"100%", marginTop:8, fontSize:"0.78rem", padding:"6px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, resize:"vertical", fontFamily:"inherit" }} />
      )}
    </div>
  );
}

function MapView({ locations, city, travelMode, locationDays, tripDays }) {
  const { th } = useTheme();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const safeLocations = Array.isArray(locations) ? locations : [];

  useEffect(() => {
    let attempts = 0;
    const tryInit = () => {
      if (!mapRef.current) return;
      if (!window.L) { if (attempts++ < 20) setTimeout(tryInit, 300); return; }
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
      const center = safeLocations.length > 0 ? [safeLocations[0].lat || city.lat, safeLocations[0].lng || city.lng] : [city.lat, city.lng];
      const map = window.L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView(center, 13);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      mapInstanceRef.current = map;
      updateMarkers(map);
    };
    tryInit();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [city.id]);

  const updateMarkers = useCallback((map) => {
    if (!map || !window.L) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) { map.removeLayer(polylineRef.current); polylineRef.current = null; }
    const validLocs = safeLocations.filter(l => l.lat && l.lng);
    validLocs.forEach((loc, i) => {
      const dayIdx = tripDays ? tripDays.indexOf(locationDays?.[loc.id] ?? tripDays[0]) : i;
      const color = getDayColor(dayIdx >= 0 ? dayIdx : i);
      const icon = window.L.divIcon({
        className: "",
        html: `<div class="marker-pop" style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 2px 8px rgba(0,0,0,0.4);border:2px solid white;">${loc.icon||"📍"}</div>`,
        iconSize: [32,32], iconAnchor: [16,16],
      });
      const marker = window.L.marker([loc.lat, loc.lng], { icon }).addTo(map);
      marker.bindPopup(`<b>${loc.name}</b><br/><small>${loc.type||""}</small>`);
      markersRef.current.push(marker);
    });
    if (validLocs.length > 1) {
      const coords = validLocs.map(l => [l.lat, l.lng]);
      polylineRef.current = window.L.polyline(coords, { color: th.accent, weight: 2, opacity: 0.6, dashArray: "6,6" }).addTo(map);
    }
    if (validLocs.length > 0) {
      const group = window.L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }, [safeLocations, locationDays, tripDays, th.accent]);

  useEffect(() => {
    if (mapInstanceRef.current && window.L) updateMarkers(mapInstanceRef.current);
  }, [updateMarkers]);

  return <div ref={mapRef} style={{ width:"100%", height:280, borderRadius:12, overflow:"hidden", background:th.surface, border:`1px solid ${th.border}` }} />;
}

function BudgetView({ locations, city, lang, t }) {
  const { th } = useTheme();
  const [extras, setExtras] = useState([{ label:"", amount:"" }]);
  const safeLocations = Array.isArray(locations) ? locations : [];
  const items = safeLocations.map(loc => {
    const cost = getEntryCost(loc.name, city);
    if (!cost) return null;
    const avg = cost.min === 0 && cost.max === 0 ? 0 : (cost.min + cost.max) / 2;
    return { name: loc.name, avg, currency: cost.currency, note: cost.note, free: cost.min === 0 && cost.max === 0 };
  }).filter(Boolean);
  const extrasTotal = extras.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const total = items.reduce((s, i) => s + i.avg, 0) + extrasTotal;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {items.length === 0 && <div style={{ fontSize:"0.8rem", color:th.textMuted }}>{t.addFirst}</div>}
      {items.map((item,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", borderRadius:10, background:th.surface, border:`1px solid ${th.border}` }}>
          <span style={{ fontSize:"0.8rem", color:th.text }}>{item.name}</span>
          <span style={{ fontSize:"0.8rem", fontWeight:700, color:item.free?th.success:th.accent }}>
            {item.free ? t.free : `~${item.currency}${item.avg.toFixed(0)}`}
          </span>
        </div>
      ))}
      <div style={{ fontSize:"0.75rem", color:th.textMuted, marginTop:4 }}>{t.budgetExtras}</div>
      {extras.map((e,i) => (
        <div key={i} style={{ display:"flex", gap:6 }}>
          <input value={e.label} onChange={ev => setExtras(x => x.map((ex,j) => j===i?{...ex,label:ev.target.value}:ex))}
            placeholder={lang==="de"?"Bezeichnung":"Label"}
            style={{ flex:2, fontSize:"0.78rem", padding:"4px 8px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <input value={e.amount} onChange={ev => setExtras(x => x.map((ex,j) => j===i?{...ex,amount:ev.target.value}:ex))}
            placeholder="€" type="number"
            style={{ flex:1, fontSize:"0.78rem", padding:"4px 8px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
          <button onClick={() => setExtras(x => x.filter((_,j) => j!==i))} style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"1rem" }}>×</button>
        </div>
      ))}
      <button onClick={() => setExtras(x => [...x, {label:"",amount:""}])}
        style={{ fontSize:"0.75rem", padding:"4px 10px", borderRadius:8, background:th.surface, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer" }}>+ {lang==="de"?"Hinzufügen":"Add"}</button>
      <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", borderRadius:10, background:th.accentLight, border:`1px solid ${th.accent}` }}>
        <span style={{ fontWeight:700, fontSize:"0.85rem", color:th.text }}>{t.budgetTotal}</span>
        <span style={{ fontWeight:700, fontSize:"0.95rem", color:th.accent }}>~€{total.toFixed(0)}</span>
      </div>
      <div style={{ fontSize:"0.68rem", color:th.textFaint }}>{t.budgetNote}</div>
    </div>
  );
}

function ShareView({ locations, cityId, startDate, numDays, lang, t }) {
  const { th } = useTheme();
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const safeLocations = Array.isArray(locations) ? locations : [];

  const createLink = () => {
    const data = { cityId, startDate, numDays, locations: safeLocations.map(l => ({ name:l.name, lat:l.lat, lng:l.lng, icon:l.icon, type:l.type })) };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    const base = window.location.href.split("?")[0];
    setShareUrl(`${base}?plan=${encoded}`);
  };

  const doCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <button onClick={createLink} className="btn-primary"
        style={{ padding:"9px 18px", borderRadius:10, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>
        🔗 {t.createLink}
      </button>
      {shareUrl && (
        <>
          <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.shareHint}</div>
          <div style={{ display:"flex", gap:6 }}>
            <input readOnly value={shareUrl} style={{ flex:1, fontSize:"0.72rem", padding:"6px 10px", borderRadius:8, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}` }} />
            <button onClick={doCopy} style={{ padding:"6px 12px", borderRadius:8, background:copied?th.success:th.surface, border:`1px solid ${th.border}`, color:copied?th.bg:th.text, cursor:"pointer", fontSize:"0.75rem", fontWeight:700, whiteSpace:"nowrap" }}>
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SavedPlansView({ savedPlans, onLoad, onDelete, lang, t }) {
  const { th } = useTheme();
  if (!savedPlans.length) return <div style={{ fontSize:"0.82rem", color:th.textMuted }}>{t.noPlans}</div>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {savedPlans.map(plan => (
        <div key={plan.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:10, background:th.surface, border:`1px solid ${th.border}` }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:"0.82rem", color:th.text }}>{plan.name}</div>
            <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{CITIES[plan.cityId]?.name || plan.cityId} · {plan.locations?.length||0} Orte · {plan.numDays} Tage</div>
          </div>
          <button onClick={() => onLoad(plan)} style={{ fontSize:"0.72rem", padding:"4px 10px", borderRadius:8, background:th.accentLight, border:`1px solid ${th.accent}`, color:th.accent, cursor:"pointer", fontWeight:700 }}>{t.load}</button>
          <button onClick={() => onDelete(plan.id)} style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"1rem" }}>×</button>
        </div>
      ))}
    </div>
  );
}

function Navbar({ lang, setLang, t, canUndo, canRedo, onUndo, onRedo }) {
  const { mode, th } = useTheme();
  return (
    <nav style={{ position:"sticky", top:0, zIndex:1000, background:th.navBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${th.border}`, padding:"0 16px", height:52, display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ fontWeight:900, fontSize:"1.05rem", color:th.accent, fontFamily:"'Playfair Display', Georgia, serif", letterSpacing:"-0.02em", flex:1 }}>✈ {t.appName}</div>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <button onClick={onUndo} disabled={!canUndo} title="Undo" style={{ background:"none", border:"none", cursor:canUndo?"pointer":"default", color:canUndo?th.accent:th.textFaint, fontSize:"1rem", padding:"4px 6px" }}>↩</button>
        <button onClick={onRedo} disabled={!canRedo} title="Redo" style={{ background:"none", border:"none", cursor:canRedo?"pointer":"default", color:canRedo?th.accent:th.textFaint, fontSize:"1rem", padding:"4px 6px" }}>↪</button>
        <button onClick={toggleTheme} title="Toggle theme" style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.1rem", padding:"4px 6px" }}>{mode==="dark"?"☀️":"🌙"}</button>
        <button onClick={() => setLang(l => l==="de"?"en":"de")} style={{ fontSize:"0.7rem", padding:"4px 10px", borderRadius:20, background:th.surface, border:`1px solid ${th.border}`, color:th.textMuted, cursor:"pointer", fontWeight:700 }}>
          {lang==="de"?"EN":"DE"}
        </button>
      </div>
    </nav>
  );
}

export default function App() {
  const { th } = useTheme();
  const [lang, setLang] = useState("de");
  const t = TRANSLATIONS[lang];

  const [cityId, setCityId] = useState("paris");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0,10));
  const [numDays, setNumDays] = useState(4);
  const [tripDays, setTripDays] = useState(() => generateTripDays(new Date().toISOString().slice(0,10), 4));

  const [locations, setLocations, { undo, redo, canUndo, canRedo }] = useUndoRedo([]);
  const [locationDays, setLocationDays] = useState({});
  const [locationNotes, setLocationNotes] = useState({});

  const [linkInput, setLinkInput] = useState("");
  const [linkError, setLinkError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [travelMode, setTravelMode] = useState("walking");
  const [activeTab, setActiveTab] = useState("route");
  const [filterDay, setFilterDay] = useState("all");
  const [savedPlans, setSavedPlans] = useState([]);
  const [planName, setPlanName] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);

  const [customCities, setCustomCities] = useState({});
  const [customCityInput, setCustomCityInput] = useState("");
  const [showCustomCityInput, setShowCustomCityInput] = useState(false);

  const allCities = { ...CITIES, ...customCities };
  const city = allCities[cityId] || CITIES["paris"];

  const handleAddCustomCity = () => {
    const name = customCityInput.trim();
    if (!name) return;
    const id = "custom_" + name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    const newCity = {
      id, name, emoji: "🌍", country: "🌐",
      lat: 48.8566, lng: 2.3522, timezone: "UTC",
      sampleLocations: [], demoLinks: [], linkMatchers: [],
      entryCosts: {}, ratings: {}, locationInfo: {}, openingHours: {}, metroLines: {},
    };
    setCustomCities(prev => ({ ...prev, [id]: newCity }));
    setCityId(id);
    setLocations([]);
    setLocationDays({});
    setCustomCityInput("");
    setShowCustomCityInput(false);
    setShowCityPicker(false);
  };

  // Load CSS + Leaflet on client only
  useEffect(() => {
    if (!document.getElementById("app-theme-styles")) {
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
        .app-card-hover:hover { transform: translateY(-2px); }
        .tab-btn { transition: background 0.15s, color 0.15s; font-family: 'Source Sans 3',system-ui,sans-serif; letter-spacing:0.04em; text-transform:uppercase; font-size:0.65rem !important; }
        .btn-primary { transition: background 0.15s, box-shadow 0.15s, transform 0.1s; }
        .btn-primary:hover { transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
        .marker-pop { animation: markerPop 0.4s ease both; }
        h1,h2,h3 { font-family: 'Playfair Display',Georgia,serif !important; }
        body { font-family: 'Source Sans 3',system-ui,sans-serif; transition: background 0.3s; }
        * { box-sizing: border-box !important; }
        body, #root { overflow-x: hidden !important; max-width: 100vw !important; }
        input, select, textarea { font-size: 16px !important; }
        button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width:6px; height:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { border-radius:3px; }
      `;
      document.head.appendChild(s);
    }
    let vp = document.querySelector('meta[name="viewport"]');
    if (!vp) { vp = document.createElement('meta'); vp.name = 'viewport'; document.head.appendChild(vp); }
    vp.content = 'width=device-width,initial-scale=1,maximum-scale=1';
    if (!window.L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      document.head.appendChild(script);
    }
  }, []);

  // Persist body bg
  useEffect(() => {
    document.body.style.background = th.bg;
    document.body.style.color = th.text;
  }, [th]);

  // Load saved plans from localStorage
  useEffect(() => {
    const stored = safeLocalGet("reiseplaner_plans_v2", []);
    setSavedPlans(Array.isArray(stored) ? stored : []);
  }, []);

  const handleAnalyzeLink = () => {
    const url = linkInput.trim();
    if (!url) { setLinkError(t.errorEmpty); return; }
    setLinkError(""); setAnalyzing(true); setSkeletonVisible(true);
    setTimeout(() => {
      const matchers = city.linkMatchers || [];
      const match = matchers.find(m => m.pattern.test(url));
      if (match !== undefined) {
        const sample = city.sampleLocations[match.locationIndex];
        if (sample && !locations.find(l => l.id === sample.id)) {
          const newLoc = { ...sample, id: Date.now() };
          setLocations(prev => [...(Array.isArray(prev)?prev:[]), newLoc]);
          setLocationDays(d => ({ ...d, [newLoc.id]: tripDays[0] }));
        }
      } else {
        setLinkError(t.errorNotFound);
      }
      setLinkInput(""); setAnalyzing(false);
      setTimeout(() => setSkeletonVisible(false), 600);
    }, 900);
  };

  const handleRemoveLocation = (id) => {
    setLocations(prev => (Array.isArray(prev)?prev:[]).filter(l => l.id !== id));
    setLocationDays(d => { const n = {...d}; delete n[id]; return n; });
    setLocationNotes(d => { const n = {...d}; delete n[id]; return n; });
  };

  const handleDayChange = (locId, day) => setLocationDays(d => ({ ...d, [locId]: day }));
  const handleNoteChange = (locId, note) => setLocationNotes(d => ({ ...d, [locId]: note }));

  const handleSavePlan = () => {
    if (!planName.trim() || locations.length === 0) return;
    const plan = { id: Date.now(), name: planName.trim(), cityId, startDate, numDays, tripDays, locations, locationDays, locationNotes };
    const updated = [...savedPlans.filter(p => p.name !== plan.name), plan];
    setSavedPlans(updated);
    safeLocalSet("reiseplaner_plans_v2", updated);
    setSaveMsg(t.saved);
    setTimeout(() => setSaveMsg(""), 2000);
  };

  const handleLoadPlan = (plan) => {
    const normalized = normalizePlan(plan);
    if (!normalized) return;
    setCityId(normalized.cityId);
    setStartDate(normalized.startDate);
    setNumDays(normalized.numDays);
    setTripDays(normalized.tripDays);
    setLocations(normalized.locations);
    setLocationDays(normalized.locationDays);
    setLocationNotes(normalized.locationNotes);
    setPlanName(normalized.name);
  };

  const handleDeletePlan = (id) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    safeLocalSet("reiseplaner_plans_v2", updated);
  };

  const handleLoadDemo = (idx) => {
    const sample = city.sampleLocations[idx];
    if (!sample || locations.find(l => l.name === sample.name)) return;
    const newLoc = { ...sample, id: Date.now() };
    setLocations(prev => [...(Array.isArray(prev)?prev:[]), newLoc]);
    setLocationDays(d => ({ ...d, [newLoc.id]: tripDays[0] }));
  };

  const filteredLocations = locations.filter(l => filterDay === "all" || locationDays[l.id] === filterDay);

  const closedWarnings = locations.filter(l => {
    const day = locationDays[l.id] ?? tripDays[0];
    const info = getOpeningInfo(l.name, day, city);
    return info && !info.isOpen;
  });

  // Route/Timeline view
  const dayGroups = tripDays.map(day => ({
    day,
    locs: locations.filter(l => (locationDays[l.id] ?? tripDays[0]) === day)
  })).filter(g => g.locs.length > 0);

  return (
    <div style={{ minHeight:"100vh", background:th.bg, color:th.text, fontFamily:"'Source Sans 3',system-ui,sans-serif" }}>
      <Navbar lang={lang} setLang={setLang} t={t} canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />

      <div style={{ maxWidth:480, margin:"0 auto", padding:"16px 12px 80px" }}>

        {/* City + Trip */}
        <CollapsibleSection title={t.sectionTrip} icon="🗓" th={th} defaultOpen={true}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            <button onClick={() => setShowCityPicker(v => !v)} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:12, background:th.card, border:`1px solid ${th.border}`, cursor:"pointer", color:th.text }}>
              <span style={{ fontSize:"1.3rem" }}>{city.emoji}</span>
              <div style={{ flex:1, textAlign:"left" }}>
                <div style={{ fontWeight:700, fontSize:"0.88rem", color:th.text }}>{city.name} {city.country}</div>
                <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{t.switchCity}</div>
              </div>
              <span style={{ color:th.textMuted }}>›</span>
            </button>

            {showCityPicker && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {[...CITY_ORDER, ...Object.keys(customCities)].map(cid => {
                    const c = allCities[cid]; if (!c) return null;
                    return (
                      <button key={cid} onClick={() => { setCityId(cid); setLocations([]); setLocationDays({}); setShowCityPicker(false); }}
                        style={{ padding:"6px 12px", borderRadius:20, fontSize:"0.78rem", background:cityId===cid?th.accent:th.surface, color:cityId===cid?th.bg:th.text, border:`1px solid ${cityId===cid?th.accent:th.border}`, cursor:"pointer", fontWeight:cityId===cid?700:400 }}>
                        {c.emoji} {c.name}
                      </button>
                    );
                  })}
                </div>
                {showCustomCityInput ? (
                  <div style={{ display:"flex", gap:8, marginTop:4 }}>
                    <input
                      value={customCityInput}
                      onChange={e => setCustomCityInput(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && handleAddCustomCity()}
                      placeholder={t.customCityPlaceholder}
                      style={{ flex:1, padding:"7px 10px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, fontSize:"0.82rem" }}
                      autoFocus
                    />
                    <button onClick={handleAddCustomCity}
                      style={{ padding:"7px 14px", borderRadius:10, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>
                      {t.customCityAdd}
                    </button>
                    <button onClick={() => setShowCustomCityInput(false)}
                      style={{ background:"none", border:"none", cursor:"pointer", color:th.textFaint, fontSize:"1.1rem" }}>×</button>
                  </div>
                ) : (
                  <button onClick={() => setShowCustomCityInput(true)}
                    style={{ padding:"6px 12px", borderRadius:20, fontSize:"0.78rem", background:th.surface, color:th.textMuted, border:`1px solid ${th.border}`, cursor:"pointer", marginTop:2, alignSelf:"flex-start" }}>
                    🌍 {t.customCity}
                  </button>
                )}
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:2 }}>
                <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:4 }}>{t.labelStartDate}</div>
                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setTripDays(generateTripDays(e.target.value, numDays)); }}
                  style={{ width:"100%", padding:"8px 10px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, fontSize:"0.82rem" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"0.7rem", color:th.textMuted, marginBottom:4 }}>{t.labelDays}</div>
                <input type="number" min={1} max={30} value={numDays} onChange={e => { const v = Math.max(1,Math.min(30,parseInt(e.target.value)||1)); setNumDays(v); setTripDays(generateTripDays(startDate, v)); }}
                  style={{ width:"100%", padding:"8px 10px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, fontSize:"0.82rem" }} />
              </div>
            </div>

            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
              {tripDays.map((d,i) => (
                <div key={d} style={{ flexShrink:0, padding:"4px 10px", borderRadius:20, fontSize:"0.7rem", background:`${getDayColor(i)}22`, border:`1px solid ${getDayColor(i)}66`, color:th.text, fontWeight:600 }}>
                  {formatDateLabel(d, lang)}
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Link Input */}
        <CollapsibleSection title={t.addPlace} icon="➕" th={th} defaultOpen={true}>
          <div style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:4 }}>
            <div style={{ display:"flex", gap:8 }}>
              <input value={linkInput} onChange={e => setLinkInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleAnalyzeLink()}
                placeholder={t.linkPlaceholder}
                style={{ flex:1, padding:"10px 12px", borderRadius:12, background:th.input, color:th.text, border:`1px solid ${linkError?th.warning:th.inputBorder}`, fontSize:"0.82rem" }} />
              <button onClick={handleAnalyzeLink} disabled={analyzing} className="btn-primary"
                style={{ padding:"10px 16px", borderRadius:12, background:th.accent, color:th.bg, border:"none", cursor:analyzing?"wait":"pointer", fontWeight:700, fontSize:"0.82rem", whiteSpace:"nowrap" }}>
                {analyzing ? <Spinner size={16} color={th.bg} /> : t.analyze}
              </button>
            </div>
            {linkError && <div style={{ fontSize:"0.75rem", color:th.warning }}>{linkError}</div>}
            <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{t.demo}</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {(city.sampleLocations||[]).map((loc,i) => (
                <button key={i} onClick={() => handleLoadDemo(i)}
                  style={{ fontSize:"0.72rem", padding:"4px 10px", borderRadius:20, background:th.tag, color:th.tagText, border:`1px solid ${th.border}`, cursor:"pointer" }}>
                  {loc.icon} {loc.name}
                </button>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Closed Warnings */}
        {closedWarnings.length > 0 && (
          <div style={{ padding:"10px 14px", borderRadius:12, background:th.warningBg, border:`1px solid ${th.warning}`, marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:"0.8rem", color:th.warning, marginBottom:4 }}>⚠ {t.warningTitle}</div>
            {closedWarnings.map(l => (
              <div key={l.id} style={{ fontSize:"0.75rem", color:th.warning }}>· {l.name} {t.warningClosed}</div>
            ))}
            <div style={{ fontSize:"0.72rem", color:th.textMuted, marginTop:4 }}>{t.warningHint}</div>
          </div>
        )}

        {/* Places List */}
        {locations.length > 0 && (
          <CollapsibleSection title={t.myPlaces} icon="📍" badge={`${locations.length} ${t.places}`} th={th} defaultOpen={true}>
            <div style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:4 }}>
              <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4 }}>
                <button onClick={() => setFilterDay("all")} className="tab-btn"
                  style={{ flexShrink:0, padding:"4px 10px", borderRadius:20, background:filterDay==="all"?th.accent:th.surface, color:filterDay==="all"?th.bg:th.textMuted, border:`1px solid ${filterDay==="all"?th.accent:th.border}`, cursor:"pointer" }}>
                  {t.allDays}
                </button>
                {tripDays.map((d,i) => (
                  <button key={d} onClick={() => setFilterDay(d)} className="tab-btn"
                    style={{ flexShrink:0, padding:"4px 10px", borderRadius:20, background:filterDay===d?getDayColor(i):th.surface, color:filterDay===d?th.bg:th.textMuted, border:`1px solid ${filterDay===d?getDayColor(i):th.border}`, cursor:"pointer" }}>
                    {formatDateLabel(d, lang)}
                  </button>
                ))}
              </div>
              {filteredLocations.map((loc, i) => {
                const dayIdx = tripDays.indexOf(locationDays[loc.id] ?? tripDays[0]);
                return (
                  <LocationCard key={loc.id} loc={loc} index={i}
                    dayColor={getDayColor(dayIdx >= 0 ? dayIdx : 0)}
                    onRemove={handleRemoveLocation} onDayChange={handleDayChange}
                    tripDays={tripDays} locationDays={locationDays}
                    locationNotes={locationNotes} onNoteChange={handleNoteChange}
                    city={city} lang={lang} t={t} travelMode={travelMode}
                    showSkeleton={skeletonVisible && i === filteredLocations.length - 1} />
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        <div style={{ height:12 }} />

        {/* Map */}
        <CollapsibleSection title={t.sectionMap} icon="🗺" th={th} defaultOpen={locations.length > 0}>
          <div style={{ paddingTop:8 }}>
            <MapView locations={locations} city={city} travelMode={travelMode} locationDays={locationDays} tripDays={tripDays} />
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Route & Timeline */}
        <CollapsibleSection title={t.sectionRoute} icon="🛣" th={th} defaultOpen={false}>
          <div style={{ paddingTop:8 }}>
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {["route","timeline"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="tab-btn"
                  style={{ flex:1, padding:"7px", borderRadius:10, background:activeTab===tab?th.accent:th.surface, color:activeTab===tab?th.bg:th.textMuted, border:`1px solid ${activeTab===tab?th.accent:th.border}`, cursor:"pointer", fontWeight:700 }}>
                  {tab==="route"?t.route:t.timeline}
                </button>
              ))}
            </div>

            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {["walking","transit"].map(m => (
                <button key={m} onClick={() => setTravelMode(m)} className="tab-btn"
                  style={{ flex:1, padding:"5px", borderRadius:8, background:travelMode===m?th.accentLight:th.surface, color:travelMode===m?th.accent:th.textMuted, border:`1px solid ${travelMode===m?th.accent:th.border}`, cursor:"pointer" }}>
                  {m==="walking"?"🚶 "+t.walking:"🚇 "+t.transit}
                </button>
              ))}
            </div>

            {locations.length < 2 && <div style={{ fontSize:"0.8rem", color:th.textMuted, textAlign:"center", padding:"20px 0" }}>{t.noRouteHint}</div>}

            {activeTab === "route" && locations.length >= 2 && (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {dayGroups.map((group, gi) => (
                  <div key={group.day}>
                    <div style={{ fontSize:"0.72rem", fontWeight:700, color:getDayColor(tripDays.indexOf(group.day)), marginBottom:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                      📅 {formatDateLabel(group.day, lang)}
                    </div>
                    {group.locs.map((loc, i) => (
                      <div key={loc.id}>
                        <div style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 12px", borderRadius:10, background:th.card, border:`1px solid ${th.border}` }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:`${getDayColor(tripDays.indexOf(group.day))}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", border:`1.5px solid ${getDayColor(tripDays.indexOf(group.day))}` }}>
                            {i+1}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, fontSize:"0.82rem", color:th.text }}>{loc.name}</div>
                            <div style={{ fontSize:"0.7rem", color:th.textMuted }}>{loc.area || loc.type}</div>
                          </div>
                          {loc.duration && <span style={{ fontSize:"0.7rem", color:th.textFaint }}>⏱ {loc.duration}</span>}
                        </div>
                        {i < group.locs.length - 1 && (
                          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 16px" }}>
                            <div style={{ width:1, height:20, background:th.border, margin:"0 12px" }} />
                            <TravelTimeBadge from={group.locs[i]} to={group.locs[i+1]} mode={travelMode} th={th} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "timeline" && locations.length >= 2 && (
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {dayGroups.map((group, gi) => {
                  let timeMin = 9 * 60;
                  return (
                    <div key={group.day}>
                      <div style={{ fontSize:"0.72rem", fontWeight:700, color:getDayColor(tripDays.indexOf(group.day)), marginBottom:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                        📅 {formatDateLabel(group.day, lang)}
                      </div>
                      {group.locs.map((loc, i) => {
                        const h = String(Math.floor(timeMin/60)).padStart(2,"0");
                        const m = String(timeMin%60).padStart(2,"0");
                        const durMatch = (loc.duration||"").match(/[\d,.]+/);
                        const durH = durMatch ? parseFloat(durMatch[0].replace(",",".")) : 1;
                        timeMin += Math.round(durH * 60);
                        const tt = i < group.locs.length-1 ? calcTravelTime(loc, group.locs[i+1]) : null;
                        const transfer = tt ? (travelMode==="walking" ? tt.walkMin : tt.transitMin) : 0;
                        timeMin += transfer;
                        return (
                          <div key={loc.id} style={{ display:"flex", gap:10, marginBottom:6 }}>
                            <div style={{ width:46, flexShrink:0, textAlign:"right", fontSize:"0.72rem", color:th.textMuted, paddingTop:8, fontWeight:600 }}>{h}:{m}</div>
                            <div style={{ width:2, background:`${getDayColor(tripDays.indexOf(group.day))}44`, borderRadius:2, flexShrink:0, position:"relative" }}>
                              <div style={{ position:"absolute", top:8, left:-4, width:10, height:10, borderRadius:"50%", background:getDayColor(tripDays.indexOf(group.day)), border:`2px solid ${th.bg}` }} />
                            </div>
                            <div style={{ flex:1, padding:"6px 10px", borderRadius:10, background:th.card, border:`1px solid ${th.border}`, marginBottom:2 }}>
                              <div style={{ fontWeight:700, fontSize:"0.82rem", color:th.text }}>{loc.name}</div>
                              <div style={{ fontSize:"0.7rem", color:th.textMuted }}>⏱ {loc.duration}</div>
                              {tt && <div style={{ fontSize:"0.68rem", color:th.textFaint, marginTop:3 }}>→ {transfer} min {travelMode==="walking"?t.walkingTime:t.transitTime}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Packing List */}
        <CollapsibleSection title={t.packingList} icon="🎒" th={th} defaultOpen={false}>
          <div style={{ paddingTop:8 }}>
            <PackingList locations={locations} numDays={numDays} lang={lang} />
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Budget */}
        <CollapsibleSection title={t.budget} icon="💰" th={th} defaultOpen={false}>
          <div style={{ paddingTop:8 }}>
            <BudgetView locations={locations} city={city} lang={lang} t={t} />
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Save Plans */}
        <CollapsibleSection title={t.savePlans} icon="💾" th={th} defaultOpen={false}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:8 }}>
            <div style={{ display:"flex", gap:8 }}>
              <input value={planName} onChange={e => setPlanName(e.target.value)}
                placeholder={t.planNamePlaceholder}
                style={{ flex:1, padding:"8px 12px", borderRadius:10, background:th.input, color:th.text, border:`1px solid ${th.inputBorder}`, fontSize:"0.82rem" }} />
              <button onClick={handleSavePlan} className="btn-primary"
                style={{ padding:"8px 16px", borderRadius:10, background:th.accent, color:th.bg, border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.82rem" }}>
                {saveMsg || t.save}
              </button>
            </div>
            <div style={{ fontSize:"0.75rem", color:th.textMuted, fontWeight:700, marginTop:4 }}>{t.savedPlans}</div>
            <SavedPlansView savedPlans={savedPlans} onLoad={handleLoadPlan} onDelete={handleDeletePlan} lang={lang} t={t} />
          </div>
        </CollapsibleSection>

        <div style={{ height:12 }} />

        {/* Share */}
        <CollapsibleSection title={t.share} icon="🔗" th={th} defaultOpen={false}>
          <div style={{ paddingTop:8 }}>
            <ShareView locations={locations} cityId={cityId} startDate={startDate} numDays={numDays} lang={lang} t={t} />
          </div>
        </CollapsibleSection>

        <div style={{ height:32 }} />

        {/* Footer */}
        <div style={{ textAlign:"center", fontSize:"0.7rem", color:th.textFaint, paddingBottom:16 }}>
          {t.footerText}
        </div>
      </div>
    </div>
  );
}
