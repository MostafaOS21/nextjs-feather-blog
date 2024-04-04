import "./globals.css";
import type { Metadata } from "next";
import { Gelasio, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Header from "@/components/shared/Header";
import StoreProvider from "@/components/providers/StoreProvider";
import RefreshAuth from "@/components/providers/RefreshAuth";
import RouteProtect from "@/components/providers/RouteProtect";

export const serif_font = Gelasio({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Feather Blog",
  description: "Create and share your thoughts with the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " relative"}>
        <StoreProvider>
          <RefreshAuth>
            <RouteProtect>
              <Header />
              <main>{children}</main>
              <Toaster />
            </RouteProtect>
          </RefreshAuth>
        </StoreProvider>
      </body>
    </html>
  );
}
