// =========================================================
// LÓGICA DE ACCESO GLOBAL E INTELIGENTE (PORTAL MULTI-ZONA)
// =========================================================
(function() {
    // 1. Leemos la URL actual para saber en qué página estamos
    const path = window.location.pathname.toLowerCase();
    
    // 2. Clasificamos las rutas mágicamente por sus nombres:
    const esIndex = path === "/" || path.includes("index") || path.includes("inicio");
    const esDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");
    // Si no es el inicio y tampoco tiene nombre de distribuidor, asumimos que es zona de CLIENTES
    const esClientes = !esIndex && !esDistribuidores; 
    
    // 3. Verificamos qué "llaves" tiene guardadas el navegador
    const tieneCliente = sessionStorage.getItem("acceso_cliente") === "true";
    const tieneDistribuidor = sessionStorage.getItem("acceso_distribuidor") === "true";

    let tienePermiso = false;

    // 4. Verificamos si sus llaves sirven para la página actual
    if (esIndex) {
        if (tieneCliente || tieneDistribuidor) tienePermiso = true; 
    } else if (esDistribuidores) {
        // A la zona de Distribuidores SOLO entran los que tienen llave VIP (dis)
        if (tieneDistribuidor) tienePermiso = true;
    } else if (esClientes) {
        // A los clientes entran los clientes (1122) y el dueño (dis) para revisar su tienda
        if (tieneCliente || tieneDistribuidor) tienePermiso = true;
    }

    // 5. Si tiene permiso, revelamos la web. Si no, bloqueamos y mostramos modal
    if (tienePermiso) {
        document.documentElement.style.visibility = "visible";
        document.addEventListener("DOMContentLoaded", () => {
            document.body.style.visibility = "visible";
        });
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            const modal = document.getElementById('modal-login-distribuidor');
            if (modal) {
                const titulo = modal.querySelector('h2');
                const texto = modal.querySelector('p');
                
                // Cambiamos el texto del modal según dónde intentaron entrar
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
                document.body.style.visibility = 'hidden'; 
                modal.style.visibility = 'visible';
            }
        });
    }
})();

// Control de las "estrellitas" de la contraseña
function checkInputPass(el) {
    const stars = document.getElementById('stars-placeholder');
    if (stars) {
        if (el.value.length > 0) stars.classList.add('hide-stars');
        else stars.classList.remove('hide-stars');
    }
}

// Función que valida lo que escribe el usuario
function validarAcceso() {
    const inputPass = document.getElementById('input-dist-pass');
    const errorMsg = document.getElementById('error-msg');
    const pass = inputPass.value.trim().toLowerCase();
    
    const path = window.location.pathname.toLowerCase();
    const esIndex = path === "/" || path.includes("index") || path.includes("inicio");
    const esDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");

    // CASO 1: Ingresa contraseña de CLIENTES
    if (pass === "1122") {
        // Bloqueo de seguridad: Evita que un cliente quiera usar su clave en URLs de distribuidores
        if (esDistribuidores) {
            mostrarError("CONTRASEÑA SOLO VÁLIDA PARA CLIENTES", inputPass, errorMsg);
            return;
        }
        
        sessionStorage.setItem("acceso_cliente", "true");
        
        // Si está en el index, lo mandamos a clientes automáticamente. Si está en otra ruta (link directo), solo recargamos.
        if (esIndex) window.location.href = "/clientes"; 
        else location.reload(); 
        
    } 
    // CASO 2: Ingresa contraseña de DISTRIBUIDORES
    else if (pass === "dis") {
        sessionStorage.setItem("acceso_distribuidor", "true");
        
        if (esIndex) window.location.href = "/distribuidores"; 
        else location.reload();
        
    } 
    // CASO 3: Se equivoca
    else {
        mostrarError("CONTRASEÑA INCORRECTA", inputPass, errorMsg);
    }
}

// Función auxiliar para las animaciones de error
function mostrarError(mensaje, inputPass, errorMsg) {
    errorMsg.innerText = mensaje;
    inputPass.classList.add('error-shake');
    inputPass.value = "";
    
    const placeholder = document.getElementById('stars-placeholder');
    if(placeholder) placeholder.classList.remove('hide-stars');
    
    setTimeout(() => { 
        inputPass.classList.remove('error-shake'); 
        errorMsg.innerText = ""; 
    }, 3000);
}