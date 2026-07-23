from flask import Blueprint, render_template

# Creamos el blueprint llamado 'main'
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
@main_bp.route('/inicio')
def inicio():
    return render_template('index.html')