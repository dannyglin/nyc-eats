(() => {
  const form = document.getElementById('picker');
  const fields = { borough: document.getElementById('borough'), cuisine: document.getElementById('cuisine') };
  const dialog = document.getElementById('result');
  const history = [];
  let catalog;
  let current = null;
  let loading = true;

  function updateCount() {
    if (loading || !catalog) return;
    const count = matching().length;
    document.getElementById('matches').textContent = `${count.toLocaleString()} ${count === 1 ? 'restaurant matches' : 'restaurants match'} your picks`;
    document.getElementById('pick').disabled = count === 0;
    document.getElementById('surprise').disabled = catalog.restaurants.length === 0;
  }

  const filters = () => Object.fromEntries(Object.entries(fields).map(([key, select]) => [key, select.value]));
  const matching = () => catalog.matches(filters());

  function choose(pool = matching()) {
    if (!pool.length) return;
    current = catalog.pick(pool, current);
    document.getElementById('result-name').textContent = current.name;
    document.getElementById('result-cuisine').textContent = current.cuisine;
    document.getElementById('result-borough').textContent = current.borough;
    document.getElementById('result-address').textContent = current.address || 'Address not listed';
    document.getElementById('maps').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${current.name}, ${current.address}, ${current.borough}, New York`)}`;
    history.unshift(current);
    history.splice(6);
    renderHistory();
    if (!dialog.open) dialog.showModal();
  }

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

  function populateFilters() {
    for (const key of Object.keys(fields)) {
      for (const value of catalog.options[key]) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        fields[key].append(option);
      }
    }
  }

  function showError(error) {
    loading = false;
    document.getElementById('matches').textContent = 'Restaurant data is temporarily unavailable. Please try again.';
    document.getElementById('result-name').textContent = 'Couldn’t load restaurants';
    console.error('NYC restaurant data could not be loaded:', error);
    document.getElementById('pick').disabled = true;
    document.getElementById('surprise').disabled = true;
  }

  async function start() {
    try {
      const restaurants = await window.NycEatsData.loadRestaurants();
      catalog = window.NycEatsData.createCatalog(restaurants);
      loading = false;
      populateFilters();
      updateCount();
    } catch (error) {
      showError(error);
    }
  }

  Object.values(fields).forEach(select => select.addEventListener('change', updateCount));
  form.addEventListener('submit', event => { event.preventDefault(); if (catalog) choose(); });
  document.getElementById('surprise').addEventListener('click', () => { if (catalog) choose(catalog.restaurants); });
  document.getElementById('reroll').addEventListener('click', () => { if (catalog) choose(matching()); });
  document.getElementById('close-result').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.getElementById('reset').addEventListener('click', () => { form.reset(); updateCount(); });
  start();
})();
