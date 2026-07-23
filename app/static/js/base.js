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

window.cambiarVista = function(modo, btn) {
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
    setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refreshHard(); }, 100);
};

window.filtrarPlataformas = function() {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    const btnTodos = document.querySelector(".btn-nav[onclick*='TODOS']");
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
    setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 300);
};

window.filtrarCategoria = function(categoria, boton) {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');

    const titulos = document.querySelectorAll('.category-title');
    let primerElementoVisible = null;

    titulos.forEach(titulo => {
        const textoTitulo = titulo.innerText.toUpperCase();
        const coincide = (categoria === 'TODOS' || textoTitulo.includes(categoria.toUpperCase()));
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
        if (categoria !== 'TODOS' && primerElementoVisible) {
            const yOffset = -310; 
            const y = primerElementoVisible.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        } else if (categoria === 'TODOS') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 100); 
    setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 300);
};

function actualizarTitulos() {
    document.querySelectorAll('.category-title').forEach(titulo => {
        let has = false;
        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item') && !hermano.classList.contains('oculto-filtro') && !hermano.classList.contains('oculto-busqueda')) { has = true; break; }
            hermano = hermano.nextElementSibling;
        }
        if(has) {
            titulo.style.display = 'flex'; titulo.style.opacity = '1'; titulo.style.height = 'auto'; titulo.style.margin = '16px 0 12px';
        } else {
            titulo.style.opacity = '0'; titulo.style.height = '0'; titulo.style.margin = '0';
            setTimeout(() => { if (titulo.style.opacity === '0') titulo.style.display = 'none'; }, 300);
        }
    });
}

window.scrollFilters = function(val) {
    const container = document.getElementById('filterScroll');
    if(container) container.scrollBy({ left: val, behavior: 'smooth' });
};

// =========================================================
// AUTO INYECTOR Y CONTROL DEL CARRITO
// =========================================================
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inyectamos botones y clics a todas las tarjetas automáticamente
    document.querySelectorAll('.service-item').forEach(item => {
        
        // Evitamos inyectar clics múltiples
        item.onclick = function(e) { window.toggleCarrito(this, e); };
        
        // Inyectamos botones de cantidad
        const card = item.querySelector('.service-card');
        if (card && !card.querySelector('.qty-controls')) {
            const controles = document.createElement('div');
            controles.className = 'qty-controls';
            controles.innerHTML = `
                <button class="qty-btn" onclick="window.cambiarCantidad(event, -1, this)"><i class="fas fa-minus" style="font-size:0.7rem"></i></button>
                <span class="qty-display">1</span>
                <button class="qty-btn" onclick="window.cambiarCantidad(event, 1, this)"><i class="fas fa-plus" style="font-size:0.7rem"></i></button>
            `;
            const checkIcon = card.querySelector('.check-icon');
            if (checkIcon) checkIcon.after(controles);
        }
    });

    // 2. Iniciamos librerías visuales
    if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true, offset: 50, mirror: false });
    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!esMovil && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".service-item"), { max: 10, speed: 400, glare: true, "max-glare": 0.2 });
    }
    
    document.querySelectorAll('.service-logo').forEach(img => {
        img.addEventListener('load', () => img.classList.add('loaded'));
        if (img.complete) img.classList.add('loaded');
    });

    setTimeout(() => { crearLluviaDeLogos(); iniciarNotificacionesCompras(); }, 500);
});

// Función de Clic en el producto
window.toggleCarrito = function(elemento, ev) {
    if(elemento.classList.contains('agotado')) return;
    
    // Ignoramos el clic si se pulsó sobre los botones de cantidad (+ / -)
    const e = ev || window.event;
    if (e && e.target && e.target.closest('.qty-controls')) return; 

    const wasSelected = elemento.classList.contains('selected');
    // Soporte para tu estructura de HTML: busca '.nombre-prod' y si no, busca el h3
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

// Función de botones + / -
window.cambiarCantidad = function(event, delta, btn) {
    event.stopPropagation(); // MUY IMPORTANTE: Evita que el clic se pase a toggleCarrito
    const item = btn.closest('.service-item');
    if (item.classList.contains('agotado')) return;

    let qty = parseInt(item.getAttribute('data-cantidad') || '1');
    qty += delta;
    if (qty < 1) qty = 1; // Mínimo 1

    item.setAttribute('data-cantidad', qty);
    btn.parentElement.querySelector('.qty-display').innerText = qty;
    reconstruirCarritoDesdeUI();
};

function reconstruirCarritoDesdeUI() {
    carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(el => {
        const nombreElement = el.querySelector('.nombre-prod') || el.querySelector('h3');
        const nombre = nombreElement ? nombreElement.innerText : "Producto";
        
        const precioElement = el.querySelector('.precio-prod') || el.querySelector('.price-tag');
        const precioText = precioElement ? precioElement.innerText : "0";
        
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

// =========================================================
// LÓGICA INTELIGENTE DE PRECIOS Y DESCUENTOS
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
    let descuento = 0;
    
    // Leemos la ruta exacta para saber si aplicamos descuento
    const path = window.location.pathname.toLowerCase();
    
    // SOLO aplica en /clientes o /clientes.html. NO aplica si la palabra 'promociones' o 'distribuidor' está presente.
    const esSoloClientes = (path.endsWith("/clientes") || path.endsWith("/clientes.html") || path === "/") && !path.includes("promociones") && !path.includes("distribuidor"); 
    
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
    
    // Renderizado en Pantalla
    if (descuento > 0) {
        if (originalTxt) { originalTxt.innerText = `S/ ${totalOriginal.toFixed(2)}`; originalTxt.style.display = 'block'; }
        if (labelDescuento) { labelDescuento.innerText = `¡AHORRAS S/ ${descuento.toFixed(2)}!`; labelDescuento.style.display = 'inline-block'; }
    } else {
        if (originalTxt) originalTxt.style.display = 'none';
        if (labelDescuento) labelDescuento.style.display = 'none';
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

// =========================================================
// ENVÍO DE PEDIDO A WHATSAPP
// =========================================================
window.enviarPedido = function() {
    if (carrito.length === 0) return; 
    document.getElementById('paso-seleccion').style.display = 'block';
    document.getElementById('paso-nombre').style.display = 'none';
    document.getElementById('modal-pedido-vip').style.display = 'flex';
};

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
            input.className = 'nombre-perfil-input-dynamic';
            input.placeholder = 'Ej: Juan / Familia';
            input.dataset.producto = producto.nombre;
            input.dataset.unidad = i + 1;

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

window.finalizarSinNombre = function() { ejecutarEnvioWhatsApp(null); cerrarModalPedido(); };

window.finalizarConNombre = function() {
    const inputs = document.querySelectorAll('.nombre-perfil-input-dynamic');
    let nombresData = {}; let hayVacios = false;

    inputs.forEach(input => {
        if (input.value.trim() === "") hayVacios = true;
        const prodName = input.dataset.producto;
        if(!nombresData[prodName]) nombresData[prodName] = [];
        nombresData[prodName].push(input.value.trim());
    });

    if (hayVacios) { alert("Por favor, ingresa un nombre para todos los perfiles que seleccionaste."); return; }
    ejecutarEnvioWhatsApp(nombresData); cerrarModalPedido();
};

function ejecutarEnvioWhatsApp(nombresData) {
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal;
    let descuento = 0;

    const path = window.location.pathname.toLowerCase();
    const esSoloClientes = (path.endsWith("/clientes") || path.endsWith("/clientes.html") || path === "/") && !path.includes("promociones") && !path.includes("distribuidor"); 
    
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
    
    if (descuento > 0) mensaje += `\n🎁 *Descuento aplicado:* -S/ ${descuento.toFixed(2)}`;
    mensaje += `\n💰 *TOTAL A PAGAR: S/ ${totalSoles.toFixed(2)}*`;
    
    window.open(`https://wa.me/51918600000?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// =========================================================
// FUNCIONES DE MODALES MÓVILES Y ACORDEÓN
// =========================================================
window.abrirModalInfo = function() {
    const modal = document.getElementById('modal-info-lateral');
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
};

window.cerrarModalInfo = function(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('modal-info-lateral');
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

    const nombres = ["Carlos M.", "Juan P.", "María L.", "Luis A.", "Fernando R.", "Ana C.", "Distribuidor VIP", "Jorge H.", "Diego F.", "Lucía V.", "Miguel S.", "Rosa M.", "Pedro G.", "Carmen T.", "Roberto C.", "Valeria N.", "Cliente Nuevo", "Andrés D.", "Sofía B.", "Javier E.", "Gabriela C.", "Hugo V.", "Daniela Z.", "Esteban Q.", "Distribuidor Activo", "Martín L.", "Camila R.", "Renzo F.", "Andrea P.", "Sebastián M.", "Diana G.", "Eduardo J.", "Patricia V.", "Héctor A.", "Mónica S."];
    const productos = [{ nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }, { nombre: "Prime Video 4K", img: "/static/img/prime.webp" }, { nombre: "Max Platino", img: "/static/img/max.webp" }, { nombre: "Paramount+ Standard", img: "/static/img/paramount.webp" }, { nombre: "YouTube Premium", img: "/static/img/youtube.webp" }, { nombre: "Spotify Premium", img: "/static/img/spotify.webp" }, { nombre: "Crunchyroll Mega Fan", img: "/static/img/crunchyroll.webp" }, { nombre: "Vix Premium", img: "/static/img/vix.webp" }, { nombre: "Canva Pro (Diseño)", img: "/static/img/canva.webp" }, { nombre: "Servicio IPTV Digital", img: "/static/img/iptv.webp" }, { nombre: "Movistar Play", img: "/static/img/movistar.webp" }, { nombre: "DiRECTV GO+L1MAX", img: "/static/img/dgo.webp" }];
    const tiempos = ["Hace 1 min", "Hace 2 min", "Hace 3 min", "Hace 5 min", "Hace unos instantes", "Hace 8 min", "Hace 10 min", "Hace 12 min", "Hace 15 min"];

    function mostrarNotificacion() {
        document.getElementById('sales-name').innerText = nombres[Math.floor(Math.random() * nombres.length)];
        const prod = productos[Math.floor(Math.random() * productos.length)];
        document.getElementById('sales-product').innerText = prod.nombre;
        document.getElementById('sales-img').src = prod.img; 
        document.getElementById('sales-time').innerText = tiempos[Math.floor(Math.random() * tiempos.length)];

        popup.classList.add('show');
        setTimeout(() => { popup.classList.remove('show'); }, 4500);
        setTimeout(mostrarNotificacion, Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000);
    }
    setTimeout(mostrarNotificacion, 8000);
}