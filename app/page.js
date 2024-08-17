'use client';
import Map from '@/components/Map/Map'; // Import from the new location
import SearchBar from '@/components/searchbar'; // Assuming SearchBar remains in the components directory

export default function Home() {
  return (
    <main className=''>
      <SearchBar />
      <Map />
    </main>
  );
}
