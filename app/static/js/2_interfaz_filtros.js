// =========================================================
// MANTENER POSICIÓN DEL SCROLL Y FILTROS (EFECTO TELÓN CINE DEFINITIVO)
// =========================================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Limpiamos banderas si el usuario recargó teniendo un modal abierto
if (sessionStorage.getItem('modal_activo_interes') === 'true') {
    sessionStorage.removeItem('posicionScroll');
    sessionStorage.removeItem('filtroActivoIndex');
    sessionStorage.removeItem('vistaActivaIndex');
    sessionStorage.removeItem('modal_activo_interes');
}

const tienePermisoRestaurar = sessionStorage.getItem("acceso_cliente") === "true" || sessionStorage.getItem("acceso_distribuidor") === "true";
const necesitaRestaurar = tienePermisoRestaurar && (sessionStorage.getItem('filtroActivoIndex') !== null || sessionStorage.getItem('posicionScroll') !== null);

if (necesitaRestaurar) {
    const style = document.createElement('style');
    style.id = 'estilo-restauracion';
    style.innerHTML = `
        html, body { scroll-behavior: auto !important; }
        .telon-cine {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: var(--dark, #050505); 
            z-index: 99999999; 
            transition: opacity 0.4s ease-out;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener("DOMContentLoaded", () => {
        const telon = document.createElement('div');
        telon.className = 'telon-cine';
        telon.id = 'telon-cine-premium';
        document.body.appendChild(telon);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const botonesFiltro = document.querySelectorAll('.btn-nav');
    botonesFiltro.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('filtroActivoIndex', index);
        });
    });

    const botonesVista = document.querySelectorAll('.btn-view');
    botonesVista.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('vistaActivaIndex', index);
        });
    });
});

// 🔥 UNIFICAMOS Y ASEGURAMOS EL GUARDADO DEL SCROLL AL ACTUALIZAR LA PÁGINA
window.addEventListener('beforeunload', () => {
    if (sessionStorage.getItem('modal_activo_interes') === 'true') {
        sessionStorage.removeItem('posicionScroll');
        sessionStorage.removeItem('filtroActivoIndex');
        sessionStorage.removeItem('vistaActivaIndex');
    } else {
        // Guardamos la posición exacta antes de que la página muera
        sessionStorage.setItem('posicionScroll', window.scrollY || document.documentElement.scrollTop);
    }
});

window.addEventListener('load', () => {
    if (!necesitaRestaurar) return;

    const scrollGuardado = sessionStorage.getItem('posicionScroll');
    const filtroGuardado = sessionStorage.getItem('filtroActivoIndex');
    const vistaGuardada = sessionStorage.getItem('vistaActivaIndex');
    
    window._isRestoring = true; 

    if (vistaGuardada !== null) {
        const botonesVista = document.querySelectorAll('.btn-view');
        if (botonesVista[vistaGuardada]) botonesVista[vistaGuardada].click();
    }

    if (filtroGuardado !== null) {
        const botonesFiltro = document.querySelectorAll('.btn-nav');
        if (botonesFiltro[filtroGuardado]) botonesFiltro[filtroGuardado].click(); 
    }

    // 🔥 Damos tiempo extra para que las tarjetas se dibujen antes de bajar
    setTimeout(() => {
        if (scrollGuardado !== null) {
            const pos = parseInt(scrollGuardado, 10);
            window.scrollTo({ top: pos, behavior: 'instant' }); // Forzamos scroll instantáneo
            document.documentElement.scrollTop = pos; // Fallback para celulares
        }
        
        document.querySelectorAll('.service-item:not(.oculto-filtro), .category-title:not(.oculto-filtro)').forEach(el => {
            el.classList.add('premium-visible');
        });

        if (typeof window.activarEfectoCineNativo === 'function') window.activarEfectoCineNativo();

        // 🔥 Refuerzo de scroll por si alguna imagen o letra movió la pantalla un milisegundo después
        setTimeout(() => {
            if (scrollGuardado !== null) {
                window.scrollTo({ top: parseInt(scrollGuardado, 10), behavior: 'instant' });
            }
            
            const telon = document.getElementById('telon-cine-premium');
            if (telon) telon.style.opacity = '0'; 

            setTimeout(() => {
                if (telon) telon.remove();
                const styleRest = document.getElementById('estilo-restauracion');
                if (styleRest) styleRest.remove(); 
                window._isRestoring = false;
            }, 400); 
        }, 150); 
    }, 300); 
});

// =========================================================
// AUTO INYECTOR Y CONTROL DEL CARRITO (LIBERADO PARA TODOS)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.service-item').forEach(item => {
        item.onclick = function(e) { window.toggleCarrito(this, e); };
        
        const card = item.querySelector('.service-card');
        const priceContainer = card ? card.querySelector('.price-container') : null;

        if (priceContainer && !priceContainer.querySelector('.qty-controls')) {
            const controles = document.createElement('div');
            controles.className = 'qty-controls';
            controles.innerHTML = `
                <button class="qty-btn" onclick="window.cambiarCantidad(event, -1, this)"><i class="fas fa-minus"></i></button>
                <span class="qty-display">1</span>
                <button class="qty-btn" onclick="window.cambiarCantidad(event, 1, this)"><i class="fas fa-plus"></i></button>
            `;
            priceContainer.appendChild(controles);
        }
    });

    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (typeof VanillaTilt !== 'undefined') {
        const tarjetas = document.querySelectorAll(".service-item");
        tarjetas.forEach(item => {
            if (item.vanillaTilt) item.vanillaTilt.destroy(); 
        });
        if (!esMovil) {
            VanillaTilt.init(tarjetas, { max: 10, speed: 400, glare: true, "max-glare": 0.2 });
        }
    }
    
    document.querySelectorAll('.service-logo').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        if (img.complete) img.classList.add('loaded');
    });

    if (typeof window.activarEfectoCineNativo === 'function') window.activarEfectoCineNativo();

    setTimeout(() => { 
        if (typeof crearLluviaDeLogos === 'function') crearLluviaDeLogos(); 
        if (typeof iniciarNotificacionesCompras === 'function') iniciarNotificacionesCompras(); 
        
        if (typeof cargarPreciosDeGoogleSheets === 'function') {
            cargarPreciosDeGoogleSheets(); 
            setInterval(() => { cargarPreciosDeGoogleSheets(); }, 2000);
        }

        const path = window.location.pathname.toLowerCase();
        const esZonaDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");

        if (typeof cargarStockDeGoogleSheets === 'function' && (esZonaDistribuidores || document.querySelector('.stock-badge'))) {
            cargarStockDeGoogleSheets();
            setInterval(() => { cargarStockDeGoogleSheets(); }, 2000); 
        }
    }, 500);
});