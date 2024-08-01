import React from 'react';
import logomark from "../../client/static/icon.svg"
import { Link } from 'wasp/client/router';

export default function Footer() {
  return (
    <footer className="bg-muted rounded-lg printhide">
      <div className="w-full mx-auto items-center p-4 flex flex-col justify-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <Link to="/" className="flex items-center gap-3">
            <img src={logomark} alt="letmecook logomark" className="h-16" />
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold">letmecook</h3>
              <p className="text-sm font-medium text-muted-foreground">A clean and simple cookbook with 100% good recipes.</p>
            </div>
          </Link>
          <p className="text-xs text-muted-foreground p-1">made with 🍳 by <a href="https://github.com/wardbox" target="_blank" className="text-muted-foreground underline hover:shadow">wardbox</a></p>
        </div>
        <div className="flex gap-8">
          <a href="https://www.producthunt.com/posts/letmecook?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-letmecook" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=475742&theme=light" alt="letmecook - A&#0032;clean&#0032;and&#0032;simple&#0032;cookbook&#0032;with&#0032;100&#0037;&#0032;good&#0032;recipes | Product Hunt" className="justify-end h-12" /></a>
          <nav className="flex gap-3">
            <ul>
              <li className="font-semibold">
                Explore
              </li>
              <li className="text-sm font-semibold">
                <Link to="/recipes" className="text-muted-foreground underline hover:shadow">Recipes</Link>
              </li>
              <li className="text-sm font-semibold">
                <Link to="/submit" className="text-muted-foreground underline hover:shadow">Submit</Link>
              </li>
            </ul>
            <ul>
              <li className="font-semibold">
                Contact
              </li>
              <li className="text-sm">
                <a href="https://discord.gg/U7ttVJS2us" target="_blank" className="text-muted-foreground underline hover:shadow">Discord</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer >
  )
}
