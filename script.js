// Navbar show/hide behavior
const navbar = document.getElementById("mainNavbar");

function handleNavbar() {
  if (!navbar) return;

  // Show navbar at top or when hovering near top (desktop only)
  if (window.scrollY === 0) {
    navbar.classList.add("navbar-visible");
  } else {
    navbar.classList.remove("navbar-visible");
  }
}

// Desktop: show on hover when not at top
document.addEventListener("mousemove", function (e) {
  if (!navbar || window.innerWidth <= 768) return; // Skip on mobile

  if (window.scrollY > 0) {
    // Only when scrolled down
    if (e.clientY <= 20) {
      // Near top of viewport
      navbar.classList.add("navbar-visible");
    } else if (!navbar.matches(":hover")) {
      navbar.classList.remove("navbar-visible");
    }
  }
});

if (navbar) {
  navbar.addEventListener("mouseenter", () => {
    if (window.innerWidth > 768) {
      navbar.classList.add("navbar-visible");
    }
  });

  navbar.addEventListener("mouseleave", () => {
    if (window.innerWidth > 768 && window.scrollY > 0) {
      navbar.classList.remove("navbar-visible");
    }
  });
}

// Listen to scroll + resize
window.addEventListener("scroll", handleNavbar);
window.addEventListener("resize", handleNavbar);

// Initial state
handleNavbar();

// DOM-dependent scripts
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scroll handling for nav links
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Close mobile menu if open
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          navbarCollapse.classList.remove("show");
        }
        // Scroll to section
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ===== IntersectionObserver: pop-on-scroll (toggle) =====
         Add/remove 'in-view' as element enters/leaves viewport so it pops both when scrolling down and up.
      */
  const revealSelector = [
    ".animate-fade-up",
    ".animate-on-scroll",
    ".staggered-gallery div",
    ".logo-item",
    ".ui-designs-left",
    ".ui-designs-right",
    ".mockup-section img",
    ".ui-designs-heading",
    ".mockup-heading",
    ".ui-designs-desc",
    ".mockup-desc",
    ".carousel-container", /* Added */
    ".video-wrapper", /* Added */
  ].join(",");

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px", // trigger slightly before fully visible
    threshold: 0.12,
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add("in-view");
      } else {
        // remove when leaving so it will animate again when re-entering (scroll up)
        el.classList.remove("in-view");
      }
    });
  }, observerOptions);

  // Observe existing revealable elements with a small stagger; ensure they have .pop baseline
  document.querySelectorAll(revealSelector).forEach((el, idx) => {
    // mark as pop-able
    el.classList.add("pop");

    // don't override explicit animationDelay if present
    if (!el.style.animationDelay) {
      const delay = Math.min(0.5, (idx % 12) * 0.035);
      el.style.transitionDelay = `${delay}s`;
    }
    revealObserver.observe(el);
  });

  // Logo strip (icons) — create items and observe them (also add .pop)
  const logoStrip = document.getElementById("logoStrip");
  const logoCount = 14; // number of icon images

  if (logoStrip) {
    for (let set = 0; set < 2; set++) {
      for (let i = 1; i <= logoCount; i++) {
        const logoItem = document.createElement("div");
        logoItem.className = "logo-item";
        logoItem.classList.add("pop");

        const img = document.createElement("img");
        const num = i.toString().padStart(3, "0");
        img.src = `icons/i-${num}.png`;
        img.alt = `Logo ${i}`;

        logoItem.appendChild(img);
        logoStrip.appendChild(logoItem);

        // small stagger per logo so reveal looks fluid
        const posIndex = set * logoCount + i;
        logoItem.style.transitionDelay = `${Math.min(0.45, (posIndex % 12) * 0.03)}s`;

        // observe each generated logo-item
        revealObserver.observe(logoItem);
      }
    }
  }

  // Simplified carousel function for smooth sliding only
  function initCarousel(carouselId, dotsSelector, dotActiveColor, dotInactiveColor) {
    const carousel = document.getElementById(carouselId);
    const dots = document.querySelectorAll(dotsSelector);
    let index = 0;

    if (carousel && dots.length > 0) {
      function showSlide(i) {
        index = i;
        // Simple slide transition
        carousel.style.transform = `translateX(-${i * 100}%)`;

        dots.forEach((dot, j) => {
          dot.style.backgroundColor = j === i ? dotActiveColor : dotInactiveColor;
        });
      }

      // Add click handlers for dots
      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => showSlide(i));
      });

      // Auto advance
      setInterval(() => {
        index = (index + 1) % dots.length;
        showSlide(index);
      }, 8000); // Changed from 4000 to 8000ms (8 seconds)
    }
  }

  // Initialize carousels
  initCarousel("ui-carousel", "#carousel-dots .dot", "yellow", "white");
  initCarousel("mockup-carousel", "#mockup-dots .dot2", "#c50607", "white");

  // Add section tracking and progress bar
  const progressBar = document.querySelector(".scroll-progress-bar");
  const sections = document.querySelectorAll(
    "section, .container-fluid, .ui-designs-section, .mockup-section"
  );
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function updateActiveSection() {
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active", "current");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active", "current");
      }
    });
  }

  // Update on scroll
  window.addEventListener("scroll", () => {
    updateProgress();
    updateActiveSection();
  });

  // Initial update
  updateProgress();
  updateActiveSection();
});

document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.querySelector(".scroll-progress-bar");
  const sections = document.querySelectorAll("#home, #ui-designs, #social-media-posters"); // Ensure all sections are included
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function updateProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function updateActiveSection() {
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active", "current");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active", "current");
      }
    });
  }

  window.addEventListener("scroll", () => {
    updateProgress();
    updateActiveSection();
  });

  updateProgress();
  updateActiveSection();
});