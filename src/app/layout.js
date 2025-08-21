import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reflow",
  description: "Reflow Web Application",
  keywords: "Reflow, Web Application, Trend Analysis",
};

export const viewport = {
  width: "device-width",
  initialScale: 0.8,
  maximumScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.8, maximum-scale=1.0"
        />
      </head>
      <body className={`${inter.className}`}>
        <Suspense fallback="Loading...">{children}</Suspense>
      </body>
    </html>
  );
}
