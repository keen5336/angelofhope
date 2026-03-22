import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetTrack – Pet Adoption Management",
  description: "Find your perfect pet companion through our adoption program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
