import { db, collection, addDoc, getDocs } from "./firebase-config.js";

// Référence à la collection "events"
const eventsCollection = collection(db, "events");

// Fonction pour ajouter un événement
async function addEvent(title, description, date) {
    try {
        const docRef = await addDoc(collection(db, "events"), {
            title: title,
            description: description,
            date: date
        });
        console.log("Événement ajouté avec l'ID :", docRef.id);
    } catch (e) {
        console.error("Erreur lors de l'ajout :", e);
    }
}

// Fonction pour récupérer les événements
async function getEvents() {
    const querySnapshot = await getDocs(collection(db, "events"));
    let events = [];
    querySnapshot.forEach(doc => {
        let eventData = doc.data();
        eventData.id = doc.id;
        events.push(eventData);
    });
    return events;
}

export { addEvent, getEvents };
