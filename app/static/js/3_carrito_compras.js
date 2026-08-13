// =========================================================
// EFECTOS VISUALES (Logos y Notificaciones)
// =========================================================
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
    "Alejandro M.", "Andrés F.", "Arturo C.", "Antonio G.", "Armando R.", "Alberto V.", "Alonso P.", "Ángel L.",
    "Bruno S.", "Bryan M.", "Carlos D.", "César R.", "Christian A.", "Cristian V.", "Daniel E.", "David G.",
    "Diego P.", "Eduardo L.", "Edgar T.", "Emilio H.", "Enrique C.", "Erick M.", "Esteban S.", "Fabián R.",
    "Fernando L.", "Francisco B.", "Gabriel C.", "Gerardo N.", "Gonzalo V.", "Guillermo P.", "Gustavo A.",
    "Héctor R.", "Hugo M.", "Ignacio L.", "Iván C.", "Javier S.", "Jesús P.", "Joaquín G.", "Jorge F.",
    "José L.", "Juan C.", "Julio M.", "Kevin R.", "Leonardo T.", "Luis G.", "Manuel R.", "Marco A.",
    "Mario P.", "Martín S.", "Mateo V.", "Mauricio L.", "Miguel C.", "Nicolás R.", "Nelson P.", "Omar G.",
    "Óscar M.", "Pablo L.", "Pedro C.", "Rafael S.", "Ramiro V.", "Raúl T.", "Renato A.", "Ricardo G.",
    "Roberto M.", "Rodrigo P.", "Rubén C.", "Santiago L.", "Sebastián R.", "Sergio B.", "Simón V.",
    "Tomás C.", "Víctor M.", "Vladimir R.", "Walter G.", "Xavier L.", "Yamil P.", "Alex C.", "Aldo S.", 
    "Rodrigo C.", "Alvaro G.", "Marcelo R.", "Felipe B.", "Hernán P.",
    "Adriana M.", "Alejandra P.", "Alicia R.", "Ana G.", "Andrea C.", "Ángela L.", "Antonia S.", "Bárbara V.", 
    "Beatriz M.", "Blanca R.", "Camila P.", "Carla G.", "Carmen C.", "Carolina L.", "Catalina M.", "Cecilia S.", 
    "Clara V.", "Claudia R.", "Cristina A.", "Daniela P.", "Diana G.", "Elena C.", "Elisa L.", "Elizabeth M.", 
    "Erika S.", "Estefanía V.", "Eva R.", "Fabiola M.", "Fernanda P.", "Flavia G.", "Fiorella C.", "Gabriela L.", 
    "Gloria S.", "Graciela V.", "Guadalupe M.", "Inés P.", "Irene R.", "Isabel G.", "Isabella C.", "Jazmín L.", 
    "Jessica S.", "Jimena V.", "Josefina M.", "Juana P.", "Julia R.", "Karen G.", "Karla C.", "Laura L.", 
    "Leticia S.", "Lidia V.", "Liliana M.", "Lorena P.", "Lourdes R.", "Lucero G.", "Lucía C.", "Luisa L.", 
    "Magaly S.", "Marcela V.", "Margarita M.", "María P.", "Mariana R.", "Marina G.", "Marisol C.", "Marta L.", 
    "Mayra S.", "Melissa V.", "Micaela M.", "Milagros P.", "Mirella R.", "Miriam G.", "Mónica C.", "Nadia L.", 
    "Nancy S.", "Natalia V.", "Nayeli M.", "Nélida P.", "Noelia R.", "Norma G.", "Nuria C.", "Olga L.", 
    "Olivia S.", "Pamela V.", "Paola M.", "Patricia P.", "Paula R.", "Pilar G.", "Raquel C.", "Rebeca L.", 
    "Regina S.", "Renata V.", "Rocío M.", "Romina P.", "Rosa R.", "Rosario G.", "Rosmary C.", "Ruth L.", 
    "Sabrina S.", "Sandra V.", "Sara M.", "Silvia P.", "Sofía R.", "Sonia G.", "Susana C.", "Tania L.", 
    "Teresa S.", "Valentina V.", "Valeria M.", "Vanesa P.", "Verónica R.", "Victoria G.", "Vilma C.", 
    "Viviana L.", "Ximena S.", "Yadira V.", "Yolanda M.", "Zaira P.", "Lizbeth C.", "Milena F.", "Nayda R.",
    "Dayana G.", "Gisela P.",
    "Distribuidor VIP", "Distribuidor Activo", "Distribuidor Premium", "Distribuidor Mayorista", 
    "Distribuidor Élite", "Distribuidor Autorizado", "Distribuidor Pro", "Cliente Nuevo", 
    "Cliente Frecuente", "Cliente Verificado", "Cliente Premium", "Cliente Gold", 
    "Socio Activo", "Socio Premium", "Socio Fundador", "Usuario Reciente", 
    "Usuario VIP", "Nuevo Suscriptor", "Suscripción Renovable", "Agencia Aliada", "Revendedor Oficial"
    ];
    const productos = [{ nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }, { nombre: "Prime Video 4K", img: "/static/img/prime.webp" }, { nombre: "Max Platino", img: "/static/img/max.webp" }, { nombre: "Paramount+ Standard", img: "/static/img/paramount.webp" }, { nombre: "YouTube Premium", img: "/static/img/youtube.webp" }, { nombre: "Spotify Premium", img: "/static/img/spotify.webp" }, { nombre: "Crunchyroll Mega Fan", img: "/static/img/crunchyroll.webp" }, { nombre: "Vix Premium", img: "/static/img/vix.webp" }, { nombre: "Canva Pro (Diseño)", img: "/static/img/canva.webp" }, { nombre: "Servicio IPTV Digital", img: "/static/img/iptv.webp" }, { nombre: "Movistar Play", img: "/static/img/movistar.webp" }, { nombre: "DiRECTV GO+L1MAX", img: "/static/img/dgo.webp" }];
    const tiempos = [
    "Hace 2 min", "Hace 3 min", "Hace 4 min", "Hace 5 min", "Hace 6 min", 
    "Hace 7 min", "Hace 8 min", "Hace 9 min", "Hace 10 min",
    "Hace 12 min", "Hace 14 min", "Hace 15 min", "Hace 17 min", "Hace 18 min", 
    "Hace 20 min", "Hace 22 min", "Hace 25 min", "Hace 27 min", "Hace 30 min", 
    "Hace 32 min", "Hace 35 min", "Hace 38 min", "Hace 40 min", "Hace 43 min", 
    "Hace 45 min", "Hace 48 min", "Hace 50 min", "Hace 53 min", "Hace 55 min", 
    "Hace 58 min",
    "Hace media hora", "Hace casi una hora", "Hace 1 hora", 
    "Hace 1 hora y 5 min", "Hace 1 hora y 10 min", "Hace 1 hora y cuarto", 
    "Hace poco más de 1 hora", "Hace 1 hora y 20 min"
    ];

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

// =========================================================
// SISTEMA AUTÓNOMO DE ANIMACIÓN DE TEXTOS LARGOS
// =========================================================
function limpiarAnimacionesPrevias() {
    document.querySelectorAll('.animacion-texto-largo').forEach(el => {
        el.classList.remove('animacion-texto-largo');
        el.style.removeProperty('--distancia-sobrante');
    });
}

function procesarTextosMoviles() {
    if (window.innerWidth > 768) return;
    limpiarAnimacionesPrevias();

    const contenedores = document.querySelectorAll('.service-text');
    contenedores.forEach(contenedor => {
        const esCuadricula = contenedor.closest('.grid-mode') !== null;
        const espacioVisible = contenedor.clientWidth; 
        if (espacioVisible === 0) return; 

        if (esCuadricula) {
            const titulo = contenedor.querySelector('h3, .nombre-prod');
            if (titulo && titulo.offsetWidth > espacioVisible) {
                const distancia = (titulo.offsetWidth - espacioVisible) + 40; 
                titulo.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                titulo.classList.add('animacion-texto-largo');
            }
            const tags = contenedor.querySelectorAll('.tag-prop');
            tags.forEach(tag => {
                if (tag.offsetWidth > espacioVisible) {
                    const distancia = (tag.offsetWidth - espacioVisible) + 30;
                    tag.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                    tag.classList.add('animacion-texto-largo');
                }
            });
        } else {
            const titulo = contenedor.querySelector('h3, .nombre-prod');
            if (titulo && titulo.offsetWidth > espacioVisible) {
                const distancia = (titulo.offsetWidth - espacioVisible) + 25;
                titulo.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                titulo.classList.add('animacion-texto-largo');
            }
            const tags = contenedor.querySelectorAll('.tag-prop');
            tags.forEach(tag => {
                if (tag.offsetWidth > espacioVisible) {
                    const distancia = (tag.offsetWidth - espacioVisible) + 20;
                    tag.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                    tag.classList.add('animacion-texto-largo');
                }
            });
        }
    });
}

// 🔥 LA CURA DEFINITIVA: RETRASOS INTELIGENTES
// Esperamos a que la página, el CSS y las fuentes estén 100% renderizados antes de medir los textos
window.addEventListener('load', () => {
    setTimeout(procesarTextosMoviles, 800);
});

window.addEventListener('resize', () => {
    setTimeout(procesarTextosMoviles, 400);
});

document.addEventListener("DOMContentLoaded", () => {
    const botonesVista = document.querySelectorAll('.btn-view');
    botonesVista.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(procesarTextosMoviles, 100);
            setTimeout(procesarTextosMoviles, 500); 
        });
    });
});