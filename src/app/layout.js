import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

export const metadata = {
  title: "Book Corporate Party Venues in 30 Minutes | Free for HR Teams",
  description: "Planning a corporate party? Submit one enquiry and get 3–5 curated venue options with pricing in 30 minutes. Free for HR and Admin teams. No cold calls.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
