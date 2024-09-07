'use client';
import Map from '@/components/Map/Map'; // Import from the new location
import SearchBar from '@/components/searchbar'; // Assuming SearchBar remains in the components directory
import Link from 'next/link';
// import CookieBanner from '@/components/cookieBanner';


export default function Home() {
  return (
    <main className=''>
      <SearchBar />
      <Map />


      <div>
        <Link
          className='absolute top-4 left-4 z-50 bg-blue-500 text-wrap max-w-xs text-white py-2 px-4 rounded md:py-3 md:px-6'
          href={'/aanvraag-sticker'}
        >
          Sticker aanvragen
        </Link>
        <Link
          className='absolute top-4 right-4 z-50 bg-blue-500 text-white py-2 mr-8 px-4 rounded md:py-3 md:px-6 md:mr-8'
          href={'/info/waarom'}
        >
          Waarom?
        </Link>
      </div>

      {/* <CookieBanner /> */}

    </main>);
}
