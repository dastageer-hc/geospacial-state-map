Spatial Mapping Assessment UI
This project is a front-end UI built with React to visualize spatial data (points, polygons, multipolygons) as interactive layers on a map, using the Geoapify Boundaries API.
✨ Features

Map Container: Interactive map with Leaflet + OpenStreetMap.
Search Bar: Search Indian states with live suggestions.
Polygon Layer: Display state boundaries as overlays.
Points Layer: Markers at state centroids with popups.
Responsive UI: Works on desktop and mobile.

🛠 Tech Stack

React.js: Functional components + Hooks
Leaflet: Map rendering
Geoapify: Boundaries & Geocoding API
Axios: API calls
TypeScript: Optional
TailwindCSS: Styling (or custom CSS)

🚀 Getting Started
1️⃣ Get a Geoapify API Key
Sign up at Geoapify Boundaries API and generate an API key. The free tier is sufficient for development.
2️⃣ Add API Key to .env
Create a .env file in the project root:
VITE_GEOAPIFY_KEY=your_actual_api_key_here


Note: For Create React App, use:
REACT_APP_GEOAPIFY_KEY=your_api_key_here

Add .env to .gitignore to avoid leaking your key.

3️⃣ Install Dependencies
npm install react-leaflet leaflet axios

For TypeScript:
npm install --save-dev @types/leaflet

4️⃣ Run the App
npm run dev  # Vite / modern setups

or
npm start  # Create React App

The app should open in your browser.
📌 Usage

Enter a state name in the search bar.
Select from suggestions or press Enter.
The map will:
Zoom to the state.
Show State details such as name on click of the marker



🔍 Example API Calls
const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

// 1. Get state coordinates via geocoding
const geoRes = await axios.get(
  "https://api.geoapify.com/v1/geocode/search",
  {
    params: {
      text: `${search}, India`,
      filter: "countrycode:in",
      type: "state",
      limit: 1,
      apiKey,
    },
  }
);

// 2. Fetch boundaries with coordinates
const bRes = await axios.get(
  "https://api.geoapify.com/v1/boundaries/part-of",
  {
    params: {
      lat,
      lon,
      boundary: "administrative",
      geometry: "geometry_10000",
      apiKey,
    },
  }
);

📜 Attribution
This project uses:

OpenStreetMap data (© OpenStreetMap contributors)
Geoapify APIs (© Geoapify)

Follow their attribution guidelines when deploying.
📌 Notes & Assumptions

Missing requirements handled with reasonable assumptions.
Extendable to other regions by adjusting API parameters.
Map provider can be swapped (e.g., Mapbox, MapLibre).
