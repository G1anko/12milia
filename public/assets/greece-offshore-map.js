/* Leaflet display for Greek offshore concession cells from the 2025 official Gazette.
   Only FULL 5'×5' squares are shaded; partial starred boundary cells are NOT filled. */
(function(){
 'use strict';
 window.createGreekOffshoreOverlay=function(map,getCountry){
  const data=window.GreekOffshore2025;
  if(!window.L||!data||!data.complete||!data.complete.features.length){
   return {toggle:function(){},status:'Αδυναμία φόρτωσης του ελληνικού επιπέδου. Δες την επίσημη ΕΔΕΥΕΠ.'};
  }
  const attribution='<a href="https://herema.gr/tenders/" target="_blank" rel="noopener noreferrer">Ελλάδα — ΦΕΚ Β΄ 2104/2025, πλήρη τετράγωνα 5′</a>';
  const blocks=L.geoJSON(data.complete,{
   style:{color:'#ba5e29',weight:.8,opacity:.75,fillColor:'#f6a253',fillOpacity:.32},
   onEachFeature:function(feature,layer){
    const p=feature.properties;
    const popup='<strong>'+p.name+'</strong><div>Πλήρες τετράγωνο 5′ × 5′: '+p.grid+'</div>'+
     '<div>Έρευνα: '+p.operator+'</div>'+
     '<p style="font-size:.85rem">Επίσημο πλήρες τετράγωνο, όχι το συνολικό εξωτερικό περίγραμμα της παραχώρησης.</p>'+
     '<a href="'+p.source+'" target="_blank" rel="noopener noreferrer">Πίνακας ΦΕΚ ↗</a>';
    layer.bindPopup(popup);
   }
  });
  const names=L.layerGroup(data.plans.map(plan=>
   L.marker(plan.center,{
    icon:L.divIcon({
     className:'gr-block-pin',html:plan.name,iconSize:[132,34],iconAnchor:[66,17]
    }),title:plan.name,zIndexOffset:500
   }).bindPopup('<strong>'+plan.name+'</strong>'+
    '<div>Δημοσιευμένο εμβαδόν: '+plan.area.toLocaleString('el-GR')+' τ.χλμ.</div>'+
    '<div>Πλήρη τετράγωνα που προβάλλονται: '+plan.cellCount+'</div>'+
    '<div>Μερικά τετράγωνα που δεν προβάλλονται: '+plan.partialCount+'</div>'+
    '<p><a href="'+plan.source+'" target="_blank" rel="noopener noreferrer">Επίσημος πίνακας ΦΕΚ ↗</a></p>')
  ));
  function toggle(country){
   const visible=country==='all'||country==='gr';
   if(visible&&!map.hasLayer(blocks)){
    blocks.addTo(map);
    map.attributionControl.addAttribution(attribution);
   }else if(!visible&&map.hasLayer(blocks)){
    map.removeLayer(blocks);
    map.attributionControl.removeAttribution(attribution);
   }
   const showLabels=visible&&(country==='gr'||map.getZoom()>=5);
   if(showLabels&&!map.hasLayer(names))names.addTo(map);
   else if(!showLabels&&map.hasLayer(names))map.removeLayer(names);
  }
  map.on('zoomend',()=>toggle(getCountry()));
  toggle(getCountry());
  return {
   toggle,
   status:'Εμφανίζονται 4 ελληνικές περιοχές: '+data.complete.features.length+
    ' επίσημα πλήρη τετράγωνα 5′ × 5′ από το ΦΕΚ Β΄ 2104/2025. '+
    data.partial.features.length+' μερικά οριακά τετράγωνα δεν γεμίζουν. '+
    'Τα υπόλοιπα ελληνικά οικόπεδα εμφανίζονται προς το παρόν στον επίσημο χάρτη της ΕΔΕΥΕΠ.'
  };
 };
})();