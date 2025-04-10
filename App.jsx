import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from './firebaseConfig';  
import EventForm from './components/EventForm';

const App = () => {
  const [events, setEvents] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [currentUser, setCurrentUser] = useState(''); // L'ID de l'utilisateur actuel
  const [search, setSearch] = useState({ title: "", category: "", date: "" });

  // Fonction pour récupérer l'utilisateur actuel (remplacer par l'authentification Firebase)
  useEffect(() => {
    setCurrentUser("user123"); // Exemple d'utilisateur
  }, []);

  // Fonction pour récupérer les événements depuis Firestore
  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        showComments: false,  // Par défaut, les commentaires sont masqués
      }));
      setEvents(eventsList);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fonction pour afficher/masquer le formulaire
  const toggleForm = (event = null) => {
    setIsFormVisible(!isFormVisible);
    setCurrentEvent(event);
  };

  // Fonction pour gérer l'inscription à un événement
  const handleRegistration = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();
      const updatedParticipants = [...(eventData.participants || []), 'NomUtilisateur'];
      await updateDoc(eventRef, { participants: updatedParticipants });
      fetchEvents();
      alert('Vous vous êtes inscrit à cet événement!');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

   // Fonction pour mettre à jour un événement
   const updateEvent = async (eventId, updatedEvent) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, updatedEvent);  // Mettre à jour l'événement dans Firestore
      fetchEvents();  // Rafraîchir la liste des événements
      toggleForm();  // Fermer le formulaire après la modification
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement:", error);
    }
  };

  // Fonction pour supprimer un événement
  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    }
  };

 // Fonction pour ajouter un commentaire à un événement
const addComment = async (eventId, commentText) => {
  try {
    // Récupérer l'événement pour récupérer ses commentaires actuels
    const eventRef = doc(db, 'events', eventId);
    const eventSnapshot = await getDoc(eventRef);
    const eventData = eventSnapshot.data();

    // Si des commentaires existent déjà, les ajouter au nouveau commentaire
    const updatedComments = eventData.comments ? [...eventData.comments, { text: commentText, createdAt: new Date() }] : [{ text: commentText, createdAt: new Date() }];
    
    // Mettre à jour les commentaires de l'événement
    await updateDoc(eventRef, { comments: updatedComments });
    fetchEvents();  // Rafraîchir la liste des événements pour afficher les commentaires ajoutés
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
  }
};

  // Fonction pour supprimer un commentaire
  const deleteComment = async (eventId, commentIndex) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();
      const updatedComments = eventData.comments.filter((_, index) => index !== commentIndex);
      await updateDoc(eventRef, { comments: updatedComments });
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  };

  // Fonction pour modifier un commentaire
  const modifyComment = async (eventId, commentIndex, newCommentText) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();
      const updatedComments = [...eventData.comments];
      updatedComments[commentIndex].text = newCommentText;
      await updateDoc(eventRef, { comments: updatedComments });
      fetchEvents();
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire:", error);
    }
  };

  // Fonction de filtrage des événements en fonction des critères de recherche
  const filteredEvents = events.filter(event => {
    return (
      (search.title === "" || event.title.toLowerCase().includes(search.title.toLowerCase())) &&
      (search.category === "" || event.type === search.category) &&
      (search.date === "" || new Date(event.date).toLocaleDateString() === new Date(search.date).toLocaleDateString())
    );
  });

  // Fonction pour afficher/masquer les commentaires
  const toggleComments = (eventId) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, showComments: !event.showComments } : event
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Entête du formulaire */}
      <div className="text-center py-4">
        <h1 className="text-3xl font-semibold text-gray-800">EventsBoard</h1>
        <p className="text-gray-500 mt-2">Créez ou modifiez un événement.</p>
      </div>

      {/* Formulaire de recherche */}
      <div>
        <h2>Recherche</h2>
        <input
          type="text"
          placeholder="Rechercher par titre"
          value={search.title}
          onChange={(e) => setSearch({ ...search, title: e.target.value })}
        />
        <input
          type="date"
          value={search.date}
          onChange={(e) => setSearch({ ...search, date: e.target.value })}
        />
        <select
          value={search.category}
          onChange={(e) => setSearch({ ...search, category: e.target.value })}
        >
          <option value="">Filtrer par catégorie</option>
          <option value="Scientifique">Scientifique</option>
          <option value="Culturel">Culturel</option>
          <option value="Sportif">Sportif</option>
          <option value="Académique">Académique</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <button onClick={() => toggleForm()}>Créer un événement</button>

      {isFormVisible && <EventForm
  refreshEvents={fetchEvents}
  currentEvent={currentEvent}
  setCurrentEvent={setCurrentEvent}
  updateEvent={updateEvent} 
/>

}

      <h2>Liste des événements :</h2>
      <ul>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>Date: {new Date(event.date).toLocaleString()}</p>
              <p>Lieu: {event.location}</p>
              <p>Type: {event.type}</p>
              {event.imageURL && <img src={event.imageURL} alt="Event" style={{ width: '100px', height: '100px' }} />}
              <button onClick={() => {
  setCurrentEvent(event);
  setIsFormVisible(true);
}}>
  Modifier
</button>

              <button onClick={() => deleteEvent(event.id)}>Supprimer</button>

              {/* Afficher la liste des participants uniquement pour le créateur */}
              {event.creator === currentUser && (
                <div>
                  <h3>Participants :</h3>
                  {event.participants && event.participants.length > 0 ? (
                    <ul>
                      {event.participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun participant pour cet événement.</p>
                  )}
                </div>
              )}

              {/* Bouton pour afficher/masquer les commentaires */}
              <button onClick={() => toggleComments(event.id)}>
                {event.showComments ? "Masquer les commentaires" : "Afficher les commentaires"}
              </button>

              {/* Section des commentaires */}
              {event.showComments && (
                <div>
                  <h3>Commentaires :</h3>
                  {event.comments && event.comments.length > 0 ? (
                    event.comments.map((comment, index) => (
                      <div key={index}>
                        <p>{comment.text}</p>
                        <button onClick={() => deleteComment(event.id, index)}>Supprimer</button>
                        {commentToEdit === index ? (
                          <>
                            <input
                              type="text"
                              defaultValue={comment.text}
                              onChange={(e) => modifyComment(event.id, index, e.target.value)}
                            />
                            <button onClick={() => setCommentToEdit(null)}>Terminer l'édition</button>
                          </>
                        ) : (
                          <button onClick={() => setCommentToEdit(index)}>Modifier</button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Aucun commentaire pour cet événement.</p>
                  )}

                  {/* Formulaire d'ajout de commentaire */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    addComment(event.id, e.target.comment.value);
                    e.target.reset();
                  }}>
                    <textarea name="comment" placeholder="Ajouter un commentaire" required />
                    <button type="submit">Ajouter un commentaire</button>
                  </form>
                </div>
              )}

              <button onClick={() => handleRegistration(event.id)}>S'inscrire à cet événement</button>
            </li>
          ))
        ) : (
          <p>Aucun événement disponible.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
