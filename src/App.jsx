import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import Portfolio from "./pages/Portfolio";
import GeoTool from "./pages/GeoTool";

function App() {
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
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/challenge">Challenge</Button>
            <Button color="inherit" component={Link} to="/geo">Geo Tool</Button>
            <Button color="inherit" component={Link} to="/portfolio">Portfolio</Button>
          </Toolbar>
        </AppBar>
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
