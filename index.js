let siteData = {};

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const element = $(id);
  if (element) {
    element.textContent = value ?? "";
  }
}

function setMultilineText(id, value) {
  const element = $(id);
  if (!element) return;

  const lines = String(value ?? "").split("\n");
  element.replaceChildren();

  lines.forEach((line, index) => {
    element.appendChild(document.createTextNode(line));
    if (index < lines.length - 1) {
      element.appendChild(document.createElement("br"));
    }
  });
}

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getNormalizedStats(stats) {
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
    number: String(stats[index]?.number || item.number),
    label: String(stats[index]?.label || item.label),
  }));
}

function getStartingPrice() {
  if (siteData.contact?.startingPrice) {
    return siteData.contact.startingPrice;
  }

  if (!Array.isArray(siteData.pricing)) {
    return "";
  }

  const prices = siteData.pricing
    .map((plan) => Number(plan?.price))
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) {
    return "";
  }

  return formatPrice(Math.min(...prices));
}

async function loadContent() {
  try {
    const response = await fetch("./data/content.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load content.json (${response.status})`);
    }

    siteData = await response.json();
    updatePageContent();
    updateWhatsAppLinks();
    hardenExternalLinks();
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

function updatePageContent() {
  if (siteData.seo?.pageTitle) {
    document.title = siteData.seo.pageTitle;
  }

  if (siteData.seo?.metaDescription) {
    $("metaDesc")?.setAttribute("content", siteData.seo.metaDescription);
  }

  if (siteData.site?.name) {
    setText("siteName", siteData.site.name);
    setText("footer-siteName", siteData.site.name);
  }

  if (siteData.hero) {
    const stats = getNormalizedStats(siteData.hero.stats);

    setText("heroBadge", siteData.hero.badge || siteData.contact?.location || "");
    setMultilineText("heroTitle", siteData.hero.title || "");
    setText("heroSub", siteData.hero.subtitle || "");
    setText("heroCtaLabel", siteData.hero.cta || "Start Free Trial");

    setText("memberCount", stats[0].number);
    setText("memberCountLabel", stats[0].label);
    setText("trainerCount", stats[1].number);
    setText("trainerCountLabel", stats[1].label);
    setText("openTime", stats[2].number);
    setText("openTimeLabel", stats[2].label);
    setText("yearsInBusiness", stats[3].number);
    setText("yearsInBusinessLabel", stats[3].label);
  }

  if (siteData.contact) {
    const timings = siteData.contact.timings || {};
    const combinedTimings = [timings.weekdays, timings.weekend]
      .filter(Boolean)
      .join(" · ");

    setText("contactTimingsTop", combinedTimings);
    setText("contactTimingsDetail", combinedTimings);
    setText("contactLocation", siteData.contact.location || "");
    setText("contactAddress", siteData.contact.address || "");
    setText("footerTimingsWeekdays", timings.weekdays || "");
    setText("footerTimingsWeekend", timings.weekend || "");
    setText("startingPrice", getStartingPrice() ? `${getStartingPrice()} / month` : "");
  }

  if (siteData.site?.phoneDisplay) {
    setText("contactPhoneTop", siteData.site.phoneDisplay);
    setText("contactPhoneDetail", siteData.site.phoneDisplay);
  }

  if (siteData.sections) {
    const sections = siteData.sections;

    setText("sec-prog-eyebrow", sections.programs?.eyebrow || "");
    setText("sec-prog-title", sections.programs?.title || "");
    setText("sec-prog-sub", sections.programs?.subtitle || "");

    setText("sec-sched-eyebrow", sections.schedule?.eyebrow || "");
    setText("sec-sched-title", sections.schedule?.title || "");
    setText("sec-sched-sub", sections.schedule?.subtitle || "");

    setText("sec-train-eyebrow", sections.trainers?.eyebrow || "");
    setText("sec-train-title", sections.trainers?.title || "");
    setText("sec-train-sub", sections.trainers?.subtitle || "");

    setText("sec-price-eyebrow", sections.pricing?.eyebrow || "");
    setText("sec-price-title", sections.pricing?.title || "");
    setText("sec-price-sub", sections.pricing?.subtitle || "");

    setText("sec-gal-eyebrow", sections.gallery?.eyebrow || "");
    setText("sec-gal-title", sections.gallery?.title || "");

    setText("sec-testim-eyebrow", sections.testimonials?.eyebrow || "");
    setText("sec-testim-title", sections.testimonials?.title || "");

    setText("sec-contact-eyebrow", sections.contact?.eyebrow || "");
    setMultilineText("sec-contact-title", sections.contact?.title || "");
    setText("sec-contact-sub", sections.contact?.subtitle || "");
  }

  if (Array.isArray(siteData.pricing)) {
    siteData.pricing.forEach((plan) => {
      const idPrefix = `pricing-${plan.id}`;
      setText(`${idPrefix}-name`, plan.name || "");
      setText(`${idPrefix}-price`, plan.price ?? "");
      setText(`${idPrefix}-note`, plan.note || "");
    });
  }

  if (siteData.footer?.copyright) {
    setText("footer-copyright", siteData.footer.copyright);
  }
}

function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function updateWhatsAppLinks() {
  if (!siteData.site?.phone) return;

  const phone = siteData.site.phone;
  const gymName = siteData.site.name || "our gym";

  const linkMap = [
    {
      id: "waFloatLink",
      message: `Hi! I saw your website and want to know more about memberships at ${gymName}.`,
    },
    {
      id: "navWALink",
      message: `Hi! I want to know more about memberships at ${gymName}.`,
    },
    {
      id: "mobileWALink",
      message: `Hi! I want to know more about memberships at ${gymName}.`,
    },
    {
      id: "heroWALink",
      message: `Hi! I want to know more about membership at ${gymName}.`,
    },
    {
      id: "contactWALink",
      message: `Hi! I want to visit ${gymName} and know more about memberships.`,
    },
    {
      id: "formWhatsAppAlt",
      message: `Hi! I want to chat with ${gymName} about memberships.`,
    },
  ];

  linkMap.forEach(({ id, message }) => {
    const link = $(id);
    if (link) {
      link.href = buildWhatsAppUrl(phone, message);
    }
  });

  document.querySelectorAll(".btn-book").forEach((btn) => {
    const card = btn.closest(".pricing-card");
    const planName =
      card?.querySelector(".pricing-name")?.textContent?.trim() || "membership";
    const price =
      card?.querySelector(".pricing-price span")?.textContent?.trim() || "";
    const priceText = price ? ` at ${formatPrice(price)}` : "";

    btn.href = buildWhatsAppUrl(
      phone,
      `Hi! I want the ${planName} membership${priceText} at ${gymName}.`,
    );
  });

  document.querySelectorAll(".schedule-wa").forEach((link) => {
    const card = link.closest(".schedule-card");
    const className =
      card?.querySelector(".schedule-class")?.textContent?.trim() || "a class";

    link.href = buildWhatsAppUrl(
      phone,
      `Hi! I want to book ${className} at ${gymName}.`,
    );
  });

  document.querySelectorAll(".trainer-wa").forEach((link) => {
    const card = link.closest(".trainer-body");
    const trainerName =
      card?.querySelector(".trainer-name")?.textContent?.trim() || "a trainer";

    link.href = buildWhatsAppUrl(
      phone,
      `Hi! I want to train with ${trainerName} at ${gymName}.`,
    );
  });
}

function hardenExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });
}

function toggleMenu() {
  $("mobileMenu")?.classList.toggle("open");
}

function submitForm(event) {
  event.preventDefault();

  if (!siteData.site?.phone) return;

  const form = event.target;
  const formData = new FormData(form);
  const gymName = siteData.site.name || "your gym";

  const message = [
    `Hi! I want to book a free trial at ${gymName}.`,
    `Name: ${formData.get("name") || "Not provided"}`,
    `Phone: ${formData.get("phone") || "Not provided"}`,
    `Interest: ${formData.get("interest") || "Not provided"}`,
    `Goal: ${formData.get("goal") || "Not provided"}`,
  ].join("\n");

  window.open(buildWhatsAppUrl(siteData.site.phone, message), "_blank");
}

document.addEventListener("DOMContentLoaded", loadContent);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("show"), index * 90);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 },
);

document.querySelectorAll(".fade").forEach((element) => observer.observe(element));
