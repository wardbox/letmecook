import React from "react";
import "./Main.css";
import "./print.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { Nav } from "../components/ui/nav";
import Footer from "../components/ui/footer";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Nav />
        <main id="root" className="h-full antialiased m-8 scroll-smooth">
          {children}
        </main>
        <Toaster />
        <div className="sticky top-[100vh] m-4">
          <Footer />
        </div>
      </ThemeProvider>
    </div>
  )
}
