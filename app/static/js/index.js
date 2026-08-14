  let urlDestino = "";
    let esRutaMayorista = false; 

    function solicitarAccesso(url, esMayorista) { 
        urlDestino = url;
        esRutaMayorista = esMayorista; 
        
        const modal = document.getElementById('modal-pass');
        const titulo = document.getElementById('modal-titulo');
        
        if (esRutaMayorista) {
            titulo.style.color = "#d4af37";
            titulo.innerText = "PANEL MAYORISTA";
        } else {
            titulo.style.color = "#00d4ff";
            titulo.innerText = "ACCESO CLIENTE";
        }

        modal.style.display = 'flex';
        document.getElementById('pass-input').value = "";
        setTimeout(() => { document.getElementById('pass-input').focus(); }, 100);
    }

    function cerrar() { document.getElementById('modal-pass').style.display = 'none'; }

    function validar() {
        const input = document.getElementById('pass-input');
        const pass = input.value;
        const modalBox = document.getElementById('modal-box');
        
        const CLAVE_CLIENTES = "1122";
        const CLAVE_DISTRIBUIDORES = "dis";

        let claveCorrecta = esRutaMayorista ? CLAVE_DISTRIBUIDORES : CLAVE_CLIENTES;

        if (pass === claveCorrecta) {
            if (esRutaMayorista) {
                sessionStorage.setItem("acceso_distribuidor", "true");
            } else {
                sessionStorage.setItem("acceso_cliente", "true");
            }
            window.location.href = urlDestino;
        } else {
            modalBox.style.animation = "shake 0.3s";
            input.style.borderColor = "red";
            setTimeout(() => { 
                modalBox.style.animation = ""; 
                input.style.borderColor = "#222";
            }, 300);
            input.value = "";
        }
    }

    document.getElementById('pass-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validar();
    });