import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CustomProviders } from "@/Components/CustomProviders";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Readium Playground",
  description: "Play with the capabilities of the Readium Web Toolkit and Thorium Web Components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <CustomProviders>
          { children }
        </CustomProviders>
      </body>
    </html>
  );
}
