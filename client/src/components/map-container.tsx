import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapContainerProps {}

export default function MapContainer({}: MapContainerProps) {
  const brazilBounds = new LatLngBounds([
    [-34, -74],
    [6, -32],
  ]);

  return (
    <div className="flex-1 bg-map-bg relative">
      <LeafletMap
        bounds={brazilBounds}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LeafletMap>
    </div>
  );
}
