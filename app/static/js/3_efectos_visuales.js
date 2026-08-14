function crearLluviaDeLogos() {
    if(document.querySelector('.falling-logos-container')) return;
    const container = document.createElement('div');
    container.className = 'falling-logos-container';
    document.body.prepend(container); 

    const logos = ['/static/img/netflix.webp', '/static/img/disneyp.webp', '/static/img/prime.webp', '/static/img/max.webp'];
    for(let i = 0; i < 15; i++) {
        const logo = document.createElement('div');
        logo.className = 'falling-logo';
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        logo.style.backgroundImage = `url('${randomLogo}')`;
        logo.style.left = `${Math.random() * 100}vw`; 
        const size = Math.random() * 20 + 25; 
        logo.style.width = `${size}px`; logo.style.height = `${size}px`;
        logo.style.animationDuration = `${Math.random() * 15 + 15}s`; 
        logo.style.animationDelay = `-${Math.random() * 20}s`; 
        logo.style.setProperty('filter', `brightness(1.2) drop-shadow(0 0 15px rgba(0, 212, 255, 1)) blur(${Math.random() * 0.1 + 0.1}px)`, 'important'); 
        logo.style.setProperty('opacity', Math.random() * 0.15 + 0.35, 'important'); 
        container.appendChild(logo);
    }
}

function iniciarNotificacionesCompras() {
    if(document.querySelector('.sales-popup')) return;
    const popup = document.createElement('div');
    popup.className = 'sales-popup';
    popup.innerHTML = `<img id="sales-img" src="" alt="Producto"><div class="sales-popup-text"><span id="sales-name">Alguien</span> compró <br><strong id="sales-product">Un perfil</strong><div class="sales-popup-time" id="sales-time">Hace unos instantes</div></div>`;
    document.body.appendChild(popup);

    const nombres = ["Alejandro M.", "Andrés F.", "Arturo C.", "Antonio G.", "Armando R.", "Adriana M.", "Alejandra P.", "Alicia R.", "Ana G.", "Distribuidor VIP", "Cliente Nuevo", "Socio Activo"];
    const productos = [{ nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }, { nombre: "Prime Video 4K", img: "/static/img/prime.webp" }, { nombre: "Max Platino", img: "/static/img/max.webp" }, { nombre: "Paramount+ Standard", img: "/static/img/paramount.webp" }, { nombre: "YouTube Premium", img: "/static/img/youtube.webp" }, { nombre: "Spotify Premium", img: "/static/img/spotify.webp" }, { nombre: "Crunchyroll Mega Fan", img: "/static/img/crunchyroll.webp" }, { nombre: "Vix Premium", img: "/static/img/vix.webp" }, { nombre: "Canva Pro (Diseño)", img: "/static/img/canva.webp" }, { nombre: "Servicio IPTV Digital", img: "/static/img/iptv.webp" }, { nombre: "Movistar Play", img: "/static/img/movistar.webp" }, { nombre: "DiRECTV GO+L1MAX", img: "/static/img/dgo.webp" }];
    const tiempos = ["Hace 2 min", "Hace 5 min", "Hace 10 min", "Hace 15 min", "Hace media hora"];

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
}

function limpiarAnimacionesPrevias() {
    document.querySelectorAll('.animacion-texto-largo').forEach(el => {
        el.classList.remove('animacion-texto-largo');
        el.style.removeProperty('--distancia-sobrante');
    });
}

function procesarTextosMoviles() {
    if (window.innerWidth > 768) return;
    limpiarAnimacionesPrevias();

    document.querySelectorAll('.service-text').forEach(contenedor => {
        const esCuadricula = contenedor.closest('.grid-mode') !== null;
        const espacioVisible = contenedor.clientWidth; 
        if (espacioVisible === 0) return; 

        const titulo = contenedor.querySelector('h3, .nombre-prod');
        if (titulo && titulo.offsetWidth > espacioVisible) {
            const distancia = (titulo.offsetWidth - espacioVisible) + (esCuadricula ? 40 : 25); 
            titulo.style.setProperty('--distancia-sobrante', `-${distancia}px`);
            titulo.classList.add('animacion-texto-largo');
        }
        contenedor.querySelectorAll('.tag-prop').forEach(tag => {
            if (tag.offsetWidth > espacioVisible) {
                const distancia = (tag.offsetWidth - espacioVisible) + (esCuadricula ? 30 : 20);
                tag.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                tag.classList.add('animacion-texto-largo');
            }
        });
    });
}

window.addEventListener('load', () => setTimeout(procesarTextosMoviles, 800));
window.addEventListener('resize', () => setTimeout(procesarTextosMoviles, 400));
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => { setTimeout(procesarTextosMoviles, 100); setTimeout(procesarTextosMoviles, 500); });
    });
});