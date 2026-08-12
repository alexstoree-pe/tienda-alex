// =========================================================
// 3. ANIMACIONES, EFECTOS VISUALES Y CINEMATOGRAFÍA (CORREGIDO)
// =========================================================
window.activarEfectoCineNativo = function() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadimos la clase visible y aseguramos remover la oculta permanentemente
                entry.target.classList.add('premium-visible');
                entry.target.classList.remove('premium-hidden');
                
                // 🔥 LA CLAVE: Desconectar el observer para este elemento. 
                // Así el scroll arriba/abajo jamás volverá a reiniciar la animación ni a ocultar el texto.
                obs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.01, rootMargin: '50px 0px 50px 0px' }); // Ampliamos un poco el margen para que cargue antes de verse

    document.querySelectorAll('.service-item, .category-title').forEach(el => {
        // Solo aplicar si no ha sido cargado antes para evitar parpadeos al hacer scroll
        if (!el.classList.contains('premium-visible')) {
            el.classList.add('premium-hidden');
            observer.observe(el);
        }
    });
};

window.limpiarAnimacionesPrevias = function() {
    document.querySelectorAll('.animacion-texto-largo').forEach(el => {
        el.classList.remove('animacion-texto-largo');
        el.style.removeProperty('--distancia-sobrante');
    });
};

window.procesarTextosMoviles = function() {
    if (window.innerWidth > 768) return;
    window.limpiarAnimacionesPrevias();

    const contenedores = document.querySelectorAll('.service-text');
    contenedores.forEach(contenedor => {
        const esCuadricula = contenedor.closest('.grid-mode') !== null;
        const espacioVisible = contenedor.clientWidth; 
        if (espacioVisible === 0) return; 

        const distanciaBase = esCuadricula ? 40 : 25;
        const distanciaTags = esCuadricula ? 30 : 20;

        const titulo = contenedor.querySelector('h3, .nombre-prod');
        if (titulo && titulo.offsetWidth > espacioVisible) {
            titulo.style.setProperty('--distancia-sobrante', `-${(titulo.offsetWidth - espacioVisible) + distanciaBase}px`);
            titulo.classList.add('animacion-texto-largo');
        }
        
        contenedor.querySelectorAll('.tag-prop').forEach(tag => {
            if (tag.offsetWidth > espacioVisible) {
                tag.style.setProperty('--distancia-sobrante', `-${(tag.offsetWidth - espacioVisible) + distanciaTags}px`);
                tag.classList.add('animacion-texto-largo');
            }
        });
    });
};

window.crearLluviaDeLogos = function() {
    if(document.querySelector('.falling-logos-container')) return;
    const container = document.createElement('div');
    container.className = 'falling-logos-container';
    document.body.prepend(container); 

    const logos = ['/static/img/netflix.webp', '/static/img/disneyp.webp', '/static/img/prime.webp', '/static/img/max.webp'];
    for(let i = 0; i < 15; i++) {
        const logo = document.createElement('div');
        logo.className = 'falling-logo';
        logo.style.backgroundImage = `url('${logos[Math.floor(Math.random() * logos.length)]}')`;
        logo.style.left = `${Math.random() * 100}vw`; 
        const size = Math.random() * 20 + 25; 
        logo.style.width = `${size}px`; logo.style.height = `${size}px`;
        logo.style.animationDuration = `${Math.random() * 15 + 15}s`; 
        logo.style.animationDelay = `-${Math.random() * 20}s`; 
        logo.style.setProperty('filter', `brightness(1.2) drop-shadow(0 0 15px rgba(0, 212, 255, 1)) blur(${Math.random() * 0.1 + 0.1}px)`, 'important'); 
        logo.style.setProperty('opacity', Math.random() * 0.15 + 0.35, 'important'); 
        container.appendChild(logo);
    }
};

window.iniciarNotificacionesCompras = function() {
    if(document.querySelector('.sales-popup')) return;
    const popup = document.createElement('div');
    popup.className = 'sales-popup';
    popup.innerHTML = `
        <img id="sales-img" src="" alt="Producto">
        <div class="sales-popup-text">
            <span id="sales-name">Alguien</span> compró <br>
            <strong id="sales-product">Un perfil</strong>
            <div class="sales-popup-time" id="sales-time">Hace unos instantes</div>
        </div>
    `;
    document.body.appendChild(popup);

    const nombres = ["Alejandro M.", "Andrés F.", "Arturo C.", "Distribuidor VIP", "Cliente Nuevo", "María P.", "Sofía R."];
    const productos = [{ nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }];
    const tiempos = ["Hace 2 min", "Hace 5 min", "Hace 15 min", "Hace media hora"];

    function mostrarNotificacion() {
        document.getElementById('sales-name').innerText = nombres[Math.floor(Math.random() * nombres.length)];
        const prod = productos[Math.floor(Math.random() * productos.length)];
        document.getElementById('sales-product').innerText = prod.nombre;
        document.getElementById('sales-img').src = prod.img; 
        document.getElementById('sales-time').innerText = tiempos[Math.floor(Math.random() * tiempos.length)];

        popup.classList.add('show');
        setTimeout(() => { popup.classList.remove('show'); }, 4500);
        setTimeout(mostrarNotificacion, Math.floor(Math.random() * (100000 - 60000 + 1)) + 60000);
    }
    setTimeout(mostrarNotificacion, 10000);
};

// Arranque de animaciones 
window.activarEfectoCineNativo();
window.addEventListener('resize', window.procesarTextosMoviles);
setTimeout(window.procesarTextosMoviles, 400);

const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (typeof VanillaTilt !== 'undefined' && !esMovil) {
    VanillaTilt.init(document.querySelectorAll(".service-item"), { max: 10, speed: 400, glare: true, "max-glare": 0.2 });
}
setTimeout(() => { window.crearLluviaDeLogos(); window.iniciarNotificacionesCompras(); }, 500);