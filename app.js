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
const walkthroughSteps = [
  {tool:'Brief', title:'Start with a product question', body:'Write the pain point before looking for a product. If you cannot name who is frustrated, when it happens, and what better means, the idea is not ready for research.', fields:[['idea','What pain are we solving?','e.g. restaurant queues feel anonymous'],['market','First target market','e.g. UK independent restaurants']], action:'Save the brief'},
  {tool:'Dropship.io', title:'Find a demand signal', body:'Look for a specific product with a recurring use case and a delivery gap. Record the evidence, the date checked, and why the customer buys now.', checklist:['Demand evidence recorded','Delivery gap named','Target customer is specific'], action:'Mark research checked'},
  {tool:'PPSPY', title:'Check competitor momentum', body:'Track 3–5 Shopify stores. Compare product pricing, store activity, estimated product velocity, and fulfillment promises. Treat estimated sales as directional.', checklist:['3 competitor stores logged','Price and positioning compared','PPSPY estimates labeled directional'], action:'Mark competitor check'},
  {tool:'Meta Ad Library + Winning Hunter', title:'Find the creative that is earning attention', body:'Look for active ads, hooks, formats, offers, ad-spend consistency, and the first three seconds. Borrow the insight, never the creative or claim.', checklist:['Active ads reviewed','Hook and offer captured','A distinct angle written'], action:'Mark ad intelligence checked'},
  {tool:'Supplier prompt', title:'Vet the source', body:'Check product match, sample, MOQ, landed cost, delivery, returns, stock, reviews, and documentation. Label every number quoted, verified, estimated, or unknown.', checklist:['Supplier evidence captured','Critical reviews checked','Shipping window verified'], action:'Mark supplier vetted'},
  {tool:'AutoDS', title:'Run the cash-flow gate', body:'Import as a draft only after the contribution stays positive after landed cost, payment fees, packaging, refunds allowance, and acquisition budget.', fields:[['sellPrice','Target selling price','e.g. 59'],['landedCost','Landed cost','e.g. 18'],['acquisition','Acquisition budget','e.g. 12']], action:'Evaluate cash flow'},
  {tool:'Atlas + Shopify', title:'Build and publish the store page', body:'Use verified sourcing facts to create the page, offer, images, bundles, and upsells. Shopify remains the source of truth for catalog, checkout, policies, and orders.', checklist:['Copy uses verified facts','Delivery and returns are clear','Product is still a draft until approved'], action:'Mark page ready'},
  {tool:'Agentic commerce + audit', title:'Launch, measure, decide', body:'Prepare structured product data for shopping agents, then audit the funnel weekly. Scale contribution, not vanity metrics. Pause anything without a path to profit.', checklist:['Agent-readable facts complete','7-day audit fields ready','Scale / pause rule written'], action:'Complete walkthrough'}
];
let walkthroughIndex=0, walkthroughDone=[];
const sourcingData = {
  'numbers-roll': { state: 'Ready to sample', trend: 'Evergreen', brief: 'Branded, tactile queue numbers for busy restaurant service.', criteria: ['Custom print under 250 MOQ', 'Thermal or uncoated stock', 'EU delivery under 10 days'], suppliers: [{name:'Print specialist', cost:'Quote needed', note:'Best for custom perforation'}, {name:'Hospitality printer', cost:'Quote needed', note:'Strong small-batch option'}] },
  'loyalty-card': { state: 'Ready to sample', trend: 'Growing', brief: 'A wallet-worthy reminder to return, printed with restraint.', criteria: ['Uncoated 350gsm card', 'Foil or letterpress option', 'Plastic-free'], suppliers: [{name:'Fine paper printer', cost:'Quote needed', note:'Best finish potential'}, {name:'Short-run printer', cost:'Quote needed', note:'Fast validation samples'}] },
  mint: { state: 'Researching', trend: 'Growing', brief: 'A familiar, food-safe end-of-meal moment with a branded wrapper.', criteria: ['Food safety documents', 'Custom wrapper MOQ', 'Shelf life over 9 months'], suppliers: [{name:'Confectionery co-packer', cost:'Quote needed', note:'Private-label capability'}, {name:'Hospitality sweet supplier', cost:'Quote needed', note:'Low-MOQ test run'}] },
  sweets: { state: 'Researching', trend: 'Seasonal', brief: 'Bright, shareable sweets that make the bill feel softer.', criteria: ['Food safety documents', 'Allergen information', 'Custom packaging option'], suppliers: [{name:'Confectionery co-packer', cost:'Quote needed', note:'Private-label capability'}, {name:'Independent sweet maker', cost:'Quote needed', note:'Premium story, smaller batches'}] },
  'cash-registry': { state: 'Researching', trend: 'Evergreen', brief: 'A robust till with a distinctive, satisfying physical experience.', criteria: ['Warranty and local service', 'Card-terminal compatibility', 'Spare-parts availability'], suppliers: [{name:'POS equipment distributor', cost:'Quote needed', note:'Reliable support and stock'}, {name:'Commercial till manufacturer', cost:'Quote needed', note:'Private-label potential at scale'}] },
  'barcode-scanner': { state: 'Researching', trend: 'Evergreen', brief: 'A cordless scanner that works hard and looks at home on the counter.', criteria: ['Bluetooth + USB modes', '1-year warranty minimum', 'Drop-test rating'], suppliers: [{name:'POS equipment distributor', cost:'Quote needed', note:'Quick route to tested units'}, {name:'Hardware manufacturer', cost:'Quote needed', note:'Best margins at higher volume'}] }
};
let selectedSource = 'numbers-roll';
const cashModels = {
  'numbers-roll': {cost:6, price:18, pack:1.1, cac:2.5, route:'AutoDS sourcing request'},
  'loyalty-card': {cost:8, price:24, pack:1.1, cac:3.5, route:'AutoDS sourcing request'},
  mint: {cost:5, price:16, pack:1.1, cac:2.25, route:'AutoDS sourcing request'},
  sweets: {cost:5, price:16, pack:1.1, cac:2.25, route:'AutoDS sourcing request'},
  'cash-registry': {cost:132, price:289, pack:5, cac:35, route:'AutoDS Marketplace draft'},
  'barcode-scanner': {cost:31, price:74, pack:2.5, cac:9, route:'AutoDS Marketplace draft'}
};
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

function renderWalkthrough(){
  const s=walkthroughSteps[walkthroughIndex], pct=Math.round(walkthroughIndex/(walkthroughSteps.length-1)*100);
  document.querySelector('#stepCount').textContent=`Step ${walkthroughIndex+1} of ${walkthroughSteps.length}`; document.querySelector('#progressPercent').textContent=`${pct}%`; document.querySelector('#progressBar').style.width=`${pct}%`;
  document.querySelector('#stepNav').innerHTML=walkthroughSteps.map((x,i)=>`<button class="step-dot ${i===walkthroughIndex?'active':''} ${walkthroughDone.includes(i)?'done':''}" data-step="${i}" aria-label="Go to step ${i+1}">${String(i+1).padStart(2,'0')}</button>`).join('');
  const fields=s.fields?.map(([id,label,placeholder])=>`<label class="walk-field">${label}<input id="${id}" placeholder="${placeholder}" /></label>`).join('')||'';
  const checks=s.checklist?.map((x,i)=>`<label class="walk-check"><input type="checkbox" data-check="${i}" /> <span>${x}</span></label>`).join('')||'';
  document.querySelector('#walkthroughCard').innerHTML=`<div class="walk-card-top"><span class="walk-tool">${s.tool}</span><span class="walk-state">${walkthroughDone.includes(walkthroughIndex)?'Complete':'Working step'}</span></div><h3>${s.title}</h3><p class="walk-body">${s.body}</p>${fields?`<div class="walk-fields">${fields}</div>`:''}${checks?`<div class="walk-checks">${checks}</div>`:''}<div class="walk-actions"><button class="button button-dark" id="completeStep">${s.action} <span>↗</span></button>${walkthroughIndex>0?'<button class="walk-back" id="prevStep">Back</button>':''}</div>`;
  document.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{walkthroughIndex=Number(btn.dataset.step);renderWalkthrough()}));
  document.querySelector('#completeStep').addEventListener('click',()=>{if(s.fields){const required=[...document.querySelectorAll('.walk-field input')];if(required.some(x=>!x.value.trim())){required.find(x=>!x.value.trim()).focus();return;}}walkthroughDone=[...new Set([...walkthroughDone,walkthroughIndex])];if(walkthroughIndex<walkthroughSteps.length-1)walkthroughIndex++;renderWalkthrough();});
  const back=document.querySelector('#prevStep');if(back)back.addEventListener('click',()=>{walkthroughIndex--;renderWalkthrough()});
}
renderWalkthrough();

function renderSourceLab(){
  const productById = Object.fromEntries(productData.map(p => [p.id, p]));
  document.querySelector('#sourceList').innerHTML = productData.map(p => { const s=sourcingData[p.id]; return `<button class="source-row ${p.id===selectedSource?'selected':''}" data-source="${p.id}"><span class="source-row-status ${s.state==='Ready to sample'?'sample':''}"></span><span>${p.name}</span><small>${s.state}</small></button>` }).join('');
  const p=productById[selectedSource], s=sourcingData[selectedSource], m=cashModels[selectedSource];
  const fee=Number((m.price*.03+.3).toFixed(2)), contribution=Number((m.price-m.cost-m.pack-m.cac-fee).toFixed(2)), margin=Math.round(contribution/m.price*100);
  document.querySelector('#sourceDetail').innerHTML = `<div class="detail-top"><div><p class="eyebrow">Sourcing brief</p><h3>${p.name}</h3></div><span class="trend">${s.trend} demand</span></div><p class="brief">${s.brief}</p><div class="detail-grid"><div><p class="label">Non-negotiables</p><ul>${s.criteria.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><p class="label">Supplier shortlist</p>${s.suppliers.map((x,i)=>`<div class="supplier"><span>0${i+1}</span><div><strong>${x.name}</strong><p>${x.note}</p></div><b>${x.cost}</b></div>`).join('')}</div></div><section class="ops-gate"><div class="ops-top"><div><p class="label">Dropship.io → AutoDS</p><strong>Signal, then execution.</strong><p>Use a delivery-gap trend signal to find the opportunity. Import only when the unit cash flow passes.</p></div><b class="cash-status ${contribution>0?'pass':'hold'}">${contribution>0?'Cash positive':'Hold'}</b></div><div class="money-inputs"><label>Sell price <input data-model="price" type="number" value="${m.price}" min="0" /></label><label>Landed cost <input data-model="cost" type="number" value="${m.cost}" min="0" /></label><label>Packaging <input data-model="pack" type="number" value="${m.pack}" min="0" step=".1" /></label><label>Acquisition <input data-model="cac" type="number" value="${m.cac}" min="0" step=".5" /></label></div><div class="money-result"><strong>€${contribution.toFixed(2)} contribution <i>(${margin}% of sale)</i></strong><span>includes 3% + €0.30 payment fee</span></div><p class="route">AutoDS route: <b>${m.route}</b> · Import as draft only</p></section><div class="source-actions"><button class="button button-dark" id="requestQuotes">Start AutoDS handoff <span>↗</span></button><button class="save-brief" id="saveBrief">Save sourcing brief</button></div>`;
  document.querySelectorAll('[data-source]').forEach(el=>el.addEventListener('click',()=>{selectedSource=el.dataset.source;renderSourceLab()}));
  document.querySelectorAll('[data-model]').forEach(input=>input.addEventListener('input',()=>{m[input.dataset.model]=Number(input.value)||0;renderSourceLab()}));
  document.querySelector('#requestQuotes').addEventListener('click',()=>alert(`AutoDS handoff ready for ${p.name}. Connect AutoDS, then import it as a draft only after a supplier quote and this cash-flow gate are approved.`));
  document.querySelector('#saveBrief').addEventListener('click',e=>{e.target.textContent='Brief saved ✓';});
}
renderSourceLab();

// Product studio: a local, instant draft generator. The adapter shape is ready
// for a server-side product importer/AutoDS connector when credentials exist.
const productForm = document.querySelector('#productForm');
const storePreview = document.querySelector('#storePreview');
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]));
const titleCase = value => value.replace(/\w+/g, word => word[0].toUpperCase() + word.slice(1));

function generateStorefront(event){
  event?.preventDefault();
  const name = document.querySelector('#productName').value.trim() || 'Your product';
  const url = document.querySelector('#productUrl').value.trim();
  const audience = document.querySelector('#productAudience').value.trim() || 'People who want a simpler everyday routine';
  const problem = document.querySelector('#productProblem').value.trim() || 'Making an everyday task easier';
  const price = Math.max(1, Number(document.querySelector('#productPrice').value) || 39);
  const cost = Math.max(0, Number(document.querySelector('#productCost').value) || 0);
  const store = document.querySelector('#storeName').value.trim() || 'Your new store';
  const contribution = Math.max(0, price - cost - Number((price * .03 + .3).toFixed(2)));
  const productTitle = titleCase(name);
  const words = productTitle.split(' ').filter(Boolean);
  const shortHook = words.length > 3 ? `${words.slice(0, 3).join(' ')} that fits your day` : `${productTitle} made simple`;
  const slug = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sourceState = url ? 'Supplier URL captured' : 'Supplier URL needed';

  storePreview.innerHTML = `<div class="preview-toolbar"><span><i></i> Draft storefront generated</span><button type="button" class="preview-copy" id="copyStorefront">Copy page brief</button></div>
    <div class="preview-page" data-copy="${escapeHtml(`${productTitle}\n${shortHook}\nFor: ${audience}\nSolves: ${problem}\nPrice: €${price}.00\nAutoDS route: ${url || 'supplier URL required'}`)}">
      <div class="preview-nav"><strong>${escapeHtml(store)}</strong><span>Shop · Reviews · <b>Cart (0)</b></span></div>
      <div class="preview-hero"><div class="preview-art"><span>${escapeHtml(words[0] || 'NEW')}</span><small>your product</small></div><div class="preview-copy"><p class="eyebrow">Made for ${escapeHtml(audience.toLowerCase())}</p><h3>${escapeHtml(productTitle)}</h3><p>${escapeHtml(shortHook)}. Designed around the moment your customer needs it most: ${escapeHtml(problem.toLowerCase())}.</p><div class="preview-proof"><span>★★★★★</span> 4.8 · 127 early customers</div><div class="preview-buy"><strong>€${price}.00</strong><button type="button">Add to cart ↗</button></div><small class="preview-shipping">Free shipping · 30-day returns · Secure checkout</small></div></div>
      <div class="preview-benefits"><span>01 <b>Useful by design</b><small>Built around a real customer moment.</small></span><span>02 <b>Fast to understand</b><small>Clear benefits above the fold.</small></span><span>03 <b>Easy to try</b><small>Low-friction offer and reassurance.</small></span></div>
    </div>
    <div class="handoff"><div><p class="eyebrow">AutoDS handoff</p><strong>${escapeHtml(sourceState)}</strong><p>${url ? 'The product is ready to be reviewed for import as a draft.' : 'Paste a supplier URL to prepare the import brief. Product claims and shipping still need verification.'}</p></div><span class="cash-status ${contribution > 0 ? 'pass' : 'hold'}">€${contribution.toFixed(2)} before ads</span></div>`;
  document.querySelector('#copyStorefront').addEventListener('click', async event => {
    await navigator.clipboard?.writeText(document.querySelector('.preview-page').dataset.copy);
    event.target.textContent = 'Copied ✓';
  });
}
productForm.addEventListener('submit', generateStorefront);
generateStorefront();
