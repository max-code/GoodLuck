from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', message="Hello from Flask!")

if __name__ == '__main__':
    app.run(debug=True)