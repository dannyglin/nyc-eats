(() => {
  const form = document.getElementById('picker');
  const fields = { borough: document.getElementById('borough'), cuisine: document.getElementById('cuisine') };
  const dialog = document.getElementById('result');
  const history = [];
  let catalog;
  let current = null;
  let loading = true;
  let spinning = false;
  let wheelRotation = 0;
  let wheelEntries = [];

  function updateCount() {
    if (loading || !catalog) return;
    const count = matching().length;
    document.getElementById('matches').textContent = `${count.toLocaleString()} ${count === 1 ? 'restaurant matches' : 'restaurants match'} your picks`;
    document.getElementById('pick').disabled = count === 0;
    document.getElementById('surprise').disabled = catalog.restaurants.length === 0;
    document.getElementById('spin').disabled = spinning || count === 0;
    document.getElementById('wheel-status').textContent = `${count.toLocaleString()} restaurants in this spin`;
  }

  const filters = () => Object.fromEntries(Object.entries(fields).map(([key, select]) => [key, select.value]));
  const matching = () => catalog.matches(filters());

  function choose(pool = matching(), selected = null) {
    if (!pool.length) return;
    current = selected || catalog.pick(pool, current);
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
    document.getElementById('spin').disabled = true;
    document.getElementById('surprise').disabled = true;
  }

  async function start() {
    try {
      const restaurants = await window.NycEatsData.loadRestaurants();
      catalog = window.NycEatsData.createCatalog(restaurants);
      loading = false;
      populateFilters();
      updateCount();
      drawWheel(catalog.restaurants.slice(0, 8));
    } catch (error) {
      showError(error);
    }
  }

  function drawWheel(entries) {
    wheelEntries = entries;
    const canvas = document.getElementById('wheel');
    const context = canvas.getContext('2d');
    const center = canvas.width / 2;
    const radius = center - 12;
    const colors = ['#f04d38', '#e8ff6a', '#f6a9ca', '#8b72e8', '#f7c54c', '#66d6bd', '#fd855f', '#b8a6ff'];
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(center, center);
    entries.forEach((restaurant, index) => {
      const segment = Math.PI * 2 / entries.length;
      const start = -Math.PI / 2 + index * segment;
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, radius, start, start + segment);
      context.closePath();
      context.fillStyle = colors[index % colors.length];
      context.fill();
      context.strokeStyle = '#211a35';
      context.lineWidth = 5;
      context.stroke();
      context.save();
      context.rotate(start + segment / 2);
      context.translate(radius * .67, 0);
      context.rotate(Math.PI / 2);
      context.fillStyle = '#211a35';
      context.font = '700 17px Arial';
      context.textAlign = 'center';
      context.fillText(restaurant.name.length > 21 ? `${restaurant.name.slice(0, 19)}…` : restaurant.name, 0, 0, 175);
      context.restore();
    });
    context.beginPath();
    context.arc(0, 0, 42, 0, Math.PI * 2);
    context.fillStyle = '#211a35';
    context.fill();
    context.restore();
  }

  function spin(pool) {
    if (!pool.length || spinning) return;
    const selected = catalog.pick(pool, current);
    const candidates = pool.filter(restaurant => restaurant.id !== selected.id);
    for (let index = candidates.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
    }
    wheelEntries = [selected, ...candidates.slice(0, 7)];
    const winnerIndex = Math.floor(Math.random() * wheelEntries.length);
    [wheelEntries[0], wheelEntries[winnerIndex]] = [wheelEntries[winnerIndex], wheelEntries[0]];
    const segment = 360 / wheelEntries.length;
    const stopAngle = (360 - (winnerIndex * segment + segment / 2)) % 360;
    const currentAngle = wheelRotation % 360;
    wheelRotation += 360 * 6 + ((stopAngle - currentAngle + 360) % 360);
    spinning = true;
    document.getElementById('spin').disabled = true;
    document.getElementById('pick').disabled = true;
    document.getElementById('surprise').disabled = true;
    document.getElementById('wheel-status').textContent = 'The city is choosing…';
    drawWheel(wheelEntries);
    const canvas = document.getElementById('wheel');
    canvas.style.transform = `rotate(${wheelRotation}deg)`;
    canvas.addEventListener('transitionend', () => {
      spinning = false;
      updateCount();
      choose(pool, selected);
    }, { once: true });
  }

  Object.values(fields).forEach(select => select.addEventListener('change', () => { updateCount(); if (catalog) drawWheel(matching().slice(0, 8)); }));
  form.addEventListener('submit', event => { event.preventDefault(); if (catalog) spin(matching()); });
  document.getElementById('surprise').addEventListener('click', () => { if (catalog) spin(catalog.restaurants); });
  document.getElementById('spin').addEventListener('click', () => { if (catalog) spin(matching()); });
  document.getElementById('reroll').addEventListener('click', () => { if (catalog) { dialog.close(); spin(matching()); } });
  document.getElementById('close-result').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.getElementById('reset').addEventListener('click', () => { form.reset(); updateCount(); });
  start();
})();
