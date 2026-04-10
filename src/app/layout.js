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
  title: "Mumbai's #1 Corporate Party Platform | BookMyCorporateParty",
  description: "Tell us your team size, budget, and date. We shortlist the best lounges, banquets, and party venues in Mumbai within 30 minutes. Free for HR & Admin teams.",
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
