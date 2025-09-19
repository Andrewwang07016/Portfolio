// Products listing/detail placeholder
console.log('Products module loaded');
fetch('../data/products.json').then(r=>r.json()).then(d=>{
  console.log('Loaded sample products', d);
}).catch(console.error);
