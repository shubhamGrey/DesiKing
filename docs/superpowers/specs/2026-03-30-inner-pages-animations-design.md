# Inner Pages Animations — Design Spec

**Date:** 2026-03-30
**Status:** Approved

---

## Context

DesiKing's homepage was transformed into a vibrant 3D-animated experience using Framer Motion (see `2026-03-30-homepage-3d-animations-design.md`). This spec covers extending animations to the five key user-facing inner pages. The same primitives built for the homepage — `AnimatedSection`, `AnimatedItem`, `MagneticButton`, `use3DTilt`, `useCountUp` — are reused throughout to keep the system consistent.

**Animated pages:** Products listing, Product detail, About, Contact, Login
**Static pages (intentional):** Cart, Checkout, and all other pages — kept distraction-free for transacting

---

## Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Animation intensity | Hybrid | High energy on browsing/storytelling, calm on transacting |
| Primitive reuse | Yes — all existing hooks/components | Consistency, no new dependencies |
| Cart/Checkout | Static, untouched | Remove friction from purchase flow |
| Mobile | Reduced (same rules as homepage) | 3D tilt and MagneticButton gated behind hover media query |
| Page transitions | None (no layout wrapper changes) | Risk vs reward — fast nav more important than theatrical transitions |

---

## Files to Modify

| File | Change |
|------|--------|
| `UI/src/app/products/ProductsClient.tsx` | Hero fade-in, category headings AnimatedItem, product cards stagger + 3D tilt |
| `UI/src/app/product/[productId]/ProductDetailsClient.tsx` | Image slide-in left, info panel slide-in right, MagneticButton on Add to Cart, similar products stagger |
| `UI/src/app/about/page.tsx` | Video scale-in, section staggering, Vision/Values/Mission flip-in, team cards pop-in |
| `UI/src/app/contact/page.tsx` | Left panel slide-in left, form panel slide-in right, fields stagger, MagneticButton on submit, social icons pop-in |
| `UI/src/app/login/page.tsx` | Form panel fade-in, AnimatePresence Login↔SignUp swap, decorative image float |
| `UI/src/components/LoginForm.tsx` | Fields stagger in with AnimatedSection, MagneticButton on submit |
| `UI/src/components/SignUpForm.tsx` | Fields stagger in with AnimatedSection, MagneticButton on submit |

---

## Page-by-Page Animation Plan

### 1. Products Listing (`ProductsClient.tsx`)

**Hero banner**
- Wrap in `motion.div`: `y: -20→0, opacity: 0→1`, spring `stiffness: 200, damping: 25`, fires on mount (not scroll — it's above the fold)

**Category section titles**
- Each category heading wrapped in `AnimatedItem` inside an `AnimatedSection` with `whileInView`, `once: true`
- `y: 30→0, opacity: 0→1`

**Product cards within each `ProductSection`**
- `ProductSection.tsx` wraps its card grid in `AnimatedSection` with `stagger: 0.08`
- Each card wrapped in `AnimatedItem`
- `use3DTilt` applied on desktop (max ±12°)
- Card hover: `whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(232,93,4,0.2)" }}`
- Mobile: stagger kept, 3D tilt skipped

---

### 2. Product Detail (`ProductDetailsClient.tsx`)

**Product image**
- `motion.div` wrapping the image area: `x: -40→0, opacity: 0→1`, spring `stiffness: 250, damping: 28`, on mount

**Product info panel**
- `motion.div` wrapping `ProductDetails`: `x: 40→0, opacity: 0→1`, same spring, on mount, `delay: 0.1`

**Add to Cart button**
- Wrap in `MagneticButton` (desktop) + `whileTap={{ scale: 0.95 }}`

**Additional details section**
- Wrap in `AnimatedSection` with `whileInView`, `once: true`

**Similar products row**
- Wrap container in `AnimatedSection`, each card in `AnimatedItem` with stagger `0.08`
- Same `use3DTilt` + hover lift as products listing

---

### 3. About (`about/page.tsx`)

**YouTube embed**
- `motion.div`: `scale: 0.95→1, opacity: 0→1`, spring `stiffness: 200, damping: 25`, `whileInView`, `once: true`

**"Who we are" section**
- Wrap in `AnimatedSection`; heading and paragraph each an `AnimatedItem`

**Vision / Core Values / Mission cards**
- Staggered flip-in: `rotateY: 90→0, opacity: 0→1` (same pattern as `ChooseUs.tsx`)
- Spring `stiffness: 200, damping: 22`
- `whileInView`, `once: true`
- `whileHover={{ y: -6, scale: 1.02 }}`

**"What Makes Us Special" icon cards**
- `AnimatedSection` stagger bounce-in: `y: 60→0, scale: 0.9→1`
- `whileInView`, `once: true`

**Team member cards**
- `motion.div`: `scale: 0.9→1, y: 30→0`, spring, `whileInView`, `once: true`, stagger `0.1s` per card

---

### 4. Contact (`contact/page.tsx`)

**Left info panel**
- `motion.div`: `x: -40→0, opacity: 0→1`, spring `stiffness: 250, damping: 28`, on mount

**Right form panel**
- `motion.div`: `x: 40→0, opacity: 0→1`, same spring, on mount, `delay: 0.1`

**Form fields**
- Wrap all fields in `AnimatedSection` with stagger `0.06s`; each field an `AnimatedItem`

**Submit button**
- `MagneticButton` on desktop + `whileTap={{ scale: 0.95 }}`

**Social media icons**
- Staggered `scale: 0→1` pop-in on mount, `0.05s` delay per icon

---

### 5. Login (`login/page.tsx`, `LoginForm.tsx`, `SignUpForm.tsx`)

**Form panel entry**
- `motion.div` wrapping the form area: `y: 30→0, opacity: 0→1`, spring `stiffness: 280, damping: 28`, on mount

**Login ↔ SignUp toggle**
- `AnimatePresence mode="wait"` around the `{isLogin ? <LoginForm /> : <SignUpForm />}` swap
- Exiting form: `x: -40, opacity: 0`
- Entering form: `x: 40→0, opacity: 0→1`
- Spring `stiffness: 280, damping: 28`

**LoginForm fields**
- Wrap fields in `AnimatedSection` with stagger `0.07s`; each field an `AnimatedItem`
- Submit button: `MagneticButton` + `whileTap`

**SignUpForm fields**
- Same stagger pattern as LoginForm

**Decorative right panel (desktop)**
- `motion.div`: `scale: 1.0→1.03, opacity: 0→1` gentle float on mount, `duration: 1.2`

---

## Reused Primitives (no changes needed)

| Primitive | Location | Used by |
|-----------|----------|---------|
| `AnimatedSection` | `UI/src/components/AnimatedSection.tsx` | All 5 pages |
| `AnimatedItem` | exported from `AnimatedSection.tsx` | All 5 pages |
| `MagneticButton` | `UI/src/components/MagneticButton.tsx` | Product detail, Contact, Login |
| `use3DTilt` | `UI/src/hooks/use3DTilt.ts` | Products listing, Product detail |
| `useCountUp` | `UI/src/hooks/useCountUp.ts` | Not used on inner pages |

---

## Performance Notes

- All `whileInView` animations use `once: true`
- `use3DTilt` and `MagneticButton` gated behind `window.matchMedia('(hover: hover)')` — touch devices skip entirely
- No new dependencies — framer-motion already installed

---

## Verification

1. `npm run dev` — all 5 pages load without errors
2. Products page — cards stagger in on scroll, 3D tilt on desktop hover
3. Product detail — image and info panel slide in from opposite sides
4. About page — each section reveals on scroll, Vision/Values/Mission flip in
5. Contact — panels slide in from sides, fields stagger, submit button magnetic
6. Login — form fades in, Login↔SignUp toggle spring-swaps, fields stagger
7. Chrome DevTools mobile — no 3D tilt, all scroll animations present
8. Cart and Checkout — completely unchanged
