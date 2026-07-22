from flask import Flask, render_template

# Inicializamos la aplicación Flask
app = Flask(__name__)

# --- RUTAS DE LA APLICACIÓN ---

# 1. Página principal (Portal de Acceso)
@app.route('/')
def inicio():
    return render_template('index.html')

# 2. Zona de Clientes
@app.route('/clientes')
def clientes():
    return render_template('clientes.html')

# 3. Promociones para Clientes
@app.route('/promociones-clientes')
def promociones_clientes():
    return render_template('promociones_clientes.html')

# 4. Zona de Distribuidores VIP
@app.route('/distribuidores')
def distribuidores():
    return render_template('distribuidores.html')

# 5. Promociones para Distribuidores
@app.route('/distribuidores-promos')
def distribuidores_promos():
    return render_template('distribuidores_promos.html')

# 6. Servicio IPTV
@app.route('/iptv')
def iptv():
    return render_template('iptv.html')

# --- ARRANQUE DEL SERVIDOR ---
if __name__ == '__main__':
    # debug=True hace que el servidor se reinicie solo cada vez que guardas un cambio
    app.run(debug=True)