/* Greek offshore concessions on the shared Leaflet map.
   Draws ONE unified polygon per concession from the official WGS84 vertices
   published in the Official Journal of the EU (C/2025/3335 and 2017/C 411/04).
   No arbitrary hand-drawn borders or visible 5' x 5' grid cells. */
(function(){
 'use strict';
 window.createGreekOffshoreOverlay=function(map,getCountry){
  const data=window.GreekOffshoreOfficial;
  if(!window.L||!data||!data.features||data.features.length!==5){
   return {toggle:function(){},status:'Δεν φορτώθηκαν οι επίσημες ελληνικές κορυφές WGS84. Δες την ΕΔΕΥΕΠ.'};
  }
  const attribution='<a href="https://eur-lex.europa.eu/eli/C/2025/3335/oj/eng" target="_blank" rel="noopener noreferrer">Ελλάδα — δημοσιευμένες κορυφές WGS84, Επίσημη Εφημερίδα ΕΕ</a>';
  const blocks=L.geoJSON(data,{
   style:{color:'#bf257d',weight:2,opacity:.92,fillColor:'#d92787',fillOpacity:.31},
   onEachFeature:function(feature,layer){
    const p=feature.properties;
    const popup='<strong>'+p.name+'</strong>'+
     '<div>Δημοσιευμένο εμβαδόν: '+p.area.toLocaleString('el-GR')+' τ.χλμ.</div>'+
     '<div>'+p.operator+'</div>'+
     '<p style="font-size:.85rem">Το περίγραμμα προκύπτει από δημοσιευμένες κορυφές WGS84 στην Επίσημη Εφημερίδα της ΕΕ ('+p.sourceYear+'). Δεν αποτελεί οριοθέτηση ΑΟΖ.</p>'+
     '<a href="'+p.source+'" target="_blank" rel="noopener noreferrer">Επίσημες συντεταγμένες ↗</a>';
    layer.bindPopup(popup);
   }
  });
  const labelPositions={
   a2:[36.72,21.18],pelop:[35.94,22.34],
   crete1:[34.08,24.18],crete2:[34.05,25.60],
   swcrete:[34.63,23.14]
  };
  const names=L.layerGroup(data.features.map(f=>{
   const p=f.properties;
   const width=p.key==='pelop'?119:92;
   return L.marker(labelPositions[p.key],{
    icon:L.divIcon({className:'gr-block-pin',html:p.short,
     iconSize:[width,28],iconAnchor:[width/2,14]}),
    zIndexOffset:500,title:p.name
   }).bindPopup('<strong>'+p.name+'</strong><p>Επίσημες συντεταγμένες WGS84 (ΕΕ '+p.sourceYear+').</p>'+
    '<a href="'+p.source+'" target="_blank" rel="noopener noreferrer">Δες την πηγή ↗</a>');
  }));
  function toggle(country){
   const visible=country==='all'||country==='gr';
   if(visible&&!map.hasLayer(blocks)){
    blocks.addTo(map);map.attributionControl.addAttribution(attribution);
   } else if(!visible&&map.hasLayer(blocks)){
    map.removeLayer(blocks);map.attributionControl.removeAttribution(attribution);
   }
   const labelsVisible=visible&&(country==='gr'||map.getZoom()>=5);
   if(labelsVisible&&!map.hasLayer(names))names.addTo(map);
   else if(!labelsVisible&&map.hasLayer(names))map.removeLayer(names);
  }
  map.on('zoomend',()=>toggle(getCountry()));
  toggle(getCountry());
  return {
   toggle,
   status:'Εμφανίζονται 5 ελληνικές περιοχές ως ενιαία μωβ πολύγωνα, από τις δημοσιευμένες κορυφές WGS84 της Επίσημης Εφημερίδας της ΕΕ (2017 και 2025). Για τις υπόλοιπες ελληνικές παραχωρήσεις δες την ΕΔΕΥΕΠ.'
  };
 };
})();