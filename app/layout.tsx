import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ToastProvider from "@/components/Contexts/ToastContext";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Automatically Generate Stock Photo Titles, Tags &amp; Keywords • TagMyPhotos",
  description: "Tag My Photos™ is a free-to-use web application to generate titles and tags for your microstock photos, illustrations &amp; ai-generated artworks.",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta content="[Free Tool] Generate Stock Photo Titles, Tags &amp; Keywords • TagMyPhotos" property="og:title" />
        <meta content="Tag My Photos™ is a free-to-use web application to generate titles and tags for your microstock photos, illustrations &amp; ai-generated artworks." property="og:description" />
        <meta content="[Free Tool] Generate Stock Photo Titles, Tags &amp; Keywords • TagMyPhotos" property="twitter:title" />
        <meta content="Tag My Photos™ is a free-to-use web application to generate titles and tags for your microstock photos, illustrations &amp; ai-generated artworks." property="twitter:description" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" name="twitter:card" />
      </Head>
      <body className={inter.className} style={{ background: "#FFF" }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
