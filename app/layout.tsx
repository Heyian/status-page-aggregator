import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Status Page Aggregator | Real-time Service Status Monitoring',
    template: '%s | Status Page Aggregator'
  },
  description: 'Real-time status monitoring for popular cloud, AI, and infrastructure services. Check service status and join community discussions.',
  keywords: ['status page', 'service status', 'cloud status', 'infrastructure monitoring', 'AI services', 'downtime monitoring'],
  authors: [{ name: 'Status Page Aggregator' }],
  creator: 'Status Page Aggregator',
  publisher: 'Status Page Aggregator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://status-page-aggregator.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://status-page-aggregator.vercel.app',
    title: 'Status Page Aggregator | Real-time Service Status Monitoring',
    description: 'Real-time status monitoring for popular cloud, AI, and infrastructure services. Check service status and join community discussions.',
    siteName: 'Status Page Aggregator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Status Page Aggregator | Real-time Service Status Monitoring',
    description: 'Real-time status monitoring for popular cloud, AI, and infrastructure services. Check service status and join community discussions.',
    creator: '@statuspageagg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
