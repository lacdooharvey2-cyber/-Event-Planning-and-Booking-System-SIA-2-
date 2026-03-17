'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ShoppingCart, LogOut } from 'lucide-react'

export function Header() {
  const { user, logout, isLoggedIn } = useAuth()
  const { cart } = useApp()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
            <span className="drop-shadow-sm">E</span>
          </div>
          <span className="hidden sm:inline font-bold text-lg tracking-tight">
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Evora</span>
            <span className="text-foreground font-semibold"> Events</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/venues" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Venues
          </Link>
          <Link href="/services" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Services
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-blue-600 text-xs font-bold text-white flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'venue_owner' && (
                  <DropdownMenuItem asChild>
                    <Link href="/vendor/dashboard">Venue Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'service_provider' && (
                  <DropdownMenuItem asChild>
                    <Link href="/service-provider/dashboard">Service Provider Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === 'customer' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/service-provider/register">Become a Service Provider</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
