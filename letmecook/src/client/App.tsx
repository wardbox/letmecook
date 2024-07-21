import React from "react";
import "./Main.css";
import { ThemeProvider } from "../components/theme-provider";
// Supports weights 200-800
import '@fontsource-variable/manrope';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen antialiased">
        {children}
      </div>
    </ThemeProvider>
  )
}