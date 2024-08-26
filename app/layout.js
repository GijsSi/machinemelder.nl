import './globals.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';

import CookieBanner from '@/components/cookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import PlausibleProvider from 'next-plausible';
import GoogleAdsense from '@/components/Google/GoogleAdsense';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Machinemelder.nl',
  description: 'Check of je flessen kunt inleveren bij de supermarkt',
};

export default function RootLayout({ children }) {
  return (

    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="google-adsense-account" content="ca-pub-4648837828270370" />
        <script async defer src="https://plausible.machinemelder.nl/script.js" data-website-id="0cf3f602-710d-4fbe-8d53-b5476d0501a3"></script>
      </Head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <GoogleAdsense pId="4648837828270370" />
      </body>
    </html>
  );
}
