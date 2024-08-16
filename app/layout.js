import './globals.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Inter } from 'next/font/google';
import CookieBanner from '@/components/CookieBanner';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Machinemelder.nl',
  description: 'Check of je flessen kunt inleveren bij de supermarkt',
};

export default function RootLayout({ children }) {
  return (<html lang='en'>
    <GoogleAnalytics GA_MEASUREMENT_ID='G-7NMFHCTV7G' />
    <body className={inter.className}>{children}
      <CookieBanner />
      <Analytics />
    </body>
  </html>);
}

