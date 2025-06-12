import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { HistoryProvider } from "@/contexts/history-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Advanced Calculator Suite",
  description: "Number base conversions, mathematical operations, and matrix calculations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HistoryProvider>{children}</HistoryProvider>
      </body>
    </html>
  )
}
