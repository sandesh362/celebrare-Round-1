export const FAVOURITES_KEY = 'photo-gallery:favourites';

export function loadFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? '[]');
    if (!Array.isArray(saved) || !saved.every((id) => typeof id === 'string')) {
      return [];
    }
    return [...new Set(saved)];
  } catch {
    return [];
  }
}

export function favouritesReducer(state, action) {
  switch (action.type) {
    case 'toggle':
      return state.includes(action.photoId)
        ? state.filter((id) => id !== action.photoId)
        : [...state, action.photoId];
    default:
      return state;
  }
}
