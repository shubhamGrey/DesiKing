// pages/about-light.js
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import GrassIcon from "@mui/icons-material/Grass";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import ScienceIcon from "@mui/icons-material/Science";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Spices from "../../../public/Spices.png";
import Founder from "../../../public/Founder.PNG";
import CoFounder from "../../../public/Co Founder.jpg";
import CoFounderOld from "../../../public/Co Founder Old.PNG";
import Director from "../../../public/Director.jpg";
import Image from "next/image";
import { Michroma } from "next/font/google";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const highlights = [
  {
    icon: <GrassIcon sx={{ color: "primary.main" }} />,
    text: "100% Natural Ingredients",
  },
  {
    icon: <LocalDiningIcon sx={{ color: "primary.main" }} />,
    text: "Farm-to-Packet Freshness",
  },
  {
    icon: <ScienceIcon sx={{ color: "primary.main" }} />,
    text: "Lab-Tested for Quality",
  },
  {
    icon: <LocationOnIcon sx={{ color: "primary.main" }} />,
    text: "Sourced from Heart of India",
  },
];

export default function About() {
  const coreValues = [
    "Quality & Purity",
    "Building Brand & Trust",
    "Innovation & Product Development",
    "Special focus to specific needs",
  ];

  return (
    <Container sx={{ mt: 3, mx: 6, mb: 6, justifySelf: "center" }}>
      <Box
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          overflow: "hidden",
        }}
      >
        <iframe
          src="https://www.youtube.com/embed/tYRz6M819nE"
          title="Agro Nexis - Our Story"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></iframe>
      </Box>

      <Grid container spacing={8} sx={{ mt: 15 }} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h4"
            sx={{ mb: 3, color: "primary.main" }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
          >
            Who we are
          </Typography>
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <EmojiPeopleRoundedIcon
              sx={{
                height: 48,
                width: 48,
                color: "primary.main",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                ml: 1,
                color: "primary.main",
              }}
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
            >
              Our Roots
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{ mb: 1, justifyContent: "center", textAlign: "justify" }}
            color={"text.primary"}
          >
            At AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED, we believe that great
            food starts with great ingredients. Founded with a mission to bring
            purity and authenticity back to Indian kitchens, we specialize in
            high-quality spice powders including Haldi (Turmeric), Red Chilli,
            Coriander, and Cumin.
            <br /> Our spices are hygienically processed using advanced grinding
            and packaging technologies to preserve their natural aroma, color,
            and taste. From sourcing directly from trusted farmers to delivering
            across domestic and global markets, we ensure every step reflects
            our commitment to quality and trust.
            <br /> We aim to bridge traditional Indian flavor with modern food
            standards, offering home cooks, chefs, retailers, and international
            buyers a product that’s not just flavorful—but consistently
            reliable.
            <br /> At AGRO NEXIS, we don’t just sell spices. We deliver flavor,
            heritage, and health in every pinch.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Image
            src={Spices}
            alt="Spices"
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 15, alignItems: "stretch" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "primary.main",
              backgroundColor: "inherit",
              height: "88%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "right",
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              spacing={2}
              justifyContent={"center"}
              padding={2}
            >
              <SpaRoundedIcon fontSize="large" sx={{ color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "primary.main",
                }}
                fontFamily={michroma.style.fontFamily}
                fontWeight={600}
              >
                Our Vision
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                py: 0.5,
                px: 2,
                justifyContent: "center",
                textAlign: "justify",
              }}
              color={"text.primary"}
            >
              What sets us apart is our unwavering commitment to quality and
              customer satisfaction. There will be more efforts to bring Organic
              Spices in coming future as we grow because, we don’t just sell
              spices—we deliver trust, tradition, health and the promise of
              unforgettable flavours. Let us be a part of our journey in
              creating Agro Nexis for Spices that bring people & culture
              together.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "primary.main",
              backgroundColor: "inherit",
              height: "88%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "right",
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              spacing={2}
              justifyContent={"center"}
              padding={2}
            >
              <SpaRoundedIcon fontSize="large" sx={{ color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "primary.main",
                }}
                fontFamily={michroma.style.fontFamily}
                fontWeight={600}
              >
                Core Values
              </Typography>
            </Stack>
            <List dense={true} sx={{ mt: 3 }}>
              {coreValues.map((item) => {
                return (
                  <ListItem key={item}>
                    <ListItemIcon>
                      <FiberManualRecordIcon sx={{ color: "primary.main" }} />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 1,
                          justifyContent: "center",
                          textAlign: "left",
                        }}
                        color={"text.primary"}
                      >
                        {item}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: "primary.main",
              backgroundColor: "inherit",
              height: "88%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "right",
            }}
          >
            <Stack
              direction={"row"}
              alignItems="center"
              spacing={2}
              justifyContent={"center"}
              padding={2}
            >
              <SpaRoundedIcon fontSize="large" sx={{ color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  color: "primary.main",
                }}
                fontFamily={michroma.style.fontFamily}
                fontWeight={600}
              >
                Our Mission
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                py: 0.5,
                px: 2,
                justifyContent: "center",
                textAlign: "justify",
              }}
              color={"text.primary"}
            >
              Our mission is simple to source the finest quality spices, process
              and blend them with unmatched precision, and make them available
              for global households in their purest form within affordable
              prices. We believe that purity is the essence of great taste, and
              our products are crafted to preserve the natural richness and
              aroma of every ingredient.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography
        variant="h4"
        sx={{ mb: 6, mt: 15, color: "primary.main" }}
        fontFamily={michroma.style.fontFamily}
        fontWeight={600}
        textAlign={"center"}
      >
        What Makes Us Special
      </Typography>

      <Grid container spacing={3}>
        {highlights.map((item, index) => (
          <Grid size={{ xs: 12, md: 3 }} key={index}>
            <Box textAlign="center">
              <Avatar
                sx={{
                  bgcolor: "#fff3e0",
                  color: "primary.main",
                  mx: "auto",
                  mb: 1,
                }}
              >
                {item.icon}
              </Avatar>
              <Typography
                variant="body1"
                sx={{ py: 0.5, px: 2, justifyContent: "center" }}
                color={"text.primary"}
              >
                {item.text}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 15 }} alignItems="center">
        <Grid size={{ xs: 12, md: 3 }}>
          <Stack direction={"column"} spacing={2} justifyContent={"center"}>
            <Image src={Founder} alt="Founder" height={230} width={200} />
            <Image src={CoFounderOld} alt="Co Founder" height={230} width={200} />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack>
            <Typography
              variant="h4"
              sx={{
                mb: 6,
                color: "primary.main",
              }}
              fontFamily={michroma.style.fontFamily}
              fontWeight={600}
              textAlign={"center"}
            >
              Behind the Brand
            </Typography>
            <Typography
              variant="body1"
              sx={{
                py: 0.5,
                px: 2,
                justifyContent: "center",
                textAlign: "justify",
              }}
              color={"text.primary"}
            >
              <b>Late. Shri Ram Prasad Sharma (Founder)</b> was passionate about
              exploring the best spices without compromising the quality and
              made them available for global households. He firmly believed that
              the taste of the foods comes from quality of spices, he always
              says “Pure Spices, Pure Health”.
              <br />
              <br /> With this ideology his youngest son
              <b> Shri Vijay Sharma</b> inspired to incept and develop a brand
              Agro Nexis in 2025 and started his spices journey with a limited
              resource. Ram Prasad was a great person and was admired by many
              for his foresight, words and wisdom. He successfully managed to
              balance his life between family and humanitarian duties.
              <br />
              <br /> &quot;Agro Nexis India Overseas Private Limited&quot; is a
              start-up business with a strong determination to be global one day
              with India and International presence. Incepted in the year 2025
              by Shri Vijay Sharma, it is an inspiring and successful business
              inception that will blends a remarkable history and legacy with
              visionary growth and innovation in near future. ANIOPL incepted
              with a pure heart to be always remained committed to create
              premium quality products and continues to build successful brands
              across many other processed food categories. A strong believes
              that the product range from the ANIOPL will be evolved
              magnificently over the years and its undeterred pursuit of
              ‘Quality & Innovation’ which will lead consumer to the loyalty and
              satisfaction.
            </Typography>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 15 }} alignItems="center">
        <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            variant="h4"
            sx={{
              mb: 6,
              color: "primary.main",
            }}
            fontFamily={michroma.style.fontFamily}
            fontWeight={600}
          >
            Our Team (The best team)
          </Typography>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Stack>
            <Image src={CoFounder} alt="Co Founder" width={200} height={230} />
            <Typography variant="h6" textAlign="center" sx={{ mt: 1 }}>
              Vijay Sharma
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              Director
            </Typography>
            <IconButton
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "inherit" },
              }}
              disableRipple
            >
              <LinkedIn fontSize="large" />
            </IconButton>
          </Stack>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Stack>
            <Image src={Director} alt="Director" width={200} height={230} />
            <Typography variant="h6" textAlign="center" sx={{ mt: 1 }}>
              Purnima Sharma
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              Director
            </Typography>
            <IconButton
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "inherit" },
              }}
              disableRipple
            >
              <LinkedIn fontSize="large" />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
