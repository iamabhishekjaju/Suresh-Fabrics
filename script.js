
async function loadJSON(path){ const r = await fetch(path); return await r.json(); }

function productCard(p){
  return `<div class="card">
    <img src="${p.image}" alt="${p.name}">
    <h4>${p.name}</h4>
    <p>${p.description}</p>
    <p><strong>Pattern:</strong> ${p.pattern} • <strong>Width:</strong> ${p.width_inch}"</p>
    <p><span class="price">${p.price_range_inr_per_meter}</span> / meter</p>
    <a class="btn outline" href="contact.html#enquiry" onclick="prefill('${p.sku}')">Enquire</a>
  </div>`;
}

function renderPopular(products){
  const el = document.getElementById('popular-cards');
  if(!el) return;
  const picks = products.slice(0,3);
  el.innerHTML = picks.map(productCard).join('');
}

function renderProducts(products){
  const el = document.getElementById('product-list');
  if(!el) return;
  el.innerHTML = products.map(productCard).join('');
}

function applyFilters(products){
  const q = document.getElementById('search').value.toLowerCase();
  const pat = document.getElementById('patternFilter').value;
  const w = document.getElementById('widthFilter').value;
  return products.filter(p => {
    let ok = true;
    if(q) ok = (p.name + ' ' + p.pattern + ' ' + p.colors.join(' ')).toLowerCase().includes(q);
    if(ok && pat) ok = p.pattern === pat;
    if(ok && w) ok = String(p.width_inch) === w;
    return ok;
  });
}

function prefill(sku){
  localStorage.setItem('prefillSKU', sku);
}

function hydrateEnquiry(){
  const sku = localStorage.getItem('prefillSKU');
  if(!sku) return;
  const txt = document.querySelector('textarea[name="message"]');
  if(txt && !txt.value) txt.value = `Enquiry for SKU ${sku}: `;
}

document.addEventListener('DOMContentLoaded', async () => {
  const products = await loadJSON('data/products.json').catch(()=>[]);
  renderPopular(products);
  renderProducts(products);

  const inputs = ['search','patternFilter','widthFilter'].map(id => document.getElementById(id)).filter(Boolean);
  inputs.forEach(inp => inp.addEventListener('input', () => renderProducts(applyFilters(products))));

  hydrateEnquiry();
});
