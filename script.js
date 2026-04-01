let cart = []; 
function lockScroll(isLocked) { if (isLocked) document.body.style.overflow = 'hidden'; else document.body.style.overflow = 'auto'; }

function toggleDrawer() { 
    const d = document.getElementById('drawer'); const o = document.getElementById('overlay');
    if(d.classList.contains('open')) { d.classList.remove('open'); o.style.display = 'none'; lockScroll(false); }
    else { d.classList.add('open'); o.style.display = 'block'; lockScroll(true); }
}

function closeDrawer() { document.getElementById('drawer').classList.remove('open'); document.getElementById('overlay').style.display = 'none'; lockScroll(false); }

function toggleSubmenu(id) { const s = document.getElementById(id); const a = document.getElementById(id + '-arrow'); if(s) s.classList.toggle('open'); if(a) a.classList.toggle('rotate'); }

function navTo(pageId) { 
    document.querySelectorAll('.view-page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; }); 
    const t = document.getElementById('page-' + pageId); 
    if(t) { t.classList.add('active'); t.style.display = 'block'; } 
    closeDrawer(); closeFullPage(); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    if (pageId === 'home') renderHome(); 
    if (pageId === 'shop') renderShop(); 
}

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
            let matchMain = false;
            if (mainTag === 'Recommend') {
                matchMain = p.isRecommend;
            } else if (mainTag === 'ฟอนต์') {
                matchMain = true; // ให้ผ่านเพื่อไปเช็ค subTag ต่อ
            } else {
                matchMain = (p.tags && p.tags.some(t => t.includes(mainTag)));
            }
            const matchSub = !subTag || (p.tags && p.tags.some(t => t.includes(subTag))); 
            return matchMain && matchSub; 
        });

        if (allMatch.length > 0) {
            foundAny = true; 
            resultsHtml += `<div class="col-span-2 mt-10 mb-4 flex flex-wrap justify-between items-center border-l-4 border-pinky-dark pl-3 font-bold text-brown">
                <span class="font-mitr text-2xl leading-tight mb-1 pr-2 flex-1 min-w-[200px]">${cat.name}</span>
                <button onclick="viewSubCategory('${cat.id}', '${subTag || ''}')" class="text-[13px] text-pinky-dark border-2 border-pinky-dark px-3 py-1 rounded-full font-bold">ดูเพิ่มเติม ✨</button>
            </div>
            <div class="grid grid-cols-2 gap-4 col-span-2">${allMatch.slice(0, 4).map(p => createCardHtml(p, cat.name)).join('')}</div>`;
        }
    });

    document.getElementById('fullPageTitle').innerText = subTag || mainTag;
    document.getElementById('fullPageGrid').innerHTML = foundAny ? resultsHtml : '<div class="col-span-2 text-center py-20 font-bold text-brown-light">ยังไม่มีสินค้าค่ะ 🍇</div>';
    
    const fp = document.getElementById('fullPageCategory'); 
    if(fp) { fp.classList.add('active'); fp.style.display = 'block'; fp.scrollTo(0, 0); lockScroll(true); } 
    closeDrawer(); 
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function viewSubCategory(cId, sT) { 
    const cat = categories.find(c => c.id === cId); 
    const f = cat.products.filter(p => !sT || (p.tags && p.tags.includes(sT))); 
    document.getElementById('fullPageTitle').innerText = `${cat.name} ${sT ? '- '+sT : ''}`; 
    document.getElementById('fullPageGrid').innerHTML = f.map(p => createCardHtml(p, cat.name)).join(''); 
    const fp = document.getElementById('fullPageCategory'); fp.classList.add('active'); fp.style.display = 'block'; fp.scrollTo(0, 0); lockScroll(true); 
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function closeFullPage() { 
    const fp = document.getElementById('fullPageCategory'); 
    if(fp) { fp.classList.remove('active'); fp.style.display = 'none'; } 
    lockScroll(false); 
}
function renderHome() { 
    let recs = []; categories.forEach(c => c.products.forEach(p => { if(p.isRecommend) recs.push({p, cName: c.name}); }));
    document.getElementById('home-recommend').innerHTML = recs.slice(0, 4).map(item => createCardHtml(item.p, item.cName)).join('');
    if(recs.length > 4) document.getElementById('recommend-more-btn').classList.remove('hidden'); else document.getElementById('recommend-more-btn').classList.add('hidden');
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function renderShop() { 
    let html = ''; 
    categories.forEach(cat => { 
        html += `<div class="space-y-6"><div class="mb-4 border-l-4 border-pinky-dark pl-3"><h3 class="font-mitr font-bold text-2xl text-brown leading-tight">${cat.name}</h3></div>`; 
        subCats.forEach(sub => { 
            const filtered = cat.products.filter(p => p.tags && p.tags.includes(sub)); 
            if (filtered.length > 0) {
                html += `<div class="flex justify-between items-center mt-8 mb-3"><span class="text-s font-bold text-pinky-dark bg-white px-3 py-1 rounded-full border border-pinky-light">📂 หมวด ${sub}</span><button onclick="viewSubCategory('${cat.id}', '${sub}')" class="text-[12px] text-pinky-dark border-2 border-pinky-dark px-3 py-1 rounded-full font-bold">ดูเพิ่มเติม ✨</button></div><div class="grid grid-cols-2 gap-4">${filtered.slice(0, 4).map(p => createCardHtml(p, cat.name)).join('')}</div>`; 
            }
        }); 
        html += `</div><hr class="my-12 border-pinky-light border-dashed">`; 
    }); 
    document.getElementById('shop-content').innerHTML = html; 
    if(typeof lucide !== 'undefined') lucide.createIcons(); 
}

function calculateTotal() { 
    let sub = cart.reduce((s, i) => s + i.price, 0); 
    let pAM = cart.filter(i => (i.cat.includes('AM') || i.cat.includes('KT')) && i.isPromo).length;
    let dAM = Math.floor(pAM / 2) * 18; 
    return { total: sub - dAM, discount: dAM }; 
}

function toggleItem(id, cat, name, price, isP) { 
    const idx = cart.findIndex(i => i.id === id); if(idx > -1) cart.splice(idx, 1); else cart.push({id, cat, name, price, isPromo: isP}); 
    document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.classList.toggle('selected')); 
    updateBottomBar(); 
}

function updateBottomBar() {
    const r = calculateTotal(); const b = document.getElementById('bottomBar');
    const c = document.getElementById('cartCount'); const t = document.getElementById('cartTotal');
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
    const r = calculateTotal(); let text = "สรุปรายการสั่งซื้อ🤍\n\n" + cart.map(i => `• ${i.name} (${i.price}.-)`).join('\n') + `\n\nยอดรวม: ${r.total}.-`;
    const temp = document.createElement("textarea"); temp.value = text; document.body.appendChild(temp); temp.select(); document.execCommand("copy"); document.body.removeChild(temp);
    alert("คัดลอกรายการสั่งซื้อแล้ว!"); window.location.href = "https://line.me/ti/p/@309ranuu"; 
}

document.addEventListener('DOMContentLoaded', () => { 
    navTo('home'); 
    const P = document.getElementById('pts'); ['✦','★','♥','🍇'].forEach(e => { for (let j = 0; j < 5; j++) { const d = document.createElement('div'); d.className = 'pt'; d.textContent = e; d.style.cssText = `left:${Math.random()*100}vw;animation-duration:${10+Math.random()*10}s;`; P.appendChild(d); } }); 
});
