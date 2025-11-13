import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import I18nInit from "@/components/I18nInit";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Find Courts",
  description: "Descopera terenuri publice de tenis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = [
    { name: "Acasa", href: "/" },
    { name: "Harta", href: "/map" },
    { name: "Afla mai multe", href: "/about" },
  ];

  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex items-center justify-center space-x-3 pt-5 pb-5 gap-7">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-m/6 font-semibold text-gray-900 dark:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
        <I18nInit />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
