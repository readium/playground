import type { Metadata } from "next";
import { Inter } from "next/font/google";
import CssBaseline from '@mui/material/CssBaseline';
import '@mui/material-pigment-css/styles.css';

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Readium Playground",
  description: "Play with the capabilities of the Readium Web Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CssBaseline />
        {children}
      </body>
    </html>
  );
}
