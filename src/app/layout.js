import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reflow",
  description: "Reflow Web Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Suspense fallback="Loading...">
        {children}
        </Suspense>
        </body>
    </html>
  );
}
