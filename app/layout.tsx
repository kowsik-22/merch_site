import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";
import CartToast from "@/components/CartToast";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Graphique Merchandise",
  description: "Wear the Graphique universe — cosmic-inspired merch.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen bg-space font-display">
        <CartProvider>
          <CursorGlow />
          <Navbar />
          {children}
          <Footer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
