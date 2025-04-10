// src/EventBoard.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';

const EventBoard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsSnapshot = await db.collection('events').get();
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Événements Universitaires</h1>
      {events.length > 0 ? (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>Date: {event.date} à {event.time}</p>
              <p>Lieu: {event.location}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun événement disponible.</p>
      )}
    </div>
  );
};

export default EventBoard;
