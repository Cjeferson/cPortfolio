// Modal functionality
const Modal = {
  init() {
    this.modal = document.getElementById("resumeModal");
    this.modalContent = document.querySelector("#resumeModal .relative");
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("hidden")) {
        this.close();
      }
    });

    // Close on outside click
    this.modal.addEventListener("click", (e) => {
      if (!this.modalContent.contains(e.target)) {
        this.close();
      }
    });

    // Prevent click inside modal from closing
    this.modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  },

  open() {
    this.modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    loadResumeContent();
  },

  close() {
    this.modal.classList.add("hidden");
    document.body.style.overflow = "";
  },
};

// Initialize modal functionality
document.addEventListener("DOMContentLoaded", () => {
  Modal.init();

  // Update click handlers to use Modal object
  const resumeButtons = document.querySelectorAll('[data-action="openResume"]');
  const closeButtons = document.querySelectorAll('[data-action="closeResume"]');

  resumeButtons.forEach((btn) => {
    btn.addEventListener("click", () => Modal.open());
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => Modal.close());
  });
});

async function loadResumeContent() {
  try {
    const response = await fetch("datas/resume.json");
    const data = await response.json();
    const content = document.getElementById("resumeContent");
    content.innerHTML = `
            <div class="border-b pb-6 dark:border-gray-700">
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">${
                  data.basics.name
                }</h3>
                <p class="text-gray-600 dark:text-gray-200">${
                  data.basics.label
                }</p>
                <p class="text-gray-600 dark:text-gray-200">${
                  data.basics.email
                } | ${data.basics.phone}</p>
                <p class="text-gray-600 dark:text-gray-200 mt-4">${
                  data.basics.summary
                }</p>
            </div>
            <div class="border-b pb-6 dark:border-gray-700">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Education</h3>
                ${data.education
                  .map(
                    (edu) => `
                    <div class="mb-4">
                        <p class="font-semibold text-gray-800 dark:text-white">${edu.institution}</p>
                        <p class="text-gray-600 dark:text-gray-200">${edu.studyType} in ${edu.area}</p>
                        <p class="text-gray-500 dark:text-gray-400">${edu.startDate} - ${edu.endDate}</p>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="border-b pb-6 dark:border-gray-700">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Skills</h3>
                <div class="grid grid-cols-2 gap-4">
                ${data.skills
                  .map(
                    (skill) => `
                    <div class="mb-2">
                        <p class="font-semibold text-gray-800 dark:text-white">${
                          skill.name
                        }</p>
                        <p class="text-gray-600 dark:text-gray-200">${skill.keywords.join(
                          ", "
                        )}</p>
                    </div>
                `
                  )
                  .join("")}
                </div>
            </div>
            <div class="border-b pb-6 dark:border-gray-700">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Experience</h3>
                ${data.experience
                  .map(
                    (exp) => `
                    <div class="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p class="font-semibold text-primary dark:text-light">${
                          exp.company
                        }</p>
                        <p class="text-gray-700 dark:text-gray-200">${
                          exp.position
                        } <span class='text-xs text-gray-500 dark:text-gray-400'>(${
                      exp.duration
                    }, ${exp.hours} hours)</span></p>
                        <p class="text-gray-600 dark:text-gray-200 mt-2">Technologies: <span class="font-medium">${exp.technologies.join(
                          ", "
                        )}</span></p>
                        <ul class="list-disc ml-6 text-gray-600 dark:text-gray-200 mt-2">
                            ${exp.responsibilities
                              .map((r) => `<li>${r}</li>`)
                              .join("")}
                        </ul>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Projects</h3>
                ${data.projects
                  .map(
                    (proj) => `
                    <div class="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p class="font-semibold text-primary dark:text-light">${
                          proj.name
                        }</p>
                        <p class="text-gray-700 dark:text-gray-200">Role: <span class="font-medium">${
                          proj.role
                        }</span></p>
                        <p class="text-gray-700 dark:text-gray-200">Category: <span class="font-medium">${
                          proj.category
                        }</span></p>
                        <p class="text-gray-600 dark:text-gray-200 mt-2">Technologies: <span class="font-medium">${proj.technologies.join(
                          ", "
                        )}</span></p>
                        <ul class="list-disc ml-6 text-gray-600 dark:text-gray-200 mt-2">
                            ${proj.description
                              .map((d) => `<li>${d}</li>`)
                              .join("")}
                        </ul>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
  } catch (error) {
    console.error("Error loading resume:", error);
    document.getElementById("resumeContent").innerHTML =
      '<p class="text-red-500 dark:text-red-400">Error loading resume content</p>';
  }
}

// Load timeline experiences
async function loadExperiences() {
  try {
    const response = await fetch("datas/experience.json");
    const data = await response.json();
    const timelineItems = document.getElementById("timeline-items");

    timelineItems.innerHTML = data.experiences
      .map((exp, index) => {
        const isMobile = window.innerWidth < 1420;
        if (isMobile) {
          return `
                        <div class="relative flex flex-col items-center mb-10">
                            <div class="hidden"></div>
                            <div class="w-full max-w-sm mx-auto mt-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                                <span class="inline-block px-3 py-1 bg-primary/10 text-sm font-medium text-secondary dark:text-light rounded-full mb-2">${
                                  exp.period
                                }</span>
                                <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1">${
                                  exp.title
                                }</h3>
                                <p class="text-secondary dark:text-light font-medium mb-2">${
                                  exp.company
                                }</p>
                                ${
                                  Array.isArray(exp.description)
                                    ? `<ul class='list-disc ml-6 text-gray-600 dark:text-gray-300 mt-2'>${exp.description
                                        .map((d) => `<li>${d}</li>`)
                                        .join("")}</ul>`
                                    : `<p class='text-gray-600 dark:text-gray-300 mt-2'>${exp.description}</p>`
                                }
                            </div>
                        </div>
                        `;
        } else {
          return `
                        <div class="relative flex items-center group">
                            <div class="hidden md:block w-5/12 ${
                              index % 2 === 0
                                ? "text-right pr-8 group-hover:-translate-x-2"
                                : "ml-auto pl-8 group-hover:translate-x-2"
                            } transition-transform duration-300">
                                <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/20">
                                    <span class="inline-block px-3 py-1 bg-primary/10 text-sm font-medium text-secondary dark:text-light rounded-full mb-2">${
                                      exp.period
                                    }</span>
                                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">${
                                      exp.title
                                    }</h3>
                                    <p class="text-secondary dark:text-light font-medium">${
                                      exp.company
                                    }</p>
                                    ${
                                      Array.isArray(exp.description)
                                        ? `<ul class='list-disc ml-6 text-gray-600 dark:text-gray-300 mt-2'>${exp.description
                                            .map((d) => `<li>${d}</li>`)
                                            .join("")}</ul>`
                                        : `<p class='text-gray-600 dark:text-gray-300 mt-2'>${exp.description}</p>`
                                    }
                                </div>
                            </div>
                            <div class="absolute left-0 md:left-1/2 w-[30px] h-[30px] bg-gradient-to-r from-primary to-secondary dark:from-light dark:to-neutral rounded-full transform -translate-x-1/2 z-10 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                            <div class="md:hidden pl-12 group-hover:translate-x-2 transition-transform duration-300">
                                <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/20">
                                    <span class="inline-block px-3 py-1 bg-primary/10 text-sm font-medium text-secondary dark:text-light rounded-full mb-2">${
                                      exp.period
                                    }</span>
                                    <h3 class="text-xl font-bold text-gray-800 dark:text-white">${
                                      exp.title
                                    }</h3>
                                    <p class="text-secondary dark:text-light font-medium">${
                                      exp.company
                                    }</p>
                                    ${
                                      Array.isArray(exp.description)
                                        ? `<ul class='list-disc ml-6 text-gray-600 dark:text-gray-300 mt-2'>${exp.description
                                            .map((d) => `<li>${d}</li>`)
                                            .join("")}</ul>`
                                        : `<p class='text-gray-600 dark:text-gray-300 mt-2'>${exp.description}</p>`
                                    }
                                </div>
                            </div>
                        </div>
                        `;
        }
      })
      .join("");
  } catch (error) {
    console.error("Error loading experiences:", error);
    document.getElementById("timeline-items").innerHTML =
      '<p class="text-red-500">Error loading experiences</p>';
  }
}

// Load experiences when the page loads
document.addEventListener("DOMContentLoaded", loadExperiences);

// Scroll function for project sections
function scrollProjects(elementId, amount) {
  const element = document.getElementById(elementId);
  element.scrollLeft += amount;
}

// Enhanced Navigation hide/show functionality with debounce
let lastScrollY = window.scrollY;
let isNavVisible = true;
let scrollTimeout;
const navbar = document.getElementById("navbar");

const debounce = (func, wait) => {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(scrollTimeout);
      func(...args);
    };
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(later, wait);
  };
};

const handleScroll = debounce(() => {
  if (window.scrollY > lastScrollY && isNavVisible && window.scrollY > 100) {
    navbar.classList.add("nav-hidden");
    isNavVisible = false;
  } else if (
    (window.scrollY < lastScrollY && !isNavVisible) ||
    window.scrollY < 50
  ) {
    navbar.classList.remove("nav-hidden");
    isNavVisible = true;
  }
  lastScrollY = window.scrollY;
}, 50);

window.addEventListener("scroll", handleScroll);

// Show navigation on hover and focus
navbar.addEventListener("mouseenter", () => {
  navbar.classList.remove("nav-hidden");
  isNavVisible = true;
});

// Ensure navigation is visible when any child element receives focus
navbar.addEventListener("focusin", () => {
  navbar.classList.remove("nav-hidden");
  isNavVisible = true;
});

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("hidden");
}

// Track active section in navigation
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === current) {
      link.classList.add("active");
    }
  });
});

// Dark mode functionality
let darkMode = localStorage.getItem("darkMode") === "enabled";
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeToggleMobile = document.getElementById("darkModeToggleMobile");

if (darkMode) {
  document.documentElement.classList.add("dark");
}

function toggleDarkMode() {
  darkMode = !darkMode;
  if (darkMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", null);
  }
}

darkModeToggle.addEventListener("click", toggleDarkMode);
darkModeToggleMobile.addEventListener("click", toggleDarkMode);

async function loadSkills() {
  try {
    const response = await fetch("datas/skills.json");
    const skills = await response.json();
    const grid = document.getElementById("skills-grid");
    grid.innerHTML = skills
      .map(
        (cat) => `
    <div class='skill-card group/card p-6 bg-white dark:bg-gray-800 rounded-2xl border border-primary/30 dark:border-light/30 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 transform flex flex-col gap-4'>
        <div class='flex items-center gap-4 mb-3'>
            <i class='${cat.icon} text-2xl text-primary dark:text-white'></i>
            <h3 class='font-bold text-xl text-primary dark:text-light'>${
              cat.category
            }</h3>
        </div>
        <div class='flex flex-wrap gap-3 mt-2'>
            ${cat.skills
              .map(
                (skill) =>
                  `<span class='inline-block px-4 py-1 rounded-lg bg-primary/20 dark:bg-light/20 text-primary dark:text-light text-base font-semibold shadow hover:bg-primary/30 dark:hover:bg-light/30 transition-colors duration-200'>${skill}</span>`
              )
              .join("")}
        </div>
    </div>
`
      )
      .join("");
  } catch (error) {
    document.getElementById("skills-grid").innerHTML =
      '<p class="text-red-500 dark:text-red-400">Error loading skills</p>';
  }
}
document.addEventListener("DOMContentLoaded", loadSkills);

let posterCurrentSlide = 0;
let interfaceCurrentSlide = 0;

async function loadProjectImages() {
  try {
    const response = await fetch("datas/graphics.json");
    const data = await response.json();
    const slider = document.getElementById("poster-slider");
    let slides = [];
    const isMobile = window.innerWidth < 1420;
    // Hide View All button if mobile
    if (viewAllBtn) {
      viewAllBtn.style.display = isMobile ? "none" : "";
    }
    const imageTypes = ["sports", "dentalArch"];
    if (isMobile) {
      slides.push('<div class="grid grid-cols-2 gap-2 w-full">');
      imageTypes.forEach((type) => {
        if (data[type]) {
          data[type].forEach((imgObj) => {
            slides.push(`
                            <div class='group overflow-hidden w-full p-1 cursor-pointer'>
                                <div class='relative overflow-hidden rounded-xl'>
                                    <img 
                                        src='assets/projects/graphics/${type}/${imgObj.image}' 
                                        alt='${type} Poster' 
                                        class='w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110'
                                        loading="lazy"
                                    >
                                    <div class='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                    </div>
                                </div>
                            </div>
                        `);
          });
        }
      });
      slides.push("</div>");
      // Hide navigation buttons on mobile
      document.getElementById("posterPrev").style.display = "none";
      document.getElementById("posterNext").style.display = "none";
    } else {
      if (data.sports) {
        data.sports.forEach((imgObj) => {
          slides.push(`<div class='overflow-hidden min-w-[300px] max-w-[300px] snap-start p-1'>
                        <img src='assets/projects/graphics/sports/${imgObj.image}' alt='Sports Poster' class='w-[280px] h-[280px] object-cover transition-transform duration-300 hover:scale-105 rounded-xl'>
                    </div>`);
        });
      }
      if (data.dentalArch) {
        data.dentalArch.forEach((imgObj) => {
          slides.push(`<div class='overflow-hidden min-w-[300px] max-w-[300px] snap-start p-1'>
                        <img src='assets/projects/graphics/dentalArch/${imgObj.image}' alt='Dental Arch Poster' class='w-[280px] h-[280px] object-cover transition-transform duration-300 hover:scale-105 rounded-xl'>
                    </div>`);
        });
      }
      document.getElementById("posterPrev").style.display = "";
      document.getElementById("posterNext").style.display = "";
    }
    slider.innerHTML = slides.join("");

    // Add click handlers for poster navigation
    document.getElementById("posterNext").onclick = function () {
      const slideWidth = 260;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      posterCurrentSlide = Math.min(posterCurrentSlide + slideWidth, maxScroll);
      slider.style.transform = `translateX(-${posterCurrentSlide}px)`;
    };

    document.getElementById("posterPrev").onclick = function () {
      const slideWidth = 260;
      posterCurrentSlide = Math.max(posterCurrentSlide - slideWidth, 0);
      slider.style.transform = `translateX(-${posterCurrentSlide}px)`;
    };
  } catch (error) {
    document.getElementById("poster-slider").innerHTML =
      '<p class="text-red-500">Error loading project images</p>';
  }
}

async function loadInterfaceImages() {
  try {
    const response = await fetch("datas/interfaceProjects.json");
    const data = await response.json();
    const slider = document.getElementById("interface-slider");
    let slides = [];
    const isMobile = window.innerWidth < 1420;
    if (data.interface) {
      if (isMobile) {
        // 1-column grid for mobile
        slides.push('<div class="grid grid-cols-1 gap-2 w-full">');
        data.interface.forEach((imgObj) => {
          slides.push(`
                        <div class='overflow-hidden w-full p-2'>
                            <img src='assets/projects/interface/${imgObj.image}' alt='Interface Design' class='w-full aspect-[16/9] object-cover transition-transform duration-300 hover:scale-105 rounded-xl'>
                        </div>
                    `);
        });
        slides.push("</div>");
        // Hide navigation buttons on mobile
        document.getElementById("interfacePrev").style.display = "none";
        document.getElementById("interfaceNext").style.display = "none";
      } else {
        data.interface.forEach((imgObj) => {
          slides.push(`<div class='overflow-hidden min-w-[210px] max-w-[210px] sm:min-w-[320px] sm:max-w-[320px] md:min-w-[560px] md:max-w-[560px] snap-start p-2'>
                        <img src='assets/projects/interface/${imgObj.image}' alt='Interface Design' class='w-[200px] h-[112px] sm:w-[300px] sm:h-[170px] md:w-[540px] md:h-[300px] object-cover transition-transform duration-300 hover:scale-105 rounded-xl'>
                    </div>`);
        });
        document.getElementById("interfacePrev").style.display = "";
        document.getElementById("interfaceNext").style.display = "";
      }
    }
    // Add click handlers for interface navigation
    document.getElementById("interfaceNext").onclick = function () {
      const slideWidth = 560; // Adjust this based on your slide width
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      interfaceCurrentSlide = Math.min(
        interfaceCurrentSlide + slideWidth,
        maxScroll
      );
      slider.style.transform = `translateX(-${interfaceCurrentSlide}px)`;
    };

    document.getElementById("interfacePrev").onclick = function () {
      const slideWidth = 560; // Adjust this based on your slide width
      interfaceCurrentSlide = Math.max(interfaceCurrentSlide - slideWidth, 0);
      slider.style.transform = `translateX(-${interfaceCurrentSlide}px)`;
    };
    slider.innerHTML = slides.join("");
  } catch (error) {
    document.getElementById("interface-slider").innerHTML =
      '<p class="text-red-500">Error loading interface images</p>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjectImages();
  loadInterfaceImages();
});

// View All functionality for project carousel
const viewAllBtn = document.getElementById("viewAllBtn");
const posterSlider = document.getElementById("poster-slider");
let isViewAll = false;
if (viewAllBtn && posterSlider) {
  if (window.innerWidth < 640) {
    viewAllBtn.style.display = "none";
  } else {
    viewAllBtn.style.display = "";
    viewAllBtn.addEventListener("click", () => {
      isViewAll = !isViewAll;
      if (isViewAll) {
        // Change to grid layout and minimize gap
        posterSlider.parentElement.style.maxWidth = "none";
        posterSlider.classList.remove(
          "flex",
          "transition-transform",
          "duration-500",
          "ease-in-out"
        );
        posterSlider.classList.add(
          "grid",
          "grid-cols-2",
          "sm:grid-cols-3",
          "md:grid-cols-4",
          "gap-2"
        );
        // Remove transform
        posterSlider.style.transform = "";
        // Hide navigation buttons
        document.getElementById("posterPrev").style.display = "none";
        document.getElementById("posterNext").style.display = "none";
        viewAllBtn.textContent = "Show Less";
      } else {
        // Restore carousel layout
        posterSlider.parentElement.style.maxWidth = "calc(320px*4)";
        posterSlider.classList.remove(
          "grid",
          "grid-cols-2",
          "sm:grid-cols-3",
          "md:grid-cols-4",
          "gap-2"
        );
        posterSlider.classList.add(
          "flex",
          "transition-transform",
          "duration-500",
          "ease-in-out"
        );
        posterSlider.style.transform = `translateX(-${posterCurrentSlide}px)`;
        document.getElementById("posterPrev").style.display = "";
        document.getElementById("posterNext").style.display = "";
        viewAllBtn.textContent = "View All";
      }
    });
  }
}
// Scroll animation effect for sections
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section.scroll-animate");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-in-view");
        } else {
          entry.target.classList.remove("scroll-in-view");
        }
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((section) => {
    observer.observe(section);
  });
});

function downloadResumePDF() {
  const link = document.createElement("a");
  link.href = "assets/MyResume.pdf";
  link.download = "MyResume.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
