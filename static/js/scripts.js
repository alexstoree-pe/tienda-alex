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
    const originalTxt = document.getElementById('cart-original-price'); 
    const barra = document.getElementById('whatsapp-btn');
    const labelDescuento = document.getElementById('discount-label'); 
    
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let totalSoles = totalOriginal; 
    
    // Leemos la ruta exacta
    const path = window.location.pathname.toLowerCase();
    
    // AQUÍ ESTÁ EL CANDADO EXACTO:
    // Aseguramos que la ruta termine exactamente en "/clientes" o sea "clientes.html"
    // y que NO sea la página de promociones.
    const esSoloClientes = (path.endsWith("/clientes") || path.endsWith("/clientes.html")) && !path.includes("promociones"); 
    
    // ==========================================
    // LÓGICA DE DESCUENTO (SÓLO PARA CLIENTES.HTML)
    // ==========================================
    
    if (esSoloClientes && totalItems >= 2) {
        
        let descuento = 2.00; // 👇 Tu descuento configurado
        totalSoles = totalOriginal - descuento; 
        
        if (originalTxt) {
            originalTxt.innerText = `S/ ${totalOriginal.toFixed(2)}`;
            originalTxt.style.display = 'block';
        }
        
        if (labelDescuento) {
            labelDescuento.innerText = `¡AHORRAS S/ ${descuento.toFixed(2)}!`;
            labelDescuento.style.display = 'inline-block';
        }
        
    } else {
        // Si está en Promociones, o en Distribuidores, o lleva 1 solo item, paga el precio normal.
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
// =========================================================
// EFECTO DINÁMICO 1: LLUVIA DE LOGOS
// =========================================================
function crearLluviaDeLogos() {
    const container = document.createElement('div');
    container.className = 'falling-logos-container';
    document.body.appendChild(container);

    // 👇 CAMBIA ESTAS RUTAS POR LOS LOGOS REALES DE TU CARPETA IMG
    const logos = [
        '/static/img/netflix.webp', // o .png, .jpg, lo que uses
        '/static/img/disney.webp',
        '/static/img/prime.webp',
        '/static/img/max.webp'
    ];

    // Crea 15 logos flotando en el fondo
    for(let i = 0; i < 15; i++) {
        const logo = document.createElement('div');
        logo.className = 'falling-logo';
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        logo.style.backgroundImage = `url('${randomLogo}')`;
        
        logo.style.left = `${Math.random() * 100}vw`; // Posición horizontal aleatoria
        
        const size = Math.random() * 30 + 30; // Tamaño entre 30px y 60px
        logo.style.width = `${size}px`;
        logo.style.height = `${size}px`;
        
        logo.style.animationDuration = `${Math.random() * 15 + 15}s`; // Caen entre 15s y 30s
        logo.style.animationDelay = `-${Math.random() * 20}s`; // Desfase para que sea natural
        
        logo.style.filter = `blur(${Math.random() * 3 + 2}px)`; // Nivel de desenfoque
        logo.style.opacity = Math.random() * 0.15 + 0.05; // Transparencia sutil
        
        container.appendChild(logo);
    }
}

// =========================================================
// EFECTOS VISUALES (Logos y Notificaciones)
// =========================================================
function crearLluviaDeLogos() {
    // Si el contenedor ya existe, no hacemos nada (evita duplicados)
    if(document.querySelector('.falling-logos-container')) return;

    const container = document.createElement('div');
    container.className = 'falling-logos-container';
    
    // Lo agregamos justo al principio del body para que quede detrás del contenido
    document.body.prepend(container); 

    // RUTAS CORREGIDAS (Tus nombres exactos de imagen)
    const logos = [
        '/static/img/netflix.webp', 
        '/static/img/disneyp.webp', // Antes era disney.webp, por eso se rompía
        '/static/img/prime.webp',
        '/static/img/max.webp'
    ];

    for(let i = 0; i < 15; i++) {
        const logo = document.createElement('div');
        logo.className = 'falling-logo';
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        logo.style.backgroundImage = `url('${randomLogo}')`;
        logo.style.left = `${Math.random() * 100}vw`; 
        
        // Hacemos los logos un poco más grandes para que destaquen
        const size = Math.random() * 20 + 25; 
        logo.style.width = `${size}px`;
        logo.style.height = `${size}px`;
        
        logo.style.animationDuration = `${Math.random() * 15 + 15}s`; 
        logo.style.animationDelay = `-${Math.random() * 20}s`; 
        
        // ==========================================
        // MÁXIMO PROTAGONISMO Y BRILLO
        // ==========================================
        // 1. Desenfoque casi invisible (para que se note qué plataforma es)
        const blurAmount = Math.random() * 0.1 + 0.1; 
        
        // 2. Agregamos brightness(1.4) para iluminar la imagen original
        // y un drop-shadow mucho más intenso e intocable
        logo.style.setProperty('filter', `brightness(1.2) drop-shadow(0 0 15px rgba(0, 212, 255, 1)) blur(${blurAmount}px)`, 'important'); 
        
        // 3. Opacidad altísima (entre 60% y 95% de visibilidad)
        const opacidadFuerte = Math.random() * 0.15 + 0.35;
        logo.style.setProperty('opacity', opacidadFuerte, 'important'); 
        
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

    // LISTA DE NOMBRES AMPLIADA (35 opciones)
    const nombres = [
        "Carlos M.", "Juan P.", "María L.", "Luis A.", "Fernando R.", 
        "Ana C.", "Distribuidor VIP", "Jorge H.", "Diego F.", "Lucía V.",
        "Miguel S.", "Rosa M.", "Pedro G.", "Carmen T.", "Roberto C.",
        "Valeria N.", "Cliente Nuevo", "Andrés D.", "Sofía B.", "Javier E.",
        "Gabriela C.", "Hugo V.", "Daniela Z.", "Esteban Q.", "Distribuidor Activo",
        "Martín L.", "Camila R.", "Renzo F.", "Andrea P.", "Sebastián M.",
        "Diana G.", "Eduardo J.", "Patricia V.", "Héctor A.", "Mónica S."
    ];
    
    // TODAS LAS PLATAFORMAS (Catálogo completo)
    const productos = [
        { nombre: "Netflix Premium VIP", img: "/static/img/netflix.webp" }, 
        { nombre: "Disney+ Premium", img: "/static/img/disneyp.webp" }, 
        { nombre: "Disney+ (Sin ESPN)", img: "/static/img/disneyp.webp" }, 
        { nombre: "Prime Video 4K", img: "/static/img/prime.webp" },
        { nombre: "Max Platino", img: "/static/img/max.webp" },     
        { nombre: "Paramount+ Standard", img: "/static/img/paramount.webp" },
        { nombre: "Paramount+ Completa", img: "/static/img/paramount.webp" },
        { nombre: "YouTube Premium", img: "/static/img/youtube.webp" }, 
        { nombre: "Spotify Premium", img: "/static/img/spotify.webp" },
        { nombre: "Crunchyroll Mega Fan", img: "/static/img/crunchyroll.webp" },
        { nombre: "Vix Premium", img: "/static/img/vix.webp" },
        { nombre: "Canva Pro (Diseño)", img: "/static/img/canva.webp" },
        { nombre: "Servicio IPTV Digital", img: "/static/img/iptv.webp" },
        { nombre: "Movistar Play", img: "/static/img/movistar.webp" },
        { nombre: "DiRECTV GO+L1MAX", img: "/static/img/dgo.webp" }
    ];

    // TIEMPOS MÁS VARIADOS
    const tiempos = [
        "Hace 1 min", "Hace 2 min", "Hace 3 min", "Hace 5 min", 
        "Hace unos instantes", "Hace 8 min", "Hace 10 min", 
        "Hace 12 min", "Hace 15 min"
    ];

    function mostrarNotificacion() {
        const nombreRandom = nombres[Math.floor(Math.random() * nombres.length)];
        const prodRandom = productos[Math.floor(Math.random() * productos.length)];
        const tiempoRandom = tiempos[Math.floor(Math.random() * tiempos.length)];

        document.getElementById('sales-name').innerText = nombreRandom;
        document.getElementById('sales-product').innerText = prodRandom.nombre;
        document.getElementById('sales-img').src = prodRandom.img; // Esta imagen ya no se romperá
        document.getElementById('sales-time').innerText = tiempoRandom;

        popup.classList.add('show');
        setTimeout(() => { popup.classList.remove('show'); }, 4500);

        const tiempoEsperaRandom = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;
        setTimeout(mostrarNotificacion, tiempoEsperaRandom);
    }

    setTimeout(mostrarNotificacion, 8000);
}

// INICIALIZADOR GLOBAL DE EFECTOS
document.addEventListener("DOMContentLoaded", () => {
    // Retrasamos la creación de los efectos 500ms
    setTimeout(() => {
        crearLluviaDeLogos();
        iniciarNotificacionesCompras();
    }, 500);
});