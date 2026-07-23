// =========================================================
// LÓGICA EXCLUSIVA: PÁGINA DE CLIENTES
// =========================================================

let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. INICIALIZADOR DE CANTIDADES (+ / -) EN TARJETAS
    document.querySelectorAll('.service-card').forEach(card => {
        if (!card.querySelector('.qty-controls')) {
            const controles = document.createElement('div');
            controles.className = 'qty-controls';
            controles.innerHTML = `
                <button class="qty-btn" id="btn-minus"><i class="fas fa-minus" style="font-size:0.7rem"></i></button>
                <span class="qty-display">1</span>
                <button class="qty-btn" id="btn-plus"><i class="fas fa-plus" style="font-size:0.7rem"></i></button>
            `;
            const checkIcon = card.querySelector('.check-icon');
            if (checkIcon) checkIcon.after(controles);

            const btnMinus = controles.querySelector('#btn-minus');
            const btnPlus = controles.querySelector('#btn-plus');
            
            if(btnMinus) btnMinus.addEventListener('click', (e) => cambiarCantidad(e, -1, btnMinus));
            if(btnPlus) btnPlus.addEventListener('click', (e) => cambiarCantidad(e, 1, btnPlus));
        }
    });

    // 2. ASIGNAR CLIC A LAS TARJETAS (Seleccionar producto)
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.qty-controls')) return;
            toggleCarrito(item);
        });
    });

    // 3. ASIGNAR CLIC AL BOTÓN DE LIMPIAR TODO EL CARRITO
    const btnClearCart = document.getElementById('btn-clear-cart');
    if(btnClearCart) btnClearCart.addEventListener('click', limpiarTodo);

    // 4. ASIGNAR EVENTO AL BUSCADOR
    const searchInput = document.getElementById('search-input');
    if(searchInput) searchInput.addEventListener('keyup', filtrarPlataformas);

    // 5. ASIGNAR EVENTOS A LOS FILTROS DE CATEGORÍA
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.getAttribute('data-cat') || btn.innerText.trim();
            filtrarCategoria(categoria, btn);
        });
    });

    // 6. BOTONES DE DESPLAZAMIENTO HORIZONTAL DE FILTROS
    const scrollLeft = document.getElementById('scroll-left');
    const scrollRight = document.getElementById('scroll-right');
    if(scrollLeft) scrollLeft.addEventListener('click', () => scrollFilters(-100));
    if(scrollRight) scrollRight.addEventListener('click', () => scrollFilters(100));

    // 7. BOTONES DE VISTA (Lista / Cuadrícula)
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const modo = btn.getAttribute('data-view') || (btn.id === 'btn-grid' ? 'cuadricula' : 'lista');
            cambiarVista(modo, btn);
        });
    });
});

// =========================================================
// GESTIÓN DE CANTIDADES Y SELECCIÓN
// =========================================================
function cambiarCantidad(event, delta, btn) {
    event.stopPropagation(); 
    const item = btn.closest('.service-item');
    if (item.classList.contains('agotado')) return;

    let qty = parseInt(item.getAttribute('data-cantidad') || '1');
    qty += delta;
    if (qty < 1) qty = 1;

    item.setAttribute('data-cantidad', qty);
    btn.parentElement.querySelector('.qty-display').innerText = qty;
    reconstruirCarritoDesdeUI();
}

function toggleCarrito(elemento) {
    if(elemento.classList.contains('agotado')) return;

    const wasSelected = elemento.classList.contains('selected');
    const nombre = elemento.querySelector('.nombre-prod').innerText;

    if (wasSelected) {
        elemento.classList.remove('selected');
        elemento.setAttribute('data-cantidad', '0');
        if(typeof window.showToast === 'function') showToast(`Quitaste ${nombre}`, false);
    } else {
        elemento.classList.add('selected');
        elemento.setAttribute('data-cantidad', '1');
        const qtyDisplay = elemento.querySelector('.qty-display');
        if(qtyDisplay) qtyDisplay.innerText = '1';
        if(typeof window.showToast === 'function') showToast(`Añadiste ${nombre}`, true);
    }

    reconstruirCarritoDesdeUI();
}

function reconstruirCarritoDesdeUI() {
    carrito = [];
    const seleccionados = document.querySelectorAll('.service-item.selected');
    
    seleccionados.forEach(el => {
        const nombre = el.querySelector('.nombre-prod').innerText;
        const precioText = el.querySelector('.precio-prod').innerText;
        const tagsEl = el.querySelector('.product-tags');
        const caracteristicas = tagsEl ? tagsEl.innerText.replace(/\n/g, ' • ') : "Sin descripción";
        const precio = parseFloat(precioText.replace('S/', '').trim());
        
        const renovacionEl = el.querySelector('.badge-renovacion');
        const renovacion = renovacionEl ? renovacionEl.innerText : null;
        const cantidad = parseInt(el.getAttribute('data-cantidad') || '1');

        carrito.push({ nombre, precio, caracteristicas, renovacion, cantidad: cantidad }); 
    });
    
    actualizarCarritoUI();
}

// =========================================================
// LÓGICA DE PRECIOS Y DESCUENTO (SÓLO CLIENTES)
// =========================================================
function actualizarCarritoUI() {
    const contador = document.getElementById('cart-count');
    const totalTxt = document.getElementById('cart-total');
    const originalTxt = document.getElementById('cart-original-price'); 
    const barra = document.getElementById('whatsapp-btn');
    const labelDescuento = document.getElementById('discount-label'); 
    
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal; 
    
    const path = window.location.pathname.toLowerCase();
    const esSoloClientes = (path.endsWith("/clientes") || path.endsWith("/clientes.html")) && !path.includes("promociones"); 
    
    let descuento = 0;
    
    if (esSoloClientes && totalItems >= 2) {
        let precios = [];
        carrito.forEach(p => {
            for (let i = 0; i < p.cantidad; i++) {
                precios.push(p.precio);
            }
        });
        
        precios.sort((a, b) => b - a);
        
        for (let i = 1; i < precios.length; i++) {
            if (precios[i] >= 10) {
                descuento += 2.00; 
            } else {
                descuento += 1.00; 
            }
        }
        totalSoles = totalOriginal - descuento; 
    }
    
    if (descuento > 0) {
        if (originalTxt) {
            originalTxt.innerText = `S/ ${totalOriginal.toFixed(2)}`;
            originalTxt.style.display = 'block';
        }
        if (labelDescuento) {
            labelDescuento.innerText = `¡AHORRAS S/ ${descuento.toFixed(2)}!`;
            labelDescuento.style.display = 'inline-block';
        }
    } else {
        if (originalTxt) originalTxt.style.display = 'none';
        if (labelDescuento) {
            labelDescuento.style.display = 'none';
            labelDescuento.innerText = '';
        }
    }
    
    if(contador) contador.innerText = totalItems; 
    if(totalTxt) totalTxt.innerText = `S/ ${totalSoles.toFixed(2)}`;
    
    if(barra) {
        if (carrito.length > 0) {
            barra.classList.remove('hidden');
            barra.style.display = 'flex'; 
        } else {
            barra.classList.add('hidden');
            barra.style.display = 'none';
        }
    }
}

function limpiarTodo(e) {
    if(e) e.stopPropagation();
    carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('data-cantidad', '0');
    });
    if(typeof window.showToast === 'function') showToast("Selección limpiada", false);
    actualizarCarritoUI();
}

// =========================================================
// BUSCADOR Y FILTROS
// =========================================================
function filtrarPlataformas() {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    const btnTodos = document.querySelector(".btn-nav[data-cat='TODOS']") || document.querySelector(".btn-nav");
    if(btnTodos) btnTodos.classList.add('active');
    
    const input = document.getElementById('search-input').value.trim().toLowerCase();
    const tarjetas = document.querySelectorAll('.service-item');
    
    tarjetas.forEach(tarjeta => {
        const nombre = tarjeta.querySelector('.nombre-prod') ? tarjeta.querySelector('.nombre-prod').innerText.toLowerCase() : "";
        const tags = tarjeta.querySelector('.product-tags') ? tarjeta.querySelector('.product-tags').innerText.toLowerCase() : "";
        
        if (input === "" || nombre.includes(input) || tags.includes(input)) {
            tarjeta.classList.remove('oculto-busqueda', 'oculto-filtro');
        } else {
            tarjeta.classList.add('oculto-busqueda');
        }
    });
    
    actualizarTitulos();
}

function filtrarCategoria(categoria, boton) {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    if(boton) boton.classList.add('active');

    let categoriaBuscada = categoria.toUpperCase();
    if (categoriaBuscada.includes('PERFILES')) {
        categoriaBuscada = 'STREAMING Y CINE';
    }

    const titulos = document.querySelectorAll('.category-title');
    let primerElementoVisible = null;

    titulos.forEach(titulo => {
        const textoTitulo = titulo.innerText.toUpperCase();
        const coincide = (categoriaBuscada === 'TODOS' || textoTitulo.includes(categoriaBuscada));
        
        if (coincide && !primerElementoVisible) primerElementoVisible = titulo;

        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item')) {
                if (coincide) hermano.classList.remove('oculto-filtro');
                else hermano.classList.add('oculto-filtro');
            }
            hermano = hermano.nextElementSibling;
        }
    });
    actualizarTitulos();

    setTimeout(() => {
        if (categoriaBuscada !== 'TODOS' && primerElementoVisible) {
            const yOffset = -310; 
            const y = primerElementoVisible.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        } else if (categoriaBuscada === 'TODOS') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 100); 
}

function actualizarTitulos() {
    document.querySelectorAll('.category-title').forEach(titulo => {
        let has = false;
        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item') && !hermano.classList.contains('oculto-filtro') && !hermano.classList.contains('oculto-busqueda')) { 
                has = true; break; 
            }
            hermano = hermano.nextElementSibling;
        }
        if(has) {
            titulo.style.display = 'flex';
            titulo.style.opacity = '1';
            titulo.style.height = 'auto';
            titulo.style.margin = '16px 0 12px';
        } else {
            titulo.style.opacity = '0';
            titulo.style.height = '0';
            titulo.style.margin = '0';
            setTimeout(() => {
                if (titulo.style.opacity === '0') titulo.style.display = 'none';
            }, 300);
        }
    });
}

function scrollFilters(val) {
    const container = document.getElementById('filterScroll');
    if(container) container.scrollBy({ left: val, behavior: 'smooth' });
}

function cambiarVista(modo, btn) {
    const cont = document.querySelector('.container#product-container');
    document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    
    if (modo === 'grid' || modo === 'cuadricula') {
        cont.classList.add('grid-mode');
        document.body.classList.add('grid-activa'); 
    } else {
        cont.classList.remove('grid-mode');
        document.body.classList.remove('grid-activa');
    }
}

// =========================================================
// MODAL DE PEDIDO VIP / PERFILES DINÁMICOS Y WHATSAPP
// =========================================================
function enviarPedido() {
    if (carrito.length === 0) return;
    const pasoSel = document.getElementById('paso-seleccion');
    const pasoNom = document.getElementById('paso-nombre');
    const modal = document.getElementById('modal-pedido-vip');
    
    if (pasoSel) pasoSel.style.display = 'block';
    if (pasoNom) pasoNom.style.display = 'none';
    if (modal) modal.style.display = 'flex';
}

function cerrarModalPedido() {
    const modal = document.getElementById('modal-pedido-vip');
    if (modal) modal.style.display = 'none';
}

function irAPasoNombre() {
    const container = document.getElementById('dynamic-inputs-container');
    if (!container) return;
    
    container.innerHTML = ''; 
    carrito.forEach(producto => {
        for (let i = 0; i < producto.cantidad; i++) {
            const label = document.createElement('span');
            label.className = 'label-dynamic';
            label.innerText = producto.cantidad > 1 ? `${producto.nombre} (Unidad ${i + 1})` : producto.nombre;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'nombre-perfil-input-dynamic';
            input.placeholder = 'Ej: Juan / Familia';
            input.dataset.producto = producto.nombre;
            input.dataset.unidad = i + 1;

            container.appendChild(label);
            container.appendChild(input);
        }
    });

    const pasoSel = document.getElementById('paso-seleccion');
    const pasoNom = document.getElementById('paso-nombre');
    if (pasoSel) pasoSel.style.display = 'none';
    if (pasoNom) pasoNom.style.display = 'block';
}

function volverAPaso1() {
    const pasoSel = document.getElementById('paso-seleccion');
    const pasoNom = document.getElementById('paso-nombre');
    if (pasoSel) pasoSel.style.display = 'block';
    if (pasoNom) pasoNom.style.display = 'none';
}

function finalizarSinNombre() {
    ejecutarEnvioWhatsApp(null); 
    cerrarModalPedido();
}

function finalizarConNombre() {
    const inputs = document.querySelectorAll('.nombre-perfil-input-dynamic');
    let nombresData = {};
    let hayVacios = false;

    inputs.forEach(input => {
        if (input.value.trim() === "") hayVacios = true;
        const prodName = input.dataset.producto;
        if(!nombresData[prodName]) nombresData[prodName] = [];
        nombresData[prodName].push(input.value.trim());
    });

    if (hayVacios) {
        alert("Por favor, ingresa un nombre para todos los perfiles que seleccionaste.");
        return;
    }

    ejecutarEnvioWhatsApp(nombresData);
    cerrarModalPedido();
}

function ejecutarEnvioWhatsApp(nombresData) {
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal;
    let descuento = 0;

    const path = window.location.pathname.toLowerCase();
    const esSoloClientes = (path.endsWith("/clientes") || path.endsWith("/clientes.html")) && !path.includes("promociones"); 
    
    if (esSoloClientes && totalItems >= 2) {
        let precios = [];
        carrito.forEach(p => {
            for (let i = 0; i < p.cantidad; i++) {
                precios.push(p.precio);
            }
        });
        precios.sort((a, b) => b - a);
        
        for (let i = 1; i < precios.length; i++) {
            if (precios[i] >= 10) {
                descuento += 2.00;
            } else {
                descuento += 1.00;
            }
        }
        totalSoles = totalOriginal - descuento;
    }

    let tipoUsuario = esSoloClientes ? "cliente" : "distribuidor";
    let mensaje = `¡Hola Alex Store! soy ${tipoUsuario} 👋 Deseo adquirir:\n\n`;
    
    carrito.forEach(p => {
        mensaje += `⭐ *${p.cantidad}x ${p.nombre}*\n`;
        mensaje += `📝 ${p.caracteristicas}\n`;
        mensaje += `💵 P. Unitario: S/ ${p.precio.toFixed(2)} | Subtotal: S/ ${(p.precio * p.cantidad).toFixed(2)}\n`;
        
        if (p.renovacion) mensaje += `🔄 ${p.renovacion}\n`;
        
        if (nombresData && nombresData[p.nombre]) {
            mensaje += `👤 Nombres solicitados:\n`;
            nombresData[p.nombre].forEach((nom, i) => {
                let etiqueta = p.cantidad > 1 ? `Cuenta ${i+1}` : "Nombre";
                mensaje += `   - ${etiqueta}: *${nom}*\n`;
            });
        }
        mensaje += `--------------------------\n`;
    });
    
    if (descuento > 0) {
        mensaje += `\n🎁 *Descuento aplicado:* -S/ ${descuento.toFixed(2)}`;
    }
    
    mensaje += `\n💰 *TOTAL A PAGAR: S/ ${totalSoles.toFixed(2)}*`;
    
    window.open(`https://wa.me/51918600000?text=${encodeURIComponent(mensaje)}`, '_blank');
    limpiarTodo();
}
// =========================================================
// DELEGACIÓN GLOBAL DE CLICS EN TARJETAS (Solución definitiva)
// =========================================================
document.addEventListener("click", function(e) {
    const item = e.target.closest('.service-item');
    if (!item) return;
    
    // Si el usuario hace clic en los botones de cantidad (+ / -), ignoramos la selección general
    if (e.target.closest('.qty-controls')) return;
    
    // Ejecutamos la función de selección del carrito
    toggleCarrito(item);
});
function toggleCarrito(elemento) {
    if (elemento.classList.contains('agotado')) return;

    const wasSelected = elemento.classList.contains('selected');
    const nombreElemento = elemento.querySelector('.nombre-prod');
    const nombre = nombreElemento ? nombreElemento.innerText : "Producto";

    if (wasSelected) {
        elemento.classList.remove('selected');
        elemento.setAttribute('data-cantidad', '0');
        showToast(`Quitaste ${nombre}`, false);
    } else {
        elemento.classList.add('selected');
        elemento.setAttribute('data-cantidad', '1');
        const qtyDisplay = elemento.querySelector('.qty-display');
        if (qtyDisplay) qtyDisplay.innerText = '1';
        showToast(`Añadiste ${nombre}`, true);
    }

    reconstruirCarritoDesdeUI();
}