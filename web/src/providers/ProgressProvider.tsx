'use client';

import NextTopLoader from 'nextjs-toploader';

/**
 * ProgressProvider
 * Uses nextjs-toploader for zero-config, high-performance loading bars.
 * This is the industry standard for Next.js App Router stability.
 */
export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader
        color="#f97316"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #f97316,0 0 5px #f97316"
      />
      {children}
    </>
  );
}
