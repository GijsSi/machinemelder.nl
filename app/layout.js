import './globals.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';

import {Inter} from 'next/font/google';

const inter = Inter({subsets: ['latin']});

export const metadata = {
  title: 'Machinemelder.nl',
  description: 'Check of je flessen kunt inleveren bij de supermarkt',
};

export default function RootLayout({children}) {
  return (<html lang = 'en'>
          <body className = {inter.className}>{children}</body>
    </html>);
}
