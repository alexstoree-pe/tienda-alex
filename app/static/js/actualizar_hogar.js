
    function enviarWhatsAppActualizar() {
        const inputCorreo = document.getElementById('input-correo-cuenta');
        const alerta = document.getElementById('alerta-error-correo');
        const correo = inputCorreo ? inputCorreo.value.trim() : '';

        // Validación: si no puso correo, mostramos alerta
        if (!correo) {
            alerta.style.display = 'flex';
            inputCorreo.style.borderColor = '#ff4b2b';
            inputCorreo.focus();
            return;
        }

        // Ocultar alerta si todo está bien
        alerta.style.display = 'none';
        inputCorreo.style.borderColor = 'rgba(255,255,255,0.15)';

        // Construir mensaje
        const numeroWhatsApp = '51918600000'; 
        const mensaje = `Hola, necesito ayuda para Actualizar el Hogar de mi cuenta Netflix.\n\n📧 *Correo de la cuenta:* ${correo}`;
        
        // Redirigir
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }

    // Limpiar error al escribir
    document.getElementById('input-correo-cuenta').addEventListener('input', function() {
        document.getElementById('alerta-error-correo').style.display = 'none';
        this.style.borderColor = 'rgba(255,255,255,0.15)';
    });


