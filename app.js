const productData = [
  { id: 'numbers-roll', category: 'paper', name: 'Numbers roll', note: '100 custom table numbers', price: 18, graphic: '<div class="roll"></div>' },
  { id: 'loyalty-card', category: 'paper', name: 'Loyalty card', note: '100 loyalty cards, uncoated', price: 24, graphic: '<div class="card-stack">good ending</div>' },
  { id: 'mint', category: 'treats', name: 'Mint', note: 'A jar of 80 peppermint mints', price: 16, graphic: '<div class="mints"><span class="mint">mint</span><span class="mint">mint</span><span class="mint">mint</span></div>' },
  { id: 'sweets', category: 'treats', name: 'Sweets', note: 'A jar of 80 bright little sweets', price: 16, graphic: '<div class="mints" style="filter:hue-rotate(45deg)"><span class="mint">sweet</span><span class="mint">sweet</span><span class="mint">sweet</span></div>' },
  { id: 'cash-registry', category: 'counter', name: 'Cash registry', note: 'A satisfyingly solid cash machine', price: 289, graphic: '<div class="till"><div class="till-screen">€ 24.00</div><div class="till-keys"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' },
  { id: 'barcode-scanner', category: 'counter', name: 'Barcode scanner', note: 'Cordless barcode scanner', price: 74, graphic: '<div class="scanner"><div class="scanner-head"><span></span></div><div class="scanner-handle"></div></div>' }
];
const products = document.querySelector('#products');
const cart = [];
let activeFilter = 'all';
const sourcingData = {
  'numbers-roll': { state: 'Ready to sample', trend: 'Evergreen', brief: 'Branded, tactile queue numbers for busy restaurant service.', criteria: ['Custom print under 250 MOQ', 'Thermal or uncoated stock', 'EU delivery under 10 days'], suppliers: [{name:'Print specialist', cost:'Quote needed', note:'Best for custom perforation'}, {name:'Hospitality printer', cost:'Quote needed', note:'Strong small-batch option'}] },
  'loyalty-card': { state: 'Ready to sample', trend: 'Growing', brief: 'A wallet-worthy reminder to return, printed with restraint.', criteria: ['Uncoated 350gsm card', 'Foil or letterpress option', 'Plastic-free'], suppliers: [{name:'Fine paper printer', cost:'Quote needed', note:'Best finish potential'}, {name:'Short-run printer', cost:'Quote needed', note:'Fast validation samples'}] },
  mint: { state: 'Researching', trend: 'Growing', brief: 'A familiar, food-safe end-of-meal moment with a branded wrapper.', criteria: ['Food safety documents', 'Custom wrapper MOQ', 'Shelf life over 9 months'], suppliers: [{name:'Confectionery co-packer', cost:'Quote needed', note:'Private-label capability'}, {name:'Hospitality sweet supplier', cost:'Quote needed', note:'Low-MOQ test run'}] },
  sweets: { state: 'Researching', trend: 'Seasonal', brief: 'Bright, shareable sweets that make the bill feel softer.', criteria: ['Food safety documents', 'Allergen information', 'Custom packaging option'], suppliers: [{name:'Confectionery co-packer', cost:'Quote needed', note:'Private-label capability'}, {name:'Independent sweet maker', cost:'Quote needed', note:'Premium story, smaller batches'}] },
  'cash-registry': { state: 'Researching', trend: 'Evergreen', brief: 'A robust till with a distinctive, satisfying physical experience.', criteria: ['Warranty and local service', 'Card-terminal compatibility', 'Spare-parts availability'], suppliers: [{name:'POS equipment distributor', cost:'Quote needed', note:'Reliable support and stock'}, {name:'Commercial till manufacturer', cost:'Quote needed', note:'Private-label potential at scale'}] },
  'barcode-scanner': { state: 'Researching', trend: 'Evergreen', brief: 'A cordless scanner that works hard and looks at home on the counter.', criteria: ['Bluetooth + USB modes', '1-year warranty minimum', 'Drop-test rating'], suppliers: [{name:'POS equipment distributor', cost:'Quote needed', note:'Quick route to tested units'}, {name:'Hardware manufacturer', cost:'Quote needed', note:'Best margins at higher volume'}] }
};
let selectedSource = 'numbers-roll';
function renderProducts(){
  products.innerHTML = productData.filter(p => activeFilter === 'all' || p.category === activeFilter).map(p => `<article class="product"><div class="product-img"><div class="product-graphic">${p.graphic}</div></div><div class="product-info"><div><h3>${p.name}</h3><p>${p.note}</p></div><div><p>€${p.price}.00</p><button class="add" data-id="${p.id}">Add +</button></div></div></article>`).join('');
  document.querySelectorAll('.add').forEach(button => button.addEventListener('click', () => addToCart(button.dataset.id)));
}
function addToCart(id){ cart.push(productData.find(p => p.id === id)); renderCart(); document.querySelector('#cart').classList.add('open'); document.querySelector('#scrim').classList.add('open'); }
function renderCart(){
  document.querySelector('#bagCount').textContent = cart.length;
  const total = cart.reduce((sum,p) => sum + p.price, 0);
  document.querySelector('#subtotal').textContent = `€${total}.00`;
  document.querySelector('#cartItems').innerHTML = cart.length ? cart.map((p,i) => `<div class="cart-item"><div class="cart-thumb">${i+1}</div><div><h3>${p.name}</h3><p>€${p.price}.00 · 1</p></div></div>`).join('') : '<p class="empty">Your bag is waiting for a good thing.</p>';
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {activeFilter = button.dataset.filter; document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active', x===button)); renderProducts()}));
function closeCart(){ document.querySelector('#cart').classList.remove('open'); document.querySelector('#scrim').classList.remove('open'); }
document.querySelector('#bagButton').addEventListener('click',()=>{document.querySelector('#cart').classList.add('open');document.querySelector('#scrim').classList.add('open')});
document.querySelector('#closeCart').addEventListener('click',closeCart); document.querySelector('#scrim').addEventListener('click',closeCart);
document.querySelector('.checkout').addEventListener('click',()=>alert('Thanks — checkout is ready for your payment provider.'));
renderProducts();

function renderSourceLab(){
  const productById = Object.fromEntries(productData.map(p => [p.id, p]));
  document.querySelector('#sourceList').innerHTML = productData.map(p => { const s=sourcingData[p.id]; return `<button class="source-row ${p.id===selectedSource?'selected':''}" data-source="${p.id}"><span class="source-row-status ${s.state==='Ready to sample'?'sample':''}"></span><span>${p.name}</span><small>${s.state}</small></button>` }).join('');
  const p=productById[selectedSource], s=sourcingData[selectedSource];
  document.querySelector('#sourceDetail').innerHTML = `<div class="detail-top"><div><p class="eyebrow">Sourcing brief</p><h3>${p.name}</h3></div><span class="trend">${s.trend} demand</span></div><p class="brief">${s.brief}</p><div class="detail-grid"><div><p class="label">Non-negotiables</p><ul>${s.criteria.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><p class="label">Supplier shortlist</p>${s.suppliers.map((x,i)=>`<div class="supplier"><span>0${i+1}</span><div><strong>${x.name}</strong><p>${x.note}</p></div><b>${x.cost}</b></div>`).join('')}</div></div><div class="source-actions"><button class="button button-dark" id="requestQuotes">Request quotes <span>↗</span></button><button class="save-brief" id="saveBrief">Save sourcing brief</button></div>`;
  document.querySelectorAll('[data-source]').forEach(el=>el.addEventListener('click',()=>{selectedSource=el.dataset.source;renderSourceLab()}));
  document.querySelector('#requestQuotes').addEventListener('click',()=>alert(`Next step: add your market, target quantity and landed-cost target for ${p.name}, then we can invite verified suppliers to quote.`));
  document.querySelector('#saveBrief').addEventListener('click',e=>{e.target.textContent='Brief saved ✓';});
}
renderSourceLab();
