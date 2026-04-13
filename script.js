ไหนอ่ะ หาไม่เจอ

let cart = []; 

function lockScroll(isLocked) { if (isLocked) document.body.classList.add('modal-open'); else document.body.classList.remove('modal-open'); }
function toggleDrawer() { 
    const d = document.getElementById('drawer'); const o = document.getElementById('overlay');
    if(d.classList.contains('open')) { d.classList.remove('open'); o.style.display = 'none'; lockScroll(false); }
    else { d.classList.add('open'); o.style.display = 'block'; lockScroll(true); }
}
function closeDrawer() { document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').style.display = 'none'; lockScroll(false); }
function toggleSubmenu(id) { const s = document.getElementById(id); const a = document.getElementById(id + '-arrow'); if(s) s.classList.toggle('open'); if(a) a.classList.toggle('rotate'); }
function navTo(pageId) { document.querySelectorAll('.view-page').forEach(p => p.classList.remove('active')); const t = document.getElementById('page-' + pageId); if(t) t.classList.add('active'); closeDrawer(); closeFullPage(); window.scrollTo({ top: 0, behavior: 'smooth' }); if (pageId === 'home') renderHome(); if (pageId === 'shop') renderShop(); }

function createCardHtml(p, catName) { 
    const isSel = cart.find(i => i.id === p.id) ? 'selected' : ''; 
    let badgeHtml = p.badge ? `<div class="badge-custom badge-red">${p.badge.text}</div>` : ''; 
    let imgContent = Array.isArray(p.img) ? `<div class="snap-slider card-snap-slider h-full w-full">${p.img.map(u => `<div class="snap-item w-full h-full shrink-0"><img src="${u}" class="w-full h-full object-cover"></div>`).join('')}</div>` : `<img src="${p.img}" class="w-full h-full object-cover">`; 
    return `<div class="item-card bg-white p-3.5 border-2 border-pinky-light shadow-sm transition-all ${isSel}" data-id="${p.id}" onclick="toggleItem('${p.id}','${catName}','${p.name}',${p.price},${p.isPromo || false})">${badgeHtml}<div class="rounded-2xl aspect-square mb-3 overflow-hidden relative">${imgContent}</div><h4 class="font-bold text-[14px] text-brown line-clamp-1 font-mitr">${p.name}</h4><p class="text-[9px] text-brown-light mt-0.5 mb-2 line-clamp-2 leading-tight">${p.detail || ''}</p><div class="flex items-center gap-2 mt-1">${p.oldPrice ? `<span class="text-[11px] line-through text-brown-light">฿${p.oldPrice}</span>` : ''}<span class="bg-pinky-dark text-white text-[12px] px-2 py-0.5 rounded-lg font-bold">฿${p.price}</span></div></div>`; 
}

function viewCategoryByTag(mainTag, subTag = null) {
    let resultsHtml = ''; 
    let foundAny = false;
    categories.forEach(cat => {
        const allMatch = cat.products.filter(p => { 
            let matchMain = (mainTag === 'Recommend') ? p.isRecommend : (mainTag === 'ฟอนต์' ? true : (p.tags && p.tags.some(t => t.includes(mainTag))));
            const matchSub = !subTag || (p.tags && p.tags.some(t => t.includes(subTag))); 
            return matchMain && matchSub; 
        });
        if (allMatch.length > 0) {
            foundAny = true; 
            resultsHtml += `<div class="col-span-2 mt-10 mb-4 flex flex-wrap justify-between items-center border-l-4 border-pinky-dark pl-3 font-bold text-brown">
                <span class="font-mitr text-2xl leading-tight mb-1 pr-2 flex-1 min-w-[200px]">${cat.name}</span>
                <button onclick="viewSubCategory('${cat.id}', '${subTag || ''}')" class="text-[13px] text-pinky-dark border-2 border-pinky-dark px-3 py-1 rounded-full font-bold hover:bg-pinky-dark hover:text-white transition-all whitespace-nowrap mb-1">ดูเพิ่มเติม ✨</button>
            </div><div class="grid grid-cols-2 gap-4 col-span-2">${allMatch.slice(0, 4).map(p => createCardHtml(p, cat.name)).join('')}</div>`;
        }
    });
    document.getElementById('fullPageTitle').innerText = subTag ? `${subTag}` : (mainTag === 'Recommend' ? 'สินค้าแนะนำ' : mainTag);
    document.getElementById('fullPageGrid').innerHTML = foundAny ? resultsHtml : '<div class="col-span-2 text-center py-20 font-bold text-brown-light">ยังไม่มีสินค้าในหมวดนี้ค่ะ 🍇</div>';
    const fp = document.getElementById('fullPageCategory'); 
    if(fp) { fp.style.display = 'block'; fp.scrollTo(0, 0); lockScroll(true); } 
    closeDrawer(); 
    lucide.createIcons();
}

function viewSubCategory(cId, sT) { 
    const cat = categories.find(c => c.id === cId); const f = cat.products.filter(p => !sT || (p.tags && p.tags.includes(sT))); 
    document.getElementById('fullPageTitle').innerText = `${cat.name} ${sT ? '- '+sT : ''}`; 
    document.getElementById('fullPageGrid').innerHTML = f.map(p => createCardHtml(p, cat.name)).join(''); 
    const fp = document.getElementById('fullPageCategory'); fp.style.display = 'block'; fp.scrollTo(0, 0); lockScroll(true); lucide.createIcons(); 
}

function closeFullPage() { document.getElementById('fullPageCategory').style.display = 'none'; lockScroll(false); }

function renderHome() { 
    let recs = []; categories.forEach(c => c.products.forEach(p => { if(p.isRecommend) recs.push({p, cName: c.name}); }));
    document.getElementById('home-recommend').innerHTML = recs.slice(0, 4).map(item => createCardHtml(item.p, item.cName)).join('');
    if(recs.length > 4) document.getElementById('recommend-more-btn').classList.remove('hidden'); else document.getElementById('recommend-more-btn').classList.add('hidden');
    lucide.createIcons();
}

function renderShop() { 
    let html = ''; 
    categories.forEach(cat => { 
        html += `<div class="space-y-6"><div class="mb-4 border-l-4 border-pinky-dark pl-3"><h3 class="font-mitr font-bold text-2xl text-brown leading-tight">${cat.name}</h3></div>`; 
        const subCats = ['ฟอนต์หัวข้อ', 'ฟอนต์เนื้อหา', 'ฟอนต์อิโมจิ', 'ลายน้ำ', 'BG', 'ไฟล์ตกแต่ง', 'อื่น ๆ'];
        subCats.forEach(sub => { 
            const filtered = cat.products.filter(p => p.tags && p.tags.includes(sub)); 
            if (filtered.length > 0) {
                html += `<div class="flex justify-between items-center mt-8 mb-3"><span class="text-s font-bold text-pinky-dark bg-white px-3 py-1 rounded-full border border-pinky-light">📂 หมวด ${sub}</span><button onclick="viewSubCategory('${cat.id}', '${sub}')" class="text-[12px] text-pinky-dark border-2 border-pinky-dark px-3 py-1 rounded-full font-bold hover:bg-pinky-dark hover:text-white transition-all whitespace-nowrap">ดูเพิ่มเติม ✨</button></div><div class="grid grid-cols-2 gap-4">${filtered.slice(0, 4).map(p => createCardHtml(p, cat.name)).join('')}</div>`; 
            }
        }); 
        html += `</div><hr class="my-12 border-pinky-light border-dashed">`; 
    }); 
    document.getElementById('shop-content').innerHTML = html; 
    lucide.createIcons(); 
}

function calculateTotal() { 
    let sub = cart.reduce((s, i) => s + i.price, 0); 
    let pAM = cart.filter(i => (i.cat.includes('AM') || i.cat.includes('KT') || i.cat.includes('ST') || i.cat.includes('TAU') || i.cat.includes('Chalihouse') || i.cat.includes('MysissHouse')) && i.isPromo).length;
    let dAM = Math.floor(pAM / 2) * 18; 
    let prnItems = cart.filter(i => i.cat.includes('PRN')).map(i => i.price).sort((a, b) => a - b);
    let dPRN = 0; for(let i = 0; i < Math.floor(prnItems.length / 2); i++) dPRN += prnItems[i];
    return { total: sub - dAM - dPRN, discAM: dAM, discPRN: dPRN }; 
}

function checkout() { 
    const res = calculateTotal(); let text = "สรุปรายการสั่งซื้อ🤍\n\n" + cart.map(i => `• ${i.cat}: ${i.name} (${i.price}.-)`).join('\n');
    if (res.discAM > 0) text += `\n✨ ส่วนลด AM: -${res.discAM} บาท`;
    if (res.discPRN > 0) text += `\n✨ ส่วนลด PRN (1แถม1): -${res.discPRN} บาท`;
    text += `\n\nยอดสุทธิ: ${res.total} บาท\n--------------------\nขอบคุณที่มาอุดหนุนร้านองุ่นนะคะ⭐️\nรอองุ่นตอบกลับ 5-10 นาทีน้าา🫶🏻☁️`; 
    const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); 
    alert("คัดลอกรายการสั่งซื้อแล้ว! กำลังไปที่หน้า LINE..."); window.location.href = "https://line.me/ti/p/@309ranuu"; 
}

function toggleItem(id, cat, name, price, isP) { 
    const idx = cart.findIndex(i => i.id === id); 
    if(idx > -1) cart.splice(idx, 1); 
    else cart.push({id, cat, name, price, isPromo: isP}); 
    document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.classList.toggle('selected')); 
    updateBottomBar(); 
}

function removeItem(id) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) {
        cart.splice(idx, 1);
        document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.classList.remove('selected'));
        updateBottomBar();
        openSummary();
        if (cart.length === 0) closeSummary();
    }
}

function updateBottomBar() { 
    const r = calculateTotal(); const b = document.getElementById('bottomBar'); 
    if (cart.length > 0) { b.classList.remove('translate-y-full'); document.getElementById('cartTotal').innerText = r.total; document.getElementById('cartCount').innerText = `เลือก ${cart.length} รายการ`; } 
    else b.classList.add('translate-y-full'); 
}

function openSummary() { 
    const r = calculateTotal(); let h = ''; 
    cart.forEach(i => {
        h += `<div class="flex justify-between items-center text-sm mb-2"><div class="flex items-center gap-2"><button onclick="removeItem('${i.id}')" class="w-5 h-5 flex items-center justify-center bg-red-100 text-red-500 rounded-full text-[10px] font-bold">✕</button><span>• ${i.name}</span></div><b class="text-brown">฿${i.price}</b></div>`;
    }); 
    document.getElementById('modalItemsList').innerHTML = h; 
    let pT = "";
    if (r.discAM > 0) pT += `✨ ส่วนลด AM: -฿${r.discAM}<br>`;
    if (r.discPRN > 0) pT += `✨ ส่วนลด PRN (1แถม1): -฿${r.discPRN}<br>`;
    document.getElementById('promoNotice').innerHTML = pT; document.getElementById('modalTotalPrice').innerText = r.total; 
    const sm = document.getElementById('summaryModal'); sm.classList.remove('hidden'); sm.classList.add('flex'); lockScroll(true); 
}

function closeSummary() { document.getElementById('summaryModal').classList.add('hidden'); lockScroll(false); }
function initAutoScroll(id) { const s = document.getElementById(id); if (!s) return; setInterval(() => { if (s.scrollLeft + s.offsetWidth >= s.scrollWidth - 10) s.scrollTo({ left: 0, behavior: 'smooth' }); else s.scrollBy({ left: s.offsetWidth, behavior: 'smooth' }); }, 5000); }
function initCardAutoScroll() { setInterval(() => { document.querySelectorAll('.card-snap-slider').forEach(s => { if (s.scrollLeft + s.offsetWidth >= s.scrollWidth - 10) s.scrollTo({ left: 0, behavior: 'smooth' }); else s.scrollBy({ left: s.offsetWidth, behavior: 'smooth' }); }); }, 4000); }

document.addEventListener('DOMContentLoaded', () => { 
    renderHome(); 
    const P = document.getElementById('pts'); 
    ['⭔','✦','★','♥','🍇'].forEach(e => { for (let j = 0; j < 6; j++) { const d = document.createElement('div'); d.className = 'pt'; d.textContent = e; d.style.cssText = `left:${Math.random()*100}vw;font-size:${14+Math.random()*10}px;color:#D1C7F0;animation-duration:${10+Math.random()*15}s;animation-delay:${-Math.random()*20}s;`; P.appendChild(d); } }); 
    lucide.createIcons(); initAutoScroll('review-slider'); initCardAutoScroll(); 
});
