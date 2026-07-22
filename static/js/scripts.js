// --- LÓGICA DE ACCESO INICIAL ---
(function() {
    const acceso = sessionStorage.getItem("acceso_distribuidor");
    if (acceso === "true") {
        document.documentElement.style.visibility = "visible";
        document.addEventListener("DOMContentLoaded", () => {
            document.body.style.visibility = "visible";
        });
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            const modal = document.getElementById('modal-login-distribuidor');
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.visibility = 'hidden'; 
                modal.style.visibility = 'visible';
            }
        });
    }
})();

function checkInputPass(el) {
    const stars = document.getElementById('stars-placeholder');
    if (el.value.length > 0) stars.classList.add('hide-stars');
    else stars.classList.remove('hide-stars');
}

function validarAcceso() {
    const inputPass = document.getElementById('input-dist-pass');
    const errorMsg = document.getElementById('error-msg');
    const PIN_CORRECTO = "dis"; 

    if (inputPass.value.toLowerCase() === PIN_CORRECTO) {
        sessionStorage.setItem("acceso_distribuidor", "true");
        location.reload();
    } else {
        errorMsg.innerText = "PIN INCORRECTO";
        inputPass.classList.add('error-shake');
        inputPass.value = "";
        document.getElementById('stars-placeholder').classList.remove('hide-stars');
        
        setTimeout(() => { 
            inputPass.classList.remove('error-shake'); 
            errorMsg.innerText = ""; 
        }, 3000);
    }
}

// --- LÓGICAS GENERALES (SCROLL, TILT, INITS) ---
window.onscroll = function() {
    const btnSubir = document.getElementById("back-to-top");
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        btnSubir.classList.add("show");
    } else {
        btnSubir.classList.remove("show");
    }
};

document.addEventListener("DOMContentLoaded", function() {
    AOS.init({ duration: 800, once: true, offset: 50, mirror: false });

    const btnSubir = document.getElementById("back-to-top");
    if(btnSubir) {
        btnSubir.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!esMovil && typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".service-item"), {
            max: 10, speed: 400, glare: true, "max-glare": 0.2
        });
    }
});

document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;
    const bg = document.querySelector('body::before');
    if(bg) bg.style.transform = `translate(${x}px, ${y}px)`;
});

let carrito = [];

function showToast(message, isAdded = true) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${isAdded ? '' : 'remove'}`;
    toast.innerHTML = `<i class="fas ${isAdded ? 'fa-check-circle' : 'fa-minus-circle'}"></i> ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fadeOut');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
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
    setTimeout(() => { AOS.refreshHard(); }, 100);
}

// --- BUSCADOR Y FILTROS ---
function filtrarPlataformas() {
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
    
    const categorias = document.querySelectorAll('.category-title');
    categorias.forEach(titulo => {
        let tieneHijosVisibles = false;
        let hermano = titulo.nextElementSibling;
        
        while(hermano && !hermano.classList.contains('category-title')) {
            if(hermano.classList.contains('service-item') && !hermano.classList.contains('oculto-busqueda')) {
                tieneHijosVisibles = true;
                break;
            }
            hermano = hermano.nextElementSibling;
        }
        
        if(tieneHijosVisibles || input === "") {
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

    setTimeout(() => { if (typeof AOS !== 'undefined') AOS.refresh(); }, 300);
}

function filtrarCategoria(categoria, boton) {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');

    const titulos = document.querySelectorAll('.category-title');
    let primerElementoVisible = null;

    titulos.forEach(titulo => {
        const textoTitulo = titulo.innerText.toUpperCase();
        const coincide = (categoria === 'TODOS' || textoTitulo.includes(categoria.toUpperCase()));
        
        if (coincide && !primerElementoVisible) {
            primerElementoVisible = titulo;
        }

        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item')) {
                if (coincide) {
                    hermano.classList.remove('oculto-filtro');
                } else {
                    hermano.classList.add('oculto-filtro');
                }
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
}

function actualizarTitulos() {
    document.querySelectorAll('.category-title').forEach(titulo => {
        let has = false;
        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item') && !hermano.classList.contains('oculto-filtro') && !hermano.classList.contains('oculto-busqueda')) { has = true; break; }
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
    container.scrollBy({ left: val, behavior: 'smooth' });
}

// --- LÓGICA DE SELECCIÓN Y CARRITO ---
function toggleCarrito(elemento) {
    if(elemento.classList.contains('agotado')) return;
    
    const e = window.event;
    if (e && e.target && e.target.closest('.qty-controls')) return; 

    const wasSelected = elemento.classList.contains('selected');
    const nombre = elemento.querySelector('.nombre-prod').innerText;

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

function enviarPedido() {
    if (carrito.length === 0) { return; }
    document.getElementById('paso-seleccion').style.display = 'block';
    document.getElementById('paso-nombre').style.display = 'none';
    document.getElementById('modal-pedido-vip').style.display = 'flex';
}

function cerrarModalPedido() {
    document.getElementById('modal-pedido-vip').style.display = 'none';
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

    document.getElementById('paso-seleccion').style.display = 'none';
    document.getElementById('paso-nombre').style.display = 'block';
}

function volverAPaso1() {
    document.getElementById('paso-seleccion').style.display = 'block';
    document.getElementById('paso-nombre').style.display = 'none';
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
    let totalSoles = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let mensaje = "¡Hola Alex Store! soy distribuidor 👋 Deseo adquirir:\n\n";
    
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
    
    mensaje += `\n💰 *TOTAL A PAGAR: S/ ${totalSoles.toFixed(2)}*`;
    window.open(`https://wa.me/51918600000?text=${encodeURIComponent(mensaje)}`, '_blank');
}

function limpiarTodo(e) {
    if(e) e.stopPropagation();
    carrito = [];
    document.querySelectorAll('.service-item.selected').forEach(t => {
        t.classList.remove('selected');
        t.setAttribute('data-cantidad', '0');
    });
    showToast("Selección limpiada", false);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const contador = document.getElementById('cart-count');
    const totalTxt = document.getElementById('cart-total');
    const barra = document.getElementById('whatsapp-btn');
    
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalSoles = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    
    if(contador) contador.innerText = totalItems; 
    if(totalTxt) totalTxt.innerText = `S/ ${totalSoles.toFixed(2)}`;
    
    if(barra) {
        if (carrito.length > 0 && sessionStorage.getItem("acceso_distribuidor") === "true") {
            barra.classList.remove('hidden');
            barra.style.display = 'block';
        } else {
            barra.classList.add('hidden');
            barra.style.display = 'none';
        }
    }
}

// --- FUNCIONES PARA EL MODAL DE INFORMACIÓN (MÓVIL) ---
function abrirModalInfo() {
    const modal = document.getElementById('modal-info-lateral');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Evita que se haga scroll atrás
    }
}

function cerrarModalInfo(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('modal-info-lateral');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Devuelve el scroll a la página
    }
}

// --- FUNCIÓN PARA EL ACORDEÓN DE PREGUNTAS FRECUENTES ---
function toggleFaq(element) {
    const isActive = element.classList.contains('active');
    
    // Cierra todas las respuestas abiertas
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Si la que clicamos estaba cerrada, la abre
    if (!isActive) {
        element.classList.add('active');
    }
}
// =========================================================
// 1. AUTO-INYECTOR DE BOTONES DE CANTIDAD
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.service-card').forEach(card => {
        if (!card.querySelector('.qty-controls')) {
            const controles = document.createElement('div');
            controles.className = 'qty-controls';
            // El orden estricto de parámetros: event, cantidad, this
            controles.innerHTML = `
                <button class="qty-btn" onclick="cambiarCantidad(event, -1, this)"><i class="fas fa-minus" style="font-size:0.7rem"></i></button>
                <span class="qty-display">1</span>
                <button class="qty-btn" onclick="cambiarCantidad(event, 1, this)"><i class="fas fa-plus" style="font-size:0.7rem"></i></button>
            `;
            const checkIcon = card.querySelector('.check-icon');
            if (checkIcon) checkIcon.after(controles);
        }
    });
});

// =========================================================
// 2. FUNCIÓN MAESTRA DE CANTIDADES (Sin bugs)
// =========================================================
function cambiarCantidad(event, delta, btn) {
    // 1. Matamos el clic fantasma
    event.stopPropagation(); 
    
    // 2. Buscamos a qué producto pertenece este botón
    const item = btn.closest('.service-item');
    if (item.classList.contains('agotado')) return;

    // 3. Leemos la cantidad desde los atributos de la tarjeta
    let qty = parseInt(item.getAttribute('data-cantidad') || '1');
    qty += delta;

    // 4. Límite de seguridad: Mínimo 1 unidad (si quiere 0, que quite la selección de la tarjeta)
    if (qty < 1) qty = 1;

    // 5. Aplicamos el número visualmente en el HTML
    item.setAttribute('data-cantidad', qty);
    btn.parentElement.querySelector('.qty-display').innerText = qty;
    
    // 6. Le decimos al sistema que reconstruya el carrito y los precios
    reconstruirCarritoDesdeUI();
}