import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ultra DevBox - The Replit + Bolt Killer",
  description: "Per-user Docker-enabled dev environments with real Docker-in-Docker, open-source LLM stack, and flexible deployment options.",
  keywords: ["Ultra DevBox", "Docker", "LLM", "VS Code", "Development", "AI", "CodeLlama", "Zero-Code"],
  authors: [{ name: "Ultra DevBox Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Ultra DevBox",
    description: "The Replit + Bolt killer with real Docker-in-Docker and open-source AI",
    url: "https://github.com/youlyank/Ultrabox",
    siteName: "Ultra DevBox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ultra DevBox",
    description: "The Replit + Bolt killer with real Docker-in-Docker and open-source AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Navigation Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg"></div>
                  <span className="font-bold text-xl">Ultra DevBox</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
                    Home
                  </Link>
                  <Link href="/zero" className="text-sm font-medium hover:text-orange-600 transition-colors">
                    Zero-Code Builder
                  </Link>
                  <Link href="/bolt" className="text-sm font-medium hover:text-orange-600 transition-colors">
                    Bolt Environment
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/zero" className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-orange-700 hover:to-red-700 transition-colors">
                  Start Building
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        {children}
        
        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-slate-600">
              <p>© 2024 Ultra DevBox. The Replit + Bolt Killer.</p>
              <p className="mt-2">
                Built with ❤️ using open-source technologies.
              </p>
            </div>
          </div>
        </footer>
        
        <Toaster />
      </body>
    </html>
  );
}
