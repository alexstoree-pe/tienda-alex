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

    window.abrirModalPanel = function() {
        const modal = document.getElementById('modal-precios-panel');
        if (modal) modal.style.display = 'flex';
    };

    window.cerrarModalPanel = function() {
        const modal = document.getElementById('modal-precios-panel');
        if (modal) modal.style.display = 'none';
    };

    window.enviarRecargaWhatsApp = function(paquete) {
        const inputUsuario = document.getElementById('input-usuario-panel');
        const usuario = inputUsuario ? inputUsuario.value.trim() : '';

        if (!usuario) {
            alert('⚠️ Por favor, ingresa tu nombre de usuario de panel antes de solicitar la recarga.');
            if (inputUsuario) {
                inputUsuario.focus();
                inputUsuario.style.borderColor = '#ff4b2b';
                setTimeout(() => { inputUsuario.style.borderColor = 'rgba(229,193,88,0.4)'; }, 2000);
            }
            return;
        }


        const tuNumeroWhatsApp = '51999999999'; 

        const mensaje = `Hola, deseo solicitar una recarga de panel.\n\n👤 *Usuario:* ${usuario}\n📦 *Paquete:* ${paquete}`;
        
        // Redirección a WhatsApp
        const urlWhatsApp = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
    };


    window.abrirModalPanel = function() {
        const modal = document.getElementById('modal-precios-panel');
        if (modal) modal.style.display = 'flex';
    };

    window.cerrarModalPanel = function() {
        const modal = document.getElementById('modal-precios-panel');
        if (modal) modal.style.display = 'none';
        const alerta = document.getElementById('alerta-usuario-panel');
        if (alerta) alerta.style.display = 'none';
    };

    window.enviarRecargaWhatsApp = function(paquete) {
        const inputUsuario = document.getElementById('input-usuario-panel');
        const alerta = document.getElementById('alerta-usuario-panel');
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

       
        const mensaje = `Hola, deseo solicitar una recarga de panel.\n\n👤 *Usuario:* ${usuario}\n📦 *Paquete:* ${paquete}`;
        
        const urlWhatsApp = `https://wa.me/${tuNumeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, '_blank');
    };

    // Ocultar la alerta automáticamente cuando el usuario empiece a escribir
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id === 'input-usuario-panel') {
            const alerta = document.getElementById('alerta-usuario-panel');
            if (alerta) alerta.style.display = 'none';
            e.target.style.borderColor = 'rgba(229,193,88,0.4)';
            e.target.style.boxShadow = 'none';
        }
    });