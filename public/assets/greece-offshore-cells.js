/* Ελληνικές θαλάσσιες περιοχές, ΦΕΚ Β' 2104/30.04.2025, Παράρτημα Α, σ. 21081-21089.
   Επίσημο πλέγμα 5' x 5' με κωδικούς βασικού ορθογωνίου (ΝΔ γωνία lon,lat)/αύξοντα 1-144.
   Τα τετράγωνα με αστερίσκο στο ΦΕΚ είναι ΜΟΝΟ ΜΕΡΙΚΩΣ εντός ελληνικής δικαιοδοσίας.
   Δεν ζωγραφίζουμε αυτά τα κελιά ως γεμάτα πολύγωνα. Δεν υποκαθιστούμε την επίσημη
   οριοθέτηση, ούτε απεικονίζουμε τα πλήρη ακριβή όρια στα μερικά τετράγωνα.
   Επιθεωρημένοι κωδικοί από τους δημοσιευμένους πίνακες, όχι γεωαναφορά από εικόνα.
   Η έκδοση αυτή αφορά μόνο τις τέσσερις περιοχές του διαγωνισμού 2025. */
(function(){
 'use strict';
 const gazette='https://www.worldenergynews.gr/images/pdf/FEK_Proki%CC%81ryxis_Diethnou%CC%81s_Diagonismou%CC%81.pdf';
 const plans=[
  {key:'a2',name:'Α2',page:32,area:826,operator:'Chevron (70%) · HELLENiQ ENERGY (30%)',grid:{
    '21,36':'109-112 97-101 87-89'
  }},
  {key:'pelop',name:'Νότια της Πελοποννήσου',page:34,area:10211,operator:'Chevron (70%) · HELLENiQ ENERGY (30%)',grid:{
    '23,35':'133 121 109 97 85 73-76 61-64 49-52',
    '22,36':'32 13-20 2-8 61-62 49-50 37-39 25-31',
    '22,35':'130-132 112-120 100-108 88-96 76 136-144 124-129 77-84 72 60',
    '21,36':'71-72 53-60 41-48 85-86 73-79 61-70 36 24',
    '20,36':'84 72 120 108 96'
  }},
  {key:'crete1',name:'Νότια της Κρήτης 1',page:36,area:13347,operator:'Chevron (70%) · HELLENiQ ENERGY (30%)',grid:{
    '24,34':'85-93 73-81 61-69 49-57 37-45 25-33 13-21 1-9',
    '24,33':'133-141 121-129 109-117 97-105 85* 86-93 73-75* 64-69* 76* 77-81',
    '23,34':'96 84 72 60 48 36 20-24 8-12 92-95 80-83 68-71 56-59 44-47 32-35',
    '23,33':'118-120 104-106* 107-108 94-96* 140-144 128-132 116-117'
  }},
  {key:'crete2',name:'Νότια της Κρήτης 2',page:38,area:21805,operator:'Chevron (70%) · HELLENiQ ENERGY (30%)',grid:{
    '26,34':'109-111 97-99 85-87 73-75 61-63 49-51 37-39 25-27 13-15 1-3',
    '26,33':'98-99 85-87 73-75 61-63* 133-135 121-123 109-111 97 49* 37*',
    '25,34':'1-120',
    '25,33':'133-144 121-132 109-120 97-108 85-96 73-84 63-65* 66-72 56-58* 59-60 61-62* 53-55* 46-48*',
    '24,34':'35-36 22-24 10-12 118-120 106-108 94-96 82-84 70-72 58-60 46-48 34',
    '24,33':'142-144 130-132 118-120 106-108 94-96 82-84 70-72*'
  }}
 ];
 const full=[],partial=[];
 for(const plan of plans){
  const used=new Set();
  let total=0,limited=0,weightedLng=0,weightedLat=0;
  for(const [degree,codes] of Object.entries(plan.grid)){
   const [lon,lat]=degree.split(',').map(Number);
   for(const token of codes.split(/\s+/)){
    const match=token.match(/^(\d+)(?:-(\d+))?(\*)?$/);
    if(!match)throw Error('Μη αναγνωρίσιμος κωδικός ΦΕΚ: '+token);
    const start=Number(match[1]),end=match[2]?Number(match[2]):start,isPartial=!!match[3];
    for(let id=start;id<=end;id++){
     if(id<1||id>144)throw Error('Κωδικός εκτός 1-144: '+id);
     const code=degree+'/'+id;
     if(used.has(code))throw Error('Διπλό τετράγωνο: '+plan.name+' '+code);
     used.add(code);
     // Στο ΦΕΚ 21089: 1-12 είναι η ΝΟΤΙΑ σειρά από Δ προς Α,
     // 13-24 η αμέσως βορειότερη σειρά κ.ο.κ.
     const west=lon+((id-1)%12)/12,south=lat+Math.floor((id-1)/12)/12;
     const ring=[[west,south],[west+1/12,south],[west+1/12,south+1/12],[west,south+1/12],[west,south]];
     const feature={type:'Feature',geometry:{type:'Polygon',coordinates:[ring]},properties:{
      name:plan.name,key:plan.key,grid:code,area:plan.area,operator:plan.operator,
      approximate:false,partiallyIncluded:isPartial,source:gazette+'#page='+plan.page
     }};
     if(isPartial){partial.push(feature);limited++}
     else {full.push(feature);total++;weightedLng+=west+1/24;weightedLat+=south+1/24}
    }
   }
  }
  if(total===0)throw Error('Κενό οικόπεδο: '+plan.name);
  plan.cellCount=total;plan.partialCount=limited;
  plan.center=[weightedLat/total,weightedLng/total];
 }
 window.GreekOffshore2025={
  date:'2025-04-30',source:gazette,plans:plans.map(({key,name,page,area,operator,cellCount,partialCount,center})=>({
   key,name,source:gazette+'#page='+page,area,operator,cellCount,partialCount,center
  })),
  complete:{type:'FeatureCollection',features:full},
  partial:{type:'FeatureCollection',features:partial}
 };
})();