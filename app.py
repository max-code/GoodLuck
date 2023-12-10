from flask import Flask, jsonify, render_template, request, session, redirect, url_for

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a random secret key

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():

    if 'password' in session:
        return redirect(url_for('game'))


    if request.method == 'POST':
        if request.form['password'] == 'p':  # Set your password
            session['password'] = request.form['password']
            return redirect(url_for('game'))
        else:
            return 'Invalid Password'
    return render_template('login.html')  # Your login HTML page

@app.route('/game')
def game():
    if 'password' in session:
        return render_template('game.html')  # Your game HTML page
    return redirect(url_for('login'))

@app.route('/api/letter')
def letter():
    # Logic to select a letter
    return jsonify({'letter': 'A'})  # Example letter

if __name__ == '__main__':
    app.run(debug=True)
