from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

@app.route("/")
def home():
    return "It works!"

@app.route("/api/tests")
def test_route():
    return jsonify({'message': "API is working!"})

if __name__ == "__main__":
    app.run(debug=True)
