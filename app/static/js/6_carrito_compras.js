window.carrito = [];

window.toggleCarrito = function(elemento, ev) {
    if(elemento.classList.contains('agotado')) return;
    
    const wasSelected = elemento.classList.contains('selected');
    const nombre = (elemento.querySelector('.nombre-prod, h3')?.innerText) || "Producto";

    if (wasSelected) {
        elemento.classList.remove('selected');
        elemento.setAttribute('data-cantidad', '0');
        if (typeof window.showToast === 'function') window.showToast(`Quitaste ${nombre}`, false);
    } else {
        elemento.classList.add('selected');
        elemento.setAttribute('data-cantidad', '1');
        if (typeof window.showToast === 'function') window.showToast(`Añadiste ${nombre}`, true);
    }
    window.reconstruirCarritoDesdeUI();
};

window.reconstruirCarritoDesdeUI = function() {
    window.carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(el => {
        const nombre = (el.querySelector('.nombre-prod, h3')?.innerText) || "Producto";
        const precioText = (el.querySelector('.precio-prod, .price-tag')?.innerText) || "0";
        const precio = parseFloat(precioText.replace('S/', '').trim());
        const renovacion = (el.querySelector('.badge-renovacion')?.innerText) || null;
        const cantidad = parseInt(el.getAttribute('data-cantidad') || '1');
        const isPremium = el.classList.contains('premium');

        const tagsElements = el.querySelectorAll('.tag-prop');
        let caracteristicas = " 🔹 Sin descripción extra";
        let tagsArray = []; 
        
        if (tagsElements.length > 0) {
            tagsArray = Array.from(tagsElements).map(tag => tag.innerText.trim());
            caracteristicas = " 🔹 " + tagsArray.join("\n 🔹 "); 
        }
        window.carrito.push({ nombre, precio, caracteristicas, tagsArray, renovacion, cantidad, isPremium }); 
    });
    window.actualizarCarritoUI();
};

window.actualizarCarritoUI = function() {
    const contador = document.getElementById('cart-count');
    const barra = document.getElementById('whatsapp-btn');
    const modalCarrito = document.getElementById('modal-carrito-resumen');
    const modalAbierto = modalCarrito && modalCarrito.style.display === 'flex';
    
    let totalItems = window.carrito.reduce((sum, p) => sum + p.cantidad, 0);
    if(contador) contador.innerText = totalItems; 
    
    if(barra) {
        if (window.carrito.length > 0 && !modalAbierto) {
            barra.classList.remove('hidden'); barra.style.display = 'flex'; 
        } else {
            barra.classList.add('hidden'); barra.style.display = 'none';
            if (window.carrito.length === 0 && modalAbierto) window.cerrarModalCarrito();
        }
    }
};

window.limpiarTodo = function(e) {
    if(e) e.stopPropagation();
    window.carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(t => {
        t.classList.remove('selected'); t.setAttribute('data-cantidad', '0');
    });
    if (typeof window.showToast === 'function') window.showToast("Selección limpiada", false);
    window.actualizarCarritoUI();
};

window.abrirModalCarrito = function() {
    window.renderizarItemsCarrito();
    document.getElementById('modal-carrito-resumen').style.display = 'flex';
    window.actualizarCarritoUI(); 
};

window.cerrarModalCarrito = function() {
    document.getElementById('modal-carrito-resumen').style.display = 'none';
    window.actualizarCarritoUI(); 
};

window.modificarCantidadDesdeCarrito = function(nombreProducto, delta) {
    let tarjetaEncontrada = null;
    document.querySelectorAll('.service-item.selected').forEach(t => {
        if ((t.querySelector('.nombre-prod, h3')?.innerText) === nombreProducto) tarjetaEncontrada = t;
    });

    if (tarjetaEncontrada) {
        let qty = parseInt(tarjetaEncontrada.getAttribute('data-cantidad') || '1') + delta;
        
        if (qty < 1) {
            tarjetaEncontrada.classList.remove('selected');
            tarjetaEncontrada.setAttribute('data-cantidad', '0');
            if (typeof window.showToast === 'function') window.showToast(`Quitaste ${nombreProducto}`, false);
        } else {
            tarjetaEncontrada.setAttribute('data-cantidad', qty);
        }
        
        window.reconstruirCarritoDesdeUI();
        if (window.carrito.length === 0) window.cerrarModalCarrito(); 
        else window.renderizarItemsCarrito(); 
    }
};

window.toggleDetallesCarrito = function(elemento) {
    elemento.closest('.carrito-item-modal').classList.toggle('abierto');
};

window.renderizarItemsCarrito = function() {
    const container = document.getElementById('carrito-items-container');
    if (!container) return;
    container.innerHTML = '';
    
    window.carrito.forEach(p => {
        let tagsHtml = (p.tagsArray?.length > 0) ? p.tagsArray.map(tag => `<li class="carrito-tag"><i class="fas fa-diamond"></i> ${tag}</li>`).join('') : '';
        const itemHtml = `
            <div class="carrito-item-modal ${p.isPremium ? 'carrito-item-premium' : ''}">
                <div class="ci-header" onclick="window.toggleDetallesCarrito(this)">
                    <div class="ci-title-row">
                        <h4>${p.nombre}</h4><i class="fas fa-chevron-down ci-chevron"></i>
                    </div>
                    <div class="ci-summary-row">
                        <div class="carrito-item-precio">S/ ${(p.precio * p.cantidad).toFixed(2)}</div>
                        <div class="carrito-item-controls" onclick="event.stopPropagation()">
                            <button onclick="window.modificarCantidadDesdeCarrito('${p.nombre}', -1)"><i class="fas fa-minus"></i></button>
                            <span>${p.cantidad}</span>
                            <button onclick="window.modificarCantidadDesdeCarrito('${p.nombre}', 1)"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div class="ci-detalles">
                    <ul class="carrito-tags-list">${tagsHtml}</ul>
                    ${p.renovacion ? `<p class="carrito-item-renovacion">🔄 ${p.renovacion}</p>` : ''}
                </div>
            </div>`;
        container.innerHTML += itemHtml;
    });

    let totalItems = window.carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = window.carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal, descuento = 0;
    const esSoloClientes = (window.location.pathname.match(/\/clientes|\/$/) && !window.location.pathname.match(/promociones|distribuidor|vip/)); 

    if (esSoloClientes && totalItems >= 2) {
        let precios = window.carrito.flatMap(p => Array(p.cantidad).fill(p.precio)).sort((a, b) => b - a);
        for (let i = 1; i < precios.length; i++) descuento += (precios[i] >= 10) ? 2 : 1;
        totalSoles = totalOriginal - descuento;
    }

    const descText = document.getElementById('carrito-descuento-text');
    if (descText) {
        if (descuento > 0) {
            descText.innerHTML = `🎁 ¡Descuento aplicado de S/ ${descuento.toFixed(2)}!<br><span style="text-decoration:line-through; color:#888; font-size:0.75rem;">Precio normal: S/ ${totalOriginal.toFixed(2)}</span>`;
            descText.style.display = 'block';
        } else descText.style.display = 'none';
    }
    const totText = document.getElementById('carrito-total-text');
    if (totText) totText.innerText = `S/ ${totalSoles.toFixed(2)}`;
};