import React, { useState, useEffect } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "../firebaseConfig";

const EventList = ({ refresh }) => {
    const [events, setEvents] = useState([]);

    // Fonction pour récupérer les événements depuis Firestore
    const fetchEvents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Erreur lors de la lecture des événements :", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [refresh]); // Recharge la liste après ajout/suppression

    // Supprimer un événement
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "events", id));
            fetchEvents(); // Rafraîchir la liste
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    return (
        <div>
            <h2>Liste des événements :</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        <strong>{event.title}</strong> - {new Date(event.date.seconds * 1000).toLocaleString()}  
                        <p>{event.description}</p>
                        <p><strong>Lieu :</strong> {event.location}</p>
                        <button onClick={() => handleDelete(event.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
