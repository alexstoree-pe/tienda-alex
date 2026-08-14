window.enviarPedido = function() {
    if (window.carrito.length === 0) return; 
    window.abrirModalCarrito();
};

window.continuarPedido = function() {
    const modalCarrito = document.getElementById('modal-carrito-resumen');
    if (modalCarrito) modalCarrito.style.display = 'none';
    if (typeof window.actualizarCarritoUI === 'function') window.actualizarCarritoUI();
    
    const btnCarrito = document.getElementById('whatsapp-btn');
    if (btnCarrito) btnCarrito.style.display = 'none';
    
    const esDistribuidor = window.location.pathname.toLowerCase().match(/distribuidor|vip|iptv/);

    if (esDistribuidor) {
        document.getElementById('paso-seleccion').style.display = 'block';
        document.getElementById('paso-nombre').style.display = 'none';
        document.getElementById('modal-pedido-vip').style.display = 'flex';
    } else {
        document.getElementById('paso-cliente-1').style.display = 'block';
        document.getElementById('paso-cliente-2').style.display = 'none';
        document.getElementById('modal-pedido-cliente').style.display = 'flex';
    }
};

window.cerrarModalPedido = function() { 
    document.getElementById('modal-pedido-vip').style.display = 'none'; 
    
    if (typeof window.abrirModalCarrito === 'function') {
        window.abrirModalCarrito();
    } else {
        const modalCarrito = document.getElementById('modal-carrito-resumen');
        if (modalCarrito) modalCarrito.style.display = 'flex';
    }
};
window.irAPasoNombre = function() {
    const container = document.getElementById('dynamic-inputs-container');
    if (!container) return;
    container.innerHTML = ''; 
    window.carrito.forEach(p => {
        for (let i = 0; i < p.cantidad; i++) {
            container.innerHTML += `<span class="label-dynamic">${p.cantidad > 1 ? `${p.nombre} (Unidad ${i + 1})` : p.nombre}</span>
            <input type="text" class="nombre-perfil-input-dynamic input-distribuidor" placeholder="Ej: Juan / Familia" data-producto="${p.nombre}">`;
        }
    });
    document.getElementById('paso-seleccion').style.display = 'none';
    document.getElementById('paso-nombre').style.display = 'block';
};
window.volverAPaso1 = function() {
    document.getElementById('paso-seleccion').style.display = 'block';
    document.getElementById('paso-nombre').style.display = 'none';
};
window.finalizarSinNombre = function() { window.ejecutarEnvioWhatsApp(null, "distribuidor"); window.cerrarModalPedido(); };
window.finalizarConNombre = function() {
    const inputs = document.querySelectorAll('.input-distribuidor');
    let nombresData = {}, hayVacios = false;
    inputs.forEach(input => {
        if (input.value.trim() === "") hayVacios = true;
        if(!nombresData[input.dataset.producto]) nombresData[input.dataset.producto] = [];
        nombresData[input.dataset.producto].push(input.value.trim());
    });
    if (hayVacios) { alert("⚠️ Ingresa un nombre para todos los perfiles."); return; }
    window.ejecutarEnvioWhatsApp(nombresData, "distribuidor"); 
    window.cerrarModalPedido();
};

window.cerrarModalCliente = function() { 
    document.getElementById('modal-pedido-cliente').style.display = 'none'; 
    const btnCarrito = document.getElementById('whatsapp-btn');
    if (btnCarrito && window.carrito.length > 0) btnCarrito.style.display = 'flex';
};
window.toggleCamposCliente = function() {
    const tipo = document.getElementById('cliente-tipo').value;
    document.getElementById('div-datos-nuevo').style.display = (tipo === "Cliente Nuevo") ? 'block' : 'none';
};
window.irAPasoNombreCliente = function() {
    const tipo = document.getElementById('cliente-tipo').value;
    if (tipo === "Cliente Nuevo" && (document.getElementById('cliente-nombre').value.trim() === "" || document.getElementById('cliente-celular').value.trim() === "")) {
        if (typeof window.showToast === 'function') window.showToast("⚠️ Ingresa Nombre y Celular para continuar", false); return;
    }
    const container = document.getElementById('dynamic-inputs-cliente');
    container.innerHTML = ''; 
    window.carrito.forEach(p => {
        for (let i = 0; i < p.cantidad; i++) {
            container.innerHTML += `<span class="label-dynamic">${p.cantidad > 1 ? `${p.nombre} (Unidad ${i + 1})` : p.nombre}</span>
            <input type="text" class="nombre-perfil-input-dynamic input-cliente" placeholder="Ej: Juan / Familia" data-producto="${p.nombre}">`;
        }
    });
    document.getElementById('paso-cliente-1').style.display = 'none';
    document.getElementById('paso-cliente-2').style.display = 'block';
};
window.volverAPaso1Cliente = function() {
    const modalCliente = document.getElementById('modal-pedido-cliente');
    if (modalCliente) modalCliente.style.display = 'none';

    if (typeof window.abrirModalCarrito === 'function') {
        window.abrirModalCarrito();
    } else {
        const modalCarrito = document.getElementById('modal-carrito-resumen');
        if (modalCarrito) modalCarrito.style.display = 'flex';
    }
};
window.finalizarPedidoCliente = function() {
    const inputs = document.querySelectorAll('.input-cliente');
    let nombresData = {}, hayVacios = false;
    inputs.forEach(input => {
        if (input.value.trim() === "") hayVacios = true;
        if(!nombresData[input.dataset.producto]) nombresData[input.dataset.producto] = [];
        nombresData[input.dataset.producto].push(input.value.trim());
    });
    if (hayVacios) { alert("⚠️ Por favor, ingresa un nombre para todos los perfiles."); return; }
    window.ejecutarEnvioWhatsApp(nombresData, "cliente"); 
    window.cerrarModalCliente();
};

window.ejecutarEnvioWhatsApp = function(nombresData, tipoUsuario) {
    let totalItems = window.carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalSoles = window.carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let descuento = 0;

    if (tipoUsuario === "cliente" && totalItems >= 2) {
        let precios = window.carrito.flatMap(p => Array(p.cantidad).fill(p.precio)).sort((a, b) => b - a);
        for (let i = 1; i < precios.length; i++) descuento += (precios[i] >= 10) ? 2 : 1;
        totalSoles -= descuento;
    }

    let mensaje = (tipoUsuario === "cliente") ? `¡Hola Alex Store! 👋 Deseo adquirir servicios.\n\n👤 *DATOS DEL CLIENTE*\n▪️ Estado: ${document.getElementById('cliente-tipo')?.value || "Normal"}\n` : `¡Hola Alex Store! soy distribuidor VIP 👋 Deseo adquirir:\n\n`;
    
    if (tipoUsuario === "cliente" && document.getElementById('cliente-tipo')?.value === "Cliente Nuevo") {
        mensaje += `▪️ Nombre: ${document.getElementById('cliente-nombre').value.trim()}\n▪️ Celular: ${document.getElementById('cliente-celular').value.trim()}\n`;
    }
    if(tipoUsuario === "cliente") mensaje += `\n🛒 *MI PEDIDO*\n`;
    
    window.carrito.forEach(p => {
        mensaje += `⭐ *${p.cantidad}x ${p.nombre}*\n📝 *Detalles:*\n${p.caracteristicas}\n💵 P. Unitario: S/ ${p.precio.toFixed(2)} | Subtotal: S/ ${(p.precio * p.cantidad).toFixed(2)}\n`;
        if (p.renovacion) mensaje += `🔄 ${p.renovacion}\n`;
        if (nombresData && nombresData[p.nombre]) {
            mensaje += `👤 Nombres solicitados:\n`;
            nombresData[p.nombre].forEach((nom, i) => { mensaje += `   - ${p.cantidad > 1 ? `Cuenta ${i+1}` : "Nombre"}: *${nom}*\n`; });
        }
        mensaje += `--------------------------\n`;
    });
    
    if (descuento > 0) mensaje += `\n🎁 *Descuento aplicado:* -S/ ${descuento.toFixed(2)}`;
    mensaje += `\n💰 *TOTAL A PAGAR: S/ ${totalSoles.toFixed(2)}*`;
    
    if (document.getElementById('cliente-nombre')) document.getElementById('cliente-nombre').value = '';
    if (document.getElementById('cliente-celular')) document.getElementById('cliente-celular').value = '';

    window.open(`https://wa.me/51918600000?text=${encodeURIComponent(mensaje)}`, '_blank');
};