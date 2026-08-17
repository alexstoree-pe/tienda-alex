window.cargarStockDeGoogleSheets = async function() {
    try {
        const respuesta = await fetch('/api/obtener-datos-stock');
        const data = await respuesta.json();

        if (!data) return;

        // Soporte optimizado: Si el backend ya manda los conteos listos (Recomendado) 
        // o si manda las filas originales, las procesamos de forma limpia y directa.
        let conteoAB = data.conteoAB || {};
        let conteoCD = data.conteoCD || {};

        if (!data.conteoAB && (data.revendedores || data.clientes)) {
            if (data.revendedores) {
                data.revendedores.forEach(fila => {
                    if (fila.c?.[0]?.v && fila.c?.[1]?.v) {
                        let plat = fila.c[0].v.toString().trim().toLowerCase();
                        let est = fila.c[1].v.toString().trim().toLowerCase();
                        if (est.includes("libre")) conteoAB[plat] = (conteoAB[plat] || 0) + 1;
                    }
                });
            }
            if (data.clientes) {
                data.clientes.forEach(fila => {
                    if (fila.c?.[0]?.v && fila.c?.[1]?.v) {
                        let plat = fila.c[0].v.toString().trim().toLowerCase();
                        let est = fila.c[1].v.toString().trim().toLowerCase();
                        if (est.includes("libre")) conteoCD[plat] = (conteoCD[plat] || 0) + 1;
                    }
                });
            }
        }
        window.actualizarTarjetasConStock(conteoAB, conteoCD);
    } catch (error) { 
        console.error("Error al conectar con stock:", error); 
    }
};

window.actualizarTarjetasConStock = function(conteoAB, conteoCD) {
    const esDistribuidores = /distribuidor|iptv|vip/i.test(window.location.pathname);
    let carritoModificado = false;
    
    document.querySelectorAll('.service-item').forEach(tarjeta => {
        const badge = tarjeta.querySelector('.stock-badge');
        if (!badge) return;

        const plataformaTarget = (badge.getAttribute('data-plataforma') || '').trim().toLowerCase();
        const tipo = badge.getAttribute('data-tipo'); 
        let cantidad = 0;

        if (tipo === 'perfil' || tipo === 'cd') {
            cantidad = conteoCD[plataformaTarget] || 0;
        } else if (tipo === 'cuenta' || tipo === 'ab') {
            cantidad = conteoAB[plataformaTarget] || 0;
        } else {
            if (!esDistribuidores) {
                cantidad = conteoCD[plataformaTarget] || 0; 
            } else {
                cantidad = tarjeta.textContent.toLowerCase().includes("perfil") ? (conteoCD[plataformaTarget] || 0) : (conteoAB[plataformaTarget] || 0);
            }
        }

        const span = badge.querySelector('span');
        if (span && span.innerText !== cantidad.toString()) {
            span.innerText = cantidad;
        }

        const priceContainer = tarjeta.querySelector('.price-container');
        const estaAgotado = tarjeta.classList.contains('agotado');

        if (cantidad === 0) {
            if (!estaAgotado) {
                badge.classList.add('agotado'); 
                tarjeta.classList.add('agotado');
                if (priceContainer && !priceContainer.querySelector('.sin-stock-badge')) {
                    const sinStock = document.createElement('div');
                    sinStock.className = 'sin-stock-badge'; 
                    sinStock.innerText = 'SIN STOCK';
                    priceContainer.appendChild(sinStock);
                }
                if (tarjeta.classList.contains('selected')) {
                    tarjeta.classList.remove('selected'); 
                    tarjeta.setAttribute('data-cantidad', '0');
                    carritoModificado = true;
                }
            }
        } else {
            if (estaAgotado) {
                badge.classList.remove('agotado'); 
                tarjeta.classList.remove('agotado');
                const sinStockBadge = priceContainer?.querySelector('.sin-stock-badge');
                if (sinStockBadge) sinStockBadge.remove();
            }
        }
    });

    if (carritoModificado && typeof window.reconstruirCarritoDesdeUI === 'function') {
        window.reconstruirCarritoDesdeUI();
    }
};

window.cargarPreciosDeGoogleSheets = async function() {
    try {
        const respuesta = await fetch('/api/obtener-datos-precios');
        const data = await respuesta.json(); 

        if (data && data.table && data.table.rows) {
            let diccionarioPrecios = {};
            data.table.rows.forEach((fila, indice) => {
                if (indice > 0 && fila.c && fila.c[0] && fila.c[0].v) {
                    let clave = fila.c[0].v.toString().trim().toLowerCase();
                    diccionarioPrecios[clave] = {
                        cliente: fila.c[1]?.v?.toString().trim() || "0",
                        dist_perfil: fila.c[2]?.v?.toString().trim() || "0",
                        dist_cuenta: fila.c[3]?.v?.toString().trim() || "0"
                    };
                }
            });
            window.actualizarPreciosEnTarjetas(diccionarioPrecios);
        }
    } catch (error) { 
        console.error("Error precios:", error); 
    }
};

window.actualizarPreciosEnTarjetas = function(diccionarioPrecios) {
    const esDistribuidor = /distribuidor|iptv|vip/i.test(window.location.pathname);
    let huboCambios = false;
    
    document.querySelectorAll('.service-item').forEach(tarjeta => {
        const badge = tarjeta.querySelector('.stock-badge');
        if (!badge) return; 
        
        const plataforma = (badge.getAttribute('data-plataforma') || '').trim().toLowerCase();
        const tipo = (badge.getAttribute('data-tipo') || '').trim().toLowerCase();
        const priceTag = tarjeta.querySelector('.price-tag');
        
        const preciosPlat = diccionarioPrecios[plataforma];
        if (preciosPlat) {
            let precioFinal = "0";
            if (!esDistribuidor) {
                precioFinal = preciosPlat.cliente;
            } else {
                if (tipo === 'perfil' || tipo === 'cd') {
                    precioFinal = preciosPlat.dist_perfil;
                } else if (tipo === 'cuenta' || tipo === 'ab') {
                    precioFinal = preciosPlat.dist_cuenta;
                } else {
                    const nombreEl = tarjeta.querySelector('.nombre-prod, h3');
                    precioFinal = (nombreEl && nombreEl.textContent.toLowerCase().includes("perfil")) ? preciosPlat.dist_perfil : preciosPlat.dist_cuenta;
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

    if (huboCambios && typeof window.reconstruirCarritoDesdeUI === 'function') {
        window.reconstruirCarritoDesdeUI();
    }
};