import { useEffect, useState } from "react";
import axios from "axios";
import BalloonMap from "../components/BalloonMap";
import DataChart from "../components/DataChart";
import { Typography, Box, Divider, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";

export default function Challenge() {
  const [balloons, setBalloons] = useState([]);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch latest + past 23 hours of balloon data
        const latest = await axios.get("/wb/treasure/00.json");
        const history = await Promise.all(
          Array.from({ length: 23 }, (_, i) =>
            axios.get(`/wb/treasure/${String(i + 1).padStart(2, "0")}.json`).then(res => res.data).catch(() => null)
          )
        );
        const rawSnapshots = [latest.data, ...history.filter(Boolean)];
        setRaw(rawSnapshots[0] || null);

        // Normalize snapshots to shape: { positions: [{ lat, lon, alt }, ...] }
        const normalizeSnapshot = (snapshot) => {
          if (!snapshot) return { positions: [] };
          if (Array.isArray(snapshot) && snapshot.length > 0 && Array.isArray(snapshot[0])) {
            return { positions: snapshot.map(([lat, lon, alt]) => ({ lat, lon, alt })) };
          }
          if (Array.isArray(snapshot.positions)) return { positions: snapshot.positions };
          return { positions: [] };
        };

        const normalized = rawSnapshots.map(normalizeSnapshot);
        // Keep only the first balloon per hour
        const reduced = normalized.map(s => ({
          positions: Array.isArray(s.positions) && s.positions.length ? [s.positions[0]] : []
        }));
        setBalloons(reduced);
      } catch (err) {
        console.error("Data fetch failed:", err);
      }
    }
  
    fetchData();
  }, []);
  
  const tracked = (Array.isArray(balloons) && balloons[0] && Array.isArray(balloons[0].positions) && balloons[0].positions[0])
    ? balloons[0].positions[0]
    : null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Live Balloon Data</Typography>
      <BalloonMap balloons={balloons} />
      <Box mt={4}>
        <DataChart balloons={balloons} externalData={[]} />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6">Tracked Balloon (T-0h) Coordinates</Typography>
      <pre style={{ background: '#f6f6f6', padding: 12, borderRadius: 8, overflowX: 'auto' }}>
{tracked
  ? `lat: ${tracked.lat?.toFixed?.(4) ?? tracked.lat}\nlon: ${tracked.lon?.toFixed?.(4) ?? tracked.lon}\nalt: ${typeof tracked.alt === 'number' ? tracked.alt.toFixed(2) + ' m' : 'N/A'}`
  : 'Loading...'}
      </pre>

      <Typography variant="h6" sx={{ mt: 3 }}>First Balloon Per Hour</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Hour</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Altitude</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balloons.map((s, i) => {
              const p = Array.isArray(s.positions) && s.positions.length ? s.positions[0] : null;
              return (
                <TableRow key={i}>
                  <TableCell>{`T-${i}h`}</TableCell>
                  <TableCell>{p ? (typeof p.lat === 'number' ? p.lat.toFixed(4) : p.lat) : '-'}</TableCell>
                  <TableCell>{p ? (typeof p.lon === 'number' ? p.lon.toFixed(4) : p.lon) : '-'}</TableCell>
                  <TableCell>{p && typeof p.alt === 'number' ? p.alt.toFixed(2) : '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
