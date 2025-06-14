// DOM Elements communs à toutes les pages
const navbar = document.getElementById("navbar")
const navbarToggle = document.getElementById("navbar-toggle")
const navbarMenu = document.getElementById("navbar-menu")
const currentYearElement = document.getElementById("current-year")

// Set current year in footer
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear()
}

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

// Mobile menu toggle
if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("active")
  })
}

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (navbarMenu.classList.contains("active")) {
      navbarMenu.classList.remove("active")
    }
  })
})

// Scroll animations
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  animatedElements.forEach((element) => {
    observer.observe(element)
  })
})

// Parallax effect for hero sections
window.addEventListener("scroll", () => {
  const heroElements = document.querySelectorAll(".hero-bg")
  const scrolled = window.scrollY

  heroElements.forEach((element) => {
    element.style.transform = `translateY(${scrolled * 0.3}px)`
  })
})




// Ajouter ce code à la fin de votre fichier main.js existant

// Fonction pour créer et afficher le loader
function createLoader() {
  // Créer l'élément de chargement
  const loaderElement = document.createElement('div');
  loaderElement.className = 'loading-page';
  loaderElement.innerHTML = `
      <div class="loader-container">
          <div class="logo-container">
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tr%C3%A9sormy-TdpGGHsokyizxE4zLpG0YMhE2l6vW3.png" alt="Trésors de Banlieues" class="logo-loader">
          </div>
          <div class="loading-bar">
              <div class="loading-progress"></div>
          </div>
          <p class="loading-text">Chargement<span class="loading-dots">...</span></p>
      </div>
  `;
  
  // Ajouter au body
  document.body.appendChild(loaderElement);
  
  // Empêcher le défilement pendant le chargement
  document.body.style.overflow = 'hidden';
  
  return loaderElement;
}

// Fonction pour afficher le loader lors de la navigation
function showLoaderOnNavigation() {
  const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])');
  
  links.forEach(link => {
      link.addEventListener('click', function(e) {
          // Ne pas afficher le loader pour les liens externes ou les ancres
          if (this.hostname !== window.location.hostname || this.getAttribute('href').startsWith('#')) {
              return;
          }
          
          e.preventDefault();
          const href = this.getAttribute('href');
          
          // Créer et afficher le loader
          const loader = createLoader();
          
          // Simuler un temps de chargement puis naviguer
          setTimeout(() => {
              window.location.href = href;
          }, 1000);
      });
  });
}

// Exécuter au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Afficher le loader au chargement initial de la page
  const loader = createLoader();
  
  // Masquer le loader une fois que la page est chargée
  window.addEventListener('load', function() {
      setTimeout(() => {
          loader.classList.add('fade-out');
          setTimeout(() => {
              loader.remove();
              document.body.style.overflow = '';
          }, 500);
      }, 1000);
  });
  
  // Configurer le loader pour la navigation entre les pages
  showLoaderOnNavigation();
});
