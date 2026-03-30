# Developer Customization Guide

Advanced customization instructions for developers and system integrators.

## Quick Reference

- **Content Storage:** `/data/content.json` (single source of truth)
- **Main Script:** `/index.js` (handles content loading)
- **Admin Logic:** `/admin/admin.js` (form handling & export)
- **Styling:** `/styles.css` (1600+ lines of production CSS)

---

## 1. Changing the Admin Password

### Default Password: `admin123`

**To change it:**

1. Open `/admin/admin.js`
2. Find line 4:
   ```javascript
   const ADMIN_PASSWORD = "admin123";
   ```
3. Replace with your password:
   ```javascript
   const ADMIN_PASSWORD = "yournewpassword";
   ```
4. Save and deploy

**For better security:**

```javascript
// Use a hashed password instead (bcrypt hash or similar)
const ADMIN_PASSWORD_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeJhPpJzNYk...";
```

---

## 2. Customizing Colors & Brand

### Color Scheme

Edit CSS variables in `/styles.css` (lines 1-12):

```css
:root {
  --red: #e8261a; /* Primary brand color */
  --red2: #ff3b2e; /* Hover/secondary red */
  --dark: #111318; /* Text color - dark */
  --body: #2c3142; /* Body text color */
  --muted: #6b7280; /* Subtitle/muted text */
  --border: #e5e7eb; /* Border color */
  --surface: #f8f9fa; /* Background color */
  --white: #ffffff; /* Pure white */
  --wa: #25d366; /* WhatsApp green */
  --wa2: #1da851; /* WhatsApp dark green */
}
```

### Update Brand Color Globally

```css
/* Change primary red throughout entire site */
:root {
  --red: #1f2937; /* New primary color */
  --red2: #374151; /* New hover color */
}
```

### Custom Gradients

```css
/* Hero section gradient */
.hero {
  background: linear-gradient(135deg, var(--red) 0%, var(--red2) 100%);
}
```

---

## 3. Changing Fonts

### Current Font: Plus Jakarta Sans (Google Fonts)

**To use a different font:**

1. Open `/index.html` (line ~8)
2. Replace Google Fonts link:

   ```html
   <!-- Current -->
   <link
     href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
     rel="stylesheet"
   />

   <!-- New Example: Inter -->
   <link
     href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
     rel="stylesheet"
   />
   ```

3. Update CSS in `/styles.css` (line 20):

   ```css
   body {
     font-family: "Inter", sans-serif; /* Changed from Plus Jakarta Sans */
   }
   ```

4. Update admin CSS in `/admin/index.html` (line ~38):
   ```css
   body {
     font-family: "Inter", sans-serif;
   }
   ```

---

## 4. Modifying Page Sections

### Structure

Each section follows a pattern in `index.html`:

```html
<section id="programs" class="section section-alt">
  <div class="section-inner">
    <div class="fade">
      <div class="eyebrow" id="sec-prog-eyebrow">EYEBROW TEXT</div>
    </div>
    <h2 class="section-title fade" id="sec-prog-title">TITLE TEXT</h2>
    <p class="section-sub fade" id="sec-prog-sub">SUBTITLE TEXT</p>

    <!-- Section content here -->
  </div>
</section>
```

### Renaming a Section

1. Change section ID: `id="programs"` → `id="my-section"`
2. Update element IDs: `sec-prog-*` → `sec-mysec-*`
3. Update JSON keys in `data/content.json`
4. Update element IDs in `index.js`

### Adding a New Section

Add this structure to `index.html`:

```html
<section id="new-section" class="section">
  <div class="section-inner">
    <div class="fade">
      <div class="eyebrow" id="sec-new-eyebrow">Eyebrow</div>
    </div>
    <h2 class="section-title fade" id="sec-new-title">Title</h2>
    <p class="section-sub fade" id="sec-new-sub">Subtitle</p>

    <!-- Your content -->
  </div>
</section>
```

Then in `data/content.json`, add:

```json
"new-section": {
  "eyebrow": "Eyebrow",
  "title": "Title",
  "subtitle": "Subtitle"
}
```

Then in `index.js`, add in `updatePageContent()`:

```javascript
if (siteData.sections.newSection) {
  document.getElementById("sec-new-eyebrow").textContent =
    siteData.sections.newSection.eyebrow;
  document.getElementById("sec-new-title").textContent =
    siteData.sections.newSection.title;
  document.getElementById("sec-new-sub").textContent =
    siteData.sections.newSection.subtitle;
}
```

---

## 5. Database Integration

To integrate with a backend database:

### Option A: Firebase Realtime Database

```javascript
// In index.js, replace fetch with Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/latest/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/latest/firebase-database.js";

const firebaseConfig = {
  /* your config */
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function loadContent() {
  const snapshot = await get(ref(db, "gym-content"));
  siteData = snapshot.val();
  updatePageContent();
}
```

### Option B: Custom REST API

```javascript
// Replace fetch call in index.js
async function loadContent() {
  try {
    // Instead of local JSON
    // const response = await fetch('./data/content.json');

    // Use your API
    const response = await fetch("https://api.yourserver.com/content/gym-id");
    siteData = await response.json();
    updatePageContent();
  } catch (error) {
    console.error("Error loading content:", error);
  }
}
```

### Option C: WordPress Integration

Create a WordPress endpoint that returns JSON:

```php
// In WordPress functions.php
add_action('rest_api_init', function() {
  register_rest_route('gym/v1', '/content', array(
    'methods' => 'GET',
    'callback' => 'get_gym_content',
    'permission_callback' => '__return_true'
  ));
});

function get_gym_content() {
  return array(
    'site' => array('name' => get_bloginfo('name')),
    'seo' => array('pageTitle' => get_the_title()),
    // ... rest of structure
  );
}
```

Then update index.js:

```javascript
const response = await fetch("https://yoursite.com/wp-json/gym/v1/content");
```

---

## 6. Adding Authentication to Admin Panel

### Option A: Simple Token Encryption

```javascript
// admin.js - Enhanced security
function hashPassword(password) {
  return btoa(password)
    .match(/.{1,4}/g)
    .reverse()
    .join("");
}

const CORRECT_HASH = hashPassword("yourpassword");

function handleLogin(event) {
  const userInput = hashPassword(event.target.password.value);
  if (userInput === CORRECT_HASH) {
    // Login success
  }
}
```

### Option B: OAuth (GitHub/Google)

```javascript
// Use github-oauth library
import { authorize } from "github-oauth.js";

async function handleLogin() {
  const token = await authorize({
    clientId: "your-client-id",
    clientSecret: "your-secret",
  });
  localStorage.setItem("authToken", token);
}
```

---

## 7. Custom API Endpoints

### Booking System

Create endpoint to receive form submissions:

```javascript
// In index.js, modify submitForm()
function submitForm(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    goal: formData.get("goal"),
  };

  // Send to your backend
  fetch("https://yourapi.com/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
```

### Content Sync to CRM

```javascript
// Auto-sync member inquiries to CRM
async function syncToCRM(booking) {
  await fetch("https://api.yourmailchimp.com/lists/add-member", {
    method: "POST",
    headers: { Authorization: "Bearer YOUR_API_KEY" },
    body: JSON.stringify({
      email: booking.email,
      name: booking.name,
      tags: ["gym-inquiry"],
    }),
  });
}
```

---

## 8. Performance Optimization

### Minification

```bash
# Minify CSS
npx cleancss styles.css -o styles.min.css

# Minify JavaScript
npx uglifyjs index.js -o index.min.js
```

### Image Optimization

Replace Unsplash placeholder images:

```html
<!-- Before: External image -->
<img src="https://images.unsplash.com/photo-1...?w=400&q=80" />

<!-- After: Local optimized image -->
<img src="/images/gallery-1.webp" loading="lazy" />
```

### Caching

```html
<!-- In index.html head -->
<meta http-equiv="Cache-Control" content="max-age=86400" />
```

### CDN Deployment

Deploy static assets to CDN (Cloudflare, AWS CloudFront):

```javascript
// Update asset CDN paths
const CDN_URL = "https://cdn.example.com/gym-site/";

// Load images from CDN
document.querySelector("img").src = CDN_URL + "images/hero.jpg";
```

---

## 9. Multi-Language Support

### Add i18n

```javascript
// translations.js
const translations = {
  en: {
    "hero.title": "Premium Fitness Centre",
    "hero.subtitle": "Join our community...",
  },
  es: {
    "hero.title": "Centro de Fitness Premium",
    "hero.subtitle": "Únete a nuestra comunidad...",
  },
};

function translate(key, lang = "en") {
  return translations[lang][key] || key;
}
```

### Update HTML

```html
<h1 data-i18n="hero.title">Premium Fitness Centre</h1>
```

---

## 10. Analytics Integration

### Google Analytics 4

```html
<!-- In index.html head -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Track Form Submissions

```javascript
function submitForm(e) {
  e.preventDefault();

  // Track event
  gtag("event", "form_submission", {
    gym_name: siteData.site.name,
    form_type: "free_trial",
  });

  // ... rest of form logic
}
```

### Track WhatsApp Clicks

```javascript
// In updateWhatsAppLinks()
document.querySelectorAll(".btn-book").forEach((btn) => {
  btn.addEventListener("click", () => {
    gtag("event", "whatsapp_click", {
      plan: btn.dataset.plan || "unknown",
    });
  });
});
```

---

## 11. Automated Backups

### GitHub Actions

```yaml
# .github/workflows/backup.yml
name: Auto Backup

on:
  schedule:
    - cron: "0 0 * * *" # Daily at midnight

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Backup content.json
        run: |
          cp data/content.json backups/content-$(date +%Y%m%d).json
      - name: Commit backup
        run: |
          git config user.name "Backup Bot"
          git add backups/
          git commit -m "Auto backup $(date)"
          git push
```

---

## 12. Testing

### Unit Tests (Jest)

```javascript
// content.test.js
describe("Content Loading", () => {
  test("loads JSON correctly", async () => {
    const data = await fetch("./data/content.json");
    expect(data.site.name).toBe("SKY FITNESS");
  });
});
```

### E2E Tests (Cypress)

```javascript
// cypress/e2e/booking.cy.js
describe("Booking Flow", () => {
  it("submits booking form", () => {
    cy.visit("/");
    cy.get('input[name="name"]').type("John Doe");
    cy.get("button.btn-submit").click();
    cy.contains("Got it!").should("be.visible");
  });
});
```

---

## Common Modification Checklist

When customizing for a new client:

- [ ] Update `site.name`, `site.phone`, `site.email` in JSON
- [ ] Update `seo.pageTitle` and `metaDescription`
- [ ] Update hero stats and content
- [ ] Update all section titles and descriptions
- [ ] Update pricing plans if different
- [ ] Change CSS primary color (--red variables)
- [ ] Update admin password
- [ ] Test on mobile and desktop
- [ ] Create backup of original before deployment
- [ ] Deploy to production

---

## Need Help?

- **Schema Issues:** See [SCHEMA.md](./SCHEMA.md)
- **Deployment:** See [README.md](./README.md)
- **Features:** See [PRODUCT.md](./PRODUCT.md)

---

**Last Updated:** 2025  
**For:** Developers & System Integrators
