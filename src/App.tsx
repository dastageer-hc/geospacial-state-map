import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L, { type LatLngExpression } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon for TS/Vite
const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function App() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [boundary, setBoundary] = useState<LatLngExpression[][]>([]);
  const [markerPos, setMarkerPos] = useState<LatLngExpression | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setSuggestions(
      val
        ? states.filter((s) => s.toLowerCase().includes(val.toLowerCase()))
        : []
    );
  };

  const selectSuggestion = (s: string) => {
    setSearch(s);
    setSuggestions([]);
  };

  const fetchStateBoundary = async () => {
    if (!search) return;
    setLoading(true);
    setBoundary([]); // Clear previous boundaries
    setMarkerPos(null); // Clear previous marker
    const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;
    if (!apiKey) {
      console.error("VITE_GEOAPIFY_KEY is not defined");
    }
    try {
      // 1. Get state details via geocoding to find center coordinates
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

      const feature = geoRes.data.features?.[0];
      if (!feature) throw new Error("State not found");

      const lat = feature.properties.lat;
      const lon = feature.properties.lon;
      if (!lat || !lon) throw new Error("Coordinates not available");

      setPlaceName(feature.properties.name || search);

      // 2. Fetch administrative boundaries using part-of with coordinates
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

      const features = bRes.data.features;
      if (!features?.length) throw new Error("No boundaries returned");

      // Find the state boundary feature
      const stateFeature = features.find(
        (f: any) =>
          f.properties.name?.toLowerCase() === search.toLowerCase() ||
          f.properties.admin_level === 4 // OSM admin_level 4 for states in India
      );

      if (!stateFeature || !stateFeature.geometry) {
        throw new Error("State boundary not found");
      }

      // Convert GeoJSON to Leaflet coords
      const coords: LatLngExpression[][] =
        stateFeature.geometry.type === "Polygon"
          ? [
              stateFeature.geometry.coordinates[0].map(
                ([lng, lat]: any) => [lat, lng] as LatLngExpression
              ),
            ]
          : stateFeature.geometry.coordinates.map((polygon: any) =>
              polygon[0].map(
                ([lng, lat]: any) => [lat, lng] as LatLngExpression
              )
            );

      setBoundary(coords);

      // 3. Fit map to polygon and place marker at center
      const layer = L.geoJSON(stateFeature as any);
      const bounds = layer.getBounds();
      const center = bounds.getCenter();
      setMarkerPos([center.lat, center.lng]);
      mapRef.current?.fitBounds(bounds);
    } catch (err) {
      console.error("State boundary search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col'>
      {/* Search UI */}
      <div className='p-4 bg-white shadow relative z-[2000]'>
        <div className='relative max-w-lg mx-auto'>
          <input
            type='text'
            value={search}
            placeholder='Enter Indian state'
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && fetchStateBoundary()}
            className='w-full border rounded px-4 py-2'
          />
          {suggestions.length > 0 && (
            <ul className='absolute bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto shadow z-[2100]'>
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => selectSuggestion(s)}
                  className='p-2 hover:bg-gray-100 cursor-pointer'
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
          <button className=''></button>

          <button
            onClick={fetchStateBoundary}
            className='absolute right-1 top-[.3rem] -translate-y-1/ px-3 py-1 rounded shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)]  bg-[#0070f3]  text-white font-light transition duration-200 ease-linear'
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ flex: 1 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {boundary.length > 0 && <Polygon positions={boundary} color='blue' />}
        {markerPos && (
          <Marker position={markerPos}>
            <Popup>{placeName}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
