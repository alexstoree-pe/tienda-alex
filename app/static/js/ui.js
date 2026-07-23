/* ========================================================= */
/* LÓGICA DE INTERFAZ DE USUARIO (MODALES, TOASTS)           */
/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- CAPTURAR BOTONES DEL MODAL DE REGISTRO ---
    const btnSoyNuevo = document.getElementById('btn-soy-nuevo');
    const btnYaCompre = document.getElementById('btn-ya-compre');
    const btnCancelarRegistro = document.getElementById('btn-cancelar-registro');
    
    // --- ASIGNAR LOGICA (Separación de responsabilidades) ---
    if(btnSoyNuevo) btnSoyNuevo.addEventListener('click', mostrarFormNuevo);
    if(btnYaCompre) btnYaCompre.addEventListener('click', mostrarFormAntiguo);
    if(btnCancelarRegistro) btnCancelarRegistro.addEventListener('click', (e) => cerrarModalRegistro(e));

    // ... (Asignar lógica a los botones de FINALIZAR Y ENVIAR y VOLVER en modales) ...
});

// --- FUNCIONES DEL MODAL DE REGISTRO ---
function enviarPedido() {
    // Si el carrito (que vive en clientes.js) está vacío, no abrimos modal
    if (typeof carrito !== 'undefined' && carrito.length === 0) return;
    document.getElementById('modal-registro').style.display = 'flex';
}

function cerrarModalRegistro(e) { 
    if(e) e.stopPropagation();
    const modal = document.getElementById('modal-registro');
    // Si clican fuera del modal o en cancelar, lo cerramos
    if(e && e.target.id !== 'modal-registro' && !e.target.classList.contains('btn-modal-back')) return;
    modal.style.display = 'none'; 
    volverPaso1(); 
}

function mostrarFormNuevo() { 
    document.getElementById('paso-1').style.display = 'none'; 
    document.getElementById('form-datos').style.display = 'block'; 
    // Llamamos a la función mágica que vive en clientes.js
    if (typeof generarInputsPerfiles === 'function') generarInputsPerfiles('perfiles-nuevo-container');
}

function mostrarFormAntiguo() { 
    document.getElementById('paso-1').style.display = 'none'; 
    document.getElementById('form-antiguo').style.display = 'block'; 
    // Llamamos a la función mágica que vive en clientes.js
    if (typeof generarInputsPerfiles === 'function') generarInputsPerfiles('perfiles-antiguo-container');
}

function volverPaso1() { 
    document.getElementById('form-datos').style.display = 'none'; 
    document.getElementById('form-antiguo').style.display = 'none'; 
    document.getElementById('paso-1').style.display = 'block';
    document.getElementById('error-reg').innerText = ""; 
}

// ... (Copia aquí abrirModalInfo, cerrarModalInfo, toggleFaq) ...