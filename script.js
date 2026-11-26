(() => {
  const catalog = window.NycEats;
  const form = document.getElementById('picker');
  const fields = { borough: document.getElementById('borough'), cuisine: document.getElementById('cuisine'), price: document.getElementById('price') };
  const dialog = document.getElementById('result');
  const history = [];
  let current = null;
  for (const key of Object.keys(fields)) {
    for (const value of catalog.options[key]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = key === 'price' ? `${value} · ${value.length === 1 ? 'budget friendly' : value.length === 2 ? 'moderate' : 'special occasion'}` : value;
      fields[key].append(option);
    }
  }
  const filters = () => Object.fromEntries(Object.entries(fields).map(([key, select]) => [key, select.value]));
  const matching = () => catalog.matches(filters());
  const updateCount = () => {
    const count = matching().length;
    document.getElementById('matches').textContent = `${count.toLocaleString()} ${count === 1 ? 'restaurant matches' : 'restaurants match'} your picks`;
    document.getElementById('pick').disabled = count === 0;
    document.getElementById('surprise').disabled = catalog.restaurants.length === 0;
  };
  const choose = (pool = matching()) => {
    if (!pool.length) return;
    current = catalog.pick(pool, current);
    document.getElementById('result-name').textContent = current.name;
    document.getElementById('result-cuisine').textContent = current.cuisine;
    document.getElementById('result-price').textContent = current.price;
    document.getElementById('result-address').textContent = `${current.address} · ${current.borough}`;
    document.getElementById('maps').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${current.name}, ${current.address}, ${current.borough}, New York`)}`;
    history.unshift(current);
    history.splice(6);
    renderHistory();
    if (!dialog.open) dialog.showModal();
  };
  function renderHistory() {
    const list = document.getElementById('history');
    list.replaceChildren(...history.map(restaurant => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      const details = document.createElement('small');
      name.textContent = restaurant.name;
      details.textContent = `${restaurant.cuisine} · ${restaurant.borough}`;
      item.append(name, details);
      return item;
    }));
    document.getElementById('empty-history').hidden = history.length > 0;
  }
  Object.values(fields).forEach(select => select.addEventListener('change', updateCount));
  form.addEventListener('submit', event => { event.preventDefault(); choose(); });
  document.getElementById('surprise').addEventListener('click', () => choose(catalog.restaurants));
  document.getElementById('reroll').addEventListener('click', () => choose(matching()));
  document.getElementById('close-result').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.getElementById('reset').addEventListener('click', () => { form.reset(); updateCount(); });
  updateCount();
})();
