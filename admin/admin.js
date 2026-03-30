const STORAGE_KEY = "gymCmsDraft";
let currentData = {};
let editingEnabled = false;

function $(id) {
  return document.getElementById(id);
}

function isLocalEditingEnvironment() {
  const { protocol, hostname } = window.location;
  return (
    protocol === "file:" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}

function showStatus(message, type) {
  const statusEl = $("statusMessage");
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;

  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => {
    statusEl.className = "status-message";
  }, 5000);
}

function setEditingEnabled(enabled) {
  editingEnabled = enabled;
  $("adminForm").setAttribute("aria-disabled", String(!enabled));
  ["saveButton", "exportButton", "importButton", "resetButton"].forEach((id) => {
    $(id).disabled = !enabled;
  });
  $("environmentNotice").classList.toggle("show", !enabled);
}

function sanitizeText(value, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function sanitizePrice(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeStats(stats) {
  const fallback = [
    { number: "500+", label: "Members" },
    { number: "8+", label: "Trainers" },
    { number: "5:00 AM", label: "Opens Daily" },
    { number: "3 yrs", label: "In Business" },
  ];

  if (!Array.isArray(stats)) {
    return fallback;
  }

  return fallback.map((item, index) => ({
    number: sanitizeText(stats[index]?.number, item.number),
    label: sanitizeText(stats[index]?.label, item.label),
  }));
}

function buildDefaultData(source = {}) {
  const basicPrice = sanitizePrice(source.pricing?.[0]?.price, 999);
  const elitePrice = sanitizePrice(source.pricing?.[1]?.price, 1799);
  const championPrice = sanitizePrice(source.pricing?.[2]?.price, 2999);
  const lowestPrice = Math.min(basicPrice, elitePrice, championPrice);

  return {
    site: {
      name: sanitizeText(source.site?.name, "SKY FITNESS"),
      tagline: sanitizeText(source.site?.tagline, "Premium Fitness Centre"),
      description: sanitizeText(
        source.site?.description,
        "Modern equipment, expert coaches, flexible timings. Join our community of 500+ members transforming their health.",
      ),
      phone: sanitizeText(source.site?.phone, "919066434725"),
      phoneDisplay: sanitizeText(source.site?.phoneDisplay, "+91 90664 34725"),
      email: sanitizeText(source.site?.email, "info@skyfitness.com"),
    },
    seo: {
      pageTitle: sanitizeText(
        source.seo?.pageTitle,
        "SKY FITNESS Gym — NR Mohalla, Mysore's Premium Fitness Centre",
      ),
      metaDescription: sanitizeText(
        source.seo?.metaDescription,
        "Modern equipment, expert coaches, flexible timings. Join 500+ members at SKY FITNESS. Free trial available.",
      ),
    },
    hero: {
      badge: sanitizeText(source.hero?.badge, "Shivaji Road, NR Mohalla"),
      title: sanitizeText(source.hero?.title, "Mysore's Premium Fitness Centre"),
      subtitle: sanitizeText(
        source.hero?.subtitle,
        "Modern equipment, expert coaches, flexible timings. Join 500+ members already transforming their health at SKY FITNESS.",
      ),
      cta: sanitizeText(source.hero?.cta, "Start Free Trial"),
      stats: normalizeStats(source.hero?.stats),
    },
    contact: {
      address: sanitizeText(
        source.contact?.address,
        "#544 Shivaji Road, NR Mohalla, Mysore — 570007",
      ),
      location: sanitizeText(
        source.contact?.location,
        "NR Mohalla, Shivaji Road, Mysore",
      ),
      timings: {
        weekdays: sanitizeText(
          source.contact?.timings?.weekdays,
          "5:00 AM – 10:00 PM",
        ),
        weekend: sanitizeText(
          source.contact?.timings?.weekend,
          "6:00 AM – 8:00 PM",
        ),
      },
      startingPrice: sanitizeText(source.contact?.startingPrice, `₹${lowestPrice}`),
    },
    sections: {
      programs: {
        eyebrow: sanitizeText(source.sections?.programs?.eyebrow, "What we offer"),
        title: sanitizeText(source.sections?.programs?.title, "Programs for every goal"),
        subtitle: sanitizeText(
          source.sections?.programs?.subtitle,
          "Whether you want to lose weight, build muscle, or just stay active — we have a class for you.",
        ),
      },
      schedule: {
        eyebrow: sanitizeText(source.sections?.schedule?.eyebrow, "Timetable"),
        title: sanitizeText(source.sections?.schedule?.title, "Class schedule"),
        subtitle: sanitizeText(
          source.sections?.schedule?.subtitle,
          "Tap any class to book your spot instantly on WhatsApp.",
        ),
      },
      trainers: {
        eyebrow: sanitizeText(source.sections?.trainers?.eyebrow, "The team"),
        title: sanitizeText(source.sections?.trainers?.title, "Your coaches"),
        subtitle: sanitizeText(
          source.sections?.trainers?.subtitle,
          "Certified trainers with real results. Chat with any trainer directly on WhatsApp.",
        ),
      },
      pricing: {
        eyebrow: sanitizeText(source.sections?.pricing?.eyebrow, "Memberships"),
        title: sanitizeText(source.sections?.pricing?.title, "Simple, clear pricing"),
        subtitle: sanitizeText(
          source.sections?.pricing?.subtitle,
          "No hidden charges. No joining fees. First trial session is completely free.",
        ),
      },
      gallery: {
        eyebrow: sanitizeText(source.sections?.gallery?.eyebrow, "The facility"),
        title: sanitizeText(source.sections?.gallery?.title, "See inside SKY FITNESS"),
      },
      testimonials: {
        eyebrow: sanitizeText(
          source.sections?.testimonials?.eyebrow,
          "Member stories",
        ),
        title: sanitizeText(
          source.sections?.testimonials?.title,
          "What our members say",
        ),
      },
      contact: {
        eyebrow: sanitizeText(source.sections?.contact?.eyebrow, "Get in touch"),
        title: sanitizeText(
          source.sections?.contact?.title,
          "Visit us or Chat on WhatsApp",
        ),
        subtitle: sanitizeText(
          source.sections?.contact?.subtitle,
          "The fastest way to join is WhatsApp. Send us a message and we'll reply within minutes — not hours.",
        ),
      },
    },
    pricing: [
      {
        id: "basic",
        name: "Basic",
        price: basicPrice,
        note: sanitizeText(source.pricing?.[0]?.note, "Gym floor only · No lock-in"),
      },
      {
        id: "elite",
        name: "Elite",
        price: elitePrice,
        note: sanitizeText(source.pricing?.[1]?.note, "All classes included · Best value"),
        popular: true,
      },
      {
        id: "champion",
        name: "Champion",
        price: championPrice,
        note: sanitizeText(
          source.pricing?.[2]?.note,
          "Full access + personal coaching",
        ),
      },
    ],
    footer: {
      copyright: sanitizeText(
        source.footer?.copyright,
        "© 2025 SKY FITNESS. All rights reserved.",
      ),
      credit: sanitizeText(source.footer?.credit, "Built with Shafcore CMS"),
    },
  };
}

function populateForm() {
  const data = currentData;
  const stats = normalizeStats(data.hero?.stats);
  const pricingMap = Object.fromEntries(
    (Array.isArray(data.pricing) ? data.pricing : []).map((plan) => [plan.id, plan]),
  );

  $("siteName").value = data.site.name;
  $("tagline").value = data.site.tagline;
  $("phone").value = data.site.phone;
  $("phoneDisplay").value = data.site.phoneDisplay;
  $("email").value = data.site.email;
  $("address").value = data.contact.address;
  $("location").value = data.contact.location;
  $("timingsWeekdays").value = data.contact.timings.weekdays;
  $("timingsWeekend").value = data.contact.timings.weekend;

  $("heroBadge").value = data.hero.badge;
  $("heroTitle").value = data.hero.title;
  $("heroSub").value = data.hero.subtitle;
  $("heroCta").value = data.hero.cta;

  $("stat1Number").value = stats[0].number;
  $("stat1Label").value = stats[0].label;
  $("stat2Number").value = stats[1].number;
  $("stat2Label").value = stats[1].label;
  $("stat3Number").value = stats[2].number;
  $("stat3Label").value = stats[2].label;
  $("stat4Number").value = stats[3].number;
  $("stat4Label").value = stats[3].label;

  $("prog-eyebrow").value = data.sections.programs.eyebrow;
  $("prog-title").value = data.sections.programs.title;
  $("prog-sub").value = data.sections.programs.subtitle;
  $("sched-eyebrow").value = data.sections.schedule.eyebrow;
  $("sched-title").value = data.sections.schedule.title;
  $("sched-sub").value = data.sections.schedule.subtitle;
  $("train-eyebrow").value = data.sections.trainers.eyebrow;
  $("train-title").value = data.sections.trainers.title;
  $("train-sub").value = data.sections.trainers.subtitle;
  $("price-eyebrow").value = data.sections.pricing.eyebrow;
  $("price-title").value = data.sections.pricing.title;
  $("price-sub").value = data.sections.pricing.subtitle;
  $("gal-eyebrow").value = data.sections.gallery.eyebrow;
  $("gal-title").value = data.sections.gallery.title;
  $("testim-eyebrow").value = data.sections.testimonials.eyebrow;
  $("testim-title").value = data.sections.testimonials.title;
  $("contact-eyebrow").value = data.sections.contact.eyebrow;
  $("contact-title").value = data.sections.contact.title;
  $("contact-sub").value = data.sections.contact.subtitle;

  $("basic-price").value = pricingMap.basic?.price ?? 999;
  $("basic-note").value = pricingMap.basic?.note ?? "";
  $("elite-price").value = pricingMap.elite?.price ?? 1799;
  $("elite-note").value = pricingMap.elite?.note ?? "";
  $("champion-price").value = pricingMap.champion?.price ?? 2999;
  $("champion-note").value = pricingMap.champion?.note ?? "";

  $("copyright").value = data.footer.copyright;
}

function buildFormData() {
  const draft = buildDefaultData(currentData);
  const basicPrice = sanitizePrice($("basic-price").value, draft.pricing[0].price);
  const elitePrice = sanitizePrice($("elite-price").value, draft.pricing[1].price);
  const championPrice = sanitizePrice(
    $("champion-price").value,
    draft.pricing[2].price,
  );
  const lowestPrice = Math.min(basicPrice, elitePrice, championPrice);

  return {
    ...draft,
    site: {
      ...draft.site,
      name: sanitizeText($("siteName").value, draft.site.name),
      tagline: sanitizeText($("tagline").value, draft.site.tagline),
      phone: sanitizeText($("phone").value, draft.site.phone),
      phoneDisplay: sanitizeText($("phoneDisplay").value, draft.site.phoneDisplay),
      email: sanitizeText($("email").value, draft.site.email),
    },
    hero: {
      ...draft.hero,
      badge: sanitizeText($("heroBadge").value, draft.hero.badge),
      title: sanitizeText($("heroTitle").value, draft.hero.title),
      subtitle: sanitizeText($("heroSub").value, draft.hero.subtitle),
      cta: sanitizeText($("heroCta").value, draft.hero.cta),
      stats: [
        {
          number: sanitizeText($("stat1Number").value, draft.hero.stats[0].number),
          label: sanitizeText($("stat1Label").value, draft.hero.stats[0].label),
        },
        {
          number: sanitizeText($("stat2Number").value, draft.hero.stats[1].number),
          label: sanitizeText($("stat2Label").value, draft.hero.stats[1].label),
        },
        {
          number: sanitizeText($("stat3Number").value, draft.hero.stats[2].number),
          label: sanitizeText($("stat3Label").value, draft.hero.stats[2].label),
        },
        {
          number: sanitizeText($("stat4Number").value, draft.hero.stats[3].number),
          label: sanitizeText($("stat4Label").value, draft.hero.stats[3].label),
        },
      ],
    },
    contact: {
      ...draft.contact,
      address: sanitizeText($("address").value, draft.contact.address),
      location: sanitizeText($("location").value, draft.contact.location),
      timings: {
        weekdays: sanitizeText(
          $("timingsWeekdays").value,
          draft.contact.timings.weekdays,
        ),
        weekend: sanitizeText(
          $("timingsWeekend").value,
          draft.contact.timings.weekend,
        ),
      },
      startingPrice: `₹${lowestPrice}`,
    },
    sections: {
      programs: {
        eyebrow: sanitizeText(
          $("prog-eyebrow").value,
          draft.sections.programs.eyebrow,
        ),
        title: sanitizeText($("prog-title").value, draft.sections.programs.title),
        subtitle: sanitizeText(
          $("prog-sub").value,
          draft.sections.programs.subtitle,
        ),
      },
      schedule: {
        eyebrow: sanitizeText(
          $("sched-eyebrow").value,
          draft.sections.schedule.eyebrow,
        ),
        title: sanitizeText(
          $("sched-title").value,
          draft.sections.schedule.title,
        ),
        subtitle: sanitizeText(
          $("sched-sub").value,
          draft.sections.schedule.subtitle,
        ),
      },
      trainers: {
        eyebrow: sanitizeText(
          $("train-eyebrow").value,
          draft.sections.trainers.eyebrow,
        ),
        title: sanitizeText(
          $("train-title").value,
          draft.sections.trainers.title,
        ),
        subtitle: sanitizeText(
          $("train-sub").value,
          draft.sections.trainers.subtitle,
        ),
      },
      pricing: {
        eyebrow: sanitizeText(
          $("price-eyebrow").value,
          draft.sections.pricing.eyebrow,
        ),
        title: sanitizeText(
          $("price-title").value,
          draft.sections.pricing.title,
        ),
        subtitle: sanitizeText(
          $("price-sub").value,
          draft.sections.pricing.subtitle,
        ),
      },
      gallery: {
        eyebrow: sanitizeText(
          $("gal-eyebrow").value,
          draft.sections.gallery.eyebrow,
        ),
        title: sanitizeText($("gal-title").value, draft.sections.gallery.title),
      },
      testimonials: {
        eyebrow: sanitizeText(
          $("testim-eyebrow").value,
          draft.sections.testimonials.eyebrow,
        ),
        title: sanitizeText(
          $("testim-title").value,
          draft.sections.testimonials.title,
        ),
      },
      contact: {
        eyebrow: sanitizeText(
          $("contact-eyebrow").value,
          draft.sections.contact.eyebrow,
        ),
        title: sanitizeText(
          $("contact-title").value,
          draft.sections.contact.title,
        ),
        subtitle: sanitizeText(
          $("contact-sub").value,
          draft.sections.contact.subtitle,
        ),
      },
    },
    pricing: [
      {
        id: "basic",
        name: "Basic",
        price: basicPrice,
        note: sanitizeText($("basic-note").value, draft.pricing[0].note),
      },
      {
        id: "elite",
        name: "Elite",
        price: elitePrice,
        note: sanitizeText($("elite-note").value, draft.pricing[1].note),
        popular: true,
      },
      {
        id: "champion",
        name: "Champion",
        price: championPrice,
        note: sanitizeText($("champion-note").value, draft.pricing[2].note),
      },
    ],
    footer: {
      ...draft.footer,
      copyright: sanitizeText($("copyright").value, draft.footer.copyright),
    },
  };
}

function saveChanges() {
  if (!editingEnabled) return;

  currentData = buildFormData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  showStatus(
    "Draft saved locally. Export JSON when you are ready to deploy the change.",
    "success",
  );
}

function exportJSON() {
  if (!editingEnabled) return;

  saveChanges();

  const blob = new Blob([JSON.stringify(currentData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "content.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showStatus(
    "JSON exported. Replace /data/content.json in your deployment with this file.",
    "success",
  );
}

function importJSON(event) {
  if (!editingEnabled) return;

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (loadEvent) {
    try {
      const parsed = JSON.parse(loadEvent.target.result);
      currentData = buildDefaultData(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      populateForm();
      showStatus("JSON imported successfully.", "success");
    } catch (error) {
      showStatus("Invalid JSON file. Import was cancelled.", "error");
    }
  };

  reader.readAsText(file);
  event.target.value = "";
}

async function fetchSourceData() {
  const response = await fetch("../data/content.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load content.json (${response.status})`);
  }

  return response.json();
}

async function resetToDefault() {
  if (!editingEnabled) return;
  if (!window.confirm("Reset your local draft to the current content.json file?")) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  try {
    currentData = buildDefaultData(await fetchSourceData());
    populateForm();
    showStatus("Draft reset to the current content.json values.", "success");
  } catch (error) {
    console.error(error);
    showStatus("Could not reload content.json.", "error");
  }
}

async function initializeAdmin() {
  setEditingEnabled(isLocalEditingEnvironment());

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const sourceData = stored ? JSON.parse(stored) : await fetchSourceData();
    currentData = buildDefaultData(sourceData);
    populateForm();
  } catch (error) {
    console.error(error);
    currentData = buildDefaultData();
    populateForm();
    showStatus("Loaded fallback content because the source file could not be read.", "error");
  }
}

document.addEventListener("DOMContentLoaded", initializeAdmin);
