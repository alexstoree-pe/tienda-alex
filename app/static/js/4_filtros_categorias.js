// =========================================================
// 4. FILTROS, CATEGORÍAS Y VISTAS (GRID)
// =========================================================
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
    setTimeout(() => { window.activarEfectoCineNativo(); }, 100);
    setTimeout(window.procesarTextosMoviles, 50);
};

window.filtrarPlataformas = function() {
    document.querySelectorAll('.btn-nav').forEach(btn => btn.classList.remove('active'));
    const btnTodos = document.querySelector(".btn-nav[onclick*='TODOS']");
    
    if (btnTodos && !btnTodos.classList.contains('active')) {
        window._isRestoring = true; 
        btnTodos.click(); 
        setTimeout(() => { window._isRestoring = false; }, 200); 
    }
    if(btnTodos) btnTodos.classList.add('active');
    
    const input = document.getElementById('search-input').value.trim().toLowerCase();
    
    document.querySelectorAll('.service-item').forEach(tarjeta => {
        const nombre = (tarjeta.querySelector('.nombre-prod, h3')?.textContent || "").toLowerCase();
        const tags = (tarjeta.querySelector('.product-tags')?.textContent || "").toLowerCase();
        
        if (input === "" || nombre.includes(input) || tags.includes(input)) {
            tarjeta.classList.remove('oculto-filtro'); 
            setTimeout(() => tarjeta.classList.add('premium-visible'), 50);
        } else {
            tarjeta.classList.add('oculto-filtro');    
            tarjeta.classList.remove('premium-visible');
        }
    });
    
    window.actualizarTitulos(); 
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
                    hermano.classList.remove('oculto-filtro'); hermano.classList.add('premium-visible');
                } else {
                    hermano.classList.add('oculto-filtro'); hermano.classList.remove('premium-visible');
                }
            }
            hermano = hermano.nextElementSibling;
        }
    });
    window.actualizarTitulos();
    
    setTimeout(() => {
        if (window._isRestoring) return;
        if (categoria !== 'TODOS' && primerElementoVisible) {
            let y = primerElementoVisible.getBoundingClientRect().top + window.pageYOffset - 200;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: Math.min(Math.max(y, 0), maxScroll), behavior: 'smooth' });
        } else if (categoria === 'TODOS') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 450); 
    
    document.querySelectorAll('.category-title:not(.oculto-filtro)').forEach(t => t.classList.add('premium-visible'));
    window.activarEfectoCineNativo();
};

window.actualizarTitulos = function() {
    document.querySelectorAll('.category-title').forEach(titulo => {
        let has = false;
        let hermano = titulo.nextElementSibling;
        while (hermano && !hermano.classList.contains('category-title')) {
            if (hermano.classList.contains('service-item') && !hermano.classList.contains('oculto-filtro')) { 
                has = true; break; 
            }
            hermano = hermano.nextElementSibling;
        }
        
        if (has) {
            titulo.style.opacity = '1'; titulo.style.maxHeight = '60px'; 
            titulo.style.margin = '16px 0 12px'; titulo.style.padding = '10px 15px';
            titulo.style.pointerEvents = 'auto'; titulo.classList.add('premium-visible'); 
        } else {
            titulo.style.opacity = '0'; titulo.style.maxHeight = '0'; 
            titulo.style.margin = '0'; titulo.style.padding = '0 15px';
            titulo.style.pointerEvents = 'none'; titulo.classList.remove('premium-visible'); 
        }
    });
};

window.scrollFilters = function(val) {
    const container = document.getElementById('filterScroll');
    if(container) container.scrollBy({ left: val, behavior: 'smooth' });
};