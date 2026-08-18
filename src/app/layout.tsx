import type { Metadata } from "next";
import { Abril_Fatface, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { OrderProvider } from "@/context/OrderContext";
import { DynamicProductProvider } from "@/context/DynamicProductContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CompareBar } from "@/components/CompareBar";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const abril = Abril_Fatface({
  variable: "--font-abril",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "House of Fashion — Accessories, Decor & Fragrance",
  description:
    "House of Fashion: fashion accessories, cushions, perfumes and home decor with bulk pricing, shipped across Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${abril.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <OrderProvider>
          <DynamicProductProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <RecentlyViewedProvider>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                <CartDrawer />
                <CompareBar />
                <WhatsAppButton />
                  </RecentlyViewedProvider>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </DynamicProductProvider>
        </OrderProvider>
      </body>
    </html>
  );
}
