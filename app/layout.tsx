import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppProvider } from '@/contexts/AppContext'
import { Header } from '@/components/Header'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Evora events - Plan Once. Book Everything. Celebrate Without Stress.',
  description: 'Evora events is your one-stop platform for event planning and booking event venues and services.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <AppProvider>
            <Header />
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
