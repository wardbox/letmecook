import React from "react";
import "./Main.css";
import { ThemeProvider } from "../components/theme-provider";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main id="root" className="h-screen antialiased">
        {children}
      </main>
    </ThemeProvider>
  )
}
