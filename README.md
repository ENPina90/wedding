# Wedding Bells

A wedding website built with React, TypeScript, and Vite.

## Design

**Figma Design:** [https://www.figma.com/design/IyYJYCa42PYiOLcg1OqMAA/wedding-bells?node-id=1-110&t=la41xE24IpljGCoH-0](https://www.figma.com/design/IyYJYCa42PYiOLcg1OqMAA/wedding-bells?node-id=1-110&t=la41xE24IpljGCoH-0)

- **File Key:** `IyYJYCa42PYiOLcg1OqMAA`
- **Default Node ID:** `1-110`

## Getting Started

### Running the Local Development Server

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

The development server includes Hot Module Replacement (HMR), so changes to your code will automatically refresh in the browser.

### Cloudinary Photo Gallery Setup

The Photos page uploads from the browser and loads gallery photos through server-side `/api/photos` endpoints.
Uploads are tagged as pending and only appear publicly after approval on `/photos/admin`.

1. Copy `.env.example` to `.env.local`.
2. Set:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
   - `VITE_CLOUDINARY_GALLERY_TAG` (optional; defaults to `wedding-gallery`)
   - `VITE_CLOUDINARY_PENDING_TAG` (optional; defaults to `${VITE_CLOUDINARY_GALLERY_TAG}-pending`)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_GALLERY_TAG` (optional; defaults to `wedding-gallery`)
   - `CLOUDINARY_PENDING_TAG` (optional; defaults to `${CLOUDINARY_GALLERY_TAG}-pending`)
   - `PHOTOS_ADMIN_KEY` (required for admin approve/delete actions via `X-Admin-Key`)
3. In Cloudinary, create an **unsigned** upload preset and allow uploads to the intended folder/tag.

Important:
- Do not put `API_SECRET` in frontend env vars.
- `VITE_` variables are public in the browser by design.
- On Railway, set both `VITE_*` and `CLOUDINARY_*` variables in service environment settings.
- Keep `PHOTOS_ADMIN_KEY` server-only; do not expose it in `VITE_*` vars.
- Use `/photos/admin` with your admin key to approve pending uploads into the public gallery.
- On `/photos/admin`, drag and drop approved photos to set their display order on `/photos`.

### Backfill Photo `year` Context From Captions

If your captions/alt text include years like `Berlin 2015`, you can backfill a `year` context value in Cloudinary:

1. Ensure `.env.local` has:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - Optional: `CLOUDINARY_GALLERY_TAG`, `CLOUDINARY_PENDING_TAG`
   - Optional: `CLOUDINARY_BACKFILL_TAGS` as comma-separated tags to scan (defaults to gallery + pending tags)
2. Run dry-run first:
   ```bash
   npm run cloudinary:backfill-years
   ```
3. Apply updates:
   ```bash
   npm run cloudinary:backfill-years -- --apply
   ```

The script parses the first 4-digit year (`19xx` or `20xx`) from each photo caption/alt text and writes it into Cloudinary custom context as `year`.

### Reorder Photos Chronologically By `year`

After `year` is present, you can reset `display_order` so oldest year comes first (ties are stable/arbitrary within the same year).

1. Optional tag override:
   - `CLOUDINARY_REORDER_TAG` (defaults to `CLOUDINARY_GALLERY_TAG`)
2. Run dry-run first:
   ```bash
   npm run cloudinary:reorder-years
   ```
3. Apply updates:
   ```bash
   npm run cloudinary:reorder-years -- --apply
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Development

This project uses React + TypeScript + Vite with HMR and ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
