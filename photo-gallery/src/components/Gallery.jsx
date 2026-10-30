import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import { FAVOURITES_KEY, favouritesReducer, loadFavourites } from '../reducers/favouritesReducer';
import PhotoCard from './PhotoCard';

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState('');
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, loadFavourites);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
      setStorageError('');
    } catch {
      setStorageError('Favourites work for this visit, but your browser could not save them for next time.');
    }
  }, [favourites]);

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const visiblePhotos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, search]);

  function toggleFavourite(photoId) {
    dispatch({ type: 'toggle', photoId });
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-6 py-6 sm:px-10 lg:px-14">
          <div className="flex items-center gap-3">
            <svg aria-hidden="true" viewBox="0 0 28 28" fill="none" className="size-7 text-accent">
              <path d="M2 10V2h8M18 2h8v8M26 18v8h-8M10 26H2v-8" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="14" cy="14" r="4" fill="currentColor" />
            </svg>
            <span className="text-base font-semibold tracking-tight">Photo gallery</span>
          </div>
          <span className="text-xs text-muted sm:text-sm">Photography by Picsum</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-6 pt-12 pb-10 sm:px-10 sm:pt-16 lg:px-14">
        <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent uppercase">The collection</p>
            <h1 className="font-display text-5xl leading-[1.1] tracking-tight sm:text-6xl">A fresh perspective.</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              Find a photographer. Discover a moment. Keep your favourites.
            </p>
          </div>
          <div className="w-full lg:max-w-80">
            <label htmlFor="author-search" className="mb-2 block text-sm font-medium">Search by author</label>
            <div className="relative">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="pointer-events-none absolute top-3.5 left-4 size-5 text-muted">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input
                id="author-search"
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Try a photographer's name"
                className="h-12 w-full rounded-lg border border-line bg-white pr-4 pl-12 text-sm text-ink placeholder:text-muted focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
            </div>
          </div>
        </div>

        {storageError && <p role="status" className="mb-6 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent">{storageError}</p>}

        <div className="mb-7 flex items-center justify-between gap-4 border-t border-line pt-5">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase">Photographs</p>
          <p role="status" aria-live="polite" className="text-sm text-muted">
            {!loading && !error && `${visiblePhotos.length} of ${photos.length} photos`}
          </p>
        </div>

        {loading ? (
          <div role="status" className="flex min-h-72 flex-col items-center justify-center gap-4 text-sm text-muted">
            <span aria-hidden="true" className="size-8 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none" />
            Loading photos...
          </div>
        ) : error ? (
          <div role="alert" className="rounded-lg border border-line bg-white px-6 py-14 text-center">
            <h2 className="mb-2 font-display text-2xl">Photos could not be loaded</h2>
            <p className="text-sm leading-relaxed text-muted">{error}</p>
          </div>
        ) : visiblePhotos.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="mb-3 font-display text-3xl">{photos.length ? 'No matching photographers' : 'No photos available'}</h2>
            <p className="text-sm text-muted">{photos.length ? 'Try another author name or clear your search.' : 'Please check back later.'}</p>
          </div>
        ) : (
          <div aria-label="Photo collection" className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {visiblePhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggle={toggleFavourite}
              />
            ))}
          </div>
        )}

        <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          <p>A small collection. A world of perspectives.</p>
          <p>Photos from Picsum.</p>
        </footer>
      </main>
    </div>
  );
}
