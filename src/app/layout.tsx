import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "./globals.css";
import {ClerkProvider, RedirectToSignIn, SignedIn, SignedOut} from "@clerk/nextjs"
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntervueHub",
  description: "Minimal liquid glass interview platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SignedIn>
              <div className="min-h-screen relative">
                <Navbar />
                <main className="pt-16 px-4 sm:px-6 lg:px-8">
                  {children}
                </main>
              </div>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </ThemeProvider>
          <Toaster 
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'inherit',
                borderRadius: '12px',
              },
            }}
          />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}