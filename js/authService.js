import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { createUserProfile, checkUserProfile } from './firestoreService.js';
import { showMessage } from './utils.js';

/**
 * Observa o estado de autenticação do usuário.
 * @param {Function} callback - Função chamada quando o estado muda.
 */
export function observeAuthState(callback) {
    onAuthStateChanged(auth, async (user) => {
        console.log('onAuthStateChanged triggered. User:', user ? user.uid : 'null');
        if (user) {
            // Usuário está logado. Verifica se tem perfil no Firestore.
            const profile = await checkUserProfile(user.uid);
            callback(user, profile); // Passa o usuário e o perfil (ou null)
        } else {
            // Usuário está deslogado.
            callback(null, null);
        }
    });
}

/**
 * Lida com o registro de um novo usuário (Auth + Firestore).
 * @param {Object} formData - Dados do formulário de registro.
 */
export async function handleRegistration(formData) {
    const { email, password, name, phone, location } = formData;
    
    try {
        console.log('Tentando criar novo utilizador com email e password...');
        // 1. Criar novo utilizador com email e password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        console.log('Utilizador Firebase criado:', newUser.uid);

        // 2. Guardar o perfil no Firestore
        await createUserProfile(newUser.uid, { name, email, phone, location });
        
        showMessage('Registo concluído! Bem-vindo(a) ao BORA.', 'success');
        return true; // Sucesso

    } catch (e) {
        console.error('Erro no processo de registo: ', e);
        let errorMessage = 'Erro ao registar utilizador. Tente novamente.';
        if (e.code === 'auth/email-already-in-use') {
            errorMessage = 'Este email já está registado. Por favor, use outro email ou faça login.';
        } else if (e.code === 'auth/weak-password') {
            errorMessage = 'A senha é muito fraca. Por favor, use pelo menos 6 caracteres.';
        }
        showMessage(errorMessage, 'error');
        return false; // Falha
    }
}

/**
 * Lida com o login do usuário.
 * @param {string} email 
 * @param {string} password 
 */
export async function handleLogin(email, password) {
    try {
        console.log('Tentando iniciar sessão com email e password...');
        await signInWithEmailAndPassword(auth, email, password);
        console.log('Login bem-sucedido!');
        // A mensagem de "bem-vindo" será tratada pelo observeAuthState
        return true; // Sucesso
    } catch (e) {
        console.error('Erro ao fazer login: ', e);
        let errorMessage = 'Erro ao fazer login. Verifique as credenciais.';
        if (e.code === 'auth/invalid-email' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
            errorMessage = 'Email ou senha inválidos.';
        }
        showMessage(errorMessage, 'error');
        return false; // Falha
    }
}

/**
 * Lida com o logout do usuário.
 */
export async function handleLogout() {
    try {
        console.log('Tentando sair...');
        await signOut(auth);
        console.log('Sessão terminada com sucesso.');
        showMessage('Sessão terminada. Até breve!', 'info');
    } catch (error) {
        console.error('Erro ao sair:', error);
        showMessage('Erro ao terminar sessão. Tente novamente.', 'error');
    }
}