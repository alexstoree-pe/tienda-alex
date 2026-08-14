window.abrirModalFaq = function() {
    sessionStorage.setItem('modal_activo_interes', 'true');
    const modal = document.getElementById('modal-faq');
    if (modal) modal.style.display = 'flex';
};

window.cerrarModalFaq = function(event) {
    if (event) event.stopPropagation();
    sessionStorage.removeItem('modal_activo_interes');
    const modal = document.getElementById('modal-faq');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
};

window.abrirModalInfo = function() {
    sessionStorage.setItem('modal_activo_interes', 'true');
    const modal = document.getElementById('modal-info-lateral');
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
};

window.cerrarModalInfo = function(event) {
    if (event) event.stopPropagation();
    sessionStorage.removeItem('modal_activo_interes');
    const modal = document.getElementById('modal-info-lateral');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
};

window.toggleFaq = function(element) {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
    if (!isActive) element.classList.add('active');
};

window.toggleFaqModal = function(elemento) {
    elemento.parentElement.classList.toggle('active');
};

document.addEventListener("DOMContentLoaded", () => {
    
    document.querySelectorAll('.service-item').forEach(item => {
        item.onclick = function(e) { window.toggleCarrito(this, e); };
        const priceContainer = item.querySelector('.price-container');
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
        tarjetas.forEach(item => { if (item.vanillaTilt) item.vanillaTilt.destroy(); });
        if (!esMovil) VanillaTilt.init(tarjetas, { max: 10, speed: 400, glare: true, "max-glare": 0.2 });
    }
    
    document.querySelectorAll('.service-logo').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        if (img.complete) img.classList.add('loaded');
    });

    if (typeof window.activarEfectoCineNativo === 'function') window.activarEfectoCineNativo();

    setTimeout(() => { 
        if (typeof crearLluviaDeLogos === 'function') crearLluviaDeLogos(); 
        if (typeof iniciarNotificacionesCompras === 'function') iniciarNotificacionesCompras(); 
        
        if (typeof window.cargarPreciosDeGoogleSheets === 'function') {
            window.cargarPreciosDeGoogleSheets(); 
            setInterval(window.cargarPreciosDeGoogleSheets, 2000);
        }

        const path = window.location.pathname.toLowerCase();
        const esZonaDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");

        if (typeof window.cargarStockDeGoogleSheets === 'function' && (esZonaDistribuidores || document.querySelector('.stock-badge'))) {
            window.cargarStockDeGoogleSheets();
            setInterval(window.cargarStockDeGoogleSheets, 2000); 
        }
    }, 500);
});


