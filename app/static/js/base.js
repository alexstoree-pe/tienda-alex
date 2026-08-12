// =========================================================
// INYECTOR DINÁMICO DE MÓDULOS JS (base.js)
// =========================================================
(function cargarModulosJS() {
    // El orden aquí es ESTRICTAMENTE IMPORTANTE
    const modulos = [
        '/static/js/1_acceso.js',
        '/static/js/2_ui_global.js',
        '/static/js/3_animaciones.js',
        '/static/js/4_filtros.js',
        '/static/js/5_api_sheets.js',
        '/static/js/6_carrito.js',
        '/static/js/7_whatsapp.js',
        '/static/js/8_modales_info.js'
    ];

    modulos.forEach(ruta => {
        const script = document.createElement('script');
        script.src = ruta;
        script.async = false; // Obliga al navegador a cargarlos en orden (1, luego 2...)
        document.body.appendChild(script);
    });
})();