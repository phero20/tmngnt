import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * SEO Utility: generates standard metadata objects for Next.js 13+ App Router.
 * Centralizing this ensures branding consistency and perfect SEO across all pages.
 */
export function constructMetadata({
  title = 'LuxeStay | Reimagining Luxury Accommodation',
  description = 'Experience the pinnacle of hospitality with LuxeStay. Book your dream stay in our curated collection of luxury hotels.',
  image = '/og-image.jpg', // Placeholder for actual OG image
  noIndex = false,
}: SEOProps = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | LuxeStay`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
      type: 'website',
      siteName: 'LuxeStay',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@luxestay', // Example twitter handle
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL('http://localhost:3000'), // Replace with production URL later
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
