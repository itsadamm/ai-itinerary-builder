import React, { useState } from "react";
// useState lets a component store a value and react to changes in that value.
import Select from "react-select"; // library react-select
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);
const countryObj = countries.getNames("en", { select: "official" });
const countryOptions = Object.entries(countryObj).map(([codeBlock, name]) => ({
    value: codeBlock,
    label: name,
}));

function TripForm() {

    // travelPace = variable, setTravelPace = function
    const [travelPace, setTravelPace] = useState("");
    const [interests, setInterests] = useState([]);
    const [budgetLevel, setBudgetLevel] = useState("");
    const [travelStyle, setTravelStyle] = useState("");
    const [tripLength, setTripLength] = useState("");
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [cityInput, setCityInput] = useState("");

    // submit handler function
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents page reload

        const formData = {
            travelPace,
            interests, 
            budgetLevel,
            travelStyle,
            tripLength,
            countries: countries.map((c) => c.label),
            prioritizedCities: cities,
        };
        
        // send form data from React to backend 
        try{
            const response = await fetch("http://127.0.0.1:5000/api/itinerary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log("Server response:", result);
        } catch (err){
            console.error("Error sending data to backend:", err);
        }
    };



    return (
        // div is a generic container that groups other elements together
        // form tag = html element that wraps input fields. 
        //      Handles user input and form submission
        <div>  
            <h2>Plan Your Trip</h2> 
            
            <form onSubmit={handleSubmit}>
                <label>
                    Travel Pace: 
                    <select
                        value={travelPace}
                        onChange={(e) => setTravelPace(e.target.value)}
                        >
                        <option value="">-- Select --</option>
                        <option value="slow">slow</option>
                        <option value="balanced">Balanced</option>
                        <option value="fast">Fast</option>
                    </select>
                </label>
                <fieldset>
                    <legend>Interests:</legend>
                    {["Nature", "Food", "Culture", "Nightlife", "Animals", "Adventure", "Hiking", "Shopping", "Relaxing"].map((interest) => (
                        <label key={interest} style={{ display: "block"}}>
                            <input 
                            type="checkbox"
                            value={interest}
                            checked={interests.includes(interest)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setInterests((prev) => 
                                    prev.includes(value)
                                        ? prev.filter((i) => i !== value) : [...prev, value]
                                );
                            }}
                        />
                        {interest}
                        </label>
                    ))}
                </fieldset>
                <label>
                    Budget Level:
                    <select
                        value = {budgetLevel}
                        onChange={(e) => setBudgetLevel(e.target.value)}>
                            <option value="">-- Select --</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                </label>
                <br />
                <label>
                    Preferred Travel Style:
                    <select
                        value={travelStyle}
                        onChange={(e) => setTravelStyle(e.target.value)}>
                            <option value="">-- Select --</option>
                            <option value="solo">Solo</option>
                            <option value="backpacker">Backpacker</option>
                            <option value="couple">Couple</option>
                            <option value="group">Group</option>
                            <option value="family">Family</option>
                            <option value="luxury">Luxury</option>
                        </select>
                </label>
                <br />
                <label>
                    Trip Length (days):
                    <input
                        type="number"
                        value={tripLength}
                        onChange={(e) => setTripLength(e.target.value)}/>
                </label>
                <br /> 
                <label>
                    Countries To Visit:
                    <Select
                        options={countryOptions}
                        isMulti
                        value={countries}
                        onChange={setCountries}
                        placeholder="Select countries..." />
                </label>
                <br />
                <label>
                    Prioritized Cities:
                    <input  
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (cityInput.trim() !== "") {
                                    setCities([...cities, cityInput.trim()]);
                                    setCityInput("");
                                }
                            }
                        }} />
                </label>
                {cities.length > 0 && (
                    <ul>
                        {cities.map((city, index) => (
                            <li key={index}>{city}</li>
                        ))}
                    </ul>
                )}
                <br />
                <button type="submit">Generate Itinerary</button>
            </form>
            {travelPace && <p>You selected: {travelPace} pace</p>}
            {interests.length > 0 && (<p>Selected Interests: {interests.join(", ")}</p>)}
            {budgetLevel && <p>Budget Level: {budgetLevel}</p>}
            {travelStyle && <p>Travel Style: {travelStyle}</p>}
            {countries.length > 0 && (
  <p>Selected Countries: {countries.map((c) => c.label).join(", ")}</p>
            
)}


        </div>
    );
}

export default TripForm;