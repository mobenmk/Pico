const TKS={
 stock:s=>`<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6.5l3.5 3.5L11 2"/>${s>=1?'<path d="M6 6.5l3.5 3.5L16 2"/>':''}</g>`,
 bold:s=>`<g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 6.5l3 3L11 2.5"/>${s>=1?'<path d="M6.5 6.5l3 3L16 2.5"/>':''}</g>`,
 slim:s=>`<g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6.5l3.5 3.5L11 2"/>${s>=1?'<path d="M6 6.5l3.5 3.5L16 2"/>':''}</g>`,
 dots:s=>`<g fill="currentColor"><circle cx="5" cy="6" r="2.4"/>${s>=1?'<circle cx="12" cy="6" r="2.4"/>':''}</g>`,
 cubes:s=>`<g fill="currentColor"><rect x="2" y="3.6" width="5" height="5" rx="1"/>${s>=1?'<rect x="10" y="3.6" width="5" height="5" rx="1"/>':''}</g>`,
 lines:s=>`<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 10L9 2"/>${s>=1?'<path d="M11 10L14 2"/>':''}</g>`,
 hearts:s=>{const h=x=>`<path d="M${x} 10.5C${x-5} 7 ${x-3.6} 2 ${x} 4.6C${x+3.6} 2 ${x+5} 7 ${x} 10.5z"/>`;return `<g fill="currentColor">${h(5)}${s>=1?h(12.5):''}</g>`},
 ring:s=>`<g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="6" r="3"/>${s>=1?'<circle cx="12" cy="6" r="3"/>':''}</g>`,
 arrow:s=>`<g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2l4 4-4 4"/>${s>=1?'<path d="M9 2l4 4-4 4"/>':''}</g>`
};
const ncStyle=v=>{
 v=String(v||'');
 if(!/^#[0-9a-fA-F]{6}(,#[0-9a-fA-F]{6})?$/.test(v))return '';
 const c=v.split(',');
 return c.length>1?'background:linear-gradient(90deg,'+c[0]+','+c[1]+');-webkit-background-clip:text;background-clip:text;color:transparent':'color:'+c[0];
};
