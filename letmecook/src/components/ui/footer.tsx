import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-muted rounded-lg">
      <div className="w-full mx-auto p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center">© 2024 <a href="https://letmecook.food/" className="underline hover:shadow">letmecook</a>.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
          <li>
            <a href="https://discord.gg/U7ttVJS2us" target="_blank" className="underline hover:shadow">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
