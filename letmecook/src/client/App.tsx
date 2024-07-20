import React, { FormEventHandler, FormEvent } from "react";
import { type AuthUser, getUsername } from "wasp/auth";
import { logout } from "wasp/client/auth";
import "./Main.css";
import { ThemeProvider } from "../components/theme-provider";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <header>
          <h1 className="text-3xl font-bold underline">letmecook</h1>
        </header>
        {children}
        <footer>
          <p>footer</p>
        </footer>
      </div>
    </ThemeProvider>
  )
}