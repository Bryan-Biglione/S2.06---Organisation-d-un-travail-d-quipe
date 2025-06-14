// Script spécifique pour le slider de la page édition 2025
document.addEventListener("DOMContentLoaded", () => {
  // Corriger le bouton "next" pour qu'il utilise le même style que "prev"
  const nextBtn = document.getElementById("next")
  if (nextBtn) {
    // Supprimer le contenu textuel existant
    nextBtn.textContent = ""
  }

  // Éléments du slider
  const sliderContainer = document.querySelector(".slider")
  const sliderList = document.querySelector(".slider .list")
  const sliderItems = document.querySelectorAll(".slider .list .item")
  const thumbnailContainer = document.querySelector(".slider .thumbnail")
  const prevBtn = document.getElementById("prev")

  // Supprimer l'indicateur de thème s'il existe
  const themeIndicator = document.querySelector(".theme-indicator")
  if (themeIndicator) {
    themeIndicator.remove()
  }

  // S'assurer que toutes les miniatures sont créées
  function ensureAllThumbnails() {
    // Vérifier si le conteneur de miniatures existe
    if (!thumbnailContainer) return

    // Obtenir les miniatures existantes
    const existingThumbnails = thumbnailContainer.querySelectorAll(".item")

    // Si nous avons déjà le bon nombre de miniatures, ne rien faire
    if (existingThumbnails.length >= sliderItems.length) return

    // Sinon, créer les miniatures manquantes
    for (let i = existingThumbnails.length; i < sliderItems.length; i++) {
      // Obtenir l'image et le titre du slide correspondant
      const slideImg = sliderItems[i].querySelector("img").src
      const slideTitle = sliderItems[i].querySelector(".content h2")?.textContent || `Thème ${i + 1}`

      // Créer la nouvelle miniature
      const newThumbnail = document.createElement("div")
      newThumbnail.className = "item"
      newThumbnail.innerHTML = `
        <img src="${slideImg}">
        <div class="content">${slideTitle}</div>
      `

      // Ajouter l'événement de clic
      newThumbnail.addEventListener("click", () => {
        showSlide(i)
        resetAutoplay()
      })

      // Ajouter la miniature au conteneur
      thumbnailContainer.appendChild(newThumbnail)
    }
  }

  // Ajuster la position des flèches
  function adjustArrowsPosition() {
    if (prevBtn) {
      prevBtn.style.position = "absolute"
      prevBtn.style.left = "20px"
    }

    if (nextBtn) {
      nextBtn.style.position = "absolute"
      nextBtn.style.right = "20px"
    }
  }

  // Variables
  let activeIndex = 0
  let autoplayInterval
  const totalItems = sliderItems.length

  // Initialisation
  function initSlider() {
    // S'assurer que toutes les miniatures sont créées
    ensureAllThumbnails()

    // Ajuster la position des flèches
    adjustArrowsPosition()

    // Obtenir les miniatures mises à jour
    const thumbnailItems = thumbnailContainer ? thumbnailContainer.querySelectorAll(".item") : []

    // Ajouter les événements aux miniatures
    thumbnailItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        showSlide(index)
        resetAutoplay()
        return false
      })
    })

    // Ajouter les événements aux boutons
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault()
        goToPrevSlide()
        resetAutoplay()
        return false
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault()
        goToNextSlide()
        resetAutoplay()
        return false
      })
    }

    // Ajouter les événements clavier
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevSlide()
        resetAutoplay()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        goToNextSlide()
        resetAutoplay()
      }
    })

    // Démarrer l'autoplay
    startAutoplay()

    // Pause de l'autoplay au survol du slider
    sliderContainer.addEventListener("mouseenter", () => {
      clearInterval(autoplayInterval)
    })

    // Reprise de l'autoplay quand la souris quitte le slider
    sliderContainer.addEventListener("mouseleave", () => {
      startAutoplay()
    })

    // Afficher le premier slide
    showSlide(activeIndex)
  }

  // Démarrer l'autoplay
  function startAutoplay() {
    clearInterval(autoplayInterval)
    autoplayInterval = setInterval(() => {
      goToNextSlide()
    }, 30000) // 30 secondes
  }

  // Réinitialiser l'autoplay
  function resetAutoplay() {
    clearInterval(autoplayInterval)
    startAutoplay()
  }

  // Afficher un slide spécifique
  function showSlide(index) {
    // Obtenir les miniatures mises à jour
    const thumbnailItems = thumbnailContainer ? thumbnailContainer.querySelectorAll(".item") : []

    // Masquer tous les slides
    sliderItems.forEach((item) => {
      item.classList.remove("active")
    })

    // Désactiver toutes les miniatures
    thumbnailItems.forEach((item) => {
      item.classList.remove("active")
    })

    // Afficher le slide actif
    sliderItems[index].classList.add("active")

    // Activer la miniature correspondante si elle existe
    if (thumbnailItems[index]) {
      thumbnailItems[index].classList.add("active")

      // Calculer la position pour que la miniature active soit visible
      // avec 1-2 miniatures avant et après si possible
      const thumbnailWidth = thumbnailItems[index].offsetWidth + 10 // Largeur + marge

      // Calculer la position pour montrer la miniature active avec quelques miniatures avant
      let scrollPosition

      // Si nous sommes sur la première miniature, s'assurer qu'elle est complètement visible
      if (index === 0) {
        scrollPosition = 0
      }
      // Si nous sommes sur la dernière miniature ou proche de la fin, s'assurer que les dernières sont complètement visibles
      else if (index >= thumbnailItems.length - 3) {
        // Calculer la position maximale de défilement pour voir les dernières miniatures
        scrollPosition = thumbnailContainer.scrollWidth - thumbnailContainer.clientWidth

        // S'assurer que la position n'est pas négative
        if (scrollPosition < 0) scrollPosition = 0
      }
      // Si nous sommes près du début, rester au début
      else if (index < 2) {
        scrollPosition = 0
      }
      // Sinon, centrer la miniature active avec 1-2 miniatures avant
      else {
        scrollPosition = (index - 1) * thumbnailWidth
      }

      // Appliquer le défilement
      thumbnailContainer.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }

    // Mettre à jour l'index actif
    activeIndex = index
  }

  // Aller au slide précédent
  function goToPrevSlide() {
    let newIndex = activeIndex - 1
    if (newIndex < 0) {
      newIndex = totalItems - 1
    }
    showSlide(newIndex)
  }

  // Aller au slide suivant
  function goToNextSlide() {
    let newIndex = activeIndex + 1
    if (newIndex >= totalItems) {
      newIndex = 0
    }
    showSlide(newIndex)
  }

  // Initialiser le slider
  initSlider()
})

// Fonctions communes du site
document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.getElementById("navbar")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  const navbarToggle = document.getElementById("navbar-toggle")
  const navbarMenu = document.getElementById("navbar-menu")
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener("click", () => {
      navbarMenu.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarMenu && navbarMenu.classList.contains("active")) {
        navbarMenu.classList.remove("active")
      }
    })
  })

  // Set current year in footer
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Scroll animations
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

  // Parallax effect for hero sections
  const heroElements = document.querySelectorAll(".hero-bg")
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY
    heroElements.forEach((element) => {
      element.style.transform = `translateY(${scrolled * 0.3}px)`
    })
  })

  // Initialiser le widget de traduction
  initTranslationWidget()
})

// Widget de traduction - Code simplifié
function initTranslationWidget() {
  // Sélectionner les éléments du widget
  const planet = document.querySelector(".planet")
  const options = document.querySelector(".language-options")
  const languageOptions = document.querySelectorAll(".language-option")

  if (!planet || !options) {
    console.error("Widget de traduction non trouvé")
    return
  }

  // Ouvrir/fermer le menu des langues au clic sur la planète
  planet.addEventListener("click", (e) => {
    e.stopPropagation()
    options.classList.toggle("active")

    // Animation de la planète
    if (options.classList.contains("active")) {
      planet.style.animation = "rotate 5s linear infinite, pulse 2s infinite"
    } else {
      planet.style.animation = "rotate 20s linear infinite"
    }
  })

  // Fermer le menu si on clique ailleurs sur la page
  document.addEventListener("click", () => {
    if (options.classList.contains("active")) {
      options.classList.remove("active")
      planet.style.animation = "rotate 20s linear infinite"
    }
  })

  // Empêcher la propagation du clic sur le menu
  options.addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Gérer le clic sur une option de langue
  languageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang")
      changeLanguage(lang)
      options.classList.remove("active")
    })
  })
}

// Fonction pour changer la langue
function changeLanguage(lang) {
  console.log(`Changement de langue vers: ${lang}`)

  // Afficher un indicateur de chargement
  const loadingIndicator = document.createElement("div")
  loadingIndicator.style.position = "fixed"
  loadingIndicator.style.top = "50%"
  loadingIndicator.style.left = "50%"
  loadingIndicator.style.transform = "translate(-50%, -50%)"
  loadingIndicator.style.backgroundColor = "var(--red-primary)"
  loadingIndicator.style.color = "white"
  loadingIndicator.style.padding = "20px 30px"
  loadingIndicator.style.borderRadius = "10px"
  loadingIndicator.style.zIndex = "9999"

  // Texte de chargement selon la langue
  const loadingText = {
    fr: "Traduction en cours...",
    en: "Translating...",
    es: "Traduciendo...",
    ja: "翻訳中...",
  }

  loadingIndicator.textContent = loadingText[lang] || loadingText["en"]
  document.body.appendChild(loadingIndicator)

  // Simuler un délai de traduction
  setTimeout(() => {
    // Traduire la page
    translatePage(lang)

    // Retirer l'indicateur de chargement
    document.body.removeChild(loadingIndicator)

    // Mettre à jour l'attribut lang de la page
    document.documentElement.lang = lang
  }, 1000)
}

// Fonction pour traduire la page
function translatePage(lang) {
  // Dictionnaire de traduction complet
  const translations = {
    fr: {
      // Navbar
      "nav-link-1": "Exposition 2026",
      "nav-link-2": "Édition 2025",
      "nav-link-3": "Notre Équipe",

      // Hero section
      "hero-title": "Édition 2025",
      "hero-subtitle":
        "Du 15 février au 13 avril 2025, les Trésors de Banlieues ont accueilli plus de 22,000 visiteurs pour une célébration unique de l'art urbain contemporain.",

      // Première section - Rétrospective
      "first-section-title": "2025年イベント回顧",
      "first-section-text-1": "Entre tradition et modernité, l'édition 2025 de Trésors de Banlieues à amorcer la résurrection du projet, pourtant absent pendant plusieurs année. La diversité des œuvres et des thèmes abordés a su attirer un publique hétéroclite et engendrant une popularité inoui, marquant l'histoire de l'exposition.",
      "first-section-text-2": "Venez donc découvrir (ou redécouvrir) l'édition 2025 de Trésor de banlieue !",

      // Stats
      "stat-label-1": "Visiteurs",
      "stat-label-2": "Artistes",
      "stat-label-3": "Jours",
      "stat-value-1": "17,000+",
      "stat-value-2": "45",
      "stat-value-3": "60",

      // Section Retour
      "section-title": "Retour sur l'exposition",
      "section-text-1":
        "L'édition 2025 des Trésors de Banlieues a été un véritable succès, réunissant artistes, amateurs d'art et curieux autour d'une programmation riche et diversifiée. Pendant deux mois, notre espace d'exposition s'est transformé en un lieu de rencontres, d'échanges et de découvertes artistiques.",
      "section-text-2":
        "Cette édition a mis en lumière la richesse et la diversité de l'art urbain contemporain, à travers des œuvres qui questionnent notre rapport à la ville, à l'identité et à la mémoire collective.",

      // Additional sections
      "return-title": "Un retour 5 ans plus tard",
      "return-text-1":
        "Face au succès de la première édition de l'exposition en 2019, l'association L'Académie des Banlieues et la ville de Gennevilliers ont décidé de renouveler l'expérience six ans plus tard. Bien qu'à l'origine, cette deuxième édition ait été prévue pour 2024, des difficultés liées au budget, à la disponibilité des œuvres et à l'emplacement ont contraint l'organisation à repousser l'exposition d'un an.",
      "return-text-2":
        "La principale difficulté était de trouver les fonds nécessaires pour permettre à l'événement d'avoir lieu. En 2025, l'association a dû assurer elle-même son financement, contrairement à 2019, où l'exposition était principalement soutenue par des aides régionales. Cette année, Manuel Alvarez, l'organisateur de l'exposition, nous a expliqué qu'ils avaient opté pour du mécénat d'entreprise, ce qui a permis de couvrir les nombreux coûts, tels que la sécurité (au même niveau que celle d'un musée national), ainsi que le transport des œuvres, venant de toute la France et, la location du lieu.",
      "popular-title": "Un événement populaire",
      "popular-text-1":
        "Personnes âgées, écoliers, habitants de la banlieue, étrangers… Cette année encore, l'exposition a réussi à toucher un public extrêmement large, composé de toutes catégories sociales et géographiques. Avec ses 15 000 visiteurs, l'édition 2025 de Trésor de Banlieue fut une franche réussite, aussi bien pour les organisateurs que pour la banlieue elle-même, rapprochant toutes les populations par le biais de l'art sous toutes ses formes. Pour Manuel Alvarez, c'est cette diversité des œuvres et des visiteurs qui représente la banlieue :",
      "popular-text-2":
        "« Ce qui est très important dans cette exposition, c'est d'illustrer la diversité. Ce qui caractérise la banlieue, c'est la diversité. » La banlieue est une part essentielle de la France, mise en valeur à travers les onze thèmes et les différentes œuvres de l'exposition. L'enfance, Napoléon, l'impressionnisme… Tous ces thèmes sont avant tout des thèmes de la banlieue. « C'est en banlieue que se crée toute la richesse de l'Île-de-France et de la France. Avant d'arriver dans les galeries parisiennes, c'est en banlieue que l'art se travaille, que l'inspiration naît. […] Ce serait un non-sens d'organiser cette exposition à Paris. Il faut la garder en banlieue, et si possible, dans la banlieue ouvrière. » nous confie M. Alvarez.",

      // Thématiques
      "themes-title": "Les 11 Thématiques",
      "themes-subtitle": "Découvrez les différentes facettes de l'exposition à travers ses thèmes principaux",

      // Thèmes individuels
      "theme-label": "Thème",
      "theme-1-title": "Une enfance en banlieue",
      "theme-1-desc": "Exploration des souvenirs et expériences de jeunesse dans les quartiers périphériques.",
      "theme-2-title": "Logement et cadre de vie au coeur des inégalités sociales",
      "theme-2-desc": "Exploration des identités multiples qui se forgent dans l'environnement urbain.",
      "theme-3-title": "D'Eglises en Cathédrales",
      "theme-3-desc": "Regard sur l'habitat et les conditions de vie en banlieue.",
      "theme-4-title": 'Napoléon, ex "petit caporal"',
      "theme-4-desc": "Exploration de l'histoire partagée des communautés de banlieue.",
      "theme-5-title": "1870-71, 14-18, 39-45, 46-54, 54-62 : de chiffres et des larmes",
      "theme-5-desc": "Célébration des expressions artistiques nées dans les quartiers périphériques.",
      "theme-6-title": "Mémoires familiales, paysannes et ouvrières du siècle dernier",
      "theme-6-desc": "Exploration des déplacements et des flux dans l'espace urbain.",
      "theme-7-title": "Le bestiaire des banlieues",
      "theme-7-desc": "Regard sur les liens sociaux et les réseaux d'entraide en banlieue.",
      "theme-8-title": "L'Impressionnisme en banlieue",
      "theme-8-desc": "Exploration des mutations des paysages urbains périphériques.",
      "theme-9-title": "Quand les portraits composent la plus belle parure des banlieues",
      "theme-9-desc": "Regard sur les enjeux environnementaux dans les quartiers périphériques.",
      "theme-10-title": "Arts décoratifs et ameublement d'art",
      "theme-10-desc":
        "Réflexions et projections sur le futur des quartiers périphériques et leur développement durable.",
      "theme-11-title": "Figures de la République en banlieue",
      "theme-11-desc":
        "Réflexions et projections sur le futur des quartiers périphériques et leur développement durable.",

      // CTA
      "cta-title": "Prêt pour l'édition 2026 ?",
      "cta-text":
        "Ne manquez pas la prochaine édition des Trésors de Banlieues qui promet d'être encore plus spectaculaire.",
      "cta-button": "Découvrir l'édition 2026",

      // Footer
      "footer-title-1": "Trésors de Banlieues",
      "footer-text": "Une exposition d'art urbain célébrant la créativité et la diversité culturelle des banlieues.",
      "footer-links-title": "Liens Rapides",
      "footer-link-1": "Exposition 2026",
      "footer-link-2": "Édition 2025",
      "footer-link-3": "Notre Équipe",
      "footer-contact": "Contact",
      "footer-address-1": "Halle des Grésillons",
      "footer-address-2": "Place Indira Gandhi",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email:",
      "footer-tel": "Tél: 01 23 45 67 89",
      "footer-copyright": "Tous droits réservés.",
    },
    en: {
      // Navbar
      "nav-link-1": "2026 Exhibition",
      "nav-link-2": "2025 Edition",
      "nav-link-3": "Our Team",

      // Hero section
      "hero-title": "2025 Edition",
      "hero-subtitle":
        "From February 15 to April 13, 2025, Trésors de Banlieues welcomed over 22,000 visitors for a unique celebration of contemporary urban art.",

      // Première section - Rétrospective
      "first-section-title": "2025 Event Retrospective",
      "first-section-text-1": "Between tradition and modernity, the 2025 edition of Trésors de Banlieues initiated the resurrection of the project, despite its absence for several years. The diversity of works and themes addressed attracted a heterogeneous audience and generated unprecedented popularity, marking the history of the exhibition.",
      "first-section-text-2": "Come discover (or rediscover) the 2025 edition of Trésor de banlieue!",

      // Stats
      "stat-label-1": "Visitors",
      "stat-label-2": "Artists",
      "stat-label-3": "Days",
      "stat-value-1": "17,000+",
      "stat-value-2": "45",
      "stat-value-3": "60",

      // Section Retour
      "section-title": "Exhibition Review",
      "section-text-1":
        "The 2025 edition of Trésors de Banlieues was a real success, bringing together artists, art lovers and curious people around a rich and diverse program. For two months, our exhibition space was transformed into a place of meetings, exchanges and artistic discoveries.",
      "section-text-2":
        "This edition highlighted the richness and diversity of contemporary urban art, through works that question our relationship to the city, identity and collective memory.",

      // Additional sections
      "return-title": "A return 5 years later",
      "return-text-1":
        "Following the success of the first edition of the exhibition in 2019, the Académie des Banlieues association and the city of Gennevilliers decided to renew the experience six years later. Although this second edition was originally planned for 2024, difficulties related to budget, availability of works, and location forced the organization to postpone the exhibition for a year.",
      "return-text-2":
        "The main difficulty was finding the necessary funds to allow the event to take place. In 2025, the association had to secure its own funding, unlike in 2019, when the exhibition was mainly supported by regional aid. This year, Manuel Alvarez, the exhibition organizer, explained that they opted for corporate sponsorship, which covered the many costs, such as security (at the same level as a national museum), as well as the transport of works from all over France, and the rental of the venue.",
      "popular-title": "A popular event",
      "popular-text-1":
        "Elderly people, schoolchildren, suburban residents, foreigners... Once again this year, the exhibition managed to reach an extremely wide audience, composed of all social and geographical categories. With its 15,000 visitors, the 2025 edition of Trésor de Banlieue was a resounding success, both for the organizers and for the suburb itself, bringing together all populations through art in all its forms. For Manuel Alvarez, it is this diversity of works and visitors that represents the suburb:",
      "popular-text-2":
        '"What is very important in this exhibition is to illustrate diversity. What characterizes the suburb is diversity." The suburb is an essential part of France, highlighted through the eleven themes and different works of the exhibition. Childhood, Napoleon, Impressionism... All these themes are above all themes of the suburb. "It is in the suburbs that all the wealth of the Île-de-France and France is created. Before arriving in Parisian galleries, it is in the suburbs that art is worked on, that inspiration is born. [...] It would be nonsensical to organize this exhibition in Paris. It must be kept in the suburbs, and if possible, in the working-class suburbs," Mr. Alvarez tells us.',

      // Thématiques
      "themes-title": "The 11 Themes",
      "themes-subtitle": "Discover the different facets of the exhibition through its main themes",

      // Thèmes individuels
      "theme-label": "Theme",
      "theme-1-title": "Childhood in the Suburbs",
      "theme-1-desc": "Exploration of memories and youth experiences in peripheral neighborhoods.",
      "theme-2-title": "Housing and Living Environment at the Heart of Social Inequalities",
      "theme-2-desc": "Exploration of multiple identities forged in the urban environment.",
      "theme-3-title": "From Churches to Cathedrals",
      "theme-3-desc": "A look at housing and living conditions in the suburbs.",
      "theme-4-title": 'Napoleon, former "little corporal"',
      "theme-4-desc": "Exploration of the shared history of suburban communities.",
      "theme-5-title": "1870-71, 14-18, 39-45, 46-54, 54-62: Numbers and Tears",
      "theme-5-desc": "Celebration of artistic expressions born in peripheral neighborhoods.",
      "theme-6-title": "Family, Peasant and Worker Memories of the Last Century",
      "theme-6-desc": "Exploration of movements and flows in urban space.",
      "theme-7-title": "The Bestiary of the Suburbs",
      "theme-7-desc": "A look at social ties and support networks in the suburbs.",
      "theme-8-title": "Impressionism in the Suburbs",
      "theme-8-desc": "Exploration of the mutations of peripheral urban landscapes.",
      "theme-9-title": "When Portraits Compose the Most Beautiful Adornment of the Suburbs",
      "theme-9-desc": "A look at environmental issues in peripheral neighborhoods.",
      "theme-10-title": " A look at environmental issues in peripheral neighborhoods.",
      "theme-10-title": "Decorative Arts and Art Furniture",
      "theme-10-desc":
        "Reflections and projections on the future of peripheral neighborhoods and their sustainable development.",
      "theme-11-title": "Figures of the Republic in the Suburbs",
      "theme-11-desc":
        "Reflections and projections on the future of peripheral neighborhoods and their sustainable development.",

      // CTA
      "cta-title": "Ready for the 2026 edition?",
      "cta-text": "Don't miss the next edition of Trésors de Banlieues which promises to be even more spectacular.",
      "cta-button": "Discover the 2026 edition",

      // Footer
      "footer-title-1": "Trésors de Banlieues",
      "footer-text": "An urban art exhibition celebrating the creativity and cultural diversity of the suburbs.",
      "footer-links-title": "Quick Links",
      "footer-link-1": "2026 Exhibition",
      "footer-link-2": "2025 Edition",
      "footer-link-3": "Our Team",
      "footer-contact": "Contact",
      "footer-address-1": "Halle des Grésillons",
      "footer-address-2": "Place Indira Gandhi",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email:",
      "footer-tel": "Phone: 01 23 45 67 89",
      "footer-copyright": "All rights reserved.",
    },
    es: {
      // Navbar
      "nav-link-1": "Exposición 2026",
      "nav-link-2": "Edición 2025",
      "nav-link-3": "Nuestro Equipo",

      // Hero section
      "hero-title": "Edición 2025",
      "hero-subtitle":
        "Del 15 de febrero al 13 dee abril de 2025, Trésors de Banlieues recibió a más de 22.000 visitantes para una celebración única del arte urbano contemporáneo.",

      // Première section - Rétrospective
      "first-section-title": "Retrospectiva del evento 2025",
      "first-section-text-1": "Entre tradición y modernidad, la edición 2025 de Trésors de Banlieues inició la resurrección del proyecto, a pesar de su ausencia durante varios años. La diversidad de obras y temas abordados atrajo a un público heterogéneo y generó una popularidad sin precedentes, marcando la historia de la exposición.",
      "first-section-text-2": "¡Venga a descubrir (o redescubrir) la edición 2025 de Trésor de banlieue!",

      // Stats
      "stat-label-1": "Visitantes",
      "stat-label-2": "Artistas",
      "stat-label-3": "Días",
      "stat-value-1": "17,000+",
      "stat-value-2": "45",
      "stat-value-3": "60",

      // Section Retour
      "section-title": "Revisión de la exposición",
      "section-text-1":
        "La edición 2025 de Trésors de Banlieues fue un verdadero éxito, reuniendo a artistas, amantes del arte y curiosos en torno a un programa rico y diverso. Durante dos meses, nuestro espacio de exposición se transformó en un lugar de encuentros, intercambios y descubrimientos artísticos.",
      "section-text-2":
        "Esta edición destacó la riqueza y diversidad del arte urbano contemporáneo, a través de obras que cuestionan nuestra relación con la ciudad, la identidad y la memoria colectiva.",

      // Additional sections
      "return-title": "Un regreso 5 años después",
      "return-text-1":
        "Tras el éxito de la primera edición de la exposición en 2019, la asociación Académie des Banlieues y la ciudad de Gennevilliers decidieron renovar la experiencia seis años después. Aunque esta segunda edición estaba originalmente prevista para 2024, dificultades relacionadas con el presupuesto, la disponibilidad de obras y la ubicación obligaron a la organización a posponer la exposición por un año.",
      "return-text-2":
        "La principal dificultad fue encontrar los fondos necesarios para permitir que el evento tuviera lugar. En 2025, la asociación tuvo que asegurar su propio financiamiento, a diferencia de 2019, cuando la exposición fue apoyada principalmente por ayudas regionales. Este año, Manuel Alvarez, el organizador de la exposición, explicó que optaron por el patrocinio corporativo, que cubrió los numerosos costos, como la seguridad (al mismo nivel que un museo nacional), así como el transporte de obras de toda Francia, y el alquiler del lugar.",
      "popular-title": "Un evento popular",
      "popular-text-1":
        "Personas mayores, escolares, residentes suburbanos, extranjeros... Una vez más este año, la exposición logró llegar a un público extremadamente amplio, compuesto por todas las categorías sociales y geográficas. Con sus 15.000 visitantes, la edición 2025 de Trésor de Banlieue fue un rotundo éxito, tanto para los organizadores como para el propio suburbio, reuniendo a todas las poblaciones a través del arte en todas sus formas. Para Manuel Alvarez, es esta diversidad de obras y visitantes lo que representa el suburbio:",
      "popular-text-2":
        '"Lo que es muy importante en esta exposición es ilustrar la diversidad. Lo que caracteriza al suburbio es la diversidad." El suburbio es una parte esencial de Francia, destacada a través de los once temas y diferentes obras de la exposición. Infancia, Napoleón, Impresionismo... Todos estos temas son ante todo temas del suburbio. "Es en los suburbios donde se crea toda la riqueza de la Île-de-France y Francia. Antes de llegar a las galerías parisinas, es en los suburbios donde se trabaja el arte, donde nace la inspiración. [...] Sería absurdo organizar esta exposición en París. Debe mantenerse en los suburbios, y si es posible, en los suburbios obreros", nos dice el Sr. Alvarez.',

      // Thématiques
      "themes-title": "Los 11 Temas",
      "themes-subtitle": "Descubre las diferentes facetas de la exposición a través de sus temas principales",

      // Thèmes individuales
      "theme-label": "Tema",
      "theme-1-title": "Una infancia en los suburbios",
      "theme-1-desc": "Exploración de recuerdos y experiencias juveniles en barrios periféricos.",
      "theme-2-title": "Vivienda y entorno de vida en el corazón de las desigualdades sociales",
      "theme-2-desc": "Exploración de identidades múltiples que se forjan en el entorno urbano.",
      "theme-3-title": "De Iglesias a Catedrales",
      "theme-3-desc": "Una mirada a la vivienda y las condiciones de vida en los suburbios.",
      "theme-4-title": 'Napoleón, ex "pequeño cabo"',
      "theme-4-desc": "Exploración de la historia compartida de las comunidades suburbanas.",
      "theme-5-title": "1870-71, 14-18, 39-45, 46-54, 54-62: números y lágrimas",
      "theme-5-desc": "Celebración de expresiones artísticas nacidas en barrios periféricos.",
      "theme-6-title": "Memorias familiares, campesinas y obreras del siglo pasado",
      "theme-6-desc": "Exploración de movimientos y flujos en el espacio urbano.",
      "theme-7-title": "El bestiario de los suburbios",
      "theme-7-desc": "Una mirada a los lazos sociales y las redes de apoyo en los suburbios.",
      "theme-8-title": "El impresionismo en los suburbios",
      "theme-8-desc": "Exploración de las mutaciones de los paisajes urbanos periféricos.",
      "theme-9-title": "Cuando los retratos componen el más bello adorno de los suburbios",
      "theme-9-desc": "Una mirada a los problemas ambientales en los barrios periféricos.",
      "theme-10-title": "Artes decorativas y muebles de arte",
      "theme-10-desc":
        "Reflexiones y proyecciones sobre el futuro de los barrios periféricos y su desarrollo sostenible.",
      "theme-11-title": "Figuras de la República en los suburbios",
      "theme-11-desc":
        "Reflexiones y proyecciones sobre el futuro de los barrios periféricos y su desarrollo sostenible.",

      // CTA
      "cta-title": "¿Listo para la edición 2026?",
      "cta-text": "No te pierdas la próxima edición de Trésors de Banlieues que promete ser aún más espectacular.",
      "cta-button": "Descubrir la edición 2026",

      // Footer
      "footer-title-1": "Trésors de Banlieues",
      "footer-text":
        "Una exposición de arte urbano que celebra la creatividad y la diversidad cultural de los suburbios.",
      "footer-links-title": "Enlaces Rápidos",
      "footer-link-1": "Exposición 2026",
      "footer-link-2": "Edición 2025",
      "footer-link-3": "Nuestro Equipo",
      "footer-contact": "Contacto",
      "footer-address-1": "Halle des Grésillons",
      "footer-address-2": "Place Indira Gandhi",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email:",
      "footer-tel": "Tel: 01 23 45 67 89",
      "footer-copyright": "Todos los derechos reservados.",
    },
    ja: {
      // Navbar
      "nav-link-1": "2026年展示会",
      "nav-link-2": "2025年エディション",
      "nav-link-3": "私たちのチーム",

      // Hero section
      "hero-title": "2025年エディション",
      "hero-subtitle":
        "2025年2月15日から4月13日まで、「トレゾール・ド・バンリュー」は現代都市アートの特別な祭典に22,000人以上の訪問者を迎えました。",

      // Première section - Rétrospective
      "first-section-title": "2025年イベント回顧",
      "first-section-text-1": "伝統と現代性の間で、「トレゾール・ド・バンリュー」2025年エディションは、数年間の不在にもかかわらず、プロジェクトの復活を開始しました。取り上げられた作品やテーマの多様性は、多様な観客を引き付け、前例のない人気を生み出し、展示会の歴史に刻まれました。",
      "first-section-text-2": "「トレゾール・ド・バンリュー」2025年エディションをぜひ発見（または再発見）してください！",

      // Stats
      "stat-label-1": "訪問者",
      "stat-label-2": "アーティスト",
      "stat-label-3": "日数",
      "stat-value-1": "17,000+",
      "stat-value-2": "45",
      "stat-value-3": "60",

      // Section Retour
      "section-title": "展示会レビュー",
      "section-text-1":
        "「トレゾール・ド・バンリュー」2025年エディションは、豊かで多様なプログラムを通じて、アーティスト、アート愛好家、好奇心旺盛な人々を集めた真の成功でした。2ヶ月間、私たちの展示スペースは、出会い、交流、芸術的発見の場に変わりました。",
      "section-text-2":
        "このエディションでは、都市、アイデンティティ、集合的記憶との関係を問いかける作品を通じて、現代都市アートの豊かさと多様性を強調しました。",

      // Additional sections
      "return-title": "5年後の復帰",
      "return-text-1":
        "2019年の展示会の第一回目の成功を受けて、バンリュー・アカデミー協会とジュヌヴィリエ市は6年後に経験を更新することを決定しました。当初、この第二回目は2024年に予定されていましたが、予算、作品の入手可能性、場所に関する困難により、組織は展示会を1年延期せざるを得ませんでした。",
      "return-text-2":
        "主な困難は、イベントを開催するために必要な資金を見つけることでした。2025年には、協会は自らの資金調達を確保する必要がありました。これは2019年とは異なり、その時は展示会は主に地域の援助によってサポートされていました。今年、展示会の主催者であるマニュエル・アルバレスは、企業スポンサーシップを選択したと説明しました。これにより、セキュリティ（国立博物館と同じレベル）、フランス全土からの作品の輸送、会場のレンタルなど、多くのコストをカバーすることができました。",
      "popular-title": "人気のあるイベント",
      "popular-text-1":
        "高齢者、学生、郊外の住民、外国人...今年も展示会は、あらゆる社会的・地理的カテゴリーで構成された非常に幅広い観客に到達することができました。15,000人の訪問者を迎えた2025年版の「トレゾール・ド・バンリュー」は、主催者にとっても郊外自体にとっても大成功でした。あらゆる形のアートを通じてすべての人々を結びつけました。マニュエル・アルバレスにとって、郊外を代表するのはこの作品と訪問者の多様性です：",
      "popular-text-2":
        "「この展示会で非常に重要なのは、多様性を示すことです。郊外を特徴づけるのは多様性です。」郊外はフランスの不可欠な部分であり、展示会の11のテーマと様々な作品を通じて強調されています。子供時代、ナポレオン、印象派...これらのテーマはすべて、何よりもまず郊外のテーマです。「イル・ド・フランスとフランスのすべての富が創造されるのは郊外です。パリのギャラリーに到着する前に、芸術が取り組まれ、インスピレーションが生まれるのは郊外です。[...]この展示会をパリで開催するのは無意味でしょう。郊外に、そして可能であれば労働者階級の郊外に保持する必要があります」とアルバレス氏は語っています。",

      // Thématiques
      "themes-title": "11のテーマ",
      "themes-subtitle": "主要テーマを通じて展示会のさまざまな側面を発見する",

      // Thèmes individuels
      "theme-label": "テーマ",
      "theme-1-title": "郊外での子供時代",
      "theme-1-desc": "周辺地域での思い出と若者の経験の探求。",
      "theme-2-title": "社会的不平等の中心にある住宅と生活環境",
      "theme-2-desc": "都市環境で形成される複数のアイデンティティの探求。",
      "theme-3-title": "教会から大聖堂へ",
      "theme-3-desc": "郊外の住宅と生活条件に関する考察。",
      "theme-4-title": "ナポレオン、元「小さな伍長」",
      "theme-4-desc": "郊外コミュニティの共有された歴史の探求。",
      "theme-5-title": "1870-71、14-18、39-45、46-54、54-62：数字と涙",
      "theme-5-desc": "周辺地域で生まれた芸術表現の祝福。",
      "theme-6-title": "前世紀の家族、農民、労働者の記憶",
      "theme-6-desc": "都市空間における移動と流れの探求。",
      "theme-7-title": "郊外の動物誌",
      "theme-7-desc": "郊外の社会的つながりとサポートネットワークに関する考察。",
      "theme-8-title": "郊外の印象派",
      "theme-8-desc": "周辺都市景観の変化の探求。",
      "theme-9-title": "肖像画が郊外の最も美しい装飾を構成するとき",
      "theme-9-desc": "周辺地域の環境問題に関する考察。",
      "theme-10-title": "装飾芸術と芸術家具",
      "theme-10-desc": "周辺地域の未来とその持続可能な発展に関する考察と予測。",
      "theme-11-title": "郊外の共和国の人物像",
      "theme-11-desc": "周辺地域の未来とその持続可能な発展に関する考察と予測。",

      // CTA
      "cta-title": "2026年エディションの準備はできていますか？",
      "cta-text":
        "さらに壮観になることが約束されている「トレゾール・ド・バンリュー」の次回エディションをお見逃しなく。",
      "cta-button": "2026年エディションを発見する",

      // Footer
      "footer-title-1": "トレゾール・ド・バンリュー",
      "footer-text": "郊外の創造性と文化的多様性を祝う都市アート展。",
      "footer-links-title": "クイックリンク",
      "footer-link-1": "2026年展示会",
      "footer-link-2": "2025年エディション",
      "footer-link-3": "私たちのチーム",
      "footer-contact": "お問い合わせ",
      "footer-address-1": "アル・デ・グレジヨン",
      "footer-address-2": "インディラ・ガンジー広場",
      "footer-address-3": "92230 ジュヌヴィリエ",
      "footer-email": "メール：",
      "footer-tel": "電話：01 23 45 67 89",
      "footer-copyright": "全著作権所有。",
    }
  }

  // Si la langue n'est pas dans notre dictionnaire, ne rien faire
  if (!translations[lang]) return

  // 1. Traduire la navbar
  const navLinks = document.querySelectorAll(".navbar-menu .nav-link")
  if (navLinks.length >= 1) navLinks[0].textContent = translations[lang]["nav-link-1"]
  if (navLinks.length >= 2) navLinks[1].textContent = translations[lang]["nav-link-2"]
  if (navLinks.length >= 3) navLinks[2].textContent = translations[lang]["nav-link-3"]

  // 2. Traduire la section hero
  const heroTitle = document.querySelector(".hero-title")
  const heroSubtitle = document.querySelector(".hero-subtitle")
  if (heroTitle) heroTitle.textContent = translations[lang]["hero-title"]
  if (heroSubtitle) heroSubtitle.textContent = translations[lang]["hero-subtitle"]

  // 3. Traduire la première section (rétrospective)
  const firstSectionTitle = document.querySelector("h2:first-of-type")
  const firstSectionTexts = document.querySelectorAll(".section-grid:first-of-type p")

  if (firstSectionTitle) firstSectionTitle.textContent = translations[lang]["first-section-title"]
  if (firstSectionTexts.length >= 1) firstSectionTexts[0].textContent = translations[lang]["first-section-text-1"]
  if (firstSectionTexts.length >= 2) firstSectionTexts[1].textContent = translations[lang]["first-section-text-2"]

  // 4. Traduire les statistiques
  const statLabels = document.querySelectorAll(".stat-label")
  const statValues = document.querySelectorAll(".stat-value, .stat-number")

  if (statLabels.length >= 1) statLabels[0].textContent = translations[lang]["stat-label-1"]
  if (statLabels.length >= 2) statLabels[1].textContent = translations[lang]["stat-label-2"]
  if (statLabels.length >= 3) statLabels[2].textContent = translations[lang]["stat-label-3"]

  if (statValues.length >= 1) statValues[0].textContent = translations[lang]["stat-value-1"]
  if (statValues.length >= 2) statValues[1].textContent = translations[lang]["stat-value-2"]
  if (statValues.length >= 3) statValues[2].textContent = translations[lang]["stat-value-3"]

  // 5. Traduire la section "Un retour 5 ans plus tard"
  const returnSection = document.querySelector(".return-section")
  if (returnSection) {
    const returnTitle = returnSection.querySelector(".section-title")
    const returnTexts = returnSection.querySelectorAll(".section-text")

    if (returnTitle) returnTitle.textContent = translations[lang]["return-title"]

    // Cibler spécifiquement les paragraphes avec les classes return-text-1 et return-text-2
    const returnText1 = returnSection.querySelector(".return-text-1")
    const returnText2 = returnSection.querySelector(".return-text-2")

    if (returnText1) returnText1.textContent = translations[lang]["return-text-1"]
    if (returnText2) returnText2.textContent = translations[lang]["return-text-2"]
  }

  // 6. Traduire la section "Un événement populaire"
  const popularSection = document.querySelector("#section-populaire")
  if (popularSection) {
    const popularTitle = popularSection.querySelector(".popular-title")
    const popularText1 = popularSection.querySelector(".popular-text-1")
    const popularText2 = popularSection.querySelector(".popular-text-2")

    if (popularTitle) popularTitle.textContent = translations[lang]["popular-title"]
    if (popularText1) popularText1.textContent = translations[lang]["popular-text-1"]
    if (popularText2) popularText2.textContent = translations[lang]["popular-text-2"]
  }

  // 7. Traduire la section des thèmes
  const themesTitle = document.querySelector(".section.bg-beige-dark .section-title")
  const themesSubtitle = document.querySelector(".section.bg-beige-dark .section-text")
  if (themesTitle) themesTitle.textContent = translations[lang]["themes-title"]
  if (themesSubtitle) themesSubtitle.textContent = translations[lang]["themes-subtitle"]

  // 8. Traduire les thèmes individuels dans le slider
  const sliderItems = document.querySelectorAll(".slider .list .item")
  sliderItems.forEach((item, index) => {
    const themeNumber = index + 1
    const themeLabel = item.querySelector(".content p:first-child")
    const themeTitle = item.querySelector(".content h2")
    const themeDesc = item.querySelector(".content p:last-child")

    if (themeLabel) themeLabel.textContent = translations[lang]["theme-label"]
    if (themeTitle)
      themeTitle.textContent = translations[lang][`theme-${themeNumber}-title`] || translations[lang][`theme-11-title`]
    if (themeDesc)
      themeDesc.textContent = translations[lang][`theme-${themeNumber}-desc`] || translations[lang][`theme-11-desc`]
  })

  // 9. Traduire les miniatures du slider
  const thumbnailItems = document.querySelectorAll(".slider .thumbnail .item")
  thumbnailItems.forEach((item, index) => {
    const themeNumber = index + 1
    const themeTitle = item.querySelector(".content")

    if (themeTitle)
      themeTitle.textContent = translations[lang][`theme-${themeNumber}-title`] || translations[lang][`theme-11-title`]
  })

  // 10. Traduire la section CTA
  const ctaTitle = document.querySelector(".cta-title")
  const ctaText = document.querySelector(".cta-text")
  const ctaButton = document.querySelector(".btn-white")
  if (ctaTitle) ctaTitle.textContent = translations[lang]["cta-title"]
  if (ctaText) ctaText.textContent = translations[lang]["cta-text"]
  if (ctaButton) ctaButton.textContent = translations[lang]["cta-button"]

  // 11. Traduire le footer
  const footerTitle = document.querySelector(".footer-title")
  const footerText = document.querySelector(".footer-text")
  const footerLinksTitle = document.querySelector(".footer-links").previousElementSibling
  const footerLinks = document.querySelectorAll(".footer-link")
  const footerContact = document.querySelector(".footer-address").previousElementSibling
  const footerAddressItems = document.querySelectorAll(".footer-address p")
  const footerCopyright = document.querySelector(".footer-bottom p")

  if (footerTitle) footerTitle.textContent = translations[lang]["footer-title-1"]
  if (footerText) footerText.textContent = translations[lang]["footer-text"]
  if (footerLinksTitle) footerLinksTitle.textContent = translations[lang]["footer-links-title"]

  if (footerLinks.length >= 1) footerLinks[0].textContent = translations[lang]["footer-link-1"]
  if (footerLinks.length >= 2) footerLinks[1].textContent = translations[lang]["footer-link-2"]
  if (footerLinks.length >= 3) footerLinks[2].textContent = translations[lang]["footer-link-3"]

  if (footerContact) footerContact.textContent = translations[lang]["footer-contact"]

  if (footerAddressItems.length >= 1) footerAddressItems[0].textContent = translations[lang]["footer-address-1"]
  if (footerAddressItems.length >= 2) footerAddressItems[1].textContent = translations[lang]["footer-address-2"]
  if (footerAddressItems.length >= 3) footerAddressItems[2].textContent = translations[lang]["footer-address-3"]

  // Traiter l'email et le téléphone séparément car ils contiennent des balises
  if (footerAddressItems.length >= 4) {
    const emailText = footerAddressItems[3].textContent
    if (emailText.includes("Email")) {
      footerAddressItems[3].innerHTML = footerAddressItems[3].innerHTML.replace(
        "Email",
        translations[lang]["footer-email"],
      )
    }
  }

  if (footerAddressItems.length >= 5) {
    const telText = footerAddressItems[4].textContent
    if (telText.includes("Tél")) {
      footerAddressItems[4].textContent = translations[lang]["footer-tel"]
    }
  }

  if (footerCopyright) {
    const year = new Date().getFullYear()
    footerCopyright.innerHTML = `&copy; <span id="current-year">${year}</span> Trésors de Banlieues. ${translations[lang]["footer-copyright"]}`
  }

  // Effet visuel pour indiquer que la traduction est terminée
  document.body.style.transition = "opacity 0.3s ease"
  document.body.style.opacity = "0.5"
  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 300)
}

