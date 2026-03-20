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
  title: 'AI-kunskapen | Östersunds kommun',
  description: 'Lär dig använda AI i vardagen och skydda dig mot AI-bedrägerier. Gratis utbildning från Östersunds kommun.',
  keywords: ['AI', 'artificiell intelligens', 'säkerhet', 'deepfakes', 'bedrägerier', 'Östersund', 'utbildning'],
  authors: [{ name: 'Östersunds kommun' }],
}

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
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
