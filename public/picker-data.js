(() => {
  const boroughNames = {
    MANHATTAN: 'Manhattan',
    BRONX: 'Bronx',
    BROOKLYN: 'Brooklyn',
    QUEENS: 'Queens',
    'STATEN ISLAND': 'Staten Island',
  };
  const endpoint = 'https://data.cityofnewyork.us/resource/43nn-pn8j.json';

  async function loadRestaurants() {
    const params = new URLSearchParams({
      '$select': 'camis,dba,boro,building,street,zipcode,cuisine_description,max(inspection_date) as latest_inspection',
      '$where': "record_date >= '2020-01-01T00:00:00'",
      '$group': 'camis,dba,boro,building,street,zipcode,cuisine_description',
      '$order': 'camis',
      '$limit': '50000',
    });
    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) throw new Error(`NYC Open Data returned ${response.status}.`);
    const rows = await response.json();
    if (!Array.isArray(rows) || !rows.length) throw new Error('NYC Open Data returned no restaurant records.');

    const restaurants = rows.filter(row => row.camis && row.dba && boroughNames[row.boro?.toUpperCase()]).map(row => ({
      id: row.camis,
      name: row.dba.trim(),
      cuisine: row.cuisine_description?.trim() || 'Cuisine not listed',
      borough: boroughNames[row.boro.toUpperCase()],
      address: [row.building, row.street, row.zipcode].filter(Boolean).join(' '),
      inspection: row.latest_inspection || '',
    }));
    const unique = [...new Map(restaurants.map(restaurant => [restaurant.id, restaurant])).values()];
    if (!unique.length) throw new Error('NYC Open Data returned no usable restaurant records.');
    return unique;
  }

  function valuesFor(restaurants, field) {
    return [...new Set(restaurants.map(restaurant => restaurant[field]))].sort((a, b) => a.localeCompare(b));
  }

  function createCatalog(restaurants) {
    const options = { borough: valuesFor(restaurants, 'borough'), cuisine: valuesFor(restaurants, 'cuisine') };
    const matches = ({ borough, cuisine } = {}) => restaurants.filter(restaurant =>
      (!borough || restaurant.borough === borough) && (!cuisine || restaurant.cuisine === cuisine)
    );
    const pick = (pool, previous) => {
      if (pool.length < 2) return pool[0] || null;
      const choices = pool.filter(restaurant => restaurant.id !== previous?.id);
      return choices[Math.floor(Math.random() * choices.length)];
    };
    return { restaurants, options, matches, pick };
  }

  globalThis.NycEatsData = { loadRestaurants, createCatalog };
})();
