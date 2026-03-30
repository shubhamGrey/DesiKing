"use client";
import { Box, Stack, useMediaQuery } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
import theme from "@/styles/theme";
import MagneticButton from "@/components/MagneticButton";
import LottieIcon from "@/components/LottieIcon";
import { AutoAwesome } from "@mui/icons-material";

interface CarousalProps {
  items: {
    image: StaticImageData;
  }[];
}

const heroSlides = [
  { title: "Bold. Authentic. Pure.", subtitle: "Premium Indian Spices — Crafted with Heritage", accentWords: ["Pure."] },
  { title: "From Farm to Your Kitchen.", subtitle: "Uncompromised quality, every single time", accentWords: ["Kitchen."] },
  { title: "Taste the Difference.", subtitle: "Handpicked spices with zero additives", accentWords: ["Difference."] },
  { title: "Spice Up Every Meal.", subtitle: "Global reach, rooted in Indian tradition", accentWords: ["Every"] },
  { title: "Pure. Powerful. Proven.", subtitle: "Trusted by chefs and home cooks worldwide", accentWords: ["Pure.", "Powerful.", "Proven."] },
];

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25, delay: i * 0.08 },
  }),
};

const slideVariants: Variants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.4, ease: "easeIn" } },
};

const Carousal = ({ items }: CarousalProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentPage, setCurrentPage] = React.useState(0);
  const router = useRouter();

  const handleNextPage = React.useCallback(() => {
    setCurrentPage((prev) => (prev >= items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const handleDotClick = (index: number) => setCurrentPage(index);

  useEffect(() => {
    const timer = setInterval(handleNextPage, 5000);
    return () => clearInterval(timer);
  }, [handleNextPage]);

  const slide = heroSlides[currentPage] ?? heroSlides[0];
  const titleWords = slide.title.split(" ");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: isMobile ? "250px" : "700px",
        justifyContent: "center",
        position: "relative",
        borderRadius: { xs: 0, md: "0 0 24px 24px" },
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background:
            "linear-gradient(to top, rgba(10, 30, 22, 0.75) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      {/* Slide Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <Image
            src={items[currentPage].image}
            alt={`Slide ${currentPage + 1}`}
            fill
            priority={currentPage === 0}
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Lottie spice icon — corner decoration, desktop only */}
      {!isMobile && (
        <Box sx={{ position: "absolute", top: 24, right: 32, zIndex: 3, opacity: 0.85 }}>
          <LottieIcon
            src="/lottie/star.json"
            fallback={<AutoAwesome sx={{ fontSize: 36, color: "#E85D04" }} />}
            size={56}
          />
        </Box>
      )}

      {/* Hero Text Overlay */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            textAlign: "center",
            width: "90%",
            maxWidth: 800,
          }}
        >
          {/* Word-by-word title */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1.5, mb: 2 }}>
            {titleWords.map((word, i) => (
              <motion.span
                key={`${currentPage}-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                style={{
                  fontSize: "clamp(28px, 4vw, 52px)",
                  fontWeight: 800,
                  color: (slide.accentWords ?? []).includes(word) ? "#E85D04" : "white",
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: 1.1,
                  display: "inline-block",
                  textShadow: "0 2px 16px rgba(0,0,0,0.4)",
                }}
              >
                {word}
              </motion.span>
            ))}
          </Box>

          {/* Subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${currentPage}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ delay: titleWords.length * 0.08 + 0.1, duration: 0.5 }}
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 18,
                marginBottom: 28,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* CTA Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => router.push("/products")}
                style={{
                  background: "linear-gradient(135deg, #E85D04, #F48C06)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "Poppins, sans-serif",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(232,93,4,0.4)",
                }}
              >
                Shop Now →
              </motion.button>
            </MagneticButton>
            <MagneticButton>
              <motion.button
                whileHover={{ scale: 1.04 }}
                onClick={() => router.push("/about")}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: 10,
                  padding: "12px 32px",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                }}
              >
                Explore
              </motion.button>
            </MagneticButton>
          </Box>
        </Box>
      )}

      {/* Dot navigation */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: isMobile ? 16 : 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          padding: "8px 16px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        {items.map((_, index) => (
          <motion.div
            key={index}
            onClick={() => handleDotClick(index)}
            animate={{
              width: index === currentPage ? 24 : 10,
              backgroundColor:
                index === currentPage ? "#E85D04" : "rgba(255,255,255,0.5)",
            }}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ height: 10, borderRadius: 5, cursor: "pointer" }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Carousal;
