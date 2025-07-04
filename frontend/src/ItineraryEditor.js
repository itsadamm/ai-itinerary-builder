// recieves the parsedItinerary as a prop, maps over the days, displays each day's title and activites in a clean layout. 
import React, { useState } from "react";

// This componenet displays and lets you edit an itinerary passed in as props 
function ItineraryEditor({ itinerary }) {
    // Make a deep copy of the itinerary so we can safely display it
    const [editableItinerary, setEditableItinerary] = useState(
        JSON.parse(JSON.stringify(itinerary))
    );

    // Track which day and which activity is being edited
    const [editingDay, setEditingDay] = useState(null);
    const [editingActivityIndex, setEditingActivityIndex] = useState(null);
    const [editedText, setEditedText] = useState(""); // What the user is typing
    const [newActivities, setNewActivities] = useState({}); // Stores draft new activities per day 

    // Called when a user clicks an activity. Makes it editable
    const handleActivityClick = (dayIndex, activityIndex, text) => {
        setEditingDay(dayIndex);
        setEditingActivityIndex(activityIndex);
        setEditedText(text);
    };

    // Called when a user clicks "save". Updates that activity
    const handleSave = () => {
        setEditableItinerary((prev) => {
            // make coput of itinerary array
            const updated = [...prev];

            // safety check: make sure the day and activity exist
            if (
                updated[editingDay] && updated[editingDay].activities &&
                updated[editingDay].activities[editingActivityIndex] !== undefined
            ) {
                // create new copy of activities array
                const updatedActivities = [...updated[editingDay].activities];

                // update the selected activity
                updatedActivities[editingActivityIndex] = editedText;

                // update the day with new activites
                updated[editingDay] = {
                    ...updated[editingDay],
                    activities: updatedActivities,
                };
            } else {
                console.error("Tried to edit an activity that doesn't exist");
            }
            return updated;
        });

        // clear edit state
        setEditingDay(null);
        setEditingActivityIndex(null);
        setEditedText("");
    };

    //Called when a user clicks "delete". Removes activity
    const handleDelete = () => {
        const updated = [...editableItinerary];
        updated[editingDay].activities.splice(editingActivityIndex, 1); //remove 1 item at index
        setEditableItinerary(updated);
        setEditingDay(null);
        setEditingActivityIndex(null);
        setEditedText("");
    };

    // Handle typing a new activity
    const handleNewActivityChange = (dayIndex, text) => {
        setNewActivities((prev) => ({
            ...prev, 
            [dayIndex]: text,
        }));
    };

    // add a new activity to the selected day
    const handleAddActivity = (dayIndex) => {
        if (!newActivities[dayIndex] || newActivities[dayIndex].trim() == "") return;

        const updatedItinerary = [...editableItinerary];
        updatedItinerary[dayIndex] = {
            ...updatedItinerary[dayIndex],
            activities: [...updatedItinerary[dayIndex].activities, newActivities[dayIndex].trim()],
        };

        setEditableItinerary(updatedItinerary);

        //clear the input after adding
        setNewActivities((prev) => ({
            ...prev,
            [dayIndex]: "",
        }));
    };

    return (
        <div>
            <h2>Edit Your Itinerary</h2>
            {/* Loop through each day in the itinerary */}
            {editableItinerary.map((day, dayIndex) => (
                <div
                key={dayIndex}
                style={{
                    marginBottom: "30px",
                    border: "1px solid #ccc",
                    padding: "15px",
                }}>
                    <h3>Day {day.day}: {day.title}</h3>
                    <ul>
                        {/* Loop through activities for that day */}
                        {day.activities.map((activity, activityIndex) => (
                            <li
                            key={activityIndex}
                            style={{
                                cursor: "pointer",
                                backgroundColor:
                                    editingDay === dayIndex && editingActivityIndex === activityIndex
                                        ? "#f0f0f0"
                                        : "transparent",
                            }}
                            // make editable when clicked
                            onClick={() => 
                                handleActivityClick(dayIndex, activityIndex, activity)
                            }>
                                {editingDay === dayIndex &&
                                editingActivityIndex === activityIndex ? (
                                    // if this activity is being edited, show input + buttons
                                    <div>
                                        <textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        rows={3}
                                        style={{ width: "100", resized: "vertical" }}/>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={handleDelete}>Delete</button>
                                    </div>
                                ) : (
                                    // otherwise just show the activity text
                                    activity
                                )}
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: "10px" }}>
                        <input
                            type="text"
                            placeholder="Add new activity..."
                            value={newActivities[dayIndex] || ""}
                            onChange={(e) => handleNewActivityChange(dayIndex, e.target.value)}
                            style={{ width: "70%", padding: "6px", marginRight: "8px" }}
                        />
                        <button onClick={() => handleAddActivity(dayIndex)}>Add</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ItineraryEditor;