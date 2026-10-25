# Cloudflare Pages — company site (versacarte.com)

Deploy the VersaCarte **app & web studio** site from `sites/company/`.

| Host | This project |
|------|----------------|
| `versacarte.com` | Yes |
| `www.versacarte.com` | Same project (Pages handles www redirect) |

Related: [DOMAINS.md](../../DOMAINS.md) · Help center: `sites/help/` → `help.versacarte.com`

---

## What’s configured

| Item | Location |
|------|----------|
| Build output | `dist/` via `npm run build` |
| Contact API | `functions/api/contact.ts` → `POST /api/contact` |
| Cache headers | `public/_headers` |
| Node version | `.node-version` → `22` |
| Wrangler project | `wrangler.toml` → **versacarte-company** (Worker + static assets) |
| Deploy command | `npx wrangler deploy` |
| Local secrets | `.dev.vars.example` → copy to `.dev.vars` |
| Sitemap | Auto via `@astrojs/sitemap` |
| Help page | `/help` → links to `help.versacarte.com` |

---

## 1. Web3Forms key (contact form)

1. [web3forms.com](https://web3forms.com) → create access key for **hello@versacarte.com**
2. Store as **Secret** in Cloudflare (never commit to Git)

---

## 2. Workers Builds (Git)

Deploy with Workers Builds. `npx wrangler deploy` publishes the Worker in `wrangler.toml` and the static files in `dist/`. `pages_build_output_dir` makes that command fail with “Missing entry-point to Worker script”.

1. [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → the **versacarte-company** Worker → **Settings** → **Builds**
2. Build settings:

   | Field | Value |
   |-------|-------|
   | **Production branch** | `main` |
   | **Build command** | `npm run build` |
   | **Deploy command** | `npx wrangler deploy` |

3. **Variables and secrets** (repo has `wrangler.toml`). Secrets already stored on a Pages project are not copied to this Worker.

   | Name | Where | Type |
   |------|-------|------|
   | `CONTACT_FROM` | `wrangler.toml` `[vars]` | Plaintext ✓ |
   | `WEB3FORMS_ACCESS_KEY` | Dashboard only | **Secret** |

   **Dashboard:** versacarte-company → **Settings** → **Variables and Secrets** → Add **Secret** → `WEB3FORMS_ACCESS_KEY`

   **CLI:**
   ```bash
   cd sites/company
   npx wrangler secret put WEB3FORMS_ACCESS_KEY
   ```

4. **Save and Deploy**

---

## 3. Custom domains

1. Worker **versacarte-company** → **Domains & Routes** → add **`versacarte.com`** and **`www.versacarte.com`**
2. **SSL/TLS** → **Full (strict)** + **Always Use HTTPS**

DNS (if not auto-configured):

| Record | Target |
|--------|--------|
| `versacarte.com` | Worker custom domain |
| `www` | Worker custom domain |

---

## 4. Help center (separate project)

The full help center lives at **`help.versacarte.com`** (`sites/help/`).

- Company site `/help` is a **gateway** with quick links
- Deploy help separately — see [`sites/help/CLOUDFLARE.md`](../help/CLOUDFLARE.md)

---

## 5. Local testing (with Functions)

```bash
cd sites/company
cp .dev.vars.example .dev.vars   # add WEB3FORMS_ACCESS_KEY
npm install
npm run cf:preview               # http://localhost:8788
```

> `npm run dev` / `npm run preview` do **not** run Cloudflare Functions.

---

## 6. Manual deploy (CLI)

```bash
cd sites/company
npx wrangler login
npm run cf:deploy
```

---

## 7. Post-deploy checklist

- [ ] `https://versacarte.com` loads
- [ ] `https://www.versacarte.com` redirects to apex
- [ ] `/contact` form sends email
- [ ] `/help` links open `help.versacarte.com` articles
- [ ] `https://versacarte.com/sitemap-index.xml` exists
- [ ] `WEB3FORMS_ACCESS_KEY` set for **Production** (and Preview if needed)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing entry-point to Worker script or to assets directory` | Keep the deploy command as `npx wrangler deploy`. `wrangler.toml` needs `main` and `[assets] directory = "./dist"`. Do not set `pages_build_output_dir`. |
| `ENOENT: no such file or directory, open '.../package.json'` | See **Build fails with ENOENT** below |
| Build fails on Node | Ensure `.node-version` is `22` or set `NODE_VERSION=22` in Pages |
| Contact form 503 | Add `WEB3FORMS_ACCESS_KEY` secret, redeploy |
| 404 on `/api/contact` | Commit `functions/api/contact.ts`, redeploy |
| Wrong site builds | Set **Root directory** to `sites/company` |

### Build fails with ENOENT (`package.json`)

Cloudflare runs `npm run build` from the **Root directory** you set in the dashboard — not always the repo root.

| Root directory in Cloudflare | Which `package.json` is used |
|------------------------------|--------------------------------|
| *(empty)* or `/` | Repo root → builds **portfolio** (`owner.versacarte.com`) |
| `sites/company` | Company site → builds **versacarte.com** |

**For versacarte-company:**

1. **Push `sites/company/` to GitHub** — the whole folder must be committed (it is not optional). Root `package.json` alone does not include the company site.
2. Pages → **versacarte-company** → **Settings** → **Build** → set **Root directory** to `sites/company`
3. **Build command:** `npm run build`
4. **Build output directory:** `dist`

If Root directory is `sites/company` but that folder is missing from GitHub, the build fails even though repo root has a `package.json`.
