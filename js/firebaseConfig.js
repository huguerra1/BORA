// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// SUA CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDXXw_8oJc1Wgywqaf1SCNuJKgjwQOZT70",
    authDomain: "bora-e087e.firebaseapp.com",
    projectId: "bora-e087e",
    storageBucket: "bora-e087e.firebasestorage.app",
    messagingSenderId: "845471084845",
    appId: "1:845471084845:web:9a78353f025989d33d23a4",
    measurementId: "G-6YRNRVD31P"
};

// Define o appId para ser o projectId do seu Firebase para consistência
export const appId = firebaseConfig.projectId;

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as instâncias do DB e Auth para serem usadas em outros módulos
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log('Firebase Config carregada.');