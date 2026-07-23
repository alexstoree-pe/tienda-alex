from app import create_app

app = create_app()

if __name__ == '__main__':
    # debug=True hace que los cambios se actualicen solos al guardar
    app.run(debug=True)
    