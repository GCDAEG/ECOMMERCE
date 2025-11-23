import Header from "@/components/layout/Header";
import "./../globals.css";

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
    <html lang="en">
      <body className={`antialiased relative`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
