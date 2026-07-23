// =========================================================
// EFECTOS VISUALES DINÁMICOS
// =========================================================

function crearLluviaDeLogos() {
    if(document.querySelector('.falling-logos-container')) return;
    
    const container = document.createElement('div');
    container.className = 'falling-logos-container';
    document.body.prepend(container); 

    const logos = [
        '/static/img/netflix.webp', 
        '/static/img/disneyp.webp', 
        '/static/img/prime.webp',
        '/static/img/max.webp'
    ];

    for(let i = 0; i < 15; i++) {
        const logo = document.createElement('div');
        logo.className = 'falling-logo';
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        logo.style.backgroundImage = `url('${randomLogo}')`;
        logo.style.left = `${Math.random() * 100}vw`; 
        
        const size = Math.random() * 20 + 25; 
        logo.style.width = `${size}px`;
        logo.style.height = `${size}px`;
        logo.style.animationDuration = `${Math.random() * 15 + 15}s`; 
        logo.style.animationDelay = `-${Math.random() * 20}s`; 
        
        const blurAmount = Math.random() * 0.1 + 0.1; 
        logo.style.setProperty('filter', `brightness(1.2) drop-shadow(0 0 15px rgba(0, 212, 255, 1)) blur(${blurAmount}px)`, 'important'); 
        
        const opacidadFuerte = Math.random() * 0.15 + 0.35;
        logo.style.setProperty('opacity', opacidadFuerte, 'important'); 
        
        container.appendChild(logo);
    }
}

function iniciarNotificacionesCompras() {
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

    const nombres = [
        "Carlos M.", "Juan P.", "María L.", "Luis A.", "Fernando R.", "Ana C.", 
        "Distribuidor VIP", "Jorge H.", "Diego F.", "Lucía V.", "Miguel S.", "Rosa M."
    ];
    
    const productos = [
        { nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, 
        { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }, 
        { nombre: "Prime Video", img: "/static/img/prime.webp" },
        { nombre: "Max Platino", img: "/static/img/max.webp" },     
        { nombre: "Paramount+ Standard", img: "/static/img/paramount.webp" }
    ];
    
    const tiempos = ["Hace 2 min", "Hace 5 min", "Hace unos instantes", "Hace 1 min", "Hace 10 min"];

    function mostrarNotificacion() {
        const nombreRandom = nombres[Math.floor(Math.random() * nombres.length)];
        const prodRandom = productos[Math.floor(Math.random() * productos.length)];
        const tiempoRandom = tiempos[Math.floor(Math.random() * tiempos.length)];

        document.getElementById('sales-name').innerText = nombreRandom;
        document.getElementById('sales-product').innerText = prodRandom.nombre;
        document.getElementById('sales-img').src = prodRandom.img;
        document.getElementById('sales-time').innerText = tiempoRandom;

        popup.classList.add('show');
        setTimeout(() => { popup.classList.remove('show'); }, 4500);

        const tiempoEsperaRandom = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;
        setTimeout(mostrarNotificacion, tiempoEsperaRandom);
    }

    setTimeout(mostrarNotificacion, 8000);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        crearLluviaDeLogos();
        iniciarNotificacionesCompras();
    }, 500);
});