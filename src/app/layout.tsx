import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { site } from "@/data/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Events & Communications Recruitment | 17 Recruitment",
    template: "%s | 17 Recruitment",
  },
  description: site.description,
  metadataBase: new URL(site.url),
  verification: {
    google: "WpqvNSMgZ5JZ38FN13J5gmOa80z9Um7R3El2qhieNiA",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${manrope.variable} ${sora.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
