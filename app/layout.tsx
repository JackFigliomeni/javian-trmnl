import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Professor Java's | Order Portal",
  description: 'Private Aviation Catering Order System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
