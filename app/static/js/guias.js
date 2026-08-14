    document.addEventListener("DOMContentLoaded", () => {
        const galerias = document.querySelectorAll('.tutorial-card');
        
        galerias.forEach(galeria => {
            const slides = galeria.querySelectorAll('.tutorial-slide');
            const indicador = galeria.querySelector('.tutorial-indicador');
            
            if (slides.length > 0 && indicador) {
                indicador.innerText = `1 / ${slides.length}`;
            }
        });
    });

    function cambiarPaso(idGaleria, direccion) {
        const galeria = document.getElementById(idGaleria);
        if (!galeria) return;

        const slides = galeria.querySelectorAll('.tutorial-slide');
        const indicador = galeria.querySelector('.tutorial-indicador');
        
        let pasoActual = 0;
        
        slides.forEach((slide, index) => {
            if (slide.classList.contains('activo')) {
                pasoActual = index;
            }
        });

        let nuevoPaso = pasoActual + direccion;

        if (nuevoPaso < 0) nuevoPaso = slides.length - 1;
        if (nuevoPaso >= slides.length) nuevoPaso = 0;

        slides.forEach(slide => slide.classList.remove('activo'));
        slides[nuevoPaso].classList.add('activo');

        indicador.innerText = `${nuevoPaso + 1} / ${slides.length}`;
    }

    window.irAPasoDirecto = function(galleryId, indexSlide, botonElemento) {
    const card = document.getElementById(galleryId);
    if (!card) return;

    const slides = card.querySelectorAll('.tutorial-slide');
    
    slides.forEach(slide => slide.classList.remove('activo'));
    
    if (slides[indexSlide]) {
        slides[indexSlide].classList.add('activo');
    }

    const selectorContainer = card.querySelector('.tutorial-opciones-selector');
    if (selectorContainer) {
        selectorContainer.querySelectorAll('.btn-opcion').forEach(btn => btn.classList.remove('active'));
    }
    if (botonElemento) {
        botonElemento.classList.add('active');
    }

    if (typeof actualizarTextoIndicador === 'function') {
        actualizarTextoIndicador(card, indexSlide);
    }
};

