"use client";

import { Box, Button, Container, Typography, useMediaQuery } from "@mui/material";
import { lato } from "@/styles/fonts";
import theme from "@/styles/theme";
import { useRouter } from "next/navigation";
import { ArrowForward } from "@mui/icons-material";

const HeroSection = () => {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: isMobile ? "65vh" : "80vh",
        minHeight: isMobile ? "500px" : "650px",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(31, 79, 64, 1) 0%, rgba(45, 112, 85, 1) 100%)",
      }}
    >
      {/* Background Image with Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/RedChili1.avif")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Gradient overlay for better text contrast and modern feel */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(31, 79, 64, 0.85) 0%, rgba(45, 112, 85, 0.75) 50%, rgba(255, 140, 0, 0.1) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          px: isMobile ? 3 : 4,
        }}
      >
        <Box
          sx={{
            animation: "fadeInUp 1s ease-out",
            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(30px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          {/* Main Headline */}
          <Typography
            variant={isMobile ? "h2" : "h1"}
            sx={{
              fontFamily: lato.style.fontFamily,
              fontWeight: 900,
              color: "#fff",
              mb: 2,
              textShadow: "3px 6px 12px rgba(0,0,0,0.4)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              fontSize: isMobile ? "2.5rem" : "4rem",
            }}
          >
            Authentic Indian Spices
          </Typography>

          {/* Subheadline */}
          <Typography
            variant={isMobile ? "h5" : "h3"}
            sx={{
              fontFamily: lato.style.fontFamily,
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.95)",
              mb: 3,
              textShadow: "2px 4px 8px rgba(0,0,0,0.3)",
              letterSpacing: "0.05em",
              fontSize: isMobile ? "1.2rem" : "1.75rem",
            }}
          >
            From Farm to Your Kitchen
          </Typography>

          {/* Description */}
          <Typography
            variant={isMobile ? "body1" : "h6"}
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              mb: 5,
              maxWidth: "750px",
              mx: "auto",
              fontWeight: 300,
              textShadow: "1px 2px 6px rgba(0,0,0,0.3)",
              lineHeight: 1.6,
              fontSize: isMobile ? "1rem" : "1.15rem",
            }}
          >
            Experience the rich heritage of premium Indian spices, sourced directly from the finest farms and delivered with uncompromised purity.
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size={isMobile ? "medium" : "large"}
              endIcon={<ArrowForward />}
              onClick={() => router.push("/products")}
              sx={{
                background: "linear-gradient(135deg, rgba(255, 140, 0, 1) 0%, rgba(237, 108, 2, 1) 100%)",
                color: "#fff",
                fontSize: isMobile ? "1.05rem" : "1.15rem",
                fontWeight: 700,
                px: isMobile ? 4 : 5,
                py: isMobile ? 1.75 : 2.25,
                borderRadius: "12px",
                textTransform: "none",
                boxShadow: "0 8px 24px rgba(255, 140, 0, 0.35)",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 0,
                  height: 0,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.3)",
                  transform: "translate(-50%, -50%)",
                  transition: "width 0.6s, height 0.6s",
                },
                "&:hover::before": {
                  width: "300px",
                  height: "300px",
                },
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 32px rgba(255, 140, 0, 0.45)",
                },
              }}
            >
              Shop Now
            </Button>
            <Button
              variant="outlined"
              size={isMobile ? "medium" : "large"}
              onClick={() => router.push("/about")}
              sx={{
                color: "#fff",
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                fontSize: isMobile ? "1.05rem" : "1.15rem",
                fontWeight: 600,
                px: isMobile ? 4 : 5,
                py: isMobile ? 1.75 : 2.25,
                borderRadius: "12px",
                textTransform: "none",
                borderWidth: "2px",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  borderWidth: "2px",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(255, 255, 255, 0.15)",
                },
              }}
            >
              Learn More
            </Button>
          </Box>

          {/* Trust Indicators */}
          <Box
            sx={{
              display: "flex",
              gap: isMobile ? 4 : 6,
              justifyContent: "center",
              mt: 6,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "100%", label: "Pure & Natural" },
              { value: "500+", label: "Happy Customers" },
              { value: "3+", label: "Years of Trust" },
            ].map((stat, index) => (
              <Box 
                key={index} 
                sx={{ 
                  textAlign: "center",
                  px: isMobile ? 2 : 3,
                  py: isMobile ? 1.5 : 2,
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.18)",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  }
                }}
              >
                <Typography
                  variant={isMobile ? "h5" : "h3"}
                  sx={{
                    fontFamily: lato.style.fontFamily,
                    fontWeight: 900,
                    color: "#fff",
                    textShadow: "2px 4px 8px rgba(0,0,0,0.4)",
                    mb: 0.5,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant={isMobile ? "caption" : "body1"}
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "1px 2px 4px rgba(0,0,0,0.3)",
                    fontWeight: 500,
                    fontSize: isMobile ? "0.85rem" : "0.95rem",
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      {/* Decorative Wave at Bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          height: isMobile ? "60px" : "100px",
          zIndex: 3,
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="#fffaf0"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="#fffaf0"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="#fffaf0"
          />
        </svg>
      </Box>
    </Box>
  );
};

export default HeroSection;
