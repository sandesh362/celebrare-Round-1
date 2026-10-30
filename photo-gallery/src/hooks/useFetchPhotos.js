import { useEffect, useState } from 'react';

const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30';

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadPhotos() {
      try {
        const response = await fetch(PHOTOS_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Photo request failed: ${response.status}`);
        }

        const data = await response.json();
        const valid = Array.isArray(data) && data.every(
          (photo) => photo && typeof photo.id === 'string' && typeof photo.author === 'string',
        );
        if (!valid) {
          throw new Error('Unexpected photo data');
        }

        if (active) setPhotos(data);
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setError('We could not load the photos. Check your connection and refresh the page.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPhotos();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { photos, loading, error };
}
