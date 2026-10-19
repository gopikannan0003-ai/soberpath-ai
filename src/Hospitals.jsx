import { useState } from "react";
import {
MapContainer,
TileLayer,
Marker,
Popup,
useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Hospitals.css";

const DEFAULT_LOCATION = [13.0827, 80.2707];

const hospitalIcon = new L.DivIcon({
className: "hospital-map-icon",
html: `<div class="hospital-pin">+</div>`,
iconSize: [36, 36],
iconAnchor: [18, 18],
popupAnchor: [0, -18],
});

function ChangeMapView({ position }) {
const map = useMap();

if (position) {
map.setView(position, 13);
}

return null;
}

export default function Hospitals() {
const [position, setPosition] = useState(null);
const [places, setPlaces] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [searchType, setSearchType] = useState("all");
const [searched, setSearched] = useState(false);

async function findNearbyPlaces() {
setError("");
setLoading(true);
setSearched(false);
setPlaces([]);


if (!navigator.geolocation) {
  setError("Your browser does not support location access.");
  setLoading(false);
  return;
}

navigator.geolocation.getCurrentPosition(
  async (location) => {
    const coords = [
      location.coords.latitude,
      location.coords.longitude,
    ];

    setPosition(coords);

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"hospital|clinic|doctors"](around:10000,${coords[0]},${coords[1]});
        way["amenity"~"hospital|clinic|doctors"](around:10000,${coords[0]},${coords[1]});
        relation["amenity"~"hospital|clinic|doctors"](around:10000,${coords[0]},${coords[1]});
        node["healthcare"~"rehabilitation|addiction"](around:10000,${coords[0]},${coords[1]});
        way["healthcare"~"rehabilitation|addiction"](around:10000,${coords[0]},${coords[1]});
        node["social_facility"="rehabilitation"](around:10000,${coords[0]},${coords[1]});
      );
      out center tags;
    `;

    try {
      const response = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "data=" + encodeURIComponent(query),
        }
      );

      if (!response.ok) {
        throw new Error("The map search service is temporarily unavailable.");
      }

      const data = await response.json();

      const results = (data.elements || [])
        .map((item) => {
          const lat = item.lat ?? item.center?.lat;
          const lon = item.lon ?? item.center?.lon;
          const tags = item.tags || {};

          if (lat == null || lon == null) return null;

          const name =
            tags.name ||
            tags["name:en"] ||
            tags["name:ta"] ||
            "Unnamed medical facility";

          const details = [
            tags["addr:street"],
            tags["addr:city"],
            tags["addr:state"],
          ]
            .filter(Boolean)
            .join(", ");

          const isRecovery =
            /addiction|rehab|de.?addiction|substance|recovery/i.test(
              [
                name,
                tags.healthcare,
                tags.amenity,
                tags.social_facility,
                tags.description,
              ].join(" ")
            );

          return {
            id: `${item.type}-${item.id}`,
            name,
            lat,
            lon,
            details,
            type: isRecovery ? "recovery" : "hospital",
            phone: tags.phone || tags["contact:phone"] || "",
            website: tags.website || tags["contact:website"] || "",
          };
        })
        .filter(Boolean);

      const uniqueResults = Array.from(
        new Map(results.map((place) => [place.id, place])).values()
      );

      setPlaces(uniqueResults);
      setSearched(true);

      if (uniqueResults.length === 0) {
        setError(
          "No listed facilities were found nearby. Try the map links below to search more places."
        );
      }
    } catch (err) {
      setError(
        "Nearby search is temporarily unavailable. You can still use the map and search links below."
      );
    } finally {
      setLoading(false);
    }
  },
  () => {
    setError(
      "Location permission was not granted. Allow location access in your browser and try again."
    );
    setLoading(false);
  },
  {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000,
  }
);


}

const filteredPlaces =
searchType === "all"
? places
: places.filter((place) => place.type === searchType);

const googleSearch =
position
? `https://www.google.com/maps/search/hospital+de-addiction+centre/@${position[0]},${position[1]},13z`
: "https://www.google.com/maps/search/de-addiction+centres+near+me/";

return ( <section className="nearby-section" id="nearby-help"> <div className="nearby-container"> <div className="nearby-heading"> <span className="nearby-eyebrow">FIND HELP NEAR YOU</span>

```
      <h2>
        Nearby Hospitals &amp;{" "}
        <span>Recovery Centres</span>
      </h2>

      <p>
        Find nearby medical facilities and explore options for
        professional alcohol and substance-use support.
      </p>
    </div>

    <div className="nearby-action-bar">
      <div className="nearby-action-text">
        <span className="nearby-location-symbol">⌖</span>
        <div>
          <strong>Discover local support</strong>
          <p>Your location is only used after you give permission.</p>
        </div>
      </div>

      <button
        className="nearby-location-button"
        onClick={findNearbyPlaces}
        disabled={loading}
      >
        {loading ? "Finding places..." : "📍 Use My Location"}
      </button>
    </div>

    <div className="nearby-filter-row">
      <button
        className={searchType === "all" ? "active" : ""}
        onClick={() => setSearchType("all")}
      >
        All Facilities
      </button>

      <button
        className={searchType === "hospital" ? "active" : ""}
        onClick={() => setSearchType("hospital")}
      >
        🏥 Hospitals &amp; Clinics
      </button>

      <button
        className={searchType === "recovery" ? "active" : ""}
        onClick={() => setSearchType("recovery")}
      >
        💚 Recovery Centres
      </button>
    </div>

    {error && <div className="nearby-message">{error}</div>}

    <div className="nearby-layout">
      <div className="nearby-map-card">
        <MapContainer
          center={position || DEFAULT_LOCATION}
          zoom={position ? 13 : 11}
          scrollWheelZoom={true}
          className="nearby-map"
        >
          <ChangeMapView position={position} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={hospitalIcon}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.type === "recovery"
                  ? "Recovery facility — verify services"
                  : "Medical facility"}
                {place.details && (
                  <>
                    <br />
                    {place.details}
                  </>
                )}
                <br />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="nearby-map-caption">
          {position
            ? "Map centred on your shared location"
            : "Showing Chennai as a starting point. Use your location to search nearby."}
        </div>
      </div>

      <div className="nearby-results-card">
        <div className="nearby-results-header">
          <div>
            <span className="nearby-eyebrow">LOCAL DIRECTORY</span>
            <h3>Places to explore</h3>
          </div>

          <span className="nearby-count">{filteredPlaces.length}</span>
        </div>

        {!searched && !loading && (
          <div className="nearby-empty">
            <div className="nearby-empty-icon">📍</div>
            <h4>Find help close to you</h4>
            <p>
              Tap “Use My Location” to search listed facilities within
              approximately 10 km.
            </p>
          </div>
        )}

        {loading && (
          <div className="nearby-empty">
            <div className="nearby-loader"></div>
            <p>Searching the nearby directory...</p>
          </div>
        )}

        {searched && filteredPlaces.length === 0 && !loading && (
          <div className="nearby-empty">
            <div className="nearby-empty-icon">🔎</div>
            <h4>No matching listings</h4>
            <p>
              Try another filter or search a wider directory.
              This does not mean no facilities exist nearby.
            </p>
          </div>
        )}

        <div className="nearby-results-list">
          {filteredPlaces.map((place) => (
            <article className="nearby-place" key={place.id}>
              <div className="nearby-place-icon">
                {place.type === "recovery" ? "💚" : "🏥"}
              </div>

              <div className="nearby-place-info">
                <h4>{place.name}</h4>

                <span className="nearby-place-type">
                  {place.type === "recovery"
                    ? "Possible recovery facility"
                    : "Hospital / Clinic"}
                </span>

                {place.details && <p>{place.details}</p>}

                <a
                  className="nearby-directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions →
                </a>
              </div>
            </article>
          ))}
        </div>

        <a
          href={googleSearch}
          target="_blank"
          rel="noreferrer"
          className="nearby-more-link"
        >
          Search more places on Google Maps ↗
        </a>
      </div>
    </div>

    <div className="nearby-safety-note">
      <span>ℹ️</span>
      <p>
        <strong>Important:</strong> Map listings may be incomplete or
        outdated. Call the facility to confirm its location, services,
        and availability. A hospital or clinic listing does not confirm
        that it offers addiction treatment. Seek qualified medical advice
        for treatment and recovery support.
      </p>
    </div>

    <p className="nearby-attribution">
      Map data © OpenStreetMap contributors. Nearby directory data is
      provided by OpenStreetMap contributors via the Overpass API.
    </p>
  </div>
</section>


);
}
