// Navbar show/hide behavior
const navbar = document.getElementById("mainNavbar");

function handleNavbar() {
  if (!navbar) return;

  if (window.innerWidth <= 768) {
    // Mobile / small device behavior
    if (window.scrollY === 0) {
      navbar.classList.add("navbar-visible"); // show only at top
    } else {
      navbar.classList.remove("navbar-visible");
    }
  } else {
    // Desktop / large screen behavior
    if (window.scrollY === 0) {
      navbar.classList.add("navbar-visible");
    } else {
      navbar.classList.remove("navbar-visible");
    }
  }
}

// Desktop extra: show on hover when not at top
document.addEventListener("mousemove", function(e) {
  if (!navbar) return;
  if (window.innerWidth > 768 && window.scrollY > 0) {
    if (e.clientY <= 20) {
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
document.addEventListener('DOMContentLoaded', () => {
  // Logo strip (icons)
  const logoStrip = document.getElementById('logoStrip');
  const logoCount = 14; // number of icon images

  if (logoStrip) {
    for (let set = 0; set < 2; set++) {
      for (let i = 1; i <= logoCount; i++) {
        const logoItem = document.createElement('div');
        logoItem.className = 'logo-item';
        
        const img = document.createElement('img');
        const num = i.toString().padStart(3, '0');
        img.src = `icons/i-${num}.png`;
        img.alt = `Logo ${i}`;
        
        logoItem.appendChild(img);
        logoStrip.appendChild(logoItem);
      }
    }
  }

  // Existing UI carousel
  const carousel = document.getElementById('ui-carousel');
  const dots = document.querySelectorAll('#carousel-dots .dot');
  let index = 0;

  if (carousel && dots.length > 0) {
    function showSlide(i) {
      index = i;
      carousel.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((dot, j) => {
        dot.style.backgroundColor = j === i ? 'yellow' : 'white';
      });
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

    setInterval(() => {
      index = (index + 1) % dots.length;
      showSlide(index);
    }, 4000);
  }

  // Mockup carousel
  const mockupCarousel = document.getElementById('mockup-carousel');
  const mockupDots = document.querySelectorAll('#mockup-dots .dot2');
  let mockIndex = 0;

  if (mockupCarousel && mockupDots.length > 0) {
    function showMockup(i) {
      mockIndex = i;
      mockupCarousel.style.transform = `translateX(-${i * 100}%)`;
      mockupDots.forEach((dot, j) => {
        dot.style.backgroundColor = j === i ? '#294fa6' : '#ccc';
      });
    }

    mockupDots.forEach((dot, i) => dot.addEventListener('click', () => showMockup(i)));

    setInterval(() => {
      mockIndex = (mockIndex + 1) % mockupDots.length;
      showMockup(mockIndex);
    }, 4000);
  }
});
