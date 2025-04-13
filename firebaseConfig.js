import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1KoyxbNhXqWi-t0zoMK6PfwJgGRXt6fA",
  authDomain: "projet7874-5dba9.firebaseapp.com",
  databaseURL: "https://projet7874-5dba9-default-rtdb.firebaseio.com",
  projectId: "projet7874-5dba9",
  storageBucket: "projet7874-5dba9.appspot.com",
  messagingSenderId: "800285397714",
  appId: "1:800285397714:web:bc2a522d7fb60e1582530b",
  measurementId: "G-VMJ20HVY2G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;


