'use client';
import Map from '@/components/map';
import Image from 'next/image';
import SearchBar from '@/components/searchbar';

export default function Home() {
  return (
    <main className=''>
      <SearchBar />
     <Map />
    </main>
  );
}
