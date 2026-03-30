# Inner Pages Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Framer Motion animations to five key user-facing pages (Products, Product Detail, About, Contact, Login) reusing the primitives built for the homepage.

**Architecture:** No new primitives are needed — `AnimatedSection`, `AnimatedItem`, `MagneticButton`, and `use3DTilt` from the homepage system are imported directly. Each task modifies one file in isolation. Cart and Checkout are intentionally left untouched.

**Tech Stack:** Next.js 16, React 19, Framer Motion (already installed), MUI v7, TypeScript

---

## File Map

| Action | Path | Change |
|--------|------|--------|
| Modify | `UI/src/components/ProductSection.tsx` | Stagger cards with AnimatedSection + use3DTilt on desktop |
| Modify | `UI/src/app/products/ProductsClient.tsx` | Hero fade-in, category sections wrapped in AnimatedSection |
| Modify | `UI/src/app/product/[productId]/ProductDetailsClient.tsx` | Image slide-left, info slide-right, similar products stagger |
| Modify | `UI/src/app/about/page.tsx` | Video scale-in, section staggering, cards flip-in, team pop-in |
| Modify | `UI/src/app/contact/page.tsx` | Panels slide in from sides, fields stagger, MagneticButton, social icons pop-in |
| Modify | `UI/src/components/LoginForm.tsx` | Fields stagger, MagneticButton on submit |
| Modify | `UI/src/components/SignUpForm.tsx` | Fields stagger, MagneticButton on submit |
| Modify | `UI/src/app/login/page.tsx` | Form panel fade-in, AnimatePresence Login↔SignUp swap, image float |

---

## Task 1: Animate `ProductSection.tsx` — Card Stagger + 3D Tilt

Each product card in the grid stagger-bounces in on scroll, and gets 3D tilt on desktop hover.

**Files:**
- Modify: `UI/src/components/ProductSection.tsx`

- [ ] **Step 1: Replace the return statement's card grid**

Open `UI/src/components/ProductSection.tsx`. Add these imports at the top of the file, after the existing imports:

```tsx
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
import { use3DTilt } from "@/hooks/use3DTilt";
```

- [ ] **Step 2: Wrap the category heading Box in an AnimatedItem**

Find the heading `<Box>` that contains the category name Typography (around line 192) and wrap it:

```tsx
<AnimatedSection>
  <AnimatedItem>
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h3"
        sx={{ color: "primary.main" }}
        fontWeight={600}
        textAlign={"center"}
      >
        {item.categoryName}
      </Typography>
    </Box>
  </AnimatedItem>
</AnimatedSection>
```

- [ ] **Step 3: Create a TiltCard sub-component inside the file**

Add this component definition just before the `ProductSection` function definition:

```tsx
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = use3DTilt(10);
  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(232,93,4,0.2)" }}
    >
      {children}
    </motion.div>
  );
};
```

- [ ] **Step 4: Wrap the Grid container and each card in AnimatedSection / AnimatedItem / TiltCard**

Find the `<Grid container spacing={2}>` (around line 217) and wrap it:

```tsx
<AnimatedSection stagger={0.08} style={{ marginTop: 32 }}>
  <Grid container spacing={2}>
    {item.products.map((product) => {
      const productId = product.id || "";
      return (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={productId}>
          <AnimatedItem>
            <TiltCard>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "auto",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "rgba(31, 79, 64, 0.1)",
                  p: 2,
                  background:
                    "linear-gradient(145deg, #faf5ed 0%, #f5efe5 100%)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "linear-gradient(90deg, #1B4D3E, #E85D04)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  },
                  "&:hover": {
                    borderColor: "rgba(31, 79, 64, 0.2)",
                    "&::before": {
                      opacity: 1,
                    },
                    "& .product-image": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                {/* keep existing card content unchanged */}
              </Box>
            </TiltCard>
          </AnimatedItem>
        </Grid>
      );
    })}
  </Grid>
</AnimatedSection>
```

Note: Keep all the existing inner card content (image, name, sizes, price, add-to-cart button) completely unchanged — only wrap the outer `<Box>` in `TiltCard` and `AnimatedItem`. Remove the `transform: "translateY(-8px)"` and `boxShadow` from the `&:hover` sx since `TiltCard`'s `whileHover` now handles those.

- [ ] **Step 5: Verify in browser**

Run `npm run dev` in `UI/`. Navigate to `/products`. Each category section's cards should stagger-bounce in as they enter the viewport. On desktop, hovering a card should show 3D tilt.

- [ ] **Step 6: Commit**

```bash
git add UI/src/components/ProductSection.tsx
git commit -m "feat: animate product cards with stagger bounce-in and 3D tilt"
```

---

## Task 2: Animate `ProductsClient.tsx` — Hero Fade-In

The hero banner slides down and fades in on page load.

**Files:**
- Modify: `UI/src/app/products/ProductsClient.tsx`

- [ ] **Step 1: Add import**

Add after the existing imports:

```tsx
import { motion } from "framer-motion";
```

- [ ] **Step 2: Wrap the hero Box in a motion.div**

Find the hero `<Box sx={{ backgroundImage: ... }}>` (around line 223) and wrap it:

```tsx
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 25 }}
>
  <Box
    sx={{
      backgroundImage: 'url("/ProductBackground.png")',
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      px: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Image
      src={DesiKing}
      alt="Desi King"
      style={{ width: "30%", height: "30%", marginTop: 32 }}
    />
    <Typography
      variant="body1"
      sx={{ mb: 4, mt: 2 }}
      color="primary.contrastText"
      fontSize={isMobile ? "0.2rem" : "1rem"}
    >
      A legacy of authenticity in every pinch.
    </Typography>
  </Box>
</motion.div>
```

- [ ] **Step 3: Verify in browser**

Navigate to `/products`. The hero banner should slide down from above and fade in on page load.

- [ ] **Step 4: Commit**

```bash
git add UI/src/app/products/ProductsClient.tsx
git commit -m "feat: animate products page hero with fade-in slide-down"
```

---

## Task 3: Animate `ProductDetailsClient.tsx` — Slide-In Panels + Similar Products Stagger

Product image slides in from left, info panel from right. Similar products stagger in on scroll.

**Files:**
- Modify: `UI/src/app/product/[productId]/ProductDetailsClient.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
```

- [ ] **Step 2: Wrap ProductDetails and AdditionalDetails in slide-in motion.divs**

Replace the `<Container>` block (lines 160–169) with:

```tsx
<Container
  sx={{
    m: { xs: 2, md: 6 },
    px: { xs: 2, md: 3 },
    justifySelf: "center",
  }}
>
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 250, damping: 28 }}
  >
    <ProductDetails selectedProduct={selectedProduct} />
  </motion.div>
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 250, damping: 28, delay: 0.1 }}
  >
    <AdditionalDetails selectedProduct={selectedProduct} />
  </motion.div>
</Container>
```

- [ ] **Step 3: Wrap the similar products section in AnimatedSection**

Replace the `<Box sx={{ display: "flex", justifyContent: "center", ...mt: 16 }}>` block (lines 170–214) with:

```tsx
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    mt: 16,
  }}
>
  <AnimatedSection>
    <AnimatedItem>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          mb: 4,
          color: "primary.main",
          position: "relative",
          display: "inline-block",
        }}
      >
        Similar Products
        <Typography
          component="span"
          sx={{
            position: "relative",
            top: -20,
            right: -10,
            fontSize: "0.75rem",
            color: "primary.main",
          }}
        >
          [{similarProducts.length}]
        </Typography>
      </Typography>
    </AnimatedItem>
    <AnimatedItem>
      <ProductShowcase
        productSections={similarProducts
          .filter((product) => typeof product.id === "string" && !!product.id)
          .map((product) => ({
            id: product.id as string,
            title: product.name,
            description: product.description,
            image: (product.thumbnailUrl ||
              product.imageUrls?.[0] ||
              "") as string,
          }))}
      />
    </AnimatedItem>
  </AnimatedSection>
</Box>
```

- [ ] **Step 4: Verify in browser**

Navigate to any product detail page (e.g. `/product/some-id`). The product info should slide in from the left, additional details from the right. Scroll down — "Similar Products" heading and showcase should fade in.

- [ ] **Step 5: Commit**

```bash
git add UI/src/app/product/[productId]/ProductDetailsClient.tsx
git commit -m "feat: animate product detail page with slide-in panels and similar products stagger"
```

---

## Task 4: Animate `about/page.tsx` — Scroll Reveals + Flip-In Cards + Team Pop-In

**Files:**
- Modify: `UI/src/app/about/page.tsx`

- [ ] **Step 1: Add imports**

The file starts with `// pages/about-light.js` and uses `import React from "react"`. Add `"use client";` as the very first line (it must be first for Framer Motion to work in App Router), then add after the existing imports:

```tsx
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
```

- [ ] **Step 2: Wrap the YouTube iframe container in a motion.div**

Find the `<Box sx={{ position: "relative", paddingBottom: "56.25%", ... }}>` (lines 61–84) and wrap it:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ type: "spring", stiffness: 200, damping: 25 }}
>
  <Box
    sx={{
      position: "relative",
      paddingBottom: "56.25%",
      height: 100,
      overflow: "hidden",
      width: "100vw",
      left: "50%",
      transform: "translateX(-50%)",
    }}
  >
    <iframe
      src="https://www.youtube.com/embed/bPThecBVp-A"
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
</motion.div>
```

- [ ] **Step 3: Wrap the "Who we are" Grid in AnimatedSection**

Find `<Grid container spacing={8} sx={{ mt: 15 }} alignItems="center">` (line 86) and wrap it:

```tsx
<AnimatedSection>
  <Grid container spacing={8} sx={{ mt: 15 }} alignItems="center">
    <Grid size={{ xs: 12, md: 6 }}>
      <AnimatedItem>
        {/* existing "Who we are" text content — keep unchanged */}
      </AnimatedItem>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
      <AnimatedItem>
        <Image
          src={Spices}
          alt="Spices"
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
        />
      </AnimatedItem>
    </Grid>
  </Grid>
</AnimatedSection>
```

- [ ] **Step 4: Wrap Vision / Core Values / Mission Papers in flip-in motion.divs**

Find `<Grid container spacing={4} sx={{ mt: 15, alignItems: "stretch" }}>` (line 152). Wrap each of the three `<Grid size={{ xs: 12, md: 4 }}>` children's `<Paper>` in a flip-in motion.div with stagger via delay:

```tsx
<Grid container spacing={4} sx={{ mt: 15, alignItems: "stretch" }}>
  {[
    { delay: 0, content: "vision" },
    { delay: 0.15, content: "values" },
    { delay: 0.3, content: "mission" },
  ].map(({ delay }, idx) => (
    <Grid size={{ xs: 12, md: 4 }} key={idx}>
      <motion.div
        initial={{ opacity: 0, rotateY: 90 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay }}
        style={{ perspective: 1000, height: "100%" }}
        whileHover={{ y: -6, scale: 1.02 }}
      >
        {/* keep the existing <Paper> content for each card unchanged */}
      </motion.div>
    </Grid>
  ))}
</Grid>
```

Since the three cards have different content (Vision, Core Values, Mission), keep each one's inner `<Paper>` unchanged. Only add the `motion.div` wrapper with the appropriate delay (0, 0.15, 0.3) to each.

- [ ] **Step 5: Wrap "What Makes Us Special" highlights in AnimatedSection**

Find `<Grid container spacing={3}>` that renders `highlights.map(...)` (around line 328):

```tsx
<AnimatedSection stagger={0.1}>
  <Grid container spacing={3}>
    {highlights.map((item, index) => (
      <Grid size={{ xs: 12, md: 3 }} key={index}>
        <AnimatedItem>
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
        </AnimatedItem>
      </Grid>
    ))}
  </Grid>
</AnimatedSection>
```

- [ ] **Step 6: Wrap the "Behind the Brand" and "Our Team" sections**

Find the `<Grid container spacing={4} sx={{ mt: 15 }} alignItems="center">` for "Behind the Brand" (line 354) and wrap it:

```tsx
<AnimatedSection>
  <Grid container spacing={4} sx={{ mt: 15 }} alignItems="center">
    <Grid size={{ xs: 12, md: 3 }}>
      <AnimatedItem>
        {/* existing founder images stack — keep unchanged */}
      </AnimatedItem>
    </Grid>
    <Grid size={{ xs: 12, md: 9 }}>
      <AnimatedItem>
        {/* existing "Behind the Brand" Stack with text — keep unchanged */}
      </AnimatedItem>
    </Grid>
  </Grid>
</AnimatedSection>
```

Find the "Our Team" `<Grid container spacing={4} sx={{ mt: 15 }} alignItems="center">` (line 420) and wrap it:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 30 }}
  whileInView={{ opacity: 1, scale: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ type: "spring", stiffness: 280, damping: 25 }}
>
  <Grid container spacing={4} sx={{ mt: 15 }} alignItems="center">
    {/* existing Our Team content — keep unchanged */}
  </Grid>
</motion.div>
```

- [ ] **Step 7: Verify in browser**

Navigate to `/about`. Scroll through the page — YouTube embed scales in, "Who we are" section fades in, Vision/Values/Mission cards flip in with stagger, highlights bounce in, team section pops in.

- [ ] **Step 8: Commit**

```bash
git add UI/src/app/about/page.tsx
git commit -m "feat: animate about page with scroll reveals, flip-in cards, and team pop-in"
```

---

## Task 5: Animate `contact/page.tsx` — Slide-In Panels + Staggered Fields + Social Icons

**Files:**
- Modify: `UI/src/app/contact/page.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
import MagneticButton from "@/components/MagneticButton";
```

- [ ] **Step 2: Wrap the left info panel Grid in a slide-in motion.div**

Find `<Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>` (line 142) and wrap its inner content:

```tsx
<Grid
  size={{ xs: 12, md: 6 }}
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 250, damping: 28 }}
    style={{ width: "100%", display: "flex", justifyContent: "center" }}
  >
    {/* existing <Box> with background image, logo, contactDetails — keep unchanged */}
  </motion.div>
</Grid>
```

- [ ] **Step 3: Wrap the right form panel Grid in a slide-in motion.div**

Find `<Grid size={{ xs: 12, md: 6 }} sx={{ px: ..., py: 4, ... }}>` (line 221) and wrap its inner `<Box>`:

```tsx
<Grid
  size={{ xs: 12, md: 6 }}
  sx={{
    px: isMobile ? 4 : 12,
    py: 4,
    overflowY: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 250, damping: 28, delay: 0.1 }}
    style={{ width: "100%" }}
  >
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        sx={{ mb: 6 }}
        color="primary.main"
        fontWeight={600}
        textAlign={"center"}
      >
        Contact us
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <AnimatedSection stagger={0.06}>
          {/* wrap each field group in AnimatedItem */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <AnimatedItem>
                {/* firstName field — keep unchanged */}
              </AnimatedItem>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AnimatedItem>
                {/* lastName field — keep unchanged */}
              </AnimatedItem>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AnimatedItem>
                {/* email field — keep unchanged */}
              </AnimatedItem>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <AnimatedItem>
                {/* phoneNumber field — keep unchanged */}
              </AnimatedItem>
            </Grid>
            <Grid size={12}>
              <AnimatedItem>
                {/* message field — keep unchanged */}
              </AnimatedItem>
            </Grid>
          </Grid>
          <AnimatedItem>
            <MagneticButton>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                endIcon={isSubmitting ? <Skeleton variant="circular" width={20} height={20} /> : <ArrowForward />}
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "primary.dark" },
                }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </MagneticButton>
          </AnimatedItem>
        </AnimatedSection>
      </Box>
    </Box>
  </motion.div>
</Grid>
```

Note: The existing form has a submit button already — find it and replace it with the `MagneticButton`-wrapped version above. Keep all field `<Controller>` wrappers and validation logic unchanged.

- [ ] **Step 4: Add staggered social icons**

Find the social media icons section (the `socialMedia.map(...)` rendering). It currently renders as `<IconButton>` elements. Wrap their container with staggered pop-in:

```tsx
<AnimatedSection stagger={0.05} style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
  {socialMedia.map((item) => (
    <AnimatedItem key={item.href}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <IconButton
          onClick={() => window.open(item.href, "_blank")}
          sx={{ color: "primary.main" }}
        >
          {item.icon}
        </IconButton>
      </motion.div>
    </AnimatedItem>
  ))}
</AnimatedSection>
```

Note: The existing social icons are inside the left info panel's dark box. Locate them there and apply the above pattern around their rendering. Keep the `href` navigation logic the same.

- [ ] **Step 5: Verify in browser**

Navigate to `/contact`. Left info panel should slide in from the left, form panel from the right. Form fields stagger in one by one. Submit button should follow cursor on desktop. Social icons should pop in with spring.

- [ ] **Step 6: Commit**

```bash
git add UI/src/app/contact/page.tsx
git commit -m "feat: animate contact page with slide-in panels, staggered fields, and magnetic submit"
```

---

## Task 6: Animate `LoginForm.tsx` — Staggered Fields + MagneticButton

**Files:**
- Modify: `UI/src/components/LoginForm.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
import MagneticButton from "@/components/MagneticButton";
```

- [ ] **Step 2: Wrap the form content in AnimatedSection with staggered AnimatedItems**

Replace the return statement's `<Box>` content with:

```tsx
return (
  <Box
    sx={{
      width: "100%",
      maxWidth: isMobile ? "90%" : 375,
      backgroundColor: "transparent",
      borderRadius: 2,
      p: isMobile ? 2 : 4,
      textAlign: "center",
    }}
  >
    <AnimatedSection stagger={0.07}>
      <AnimatedItem>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          fontFamily="Rockwell"
          fontSize={isMobile ? 30 : 40}
          sx={{ color: "primary.dark" }}
          gutterBottom
        >
          Login
        </Typography>
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          margin="normal"
          variant="outlined"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.email}
          helperText={errors.email}
          slotProps={{
            input: {
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 30,
              },
            },
          }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.password}
          helperText={errors.password}
          slotProps={{
            input: {
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 30,
              },
            },
          }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <MagneticButton>
          <Button
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: "primary.main",
              color: "#ffffff",
              border: "2px solid",
              borderColor: "primary.main",
              py: isMobile ? 1 : 1.2,
              borderRadius: 8,
              mt: 2,
            }}
            onClick={handleSubmit}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "primary.contrastText" }}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Typography>
          </Button>
        </MagneticButton>
      </AnimatedItem>

      <AnimatedItem>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link
            href="#"
            variant="body2"
            fontWeight="600"
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Forgot password?
          </Link>
        </Box>
      </AnimatedItem>
    </AnimatedSection>
  </Box>
);
```

- [ ] **Step 3: Verify in browser**

Navigate to `/login`. The Login form's title, email field, password field, button, and forgot password link should stagger in one by one. On desktop, the button should follow the cursor.

- [ ] **Step 4: Commit**

```bash
git add UI/src/components/LoginForm.tsx
git commit -m "feat: animate LoginForm with staggered fields and magnetic submit button"
```

---

## Task 7: Animate `SignUpForm.tsx` — Staggered Fields + MagneticButton

**Files:**
- Modify: `UI/src/components/SignUpForm.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedItem } from "@/components/AnimatedSection";
import MagneticButton from "@/components/MagneticButton";
```

- [ ] **Step 2: Replace the return statement with staggered content**

Replace the return statement's `<Box>` content with:

```tsx
return (
  <Box
    sx={{
      width: "100%",
      maxWidth: isMobile ? "90%" : 375,
      backgroundColor: "transparent",
      borderRadius: 2,
      p: isMobile ? 2 : 4,
      textAlign: "center",
    }}
  >
    <AnimatedSection stagger={0.06}>
      <AnimatedItem>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          fontFamily="Rockwell"
          fontSize={isMobile ? 30 : 40}
          sx={{ color: "primary.dark" }}
          gutterBottom
        >
          Sign Up
        </Typography>
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          variant="outlined"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.fullName}
          helperText={errors.fullName}
          slotProps={{ input: { style: { backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 30 } } }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Email address"
          type="email"
          margin="normal"
          variant="outlined"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.email}
          helperText={errors.email}
          slotProps={{ input: { style: { backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 30 } } }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Phone Number"
          type="tel"
          margin="normal"
          variant="outlined"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          slotProps={{ input: { style: { backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 30 } } }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.password}
          helperText={errors.password}
          slotProps={{ input: { style: { backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 30 } } }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          onKeyDown={handleKeyDown}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          slotProps={{ input: { style: { backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 30 } } }}
        />
      </AnimatedItem>

      <AnimatedItem>
        <MagneticButton>
          <Button
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              backgroundColor: "primary.main",
              color: "#ffffff",
              border: "2px solid",
              borderColor: "primary.main",
              py: isMobile ? 1 : 1.2,
              borderRadius: 8,
              mt: 2,
            }}
            onClick={handleSubmit}
          >
            <Typography variant="body1" fontWeight="bold" sx={{ color: "primary.contrastText" }}>
              {isLoading ? "Signing up..." : "Sign Up"}
            </Typography>
          </Button>
        </MagneticButton>
      </AnimatedItem>
    </AnimatedSection>
  </Box>
);
```

- [ ] **Step 3: Verify in browser**

Navigate to `/login` and toggle to Sign Up. Fields should stagger in. Submit button should be magnetic on desktop.

- [ ] **Step 4: Commit**

```bash
git add UI/src/components/SignUpForm.tsx
git commit -m "feat: animate SignUpForm with staggered fields and magnetic submit button"
```

---

## Task 8: Animate `login/page.tsx` — Panel Fade-In + AnimatePresence Toggle + Image Float

**Files:**
- Modify: `UI/src/app/login/page.tsx`

- [ ] **Step 1: Add imports**

Add to the existing imports in `login/page.tsx`:

```tsx
import { motion, AnimatePresence } from "framer-motion";
```

- [ ] **Step 2: Wrap the form Box in a fade-in motion.div**

Inside `LoginPageContent`, find the `<Box sx={{ marginLeft: ..., mt: ... }}>` (around line 397) that contains `{isLogin ? <LoginForm /> : <SignUpForm />}`. Wrap it:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: "spring", stiffness: 280, damping: 28 }}
>
  <Box
    sx={{
      marginLeft: isMobile ? "0 !important" : "100px !important",
      width: isMobile ? "100%" : "fit-content",
      mt: isMobile ? 10 : 12,
    }}
  >
    <AnimatePresence mode="wait">
      {isLogin ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <LoginForm handleLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div
          key="signup"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <SignUpForm handleSignUp={handleSignUp} />
        </motion.div>
      )}
    </AnimatePresence>

    <Typography
      variant="body2"
      sx={{ color: "primary.dark", textAlign: "center" }}
    >
      {isLogin
        ? "Don't have an account? "
        : "Already have an account? "}
      <Link
        href="#"
        fontWeight="600"
        sx={{ textDecoration: "none", color: "primary.main" }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Create account" : "Log in"}
      </Link>
    </Typography>
  </Box>
</motion.div>
```

- [ ] **Step 3: Wrap the decorative right image in a float motion.div (desktop only)**

Find the `{!isMobile && (<Grid ...><Image src={LoginImg} .../></Grid>)}` block (around line 428) and wrap the Image:

```tsx
{!isMobile && (
  <Grid
    size={{ xs: 12, sm: 6 }}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 1.0 }}
      animate={{ opacity: 1, scale: 1.03 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Image
        src={LoginImg}
        alt="Login Image"
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </motion.div>
  </Grid>
)}
```

- [ ] **Step 4: Verify in browser**

Navigate to `/login`. The form panel should fade up on load. Click "Create account" — the form should spring-slide out left and the signup form spring-slide in from right. Click "Log in" — spring-slides back. On desktop, the right image should have a subtle scale float. On mobile, no right image, form animates normally.

- [ ] **Step 5: Commit**

```bash
git add UI/src/app/login/page.tsx
git commit -m "feat: animate login page with fade-in panel, AnimatePresence form toggle, and image float"
```

---

## Task 9: Final Verification and TypeScript Check

- [ ] **Step 1: Run TypeScript check**

```bash
cd UI && npx tsc --noEmit 2>&1 | grep -E "ProductSection|ProductsClient|ProductDetailsClient|about|contact|LoginForm|SignUpForm|login"
```

Expected: no output (zero errors in our modified files). Pre-existing errors about missing public image files are acceptable.

- [ ] **Step 2: Run dev server and manually verify all 5 pages**

```bash
cd UI && npm run dev
```

| Page | What to check |
|------|--------------|
| `/products` | Hero slides down; cards stagger in on scroll; 3D tilt on desktop hover |
| `/product/[any-id]` | Image slides from left, info from right; similar products stagger in |
| `/about` | YouTube scales in; "Who we are" fades; V/V/M cards flip; highlights bounce; team pops |
| `/contact` | Left panel slides left, form panel slides right; fields stagger; submit is magnetic |
| `/login` | Form fades up; toggle spring-swaps between Login/SignUp; right image floats |

- [ ] **Step 3: Verify mobile (Chrome DevTools → device toolbar)**

Select iPhone 12. Confirm:
- No 3D tilt on product cards (hover events don't fire on touch)
- MagneticButton falls back to normal tap behavior
- All stagger animations present on mobile
- Login toggle still animates

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete inner pages animation system — products, detail, about, contact, login"
git push origin main
```
