from app import create_app

# Fabricamos la aplicación llamando a tu función
app = create_app()

if __name__ == '__main__':
    # Encendemos el servidor local en modo prueba
    app.run(debug=True)