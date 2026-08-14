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

        // Validación: si no ingresa usuario, avisa y hace foco en el input
        if (!usuario) {
            alert('⚠️ Por favor, ingresa tu nombre de usuario de panel antes de solicitar la recarga.');
            if (inputUsuario) {
                inputUsuario.focus();
                inputUsuario.style.borderColor = '#ff4b2b';
                setTimeout(() => { inputUsuario.style.borderColor = 'rgba(229,193,88,0.4)'; }, 2000);
            }
            return;
        }

        // Tu número de WhatsApp (ejemplo: código de país + número, sin símbolos +)
        const tuNumeroWhatsApp = '51999999999'; 

        // Construcción del mensaje personalizado
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
        // Ocultar la alerta al cerrar por si acaso
        const alerta = document.getElementById('alerta-usuario-panel');
        if (alerta) alerta.style.display = 'none';
    };

    window.enviarRecargaWhatsApp = function(paquete) {
        const inputUsuario = document.getElementById('input-usuario-panel');
        const alerta = document.getElementById('alerta-usuario-panel');
        const usuario = inputUsuario ? inputUsuario.value.trim() : '';

        // Si no hay usuario, mostramos NUESTRA alerta personalizada y borde rojo en el input
        if (!usuario) {
            if (alerta) alerta.style.display = 'flex'; // Muestra el aviso bonito de la plataforma
            if (inputUsuario) {
                inputUsuario.focus();
                inputUsuario.style.borderColor = '#ff4b2b';
                inputUsuario.style.boxShadow = '0 0 10px rgba(255, 75, 43, 0.3)';
            }
            return;
        }

        // Si todo está correcto, ocultamos la alerta por si estaba visible
        if (alerta) alerta.style.display = 'none';

        // Tu número de WhatsApp
        const tuNumeroWhatsApp = '51999999999'; 

        // Construcción del mensaje
        const mensaje = `Hola, deseo solicitar una recarga de panel.\n\n👤 *Usuario:* ${usuario}\n📦 *Paquete:* ${paquete}`;
        
        // Redirección a WhatsApp
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