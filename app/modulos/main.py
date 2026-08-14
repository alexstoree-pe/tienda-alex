from flask import Blueprint, render_template, jsonify
import os
import time
import requests
import csv
import io
from dotenv import load_dotenv

for ruta_env in [
    os.path.join(os.getcwd(), '.env'),
    os.path.join(os.path.dirname(__file__), '.env'),
    os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
]:
    if os.path.exists(ruta_env):
        load_dotenv(ruta_env)
        break

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
@main_bp.route('/inicio')
def inicio():
    return render_template('index.html')

@main_bp.route('/activaciones')
def activaciones():
    return render_template('activaciones.html')

@main_bp.route('/guias')
def guias():
    return render_template('guias.html')



CACHE = {
    'stock': {'data': None, 'timestamp': 0},
    'precios': {'data': None, 'timestamp': 0}
}
TIEMPO_CACHE = 15  


URL_CSV_STOCK = os.getenv('URL_CSV_STOCK')
URL_CSV_PRECIOS = os.getenv('URL_CSV_PRECIOS')

@main_bp.route('/api/obtener-datos-stock')
def obtener_stock_seguro():
    ahora = time.time()
    if CACHE['stock']['data'] is not None and (ahora - CACHE['stock']['timestamp'] < TIEMPO_CACHE):
        return jsonify(CACHE['stock']['data'])

    try:
        response = requests.get(URL_CSV_STOCK)
        response.encoding = 'utf-8'
        f = io.StringIO(response.text)
        reader = csv.reader(f)
        filas = list(reader)
        
        filas_datos = filas[2:] 

        revendedores = []
        clientes = []

        for fila in filas_datos:
            while len(fila) < 4: 
                fila.append("")
            
            if fila[0].strip() != "" or fila[1].strip() != "":
                revendedores.append({"c": [{"v": fila[0]}, {"v": fila[1]}]})
            
            if fila[2].strip() != "" or fila[3].strip() != "":
                clientes.append({"c": [{"v": fila[2]}, {"v": fila[3]}]})
                
        datos_finales = {"revendedores": revendedores, "clientes": clientes}
        
        CACHE['stock']['data'] = datos_finales
        CACHE['stock']['timestamp'] = ahora
        return jsonify(datos_finales)

    except Exception as e:
        print(f"❌ ERROR LEYENDO STOCK CSV: {str(e)}")
        if CACHE['stock']['data'] is not None:
            return jsonify(CACHE['stock']['data'])
        return jsonify({"error": str(e)}), 500


@main_bp.route('/api/obtener-datos-precios')
def obtener_precios_seguro():
    ahora = time.time()
    if CACHE['precios']['data'] is not None and (ahora - CACHE['precios']['timestamp'] < TIEMPO_CACHE):
        return jsonify({"table": {"rows": CACHE['precios']['data']}})

    try:
        response = requests.get(URL_CSV_PRECIOS)
        response.encoding = 'utf-8'
        f = io.StringIO(response.text)
        reader = csv.reader(f)
        filas = list(reader)
        
        rows_formateadas = []
        for fila in filas:
            while len(fila) < 4: 
                fila.append("")
            cols = [{"v": celda} for celda in fila]
            rows_formateadas.append({"c": cols})
            
        CACHE['precios']['data'] = rows_formateadas
        CACHE['precios']['timestamp'] = ahora
        return jsonify({"table": {"rows": rows_formateadas}})

    except Exception as e:
        print(f"❌ ERROR LEYENDO PRECIOS CSV: {str(e)}")
        if CACHE['precios']['data'] is not None:
            return jsonify({"table": {"rows": CACHE['precios']['data']}})
        return jsonify({"error": str(e)}), 500