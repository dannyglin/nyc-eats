(() => {
  const byId = id => document.getElementById(id);
  const machine = byId('machine');
  const spinButton = byId('spin');
  const filters = [byId('borough'), byId('cuisine')];
  const strips = [...machine.querySelectorAll('.strip')];
  const result = byId('result');
  const recent = byId('recent');
  const foods = ['pizza', 'burger', 'ramen', 'taco', 'sushi', 'fries'];
  const artRoot = new URL('.', strips[0].querySelector('img').src);
  const history = [];
  let catalog;
  let pool = [];
  let current;
  let spinning = false;

  function updateControls() {
    pool = catalog.matches({ borough: filters[0].value, cuisine: filters[1].value });
    const count = pool.length;
    spinButton.disabled = spinning || !count;
    filters.forEach(select => { select.disabled = spinning; });
    byId('machine-status').textContent = spinning ? 'Spinning…' : count ? 'Ready to spin' : 'No matches';
    byId('spin-label').textContent = spinning ? 'Spinning' : 'Spin to pick';
    byId('feed-text').textContent = count ? '' : 'Try a different borough or cuisine.';
    byId('feed-message').hidden = !!count;
  }

  function tile(food) {
    const item = document.createElement('div');
    item.className = 'tile';
    const image = new Image();
    image.src = new URL(food + '.png', artRoot);
    image.alt = '';
    const label = document.createElement('span');
    label.textContent = food;
    item.append(image, label);
    return item;
  }

  function randomFood() {
    return foods[Math.floor(Math.random() * foods.length)];
  }

  async function roll(strip, index, lastFood) {
    const last = tile(lastFood);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !strip.animate) {
      strip.replaceChildren(last);
      return;
    }
    const steps = 10 + index * 3;
    for (let step = 1; step < steps; step++) strip.append(tile(randomFood()));
    strip.append(last);
    const motion = strip.animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-' + steps * 100 + '%)' }],
      { duration: 1050 + index * 270, easing: 'cubic-bezier(.18,.55,.24,1)', fill: 'forwards' }
    );
    try {
      await motion.finished;
    } finally {
      strip.replaceChildren(last);
      motion.cancel();
    }
  }

  function showPick(restaurant, prize) {
    current = restaurant;
    byId('result-name').textContent = restaurant.name;
    byId('result-details').textContent = restaurant.cuisine + ' · ' + restaurant.borough;
    byId('result-address').textContent = restaurant.address || 'Address not listed';
    byId('prize').src = new URL(prize + '.png', artRoot);
    const query = [restaurant.name, restaurant.address, restaurant.borough, 'New York'].filter(Boolean).join(', ');
    byId('maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    const entry = document.createElement('li');
    const name = document.createElement('strong');
    const detail = document.createElement('small');
    name.textContent = restaurant.name;
    detail.textContent = byId('result-details').textContent;
    entry.append(name, detail);
    history.unshift(entry);
    history.splice(6);
    byId('history').replaceChildren(...history);
    byId('empty-history').hidden = true;
    result.showModal();
  }

  async function spin() {
    if (!pool.length || spinning) return;
    const pick = catalog.pick(pool, current);
    const prizes = foods.filter(food => pick.cuisine.toLowerCase().includes(food));
    const prize = prizes[0] || randomFood();
    spinning = true;
    machine.classList.add('spinning');
    byId('open-history').disabled = true;
    updateControls();
    try {
      await Promise.all(strips.map((strip, index) => roll(strip, index, prize)));
    } finally {
      spinning = false;
      machine.classList.remove('spinning');
      byId('open-history').disabled = false;
      updateControls();
      showPick(pick, prize);
    }
  }

  async function load() {
    byId('retry').hidden = true;
    byId('feed-message').hidden = true;
    byId('machine-status').textContent = 'Loading restaurants';
    try {
      catalog = window.NycEatsData.createCatalog(await window.NycEatsData.loadRestaurants());
      for (const select of filters) {
        for (const option of catalog.options[select.id]) select.add(new Option(option, option));
      }
      updateControls();
    } catch {
      byId('machine-status').textContent = 'Feed offline';
      byId('feed-text').textContent = 'Couldn’t load the restaurant list.';
      byId('feed-message').hidden = false;
      byId('retry').hidden = false;
    }
  }

  filters.forEach(select => select.addEventListener('change', updateControls));
  spinButton.addEventListener('click', spin);
  byId('retry').addEventListener('click', load);
  byId('open-history').addEventListener('click', () => recent.showModal());
  for (const modal of [result, recent]) {
    modal.querySelector('.close').addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  }
  result.addEventListener('close', () => { if (!spinning) spinButton.focus(); });
  byId('reroll').addEventListener('click', () => { result.close(); spin(); });
  load();
})();
