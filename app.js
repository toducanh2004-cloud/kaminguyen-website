(() => {
  "use strict";

  const content = window.SITE_CONTENT;
  if (!content) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<p class="noscript">Portfolio content could not be loaded.</p>',
    );
    return;
  }

  const categoryLabels = {
    illustration: "Illustration",
    comics: "Manga & storytelling",
    design: "Character design",
  };

  const gallery = document.querySelector("#gallery");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const lightboxCategory = document.querySelector("#lightbox-category");
  const lightboxCounter = document.querySelector("#lightbox-counter");
  let activeFilter = "all";
  let visibleArtworks = [...content.artworks];
  let lightboxIndex = 0;
  let lastFocusedElement = null;

  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  function hydrateProfile() {
    const { profile, pricing } = content;
    const currentMonth = new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date());
    const automaticAvailability = {
      availability: `Opening in ${currentMonth}`,
      availabilityShort: `Open in ${currentMonth}`,
    };

    document.querySelectorAll("[data-field]").forEach((element) => {
      const key = element.dataset.field;
      const value =
        automaticAvailability[key] ??
        (key === "priceNote" ? pricing.note : profile[key]);
      if (typeof value === "string") element.textContent = value;
    });

    const fillList = (selector, values) => {
      const list = document.querySelector(selector);
      list.replaceChildren(
        ...values.map((value) => create("li", "", value)),
      );
    };

    fillList("#software-list", profile.software);
    fillList("#skills-list", profile.skills);
    document.querySelector("#year").textContent = String(new Date().getFullYear());
  }

  function renderDisciplines() {
    const container = document.querySelector("#discipline-grid");
    const cards = content.disciplines.map((discipline) => {
      const card = create("article", "discipline-card reveal");
      const number = create("span", "discipline-number", discipline.number);
      const count = create(
        "span",
        "discipline-count",
        String(content.artworks.filter((art) => art.category === discipline.id).length),
      );
      const title = create("h3", "", discipline.title);
      const description = create("p", "", discipline.description);
      card.append(number, count, title, description);
      return card;
    });
    container.replaceChildren(...cards);
  }

  function renderGallery() {
    visibleArtworks =
      activeFilter === "all"
        ? [...content.artworks]
        : content.artworks.filter((art) => art.category === activeFilter);

    const fragment = document.createDocumentFragment();
    visibleArtworks.forEach((art, index) => {
      const button = create("button", "gallery-item is-entering");
      button.type = "button";
      button.dataset.galleryIndex = String(index);
      button.setAttribute("aria-label", `View ${art.title}`);
      button.style.animationDelay = `${Math.min(index * 26, 260)}ms`;

      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = art.thumb;
      image.alt = `${art.title} — ${categoryLabels[art.category]} by Kaminguyen`;
      image.width = art.width;
      image.height = art.height;
      image.loading = index < 4 ? "eager" : "lazy";
      image.decoding = "async";

      const caption = document.createElement("figcaption");
      const titleGroup = create("span", "gallery-item-title");
      titleGroup.append(
        create("strong", "", art.title),
        create("small", "", categoryLabels[art.category]),
      );
      const counter = create(
        "span",
        "gallery-index",
        String(index + 1).padStart(2, "0"),
      );
      caption.append(titleGroup, counter);
      figure.append(image, caption);
      button.append(figure);
      fragment.append(button);
    });

    if (!visibleArtworks.length) {
      gallery.replaceChildren(
        create("p", "gallery-empty", "No artwork in this category yet."),
      );
    } else {
      gallery.replaceChildren(fragment);
    }
  }

  function renderEvents() {
    const container = document.querySelector("#events-list");
    const events = content.events ?? [];

    if (!events.length) {
      container.replaceChildren(
        create(
          "p",
          "events-empty reveal",
          "New drawing events and community recaps will appear here.",
        ),
      );
      return;
    }

    container.replaceChildren(
      ...events.map((event) => {
        const card = create("article", "event-card reveal");
        const visual = create("figure", "event-visual");
        const image = document.createElement("img");
        image.src = event.cover;
        image.alt = event.coverAlt ?? "";
        image.loading = "lazy";
        image.decoding = "async";
        visual.append(image);

        const body = create("div", "event-body");
        const eyebrow = create("p", "event-eyebrow", event.eyebrow);
        const title = create("h3", "", event.title);
        const description = create("p", "event-description", event.description);
        const link = create("a", "event-link");
        link.href = event.href;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.append(
          create("span", "", event.linkLabel ?? "Open event"),
          create("span", "", "↗"),
        );
        body.append(eyebrow, title, description, link);
        card.append(visual, body);
        return card;
      }),
    );
  }

  function hydratePayment() {
    const payment = content.payment ?? {};
    document.querySelectorAll("[data-payment]").forEach((element) => {
      const value = payment[element.dataset.payment];
      if (typeof value === "string") element.textContent = value;
    });
  }

  function renderPricing(style = "standard") {
    const priceList = document.querySelector("#price-list");
    const rows = content.pricing[style].map((price) => {
      const row = create("article", "price-row");
      row.append(
        create("span", "", price.type),
        create("strong", "", price.usd),
        create("small", "", price.vnd),
      );
      return row;
    });
    priceList.replaceChildren(...rows);

    const addonsList = document.querySelector("#addons-list");
    if (!addonsList.children.length) {
      addonsList.replaceChildren(
        ...content.pricing.addons.map((item) => create("li", "", item)),
      );
    }
  }

  function renderProcess() {
    const list = document.querySelector("#process-list");
    list.replaceChildren(
      ...content.process.map((step) => {
        const item = document.createElement("li");
        item.append(
          create("span", "process-number", step.number),
          create("strong", "", step.title),
          create("p", "", step.text),
        );
        return item;
      }),
    );
  }

  function renderTerms() {
    const list = document.querySelector("#terms-list");
    list.replaceChildren(
      ...content.terms.map((term, index) => {
        const article = create("article", "term-item");
        const heading = document.createElement("h3");
        const toggle = create("button", "term-toggle");
        const panelId = `term-panel-${index}`;
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", panelId);
        toggle.append(
          create("span", "term-roman", term.roman),
          create("span", "term-title", term.title),
          create("span", "term-icon", "+"),
        );
        heading.append(toggle);

        const panel = create("div", "term-panel");
        panel.id = panelId;
        const panelInner = document.createElement("div");
        const bullets = document.createElement("ul");
        bullets.replaceChildren(
          ...term.items.map((item) => create("li", "", item)),
        );
        panelInner.append(bullets);
        panel.append(panelInner);
        article.append(heading, panel);
        return article;
      }),
    );
  }

  function renderContacts() {
    const socialLinks = document.querySelector("#social-links");
    socialLinks.replaceChildren(
      ...content.contacts.map((contact) => {
        const link = create("a", "social-link");
        link.href = contact.href;
        if (contact.href.startsWith("http")) {
          link.target = "_blank";
          link.rel = "noreferrer";
        }
        link.append(
          create("span", "", contact.label),
          create("strong", "", contact.handle),
        );
        return link;
      }),
    );

    const email = content.contacts.find((contact) => contact.id === "email");
    document.querySelectorAll('[data-contact="email"]').forEach((link) => {
      link.href = email?.href ?? "#";
    });
  }

  function setFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    renderGallery();
  }

  function updateLightbox() {
    const art = visibleArtworks[lightboxIndex];
    if (!art) return;
    lightboxImage.src = art.file;
    lightboxImage.alt = `${art.title} — ${categoryLabels[art.category]} by Kaminguyen`;
    lightboxTitle.textContent = art.title;
    lightboxCategory.textContent = `${categoryLabels[art.category]} · ${art.year}`;
    lightboxCounter.textContent = `${String(lightboxIndex + 1).padStart(2, "0")} / ${String(
      visibleArtworks.length,
    ).padStart(2, "0")}`;
  }

  function openLightbox(index, trigger) {
    lightboxIndex = index;
    lastFocusedElement = trigger || document.activeElement;
    updateLightbox();
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
    document.body.classList.add("lightbox-open");
    document.querySelector(".lightbox-close").focus();
  }

  function closeLightbox() {
    if (typeof lightbox.close === "function" && lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
    document.body.classList.remove("lightbox-open");
    lastFocusedElement?.focus?.();
  }

  function stepLightbox(direction) {
    lightboxIndex =
      (lightboxIndex + direction + visibleArtworks.length) %
      visibleArtworks.length;
    updateLightbox();
  }

  function bindInteractions() {
    document.querySelector(".filter-group").addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      setFilter(button.dataset.filter);
    });

    gallery.addEventListener("click", (event) => {
      const item = event.target.closest("[data-gallery-index]");
      if (!item) return;
      openLightbox(Number(item.dataset.galleryIndex), item);
    });

    document.querySelectorAll("[data-open-art]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = "all";
        visibleArtworks = [...content.artworks];
        const sourceIndex = Number(button.dataset.openArt);
        const index = visibleArtworks.findIndex(
          (art) => art.sourceIndex === sourceIndex,
        );
        openLightbox(Math.max(index, 0), button);
      });
    });

    document
      .querySelector(".lightbox-close")
      .addEventListener("click", closeLightbox);
    document
      .querySelector(".lightbox-prev")
      .addEventListener("click", () => stepLightbox(-1));
    document
      .querySelector(".lightbox-next")
      .addEventListener("click", () => stepLightbox(1));

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.open) return;
      if (event.key === "ArrowLeft") stepLightbox(-1);
      if (event.key === "ArrowRight") stepLightbox(1);
      if (event.key === "Escape") closeLightbox();
    });

    document.querySelector(".style-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-price-style]");
      if (!button) return;
      document.querySelectorAll("[data-price-style]").forEach((tab) => {
        tab.setAttribute("aria-selected", String(tab === button));
      });
      renderPricing(button.dataset.priceStyle);
    });

    document.querySelector("#terms-list").addEventListener("click", (event) => {
      const toggle = event.target.closest(".term-toggle");
      if (!toggle) return;
      const item = toggle.closest(".term-item");
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      item.classList.toggle("is-open", !expanded);
      toggle.setAttribute("aria-expanded", String(!expanded));
    });

    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");
    const menuScrim = document.querySelector(".menu-scrim");
    const menuButtonLabel = document.querySelector(".menu-button-label");
    const setMenu = (open) => {
      menuButton.setAttribute("aria-expanded", String(open));
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.setAttribute("aria-hidden", String(!open));
      mobileMenu.toggleAttribute("inert", !open);
      menuScrim.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      menuButtonLabel.textContent = open ? "Close" : "Menu";
      menuButton.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
      if (open) {
        requestAnimationFrame(() => mobileMenu.querySelector("a")?.focus());
      }
    };

    menuButton.addEventListener("click", () => {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    menuScrim.addEventListener("click", () => setMenu(false));
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1050 && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
      }
    });

    const progress = document.querySelector(".scroll-progress span");
    let ticking = false;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      progress.style.transform = `scaleX(${Math.min(Math.max(value, 0), 1)})`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateProgress);
          ticking = true;
        }
      },
      { passive: true },
    );
    updateProgress();
  }

  function initReveals() {
    const items = document.querySelectorAll(".reveal");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((item) => observer.observe(item));
  }

  hydrateProfile();
  renderDisciplines();
  renderGallery();
  renderEvents();
  hydratePayment();
  renderPricing();
  renderProcess();
  renderTerms();
  renderContacts();
  bindInteractions();
  initReveals();
})();
