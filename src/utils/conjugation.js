export const TE={う:"って",つ:"って",る:"って",む:"んで",ぶ:"んで",ぬ:"んで",く:"いて",ぐ:"いで",す:"して"};
export function te(w,g){
  if(g==="irr"){ if(w.endsWith("する")) return w.slice(0,-2)+"して"; return w==="来る"?"来て":"きて"; }
  if(g==="ru") return w.slice(0,-1)+"て";
  if(w.endsWith("行く")||w==="いく") return w.slice(0,-1)+"って"; // exceção
  return w.slice(0,-1)+TE[w.slice(-1)];
}
export const SUF={pol:"います",neg:"いません",plain:"いる"};
export const FORM={pol:"Vています",neg:"Vていません",plain:"Vている"};
export function ruleV(w,g,f){
  let r= g==="u" ? `Grupo う: ${w.slice(-1)} → ${TE[w.slice(-1)]}` : g==="ru" ? "Grupo る: tire る e coloque て" : "Irregular: する → して, くる → きて";
  return r+` + ${SUF[f]}`;
}
export const $=id=>document.getElementById(id);

export const IROW={う:'い',く:'き',ぐ:'ぎ',す:'し',つ:'ち',ぬ:'に',ぶ:'び',む:'み',る:'り'};
export const masu=(w,g)=>g==='irr'?(w.endsWith('する')?w.slice(0,-2)+'します':w==='来る'?'来ます':'きます'):g==='ru'?w.slice(0,-1)+'ます':w.slice(0,-1)+IROW[w.slice(-1)]+'ます';

// ---------- lições 10 a 15: formas ない e た ----------
export const ARow={う:"わ",く:"か",ぐ:"が",す:"さ",つ:"た",ぬ:"な",ぶ:"ば",む:"ま",る:"ら"};
export function nai(w,g){
  if(g==="irr"){ if(w.endsWith("する")) return w.slice(0,-2)+"しない"; return w==="来る"?"来ない":"こない"; }
  if(g==="ru") return w.slice(0,-1)+"ない";
  return w.slice(0,-1)+ARow[w.slice(-1)]+"ない";
}
export function ta(w,g){ return te(w,g).replace(/て$/,"た").replace(/で$/,"だ"); }
