import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600", "700", "900"] 
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Early Detection Diabetes | ITSB Health Tech",
  description: "Sistem Deteksi Diabetes Berbasis AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
