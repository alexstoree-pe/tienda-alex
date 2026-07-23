from flask import Flask

def create_app():
    app = Flask(__name__)
    
    # 1. Importamos tus Blueprints
    from .modulos.main import main_bp
    from .modulos.clientes import clientes_bp
    from .modulos.distribuidores import distribuidores_bp
    
    # 2. Los registramos en la aplicación
    app.register_blueprint(main_bp)
    app.register_blueprint(clientes_bp)
    app.register_blueprint(distribuidores_bp)
    
    return app