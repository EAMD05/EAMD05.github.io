document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar el contenedor de contenido scrollable
    const scrollContent = document.querySelector('.scroll-content');
    if (scrollContent) {
        observer.observe(scrollContent);
    }

    // Observar el artículo destacado
    const featuredPost = document.querySelector('.featured-post');
    if (featuredPost) {
        observer.observe(featuredPost);
    }

    // Observar la cuadrícula de blog
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        observer.observe(blogGrid);
    }

    // Observar cada tarjeta de blog individualmente
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        observer.observe(card);
    });
}); 