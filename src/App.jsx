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
    apiSaved:"Gespeichert!",apiDelete:"Key löschen",footerText:"Reiseplaner v5.4",
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
    apiSaved:"Saved!",apiDelete:"Delete key",footerText:"Travel Planner v5.4",
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

function StarRating({ stars, reviews, price, badge, lang, th }) {
  if (!stars) return null;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:6, marginTop:4 }}>
      <div style={{ display:"flex", gap:1 }}>
        {[...Array(5)].map((_,i) => (
          <span key={i} style={{ fontSize:"0.75rem", color: i < full ? th.gold : (i === full && half ? th.gold : th.border) }}>
            {i < full ? "★" : (
              i === full && half ? "⯨" : "☆"
            )}
          </span>
          ))}
        </div>
        <span style={{ fontSize:"0.8rem", fontWeight:700, color:th.gold }}>{stars.toFixed(1)}</span>
        {reviews && <span style={{ fontSize:"0.72rem", color:th.textMuted }}>({reviews.toLocaleString()} {lang==="de"?"Bew.":"rev."})</span>}
        {price && <span style={{ fontSize:"0.72rem", color:th.textMuted, marginLeft:2 }}>{price}</span>}
        {badge && <span style={{ fontSize:"0.68rem", background:th.goldBg, color:th.gold, border:`1px solid ${th.gold}40`, borderRadius:6, padding:"1px 6px", fontWeight:600 }}>{badge}</span>}
      </div>
    );
  }

  function LocationCard({ loc, city, tripDays, locationDays, locationNotes, onDayChange, onNoteChange, onRemove, lang, th, dragHandleProps, isDragging }) {
    const t = TRANSLATIONS[lang];
    const [showInfo, setShowInfo] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const assignedDay = locationDays[loc.id];
    const note = locationNotes[loc.id] || "";
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
                {formatDateLabel(d, lang)}
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
            <div style={{ display:"flex", gap:6 }}>
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
            style={{ background:th.accent, color:th.bg, border:"none", borderRadius:10, padding:"8px 16px", fontWeight:700, fontSize:"0.85rem", cursor:loading?"wait":"pointer", display:"flex", alignItems:"center", gap:6 }}>
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

  function RouteTimeline({ locations, locationDays, tripDays, travelMode, city, lang, th }) {
    const t = TRANSLATIONS[lang];
    const byDay = {};
    tripDays.forEach(d => { byDay[d] = []; });
    locations.forEach(loc => {
      const d = locationDays[loc.id];
      if (d && byDay[d]) byDay[d].push(loc);
    });
    const days = tripDays.filter(d => byDay[d].length > 0);
    if (days.length === 0) return <div style={{ color:th.textFaint, fontSize:"0.82rem", textAlign:"center", padding:"20px 0" }}>{t.noRouteHint}</div>;
    return (
      <div>
        {days.map((d, di) => {
          const locs = byDay[d];
          const color = getDayColor(tripDays.indexOf(d));
          return (
            <div key={d} style={{ marginBottom:20 }}>
              <div style={{ fontWeight:700, fontSize:"0.8rem", color, textTransform:"uppercase", letterSpacing:1, marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:10, height:10, borderRadius:"50%", background:color, display:"inline-block" }}/>
                {formatDateLabel(d, lang)}
              </div>
              {locs.map((loc, li) => {
                const travel = li > 0 ? calcTravelTime(locs[li-1], loc) : null;
                return (
                  <div key={loc.id}>
                    {travel && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 0 4px 18px", fontSize:"0.72rem", color:th.textFaint }}>
                        <span style={{ width:1, height:20, background:th.border, display:"inline-block" }}/>
                        {travelMode==="walking" ? `🚶 ${travel.walkMin} min` : travelMode==="transit" ? `🚇 ${travel.transitMin} min` : `🚗 ${Math.max(3,Math.round(travel.transitMin*0.6))} min`}
                        <span>· {travel.distKm} km</span>
                      </div>
                    )}
                    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 8px", background:th.surface, borderRadius:10, border:`1px solid ${th.border}` }}>
                      <span style={{ fontSize:"1.2rem" }}>{loc.icon||"📍"}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:"0.85rem", color:th.text }}>{loc.name}</div>
                        {loc.area && <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{loc.area}</div>}
                      </div>
                      {loc.duration && <div style={{ fontSize:"0.72rem", color:th.textFaint }}>⏱ {loc.duration}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  function MapView({ locations, locationDays, tripDays, travelMode, city, th }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const linesRef = useRef([]);

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

    function updateMarkers() {
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
        const m = L.marker([loc.lat,loc.lng],{icon}).addTo(map).bindPopup(`<b>${loc.name}</b><br/>${loc.type||""}<br/>${loc.area?"\ud83d\udccd "+loc.area+"<br/>":""}${loc.openingHoursText?"\ud83d\udd50 "+loc.openingHoursText+"<br/>":""}${loc.entryCostText?"\ud83c\udf9f "+loc.entryCostText:""}`);
        markersRef.current.push(m); bounds.push([loc.lat,loc.lng]);
      });
      const byDay = {};
      tripDays.forEach(d => { byDay[d] = []; });
      valid.forEach(loc => { const d = locationDays[loc.id]; if (d && byDay[d]) byDay[d].push(loc); });
      tripDays.forEach((d,di) => {
        const locs = byDay[d]; if (locs.length < 2) return;
        const col = DAY_COLORS[di % DAY_COLORS.length];
        const coords = locs.map(l => [l.lat,l.lng]);
        const style = travelMode==="walking" ? {color:col,weight:3,dashArray:"6 6",opacity:0.85} : travelMode==="transit" ? {color:col,weight:4,dashArray:"2 10",opacity:0.9} : {color:col,weight:4,opacity:0.85};
        const line = L.polyline(coords,style).addTo(map);
        linesRef.current.push(line);
      });
      if (bounds.length > 1) map.fitBounds(bounds, {padding:[40,40]});
      else if (bounds.length === 1) map.setView(bounds[0], 15);
    }

    return (
      <div style={{borderRadius:16,overflow:"hidden",border:`1px solid ${th.border}`,height:400,position:"relative"}}>
        <div ref={mapRef} style={{width:"100%",height:"100%"}} />
        {!locations.filter(l=>l.lat&&l.lng).length && (
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:th.surface,pointerEvents:"none"}}>
            <div style={{fontSize:"2.5rem"}}>🗺️</div>
            <div style={{fontSize:"0.82rem",color:th.textMuted,marginTop:6}}>Füge Orte mit Koordinaten hinzu</div>
          </div>
        )}
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

  function WeatherWidget({ city, startDate, lang, th }) {
    const t = TRANSLATIONS[lang];
    const icons = ["☀️","⛅","🌤️","🌦️","☁️"];
    const temps = [18,22,15,20,17];
    return (
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:14, padding:"10px 14px" }}>
        <div style={{ fontWeight:700, fontSize:"0.8rem", color:th.accent, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>{t.weather} · {city?.name}</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {icons.map((ic,i) => (
            <div key={i} style={{ textAlign:"center", minWidth:36 }}>
              <div style={{ fontSize:"1.2rem" }}>{ic}</div>
              <div style={{ fontSize:"0.72rem", color:th.textMuted }}>{temps[i]}°</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:"0.65rem", color:th.textFaint, marginTop:4 }}>Demo-Wetterdaten</div>
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
            <div style={{ display:"flex", gap:6 }}>
              <input readOnly value={link} style={{ flex:1, background:th.input, border:`1px solid ${th.inputBorder}`, borderRadius:8, padding:"4px 8px", fontSize:"0.72rem", color:th.textMuted }} />
              <button onClick={copy} style={{ background:th.accent, color:th.bg, border:"none", borderRadius:8, padding:"4px 10px", fontWeight:700, fontSize:"0.75rem", cursor:"pointer" }}>{copied ? t.copied : t.copy}</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function CitySelector({ currentCityId, onSelect, lang, th }) {
    const t = TRANSLATIONS[lang];
    const [custom, setCustom] = useState("");
    return (
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:"0.7rem", color:th.textFaint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>{t.selectCity}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {Object.values(CITIES).map(c => (
            <button key={c.id} onClick={()=>onSelect(c.id)}
              style={{ fontSize:"0.8rem", padding:"5px 12px", borderRadius:10, border:`1.5px solid ${currentCityId===c.id ? th.accent : th.border}`, background: currentCityId===c.id ? th.accentLight : "transparent", color: currentCityId===c.id ? th.accent : th.textMuted, cursor:"pointer", fontWeight: currentCityId===c.id ? 700 : 400 }}>
              {c.country} {c.name}
            </button>
          ))}
        </div>
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
    const [travelMode, setTravelMode] = useState("walking");
    const [activeTab, setActiveTab] = useState("route");
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
    }, [setLocations]);

    const setDay = useCallback((id, day) => {
      setLocationDays(prev => { const n={...prev}; if(day) n[id]=day; else delete n[id]; return n; });
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

          {/* CITY SELECTOR */}
          <CitySelector currentCityId={cityId} onSelect={id=>{setCityId(id);setLocations([]);setLocationDays({});setLocationNotes({});}} lang={lang} th={th} />

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
                  onDayChange={setDay} onNoteChange={setNote} onRemove={removeLocation}
                  lang={lang} th={th}
                  dragHandleProps={{ onMouseDown:()=>{} }}
                  isDragging={dragIdx===i}
                />
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
            {["route","map","budget","plans","share","weather"].map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)}
                style={{ padding:"6px 14px", borderRadius:10, border:`1.5px solid ${activeTab===tab?th.accent:th.border}`, background:activeTab===tab?th.accentLight:"transparent", color:activeTab===tab?th.accent:th.textMuted, fontWeight:activeTab===tab?700:400, fontSize:"0.8rem", cursor:"pointer" }}>
                {tab==="route"?t.route:tab==="map"?t.sectionMap:tab==="budget"?t.budget:tab==="plans"?t.savedPlans:tab==="share"?t.share:t.weather}
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
          {activeTab==="route" && <RouteTimeline locations={locations} locationDays={locationDays} tripDays={tripDays} travelMode={travelMode} city={city} lang={lang} th={th} />}
          {activeTab==="map" && <MapView locations={locations} locationDays={locationDays} tripDays={tripDays} travelMode={travelMode} city={city} th={th} />}
          {activeTab==="budget" && <BudgetPanel locations={locations} city={city} lang={lang} th={th} />}
          {activeTab==="plans" && <SavedPlansPanel lang={lang} th={th} onLoad={loadPlan} />}
          {activeTab==="share" && <SharePanel lang={lang} th={th} />}
          {activeTab==="weather" && <WeatherWidget city={city} startDate={startDate} lang={lang} th={th} />}

        </div>

        {/* FOOTER */}
        <footer style={{ textAlign:"center", padding:"20px 16px", color:th.textFaint, fontSize:"0.72rem", borderTop:`1px solid ${th.border}`, marginTop:20 }}>
          {t.footerText} · {mode==="dark"?"🌙":"☀️"} · {lang.toUpperCase()}
        </footer>
      </div>
    );
  }

           
