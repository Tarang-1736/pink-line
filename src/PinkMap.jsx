import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons not showing in React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function PinkMap() {
  const jaipurCoords = [26.9124, 75.7873]; // [Lat, Lon]

  return (
    <MapContainer 
      center={jaipurCoords} 
      zoom={13} 
      className="h-full w-full z-0"
    >
      {/* This is the "Base Layer" - OpenStreetMap is free */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {/* A marker to show where the user is */}
      <Marker position={jaipurCoords}>
        <Popup>You are here in Jaipur.</Popup>
      </Marker>
    </MapContainer>
  );
}

export default PinkMap;