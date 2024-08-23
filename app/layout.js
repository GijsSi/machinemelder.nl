import './globals.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';

import CookieBanner from '@/components/cookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import PlausibleProvider from 'next-plausible';
import GoogleAdsense from '@/components/Google/GoogleAdsense';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Machinemelder.nl',
  description: 'Check of je flessen kunt inleveren bij de supermarkt',
};

export default function RootLayout({ children }) {
  return (
    <PlausibleProvider
      domain="machinemelder.nl"
      customDomain="http://161.97.151.230:8001"
      selfHosted={true}
      trackOutboundLinks={true}
      trackFileDownloads={true}
      trackLocalhost={true}
      enabled={true}
    >
      <html lang="en">
        <Head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <meta name="google-adsense-account" content="ca-pub-4648837828270370" />
        </Head>
        <body className={inter.className}>
          {children}
          <Analytics />
          <GoogleAdsense pId="4648837828270370" />
        </body>
      </html>
    </PlausibleProvider>
  );
}
