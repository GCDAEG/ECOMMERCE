import { Inter } from "next/font/google";
import "./../globals.css";
import HeaderDashboard from "@/components/layout/dashboard/Header";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Ecommerce",
  description: "Ecommerce built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className={`antialiased relative`}>
        <HeaderDashboard />
        {children}
      </body>
    </html>
  );
}
