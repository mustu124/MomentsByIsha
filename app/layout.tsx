import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moments by Isha | Luxury Aroma & Fragrance",
  description: "A premium ecommerce catalogue for handcrafted aroma, fragrance, and lifestyle products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
