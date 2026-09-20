# ubiqautomation.com

Standalone Next.js app for the **uBIQ** brand site.

This content used to live inside the parent `unntangle.com` project under
`/ubiq/*`. It's now its own project on its own domain, with the same pages at
the root:

| Was (parent site)      | Is now (this site) |
| ---------------------- | ------------------ |
| `/ubiq`                | `/`                |
| `/ubiq/about`          | `/about`           |
| `/ubiq/solutions`      | `/solutions`       |
| `/ubiq/technologies`   | `/technologies`    |
| `/ubiq/experiences`    | `/experiences`     |
| `/ubiq/contact`        | `/contact`         |
| `/ubiq/senz`           | `/senz`            |
| `/ubiq/twin`           | `/twin`            |
| `/ubiq/care-plus`      | `/care-plus`       |

On the parent site those routes 301 here — see the `HIDE_UBIQ` flag in
`unntangle.com/middleware.ts`.

## Setup

```bash
npm install
npm run dev         # http://localhost:3001
```

Port 3001 is deliberate — the parent project runs on 3000, so both can run
side by side.

## Relationship to unntangle.com

This project is now the sole home for the uBIQ code. It was originally
seeded from the parent by `scripts/migrate-from-parent.mjs`, which copied
`app/ubiq/**` plus every component it imported. **That script has been
removed** — this project has diverged and re-running it would overwrite
local work.

Edit uBIQ code here and nowhere else. The parent's `app/ubiq/` folder is
dead weight and should be deleted; nothing reads it any more.

## Open items

- **The footer** — resolved. `components/Footer.tsx` is now a uBIQ-specific
  footer with its own Explore / Ecosystem / Solutions columns. Legal links
  point at absolute `https://unntangle.com/...` URLs on the parent.
- **Contact form** — resolved. `/contact` posts to Web3Forms, so there's no
  API route to bring across. Set `NEXT_PUBLIC_WEB3FORMS_KEY` in the hosting
  environment; without it the inline placeholder makes submissions fail.
- **DNS + hosting** — point `ubiqautomation.com` at this deployment. Decide
  www vs non-www and 301 the one you don't use to the one you do.
- **Search Console** — add `ubiqautomation.com` as a Domain property and
  submit `/sitemap.xml`.
- **Redirects** — resolved. `unntangle.com/middleware.ts` now 301s the whole
  `/ubiq` subtree here (`/ubiq/about` → `/about`, query strings preserved),
  so existing links and indexed pages carry their ranking across. Still
  worth doing the same for `ubiq.unntangle.com` if that subdomain was ever
  served.

## Dependencies

Trimmed relative to the parent. Dropped: AWS SDK, Supabase, bcrypt, jose,
cloudinary, adm-zip, jszip, next-mdx-remote — all of those belong to the
parent's CRM / OfficeMate / blog subsystems, none of which exist here. Kept:
`next`, `react`, `react-dom`, `framer-motion`, `lucide-react`.
