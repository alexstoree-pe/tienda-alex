
window.showToast = function(message, isAdded = true) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isAdded ? '' : 'remove'}`;
    toast.innerHTML = `<i class="fas ${isAdded ? 'fa-check-circle' : 'fa-minus-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
};


window.activarEfectoCineNativo = function() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('oculto-filtro')) {
                entry.target.classList.add('premium-visible');
                obs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.service-item:not(.premium-hidden), .category-title:not(.premium-hidden)').forEach(el => {
        el.classList.add('premium-hidden');
        observer.observe(el);
    });
};


window.onscroll = function() {
    const btnSubir = document.getElementById("back-to-top");
    if(btnSubir) {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) btnSubir.classList.add("show");
        else btnSubir.classList.remove("show");
    }
};
document.addEventListener("DOMContentLoaded", () => {
    const btnSubir = document.getElementById("back-to-top");
    if (btnSubir) btnSubir.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});


if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

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
    style.innerHTML = `html, body { scroll-behavior: auto !important; } .telon-cine { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: var(--dark, #050505); z-index: 99999999; transition: opacity 0.4s ease-out; pointer-events: none; }`;
    document.head.appendChild(style);
    document.addEventListener("DOMContentLoaded", () => {
        const telon = document.createElement('div');
        telon.className = 'telon-cine'; telon.id = 'telon-cine-premium';
        document.body.appendChild(telon);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.btn-nav').forEach((btn, index) => {
        btn.addEventListener('click', () => sessionStorage.setItem('filtroActivoIndex', index));
    });
    document.querySelectorAll('.btn-view').forEach((btn, index) => {
        btn.addEventListener('click', () => sessionStorage.setItem('vistaActivaIndex', index));
    });
});

window.addEventListener('beforeunload', () => {
    if (sessionStorage.getItem('modal_activo_interes') === 'true') {
        sessionStorage.removeItem('posicionScroll');
        sessionStorage.removeItem('filtroActivoIndex');
        sessionStorage.removeItem('vistaActivaIndex');
    } else {
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

    
    setTimeout(() => {
        if (scrollGuardado !== null) {
            const pos = parseInt(scrollGuardado, 10);
            window.scrollTo({ top: pos, behavior: 'instant' }); 
            document.documentElement.scrollTop = pos; 
        }
        document.querySelectorAll('.service-item:not(.oculto-filtro), .category-title:not(.oculto-filtro)').forEach(el => el.classList.add('premium-visible'));
        window.activarEfectoCineNativo();

        setTimeout(() => {
            if (scrollGuardado !== null) window.scrollTo({ top: parseInt(scrollGuardado, 10), behavior: 'instant' });
            const telon = document.getElementById('telon-cine-premium');
            if (telon) telon.style.opacity = '0'; 
            setTimeout(() => {
                if (telon) telon.remove();
                const styleRest = document.getElementById('estilo-restauracion');
                if (styleRest) styleRest.remove(); 
                window._isRestoring = false;
            }, 400); 
        }, 150); 
    }, 900);
});