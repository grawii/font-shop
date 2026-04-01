let cart = []; 
function lockScroll(isL) { document.body.style.overflow = isL ? 'hidden' : 'auto'; }
function toggleDrawer() { 
    const d = document.getElementById('drawer'), o = document.getElementById('overlay');
    if(d.classList.contains('open')) { d.classList.remove('open'); o.style.display = 'none'; lockScroll(false); }
    else { d.classList.add('open'); o.style.display = 'block'; lockScroll(true); }
}
function closeDrawer() { document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').style.display = 'none'; lockScroll(false); }
function navTo(pId) { 
    document.querySelectorAll('.view-page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; }); 
    const t = document.getElementById('page-' + (pId === 'home' || pId === 'shop' ? pId : pId)); 
    if(t) { t.classList.add('active'); t.style.display = 'block'; } 
    closeDrawer(); closeFullPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); 
    if (pId === 'home') renderHome(); if (pId === 'shop') renderShop(); 
}
function createCardHtml(p, cN) { 
    const s = cart.find(i => i.id === p.id) ? 'selected' : ''; 
    return `<div class="item-card bg-white p-3.5 shadow-sm transition-all ${s}" data-id="${p.id}" onclick="toggleItem('${p.id}','${cN}','${p.name}',${p.price},${p.isPromo || false})"><div class="rounded-2xl aspect-square mb-3 overflow-hidden"><img src="${Array.isArray(p.img) ? p.img[0] : p.img}" class="w-full h-full object-cover"></div><h4 class="font-bold text-[14px] text-brown font-mitr">${p.name}</h4><div class="flex items-center gap-2 mt-1"><span class="bg-pinky-dark text-white text-[12px] px-2 py-0.5 rounded-lg font-bold">฿${p.price}</span></div></div>`; 
}
function viewCategoryByTag(mT, sT = null) {
    let html = '', found = false;
    categories.forEach(cat => {
        const match = cat.products.filter(p => { 
            let m = (mT === 'Recommend') ? p.isRecommend : (mT === 'ฟอนต์' ? true : (p.tags && p.tags.includes(mT)));
            return m && (!sT || (p.tags && p.tags.includes(sT))); 
        });
        if (match.length > 0) { found = true; html += `<div class="col-span-2 mt-10 mb-4 border-l-4 border-pinky-dark pl-3 font-bold text-brown text-2xl">${cat.name}</div><div class="grid grid-cols-2 gap-4 col-span-2">${match.slice(0,4).map(p => createCardHtml(p, cat.name)).join('')}</div>`; }
    });
    document.getElementById('fullPageTitle').innerText = sT || mT; document.getElementById('fullPageGrid').innerHTML = found ? html : '<div class="col-span-2 text-center py-20">ยังไม่มีสินค้าค่ะ 🍇</div>';
    const fp = document.getElementById('fullPageCategory'); fp.classList.add('active'); fp.style.display = 'block'; lockScroll(true); closeDrawer(); lucide.createIcons();
}
function closeFullPage() { const fp = document.getElementById('fullPageCategory'); if(fp){ fp.classList.remove('active'); fp.style.display = 'none'; } lockScroll(false); }
function calculateTotal() { 
    let sub = cart.reduce((s, i) => s + i.price, 0); 
    let pAM = cart.filter(i => (i.cat.includes('AM') || i.cat.includes('KT')) && i.isPromo).length;
    let dAM = Math.floor(pAM / 2) * 18; 
    return { total: sub - dAM, discount: dAM }; 
}
function toggleItem(id, cat, name, price, isP) { 
    const idx = cart.findIndex(i => i.id === id); if(idx > -1) cart.splice(idx, 1); else cart.push({id, cat, name, price, isPromo: isP}); 
    document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.classList.toggle('selected')); updateBottomBar(); 
}
function updateBottomBar() {
    const r = calculateTotal(), b = document.getElementById('bottomBar'), c = document.getElementById('cartCount'), t = document.getElementById('cartTotal');
    if (cart.length > 0) { b.classList.remove('translate-y-full'); t.innerText = r.total; c.innerHTML = `เลือก ${cart.length} รายการ ${r.discount > 0 ? `<span style="color:#FF4D4D">(ลด ฿${r.discount})</span>` : ''}`; } 
    else b.classList.add('translate-y-full');
}
function openSummary() { 
    const r = calculateTotal(); let h = ''; cart.forEach(i => h += `<div class="flex justify-between text-sm mb-1"><span>• ${i.name}</span><b>฿${i.price}</b></div>`); 
    document.getElementById('modalItemsList').innerHTML = h; document.getElementById('modalTotalPrice').innerText = r.total;
    const sm = document.getElementById('summaryModal'); sm.classList.remove('hidden'); sm.classList.add('flex'); lockScroll(true); 
}
function closeSummary() { const sm = document.getElementById('summaryModal'); sm.classList.add('hidden'); sm.classList.remove('flex'); lockScroll(false); }
function checkout() { 
    const r = calculateTotal(); let text = "สรุปรายการ🤍\n" + cart.map(i => `• ${i.name} (${i.price}.-)`).join('\n') + `\n\nยอดรวม: ${r.total}.-`;
    const temp = document.createElement("textarea"); temp.value = text; document.body.appendChild(temp); temp.select(); document.execCommand("copy"); document.body.removeChild(temp);
    alert("คัดลอกรายการสั่งซื้อแล้ว!"); window.location.href = "https://line.me/ti/p/@309ranuu"; 
}
document.addEventListener('DOMContentLoaded', () => { 
    navTo('home'); lucide.createIcons(); 
    const P = document.getElementById('pts'); ['✦','★','♥','🍇'].forEach(e => { for (let j = 0; j < 5; j++) { const d = document.createElement('div'); d.className = 'pt'; d.textContent = e; d.style.cssText = `left:${Math.random()*100}vw;animation-duration:${10+Math.random()*10}s;`; P.appendChild(d); } }); 
});
