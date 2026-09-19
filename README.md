# Personal Blog

A minimal, editorial personal blog. Next.js App Router, TypeScript, pure CSS. No public auth, no accounts — posts are written through a password-gated `/admin`, stored in MongoDB, and the public site is honestly empty until you add real content.

## Stack

- Next.js 16 (App Router, Server Components by default)
- TypeScript
- Pure CSS — global tokens (`app/globals.css`) + co-located CSS Modules, no framework
- MongoDB — posts are documents in a `posts` collection, authored via `/admin`
- MDX rendering via `next-mdx-remote/rsc`; syntax highlighting via Shiki (build-time, dual light/dark theme)
- Comments via [Giscus](https://giscus.app) (GitHub Discussions) — optional, off by default

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

The site works even with nothing configured: every content section shows its empty state instead of pretending posts exist, and `/admin` says plainly that it isn't connected yet.

### Required environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string (e.g. from Atlas). Without it, the public site shows empty states and `/admin` shows "not configured". |
| `MONGODB_DB` | Database name. Defaults to `blog`. |
| `ADMIN_PASSWORD` | The password you type to sign into `/admin`. Change it any time — no code changes needed. |
| `ADMIN_SESSION_SECRET` | Signs the admin session cookie. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for the sitemap and Open Graph tags. |

**MongoDB Atlas note:** if `/admin` says posts aren't loading, check **Network Access** in your Atlas project — the connecting IP (your dev machine, or your deploy platform's IPs) must be in the allow list. For serverless deploys with dynamic IPs (Vercel, etc.), allow-listing `0.0.0.0/0` and relying on the username/password is the normal approach.

## Writing a post

1. Go to `/admin` and sign in with `ADMIN_PASSWORD`.
2. Click **New post**. Fill in the title, date, category, tags, cover image URL, and the body as MDX/Markdown — headings, lists, blockquotes, images, and fenced code blocks all render with syntax highlighting.
3. Check **Draft** to save without publishing, or leave it unchecked to publish immediately.
4. Publish. The homepage's Featured Post and Latest Posts, the category chips, `/blog` search and filters, and related posts all update immediately — no redeploy needed.

Slugs are generated from the title automatically (and de-duplicated if they collide); you can override one in the Slug field.

## Keep `/admin` private

- It's gated by `ADMIN_PASSWORD` (checked in `middleware.ts` via a signed session cookie) — not linked from any nav, and disallowed in `robots.txt`.
- Nothing about it depends on user accounts; it's a single shared secret, meant for one person.
- If you ever suspect the password leaked, just change `ADMIN_PASSWORD` in `.env.local` — every existing session cookie is invalidated the moment you also rotate `ADMIN_SESSION_SECRET`.

## Site identity — `site.config.ts`

Your name, role, bio, avatar, socials, and Giscus/newsletter settings live here. Every field is wired to hide or fall back gracefully while empty — fill them in whenever you're ready, nothing here is faked in the meantime.

### Comments (optional)

1. Enable Discussions on a public GitHub repo.
2. Install the [giscus app](https://github.com/apps/giscus) on that repo.
3. Get your repo/category IDs from [giscus.app](https://giscus.app).
4. Fill in `site.giscus` in `site.config.ts`.

The Comments section stays hidden on every post until all four values are set.

### Newsletter (optional)

The newsletter form ships disabled with an honest "not connected yet" note. Wire up a provider (Buttondown, ConvertKit, Mailchimp, etc.) in an API route, then set `site.newsletter.enabled = true`.

## Content system

All public-facing content functions live in `lib/blogs.ts` and read from MongoDB — every function is safe against an unconfigured or unreachable database (returns `[]`/`null`, never throws, and fails fast rather than hanging a request):

| Function | Purpose |
|---|---|
| `getAllPosts()` | All published posts, newest first |
| `getPostBySlug(slug)` | Full post with body + headings |
| `getFeaturedPost()` | Explicit `featured: true` post, else the newest, else `null` |
| `getLatestPosts(limit)` | Most recent N posts |
| `getCategories()` | Categories derived from real posts, with counts |
| `getRelatedPosts(slug, limit)` | Scored by shared category/tags |
| `getAdjacentPosts(slug)` | Previous/next post |
| `searchPosts(query, opts)` | Search across title, description, category, tags |
| `getSearchIndex()` | Lightweight index for the client search dialog |

Admin-only CRUD (including drafts) lives separately in `lib/admin-posts.ts`, used only by the Server Actions under `app/admin/`.

## Scripts

```bash
npm run dev        # local dev server
npm run build       # production build
npm run start        # serve the production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
```
