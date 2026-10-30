import { useState } from 'react';

export default function PhotoCard({ photo, isFavourite, onToggle }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="min-w-0">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-line/60">
        {imageFailed ? (
          <div className="flex h-full items-center justify-center p-6 text-sm text-muted">
            Photo unavailable
          </div>
        ) : (
          <img
            src={`https://picsum.photos/id/${photo.id}/640/480`}
            alt={`Photo ${photo.id} by ${photo.author}`}
            width="640"
            height="480"
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            Photograph {photo.id.padStart(2, '0')}
          </p>
          <h2 className="truncate text-sm font-medium text-ink" title={photo.author}>
            {photo.author}
          </h2>
        </div>
        <button
          type="button"
          aria-label={`${isFavourite ? 'Remove' : 'Add'} photo ${photo.id} by ${photo.author} ${isFavourite ? 'from' : 'to'} favourites`}
          aria-pressed={isFavourite}
          onClick={() => onToggle(photo.id)}
          className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${
            isFavourite
              ? 'bg-accent-soft text-accent hover:bg-accent-soft/70'
              : 'text-muted hover:bg-line/60 hover:text-accent'
          }`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
