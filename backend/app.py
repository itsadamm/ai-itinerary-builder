from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import openai

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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

    #format the user's preferences into a prompt
    prompt = (
        f"You are the best travel planer AI on the market."
        f"You generate perfect itineraries that most likely correlate with"
        f" user preferences. Based on the following user preferences, "
        f" generate a detailed travel itinerary for {data['tripLength']} days in "
        f"in the following countries: {', '.join(data['countries'])}. Prioritized "
        f"cities are: {', '.join(data['prioritizedCities'])}.\n\n"
        f"Preferences:\n"
        f"- Travel Pace: {data['interests']}\n"
        f"- Interests: {', '.join(data['interests'])}\n"
        f"- Budget: {data['budgetLevel']}\n"
        f"- Travel Style: {data['travelStyle']}\n\n"
        f"Format the itinerary day by day."
    )

    try:
        #pylint: disable=no-member
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        itinerary = response.choices[0].message.content
        return jsonify({"itinerary": itinerary}), 200
    except Exception as e:
        print("OpenAI API error:", str(e))
        return jsonify({"error": "Something went wrong with the AI"}), 500

if __name__ == "__main__":
    app.run(debug=True)
