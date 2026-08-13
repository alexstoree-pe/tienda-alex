// =========================================================
// 1. LÓGICA DE ACCESO GLOBAL E INTELIGENTE
// =========================================================
(function() {
    const path = window.location.pathname.toLowerCase();
    const esActivaciones = path.includes("activacion");
    const esIndex = path === "/" || path.includes("index") || path.includes("inicio");
    const esDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");
    const esClientes = !esIndex && !esDistribuidores; 
    
    const tieneCliente = sessionStorage.getItem("acceso_cliente") === "true";
    const tieneDistribuidor = sessionStorage.getItem("acceso_distribuidor") === "true";

    let tienePermiso = false;
    
    if (esIndex) { if (tieneCliente || tieneDistribuidor) tienePermiso = true; }
    if (esActivaciones) {
        tienePermiso = true; }
    
    else if (esDistribuidores) { if (tieneDistribuidor) tienePermiso = true; } 
    else if (esClientes) { if (tieneCliente || tieneDistribuidor) tienePermiso = true; }

    document.documentElement.style.visibility = "visible";

    if (tienePermiso) {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => { document.body.style.visibility = "visible"; }, 600);
        });
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            document.body.style.visibility = "visible"; 
            const modal = document.getElementById('modal-login-distribuidor') || document.querySelector('.modal-pass');
            if (modal) {
                const titulo = modal.querySelector('h2');
                const texto = modal.querySelector('p');
                if (esDistribuidores) {
                    if (titulo) titulo.innerText = "ZONA DISTRIBUIDORES";
                    if (texto) texto.innerText = "Ingresa tu PIN VIP para acceder a esta área";
                } else if (esClientes) {
                    if (titulo) titulo.innerText = "ZONA CLIENTES";
                    if (texto) texto.innerText = "Ingresa la contraseña de clientes";
                } else {
                    if (titulo) titulo.innerText = "BIENVENIDO A ALEX STORE";
                    if (texto) texto.innerText = "Ingresa tu código (Cliente o VIP)";
                }
                modal.style.display = 'flex';
                modal.style.visibility = 'visible';
            }
        });
    }
})();

function checkInputPass(el) {
    const stars = document.getElementById('stars-placeholder');
    if (stars) {
        if (el.value.length > 0) stars.classList.add('hide-stars');
        else stars.classList.remove('hide-stars');
    }
}

function validarAcceso() {
    const inputPass = document.getElementById('input-dist-pass');
    const errorMsg = document.getElementById('error-msg');
    const pass = inputPass.value.trim().toLowerCase();
    const path = window.location.pathname.toLowerCase();
    const esIndex = path === "/" || path.includes("index") || path.includes("inicio");
    const esDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");

    if (pass === "1122") {
        if (esDistribuidores) { mostrarError("CONTRASEÑA SOLO VÁLIDA PARA CLIENTES", inputPass, errorMsg); return; }
        sessionStorage.setItem("acceso_cliente", "true");
        if (esIndex) window.location.href = "/clientes"; else location.reload(); 
    } 
    else if (pass === "dis") {
        sessionStorage.setItem("acceso_distribuidor", "true");
        if (esIndex) window.location.href = "/distribuidores"; else location.reload();
    } 
    else { mostrarError("CONTRASEÑA INCORRECTA", inputPass, errorMsg); }
}

function mostrarError(mensaje, inputPass, errorMsg) {
    errorMsg.innerText = mensaje;
    inputPass.classList.add('error-shake');
    inputPass.value = "";
    const placeholder = document.getElementById('stars-placeholder');
    if(placeholder) placeholder.classList.remove('hide-stars');
    setTimeout(() => { inputPass.classList.remove('error-shake'); errorMsg.innerText = ""; }, 3000);
}