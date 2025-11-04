import { db, appId } from './firebaseConfig.js';
import { doc, getDoc, addDoc, setDoc, onSnapshot, collection, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { showMessage } from './utils.js';

/**
 * Verifica se um usuário tem um perfil no Firestore.
 * @param {string} uid - O UID do usuário.
 * @returns {Promise<Object|null>} - Retorna o objeto do perfil ou null se não existir.
 */
export async function checkUserProfile(uid) {
    try {
        const profileDocRef = doc(db, `artifacts/${appId}/users/${uid}/profile`, 'user_data');
        const profileDocSnap = await getDoc(profileDocRef);
        
        if (profileDocSnap.exists()) {
            console.log('Perfil encontrado no Firestore.');
            return profileDocSnap.data();
        } else {
            console.log('Perfil NÃO encontrado no Firestore.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao verificar perfil do utilizador no Firestore:', error);
        showMessage('Erro ao verificar perfil. Por favor, tente novamente.', 'error');
        return null;
    }
}

/**
 * Cria o documento de perfil para um novo usuário.
 * @param {string} uid - O UID do novo usuário.
 * @param {Object} profileData - Dados do perfil (name, email, phone, location).
 */
export async function createUserProfile(uid, profileData) {
    const profileDocRef = doc(db, `artifacts/${appId}/users/${uid}/profile`, 'user_data');
    await setDoc(profileDocRef, {
        userId: uid,
        ...profileData,
        createdAt: serverTimestamp() 
    });
    console.log('Perfil de utilizador guardado no Firestore!');
}

/**
 * Ouve em tempo real as mudanças na coleção de anúncios.
 * @param {Function} callback - Função a ser chamada com a lista de anúncios.
 */
export function observeAds(callback) {
    const adsCollectionRef = collection(db, `artifacts/${appId}/public/data/ads`);
    onSnapshot(adsCollectionRef, (snapshot) => {
        const fetchedAds = [];
        snapshot.forEach(doc => {
            fetchedAds.push({ id: doc.id, ...doc.data() });
        });
        console.log('Anúncios carregados/atualizados:', fetchedAds);
        callback(fetchedAds); // Chama o callback com os dados
    }, (error) => {
        console.error("Erro ao carregar anúncios:", error);
        showMessage("Erro ao carregar anúncios.", "error");
    });
}

/**
 * Ouve em tempo real as mudanças na coleção de mensagens.
 * @param {Function} callback - Função a ser chamada com a lista de mensagens.
 */
export function observeMessages(callback) {
    const messagesCollectionRef = collection(db, `artifacts/${appId}/public/data/messages`);
    const q = query(messagesCollectionRef); // Pode adicionar filtros (ex: orderBy)
    
    onSnapshot(q, (snapshot) => {
        const fetchedMessages = [];
        snapshot.forEach(doc => {
            fetchedMessages.push({ id: doc.id, ...doc.data() });
        });
        console.log('Mensagens carregadas/atualizadas.');
        callback(fetchedMessages);
    }, (error) => {
        console.error("Erro ao carregar mensagens:", error);
        showMessage("Erro ao carregar mensagens.", "error");
    });
}

/**
 * Cria um novo anúncio no Firestore.
 * @param {Object} adData - Dados do anúncio.
 */
export async function createAd(adData) {
    await addDoc(collection(db, `artifacts/${appId}/public/data/ads`), {
        ...adData,
        imageUrl: `https://placehold.co/400x200/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${adData.category.toUpperCase()}`,
        createdAt: serverTimestamp()
    });
    console.log('Novo anúncio criado no Firestore');
}

/**
 * Envia uma nova mensagem para o Firestore.
 * @param {Object} messageData - Dados da mensagem.
 */
export async function sendMessage(messageData) {
    await addDoc(collection(db, `artifacts/${appId}/public/data/messages`), {
        ...messageData,
        timestamp: serverTimestamp() 
    });
    console.log('Mensagem enviada.');
}