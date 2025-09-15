import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Grid, TextField, Typography, Paper, Stack, Divider } from '@mui/material';
import PointMap from '../components/PointMap';

export default function GeoTool() {
  const [lat, setLat] = useState('37.4419'); // Palo Alto latitude
  const [lon, setLon] = useState('-122.1430'); // Palo Alto longitude
  const [loading, setLoading] = useState(false);
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const validCoords = () => {
    const la = parseFloat(lat), lo = parseFloat(lon);
    return Number.isFinite(la) && Number.isFinite(lo) && la >= -90 && la <= 90 && lo >= -180 && lo <= 180;
  };

  async function handleLookup(e) {
    e?.preventDefault?.();
    setError('');
    if (!validCoords()) {
      setError('Please enter valid coordinates.');
      return;
    }
    const la = parseFloat(lat), lo = parseFloat(lon);
    setLoading(true);
    try {
      const [rev, meteo] = await Promise.all([
        axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
          params: { latitude: la, longitude: lo, localityLanguage: 'en' }
        }),
        axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: la,
            longitude: lo,
            current: 'temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation',
            timezone: 'auto'
          }
        })
      ]);
      setPlace(rev.data || null);
      setWeather(meteo.data || null);
    } catch (err) {
      console.error(err);
      setError('Lookup failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function useMyLocation() {
    setError('');
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = pos.coords.latitude.toFixed(6);
        const lo = pos.coords.longitude.toFixed(6);
        setLat(la);
        setLon(lo);
        setTimeout(() => handleLookup(), 0);
      },
      () => setError('Failed to get your location.')
    );
  }

  const la = parseFloat(lat), lo = parseFloat(lon);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Geo Lookup</Typography>
      <Paper sx={{ p: 2, mb: 3 }} component="form" onSubmit={handleLookup}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Latitude"
              fullWidth
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="e.g. 37.7749"
              inputProps={{ inputMode: 'decimal' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Longitude"
              fullWidth
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="-122.4194"
              inputProps={{ inputMode: 'decimal' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" type="submit" disabled={loading}>
                {loading ? 'Looking up…' : 'Lookup'}
              </Button>
              <Button variant="outlined" onClick={useMyLocation} disabled={loading}>
                Use my location
              </Button>
            </Stack>
          </Grid>
        </Grid>
        {error ? <Typography color="error" sx={{ mt: 1 }}>{error}</Typography> : null}
      </Paper>

      {validCoords() ? (
        <Box>
          <PointMap lat={la} lon={lo} height={350} zoom={10} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Location</Typography>
                <Divider sx={{ my: 1 }} />
                {place ? (
                  <Box>
                    <Typography><b>City</b>: {place.city || place.locality || '-'}</Typography>
                    <Typography><b>Region</b>: {place.principalSubdivision || '-'}</Typography>
                    <Typography><b>Country</b>: {place.countryName || '-'}</Typography>
                    <Typography sx={{ mt: 1 }}><b>Lat</b>: {la.toFixed?.(6)} | <b>Lon</b>: {lo.toFixed?.(6)}</Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary">Enter coordinates and press Lookup.</Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Current Weather</Typography>
                <Divider sx={{ my: 1 }} />
                {weather && weather.current ? (
                  <Box>
                    <Typography><b>Temperature</b>: {weather.current.temperature_2m}°C</Typography>
                    <Typography><b>Wind</b>: {weather.current.wind_speed_10m} m/s</Typography>
                    <Typography><b>Humidity</b>: {weather.current.relative_humidity_2m}%</Typography>
                    <Typography><b>Precipitation</b>: {weather.current.precipitation} mm</Typography>
                    <Typography sx={{ mt: 1 }} color="text.secondary">
                      Timezone: {weather.timezone} | Local time: {new Date(weather.current.time).toLocaleString()}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="text.secondary">Enter coordinates and press Lookup.</Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Box>
  );
}


