import React from "react";
import "./Main.css";
import "./print.css";
import { ThemeProvider } from "../components/theme-provider";
import {
  Toaster

} from "../components/ui/toaster";
export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main id="root" className="h-screen antialiased">
        {children}
      </main>
      <Toaster />
    </ThemeProvider>
  )
}
