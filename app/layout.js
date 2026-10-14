import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import CinematicIntro from "@/components/cinematic-intro";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "react-day-picker/dist/style.css";
import { Toaster } from "sonner";

import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "SYNCD — Precision Agile Project Management",
    template: "%s | SYNCD",
  },
  description:
    "Next-generation agile project intelligence and team synchronization platform with real-time sprint execution.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ffffff",
          colorBackground: "#08080a",
          colorInputBackground: "#0f0f13",
          colorInputText: "#ffffff",
          colorText: "#f4f4f5",
          colorTextSecondary: "#a1a1aa",
          colorAlphaShade: "#ffffff",
          borderRadius: "0.5rem",
        },
        elements: {
          formButtonPrimary:
            "bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-all shadow-sm rounded-lg",
          card: "bg-[#08080a] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.9)] rounded-2xl",
          headerTitle: "text-white font-bold tracking-tight text-xl",
          headerSubtitle: "text-neutral-400 text-sm",
          socialButtonsBlockButton:
            "bg-[#101014] border border-white/10 text-white hover:bg-[#181820] transition-colors rounded-lg",
          formFieldInput:
            "bg-[#0f0f13] border-white/10 text-white focus:border-white/30 rounded-lg",
          footerActionLink: "text-white hover:text-neutral-300 underline font-medium",
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${inter.className} cinematic-surface min-h-screen bg-black text-neutral-100 antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {/* Cinematic Particle Wave Opening Intro */}
            <CinematicIntro />

            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>

            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#0c0c0e",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#f4f4f5",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
