import { Typography, Box, Link } from "@mui/material";

export default function Portfolio() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Porfolio</Typography>
      <Typography>This is my portfolio website, with a list of some of my front end projects.</Typography>
      <Link href="https://aafaque.netlify.app/" target="_blank" sx={{ mt: 2, display: 'block' }}>
        View Porfolio
      </Link>
      <Typography>I am currently working as Full Stack Developer at Soulstice Dating with Design and Front End Development Focus.</Typography>
      <Link href="https://soulsticedating.com/" target="_blank" sx={{ mt: 2, display: 'block' }}>
        Soulstice Dating
      </Link>
    </Box>
  );
}
