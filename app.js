const productData = [
  { id: 'roll', category: 'paper', name: 'The number roll', note: '100 custom table numbers', price: 18, graphic: '<div class="roll"></div>' },
  { id: 'card', category: 'paper', name: 'Return card set', note: '100 loyalty cards, uncoated', price: 24, graphic: '<div class="card-stack">good ending</div>' },
  { id: 'mint', category: 'treats', name: 'Good night mints', note: 'A jar of 80 peppermint sweets', price: 16, graphic: '<div class="mints"><span class="mint">mint</span><span class="mint">mint</span><span class="mint">mint</span></div>' },
  { id: 'pinkroll', category: 'paper', name: 'The pink number roll', note: '100 rose-coloured numbers', price: 19, graphic: '<div class="roll" style="filter:hue-rotate(315deg)"></div>' },
  { id: 'thankyou', category: 'paper', name: 'Thank you cards', note: '100 small notes of gratitude', price: 21, graphic: '<div class="card-stack">with thanks</div>' },
  { id: 'lemon', category: 'treats', name: 'Lemon drops', note: 'A jar of 80 bright little sweets', price: 16, graphic: '<div class="mints" style="filter:hue-rotate(45deg)"><span class="mint">sweet</span><span class="mint">sweet</span><span class="mint">sweet</span></div>' },
  { id: 'till', category: 'counter', name: 'The big sound till', note: 'A satisfyingly solid cash machine', price: 289, graphic: '<div class="till"><div class="till-screen">€ 24.00</div><div class="till-keys"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' },
  { id: 'scanner', category: 'counter', name: 'The scan wand', note: 'Cordless barcode scanner', price: 74, graphic: '<div class="scanner"><div class="scanner-head"><span></span></div><div class="scanner-handle"></div></div>' }
];
const products = document.querySelector('#products');
const cart = [];
let activeFilter = 'all';
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
