import { Poppins, Pacifico, Michroma } from "next/font/google";

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
