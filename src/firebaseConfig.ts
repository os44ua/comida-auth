import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, push, onValue, update, remove, get } from "firebase/database";
import { getAuth } from "firebase/auth"; // Agregamos Authentication

const firebaseConfig = {
  apiKey: "AIzaSyAWz1qigmDRQmICewX9JMDf6GVg8nFEQZs",
  authDomain: "comidarapidafirebase.firebaseapp.com",
  databaseURL: "https://comidarapidafirebase-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "comidarapidafirebase",
  storageBucket: "comidarapidafirebase.firebasestorage.app",
  messagingSenderId: "825049278697",
  appId: "1:825049278697:web:8b6ea3032e59148b93e878",
  measurementId: "G-G9JBR7T9ZS"
};

//const app = initializeApp(firebaseConfig);
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const auth = getAuth(app); // Exportamos auth para usar en authentication

export { ref, push, onValue, update, remove, get };
