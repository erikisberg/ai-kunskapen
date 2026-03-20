import type { Metadata, Viewport } from 'next'
import { Inter, Anton } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const anton = Anton({ 
  weight: "400",
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI-SKOLAN | Ostersunds kommun',
  description: 'Lar dig anvanda AI i vardagen och skydda dig mot AI-bedragarier. Gratis utbildning fran Ostersunds kommun.',
  generator: 'v0.app',
  keywords: ['AI', 'artificiell intelligens', 'sakerhet', 'deepfakes', 'bedragarier', 'Ostersund', 'utbildning'],
  authors: [{ name: 'Ostersunds kommun' }],
}

export const viewport: Viewport = {
  themeColor: '#FAF5EC',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv">
      <body className={`${inter.variable} ${anton.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
