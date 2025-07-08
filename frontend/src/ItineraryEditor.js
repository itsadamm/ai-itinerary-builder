// recieves the parsedItinerary as a prop, maps over the days, displays each day's title and activites in a clean layout. 
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

// to wrap each day's activity list in a droppable and draggable
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

    // reorder helper function
    const reorder = (list, startIndex, endIndex) => {
        // make shallow copy 
        const result = Array.from(list);
        // remove item from original position
        const [removed] = result.splice(startIndex, 1);
        //insert removed item into its new position
        result.splice(endIndex, 0, removed);
        return result;
    }

    // Called when a user clicks an activity. Makes it editable
    const handleActivityClick = (dayIndex, activityIndex, activityObj) => {
        setEditingDay(dayIndex);
        setEditingActivityIndex(activityIndex);
        setEditedText(activityObj.text);
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

                const oldActivity = updatedActivities[editingActivityIndex];
                // keep original id but update text
                updatedActivities[editingActivityIndex] = {
                    ...oldActivity,
                    text: editedText,
                };
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
        // make shallow copy so we don't mutate state directly
        const updated = [...editableItinerary];
        // remove selected activity from appropriate day
        // splice removes 1 element at index in activities array of selected day
        updated[editingDay].activities.splice(editingActivityIndex, 1); 
        // update state
        setEditableItinerary(updated);
        // reset editing state (no longer editing after deletion)
        setEditingDay(null);
        setEditingActivityIndex(null);
        setEditedText("");
    };

    // updates temporary text input for specific day. "Add Activity"
    const handleNewActivityChange = (dayIndex, text) => {
        // updates new activity state by copying previous values
        // and replacing just the one for the specific day index
        setNewActivities((prev) => ({
            ...prev, // copy existing value
            [dayIndex]: text, // set new text for current day
        }));
    };

    // add a new activity to the selected day
    const handleAddActivity = (dayIndex) => {
        const text = newActivities[dayIndex]?.trim();
        if (!text) return;
        // add new activity object with id and text
        const newActivity = { id: uuidv4(), text };
        //make shallow copy
        const updatedItinerary = [...editableItinerary];
        // create new version of selected day, adding new activity to list
        updatedItinerary[dayIndex] = {
            ...updatedItinerary[dayIndex], // copy day number and title 
            activities: [...updatedItinerary[dayIndex].activities, newActivity],
        };
        // update main itinerary state
        setEditableItinerary(updatedItinerary);
        //clear the input after adding
        setNewActivities((prev) => ({
            ...prev, // copy all prev 
            [dayIndex]: "", // clear only one for this day
        }));
    };

    // runs when a drag-and-drop action is completed 
    const handleDragEnd = (result) => {
        // destructure source and destination from the result object
        const { source, destination, type } = result;
        if(!destination) return;
        if (type === "DAY") {
            //create reorder copy of days using helper
            const newItinerary = reorder(editableItinerary, source.index, destination.index);
            // update state with new order of days 
            setEditableItinerary(newItinerary);
            return;
        }
        // reordering activities within the same day
        if (type === "ACTIVITY") {
            // identify day that contains activity. "day-3" -> 3
            const dayIndex = Number(source.droppableId.split("-")[1]);
            // get copy
            const dayCopy = { ...editableItinerary[dayIndex] };
            // reorder activities within the day
            dayCopy.activities = reorder(dayCopy.activities, source.index, destination.index);
            // create a copy of whole itinerary
            const newItinerary = [...editableItinerary];
            // replace old activities list for that day with new ordered one
            newItinerary[dayIndex] = dayCopy;
            // update state with reordered itinerary
            setEditableItinerary(newItinerary);
        }
    };

    return (
    <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-days" type="DAY">
            {(outerProvided) => (
                <div ref={outerProvided.innerRef} {...outerProvided.droppableProps}>
                    <h2>Edit Your Itinerary</h2>

                    {/* Loop through each day */}
                    {editableItinerary.map((day, dayIndex) => (
                        <Draggable
                        key={day.id}
                        draggableId={day.id}
                        index={dayIndex}>
                            {(dayProvided) => (
                                <div
                                ref={dayProvided.innerRef}
                                {...dayProvided.draggableProps}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "15px",
                                    marginBottom: "20px",
                                    borderRadius: "6px",
                                    /*backgroundColor: "#fafafa",*/
                                    ...dayProvided.draggableProps.style,
                                }}
                                >
                                <h3 {...dayProvided.dragHandleProps}>
                                    Day {day.day}: {day.title}
                                </h3>

                                {/* Draggable activities for THIS day */}
                                <Droppable droppableId={`day-${dayIndex}`} type="ACTIVITY">
                                    {(provided) => (
                                    <ul
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{ listStyle: "none", paddingLeft: 0 }}
                                    >
                                        {day.activities.map((activityObj, activityIndex) => (
                                        <Draggable
                                            key={activityObj.id}
                                            draggableId={activityObj.id}
                                            index={activityIndex}
                                        >
                                            {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                padding: "8px",
                                                marginBottom: "6px",
                                                border: "1px solid lightgray",
                                                borderRadius: "4px",
                                                backgroundColor: "#f9f9f9",
                                                color: "#333",
                                                ...provided.draggableProps.style,
                                                }}
                                            >
                                                {editingDay === dayIndex &&
                                                editingActivityIndex === activityIndex ? (
                                                <div>
                                                    <textarea
                                                    rows={2}
                                                    value={editedText}
                                                    onChange={(e) =>
                                                        setEditedText(e.target.value)
                                                    }
                                                    style={{
                                                        width: "80%",
                                                        padding: "6px",
                                                        border: "1px solid #ccc",
                                                        color: "#333",
                                                        backgroundColor: "#fff",
                                                    }}
                                                    />
                                                    <button onClick={handleSave}>Save</button>
                                                    <button onClick={handleDelete}>Delete</button>
                                                </div>
                                                ) : (
                                                <span
                                                    onClick={() =>
                                                    handleActivityClick(
                                                        dayIndex,
                                                        activityIndex,
                                                        activityObj
                                                    )
                                                    }
                                                    style={{ color: "#333", cursor: "pointer" }}
                                                >
                                                    {activityObj.text}
                                                </span>
                                                )}
                                            </li>
                                            )}
                                        </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                    )}
                                </Droppable>

                                {/* Add-activity input */}
                                <div style={{ marginTop: "10px" }}>
                                    <input
                                    type="text"
                                    placeholder="Add new activity..."
                                    value={newActivities[dayIndex] || ""}
                                    onChange={(e) =>
                                        handleNewActivityChange(dayIndex, e.target.value)
                                    }
                                    style={{
                                        width: "70%",
                                        padding: "6px",
                                        marginRight: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                    />
                                    <button onClick={() => handleAddActivity(dayIndex)}>Add</button>
                                </div>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {outerProvided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
    );

}

export default ItineraryEditor;