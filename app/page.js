'use client';
import Map from '@/components/Map/Map'; // Import from the new location
import SearchBar from '@/components/searchbar'; // Assuming SearchBar remains in the components directory
import Link from 'next/link';

export default function Home() {
  return (
    <main className=''><SearchBar /><Map />
      <Link
        className='absolute top-4 left-4 z-50 bg-blue-500 text-white py-2 px-4 rounded'
        href={'/aanvraag-sticker'}
      >
        Nog geen sticker op jouw machine?
      </Link>

    </main>);
}
