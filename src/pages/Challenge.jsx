import { useEffect, useState } from "react";
import axios from "axios";
import BalloonMap from "../components/BalloonMap";
import DataChart from "../components/DataChart";
import { Typography, Box, Divider, Table, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert } from "@mui/material";

export default function Challenge() {
  // Use same-origin path so dev uses Vite proxy and prod uses Netlify function
  const WB_BASE = '/wb';
  const [balloons, setBalloons] = useState([]);
  const [raw, setRaw] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogPlace, setDialogPlace] = useState(null);
  const [dialogCoords, setDialogCoords] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setFetchError("");
        // Fetch hours 00-23 directly from live API via same-origin proxy.
        const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
        const results = await Promise.allSettled(
          hours.map(hh => axios.get(`${WB_BASE}/treasure/${hh}.json`))
        );
        const succeeded = [];
        const failedHours = [];
        results.forEach((r, idx) => {
          if (r.status === 'fulfilled') succeeded.push(r.value.data);
          else failedHours.push(hours[idx]);
        });
        if (succeeded.length === 0) {
          setFetchError('Failed to fetch live data for all hours.');
          setRaw(null);
          setBalloons([]);
          return;
        }
        if (failedHours.length) setFetchError(`Failed hour(s): ${failedHours.join(', ')}`);

        const rawSnapshots = succeeded;
        setRaw(rawSnapshots[0] || null);

        const normalizeSnapshot = (snapshot) => {
          if (!snapshot) return { positions: [] };
          if (Array.isArray(snapshot) && snapshot.length > 0 && Array.isArray(snapshot[0])) {
            return { positions: snapshot.map(([lat, lon, alt]) => ({ lat, lon, alt })) };
          }
          if (Array.isArray(snapshot.positions)) return { positions: snapshot.positions };
          return { positions: [] };
        };

        const normalized = rawSnapshots.map(normalizeSnapshot);
        const reduced = normalized.map(s => ({
          positions: Array.isArray(s.positions) && s.positions.length ? [s.positions[0]] : []
        }));
        setBalloons(reduced);
      } catch (err) {
        console.error('Data fetch failed:', err);
        setFetchError('Data fetch failed. Please try again later.');
        setBalloons([]);
      }
    }
  
    fetchData();
  }, []);
  
  const tracked = (Array.isArray(balloons) && balloons[0] && Array.isArray(balloons[0].positions) && balloons[0].positions[0])
    ? balloons[0].positions[0]
    : null;

  const handleRowClick = async (pos, hourIndex) => {
    if (!pos || typeof pos.lat !== 'number' || typeof pos.lon !== 'number') return;
    setDialogCoords({ lat: pos.lat, lon: pos.lon, hourIndex });
    setDialogOpen(true);
    setDialogLoading(true);
    setDialogError("");
    setDialogPlace(null);
    try {
      const res = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        params: { latitude: pos.lat, longitude: pos.lon, localityLanguage: 'en' }
      });
      setDialogPlace(res.data || null);
    } catch (err) {
      console.error(err);
      setDialogError('Failed to fetch location details.');
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center">Live Balloon 1 Data</Typography>
      {fetchError ? <Alert severity="error" sx={{ mb: 2 }}>{fetchError}</Alert> : null}
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

      <Typography variant="h6" sx={{ mt: 3 }}>First Balloon Per Hour(click for more details)</Typography>
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
              const clickable = !!(p && typeof p.lat === 'number' && typeof p.lon === 'number');
              return (
                <TableRow key={i} hover onClick={() => clickable && handleRowClick(p, i)} sx={{ cursor: clickable ? 'pointer' : 'default' }}>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogCoords ? `Location Details for T-${dialogCoords.hourIndex}h` : 'Location Details'}
        </DialogTitle>
        <DialogContent dividers>
          {dialogLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={22} />
              <Typography>Fetching location…</Typography>
            </Box>
          ) : dialogError ? (
            <Typography color="error">{dialogError}</Typography>
          ) : dialogPlace ? (
            <Box>
              <Typography><b>City</b>: {dialogPlace.city || dialogPlace.locality || '-'}</Typography>
              <Typography><b>Region</b>: {dialogPlace.principalSubdivision || '-'}</Typography>
              <Typography><b>Country</b>: {dialogPlace.countryName || '-'}</Typography>
              {dialogCoords ? (
                <Typography sx={{ mt: 1 }} color="text.secondary">
                  Lat: {dialogCoords.lat.toFixed?.(6)} | Lon: {dialogCoords.lon.toFixed?.(6)}
                </Typography>
              ) : null}
            </Box>
          ) : (
            <Typography color="text.secondary">No data.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
