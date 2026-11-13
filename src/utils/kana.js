const T={};
const rows={"":"あいうえお",k:"かきくけこ",s:"さしすせそ",t:"たちつてと",n:"なにぬねの",h:"はひふへほ",m:"まみむめも",r:"らりるれろ",g:"がぎぐげご",z:"ざじずぜぞ",d:"だぢづでど",b:"ばびぶべぼ",p:"ぱぴぷぺぽ",x:"ぁぃぅぇぉ"};
for(const c in rows)[..."aiueo"].forEach((v,i)=>T[c+v]=rows[c][i]);
const Y={ky:"き",gy:"ぎ",sy:"し",sh:"し",zy:"じ",jy:"じ",j:"じ",ty:"ち",ch:"ち",cy:"ち",dy:"ぢ",ny:"に",hy:"ひ",by:"び",py:"ぴ",my:"み",ry:"り"};
for(const p in Y)[["a","ゃ"],["u","ゅ"],["o","ょ"],["e","ぇ"]].forEach(([v,s])=>T[p+v]=Y[p]+s);
Object.assign(T,{ya:"や",yu:"ゆ",yo:"よ",wa:"わ",wo:"を",shi:"し",chi:"ち",tsu:"つ",fu:"ふ",ji:"じ",fa:"ふぁ",fi:"ふぃ",fe:"ふぇ",fo:"ふぉ",xya:"ゃ",xyu:"ゅ",xyo:"ょ",xtu:"っ",xtsu:"っ"});
const keys=Object.keys(T);
export const kt=s=>s.replace(/[ぁ-ゖ]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60));
export const flush=s=>s.replace(/n$/,"ん");
export function toKana(s){
  let o="",i=0;
  while(i<s.length){
    const r=s.slice(i),c=r[0],n=r[1];
    if(c==="n"&&n==="n"){o+="ん";i+=2;continue}
    if(n&&c===n&&/[kstcpghbdfjmrwyz]/.test(c)){o+="っ";i++;continue}
    let m=0;
    for(let l=Math.min(4,r.length);l>0;l--) if(T[r.slice(0,l)]){o+=T[r.slice(0,l)];i+=l;m=1;break}
    if(m)continue;
    if(c==="n"&&n&&!/[aiueoy]/.test(n)){o+="ん";i++;continue}
    if(r==="n"||keys.some(k=>k.startsWith(r))){o+=r;break}
    o+=c;i++;
  }
  return o;
}
