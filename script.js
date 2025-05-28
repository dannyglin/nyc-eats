// Google Places API configuration
const GOOGLE_API_KEY = 'AIzaSyBGYwuxgfier_l8kUuA0friTeu_-yTAhGE';
const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

// Borough coordinates (approximate centers)
const BOROUGH_COORDINATES = {
    manhattan: { lat: 40.7831, lng: -73.9712 },
    brooklyn: { lat: 40.6782, lng: -73.9442 },
    queens: { lat: 40.7282, lng: -73.7949 },
    bronx: { lat: 40.8448, lng: -73.8648 },
    staten_island: { lat: 40.5795, lng: -74.1502 }
};

// DOM Elements
const suggestButton = document.getElementById('suggestButton');
const resultContainer = document.getElementById('result');
const restaurantName = document.getElementById('restaurantName');
const restaurantDetails = document.getElementById('restaurantDetails');
const restaurantRating = document.getElementById('restaurantRating');
const restaurantImage = document.getElementById('restaurantImage');
const yelpLink = document.getElementById('yelpLink');
const cuisineSelect = document.getElementById('cuisine');
const priceSelect = document.getElementById('price');
const boroughSelect = document.getElementById('borough');
let map = null;

// Convert price level to Google Places format
function getGooglePriceLevel(price) {
    switch(price) {
        case '1': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        default: return null;
    }
}

// Convert cuisine to Google Places type
function getGoogleCuisineType(cuisine) {
    const cuisineMap = {
        'italian': 'restaurant italian',
        'chinese': 'restaurant chinese',
        'japanese': 'restaurant japanese',
        'mexican': 'restaurant mexican',
        'american': 'restaurant american',
        'indian': 'restaurant indian',
        'thai': 'restaurant thai',
        'vietnamese': 'restaurant vietnamese',
        'korean': 'restaurant korean',
        'mediterranean': 'restaurant mediterranean'
    };
    return cuisineMap[cuisine] || 'restaurant';
}

// Format rating display
function formatRating(rating, count) {
    const stars = '⭐'.repeat(Math.round(rating));
    return `${stars} ${rating.toFixed(1)} (${count} reviews)`;
}

async function getRandomRestaurant() {
    try {
        // Get filter values
        const cuisine = cuisineSelect.value;
        const price = priceSelect.value;
        const borough = boroughSelect.value;
        
        // Get coordinates based on borough selection
        const coordinates = borough ? BOROUGH_COORDINATES[borough] : { lat: 40.7128, lng: -74.0060 };
        
        // Build request body
        const requestBody = {
            locationRestriction: {
                circle: {
                    center: {
                        latitude: coordinates.lat,
                        longitude: coordinates.lng
                    },
                    radius: borough ? 3000.0 : 5000.0 // Smaller radius for borough-specific searches
                }
            },
            includedTypes: [getGoogleCuisineType(cuisine)],
            maxResultCount: 20,
            rankPreference: "DISTANCE"
        };

        if (price) {
            requestBody.priceLevels = [getGooglePriceLevel(price)];
        }

        console.log('Fetching restaurants with params:', JSON.stringify(requestBody));
        
        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': GOOGLE_API_KEY,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.id,places.location'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (data.error) {
            throw new Error(`Google Places API Error: ${data.error.message}`);
        }
        
        if (!data.places || data.places.length === 0) {
            throw new Error('No restaurants found');
        }

        // Get a random restaurant from the results
        const randomIndex = Math.floor(Math.random() * data.places.length);
        const restaurant = data.places[randomIndex];

        console.log('Selected restaurant:', restaurant);

        // Get additional details for the selected restaurant
        const detailsResponse = await fetch(`https://places.googleapis.com/v1/places/${restaurant.id}`, {
            headers: {
                'X-Goog-Api-Key': GOOGLE_API_KEY,
                'X-Goog-FieldMask': 'displayName,formattedAddress,rating,userRatingCount,photos,websiteUri'
            }
        });
        
        const detailsData = await detailsResponse.json();
        console.log('Details response:', detailsData);

        if (detailsData.error) {
            throw new Error(`Google Places Details API Error: ${detailsData.error.message}`);
        }

        return { ...restaurant, ...detailsData };

    } catch (error) {
        console.error('Error fetching restaurant:', error);
        return null;
    }
}

function displayRestaurant(restaurant) {
    if (!restaurant) {
        restaurantName.textContent = 'Error';
        restaurantDetails.textContent = 'Unable to fetch restaurant data. Please try again.';
        return;
    }

    try {
        // Display basic info
        restaurantName.textContent = restaurant.displayName?.text || 'Unknown Restaurant';
        restaurantDetails.textContent = restaurant.formattedAddress || 'Address not available';
        
        // Display rating
        if (restaurant.rating) {
            restaurantRating.textContent = formatRating(restaurant.rating, restaurant.userRatingCount || 0);
        } else {
            restaurantRating.textContent = 'No ratings available';
        }
        
        // Display image
        if (restaurant.photos && restaurant.photos[0]) {
            const photoName = restaurant.photos[0].name;
            restaurantImage.style.backgroundImage = `url(https://places.googleapis.com/v1/${photoName}/media?key=${GOOGLE_API_KEY})`;
        } else {
            restaurantImage.style.backgroundImage = 'none';
        }
        
        // Set Google Maps link
        yelpLink.href = restaurant.websiteUri || '#';
        yelpLink.textContent = 'View on Google Maps';
        
        // Initialize map
        if (map) {
            map.remove();
        }
        
        map = L.map('map').setView([restaurant.location.latitude, restaurant.location.longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        L.marker([restaurant.location.latitude, restaurant.location.longitude])
            .addTo(map)
            .bindPopup(restaurant.displayName?.text || 'Unknown Restaurant')
            .openPopup();
        
        resultContainer.classList.add('show');
    } catch (error) {
        console.error('Error displaying restaurant:', error);
        restaurantName.textContent = 'Error';
        restaurantDetails.textContent = 'Error displaying restaurant data. Please try again.';
    }
}

suggestButton.addEventListener('click', async () => {
    try {
        suggestButton.disabled = true;
        suggestButton.textContent = 'Finding the perfect spot...';
        suggestButton.classList.add('loading');
        
        const restaurant = await getRandomRestaurant();
        displayRestaurant(restaurant);
    } catch (error) {
        console.error('Error in click handler:', error);
        restaurantName.textContent = 'Error';
        restaurantDetails.textContent = 'An error occurred. Please try again.';
    } finally {
        suggestButton.disabled = false;
        suggestButton.textContent = 'Suggest a Restaurant';
        suggestButton.classList.remove('loading');
    }
}); 