// Scroll animations
function animateOnScroll() {
  const elements = document.querySelectorAll(".fade-in");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible");
    }
  });
}

// Header background change on scroll
function handleHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;
  if (window.scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.98)";
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "none";
  }
}

// Mobile menu toggle
function setupMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  mobileMenu.addEventListener("click", () => {
    navLinks.style.display =
      navLinks.style.display === "flex" ? "none" : "flex";
    navLinks.style.position = "absolute";
    navLinks.style.top = "100%";
    navLinks.style.left = "0";
    navLinks.style.right = "0";
    navLinks.style.background = "white";
    navLinks.style.flexDirection = "column";
    navLinks.style.padding = "1rem";
    navLinks.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  });
}

// Inicializa GLightbox para que al hacer click en una imagen con class="glightbox" se abra a pantalla completa.
function initializeGLightbox() {
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
  });
}

// Datos de las marcas de speakers
const brands = [
  {
    id: 1,
    name: "Yamaha",
    logo: "https://logos-world.net/wp-content/uploads/2020/11/Yamaha-Motor-Company-Logo-1964-present.png",
  },
  {
    id: 2,
    name: "JBL",
    logo: "https://logos-world.net/wp-content/uploads/2020/12/JBL-Symbol.png",
  },
  {
    id: 3,
    name: "Bose",
    logo: "https://logos-world.net/wp-content/uploads/2023/01/Bose-Logo.png",
  },
  {
    id: 4,
    name: "Sony",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png",
  },
  {
    id: 5,
    name: "Pioneer",
    logo: "https://logos-world.net/wp-content/uploads/2023/03/Pioneer-Logo.png",
  },
  {
    id: 10,
    name: "Audio-Technica",
    logo: "https://logos-world.net/wp-content/uploads/2021/02/Audio-Technica-Logo.png",
  },
];

// Función para crear un elemento de marca
function createBrandElement(brand, isClone = false) {
  const brandDiv = document.createElement("div");
  brandDiv.className = "brand-item";
  brandDiv.setAttribute("data-brand", brand.name);

  const img = document.createElement("img");
  img.src = brand.logo;
  img.alt = `Logo ${brand.name}`;
  img.className = "brand-logo";
  img.loading = "lazy";

  // Manejo de errores de carga de imagen
  img.onerror = function () {
    const errorDiv = document.createElement("div");
    errorDiv.className = "brand-error";
    errorDiv.textContent = brand.name;
    brandDiv.replaceChild(errorDiv, img);
  };

  // Manejo de carga exitosa
  img.onload = function () {
    img.style.opacity = "1";
  };

  brandDiv.appendChild(img);

  // Agregar efecto de hover adicional
  brandDiv.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.02)";
  });

  brandDiv.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
  });

  return brandDiv;
}

// Función para inicializar el carousel
function initCarousel() {
  const carousel = document.getElementById("carousel");

  // Limpiar contenido existente
  carousel.innerHTML = "";

  // Crear el primer set de marcas
  brands.forEach((brand) => {
    carousel.appendChild(createBrandElement(brand));
  });

  // Crear el segundo set de marcas (duplicado para efecto infinito)
  brands.forEach((brand) => {
    carousel.appendChild(createBrandElement(brand, true));
  });

  // Mostrar el carousel con animación
  setTimeout(() => {
    carousel.classList.remove("loading");
  }, 100);
}

// Función para pausar/reanudar animación basada en visibilidad
function setupVisibilityControl() {
  const carousel = document.getElementById("carousel");

  // Pausar cuando la página no está visible
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      carousel.style.animationPlayState = "paused";
    } else {
      carousel.style.animationPlayState = "running";
    }
  });

  // Usar Intersection Observer para pausar cuando no está en viewport
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const carousel = entry.target;
          if (entry.isIntersecting) {
            carousel.style.animationPlayState = "running";
          } else {
            carousel.style.animationPlayState = "paused";
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(carousel);
  }
}

// Función para ajustar la velocidad del carousel según el tamaño de pantalla
function adjustCarouselSpeed() {
  const carousel = document.getElementById("carousel");
  const screenWidth = window.innerWidth;

  let duration;
  if (screenWidth < 480) {
    duration = "50s";
  } else if (screenWidth < 768) {
    duration = "40s";
  } else {
    duration = "30s";
  }

  carousel.style.animationDuration = duration;
}

// Función para manejar el redimensionamiento de ventana
function handleResize() {
  adjustCarouselSpeed();
}

// Initialize all functionality
document.addEventListener("DOMContentLoaded", function () {
  // Set up scroll events
  window.addEventListener("scroll", () => {
    animateOnScroll();
    handleHeaderScroll();
  });

  // Initialize components
  setupMobileMenu();
  initializeGLightbox();
  initCarousel();
  adjustCarouselSpeed();
  setupVisibilityControl();

  // Trigger initial animation check
  animateOnScroll();

  // Add loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);

  // Agregar listener para redimensionamiento con debounce
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });
});
