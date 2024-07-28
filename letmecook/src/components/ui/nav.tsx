import { Link } from "wasp/client/router"
import { Button } from "./button"
import { Input } from "./input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "./dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./sheet"
import { Hamburger, MagnifyingGlass, User } from "@phosphor-icons/react"
import logomark from "../../client/static/logomark.svg"
import { useAuth, logout } from 'wasp/client/auth'
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

export const Nav = () => {
  const { data: user } = useAuth()

  return (
    <header className="printhide static top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <img src={logomark} alt="letmecook logomark" className="h-16" />
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
          <img src={logomark} alt="letmecook-mobile-logomark" className="h-12" />
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
        {/* <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form> */}
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
              {/* <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem> */}
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
