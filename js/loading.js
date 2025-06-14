// Script pour la page de chargement
document.addEventListener('DOMContentLoaded', function() {
    // Simuler un temps de chargement (peut être remplacé par un vrai chargement de ressources)
    const loadingDuration = 2000; // 2 secondes
    
    // Animation des points de chargement
    const loadingDots = document.querySelector('.loading-dots');
    let dotsCount = 0;
    
    const dotsInterval = setInterval(() => {
        dotsCount = (dotsCount + 1) % 4;
        loadingDots.textContent = '.'.repeat(dotsCount || 1);
    }, 500);
    
    // Fonction pour masquer la page de chargement
    function hideLoader() {
        clearInterval(dotsInterval);
        const loader = document.querySelector('.loading-page');
        loader.classList.add('fade-out');
        
        // Rediriger vers la page principale ou afficher le contenu
        setTimeout(() => {
            // Si c'est une page séparée, rediriger vers la page principale
            if (window.location.pathname.includes('loading.html')) {
                window.location.href = 'index.html';
            } else {
                // Si c'est intégré dans les autres pages, simplement masquer
                loader.style.display = 'none';
            }
        }, 500);
    }
    
    // Simuler le chargement complet
    setTimeout(hideLoader, loadingDuration);
});

// Pour intégrer cette page de chargement dans toutes les pages du site
// Ajouter ce code à votre fichier main.js
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

// Ajouter ce code à votre fichier main.js pour l'exécuter sur toutes les pages
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