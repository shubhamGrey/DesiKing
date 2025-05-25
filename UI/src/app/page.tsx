import React from "react";
import { Typography, Container } from "@mui/material";

const Home: React.FC = () => {
  return (
    <div>
      <Container component="main" sx={{ py: 4, minHeight: "60vh" }}>
        <Typography variant="body1" align="center">
          This is the content section. Add your content here. Start adding
          content
        </Typography>
      </Container>
    </div>
  );
};

export default Home;
