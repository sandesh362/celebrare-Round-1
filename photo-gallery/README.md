# Photo Gallery

A React photo gallery for the Celebrare frontend internship assignment. It loads 30 photos from Picsum, filters them by author, and saves favourite photo IDs in this browser.

![Gallery desktop preview](docs/assets/gallery-desktop.png)

## Run locally

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. An internet connection is needed for the photo API and images. No API key or environment variables are required.

```sh
npm test
npm run build
npm run preview
```

`npm test` runs the behaviour tests once. `npm run build` writes the production app to `dist`. `npm run preview` serves that build locally.

For browser checks, install Google Chrome, build the project, then run `npm run test:browser`. The browser tests use a controlled API response; the live Picsum endpoint was also checked separately.

## Assignment scope

1. React and Vite, with Tailwind CSS for all styling. Functional components only; no component library.
2. Fetch `https://picsum.photos/v2/list?limit=30` on mount. Display a spinner while loading and an error message on failure.
3. Each card contains a photo, author name, and heart button. The grid has one column below 640px, two from 640px, and four from 1024px.
4. Search by author as you type. Search is case-insensitive, ignores surrounding spaces, and filters the fetched array without another API request.
5. Use `useReducer` for favourites. Save IDs to `localStorage` and restore them on refresh.
6. Keep requests inside `useFetchPhotos`, which returns `photos`, `loading`, and `error`. Gallery consumes the hook.
7. Use `useCallback` for the search change handler and `useMemo` for the filtered array.

The app deliberately stays within those seven features. There are no accounts, downloads, routing, pagination, or favourite-only views.

## Code map

- `src/components/Gallery.jsx`: owns search and favourites, persists favourites, and renders loading, error, empty, and grid states.
- `src/components/PhotoCard.jsx`: photo, author, and accessible toggle button.
- `src/hooks/useFetchPhotos.js`: request lifecycle, HTTP errors, and cancellation on unmount.
- `src/reducers/favouritesReducer.js`: pure toggle action and safe loading of saved IDs.
- `src/index.css`: Tailwind import and theme tokens; styling is applied through Tailwind utilities.
- `src/__tests__/`: fetch, search, reducer, storage, and persistence behaviour tests.
- `docs/INTERVIEW_NOTES.md`: explanations and answers to the recording questions.
- `docs/VIDEO_SCRIPT.md`: five-minute walkthrough with file cues.
- `output/pdf/Photo_Gallery_Project_Guide.pdf`: project summary, implementation, and verification.
- `output/pdf/Photo_Gallery_Interview_Guide.pdf`: printable explanations and the timed script.

## Design decisions

Favourites are an array of photo IDs rather than duplicate photo objects. A single `toggle` action adds a missing ID or removes an existing one without mutating state. A lazy reducer initializer reads storage before the first render; an effect writes later changes. Storage failures leave the gallery usable for the current visit and show a short persistence warning.

The fetch effect uses `AbortController` and an active flag. Unmounting aborts the request and prevents late state updates. Development Strict Mode intentionally runs effect setup and cleanup again, so the browser can show one cancelled request followed by a successful request. Searching never refetches the list.

`useCallback` retains the search handler reference. `useMemo` reuses the filtered array when photos and search are unchanged. With only 30 photos these are small optimisations, included because the assignment explicitly requires them. Removing them would preserve correct behaviour.

The API supplies photo metadata. Cards request a 640 by 480 version of each photo using Picsum's ID endpoint, reserving a 4:3 image area to avoid layout shifts. Author names and photo IDs are used in alt text because the API does not provide visual descriptions.

## Verify before recording

- On a fresh load, see the spinner followed by 30 cards.
- Search for an author visible in the grid, try different letter casing, then try an unmatched name.
- Confirm typing does not issue additional `/v2/list` requests.
- Toggle a heart, refresh, confirm it stays selected, then toggle it off and refresh again.
- Check 390px, 768px, and 1440px viewports for one, two, and four columns.
- Block the list request in browser developer tools and refresh to see the error state. Remove the block afterwards.
- Use the keyboard to reach search and heart buttons. Confirm visible focus and a changed pressed state.

## Submission

The required submission is a public GitHub repository plus your own five-minute screen recording. A PDF does not replace either item.

1. Review the code and rehearse the notes until you can explain each part.
2. Push this project to a public GitHub repository. Keep `package-lock.json`; exclude `node_modules`, `dist`, and QA captures.
3. Record the working app and required code explanations. Upload to Google Drive with access for reviewers or YouTube as unlisted.
4. Use the Google Form shared separately to submit the repository link, recording link, and one honest sentence about the hardest part.
5. Submit within 24 hours of receiving the assignment. The exact deadline depends on when you received it.

Only describe a difficulty as your own after you have reproduced it and understood the fix. The brief permits AI assistance and expects you to understand the submitted code.

## Verification

Verified on 30 October 2026: production build, 24 component/state tests, and seven Chrome browser tests passed. Browser tests covered 390px, 768px, and 1440px layouts, local search without refetching, loading and error states, keyboard use, and persistence through actual page reloads. A separate live browser check loaded 30 Picsum records and the first eight images with no JavaScript errors.

## Rebuild the supporting PDFs

The app itself only needs npm dependencies. Rebuilding the supporting documents additionally needs Python and ReportLab:

```sh
python -m pip install -r requirements-docs.txt
python scripts/build_documents.py
```

The editable interview content lives in `docs/INTERVIEW_NOTES.md` and `docs/VIDEO_SCRIPT.md`.

## Official references

- [Picsum API](https://picsum.photos/)
- [React hooks](https://react.dev/reference/react)
- [Vite](https://vite.dev/guide/)
- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite)
