const loader = document.getElementById("loader");
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const backToTop = document.getElementById("backToTop");
const isLowPowerDevice =
  window.matchMedia("(max-width: 768px)").matches ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 450);
  }
});

const handleScrollState = () => {
  const isScrolled = window.scrollY > 30;
  if (siteHeader) siteHeader.classList.toggle("scrolled", isScrolled);
  if (backToTop) backToTop.classList.toggle("show", window.scrollY > 420);
};

handleScrollState();
window.addEventListener("scroll", handleScrollState);

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    siteNav.classList.toggle("open");
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const revealItems = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
if (revealItems.length) {
  if (isLowPowerDevice) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const counters = document.querySelectorAll(".counter");
if (counters.length) {
  const animateCounter = (counter) => {
    const target = parseInt(counter.dataset.target || "0", 10);
    const duration = 1200;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toString();
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.done) {
          entry.target.dataset.done = "true";
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const testimonialTrack = document.getElementById("testimonialTrack");
if (testimonialTrack) {
  const testimonials = testimonialTrack.querySelectorAll(".testimonial");
  let current = 0;

  const syncTestimonialHeight = () => {
    if (!testimonials.length || window.matchMedia("(max-width: 680px)").matches) {
      testimonialTrack.style.minHeight = "";
      return;
    }

    let maxHeight = 0;
    testimonials.forEach((card) => {
      const previousDisplay = card.style.display;
      const previousVisibility = card.style.visibility;
      const wasActive = card.classList.contains("active");

      card.style.display = "block";
      card.style.visibility = "hidden";
      card.classList.add("active");
      maxHeight = Math.max(maxHeight, card.offsetHeight);

      if (!wasActive) card.classList.remove("active");
      card.style.display = previousDisplay;
      card.style.visibility = previousVisibility;
    });

    testimonialTrack.style.minHeight = `${maxHeight}px`;
  };

  const rotateTestimonials = () => {
    testimonials[current].classList.remove("active");
    current = (current + 1) % testimonials.length;
    testimonials[current].classList.add("active");
  };

  syncTestimonialHeight();
  window.addEventListener("resize", syncTestimonialHeight);

  if (testimonials.length > 1) {
    setInterval(rotateTestimonials, isLowPowerDevice ? 5200 : 3800);
  }
}

const rippleButtons = document.querySelectorAll(".ripple");
if (!isLowPowerDevice) {
  rippleButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();
      const span = document.createElement("span");
      const size = Math.max(rect.width, rect.height);

      span.className = "ripple-effect";
      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${event.clientX - rect.left - size / 2}px`;
      span.style.top = `${event.clientY - rect.top - size / 2}px`;

      button.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    });
  });
}

const galleryGrid = document.getElementById("galleryGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
if (galleryGrid && filterButtons.length) {
  const items = galleryGrid.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;

      items.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === "all" || category === filter;
        item.style.display = show ? "block" : "none";
      });
    });
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
if (galleryGrid && lightbox && lightboxImg && lightboxClose) {
  galleryGrid.addEventListener("click", (event) => {
    const clickedImage = event.target.closest("img");
    if (!clickedImage) return;

    lightboxImg.src = clickedImage.dataset.full || clickedImage.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.name.value.trim();
    const phone = contactForm.phone.value.trim();
    const email = contactForm.email.value.trim();
    const date = contactForm.date.value;
    const time = contactForm.time ? contactForm.time.value : "";
    const service = contactForm.service ? contactForm.service.value : "";
    const message = contactForm.message.value.trim();

    const phoneValid = /^[+\d][\d\s-]{6,}$/.test(phone);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !phone || !email || !date || !time || !service || !message) {
      formMessage.textContent = "Please complete all required fields.";
      formMessage.className = "form-message error";
      return;
    }

    if (!phoneValid) {
      formMessage.textContent = "Please enter a valid phone number.";
      formMessage.className = "form-message error";
      return;
    }

    if (!emailValid) {
      formMessage.textContent = "Please enter a valid email address.";
      formMessage.className = "form-message error";
      return;
    }

    const whatsappText = [
      "New Appointment Request",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Preferred Date: ${date}`,
      `Preferred Time: ${time}`,
      `Service Required: ${service}`,
      `Message: ${message}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/923325447093?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, "_blank", "noopener");

    formMessage.textContent = "Opening WhatsApp with your appointment details.";
    formMessage.className = "form-message success";
    contactForm.reset();
  });
}
