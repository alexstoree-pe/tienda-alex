// Validar si la URL es exclusiva del panel IPTV
(function() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes("iptv")) {
        const tieneDistribuidor = sessionStorage.getItem("acceso_distribuidor") === "true";
        if (!tieneDistribuidor) {
            // Lanza el modal de seguridad (reutilizado de distribuidores)
            const modal = document.getElementById('modal-login-distribuidor');
            if(modal) {
                modal.querySelector('h2').innerText = "ZONA IPTV";
                modal.style.display = 'flex';
                document.body.style.visibility = 'hidden'; 
            }
        }
    }
})();