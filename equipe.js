// Script spécifique pour la page équipe
document.addEventListener("DOMContentLoaded", () => {
  // Configuration du slider
  const slider = document.getElementById("team-slider")
  const prevBtn = document.getElementById("team-prev")
  const nextBtn = document.getElementById("team-next")
  const dotsContainer = document.getElementById("team-dots")

  if (!slider || !prevBtn || !nextBtn || !dotsContainer) return

  const cards = slider.querySelectorAll(".team-card")
  const cardCount = cards.length
  let currentPosition = 0
  let slidesToShow = getSlidesToShow()
  let maxPosition = Math.max(0, cardCount - slidesToShow)

  // Initialisation
  function init() {
    // Créer les points de navigation
    createDots()

    // Mettre à jour l'affichage initial
    updateSlider()

    // Ajouter les écouteurs d'événements
    prevBtn.addEventListener("click", goToPrev)
    nextBtn.addEventListener("click", goToNext)

    // Écouteur pour le redimensionnement de la fenêtre
    window.addEventListener("resize", handleResize)
  }

  // Créer les points de navigation
  function createDots() {
    dotsContainer.innerHTML = ""
    const totalDots = Math.ceil(cardCount / slidesToShow)

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement("button")
      dot.classList.add("team-slider-dot")
      if (i === 0) dot.classList.add("active")
      dot.setAttribute("aria-label", `Groupe ${i + 1}`)
      dot.dataset.index = i

      dot.addEventListener("click", () => {
        goToSlide(i * slidesToShow)
      })

      dotsContainer.appendChild(dot)
    }
  }

  // Obtenir le nombre de slides à afficher en fonction de la largeur de l'écran
  function getSlidesToShow() {
    if (window.innerWidth >= 1024) return 3
    if (window.innerWidth >= 640) return 2
    return 1
  }

  // Gérer le redimensionnement de la fenêtre
  function handleResize() {
    const newSlidesToShow = getSlidesToShow()

    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow
      maxPosition = Math.max(0, cardCount - slidesToShow)

      // Ajuster la position actuelle si nécessaire
      if (currentPosition > maxPosition) {
        currentPosition = maxPosition
      }

      // Recréer les points de navigation
      createDots()

      // Mettre à jour l'affichage
      updateSlider()
    }
  }

  // Mettre à jour l'affichage du slider
  function updateSlider() {
    // Calculer le pourcentage de déplacement
    const translateValue = -(currentPosition * (100 / slidesToShow))
    slider.style.transform = `translateX(${translateValue}%)`

    // Mettre à jour l'état des boutons
    prevBtn.disabled = currentPosition <= 0
    nextBtn.disabled = currentPosition >= maxPosition

    // Mettre à jour les points actifs
    updateDots()
  }

  // Mettre à jour les points de navigation
  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".team-slider-dot")
    const activeDotIndex = Math.floor(currentPosition / slidesToShow)

    dots.forEach((dot, index) => {
      if (index === activeDotIndex) {
        dot.classList.add("active")
      } else {
        dot.classList.remove("active")
      }
    })
  }

  // Aller au slide précédent
  function goToPrev() {
    if (currentPosition > 0) {
      currentPosition--
      updateSlider()
    }
  }

  // Aller au slide suivant
  function goToNext() {
    if (currentPosition < maxPosition) {
      currentPosition++
      updateSlider()
    }
  }

  // Aller à un slide spécifique
  function goToSlide(position) {
    currentPosition = Math.max(0, Math.min(position, maxPosition))
    updateSlider()
  }

  // Effet d'agrandissement au survol
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Réduire légèrement les autres cartes
      cards.forEach((c) => {
        if (c !== card) {
          c.style.transform = "scale(0.95)"
          c.style.opacity = "0.8"
        }
      })
    })

    card.addEventListener("mouseleave", () => {
      // Restaurer toutes les cartes
      cards.forEach((c) => {
        c.style.transform = ""
        c.style.opacity = ""
      })
    })
  })

  // Initialiser le slider
  init()

  // Animation des cartes d'équipe au scroll
  const teamCards = document.querySelectorAll(".team-card")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  teamCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    observer.observe(card)
  })

  // Effet de survol amélioré pour les cartes
  teamCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      // Ajouter un effet de lumière plus prononcé
      const imageOverlay = card.querySelector(".team-card-image::before")
      if (imageOverlay) {
        imageOverlay.style.opacity = "1"
      }
    })

    card.addEventListener("mouseleave", () => {
      // Réduire l'effet de lumière
      const imageOverlay = card.querySelector(".team-card-image::before")
      if (imageOverlay) {
        imageOverlay.style.opacity = "0.7"
      }
    })
  })

  // Animation des icônes de valeurs
  const valueIcons = document.querySelectorAll(".value-icon")

  valueIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      icon.style.transform = "scale(1.1) rotate(5deg)"
    })

    icon.addEventListener("mouseleave", () => {
      icon.style.transform = "scale(1) rotate(0deg)"
    })
  })

  // Initialiser le widget de traduction
  initTranslationWidget()
})

// Widget de traduction - Code simplifié
function initTranslationWidget() {
  // Ajouter le widget de traduction à la navbar s'il n'existe pas déjà
  const navbarMenu = document.querySelector(".navbar-menu")
  if (!navbarMenu.querySelector(".translation-widget")) {
    const translationWidget = document.createElement("div")
    translationWidget.className = "translation-widget"
    translationWidget.innerHTML = `
    <div class="planet">
      <div class="orbit">
        <div class="satellite"></div>
      </div>
    </div>
    <div class="language-options">
      <div class="language-option" data-lang="fr">
        <img src="https://flagcdn.com/w20/fr.png" alt="Français">
        <span>Français</span>
      </div>
      <div class="language-option" data-lang="en">
        <img src="https://flagcdn.com/w20/gb.png" alt="English">
        <span>English</span>
      </div>
      <div class="language-option" data-lang="es">
        <img src="https://flagcdn.com/w20/es.png" alt="Español">
        <span>Español</span>
      </div>
      <div class="language-option" data-lang="ja">
        <img src="https://flagcdn.com/w20/jp.png" alt="日本語">
        <span>日本語</span>
      </div>
    </div>
  `
    navbarMenu.appendChild(translationWidget)
  }

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
    translateEquipePage(lang)

    // Retirer l'indicateur de chargement
    document.body.removeChild(loadingIndicator)

    // Mettre à jour l'attribut lang de la page
    document.documentElement.lang = lang
  }, 1000)
}

// Fonction pour traduire la page équipe - COMPLÈTE ET INDÉPENDANTE
function translateEquipePage(lang) {
  // Dictionnaire de traduction pour la page équipe
  const translations = {
    fr: {
      // Navbar
      "nav-link-1": "Exposition 2026",
      "nav-link-2": "Édition 2025",
      "nav-link-3": "Notre Équipe",

      // Hero section
      "hero-title": "Notre Équipe",
      "hero-subtitle": "Découvrez l’équipe ayant mené ce projet sur Trésors de Banlieues !",

      // Team section
      "team-title": "Rencontrez notre équipe !",
      
      // Team members
      "team-role-1": "Développeur web",
      "team-role-2": "Développeur web",
      "team-role-3": "Chef de projet",
      "team-role-4": "Responsable Communications",
      "team-role-5": "Directeur artistique",
      "team-role-6": "Développeur web",
      
      // Team member descriptions
      "team-desc-1": "De la conception à la mise en ligne du site, Mohamed-Yacine a su mettre à profit son expertise et sa maîtrise du développement web pour explorer chaque étape du processus de création. C’est par le biais d’une démarche rigoureuse et d’une compréhension approfondie des enjeux qu’il a réussi à convertir une simple idée, a l’aide de divers croquis, en un projet des plus exceptionnels.",
      "team-desc-2": "Derrière chaque aspect de ce site se cache le travail acharné de cet homme. C'est lui qui a imaginé, conçu et mis en œuvre l'ensemble du site, avec l'aide précieuse de Mohamed-Yacine. Sa vision, son professionnalisme et son engagement personnel ont façonné chaque détail de cette plateforme. Grâce à son implication totale, le site est devenu ce qu'il est aujourd'hui, un mélange parfait de fonctionnalité et de design, porté par sa direction.",
      "team-desc-3": "Les compétences professionnelles et organisationnelles de Jasper ont été mises à rude épreuve lors de ce projet. Sa mission principale était d’organiser les tâches de chaque membre de l’équipe et leur emploi du temps, en rédigeant la feuille de route. De plus, aux côtés de Bryan, il était chargé de la recherche, de la prise de contact et de l’organisation de l’interview, ainsi que de la rédaction de certains textes du site web",
      "team-desc-4": "Recherche d'événements, prise de contact stratégique, interviews enrichissantes, Bryan a joué un rôle clé dans la recherche d’événements qui a permis de rentrer en contact avec différents organisateurs d’événement. Ces prises de contact ont mené à une interview qui a eu une contribution majeure à la conception du site et permettant la rédaction complète de la page 2026.",
      "team-desc-5": "Directeur artistique, Luka a conçu l'affiche, le programme de l'événement 2026, et orchestré le design visuel du site, tout en développant l'identité graphique de la communication. Son approche créative a défini une direction visuelle cohérente et moderne, alignée avec les objectifs de l'événement.",
      "team-desc-6": "Ayant conçu le croquis ainsi que certaines bases du site, Alvin a fait preuve de créativité tout en conservant une approche logique, permettant au site d’être en harmonie avec l’événement et son identité visuelle. Grâce à une collaboration efficace avec les autres membres du groupe, il a pu finaliser le développement du site web, mettre en avant ses compétences et contribuer pleinement à ce projet. Aujourd’hui, le groupe et lui sont fiers de vous présenter ce travail, dont vous pourrez apprécier la qualité par vous-même.",

      // Values section
      "values-title": "Nos Valeurs",
      "values-subtitle": "Les principes qui guident notre travail et notre vision",
      "value-title-1": "Créativité",
      "value-desc-1":
        "Cette valeur à permis à chaque membre de l'équipe d'exprimer son imagination en favorisant un environnement où chacun peut proposer ses idées librement.",
      "value-title-2": "Esprit d'équipe",
      "value-desc-2":
        "Une équipe performante repose avant tout sur la collaboration et l’engagement de ses membres. Chaque membre contribue activement, partage ses compétences et soutient les autres pour atteindre un objectif commun.",
      "value-title-3": "Communication",
      "value-desc-3":
        "Une communication claire et efficace est indispensable pour assurer la bonne coordination du projet. Elle permet de partager les informations, d’exprimer ses idées et de résoudre les problèmes rapidement.",

      // CTA
      "cta-title": "Rejoignez l'aventure",
      "cta-text": "Vous souhaitez collaborer avec notre équipe ou en savoir plus sur nos projets ?",
      "cta-button": "Rencontrer-nous",

      // Footer
      "footer-title": "Trésors de Banlieues",
      "footer-text": "Une exposition d'art urbain célébrant la créativité et la diversité culturelle des banlieues.",
      "footer-links-title": "Liens Rapides",
      "footer-link-1": "Exposition 2026",
      "footer-link-2": "Édition 2025",
      "footer-link-3": "Notre Équipe",
      "footer-contact": "Contact",
      "footer-address-1": "Usine Chanteraines",
      "footer-address-2": "92 Avenue du Général-de-Gaulle ",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email: info@gennevilliers.com",
      "footer-tel": "Tél: 01 23 45 67 89",
      "footer-copyright": "Tous droits réservés.",
    },
    en: {
      // Navbar
      "nav-link-1": "2026 Exhibition",
      "nav-link-2": "2025 Edition",
      "nav-link-3": "Our Team",

      // Hero section
      "hero-title": "Our Team",
      "hero-subtitle": "Discover the team that led this project on Trésors de Banlieues !",

      // Team section
      "team-title": "Meet our team !",

      // Team members
      "team-role-1": "Web developer",
      "team-role-2": "WEB DEVELOPPER",
      "team-role-3": "PROJECT MANAGER",
      "team-role-4": "COMMUNICATION MANAGER",
      "team-role-5": "ATRISTIC DIRECTOR",
      "team-role-6": "WEB DEVELOPPER",
      
      // Team member descriptions
      "team-desc-1": "From the design to the online launch of the site, Mohamed-Yacine has been able to use his expertise and mastery of web development to explore each step of the creation process. It was through a rigorous approach and an in-depth understanding of the issues that he succeeded in turning a simple idea, with the help of various sketches, into a most exceptional project.",
      "team-desc-2": "Behind every aspect of this site is the hard work of this man. It was he who conceived, designed and implemented the entire site, with the precious help of Mohamed-Yacine. His vision, professionalism and personal commitment have shaped every detail of this platform. Thanks to his total involvement, the site has become what it is today, a perfect mix of functionality and design, carried by his direction.",
      "team-desc-3": "Jasper’s professional and organizational skills were put to the test during this project. His main mission was to organize the tasks of each team member and their schedule, by writing the roadmap. In addition, along with Bryan, he was responsible for the research, contact and organization of the interview, as well as writing some texts on the website",
      "team-desc-4": "Event research, strategic outreach, enriching interviews, Bryan has played a key role in finding events that have brought him into contact with different event organizers. These contacts led to an interview which made a major contribution to the design of the site and enabled the complete writing of page 2026.",
      "team-desc-5": "Artistic director, Luka designed the poster, the program for the 2026 event, and orchestrated the visual design of the site, while developing the graphic identity of the communication. His creative approach defined a coherent and modern visual direction, aligned with the objectives of the event.",
      "team-desc-6": "Through effective collaboration with the other members of the group, he was able to finalize the development of the website, highlight his skills and contribute fully to this project. Today, he and the group are proud to present this work, whose quality you can appreciate for yourself.",

      // Values section
      "values-title": "Our Values",
      "values-subtitle": "The principles that guide our work and vision",
      "value-title-1": "Creativity",
      "value-desc-1":
        "This value allowed each member of the team to express their imagination by promoting an environment where everyone can freely propose their ideas.",
      "value-title-2": "team spirit",
      "value-desc-2":
        "A successful team is built on the collaboration and commitment of its members. Each member actively contributes, shares their skills and supports others to achieve a common goal.",
      "value-title-3": "Community",
      "value-desc-3":
        "Clear and effective communication is essential to ensure good project coordination. It allows you to share information, express ideas and solve problems quickly.",

      // CTA
      "cta-title": "Join the adventure",
      "cta-text": "Would you like to collaborate with our team or learn more about our projects?",
      "cta-button": "Meet us",

      // Footer
      "footer-title": "Trésors de Banlieues",
      "footer-text": "An urban art exhibition celebrating the creativity and cultural diversity of the suburbs.",
      "footer-links-title": "Quick Links",
      "footer-link-1": "2026 Exhibition",
      "footer-link-2": "2025 Edition",
      "footer-link-3": "Our Team",
      "footer-contact": "Contact",
      "footer-address-1": "Usine Chanteraines",
      "footer-address-2": "92 Avenue du Général-de-Gaulle ",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email: info@gennevilliers.com",
      "footer-tel": "Tél: 01 23 45 67 89",
      "footer-copyright": "Tous droits réservés.",
    },
    es: {
      // Navbar
      "nav-link-1": "Exposición 2026",
      "nav-link-2": "Edición 2025",
      "nav-link-3": "Nuestro Equipo",

      // Hero section
      "hero-title": "Nuestro Equipo",
      "hero-subtitle": "Descubre el equipo que llevó a cabo este proyecto en Trésor de Banlieues !",

      // Team section
      
      "team-title": "Conoce a nuestro equipo!",
      

      // Team members
      "team-role-1": "Desarrollador web",
      "team-role-2": "Desarrollador web",
      "team-role-3": "Jefe de proyecto",
      "team-role-4": "Responsable de Comunicación",
      "team-role-5": "Director artístico",
      "team-role-6": "Desarrollador web",
      
      // Team member descriptions
      "team-desc-1": "Desde la concepción hasta la puesta en línea del sitio, Mohamed-Yacine ha sabido aprovechar su experiencia y su dominio del desarrollo web para explorar cada etapa del proceso de creación. Fue a través de un enfoque riguroso y una comprensión profunda de los problemas que logró convertir una idea simple, con la ayuda de varios bocetos, en un proyecto excepcional.",
      "team-desc-2": "Detrás de cada aspecto de este sitio se esconde el trabajo duro de este hombre. Fue él quien ideó, diseñó e implementó todo el sitio, con la valiosa ayuda de Mohamed-Yacine. Su visión, profesionalidad y compromiso personal han dado forma a cada detalle de esta plataforma. Gracias a su total implicación, el sitio se ha convertido en lo que es hoy, una mezcla perfecta de funcionalidad y diseño, impulsado por su dirección.",
      "team-desc-3": "Las habilidades profesionales y organizativas de Jasper fueron puestas a prueba durante el proyecto. Su tarea principal era organizar las tareas de cada miembro del equipo y su horario, redactando la hoja de ruta. Además, junto con Bryan, fue responsable de la investigación, del establecimiento de contactos y de la organización de la entrevista, así como de la redacción de algunos textos del sitio web",
      "team-desc-4": "Búsqueda de eventos, establecimiento de contactos estratégicos, entrevistas enriquecedoras, Bryan ha desempeñado un papel clave en la búsqueda de eventos que ha permitido ponerse en contacto con diferentes organizadores de eventos. Estas tomas de contacto llevaron a una entrevista que tuvo una contribución importante al diseño del sitio y permitió la redacción completa de la página 2026.",
      "team-desc-5": "Director artístico, Luka diseñó el póster, el programa del evento 2026 y orquestó el diseño visual del sitio, mientras desarrollaba la identidad gráfica de la comunicación. Su enfoque creativo ha definido una dirección visual coherente y moderna, alineada con los objetivos del evento.",
      "team-desc-6": "Gracias a una colaboración eficaz con los demás miembros del grupo, pudo finalizar el desarrollo del sitio web, poner de relieve sus competencias y contribuir plenamente al proyecto. Hoy, el grupo y él están orgullosos de presentarles este trabajo, cuya calidad podrán apreciar por sí mismos.",

      // Values section
      "values-title": "Nuestros Valores",
      "values-subtitle": "Los principios que guían nuestro trabajo y visión",
      "value-title-1": "Creatividad",
      "value-desc-1":
        "Este valor ha permitido a cada miembro del equipo expresar su imaginación favoreciendo un ambiente en el que cada uno puede proponer sus ideas libremente.",
      "value-title-2": "espíritu de equipo",
      "value-desc-2":
        "La colaboración y el compromiso de los miembros son fundamentales para un equipo eficaz. Cada miembro contribuye activamente, comparte sus competencias y apoya a los demás para alcanzar un objetivo común.",
      "value-title-3": "comunicación",
      "value-desc-3":
        "Una comunicación clara y eficaz es esencial para garantizar la coordinación adecuada del proyecto. Permite compartir información, expresar ideas y resolver problemas rápidamente.",

      // CTA
      "cta-title": "Únete a la aventura",
      "cta-text": "¿Te gustaría colaborar con nuestro equipo o saber más sobre nuestros proyectos?",
      "cta-button": "Conócenos",

      // Footer
      "footer-title": "Trésors de Banlieues",
      "footer-text":
      "Una exposición de arte urbano que celebra la creatividad y la diversidad cultural de los suburbios.",
      "footer-links-title": "Enlaces Rápidos",
      "footer-link-1": "Exposición 2026",
      "footer-link-2": "Edición 2025",
      "footer-link-3": "Nuestro Equipo",
      "footer-contact": "Contacto",
      "footer-address-1": "Usine Chanteraines",
      "footer-address-2": "92 Avenue du Général-de-Gaulle ",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email: info@gennevilliers.com",
      "footer-tel": "Tél: 01 23 45 67 89",
      "footer-copyright": "Tous droits réservés.",
    },
    ja: {
      // Navbar
      "nav-link-1": "2026年展示会",
      "nav-link-2": "2025年エディション",
      "nav-link-3": "私たちのチーム",

      // Hero section
      "hero-title": "私たちのチーム",
      "hero-subtitle": "郊外の宝物でこのプロジェクトを主導したチームを発見してください！",

      // Team section
      "team-title": "私たちのチームに会いましょう！",
      
      // Team members
      "team-role-1": "ウェブ開発者",
      "team-role-2": "ウェブ開発者",
      "team-role-3": "プロジェクトマネージャ",
      "team-role-4": "コミュニケーションマネージャー",
      "team-role-5": "芸術監督",
      "team-role-6": "ウェブ開発者",
      
      // Team member descriptions
      "team-desc-1": "サイトのデザインからオンラインでの立ち上げまで、Mohamed-Yacine は Web 開発の専門知識と熟練を駆使して、作成プロセスの各ステップを探求することができました。彼は、厳格なアプローチと問題の深い理解を通じて、さまざまなスケッチの助けを借りて単純なアイデアを最も優れたプロジェクトに変えることに成功しました。",
      "team-desc-2":"このサイトのあらゆる側面の背後には、この男のハードワークがあります。Mohamed-Yacine の貴重な助けを借りて、サイト全体を考案、設計、実装したのは彼でした。彼のビジョン、プロフェッショナリズム、そして個人的なコミットメントは、このプラットフォームの細部を形作ってきました。彼の全面的な関与のおかげで、このサイトは今日のものとなり、機能とデザインの完璧な組み合わせとなり、彼の指示によって運ばれました。",
      "team-desc-3": "Jasper’s のプロフェッショナルスキルと組織スキルは、このプロジェクト中にテストされました。彼の主な使命は、ロードマップを作成することで、各チームメンバーのタスクとそのスケジュールを整理することでした。さらに、ブライアンとともに、インタビューの研究、連絡、組織化を担当し、Web サイトにいくつかのテキストを書きました",
      "team-desc-4": "イベントリサーチ、戦略的アウトリーチ、充実したインタビュー、ブライアンは、さまざまなイベント主催者と接触するイベントを見つける上で重要な役割を果たしてきました。これらの連絡先はインタビューにつながり、サイトの設計に大きく貢献し、2026 ページの完全な作成を可能にしました。",
      "team-desc-5": "芸術監督のルカは、2026 年のイベントのプログラムであるポスターをデザインし、コミュニケーションのグラフィック アイデンティティを開発しながら、サイトのビジュアル デザインをオーケストレーションしました。彼の創造的なアプローチは、イベントの目的に沿った、一貫性のある現代的な視覚的方向性を定義しました。",
      "team-desc-6": "文化的および起業家的世界での広範なネットワークを持つマークは、展示会が輝き、毎年発展することを可能にする戦略的パートナーシップを開発します。",

      // Values section
      "values-title": "私たちの価値観",
      "values-subtitle": "私たちの仕事とビジョンを導く原則",
      "value-title-1": "創造性",
      "value-desc-1": "この価値により、チームの各メンバーは、誰もが自由にアイデアを提案できる環境を促進することで想像力を表現することができました。",
      "value-title-2": "チームスピリット",
      "value-desc-2": "成功するチームは、メンバーのコラボレーションとコミットメントに基づいて構築されています。各メンバーは積極的に貢献し、スキルを共有し、他の人が共通の目標を達成するのをサポートします。",
      "value-title-3": "通信",
      "value-desc-3": "優れたプロジェクト調整を確保するには、明確で効果的なコミュニケーションが不可欠です。情報を共有し、アイデアを表現し、問題をすばやく解決できます。",

      // CTA
      "cta-title": "冒険に参加しましょう",
      "cta-text": "私たちのチームと協力したり、プロジェクトについてもっと知りたいですか？",
      "cta-button": "私たちに会う",

      // Footer
      "footer-title": "トレゾール・ド・バンリュー",
      "footer-text": "郊外の創造性と文化的多様性を祝う都市アート展。",
      "footer-links-title": "クイックリンク",
      "footer-link-1": "2026年展示会",
      "footer-link-2": "2025年エディション",
      "footer-link-3": "私たちのチーム",
      "footer-contact": "お問い合わせ",
      "footer-address-1": "Usine Chanteraines",
      "footer-address-2": "92 Avenue du Général-de-Gaulle ",
      "footer-address-3": "92230 Gennevilliers",
      "footer-email": "Email: info@gennevilliers.com",
      "footer-tel": "Tél: 01 23 45 67 89",
      "footer-copyright": "Tous droits réservés.",
    },
  }

  // Si la langue n'est pas dans notre dictionnaire, ne rien faire
  if (!translations[lang]) return

  // 1. Traduire la navbar
  
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

  // 3. Traduire la section équipe
  const teamSubtitle = document.querySelector(".team-subtitle")
  const teamTitle = document.querySelector(".team-title")
  const teamDescription = document.querySelector(".team-description")
  if (teamSubtitle) teamSubtitle.textContent = translations[lang]["team-subtitle"]
  if (teamTitle) teamTitle.textContent = translations[lang]["team-title"]
  if (teamDescription) teamDescription.textContent = translations[lang]["team-description"]

  // 4. Traduire les rôles et descriptions des membres de l'équipe
  const teamRoles = document.querySelectorAll(".team-card-role")
  const teamDescs = document.querySelectorAll(".team-card-description")
  
  teamRoles.forEach((role, index) => {
    const roleKey = `team-role-${index + 1}`
    if (translations[lang][roleKey]) {
      role.textContent = translations[lang][roleKey]
    }
  })
  
  teamDescs.forEach((desc, index) => {
    const descKey = `team-desc-${index + 1}`
    if (translations[lang][descKey]) {
      desc.textContent = translations[lang][descKey]
    }
  })

  // 5. Traduire la section valeurs
  const valuesTitle = document.querySelector(".values-section .section-title")
  const valuesSubtitle = document.querySelector(".values-section .section-text")
  if (valuesTitle) valuesTitle.textContent = translations[lang]["values-title"]
  if (valuesSubtitle) valuesSubtitle.textContent = translations[lang]["values-subtitle"]

  const valueTitles = document.querySelectorAll(".value-title")
  const valueDescriptions = document.querySelectorAll(".value-description")

  for (let i = 0; i < valueTitles.length; i++) {
    const titleKey = `value-title-${i + 1}`
    const descKey = `value-desc-${i + 1}`

    if (translations[lang][titleKey]) {
      valueTitles[i].textContent = translations[lang][titleKey]
    }

    if (translations[lang][descKey]) {
      valueDescriptions[i].textContent = translations[lang][descKey]
    }
  }

  // 6. Traduire la section CTA
  const ctaTitle = document.querySelector(".cta-title")
  const ctaText = document.querySelector(".cta-text")
  const ctaButton = document.querySelector(".cta-buttons .btn-white")

  if (ctaTitle) ctaTitle.textContent = translations[lang]["cta-title"]
  if (ctaText) ctaText.textContent = translations[lang]["cta-text"]
  if (ctaButton) ctaButton.textContent = translations[lang]["cta-button"]

  // 7. Traduire le footer
  const footerTitle = document.querySelector(".footer-title")
  const footerText = document.querySelector(".footer-text")
  const footerLinksTitle = document.querySelector(".footer-links").previousElementSibling
  const footerLinks = document.querySelectorAll(".footer-link")
  const footerContact = document.querySelector(".footer-address").previousElementSibling
  const footerAddressItems = document.querySelectorAll(".footer-address p")
  const footerCopyright = document.querySelector(".footer-bottom p")

  if (footerTitle) footerTitle.textContent = translations[lang]["footer-title"]
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
        translations[lang]["footer-email"]
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