# JSON Content Schema Documentation

Complete reference for the `data/content.json` file structure used by SKY FITNESS CMS.

## Root Structure

```json
{
  "site": { ... },
  "seo": { ... },
  "hero": { ... },
  "contact": { ... },
  "sections": { ... },
  "pricing": [ ... ],
  "footer": { ... }
}
```

---

## 1. `site` Object

Core site information and branding.

```json
"site": {
  "name": "SKY FITNESS",
  "tagline": "Premium Fitness Centre",
  "description": "Modern equipment, expert coaches, flexible timings. Join 500+ members transforming their health.",
  "phone": "919066434725",
  "phoneDisplay": "+91 90664 34725",
  "email": "info@skyfitness.com"
}
```

| Field          | Type   | Purpose                                  | Example                  |
| -------------- | ------ | ---------------------------------------- | ------------------------ |
| `name`         | string | Gym brand name (navbar, footer, title)   | "SKY FITNESS"            |
| `tagline`      | string | Short tagline (admin panel, branding)    | "Premium Fitness Centre" |
| `description`  | string | Site description (admin use, SEO backup) | "Modern equipment..."    |
| `phone`        | string | WhatsApp number (country code, no +/-)   | "919066434725"           |
| `phoneDisplay` | string | Formatted phone for display              | "+91 90664 34725"        |
| `email`        | string | Contact email address                    | "info@skyfitness.com"    |

---

## 2. `seo` Object

Search engine optimization metadata.

```json
"seo": {
  "pageTitle": "SKY FITNESS Gym — NR Mohalla, Mysore's Premium Fitness Centre",
  "metaDescription": "Modern equipment, expert coaches, flexible timings. Join 500+ members at SKY FITNESS. Free trial available."
}
```

| Field             | Type   | Max Length | Purpose                     | Rendered As                 |
| ----------------- | ------ | ---------- | --------------------------- | --------------------------- |
| `pageTitle`       | string | 60 chars   | Browser tab title + SEO     | `<title>` tag               |
| `metaDescription` | string | 160 chars  | Search result snippet + SEO | `<meta name="description">` |

**Best Practices:**

- Keep pageTitle under 60 characters
- Include main keyword + location + USP
- Keep metaDescription under 160 characters
- Write for humans, not bots

---

## 3. `hero` Object

Large hero banner/header section.

```json
"hero": {
  "badge": "Shivaji Road, NR Mohalla",
  "title": "Mysore's Premium Fitness Centre",
  "subtitle": "Modern equipment, expert coaches, flexible timings. Join 500+ members already transforming their health at SKY FITNESS.",
  "cta": "Start Free Trial",
  "stats": [
    { "number": "500+", "label": "Members" },
    { "number": "8+", "label": "Trainers" },
    { "number": "5:00 AM", "label": "Opens Daily" },
    { "number": "3 yrs", "label": "In Mysore" }
  ]
}
```

| Field      | Type          | Purpose                                   | Notes                      |
| ---------- | ------------- | ----------------------------------------- | -------------------------- |
| `badge`    | string        | Small text above title (location/tagline) | Shows on desktop only      |
| `title`    | string        | Large headline (150 chars max)            | Main message               |
| `subtitle` | string        | Supporting text (500 chars max)           | Detailed description       |
| `cta`      | string        | Call-to-action button text                | Used in WhatsApp link      |
| `stats`    | array[object] | Key statistics (must be exactly 4)        | Displays in row below hero |

**Stats Array Format:**

```json
"stats": [
  { "number": "VALUE", "label": "LABEL" },
  { "number": "VALUE", "label": "LABEL" },
  { "number": "VALUE", "label": "LABEL" },
  { "number": "VALUE", "label": "LABEL" }
]
```

| Stat Position | Typical Content   | Example   |
| ------------- | ----------------- | --------- |
| Stat 1        | Member count      | "500+"    |
| Stat 2        | Trainer count     | "8+"      |
| Stat 3        | Opening time      | "5:00 AM" |
| Stat 4        | Years in business | "3 yrs"   |

---

## 4. `contact` Object

Office location and operating hours.

```json
"contact": {
  "address": "#544 Shivaji Road, NR Mohalla, Mysore — 570007",
  "location": "NR Mohalla, Shivaji Road, Mysore",
  "timings": {
    "weekdays": "5:00 AM – 10:00 PM",
    "weekend": "6:00 AM – 8:00 PM"
  },
  "startingPrice": "₹999"
}
```

| Field              | Type   | Purpose                       | Used In                                  |
| ------------------ | ------ | ----------------------------- | ---------------------------------------- |
| `address`          | string | Full address with postal code | Contact section                          |
| `location`         | string | Short location (city/area)    | Info bar, hero badge option              |
| `timings.weekdays` | string | Mon-Sat hours                 | Info bar, footer timing, contact section |
| `timings.weekend`  | string | Sunday hours                  | Info bar, footer timing, contact section |
| `startingPrice`    | string | Lowest membership price       | Info bar display                         |

**Time Format Examples:**

- `"5:00 AM – 10:00 PM"` ✅
- `"5 AM - 10 PM"` ✅
- `"05:00 - 22:00"` ✅

---

## 5. `sections` Object

Text content for all major sections (titles & descriptions).

```json
"sections": {
  "programs": {
    "eyebrow": "What we offer",
    "title": "Programs for every goal",
    "subtitle": "Whether you want to lose weight, build muscle, or just stay active — we have a class for you."
  },
  "schedule": {
    "eyebrow": "Timetable",
    "title": "Class schedule",
    "subtitle": "Tap any class to book your spot instantly on WhatsApp."
  },
  "trainers": {
    "eyebrow": "The team",
    "title": "Your coaches",
    "subtitle": "Certified trainers with real results. Chat with any trainer directly on WhatsApp."
  },
  "pricing": {
    "eyebrow": "Memberships",
    "title": "Simple, clear pricing",
    "subtitle": "No hidden charges. No joining fees. First trial session is completely free."
  },
  "gallery": {
    "eyebrow": "The facility",
    "title": "See inside SKY FITNESS"
  },
  "testimonials": {
    "eyebrow": "Member stories",
    "title": "What our members say"
  },
  "contact": {
    "eyebrow": "Get in touch",
    "title": "Visit us or Chat on WhatsApp",
    "subtitle": "The fastest way to join is WhatsApp. Send us a message and we'll reply within minutes — not hours."
  }
}
```

### Section Structure

Each section has up to 3 fields:

| Field      | Type   | Length        | Purpose                 | Required |
| ---------- | ------ | ------------- | ----------------------- | -------- |
| `eyebrow`  | string | 20-30 chars   | Small label above title | Yes      |
| `title`    | string | 40-60 chars   | Main section title      | Yes      |
| `subtitle` | string | 100-200 chars | Descriptive text        | No\*     |

\*Gallery section doesn't have a subtitle (optional for other sections too)

### Eyebrow Design Pattern

The "eyebrow" is a small uppercase label that appears above each section's main title. Examples:

- "What we offer" for Programs
- "The team" for Trainers
- "Memberships" for Pricing
- "Get in touch" for Contact

---

## 6. `pricing` Array

Membership plans (direct array, not nested under "plans").

```json
"pricing": [
  {
    "id": "basic",
    "name": "Basic",
    "price": 999,
    "note": "Gym floor only · No lock-in"
  },
  {
    "id": "elite",
    "name": "Elite",
    "price": 1799,
    "note": "All classes included · Best value",
    "popular": true
  },
  {
    "id": "champion",
    "name": "Champion",
    "price": 2999,
    "note": "Full access + personal coaching"
  }
]
```

### Pricing Plan Structure

| Field     | Type    | Constraints       | Purpose                      | Rendered As                              |
| --------- | ------- | ----------------- | ---------------------------- | ---------------------------------------- |
| `id`      | string  | Unique, lowercase | Unique plan identifier       | HTML element ID (pricing-{id}-name, etc) |
| `name`    | string  | 15 chars max      | Plan display name            | Card title                               |
| `price`   | number  | 0-999999          | Price in INR (no currency)   | Card price display                       |
| `note`    | string  | 50 chars max      | Plan description/features    | Card subtitle                            |
| `popular` | boolean | Optional          | Highlights as "Most Popular" | Visual badge on card                     |

### Important Rules:

- Array must contain exactly 3 plans (basic, elite, champion in order)
- IDs must match: `basic`, `elite`, `champion`
- Prices are numbers (no ₹ symbol needed)
- Use "popular: true" on the middle plan for best UX

---

## 7. `footer` Object

Footer branding and legal information.

```json
"footer": {
  "copyright": "© 2025 SKY FITNESS. All rights reserved.",
  "credit": "Built with Shafcore CMS"
}
```

| Field       | Type   | Purpose              | Rendered As                      |
| ----------- | ------ | -------------------- | -------------------------------- |
| `copyright` | string | Legal copyright text | Left side of footer              |
| `credit`    | string | Attribution/credits  | Right side of footer (with link) |

---

## Complete Schema Validation

Use this JSON schema for validation:

```json
{
  "site": {
    "name": "string (required)",
    "tagline": "string (optional)",
    "description": "string (optional)",
    "phone": "string (required, 10-12 digits)",
    "phoneDisplay": "string (required)",
    "email": "string (required, valid email)"
  },
  "seo": {
    "pageTitle": "string (required, 30-60 chars)",
    "metaDescription": "string (required, 100-160 chars)"
  },
  "hero": {
    "badge": "string (optional)",
    "title": "string (required)",
    "subtitle": "string (required)",
    "cta": "string (optional)",
    "stats": "array of {number, label} objects (exactly 4 items)"
  },
  "contact": {
    "address": "string (required)",
    "location": "string (optional)",
    "timings": {
      "weekdays": "string (required)",
      "weekend": "string (required)"
    },
    "startingPrice": "string (optional)"
  },
  "sections": "object with keys: programs, schedule, trainers, pricing, gallery, testimonials, contact",
  "pricing": "array of exactly 3 plan objects {id, name, price, note}",
  "footer": {
    "copyright": "string (required)",
    "credit": "string (required)"
  }
}
```

---

## Data Type Reference

| Type    | JavaScript | JSON       | Example             |
| ------- | ---------- | ---------- | ------------------- |
| String  | string     | "..."      | "SKY FITNESS"       |
| Number  | number     | 123        | 999, 8, 500         |
| Boolean | boolean    | true/false | true / false        |
| Array   | array      | [...]      | [{ }, { }]          |
| Object  | object     | {...}      | { "name": "value" } |
| Null    | null       | null       | null                |

---

## Common Editing Examples

### Updating Site Name

```json
// BEFORE
"site": { "name": "SKY FITNESS", ... }

// AFTER
"site": { "name": "POWER GYM", ... }
```

### Changing Pricing

```json
// BEFORE
{ "id": "basic", "name": "Basic", "price": 999, "note": "..." }

// AFTER
{ "id": "basic", "name": "Starter", "price": 899, "note": "..." }
```

### Updating Hours

```json
// BEFORE
"timings": {
  "weekdays": "5:00 AM – 10:00 PM",
  "weekend": "6:00 AM – 8:00 PM"
}

// AFTER
"timings": {
  "weekdays": "6:00 AM – 9:00 PM",
  "weekend": "8:00 AM – 6:00 PM"
}
```

--- ## Usage in HTML/JavaScript

All fields are dynamically injected during page load:

```javascript
// In index.js, data is fetched from content.json and populated as:
document.getElementById("siteName").textContent = siteData.site.name;
document.getElementById("pageTitle").textContent = siteData.seo.pageTitle;
document.getElementById("contactTimings").textContent =
  `${siteData.contact.timings.weekdays} · ${siteData.contact.timings.weekend}`;
```

---

## Troubleshooting

**JSON Parse Error?**

- Check for missing commas between fields
- Ensure all strings are in double quotes
- Validate at [jsonlint.com](https://www.jsonlint.com)

**Content Not Updating?**

- Clear browser cache (Ctrl+Shift+Delete)
- Make sure JSON has no syntax errors
- Check that field IDs match in HTML

**WhatsApp Numbers Not Working?**

- Use format: country code (91) + number (9066434725)
- No spaces, hyphens, or + symbol

---

**Last Updated:** 2025  
**Maintained By:** Shafcore CMS Team
