import type { Metadata } from "next";
import { GeistSans } from 'geist/font'
import "./globals.css";
import Header from './components/Header';
import Banner from './components/Banner';

export const metadata: Metadata = {
  title: "Wave Tracker",
  description: "Wave Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Banner />
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
