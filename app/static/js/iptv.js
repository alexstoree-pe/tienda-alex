window.abrirModalPanel = function() {
    const modal = document.getElementById('modal-precios-panel');
    if (modal) modal.style.display = 'flex';
};

window.cerrarModalPanel = function() {
    const modal = document.getElementById('modal-precios-panel');
    if (modal) modal.style.display = 'none';
};

window.toggleDetallesModal = function(headerElement) {
    const item = headerElement.closest('.carrito-item-modal');
    const detalles = item.querySelector('.ci-detalles');
    const icon = headerElement.querySelector('i.fas');
    
    if (detalles.style.maxHeight === '0px' || !detalles.style.maxHeight) {
        detalles.style.maxHeight = '150px';
        detalles.style.opacity = '1';
        detalles.style.marginTop = '6px';
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    } else {
        detalles.style.maxHeight = '0px';
        detalles.style.opacity = '0';
        detalles.style.marginTop = '0px';
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
};