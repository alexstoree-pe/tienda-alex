// =========================================================
// LÓGICA DE DESCUENTOS PROGRESIVOS (PROMOCIONES CLIENTES)
// =========================================================
function calcularDescuentoPromocional(carrito) {
    let totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    let totalOriginal = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    let descuento = 0;

    // Solo se aplica si llevan 2 o más cuentas
    if (totalItems >= 2) {
        let precios = [];
        carrito.forEach(p => {
            for (let i = 0; i < p.cantidad; i++) {
                precios.push(p.precio);
            }
        });
        
        // Ordenamos de mayor a menor. El más caro paga precio completo.
        precios.sort((a, b) => b - a);
        
        // A partir del segundo producto aplicamos el algoritmo de descuento
        for (let i = 1; i < precios.length; i++) {
            if (precios[i] >= 10) {
                descuento += 2.00; // Descuento de 2 soles para perfiles de 10+
            } else {
                descuento += 1.00; // Descuento de 1 sol para perfiles < 10
            }
        }
    }
    
    return {
        totalOriginal: totalOriginal,
        totalConDescuento: totalOriginal - descuento,
        ahorro: descuento
    };
}