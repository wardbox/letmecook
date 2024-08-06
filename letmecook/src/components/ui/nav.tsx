import { Link } from "wasp/client/router"
import { Button, buttonVariants } from "./button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./sheet"
import { Hamburger, User } from "@phosphor-icons/react"
import logomark from "../../../public/icon.svg"
import { useAuth, logout } from 'wasp/client/auth'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

export const Nav = () => {
  const { data: user } = useAuth()

  return (
    <header className="printhide static flex items-center gap-8 bg-muted px-4 h-24 md:p-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <img src={logomark} alt="letmecook logomark" className='h-20 object-scale-down' />
          <span className="sr-only">letmecook</span>
        </Link>
        <Link
          to="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          to="/recipes"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Recipes
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild title="nav bar">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Hamburger size={24} />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <img src={logomark} alt="letmecook-mobile-logomark" className="h-20 object-scale-down" />
          <SheetTitle>letmecook</SheetTitle>
          <SheetDescription>A clean and simple cookbook with 100% good recipes.</SheetDescription>
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <span className="sr-only">letmecook</span>
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Recipes
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <Link to="/submit" className={buttonVariants({ variant: "default" })}>
          Submit a recipe
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              {user && user.avatarUrl ? (
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <User size={24} />
              )}
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          {user ? (
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              {user.isAdmin && (
                <Link to="/admin">
                  <DropdownMenuItem className="cursor-pointer">
                    Admin
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent align="end">
              <Link to="/login">
                <DropdownMenuItem className="cursor-pointer">Login</DropdownMenuItem>
              </Link>
              <Link to="/signup">
                <DropdownMenuItem className="cursor-pointer">Sign Up</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  )
}
