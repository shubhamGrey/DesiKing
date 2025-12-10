import { 
  Poppins, 
  Pacifico, 
  Michroma, 
  Playfair_Display,
  Bebas_Neue,
  Oswald,
  Raleway,
  Montserrat,
  Lato
} from "next/font/google";

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Cool modern fonts
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});
