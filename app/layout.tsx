import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEMKEN Customer Assistant",
  description:
    "Instant answers for LEMKEN customers — ask about products, parts, manuals and service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
