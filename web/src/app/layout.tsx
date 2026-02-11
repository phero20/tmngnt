import { Playfair_Display, Lato } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import ProgressProvider from '@/providers/ProgressProvider';
import Navbar from '@/components/common/Navbar';
import { Toaster } from 'sonner';
import { constructMetadata } from '@/lib/seo';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

// Use Elite SEO Helper
export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${lato.variable} font-sans antialiased text-foreground bg-background`}
      >
        <QueryProvider>
          <ProgressProvider>
            <Navbar />
            <main className="min-h-screen pt-0 selection:bg-primary/20">
              {children}
            </main>
            <Toaster
              richColors
              theme="dark"
              position="top-center"
              closeButton
            />
          </ProgressProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
