// =========================================================
// 5. API Y COMUNICACIÓN CON GOOGLE SHEETS
// =========================================================
window.cargarStockDeGoogleSheets = async function() {
    try {
        const respuesta = await fetch('/api/obtener-datos-stock');
        const data = await respuesta.json();

        if (data && (data.revendedores || data.clientes)) {
            let conteoAB = {}, conteoCD = {}; 

            if (data.revendedores) {
                data.revendedores.forEach((fila) => {
                    if (fila.c && fila.c[0] && fila.c[1]) {
                        let platAB = fila.c[0].v ? fila.c[0].v.toString().trim().toLowerCase() : "";
                        let estAB = fila.c[1].v ? fila.c[1].v.toString().trim().toLowerCase() : "";
                        if (platAB && estAB.includes("libre")) conteoAB[platAB] = (conteoAB[platAB] || 0) + 1;
                    }
                });
            }

            if (data.clientes) {
                data.clientes.forEach((fila) => {
                    if (fila.c && fila.c[0] && fila.c[1]) {
                        let platCD = fila.c[0].v ? fila.c[0].v.toString().trim().toLowerCase() : "";
                        let estCD = fila.c[1].v ? fila.c[1].v.toString().trim().toLowerCase() : "";
                        if (platCD && estCD.includes("libre")) conteoCD[platCD] = (conteoCD[platCD] || 0) + 1;
                    }
                });
            }
            window.actualizarTarjetasConStock(conteoAB, conteoCD);
        }
    } catch (error) { console.error("Error al conectar con stock:", error); }
};

window.actualizarTarjetasConStock = function(conteoAB, conteoCD) {
    const esDistribuidores = window.location.pathname.toLowerCase().match(/distribuidor|iptv|vip/);
    
    document.querySelectorAll('.stock-badge').forEach(badge => {
        const plataformaTarget = (badge.getAttribute('data-plataforma') || '').trim().toLowerCase();
        const tipo = badge.getAttribute('data-tipo'); 
        let cantidad = 0;

        if (tipo === 'perfil' || tipo === 'cd') cantidad = conteoCD[plataformaTarget] || 0;
        else if (tipo === 'cuenta' || tipo === 'ab') cantidad = conteoAB[plataformaTarget] || 0;
        else {
            if (!esDistribuidores) cantidad = conteoCD[plataformaTarget] || 0; 
            else {
                const tarjeta = badge.closest('.service-item');
                cantidad = (tarjeta && tarjeta.textContent.toLowerCase().includes("perfil")) ? (conteoCD[plataformaTarget] || 0) : (conteoAB[plataformaTarget] || 0);
            }
        }

        const span = badge.querySelector('span');
        if (span && span.innerText !== cantidad.toString()) span.innerText = cantidad;

        const tarjeta = badge.closest('.service-item');
        if (tarjeta) {
            const priceContainer = tarjeta.querySelector('.price-container');
            if (cantidad === 0) {
                if (!tarjeta.classList.contains('agotado')) {
                    badge.classList.add('agotado'); tarjeta.classList.add('agotado');
                    if (priceContainer && !priceContainer.querySelector('.sin-stock-badge')) {
                        const sinStock = document.createElement('div');
                        sinStock.className = 'sin-stock-badge'; sinStock.innerText = 'SIN STOCK';
                        priceContainer.appendChild(sinStock);
                    }
                    if (tarjeta.classList.contains('selected')) {
                        tarjeta.classList.remove('selected'); tarjeta.setAttribute('data-cantidad', '0');
                        if (typeof window.reconstruirCarritoDesdeUI === 'function') window.reconstruirCarritoDesdeUI();
                    }
                }
            } else {
                if (tarjeta.classList.contains('agotado')) {
                    badge.classList.remove('agotado'); tarjeta.classList.remove('agotado');
                    const sinStockBadge = priceContainer?.querySelector('.sin-stock-badge');
                    if (sinStockBadge) sinStockBadge.remove();
                }
            }
        }
    });
};

window.cargarPreciosDeGoogleSheets = async function() {
    try {
        const respuesta = await fetch('/api/obtener-datos-precios');
        const data = await respuesta.json(); 

        if (data && data.table) {
            let diccionarioPrecios = {};
            data.table.rows.forEach((fila, indice) => {
                if (indice > 0 && fila.c && fila.c[0] && fila.c[0].v) {
                    diccionarioPrecios[fila.c[0].v.toString().trim().toLowerCase()] = {
                        cliente: (fila.c[1] && fila.c[1].v) ? fila.c[1].v.toString().trim() : "0",
                        dist_perfil: (fila.c[2] && fila.c[2].v) ? fila.c[2].v.toString().trim() : "0",
                        dist_cuenta: (fila.c[3] && fila.c[3].v) ? fila.c[3].v.toString().trim() : "0"
                    };
                }
            });
            window.actualizarPreciosEnTarjetas(diccionarioPrecios);
        }
    } catch (error) { console.error("Error precios:", error); }
};

window.actualizarPreciosEnTarjetas = function(diccionarioPrecios) {
    const esDistribuidor = window.location.pathname.toLowerCase().match(/distribuidor|iptv|vip/);
    let huboCambios = false;
    
    document.querySelectorAll('.service-item').forEach(tarjeta => {
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
                if (tipo === 'perfil' || tipo === 'cd') precioFinal = diccionarioPrecios[plataforma].dist_perfil;
                else if (tipo === 'cuenta' || tipo === 'ab') precioFinal = diccionarioPrecios[plataforma].dist_cuenta;
                else {
                    const nombreEl = tarjeta.querySelector('.nombre-prod, h3');
                    precioFinal = (nombreEl && nombreEl.textContent.toLowerCase().includes("perfil")) ? diccionarioPrecios[plataforma].dist_perfil : diccionarioPrecios[plataforma].dist_cuenta;
                }
            }

            if (precioFinal !== "0" && priceTag) {
                const precioFormateado = `S/ ${precioFinal}`;
                if (priceTag.innerText !== precioFormateado) {
                    priceTag.innerText = precioFormateado;
                    huboCambios = true;
                }
            }
        }
    });
    if (huboCambios && typeof window.reconstruirCarritoDesdeUI === 'function') window.reconstruirCarritoDesdeUI();
};