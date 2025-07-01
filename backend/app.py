from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

@app.route("/")
def home():
    return "It works!"

@app.route("/api/tests")
def test_route():
    return jsonify({'message': "API is working!"})

# accepts POST request, extracts JSON, prints data to terminal
# and responds with confirmation message 
@app.route("/api/itinerary", methods=["Post"])
def generate_itinerary():
    data = request.get_json()
    print("Recieved data:", data)
    return jsonify({"message": "Itinerary recieved!"}), 200

if __name__ == "__main__":
    app.run(debug=True)
