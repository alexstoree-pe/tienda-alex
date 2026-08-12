// =========================================================
// 2. LÓGICA DE INTERFAZ GLOBAL Y SCROLL RESTORATION
// =========================================================

// Botón de subir y scroll global
window.onscroll = function() {
    const btnSubir = document.getElementById("back-to-top");
    if(btnSubir) {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) btnSubir.classList.add("show");
        else btnSubir.classList.remove("show");
    }
};

const btnSubir = document.getElementById("back-to-top");
if (btnSubir) {
    btnSubir.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Efecto de mouse en el fondo
document.addEventListener("mousemove", (e) => {
    const bg = document.querySelector('body::before');
    if(bg) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        bg.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Toasts de Notificación
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

// Restauración de Sesión (Scroll y Filtros)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

if (sessionStorage.getItem('modal_activo_interes') === 'true') {
    sessionStorage.removeItem('posicionScroll');
    sessionStorage.removeItem('filtroActivoIndex');
    sessionStorage.removeItem('vistaActivaIndex');
    sessionStorage.removeItem('modal_activo_interes');
}

window.addEventListener('beforeunload', () => {
    if (sessionStorage.getItem('modal_activo_interes') === 'true') {
        sessionStorage.removeItem('posicionScroll');
        sessionStorage.removeItem('filtroActivoIndex');
        sessionStorage.removeItem('vistaActivaIndex');
    } else {
        sessionStorage.setItem('posicionScroll', window.scrollY || document.documentElement.scrollTop);
    }
});