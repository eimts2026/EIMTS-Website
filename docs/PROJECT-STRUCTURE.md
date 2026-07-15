# Project Structure

This project is a React, Vite, and TypeScript website. All editable application code lives in `src/`.

## Where to Make Changes

| Need | Location |
| --- | --- |
| Add or change a page | `src/features/<area>/` |
| Change the site header or footer | `src/components/layout/` |
| Change shared UI pieces | `src/components/ui/` |
| Add a new URL or change routing | `src/app/App.tsx` |
| Change page titles or descriptions | `src/lib/seo.ts` |
| Change global styling | `src/styles/globals.css` |
| Change shared page styling | `src/styles/multipage.css` |
| Add or replace images | `public/assets/` |

## Adding a New Page

1. Create a page component inside `src/features/<feature-name>/`.
2. Import it and add its URL to the `routes` object in `src/app/App.tsx`.
3. Add its title and description to `src/lib/seo.ts`.
4. Add the matching route to `scripts/generate-route-pages.mjs` so the production build creates its SEO-ready page.
5. Link to the new URL from the appropriate navigation component.

## Before Handover

Run these checks after every change:

```bash
npm run lint
npm run build
```

Use small, feature-focused changes. Shared components belong in `src/components/`; content or behaviour used by one page belongs in that page's feature folder.