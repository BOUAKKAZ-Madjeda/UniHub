import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuration Firebase (À REMPLACER AVEC TES INFOS)
const firebaseConfig = {
    apiKey: "AIzaSyC1KoyxbNhXqWi-t0zoMK6PfwJgGRXt6fA",
    authDomain: "projet7874-5dba9.firebaseapp.com",
    projectId: "projet7874-5dba9",
    storageBucket: "projet7874-5dba9.firebasestorage.app",
    messagingSenderId: "800285397714",
    appId: "1:800285397714:web:bc2a522d7fb60e1582530b"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fonction pour ajouter une donnée dans Firestore
async function ajouterDonnees() {
    try {
        const docRef = await addDoc(collection(db, "utilisateurs"), {
            nom: "Alice",
            age: 25
        });
        console.log(`${docRef.id} ajouté !`);
    } catch (e) {
        console.error("Erreur lors de l'ajout :", e);
    }
}

// Fonction pour récupérer les données de Firestore
async function lireDonnees() {
    try {
        const querySnapshot = await getDocs(collection(db, "utilisateurs"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} =>`, doc.data());
        });
    } catch (e) {
        console.error("Erreur lors de la lecture :", e);
    }
}

// Attacher les fonctions à l'objet window pour les rendre accessibles dans HTML
window.ajouterDonnees = ajouterDonnees;
window.lireDonnees = lireDonnees;

console.log("Le fichier app.js est bien chargé !");
