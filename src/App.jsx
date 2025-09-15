import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Container } from "@mui/material";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import Portfolio from "./pages/Portfolio";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WindBorne Challenge
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/challenge">Challenge</Button>
          <Button color="inherit" component={Link} to="/portfolio">Portfolio</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenge" element={<Challenge />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
