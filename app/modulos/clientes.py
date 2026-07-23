from flask import Blueprint, render_template

# Creamos el blueprint llamado 'clientes'
clientes_bp = Blueprint('clientes', __name__)

@clientes_bp.route('/clientes')
def catalogo():
    return render_template('clientes.html')

@clientes_bp.route('/promociones-clientes')
def promociones():
    return render_template('promociones_clientes.html')