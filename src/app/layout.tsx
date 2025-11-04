import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'PillCheck AI',
  description: 'Your personal AI-powered medicine safety assistant.',
  icons: {
    icon: '/icons/blue-pill.svg',
    apple: '/icons/blue-pill.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icons/blue-pill.svg" />
        <link rel="apple-touch-icon" href="/icons/blue-pill.svg" />
        <meta name="theme-color" content="#06B6D4" />
      </head>
      <body
        className={cn('min-h-screen bg-background font-body antialiased site-decor')}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
