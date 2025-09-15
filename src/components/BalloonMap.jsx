import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography } from "@mui/material";
import L from 'leaflet';

// Fix default icon paths so markers show up in many bundlers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function BalloonMap({ balloons }) {
  if (!balloons || balloons.length === 0) return <Typography>Loading map...</Typography>;

  const positions = balloons.flatMap(b => b.positions || []).filter(p => typeof p.lat === 'number' && typeof p.lon === 'number');

  const center = positions.length ? [positions[0].lat, positions[0].lon] : [0, 0];

  return (
    <Box sx={{ height: '400px', width: '100%' }}>
      <MapContainer center={center} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.map((pos, idx) => (
          <Marker key={idx} position={[pos.lat, pos.lon]}>
            <Tooltip permanent direction="top" offset={[0, -20]}>T-{idx}h</Tooltip>
            <Popup>
              Balloon {idx} <br /> Altitude: {pos.alt ?? 'N/A'} m
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
