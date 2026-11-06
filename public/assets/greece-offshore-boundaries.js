/* Official WGS84 concession boundaries: Official Journal of the European Union
   C/2025/3335 (12 June 2025), pages 1-2, table "WGS 1984".
   The Southwest Crete block is from the EU Official Journal 2017/C 411/04.
   Coordinates are [longitude deg,min,sec, latitude deg,min,sec].
   These are PUBLISHED POLYGON VERTICES, not schematic approximations.
   https://eur-lex.europa.eu/eli/C/2025/3335/oj/eng
   The original 5' grid (greece-offshore-cells.js) is retained as an audit aid,
   but only these exact published exterior polygons are used for the main map. */
(function(){
 'use strict';
 const source='https://eur-lex.europa.eu/eli/C/2025/3335/oj/eng';
 const coordinate=(d,m,s)=>+(d+m/60+s/3600).toFixed(9);
 const blocks=[
  {
   key:'a2',name:'Α2',short:'Α2',area:826,owner:'Chevron (70%) · HELLENiQ ENERGY (30%)',
   vertices:[
    [20,59,57.57,36,49,56.28],[21,19,57.59,36,49,56.29],
    [21,19,57.60,36,44,56.28],[21,24,57.60,36,44,56.28],
    [21,24,57.61,36,34,56.27],[21,9,57.59,36,34,56.27],
    [21,9,57.58,36,39,56.27],[20,59,57.57,36,39,56.27]
   ]
  },
  {
   key:'pelop',name:'Νότια της Πελοποννήσου',short:'Ν. Πελοπόννησος',area:10211,owner:'Chevron (70%) · HELLENiQ ENERGY (30%)',
   vertices:[
    [20,54,57.56,36,49,56.28],[20,59,57.57,36,49,56.28],
    [20,59,57.57,36,39,56.27],[21,9,57.58,36,39,56.27],
    [21,9,57.59,36,34,56.27],[21,34,57.62,36,34,56.27],
    [21,34,57.62,36,29,56.27],[22,9,57.67,36,29,56.28],
    [22,9,57.68,36,19,56.27],[22,14,57.68,36,19,56.27],
    [22,14,57.69,36,14,56.27],[22,39,57.72,36,14,56.27],
    [22,39,57.73,35,59,56.26],[23,4,57.76,35,59,56.27],
    [23,4,57.77,35,34,56.24],[23,19,57.79,35,34,56.25],
    [23,19,57.80,35,19,56.23],[22,54,57.77,35,19,56.22],
    [22,54,57.76,35,29,56.23],[22,14,57.71,35,29,56.22],
    [22,14,57.69,35,59,56.25],[22,4,57.68,35,59,56.25],
    [22,4,57.68,36,4,56.25],[21,54,57.66,36,4,56.25],
    [21,54,57.66,36,14,56.26],[21,19,57.61,36,14,56.25],
    [21,19,57.61,36,24,56.26],[20,54,57.57,36,24,56.25]
   ]
  },
  {
   key:'crete1',name:'Νότια της Κρήτης 1',short:'Ν. Κρήτη 1',area:13347,owner:'Chevron (70%) · HELLENiQ ENERGY (30%)',
   vertices:[
    [23,34,57.84,34,39,56.19],[24,44,57.94,34,39,56.22],
    [24,44,57.96,33,27,41.14],[23,34,57.86,33,43,41.42]
   ]
  },
  {
   key:'crete2',name:'Νότια της Κρήτης 2',short:'Ν. Κρήτη 2',area:21805,owner:'Chevron (70%) · HELLENiQ ENERGY (30%)',
   vertices:[
    [24,44,57.93,34,49,56.23],[26,14,58.06,34,49,56.25],
    [26,14,58.09,33,27,55.21],[26,0,0,33,24,56.14],
    [26,0,0,33,18,1.04],[24,44,57.96,33,27,41.14]
   ]
  },
  {
   key:'swcrete',name:'Νοτιοδυτικά Κρήτης',short:'ΝΔ Κρήτη',
   area:19868.37,owner:'ExxonMobil (70%) · HELLENiQ ENERGY (30%)',
   source:'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52017XG1202(01)',
   sourceYear:2017,
   vertices:[
    [22,15,0,35,30,0],[22,55,0,35,30,0],
    [22,55,0,35,20,0],[23,20,0,35,20,0],
    [23,20,0,35,5,0],[23,35,0,35,5,0],
    [23,35,0,34,40,0],[23,55,0,34,40,0],
    [23,55,0,34,10,0],[23,35,0,34,10,0],
    [23,35,0,33,40,0],[22,15,0,34,20,0]
   ]
  }
 ];
 const features=blocks.map(block=>{
  const ring=block.vertices.map(([ld,lm,ls,ad,am,as])=>[coordinate(ld,lm,ls),coordinate(ad,am,as)]);
  ring.push(ring[0]);
  if(new Set(ring.map(x=>x.join(','))).size<4)throw Error('Άκυρα σημεία: '+block.name);
  return {type:'Feature',properties:{
    key:block.key,name:block.name,short:block.short,area:block.area,operator:block.owner,
    source:block.source||source,sourceYear:block.sourceYear||2025,precision:'Δημοσιευμένες κορυφές WGS84 στην Επίσημη Εφημερίδα της ΕΕ'
   },geometry:{type:'Polygon',coordinates:[ring]}};
 });
 window.GreekOffshoreOfficial={
  date:'2025-06-12',source,
  type:'FeatureCollection',features
 };
})();