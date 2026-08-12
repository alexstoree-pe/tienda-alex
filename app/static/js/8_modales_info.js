// =========================================================
// 8. FUNCIONES DE MODALES Y FAQS
// =========================================================

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