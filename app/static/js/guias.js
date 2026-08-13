    // =========================================================
    // INICIADOR AUTOMÁTICO DE GALERÍAS
    // =========================================================
    document.addEventListener("DOMContentLoaded", () => {
        // Busca todas las galerías que existan en la página
        const galerias = document.querySelectorAll('.tutorial-card');
        
        galerias.forEach(galeria => {
            const slides = galeria.querySelectorAll('.tutorial-slide');
            const indicador = galeria.querySelector('.tutorial-indicador');
            
            // Si la galería tiene fotos, ajusta el texto automáticamente al cargar
            if (slides.length > 0 && indicador) {
                indicador.innerText = `1 / ${slides.length}`;
            }
        });
    });

    // =========================================================
    // LÓGICA PARA CAMBIAR DE PASO
    // =========================================================
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

        // Aquí ya era inteligente, pero ahora funciona en equipo con el iniciador
        indicador.innerText = `${nuevoPaso + 1} / ${slides.length}`;
    }

    window.irAPasoDirecto = function(galleryId, indexSlide, botonElemento) {
    const card = document.getElementById(galleryId);
    if (!card) return;

    const slides = card.querySelectorAll('.tutorial-slide');
    
    // Ocultar todas las diapositivas
    slides.forEach(slide => slide.classList.remove('activo'));
    
    // Activar la seleccionada
    if (slides[indexSlide]) {
        slides[indexSlide].classList.add('activo');
    }

    // Actualizar estados visuales de los botones de opción superior
    const selectorContainer = card.querySelector('.tutorial-opciones-selector');
    if (selectorContainer) {
        selectorContainer.querySelectorAll('.btn-opcion').forEach(btn => btn.classList.remove('active'));
    }
    if (botonElemento) {
        botonElemento.classList.add('active');
    }

    // Actualizar indicador numérico si tu JS global lo requiere
    if (typeof actualizarTextoIndicador === 'function') {
        actualizarTextoIndicador(card, indexSlide);
    }
};