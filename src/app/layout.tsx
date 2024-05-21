import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers, UserProvider } from "./providers";
import Navigation from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "취업하자",
  description: "AWS Cloud School 5조",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <UserProvider>
            <Navigation />
            {children}
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
