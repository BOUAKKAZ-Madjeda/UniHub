// src/components/EventForm.jsx
import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, doc, getDocs, updateDoc, deleteDoc } from '../firebaseConfig';
import { uploadImageToCloudinary } from '../utils/imageUpload'; // Assurez-vous que l'import est correct

const EventForm = ({ refreshEvents, currentEvent, setCurrentEvent, updateEvent, setComments }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setEventComments] = useState([]);
  const [image, setImage] = useState(null); // État pour l'image sélectionnée

  // Si un événement est passé, remplir les champs pour la modification
  useEffect(() => {
    if (currentEvent) {
      setTitle(currentEvent.title);
      setDescription(currentEvent.description);
      setDate(currentEvent.date.split('T')[0]);
      setTime(currentEvent.date.split('T')[1].split('.')[0]);
      setLocation(currentEvent.location);
      setType(currentEvent.type);
      fetchComments(currentEvent.id);  // Récupérer les commentaires de l'événement
      setImage(currentEvent.imageURL); // Remplir l'image si l'événement a une image

    }
  }, [currentEvent]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloudinary(file); // Upload sur Cloudinary
        setImage(imageUrl); // On stocke l'URL de l'image
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image', error);
      }
    }
  };

  // Récupérer les commentaires pour un événement
  const fetchComments = async (eventId) => {
    try {
      const commentsCollection = collection(db, 'events', eventId, 'comments');
      const commentsSnapshot = await getDocs(commentsCollection);
      const commentsList = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventComments(commentsList);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires:", error);
    }
  };

  // Ajouter un événement ou mettre à jour un événement existant
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    console.log("Date:", date);
    console.log("Time:", time);
    
    // Validation de la date
    const inputDate = new Date(`${date}T${time}`);
    if (isNaN(inputDate.getTime())) {
      alert('Veuillez entrer une date et une heure valides.');
      return;
    }

    if (inputDate.getTime() < Date.now()) {
      alert('La date ne peut pas être dans le passé.');
      return;
    }

    // Créer l'objet événement
    const newEvent = {
      title,
      description,
      date: inputDate.toISOString(),
      location,
      type,
      createdAt: new Date().toISOString(),
      imageURL: image, // Inclure l'URL de l'image
    };

    try {
      if (currentEvent) {
        await updateEvent(currentEvent.id, newEvent); // Appel ta fonction depuis App.jsx
        alert("Événement mis à jour avec succès !");
      }
     else {
        // Ajouter un nouvel événement
        const eventsCollection = collection(db, 'events');
        await addDoc(eventsCollection, newEvent);
        alert('Événement ajouté avec succès!');
      }
      refreshEvents(); // Rafraîchir les événements après la modification/ajout
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setLocation('');
      setType('');
      setImage(null); // Réinitialiser l'image après soumission

    } catch (error) {
      console.error("Erreur lors de l'ajout ou de la modification de l'événement:", error);
    }
  };


  

  // Ajouter un commentaire à l'événement
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment) return;

    try {
      const commentsCollection = collection(db, 'events', currentEvent.id, 'comments');
      await addDoc(commentsCollection, {
        text: comment,
        createdAt: new Date().toISOString(),
      });
      setComment('');
      fetchComments(currentEvent.id);  // Rafraîchir les commentaires
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    }
  };

  // Supprimer un commentaire
  const handleDeleteComment = async (commentId) => {
    try {
      const commentRef = doc(db, 'events', currentEvent.id, 'comments', commentId);
      await deleteDoc(commentRef);
      fetchComments(currentEvent.id);  // Rafraîchir les commentaires après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
    }
  };

  return (
    
    <div>
      <form onSubmit={handleSubmitEvent}>
        <div>
          <label>Titre :</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Date :</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Heure :</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Lieu :</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Type d'événement :</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Sélectionner le type d'événement</option>
            <option value="Scientifique">Scientifique</option>
            <option value="Culturel">Culturel</option>
            <option value="Sportif">Sportif</option>
            <option value="Académique">Académique</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div>
          <label>Image :</label>
          <input type="file" onChange={handleImageUpload} accept="image/*" />
          {image && <img src={image} alt="Image de l'événement" width="100" />}
        </div>
        <button type="submit">{currentEvent ? 'Mettre à jour l\'événement' : 'Ajouter l\'événement'}</button>
      </form>

      {/* Section pour ajouter un commentaire */}
      <div>
        <h3>Ajouter un commentaire :</h3>
        <form onSubmit={handleSubmitComment}>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder="Écrire un commentaire..."
            required
          />
          <button type="submit">Ajouter un commentaire</button>
        </form>
      </div>

      {/* Affichage des commentaires existants */}
      <div>
        <h3>Commentaires :</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.text}</p>
              <button onClick={() => handleDeleteComment(comment.id)}>Supprimer</button>
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour cet événement.</p>
        )}
      </div>
    </div>
  );
};

export default EventForm;
