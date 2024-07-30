import React from "react";
import "./Main.css";
import "./print.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "../components/ui/toaster";
import { Nav } from "../components/ui/nav";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Nav />
      <main id="root" className="h-full antialiased m-8 scroll-smooth">
        {children}
      </main>
      <Toaster />
    </ThemeProvider>
  )
}
