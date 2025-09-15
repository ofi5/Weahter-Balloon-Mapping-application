import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, CssBaseline, IconButton, Drawer, List, ListItemButton, ListItemText, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import Portfolio from "./pages/Portfolio";
import GeoTool from "./pages/GeoTool";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const darkTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#666699',
        contrastText: '#fff'
      },
      background: {
        default: 'f0f0f5',
        paper: '#f2f2f2'
      },
      text: {
        primary: '#5c5c8a',
        secondary: '#555555'
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { overflowX: 'hidden' },
          body: { overflowX: 'hidden' },
          '#root': { overflowX: 'hidden' },
          '*, *::before, *::after': { boxSizing: 'border-box' },
          img: { maxWidth: '100%', height: 'auto' },
          canvas: { maxWidth: '100%', height: 'auto' },
          svg: { maxWidth: '100%' },
          video: { maxWidth: '100%', height: 'auto' }
        }
      }
    }
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Live Weather balloon Tracking
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/challenge">Challenge</Button>
              <Button color="inherit" component={Link} to="/geo">Geo Tool</Button>
              <Button color="inherit" component={Link} to="/portfolio">Portfolio</Button>
            </Box>
            <IconButton
              color="inherit"
              edge="end"
              aria-label="menu"
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <Box sx={{ width: 240 }} role="presentation" onClick={() => setMobileOpen(false)}>
            <List>
              <ListItemButton component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItemButton>
              <ListItemButton component={Link} to="/challenge">
                <ListItemText primary="Challenge" />
              </ListItemButton>
              <ListItemButton component={Link} to="/geo">
                <ListItemText primary="Geo Tool" />
              </ListItemButton>
              <ListItemButton component={Link} to="/portfolio">
                <ListItemText primary="Portfolio" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/geo" element={<GeoTool />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
