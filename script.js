const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const countdown = document.querySelector("[data-countdown]");
const googleFormLink = document.querySelector("[data-google-form-link]");
const googleFormEmbed = document.querySelector("[data-form-embed]");
const formPlaceholder = document.querySelector("[data-form-placeholder]");

const syncNav = () => {
  nav?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  revealObserver.observe(item);
});

const pad = (value) => String(value).padStart(2, "0");

const updateCountdown = () => {
  if (!countdown) return;

  const target = new Date(countdown.dataset.countdown).getTime();
  const diff = Math.max(target - Date.now(), 0);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const minutes = Math.floor((diff / 60_000) % 60);
  const seconds = Math.floor((diff / 1_000) % 60);

  countdown.querySelector("[data-days]").textContent = pad(days);
  countdown.querySelector("[data-hours]").textContent = pad(hours);
  countdown.querySelector("[data-minutes]").textContent = pad(minutes);
  countdown.querySelector("[data-seconds]").textContent = pad(seconds);
};

window.addEventListener("scroll", syncNav, { passive: true });
syncNav();
updateCountdown();
setInterval(updateCountdown, 1000);

const setupGoogleForm = () => {
  const config = window.WEDDING_SITE_CONFIG || {};
  const formUrl = config.googleFormUrl || "";
  const embedUrl = config.googleFormEmbedUrl || "";
  const hasRealForm = formUrl && !formUrl.includes("REPLACE_WITH");

  if (googleFormLink && hasRealForm) {
    googleFormLink.href = formUrl;
    googleFormLink.textContent = "Открыть анкету";
  } else if (googleFormLink) {
    googleFormLink.removeAttribute("target");
    googleFormLink.setAttribute("aria-disabled", "true");
    googleFormLink.textContent = "Форма скоро появится";
  }

  if (googleFormEmbed && embedUrl && !embedUrl.includes("REPLACE_WITH")) {
    const iframe = googleFormEmbed.querySelector("iframe");
    iframe.src = embedUrl;
    googleFormEmbed.hidden = false;
    formPlaceholder?.setAttribute("hidden", "");
  }
};

setupGoogleForm();
