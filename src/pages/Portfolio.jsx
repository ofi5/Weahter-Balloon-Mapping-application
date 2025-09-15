import { Typography, Box, Link } from "@mui/material";

export default function Portfolio() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Proud Project</Typography>
      <Typography>This is a live interactive demo of my favorite project:</Typography>
      <Link href="https://your-live-portfolio-url.com" target="_blank" sx={{ mt: 2, display: 'block' }}>
        View Project
      </Link>
    </Box>
  );
}
