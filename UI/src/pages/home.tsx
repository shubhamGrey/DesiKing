import React from "react";
import "../styles/globals.css";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Container component="main" sx={{ py: 4, minHeight: "60vh" }}>
        <Typography variant="body1" align="center">
          This is the content section. Add your content here.
        </Typography>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
