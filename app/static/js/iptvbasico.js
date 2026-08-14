

window.abrirModalBasico = function() {
    const modal = document.getElementById('modal-precios-basico');
    if (modal) modal.style.display = 'flex';
};

window.cerrarModalBasico = function() {
    const modal = document.getElementById('modal-precios-basico');
    if (modal) modal.style.display = 'none';
    const alerta = document.getElementById('alerta-usuario-basico');
    if (alerta) alerta.style.display = 'none';
};

window.enviarRecargaWhatsAppBasico = function(paquete) {
    const inputUsuario = document.getElementById('input-usuario-basico');
    const alerta = document.getElementById('alerta-usuario-basico');
    const usuario = inputUsuario ? inputUsuario.value.trim() : '';

    if (!usuario) {
        if (alerta) alerta.style.display = 'flex';
        if (inputUsuario) {
            inputUsuario.focus();
            inputUsuario.style.borderColor = '#ff4b2b';
            inputUsuario.style.boxShadow = '0 0 10px rgba(255, 75, 43, 0.3)';
        }
        return;
    }

    if (alerta) alerta.style.display = 'none';

    const tuNumeroWhatsApp = '51999999999'; 

    const mensaje = `Hola, deseo solicitar una recarga de panel BÁSICO.\n\n👤 *Usuario:* ${usuario}\n📦 *Paquete:* ${paquete}`;
    
    const urlWhatsApp = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
};

// Ocultar alerta al escribir en el nuevo input
document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'input-usuario-basico') {
        const alerta = document.getElementById('alerta-usuario-basico');
        if (alerta) alerta.style.display = 'none';
        e.target.style.borderColor = 'rgba(229,193,88,0.4)';
        e.target.style.boxShadow = 'none';
    }
});