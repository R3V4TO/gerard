# VersaCarte company site

App & web development studio at **versacarte.com**.

| Host | This project |
|------|----------------|
| `versacarte.com` | Yes |
| `www.versacarte.com` | Same deploy |

## Commands

```bash
cd sites/company
npm install
npm run dev
npm run build
npm run cf:preview   # static + /api/contact and /api/subscribe locally
npm run cf:deploy    # Cloudflare project: versacarte-company
```

## Deploy

Full checklist: **[CLOUDFLARE.md](./CLOUDFLARE.md)**

| Workers Builds setting | Value |
|------------------------|-------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Assets | `dist` (set in `wrangler.toml`) |
| Secret | `WEB3FORMS_ACCESS_KEY` (required), `RESEND_API_KEY` (optional, sends guide by email) |

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Studio home |
| `/services` | Service lines |
| `/work` | Product case studies |
| `/about` | Studio background |
| `/contact` | Inquiry form → `/api/contact` |
| `/guide/web-app-vs-mobile` | Free planning guide (web vs mobile) |
| `/help` | Help gateway → [help.versacarte.com](https://help.versacarte.com) |
| `/labs` | Link to Labs |

## Related sites

| Site | Folder | Domain |
|------|--------|--------|
| Help center | `sites/help` | help.versacarte.com |
| Labs | `sites/home` | labs.versacarte.com |
| Portfolio | repo root | owner.versacarte.com |

See [DOMAINS.md](../../DOMAINS.md).
