# Security Guide

## Current Security Model

This project is safe for production as a static public website when you treat `/admin/` as a private editing tool, not a live public CMS.

## Recommended Deployment Pattern

### Public

Deploy:

- `index.html`
- `styles.css`
- `index.js`
- `data/content.json`

### Private

Keep private when possible:

- `admin/index.html`
- `admin/admin.js`

## Why This Model Is Safer

- The live site is static and has no writable public backend
- The admin is intended for local/private use only
- On public hosts, the current admin disables editing
- Publishing happens by replacing `data/content.json`

## Practical Security Rule

Do not treat `/admin/` as internet-facing authenticated software.

Treat it as:

- a local content editor
- a client handoff editor
- a private internal publishing tool

## Production Checklist

- Use HTTPS
- Prefer not deploying `/admin/`
- Back up `data/content.json`
- Restrict server access to trusted deployers
- Validate JSON before publishing

## If You Must Keep `/admin/` on the Server

- Do not link to it publicly
- Keep editing private and local when possible
- Consider blocking it with Nginx basic auth or IP allowlisting
- Remember the supported publishing model is still export plus deploy

## Optional Nginx Hardening for `/admin/`

If you still upload `/admin/`, you can block public access like this:

```nginx
location /admin/ {
    deny all;
    return 403;
}
```

Or protect by IP:

```nginx
location /admin/ {
    allow YOUR.IP.ADDRESS.HERE;
    deny all;
}
```

## Bottom Line

Public website: yes.

Public live admin: no.

Private editor plus controlled publishing: yes, and that is the intended safe workflow for this codebase.
