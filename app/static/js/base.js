// =========================================================
// LÓGICA DE ACCESO GLOBAL E INTELIGENTE (PORTAL MULTI-ZONA)
// =========================================================
(function() {
    const path = window.location.pathname.toLowerCase();
    
    const esIndex = path === "/" || path.includes("index") || path.includes("inicio");
    const esDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");
    const esClientes = !esIndex && !esDistribuidores; 
    
    const tieneCliente = sessionStorage.getItem("acceso_cliente") === "true";
    const tieneDistribuidor = sessionStorage.getItem("acceso_distribuidor") === "true";

    let tienePermiso = false;

    if (esIndex) {
        if (tieneCliente || tieneDistribuidor) tienePermiso = true; 
    } else if (esDistribuidores) {
        if (tieneDistribuidor) tienePermiso = true;
    } else if (esClientes) {
        if (tieneCliente || tieneDistribuidor) tienePermiso = true;
    }

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
        if (esDistribuidores) {
            mostrarError("CONTRASEÑA SOLO VÁLIDA PARA CLIENTES", inputPass, errorMsg);
            return;
        }
        sessionStorage.setItem("acceso_cliente", "true");
        if (esIndex) window.location.href = "/clientes"; 
        else location.reload(); 
    } 
    else if (pass === "dis") {
        sessionStorage.setItem("acceso_distribuidor", "true");
        if (esIndex) window.location.href = "/distribuidores"; 
        else location.reload();
    } 
    else {
        mostrarError("CONTRASEÑA INCORRECTA", inputPass, errorMsg);
    }
}

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

// =========================================================
// LÓGICA DE INTERFAZ GLOBAL (SCROLL, BUSCADOR)
// =========================================================
window.onscroll = function() {
    const btnSubir = document.getElementById("back-to-top");
    if(btnSubir) {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) btnSubir.classList.add("show");
        else btnSubir.classList.remove("show");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const btnSubir = document.getElementById("back-to-top");
    if (btnSubir) {
        btnSubir.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

document.addEventListener("mousemove", (e) => {
    const bg = document.querySelector('body::before');
    if(bg) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        bg.style.transform = `translate(${x}px, ${y}px)`;
    }
});

window.showToast = function(message, isAdded = true) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${isAdded ? '' : 'remove'}`;
    toast.innerHTML = `<i class="fas ${isAdded ? 'fa-check-circle' : 'fa-minus-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
};

// =========================================================
// MOTOR CINEMATOGRÁFICO NATIVO (REEMPLAZA A AOS)
// =========================================================
window.activarEfectoCineNativo = function() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('oculto-filtro')) {
                entry.target.classList.add('premium-visible');
                obs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.service-item:not(.premium-hidden), .category-title:not(.premium-hidden)').forEach(el => {
        el.classList.add('premium-hidden');
        observer.observe(el);
    });
};

window.cambiarVista = function(modo, btn) {
    const cont = document.querySelector('.container#product-container') || document.querySelector('.container');
    document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    
    if (modo === 'grid' || modo === 'cuadricula') {
        cont.classList.add('grid-mode');
        document.body.classList.add('grid-activa'); 
    } else {
        cont.classList.remove('grid-mode');
        document.body.classList.remove('grid-activa');
    }
    // Reprocesar animaciones tras cambiar vista
    setTimeout(() => { window.activarEfectoCineNativo(); }, 100);
};

window.filtrarPlataformas = function() {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    const btnTodos = document.querySelector(".btn-nav[onclick*='TODOS']");
    
    const isTodosActive = btnTodos && btnTodos.classList.contains('active');
    if (!isTodosActive && btnTodos) {
        window._isRestoring = true; 
        btnTodos.click(); 
        setTimeout(() => { window._isRestoring = false; }, 200); 
    }
    
    if(btnTodos) btnTodos.classList.add('active');
    
    const input = document.getElementById('search-input').value.trim().toLowerCase();
    const tarjetas = document.querySelectorAll('.service-item');
    
    tarjetas.forEach(tarjeta => {
        const nombreEl = tarjeta.querySelector('.nombre-prod') || tarjeta.querySelector('h3');
        // 🔥 CURA: Usamos textContent para leer el texto a la velocidad de la luz
        const nombre = nombreEl ? (nombreEl.textContent || "").toLowerCase() : "";
        const tagsEl = tarjeta.querySelector('.product-tags');
        const tags = tagsEl ? (tagsEl.textContent || "").toLowerCase() : "";
        
        if (input === "" || nombre.includes(input) || tags.includes(input)) {
            tarjeta.classList.remove('oculto-filtro'); 
            setTimeout(() => tarjeta.classList.add('premium-visible'), 50);
        } else {
            tarjeta.classList.add('oculto-filtro');    
            tarjeta.classList.remove('premium-visible');
        }
    });
    
    actualizarTitulos(); 
    window.activarEfectoCineNativo();
};

window.filtrarCategoria = function(categoria, boton) {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');

    const titulos = document.querySelectorAll('.category-title');
    let primerElementoVisible = null;

    titulos.forEach(titulo => {
        const textoTitulo = (titulo.textContent || "").toUpperCase();
        const coincide = (categoria === 'TODOS' || textoTitulo.includes(categoria.toUpperCase()));
        if (coincide && !primerElementoVisible) primerElementoVisible = titulo;

        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item')) {
                if (coincide) {
                    hermano.classList.remove('oculto-filtro');
                    hermano.classList.add('premium-visible');
                } else {
                    hermano.classList.add('oculto-filtro');
                    hermano.classList.remove('premium-visible');
                }
            }
            hermano = hermano.nextElementSibling;
        }
    });
    actualizarTitulos();
    
    // 🔥 Esperamos 450ms para que las animaciones CSS terminen y la página esté 100% estática
    setTimeout(() => {
        if (window._isRestoring) return;

        if (categoria !== 'TODOS' && primerElementoVisible) {
            const yOffset = -200; 
            const rect = primerElementoVisible.getBoundingClientRect();
            let y = rect.top + window.pageYOffset + yOffset;
            
            // Límite de seguridad estricto para categorías cortas al fondo
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (y > maxScroll) y = maxScroll;
            if (y < 0) y = 0;

            window.scrollTo({ top: y, behavior: 'smooth' });
        } else if (categoria === 'TODOS') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 450); 
    
    document.querySelectorAll('.category-title:not(.oculto-filtro)').forEach(t => t.classList.add('premium-visible'));
    window.activarEfectoCineNativo();
};

function actualizarTitulos() {
    document.querySelectorAll('.category-title').forEach(titulo => {
        let has = false;
        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item') && !hermano.classList.contains('oculto-filtro')) { 
                has = true; 
                break; 
            }
            hermano = hermano.nextElementSibling;
        }
        
        if (has) {
            titulo.style.opacity = '1'; 
            titulo.style.maxHeight = '60px'; 
            titulo.style.margin = '16px 0 12px';
            titulo.style.padding = '10px 15px';
            titulo.style.pointerEvents = 'auto';
            // 🔥 Agregamos esto para que los títulos nunca se queden invisibles
            titulo.classList.add('premium-visible'); 
        } else {
            titulo.style.opacity = '0'; 
            titulo.style.maxHeight = '0'; 
            titulo.style.margin = '0';
            titulo.style.padding = '0 15px';
            titulo.style.pointerEvents = 'none';
            // 🔥 Y se lo quitamos si deben ocultarse
            titulo.classList.remove('premium-visible'); 
        }
    });
}
window.scrollFilters = function(val) {
    const container = document.getElementById('filterScroll');
    if(container) container.scrollBy({ left: val, behavior: 'smooth' });
};

// =========================================================
// AUTO INYECTOR Y CONTROL DEL CARRITO (LIBERADO PARA TODOS)
// =========================================================
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Solo activamos el clic para seleccionar la tarjeta
    document.querySelectorAll('.service-item').forEach(item => {
        item.onclick = function(e) { window.toggleCarrito(this, e); };
    });

    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Vanilla Tilt (Animación 3D)
    if (typeof VanillaTilt !== 'undefined') {
        const tarjetas = document.querySelectorAll(".service-item");
        tarjetas.forEach(item => {
            if (item.vanillaTilt) item.vanillaTilt.destroy(); 
        });
        if (!esMovil) {
            VanillaTilt.init(tarjetas, { max: 10, speed: 400, glare: true, "max-glare": 0.2 });
        }
    }
    
    document.querySelectorAll('.service-logo').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        if (img.complete) img.classList.add('loaded');
    });

    // Arrancamos el motor cinematográfico
    window.activarEfectoCineNativo();

    setTimeout(() => { 
        crearLluviaDeLogos(); 
        iniciarNotificacionesCompras(); 
        
        cargarPreciosDeGoogleSheets(); 
        setInterval(() => { cargarPreciosDeGoogleSheets(); }, 2000);

        const path = window.location.pathname.toLowerCase();
        const esZonaDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");

        if (esZonaDistribuidores || document.querySelector('.stock-badge')) {
            cargarStockDeGoogleSheets();
            setInterval(() => { cargarStockDeGoogleSheets(); }, 2000); 
        }
    }, 500);
});

// =========================================================
// LÓGICA DE COMPRAS
// =========================================================
window.toggleCarrito = function(elemento, ev) {
    if(elemento.classList.contains('agotado')) return;
    const e = ev || window.event;
    if (e && e.target && e.target.closest('.qty-controls')) return; 

    const wasSelected = elemento.classList.contains('selected');
    const nombreElement = elemento.querySelector('.nombre-prod') || elemento.querySelector('h3');
    const nombre = nombreElement ? nombreElement.innerText : "Producto";

    if (wasSelected) {
        elemento.classList.remove('selected');
        elemento.setAttribute('data-cantidad', '0');
        showToast(`Quitaste ${nombre}`, false);
    } else {
        elemento.classList.add('selected');
        elemento.setAttribute('data-cantidad', '1');
        const qtyDisplay = elemento.querySelector('.qty-display');
        if(qtyDisplay) qtyDisplay.innerText = '1';
        showToast(`Añadiste ${nombre}`, true);
    }
    reconstruirCarritoDesdeUI();
};
function reconstruirCarritoDesdeUI() {
    carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(el => {
        const nombreElement = el.querySelector('.nombre-prod') || el.querySelector('h3');
        const nombre = nombreElement ? nombreElement.innerText : "Producto";
        const precioElement = el.querySelector('.precio-prod') || el.querySelector('.price-tag');
        const precioText = precioElement ? precioElement.innerText : "0";
        const precio = parseFloat(precioText.replace('S/', '').trim());
        const renovacionEl = el.querySelector('.badge-renovacion');
        const renovacion = renovacionEl ? renovacionEl.innerText : null;
        const cantidad = parseInt(el.getAttribute('data-cantidad') || '1');
        
        // 🔥 Detectamos si es una tarjeta Premium VIP
        const isPremium = el.classList.contains('premium');

        const tagsElements = el.querySelectorAll('.tag-prop');
        let caracteristicas = "";
        let tagsArray = []; // Guardamos las etiquetas en un arreglo para el Modal
        
        if (tagsElements.length > 0) {
            tagsArray = Array.from(tagsElements).map(tag => tag.innerText.trim());
            caracteristicas = " 🔹 " + tagsArray.join("\n 🔹 "); // Esto se sigue usando para el mensaje de WhatsApp
        } else {
            caracteristicas = " 🔹 Sin descripción extra";
        }

        carrito.push({ nombre, precio, caracteristicas, tagsArray, renovacion, cantidad, isPremium }); 
    });
    actualizarCarritoUI();
}

window.limpiarTodo = function(e) {
    if(e) e.stopPropagation();
    carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('data-cantidad', '0');
    });
    showToast("Selección limpiada", false);
    actualizarCarritoUI();
};

function actualizarCarritoUI() {
    const contador = document.getElementById('cart-count');
    const barra = document.getElementById('whatsapp-btn');
    
    // Verificamos si el modal del carrito está abierto en la pantalla
    const modalCarrito = document.getElementById('modal-carrito-resumen');
    const modalAbierto = modalCarrito && modalCarrito.style.display === 'flex';
    
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    
    if(contador) contador.innerText = totalItems; 
    
    if(barra) {
        // 🔥 LA MAGIA: Solo mostramos el botón si hay items Y el modal está cerrado
        if (carrito.length > 0 && !modalAbierto) {
            barra.classList.remove('hidden');
            barra.style.display = 'flex'; 
        } else {
            barra.classList.add('hidden');
            barra.style.display = 'none';
            
            // Si el carrito se queda vacío estando abierto, lo cerramos automáticamente
            if (carrito.length === 0 && modalAbierto && typeof cerrarModalCarrito === 'function') {
                cerrarModalCarrito();
            }
        }
    }
}

// =========================================================
// ENVÍO DE PEDIDO A WHATSAPP (CON CARRITO INTERMEDIO)
// =========================================================

// 1. Interceptamos el botón flotante para abrir el resumen primero
window.enviarPedido = function() {
    if (carrito.length === 0) return; 
    abrirModalCarrito();
};

// 1. Modificamos la función que abre el modal
window.abrirModalCarrito = function() {
    renderizarItemsCarrito();
    document.getElementById('modal-carrito-resumen').style.display = 'flex';
    actualizarCarritoUI(); // <-- Agregamos esto para que se dé cuenta que se abrió
};

// 2. Modificamos la función que cierra el modal
window.cerrarModalCarrito = function() {
    document.getElementById('modal-carrito-resumen').style.display = 'none';
    actualizarCarritoUI(); // <-- Agregamos esto para que reaparezca el botón flotante
};

// 2. Modificar cantidades de perfiles DESDE DENTRO DEL CARRITO
window.modificarCantidadDesdeCarrito = function(nombreProducto, delta) {
    const tarjetas = document.querySelectorAll('.service-item.selected');
    let tarjetaEncontrada = null;
    
    // Buscamos la tarjeta original en la web para mantener la sincronización
    tarjetas.forEach(t => {
        const nombreElement = t.querySelector('.nombre-prod') || t.querySelector('h3');
        if (nombreElement && nombreElement.innerText === nombreProducto) {
            tarjetaEncontrada = t;
        }
    });

    if (tarjetaEncontrada) {
        let qty = parseInt(tarjetaEncontrada.getAttribute('data-cantidad') || '1');
        qty += delta;
        
        if (qty < 1) {
            // Si baja de 1, deseleccionamos el producto y lo quitamos del carrito
            tarjetaEncontrada.classList.remove('selected');
            tarjetaEncontrada.setAttribute('data-cantidad', '0');
            const qtyDisplay = tarjetaEncontrada.querySelector('.qty-display');
            if (qtyDisplay) qtyDisplay.innerText = '1';
            showToast(`Quitaste ${nombreProducto}`, false);
        } else {
            tarjetaEncontrada.setAttribute('data-cantidad', qty);
            const qtyDisplay = tarjetaEncontrada.querySelector('.qty-display');
            if (qtyDisplay) qtyDisplay.innerText = qty;
        }
        
        // Reconstruimos la base de datos local y actualizamos UI
        reconstruirCarritoDesdeUI();
        
        if (carrito.length === 0) {
            cerrarModalCarrito(); // Si borró todo, se cierra el modal
        } else {
            renderizarItemsCarrito(); // Refresca los datos en el modal
        }
    }
};

window.toggleDetallesCarrito = function(elemento) {
    // Al tocar el encabezado, busca la tarjeta entera y le pone o quita la clase 'abierto'
    const item = elemento.closest('.carrito-item-modal');
    item.classList.toggle('abierto');
};

window.renderizarItemsCarrito = function() {
    const container = document.getElementById('carrito-items-container');
    if (!container) return;
    container.innerHTML = '';
    
    carrito.forEach(p => {
        let tagsHtml = '';
        if (p.tagsArray && p.tagsArray.length > 0) {
            tagsHtml = p.tagsArray.map(tag => `<li class="carrito-tag"><i class="fas fa-diamond"></i> ${tag}</li>`).join('');
        }
        let premiumClass = p.isPremium ? 'carrito-item-premium' : '';
        
        const itemHtml = `
            <div class="carrito-item-modal ${premiumClass}">
                <!-- ENCABEZADO (Siempre visible, activa el acordeón al hacer clic) -->
                <div class="ci-header" onclick="toggleDetallesCarrito(this)">
                    <div class="ci-title-row">
                        <h4>${p.nombre}</h4>
                        <i class="fas fa-chevron-down ci-chevron"></i>
                    </div>
                    <div class="ci-summary-row">
                        <div class="carrito-item-precio">S/ ${(p.precio * p.cantidad).toFixed(2)}</div>
                        <!-- IMPORTANTE: event.stopPropagation() evita que el acordeón se abra/cierre al tocar los botones de + o - -->
                        <div class="carrito-item-controls" onclick="event.stopPropagation()">
                            <button onclick="modificarCantidadDesdeCarrito('${p.nombre}', -1)"><i class="fas fa-minus"></i></button>
                            <span>${p.cantidad}</span>
                            <button onclick="modificarCantidadDesdeCarrito('${p.nombre}', 1)"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
                
                <!-- DETALLES (Ocultos por defecto) -->
                <div class="ci-detalles">
                    <ul class="carrito-tags-list">
                        ${tagsHtml}
                    </ul>
                    ${p.renovacion ? `<p class="carrito-item-renovacion">🔄 ${p.renovacion}</p>` : ''}
                </div>
            </div>
        `;
        container.innerHTML += itemHtml;
    });

    // Cálculos de totales (igual que antes)
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal;
    let descuento = 0;

    const path = window.location.pathname.toLowerCase();
    const esSoloClientes = (path.endsWith("/clientes") || path.endsWith("/clientes.html") || path === "/") && !path.includes("promociones") && !path.includes("distribuidor") && !path.includes("vip"); 

    if (esSoloClientes && totalItems >= 2) {
        let precios = [];
        carrito.forEach(p => { for (let i = 0; i < p.cantidad; i++) { precios.push(p.precio); } });
        precios.sort((a, b) => b - a);
        for (let i = 1; i < precios.length; i++) {
            if (precios[i] >= 10) descuento += 2.00;
            else descuento += 1.00;
        }
        totalSoles = totalOriginal - descuento;
    }

    const descuentoText = document.getElementById('carrito-descuento-text');
    const totalText = document.getElementById('carrito-total-text');
    
    if (descuento > 0) {
        descuentoText.innerHTML = `🎁 ¡Tienes un descuento aplicado de S/ ${descuento.toFixed(2)}!<br><span style="text-decoration:line-through; color:#888; font-size:0.75rem;">Precio normal: S/ ${totalOriginal.toFixed(2)}</span>`;
        descuentoText.style.display = 'block';
    } else {
        descuentoText.style.display = 'none';
    }
    
    totalText.innerText = `S/ ${totalSoles.toFixed(2)}`;
};

// =========================================================
// PUENTE: DEL CARRITO A LOS MODALES DE DATOS (NOMBRES)
// =========================================================
window.continuarPedido = function() {
    // 1. Cerramos y ocultamos el carrito
    const modalCarrito = document.getElementById('modal-carrito-resumen');
    if (modalCarrito) {
        modalCarrito.style.display = 'none';
    }
    
    // 2. Refrescamos la UI del botón flotante
    if (typeof actualizarCarritoUI === 'function') {
        actualizarCarritoUI();
    }

    // 3. Verificamos en qué página estamos
    const path = window.location.pathname.toLowerCase();
    const esDistribuidor = path.includes("distribuidor") || path.includes("vip") || path.includes("iptv");

    // 4. Abrimos el modal correcto según el tipo de cliente
    if (esDistribuidor) {
        const modalVip = document.getElementById('modal-pedido-vip');
        if (modalVip) {
            document.getElementById('paso-seleccion').style.display = 'block';
            document.getElementById('paso-nombre').style.display = 'none';
            modalVip.style.display = 'flex';
        } else {
            console.error("Error: No se encontró el modal de distribuidores");
        }
    } else {
        const modalCliente = document.getElementById('modal-pedido-cliente');
        if (modalCliente) {
            document.getElementById('paso-cliente-1').style.display = 'block';
            document.getElementById('paso-cliente-2').style.display = 'none';
            modalCliente.style.display = 'flex';
        } else {
            console.error("Error: No se encontró el modal de clientes");
        }
    }
};

// --- 1. LÓGICA DEL MODAL DISTRIBUIDOR (SE MANTIENE IGUAL) ---
window.cerrarModalPedido = function() { document.getElementById('modal-pedido-vip').style.display = 'none'; };

window.irAPasoNombre = function() {
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
            input.className = 'nombre-perfil-input-dynamic input-distribuidor';
            input.placeholder = 'Ej: Juan / Familia';
            input.dataset.producto = producto.nombre;
            
            container.appendChild(label);
            container.appendChild(input);
        }
    });
    document.getElementById('paso-seleccion').style.display = 'none';
    document.getElementById('paso-nombre').style.display = 'block';
};

window.volverAPaso1 = function() {
    document.getElementById('paso-seleccion').style.display = 'block';
    document.getElementById('paso-nombre').style.display = 'none';
};

window.finalizarSinNombre = function() { ejecutarEnvioWhatsApp(null, "distribuidor"); cerrarModalPedido(); };

window.finalizarConNombre = function() {
    const inputs = document.querySelectorAll('.input-distribuidor');
    let nombresData = {}; let hayVacios = false;

    inputs.forEach(input => {
        if (input.value.trim() === "") hayVacios = true;
        const prodName = input.dataset.producto;
        if(!nombresData[prodName]) nombresData[prodName] = [];
        nombresData[prodName].push(input.value.trim());
    });

    if (hayVacios) { alert("⚠️ Ingresa un nombre para todos los perfiles."); return; }
    ejecutarEnvioWhatsApp(nombresData, "distribuidor"); 
    cerrarModalPedido();
};

// --- 2. LÓGICA DEL NUEVO MODAL PARA CLIENTES ---
window.cerrarModalCliente = function() { document.getElementById('modal-pedido-cliente').style.display = 'none'; };

// Función para ocultar/mostrar los campos según lo que elija el cliente
window.toggleCamposCliente = function() {
    const tipo = document.getElementById('cliente-tipo').value;
    const divDatos = document.getElementById('div-datos-nuevo');
    if (tipo === "Cliente Nuevo") {
        divDatos.style.display = 'block';
    } else {
        divDatos.style.display = 'none';
    }
};

window.irAPasoNombreCliente = function() {
    const tipo = document.getElementById('cliente-tipo').value;
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const celular = document.getElementById('cliente-celular').value.trim();

    // 🔥 USAMOS TOAST VIP EN LUGAR DE LA ALERTA BLANCA DE GOOGLE CHROME
    // Solo exigimos nombre y celular si es "Cliente Nuevo"
    if (tipo === "Cliente Nuevo" && (nombre === "" || celular === "")) {
        showToast("⚠️ Ingresa Nombre y Celular para continuar", false);
        return;
    }

    const container = document.getElementById('dynamic-inputs-cliente');
    if (!container) return;
    container.innerHTML = ''; 
    
    carrito.forEach(producto => {
        for (let i = 0; i < producto.cantidad; i++) {
            const label = document.createElement('span');
            label.className = 'label-dynamic';
            label.innerText = producto.cantidad > 1 ? `${producto.nombre} (Unidad ${i + 1})` : producto.nombre;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'nombre-perfil-input-dynamic input-cliente';
            input.placeholder = 'Ej: Juan / Familia';
            input.dataset.producto = producto.nombre;
            
            container.appendChild(label);
            container.appendChild(input);
        }
    });

    document.getElementById('paso-cliente-1').style.display = 'none';
    document.getElementById('paso-cliente-2').style.display = 'block';
};

window.volverAPaso1Cliente = function() {
    document.getElementById('paso-cliente-1').style.display = 'block';
    document.getElementById('paso-cliente-2').style.display = 'none';
};

window.finalizarPedidoCliente = function() {
    const inputs = document.querySelectorAll('.input-cliente');
    let nombresData = {}; 
    let hayVacios = false;

    inputs.forEach(input => {
        if (input.value.trim() === "") hayVacios = true;
        const prodName = input.dataset.producto;
        if(!nombresData[prodName]) nombresData[prodName] = [];
        nombresData[prodName].push(input.value.trim());
    });

    if (hayVacios) { alert("⚠️ Por favor, ingresa un nombre para todos los perfiles."); return; }

    ejecutarEnvioWhatsApp(nombresData, "cliente"); 
    cerrarModalCliente();
};


// --- 3. CREADOR DEL MENSAJE WHATSAPP (SE ADAPTA AUTOMÁTICAMENTE) ---
window.ejecutarEnvioWhatsApp = function(nombresData, tipoUsuario) {
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal;
    let descuento = 0;

    // Descuento automático para clientes
    if (tipoUsuario === "cliente" && totalItems >= 2) {
        let precios = [];
        carrito.forEach(p => { for (let i = 0; i < p.cantidad; i++) { precios.push(p.precio); } });
        precios.sort((a, b) => b - a);
        for (let i = 1; i < precios.length; i++) {
            if (precios[i] >= 10) descuento += 2.00;
            else descuento += 1.00;
        }
        totalSoles = totalOriginal - descuento;
    }

    let mensaje = "";

    if (tipoUsuario === "cliente") {
        const tipoC = document.getElementById('cliente-tipo') ? document.getElementById('cliente-tipo').value : "Cliente Normal";
        const nombreC = document.getElementById('cliente-nombre') ? document.getElementById('cliente-nombre').value.trim() : "";
        const celularC = document.getElementById('cliente-celular') ? document.getElementById('cliente-celular').value.trim() : "";

        mensaje += `¡Hola Alex Store! 👋 Deseo adquirir servicios.\n\n`;
        mensaje += `👤 *DATOS DEL CLIENTE*\n`;
        mensaje += `▪️ Estado: ${tipoC}\n`;
        
        // Si es cliente nuevo, enviamos sus datos. Si es antiguo, lo omitimos para mantener el orden
        if (tipoC === "Cliente Nuevo") {
            mensaje += `▪️ Nombre: ${nombreC}\n`;
            mensaje += `▪️ Celular: ${celularC}\n`;
        }
        mensaje += `\n🛒 *MI PEDIDO*\n`;
    } else {
        mensaje += `¡Hola Alex Store! soy distribuidor VIP 👋 Deseo adquirir:\n\n`;
    }
    
    // Lista de productos con formato alineado verticalmente
    carrito.forEach(p => {
        mensaje += `⭐ *${p.cantidad}x ${p.nombre}*\n`;
        mensaje += `📝 *Detalles:*\n${p.caracteristicas}\n`;
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
    
    if (descuento > 0) mensaje += `\n🎁 *Descuento aplicado:* -S/ ${descuento.toFixed(2)}`;
    mensaje += `\n💰 *TOTAL A PAGAR: S/ ${totalSoles.toFixed(2)}*`;
    
    if (document.getElementById('cliente-nombre')) document.getElementById('cliente-nombre').value = '';
    if (document.getElementById('cliente-celular')) document.getElementById('cliente-celular').value = '';

    window.open(`https://wa.me/51918600000?text=${encodeURIComponent(mensaje)}`, '_blank');
};

// =========================================================
// FUNCIONES DE MODALES MÓVILES Y ACORDEÓN
// =========================================================
function abrirModalFaq() {
    sessionStorage.setItem('modal_activo_interes', 'true');
    const modal = document.getElementById('modal-info-lateral');
    if (modal) modal.style.display = 'flex';
}
window.cerrarModalInfo = function(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('modal-info-lateral');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
};

function abrirModalFaq() {
    sessionStorage.setItem('modal_activo_interes', 'true');
    const modal = document.getElementById('modal-faq');
    if (modal) modal.style.display = 'flex';
}

window.cerrarModalFaq = function(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('modal-faq');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = 'auto'; }
};

window.toggleFaq = function(element) {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
    if (!isActive) element.classList.add('active');
};

// =========================================================
// EFECTOS VISUALES (Logos y Notificaciones)
// =========================================================
function crearLluviaDeLogos() {
    if(document.querySelector('.falling-logos-container')) return;
    const container = document.createElement('div');
    container.className = 'falling-logos-container';
    document.body.prepend(container); 

    const logos = ['/static/img/netflix.webp', '/static/img/disneyp.webp', '/static/img/prime.webp', '/static/img/max.webp'];
    for(let i = 0; i < 15; i++) {
        const logo = document.createElement('div');
        logo.className = 'falling-logo';
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        logo.style.backgroundImage = `url('${randomLogo}')`;
        logo.style.left = `${Math.random() * 100}vw`; 
        const size = Math.random() * 20 + 25; 
        logo.style.width = `${size}px`; logo.style.height = `${size}px`;
        logo.style.animationDuration = `${Math.random() * 15 + 15}s`; 
        logo.style.animationDelay = `-${Math.random() * 20}s`; 
        logo.style.setProperty('filter', `brightness(1.2) drop-shadow(0 0 15px rgba(0, 212, 255, 1)) blur(${Math.random() * 0.1 + 0.1}px)`, 'important'); 
        logo.style.setProperty('opacity', Math.random() * 0.15 + 0.35, 'important'); 
        container.appendChild(logo);
    }
}

function iniciarNotificacionesCompras() {
    if(document.querySelector('.sales-popup')) return;
    const popup = document.createElement('div');
    popup.className = 'sales-popup';
    popup.innerHTML = `
        <img id="sales-img" src="" alt="Producto">
        <div class="sales-popup-text">
            <span id="sales-name">Alguien</span> compró <br>
            <strong id="sales-product">Un perfil</strong>
            <div class="sales-popup-time" id="sales-time">Hace unos instantes</div>
        </div>
    `;
    document.body.appendChild(popup);

    const nombres = [
    // Nombres Masculinos
    "Alejandro M.", "Andrés F.", "Arturo C.", "Antonio G.", "Armando R.", "Alberto V.", "Alonso P.", "Ángel L.",
    "Bruno S.", "Bryan M.", "Carlos D.", "César R.", "Christian A.", "Cristian V.", "Daniel E.", "David G.",
    "Diego P.", "Eduardo L.", "Edgar T.", "Emilio H.", "Enrique C.", "Erick M.", "Esteban S.", "Fabián R.",
    "Fernando L.", "Francisco B.", "Gabriel C.", "Gerardo N.", "Gonzalo V.", "Guillermo P.", "Gustavo A.",
    "Héctor R.", "Hugo M.", "Ignacio L.", "Iván C.", "Javier S.", "Jesús P.", "Joaquín G.", "Jorge F.",
    "José L.", "Juan C.", "Julio M.", "Kevin R.", "Leonardo T.", "Luis G.", "Manuel R.", "Marco A.",
    "Mario P.", "Martín S.", "Mateo V.", "Mauricio L.", "Miguel C.", "Nicolás R.", "Nelson P.", "Omar G.",
    "Óscar M.", "Pablo L.", "Pedro C.", "Rafael S.", "Ramiro V.", "Raúl T.", "Renato A.", "Ricardo G.",
    "Roberto M.", "Rodrigo P.", "Rubén C.", "Santiago L.", "Sebastián R.", "Sergio B.", "Simón V.",
    "Tomás C.", "Víctor M.", "Vladimir R.", "Walter G.", "Xavier L.", "Yamil P.", "Alex C.", "Aldo S.", 
    "Rodrigo C.", "Alvaro G.", "Marcelo R.", "Felipe B.", "Hernán P.",

    // Nombres Femeninos
    "Adriana M.", "Alejandra P.", "Alicia R.", "Ana G.", "Andrea C.", "Ángela L.", "Antonia S.", "Bárbara V.", 
    "Beatriz M.", "Blanca R.", "Camila P.", "Carla G.", "Carmen C.", "Carolina L.", "Catalina M.", "Cecilia S.", 
    "Clara V.", "Claudia R.", "Cristina A.", "Daniela P.", "Diana G.", "Elena C.", "Elisa L.", "Elizabeth M.", 
    "Erika S.", "Estefanía V.", "Eva R.", "Fabiola M.", "Fernanda P.", "Flavia G.", "Fiorella C.", "Gabriela L.", 
    "Gloria S.", "Graciela V.", "Guadalupe M.", "Inés P.", "Irene R.", "Isabel G.", "Isabella C.", "Jazmín L.", 
    "Jessica S.", "Jimena V.", "Josefina M.", "Juana P.", "Julia R.", "Karen G.", "Karla C.", "Laura L.", 
    "Leticia S.", "Lidia V.", "Liliana M.", "Lorena P.", "Lourdes R.", "Lucero G.", "Lucía C.", "Luisa L.", 
    "Magaly S.", "Marcela V.", "Margarita M.", "María P.", "Mariana R.", "Marina G.", "Marisol C.", "Marta L.", 
    "Mayra S.", "Melissa V.", "Micaela M.", "Milagros P.", "Mirella R.", "Miriam G.", "Mónica C.", "Nadia L.", 
    "Nancy S.", "Natalia V.", "Nayeli M.", "Nélida P.", "Noelia R.", "Norma G.", "Nuria C.", "Olga L.", 
    "Olivia S.", "Pamela V.", "Paola M.", "Patricia P.", "Paula R.", "Pilar G.", "Raquel C.", "Rebeca L.", 
    "Regina S.", "Renata V.", "Rocío M.", "Romina P.", "Rosa R.", "Rosario G.", "Rosmary C.", "Ruth L.", 
    "Sabrina S.", "Sandra V.", "Sara M.", "Silvia P.", "Sofía R.", "Sonia G.", "Susana C.", "Tania L.", 
    "Teresa S.", "Valentina V.", "Valeria M.", "Vanesa P.", "Verónica R.", "Victoria G.", "Vilma C.", 
    "Viviana L.", "Ximena S.", "Yadira V.", "Yolanda M.", "Zaira P.", "Lizbeth C.", "Milena F.", "Nayda R.",
    "Dayana G.", "Gisela P.",

    // Etiquetas y Categorías Especiales (Generan FOMO y Confianza)
    "Distribuidor VIP", "Distribuidor Activo", "Distribuidor Premium", "Distribuidor Mayorista", 
    "Distribuidor Élite", "Distribuidor Autorizado", "Distribuidor Pro", "Cliente Nuevo", 
    "Cliente Frecuente", "Cliente Verificado", "Cliente Premium", "Cliente Gold", 
    "Socio Activo", "Socio Premium", "Socio Fundador", "Usuario Reciente", 
    "Usuario VIP", "Nuevo Suscriptor", "Suscripción Renovable", "Agencia Aliada", "Revendedor Oficial"
];
    const productos = [{ nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }, { nombre: "Prime Video 4K", img: "/static/img/prime.webp" }, { nombre: "Max Platino", img: "/static/img/max.webp" }, { nombre: "Paramount+ Standard", img: "/static/img/paramount.webp" }, { nombre: "YouTube Premium", img: "/static/img/youtube.webp" }, { nombre: "Spotify Premium", img: "/static/img/spotify.webp" }, { nombre: "Crunchyroll Mega Fan", img: "/static/img/crunchyroll.webp" }, { nombre: "Vix Premium", img: "/static/img/vix.webp" }, { nombre: "Canva Pro (Diseño)", img: "/static/img/canva.webp" }, { nombre: "Servicio IPTV Digital", img: "/static/img/iptv.webp" }, { nombre: "Movistar Play", img: "/static/img/movistar.webp" }, { nombre: "DiRECTV GO+L1MAX", img: "/static/img/dgo.webp" }];
    const tiempos = [
    // Minutos iniciales (A partir de 2 minutos)
    "Hace 2 min", "Hace 3 min", "Hace 4 min", "Hace 5 min", "Hace 6 min", 
    "Hace 7 min", "Hace 8 min", "Hace 9 min", "Hace 10 min",

    // Minutos intermedios (Saltos realistas)
    "Hace 12 min", "Hace 14 min", "Hace 15 min", "Hace 17 min", "Hace 18 min", 
    "Hace 20 min", "Hace 22 min", "Hace 25 min", "Hace 27 min", "Hace 30 min", 
    
    // Minutos altos
    "Hace 32 min", "Hace 35 min", "Hace 38 min", "Hace 40 min", "Hace 43 min", 
    "Hace 45 min", "Hace 48 min", "Hace 50 min", "Hace 53 min", "Hace 55 min", 
    "Hace 58 min",

    // Frases naturales (Alrededor de la hora)
    "Hace media hora", "Hace casi una hora", "Hace 1 hora", 
    
    // Pasando la hora (Un poco más de 1 hora)
    "Hace 1 hora y 5 min", "Hace 1 hora y 10 min", "Hace 1 hora y cuarto", 
    "Hace poco más de 1 hora", "Hace 1 hora y 20 min"
];

    function mostrarNotificacion() {
        document.getElementById('sales-name').innerText = nombres[Math.floor(Math.random() * nombres.length)];
        const prod = productos[Math.floor(Math.random() * productos.length)];
        document.getElementById('sales-product').innerText = prod.nombre;
        document.getElementById('sales-img').src = prod.img; 
        document.getElementById('sales-time').innerText = tiempos[Math.floor(Math.random() * tiempos.length)];

        popup.classList.add('show');
        setTimeout(() => { popup.classList.remove('show'); }, 4500);
        setTimeout(mostrarNotificacion, Math.floor(Math.random() * (100000 - 60000 + 1)) + 60000);
    }
    setTimeout(mostrarNotificacion, 10000);
}

// =========================================================
// LECTURA DE STOCK EN TIEMPO REAL DESDE GOOGLE SHEETS (ACTUALIZADO PARA CSV)
// =========================================================
async function cargarStockDeGoogleSheets() {
    const url = '/api/obtener-datos-stock';

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        // Verificamos si los datos vienen con la nueva estructura de CSV
        if (data && (data.revendedores || data.clientes)) {
            let conteoAB = {}; 
            let conteoCD = {}; 

            // 1. Contamos el stock de Revendedores (AB)
            if (data.revendedores) {
                data.revendedores.forEach((fila) => {
                    if (fila.c && fila.c[0] && fila.c[1]) {
                        let platAB = fila.c[0].v ? fila.c[0].v.toString().trim().toLowerCase() : "";
                        let estAB = fila.c[1].v ? fila.c[1].v.toString().trim().toLowerCase() : "";
                        if (platAB && estAB.includes("libre")) {
                            conteoAB[platAB] = (conteoAB[platAB] || 0) + 1;
                        }
                    }
                });
            }

            // 2. Contamos el stock de Clientes (CD)
            if (data.clientes) {
                data.clientes.forEach((fila) => {
                    if (fila.c && fila.c[0] && fila.c[1]) { // Siguen siendo 0 y 1 porque Python ya los separó
                        let platCD = fila.c[0].v ? fila.c[0].v.toString().trim().toLowerCase() : "";
                        let estCD = fila.c[1].v ? fila.c[1].v.toString().trim().toLowerCase() : "";
                        if (platCD && estCD.includes("libre")) {
                            conteoCD[platCD] = (conteoCD[platCD] || 0) + 1;
                        }
                    }
                });
            }

            // Enviamos los conteos listos a la función que dibuja las tarjetas
            actualizarTarjetasConStock(conteoAB, conteoCD);
        }
    } catch (error) {
        console.error("Error al conectar con el servidor seguro de stock:", error);
    }
}

function actualizarTarjetasConStock(conteoAB, conteoCD) {
    const path = window.location.pathname.toLowerCase();
    const esDistribuidores = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");
    const badges = document.querySelectorAll('.stock-badge');
    
    badges.forEach(badge => {
        const plataformaTarget = (badge.getAttribute('data-plataforma') || '').trim().toLowerCase();
        const tipo = badge.getAttribute('data-tipo'); 
        let cantidad = 0;

        if (tipo === 'perfil' || tipo === 'cd') cantidad = conteoCD[plataformaTarget] || 0;
        else if (tipo === 'cuenta' || tipo === 'ab') cantidad = conteoAB[plataformaTarget] || 0;
        else {
            if (!esDistribuidores) cantidad = conteoCD[plataformaTarget] || 0; 
            else {
                const tarjeta = badge.closest('.service-item');
                const esPerfilUI = tarjeta && (tarjeta.textContent || "").toLowerCase().includes("perfil");
                cantidad = esPerfilUI ? (conteoCD[plataformaTarget] || 0) : (conteoAB[plataformaTarget] || 0);
            }
        }

        const span = badge.querySelector('span');
        if (span && span.innerText !== cantidad.toString()) {
            span.innerText = cantidad; // Solo cambia el número de forma limpia
        }

        const tarjeta = badge.closest('.service-item');
        if (tarjeta) {
            const priceContainer = tarjeta.querySelector('.price-container');

            if (cantidad === 0) {
                if (!tarjeta.classList.contains('agotado')) {
                    badge.classList.add('agotado');
                    tarjeta.classList.add('agotado');

                    if (priceContainer && !priceContainer.querySelector('.sin-stock-badge')) {
                        const sinStockElement = document.createElement('div');
                        sinStockElement.className = 'sin-stock-badge';
                        sinStockElement.innerText = 'SIN STOCK';
                        priceContainer.appendChild(sinStockElement);
                    }
                    if (tarjeta.classList.contains('selected')) {
                        tarjeta.classList.remove('selected');
                        tarjeta.setAttribute('data-cantidad', '0');
                        if (typeof reconstruirCarritoDesdeUI === 'function') reconstruirCarritoDesdeUI();
                    }
                }
            } else {
                if (tarjeta.classList.contains('agotado')) {
                    badge.classList.remove('agotado');
                    tarjeta.classList.remove('agotado');
                    const sinStockBadge = priceContainer ? priceContainer.querySelector('.sin-stock-badge') : null;
                    if (sinStockBadge) sinStockBadge.remove();
                }
            }
        }
    });
}

// =========================================================
// SISTEMA AUTÓNOMO DE ANIMACIÓN DE TEXTOS LARGOS
// =========================================================
function limpiarAnimacionesPrevias() {
    document.querySelectorAll('.animacion-texto-largo').forEach(el => {
        el.classList.remove('animacion-texto-largo');
        el.style.removeProperty('--distancia-sobrante');
    });
}

function procesarTextosMoviles() {
    if (window.innerWidth > 768) return;
    limpiarAnimacionesPrevias();

    const contenedores = document.querySelectorAll('.service-text');
    contenedores.forEach(contenedor => {
        const esCuadricula = contenedor.closest('.grid-mode') !== null;
        const espacioVisible = contenedor.clientWidth; 
        if (espacioVisible === 0) return; 

        if (esCuadricula) {
            const titulo = contenedor.querySelector('h3, .nombre-prod');
            if (titulo && titulo.offsetWidth > espacioVisible) {
                const distancia = (titulo.offsetWidth - espacioVisible) + 40; 
                titulo.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                titulo.classList.add('animacion-texto-largo');
            }
            const tags = contenedor.querySelectorAll('.tag-prop');
            tags.forEach(tag => {
                if (tag.offsetWidth > espacioVisible) {
                    const distancia = (tag.offsetWidth - espacioVisible) + 30;
                    tag.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                    tag.classList.add('animacion-texto-largo');
                }
            });
        } else {
            const titulo = contenedor.querySelector('h3, .nombre-prod');
            if (titulo && titulo.offsetWidth > espacioVisible) {
                const distancia = (titulo.offsetWidth - espacioVisible) + 25;
                titulo.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                titulo.classList.add('animacion-texto-largo');
            }
            const tags = contenedor.querySelectorAll('.tag-prop');
            tags.forEach(tag => {
                if (tag.offsetWidth > espacioVisible) {
                    const distancia = (tag.offsetWidth - espacioVisible) + 20;
                    tag.style.setProperty('--distancia-sobrante', `-${distancia}px`);
                    tag.classList.add('animacion-texto-largo');
                }
            });
        }
    });
}

window.addEventListener('load', () => {
    setTimeout(procesarTextosMoviles, 400); // Espera 400ms a que el celular pinte la pantalla
});

window.addEventListener('resize', procesarTextosMoviles);
document.addEventListener("DOMContentLoaded", () => {
    const botonesVista = document.querySelectorAll('.btn-view');
    botonesVista.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(procesarTextosMoviles, 50);
            setTimeout(procesarTextosMoviles, 250); 
        });
    });
});

// =========================================================
// MANTENER POSICIÓN DEL SCROLL Y FILTROS (EFECTO TELÓN CINE DEFINITIVO)
// =========================================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

if (sessionStorage.getItem('modal_activo_interes') === 'true') {
    sessionStorage.removeItem('posicionScroll');
    sessionStorage.removeItem('filtroActivoIndex');
    sessionStorage.removeItem('vistaActivaIndex');
    sessionStorage.removeItem('modal_activo_interes');
}

const necesitaRestaurar = sessionStorage.getItem('filtroActivoIndex') !== null || sessionStorage.getItem('posicionScroll') !== null;

if (necesitaRestaurar) {
    const style = document.createElement('style');
    style.id = 'estilo-restauracion';
    style.innerHTML = `
        html, body { scroll-behavior: auto !important; }
        .telon-cine {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: var(--dark, #050505); 
            z-index: 99999999; 
            transition: opacity 0.4s ease-out;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener("DOMContentLoaded", () => {
        const telon = document.createElement('div');
        telon.className = 'telon-cine';
        telon.id = 'telon-cine-premium';
        document.body.appendChild(telon);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const botonesFiltro = document.querySelectorAll('.btn-nav');
    botonesFiltro.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('filtroActivoIndex', index);
        });
    });

    const botonesVista = document.querySelectorAll('.btn-view');
    botonesVista.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            sessionStorage.setItem('vistaActivaIndex', index);
        });
    });
});

window.addEventListener('beforeunload', () => {
    if (sessionStorage.getItem('modal_activo_interes') === 'true') {
        sessionStorage.removeItem('posicionScroll');
        sessionStorage.removeItem('filtroActivoIndex');
        sessionStorage.removeItem('vistaActivaIndex');
    } else {
        sessionStorage.setItem('posicionScroll', window.scrollY || document.documentElement.scrollTop);
    }
});

window.addEventListener('load', () => {
    if (!necesitaRestaurar) return;

    const scrollGuardado = sessionStorage.getItem('posicionScroll');
    const filtroGuardado = sessionStorage.getItem('filtroActivoIndex');
    const vistaGuardada = sessionStorage.getItem('vistaActivaIndex');
    
    window._isRestoring = true; 

    if (vistaGuardada !== null) {
        const botonesVista = document.querySelectorAll('.btn-view');
        if (botonesVista[vistaGuardada]) botonesVista[vistaGuardada].click();
    }

    if (filtroGuardado !== null) {
        const botonesFiltro = document.querySelectorAll('.btn-nav');
        if (botonesFiltro[filtroGuardado]) botonesFiltro[filtroGuardado].click(); 
    }

    setTimeout(() => {
        if (scrollGuardado !== null) {
            window.scrollTo(0, parseInt(scrollGuardado, 10));
        }
        
        document.querySelectorAll('.service-item:not(.oculto-filtro), .category-title:not(.oculto-filtro)').forEach(el => {
            el.classList.add('premium-visible');
        });

        window.activarEfectoCineNativo();

        setTimeout(() => {
            const telon = document.getElementById('telon-cine-premium');
            if (telon) telon.style.opacity = '0'; 

            setTimeout(() => {
                if (telon) telon.remove();
                const styleRest = document.getElementById('estilo-restauracion');
                if (styleRest) styleRest.remove(); 
                window._isRestoring = false;
            }, 400); 
        }, 50); 
    }, 200); 
});

// =========================================================
// LECTURA DE PRECIOS EN TIEMPO REAL DESDE GOOGLE SHEETS (ACTUALIZADO PARA CSV)
// =========================================================
async function cargarPreciosDeGoogleSheets() {
    const url = '/api/obtener-datos-precios'; 

    try {
        const respuesta = await fetch(url);
        const data = await respuesta.json(); 

        if (data && data.table) {
            const filas = data.table.rows;
            let diccionarioPrecios = {};

            // Saltamos la fila de los títulos usando indice > 0
            filas.forEach((fila, indice) => {
                if (indice > 0 && fila.c && fila.c[0] && fila.c[0].v !== null && fila.c[0].v !== "") {
                    let plataforma = fila.c[0].v.toString().trim().toLowerCase();
                    
                    let precioCliente = (fila.c[1] && fila.c[1].v !== null && fila.c[1].v !== "") ? fila.c[1].v.toString().trim() : "0";
                    let precioDistPerfil = (fila.c[2] && fila.c[2].v !== null && fila.c[2].v !== "") ? fila.c[2].v.toString().trim() : "0";
                    let precioDistCuenta = (fila.c[3] && fila.c[3].v !== null && fila.c[3].v !== "") ? fila.c[3].v.toString().trim() : "0";

                    diccionarioPrecios[plataforma] = {
                        cliente: precioCliente,
                        dist_perfil: precioDistPerfil,
                        dist_cuenta: precioDistCuenta
                    };
                }
            });

            actualizarPreciosEnTarjetas(diccionarioPrecios);
        }
    } catch (error) {
        console.error("Error al conectar con el servidor seguro de precios:", error);
    }
}

function actualizarPreciosEnTarjetas(diccionarioPrecios) {
    const path = window.location.pathname.toLowerCase();
    const esDistribuidor = path.includes("distribuidor") || path.includes("iptv") || path.includes("vip");
    
    const tarjetas = document.querySelectorAll('.service-item');
    let huboCambios = false;
    
    tarjetas.forEach(tarjeta => {
        const badge = tarjeta.querySelector('.stock-badge');
        if (!badge) return; 
        
        const plataforma = (badge.getAttribute('data-plataforma') || '').trim().toLowerCase();
        const tipo = (badge.getAttribute('data-tipo') || '').trim().toLowerCase();
        const priceTag = tarjeta.querySelector('.price-tag');
        
        if (diccionarioPrecios[plataforma]) {
            let precioFinal = "0";
            
            if (!esDistribuidor) {
                precioFinal = diccionarioPrecios[plataforma].cliente;
            } else {
                if (tipo === 'perfil' || tipo === 'cd') {
                    precioFinal = diccionarioPrecios[plataforma].dist_perfil;
                } else if (tipo === 'cuenta' || tipo === 'ab') {
                    precioFinal = diccionarioPrecios[plataforma].dist_cuenta;
                } else {
                    const nombreEl = tarjeta.querySelector('.nombre-prod') || tarjeta.querySelector('h3');
                    const esPerfilUI = nombreEl && nombreEl.textContent.toLowerCase().includes("perfil");
                    precioFinal = esPerfilUI ? diccionarioPrecios[plataforma].dist_perfil : diccionarioPrecios[plataforma].dist_cuenta;
                }
            }

            if (precioFinal !== "0" && priceTag) {
                const precioFormateado = `S/ ${precioFinal}`;
                // 🔥 La clave: Solo actualiza el texto si el precio REALMENTE cambió
                if (priceTag.innerText !== precioFormateado) {
                    priceTag.innerText = precioFormateado;
                    huboCambios = true;
                }
            }
        }
    });
    
    if (huboCambios && typeof reconstruirCarritoDesdeUI === 'function') {
        reconstruirCarritoDesdeUI();
    }
}

// =========================================================
// CONTROL LIMPIO DE MODALES (INFO Y FAQ)
// =========================================================
function abrirModalInfo() {
    // Marcamos una bandera temporal indicando que hay un modal abierto
    sessionStorage.setItem('modal_activo_interes', 'true');
    
    const modal = document.getElementById('modal-info-lateral');
    if (modal) { 
        modal.style.display = 'flex'; 
        document.body.style.overflow = 'hidden'; 
    }
}

function cerrarModalInfo(event) {
    if (event) event.stopPropagation();
    // Borramos la bandera porque el modal se cerró
    sessionStorage.removeItem('modal_activo_interes');
    
    const modal = document.getElementById('modal-info-lateral');
    if (modal) { 
        modal.style.display = 'none'; 
        document.body.style.overflow = 'auto'; 
    }
}

function abrirModalFaq() {
    // Marcamos una bandera temporal indicando que hay un modal abierto
    sessionStorage.setItem('modal_activo_interes', 'true');

    const modal = document.getElementById('modal-faq');
    if (modal) modal.style.display = 'flex';
}

function cerrarModalFaq() {
    // Borramos la bandera porque el modal se cerró
    sessionStorage.removeItem('modal_activo_interes');

    const modal = document.getElementById('modal-faq');
    if (modal) modal.style.display = 'none';
}

// Función para activar y desplegar la respuesta con la animación
function toggleFaqModal(elemento) {
    const item = elemento.parentElement;
    item.classList.toggle('active');
}

// =========================================================
// AJUSTE EN EL GUARDADO DE SCROLL (EXCLUSIVO PARA ESTOS MODALES)
// =========================================================
window.addEventListener('beforeunload', () => {
    // Si el usuario tenía abierto el modal de INFO o FAQ, borramos la posición 
    // para que al actualizar regrese arriba a la pantalla principal.
    if (sessionStorage.getItem('modal_activo_interes') === 'true') {
        sessionStorage.removeItem('posicionScroll');
        sessionStorage.removeItem('filtroActivoIndex');
        sessionStorage.removeItem('modal_activo_interes');
    } else {
        // Para todo lo demás, tu script original sigue funcionando exactamente igual
        sessionStorage.setItem('posicionScroll', window.scrollY || document.documentElement.scrollTop);
    }
});
