// recieves the parsedItinerary as a prop, maps over the days, displays each day's title and activites in a clean layout. 
import React from "react";

function ItineraryEditor({ itinerary }) {
    return (
        <div>
            <h2>Edit Your Itinerary</h2>
            {itinerary.map((day) => (
                <div key={day.day} style={{ border: "1px solid #ccc", padding: "1em", marginBottom: "1em" }}>
                    <h3 contentEditable supressContentEditableWarning>{`Day ${day.day}: ${day.title}`}</h3>
                    <ul>
                        {day.activities.map((activity, index) => (
                            <li key={index} contentEditable suppressContentEditableWarning>
                                {activity}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default ItineraryEditor;