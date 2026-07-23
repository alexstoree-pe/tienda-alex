from flask import Blueprint, render_template

# Creamos el blueprint llamado 'distribuidores'
distribuidores_bp = Blueprint('distribuidores', __name__)

@distribuidores_bp.route('/distribuidores')
def distribuidores():
    return render_template('distribuidores.html')

@distribuidores_bp.route('/promociones-mayoristas')
def promos_vip():
    return render_template('distribuidores_promos.html')

@distribuidores_bp.route('/iptv')
def servicio_iptv():
    return render_template('iptv.html')