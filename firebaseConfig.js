// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; // Si tu utilises le stockage aussi
import { getMessaging } from 'firebase/messaging';  // Assurez-vous que le module Firebase Messaging est bien importé

// Configuration de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC1KoyxbNhXqWi-t0zoMK6PfwJgGRXt6fA",
    authDomain: "projet7874-5dba9.firebaseapp.com",
    projectId: "projet7874-5dba9",
    storageBucket: "projet7874-5dba9.firebasestorage.app",
    messagingSenderId: "800285397714",
    appId: "1:800285397714:web:bc2a522d7fb60e1582530b",
}

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de Firestore, Storage et Messaging
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);  // Utilisation de getMessaging avec l'instance firebaseApp

// Export des services dans un seul bloc
export { db, collection, getDocs, addDoc, updateDoc, deleteDoc, getDoc, doc, storage, messaging };
