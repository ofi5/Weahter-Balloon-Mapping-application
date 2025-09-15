import { Typography, Box, Divider } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Hi, I'm Aafaque Rasheed
      </Typography>
      <Typography variant="h6" gutterBottom>
      I’m really passionate about front-end development and love turning designs into smooth, responsive experiences. I think I’m good to work with because I collaborate openly, take feedback well, and always focus on building user-friendly solutions that make the team’s work shine.</Typography>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>About this Project</Typography>
      <Typography paragraph>
        This web app showcases live high-altitude balloon telemetry and a small geo-lookup tool. It combines an interactive map, a time-series chart, and location services to explore coordinates, reverse geocoded places, and current weather.
      </Typography>
      <Typography variant="h6" gutterBottom>Key Features</Typography>
      <ul style={{ marginTop: 0 }}>
        <li>
          <Typography>
            Live Balloon Data: Leaflet map with hourly markers and a compact table of the first reading per hour.
          </Typography>
        </li>
        <li>
          <Typography>
            Clickable rows: Fetch reverse geocoded City/Region/Country for any hour and view details in a dialog.
          </Typography>
        </li>
        <li>
          <Typography>
            Geo Lookup tool: Enter latitude/longitude or use your device location to see a map pin, the place name, and current weather.
          </Typography>
        </li>
        <li>
          <Typography>
            Mobile responsive UI: App bar collapses to a menu on small screens; layouts adapt for phones.
          </Typography>
        </li>
      </ul>
      <Typography variant="h6" gutterBottom>Tech & APIs</Typography>
      <Typography paragraph>
        Built with React, Vite, and Material UI; mapping via react-leaflet and OpenStreetMap tiles; charts with Chart.js; data fetching with Axios. Reverse geocoding by BigDataCloud; weather by Open-Meteo.
      </Typography>
      <Typography variant="h6" gutterBottom>How to Use</Typography>
      <ul style={{ marginTop: 0 }}>
        <li>
          <Typography>Open Challenge to view the live balloon map, chart, and hourly table.</Typography>
        </li>
        <li>
          <Typography>Click any table row for location details.</Typography>
        </li>
        <li>
          <Typography>Open Geo Tool to try reverse geocoding and weather; defaults to Palo Alto.</Typography>
        </li>
      </ul>
    </Box>
  );
}
