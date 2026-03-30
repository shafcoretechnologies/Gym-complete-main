# SKY FITNESS - Static Gym Website with Private Content Editor

Reusable gym website built with plain HTML, CSS, and JavaScript.

The public website is production-ready as a static site. The `/admin/` area is designed for private, local editing only. The safe workflow is:

1. Edit content locally in `/admin/`
2. Export a fresh `content.json`
3. Deploy that JSON to the live site

## What This Project Is

- Static marketing website for gyms and fitness studios
- Private admin editor for content updates
- JSON-based content storage
- WhatsApp-driven lead capture
- White-label friendly for client work

## What This Project Is Not

- Not a live public CMS
- Not multi-user backend software
- Not a server-authenticated admin dashboard

## Project Structure

```text
gym-website/
├── index.html
├── styles.css
├── index.js
├── data/
│   └── content.json
├── admin/
│   ├── index.html
│   └── admin.js
├── CLIENT_HANDOFF.md
├── PRODUCT.md
├── SCHEMA.md
├── SECURITY.md
└── DEVELOPER.md
```

## Production Model

### Public Site

Host these in production:

- `index.html`
- `styles.css`
- `index.js`
- `data/content.json`

### Private Editor

Keep these private and off production when possible:

- `admin/index.html`
- `admin/admin.js`

If you keep `/admin/` on the server for convenience, the current code disables editing on public hosts and is meant only for local/private use.

## Editing Workflow

### Option A: Local Admin Editor

1. Open `/admin/index.html` locally or on `localhost`
2. Edit the allowed content fields
3. Click `Export JSON`
4. Replace `data/content.json` on the live server
5. Reload the website

### Option B: Direct JSON Editing

1. Open `data/content.json`
2. Edit the content directly
3. Upload the updated file to the server
4. Reload the website

## What Can Be Edited in Admin

- Site name
- Tagline
- Phone and display phone
- Email
- Address and location
- Opening timings
- Hero badge, title, subtitle, CTA
- Hero stats
- Section titles and subtitles
- Pricing amounts and notes
- Footer copyright

## What Is Intentionally Locked in Admin

These fields are kept out of the admin to reduce accidental SEO or trust damage:

- SEO page title
- Meta description
- Site description
- Footer attribution / credit link

Those values still exist in `data/content.json` and can be changed manually if needed by the developer.

## Client Handoff Workflow

Use this if you want clients to have editing access without exposing a live public CMS:

1. Give the client the private admin package or remote access to a local/staging machine
2. Let them edit content in `/admin/`
3. Export `content.json`
4. Send the exported JSON back to you, or upload it through your internal deployment flow
5. Publish the updated `data/content.json` to the live site

There is a polished client version of this guide in [CLIENT_HANDOFF.md](./CLIENT_HANDOFF.md).

## VPS Deployment for `gym.shopinmysore.in`

If you already have another app on the same VPS, the clean setup is to host this project as a second Nginx server block using the subdomain `gym.shopinmysore.in`.

### 1. Upload the site files

Recommended target:

```bash
/var/www/gym.shopinmysore.in/
```

Upload:

- `index.html`
- `styles.css`
- `index.js`
- `data/content.json`

Optional private-only upload:

- `admin/`

### 2. Create an Nginx site config

Example:

```nginx
server {
    server_name gym.shopinmysore.in;

    root /var/www/gym.shopinmysore.in;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /data/ {
        add_header Cache-Control "no-cache";
    }
}
```

### 3. Enable the config

Typical Ubuntu flow:

```bash
sudo nano /etc/nginx/sites-available/gym.shopinmysore.in
sudo ln -s /etc/nginx/sites-available/gym.shopinmysore.in /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Point DNS

Create an `A` record:

- Host: `gym`
- Value: `YOUR_VPS_IP`

This makes `gym.shopinmysore.in` resolve to your VPS.

### 5. Add SSL

If you use Certbot:

```bash
sudo certbot --nginx -d gym.shopinmysore.in
```

### 6. Publish updates later

For future changes, replace:

```bash
/var/www/gym.shopinmysore.in/data/content.json
```

Then reload Nginx only if needed.

## Recommended Production Checklist

- Use HTTPS
- Keep `/admin/` private or undeployed
- Back up `data/content.json`
- Hard refresh after content updates if CDN/browser cache is sticky
- Replace placeholder imagery if needed
- Validate JSON before uploading

## Troubleshooting

### Content not updating

- Check that the new `data/content.json` was uploaded
- Hard refresh the browser
- Validate JSON syntax

### Admin editing disabled

- Open `/admin/` locally
- Use `file://`, `localhost`, or `127.0.0.1`

### WhatsApp links wrong

- Check `site.phone` in `data/content.json`
- Use country code without `+`

## Docs

- [CLIENT_HANDOFF.md](./CLIENT_HANDOFF.md)
- [PRODUCT.md](./PRODUCT.md)
- [SCHEMA.md](./SCHEMA.md)
- [SECURITY.md](./SECURITY.md)
- [DEVELOPER.md](./DEVELOPER.md)
