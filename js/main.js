// Imports dos Serviços
import { observeAuthState, handleRegistration, handleLogin, handleLogout } from './authService.js';
import { observeAds, observeMessages, createAd, sendMessage, checkUserProfile } from './firestoreService.js';
import { showMessage } from './utils.js';
import { setupAuthStatusUI, updateAuthStatusText, setFormAndNavState, showSection, displaySearchResults, renderMessages } from './ui.js';

// --- Variáveis de Estado Global do Módulo ---
let currentUserId = null;
let hasRegisteredProfile = false;
let allAds = []; // Armazena localmente os anúncios para filtragem
let currentUserName = 'Utilizador'; // Armazena o nome do usuário para o chat

// --- Inicialização da Aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Carregado. Inicializando App.');

    // 1. Configurar a UI inicial
    setupAuthStatusUI();
    setFormAndNavState(false, false); // Estado inicial: deslogado
    showSection('home', false);

    // 2. Iniciar os "ouvintes" (listeners)
    observeAuthState(handleAuthStateChange); // Inicia o listener de autenticação
    observeAds(handleAdsUpdate); // Inicia o listener de anúncios (público)
    
    // 3. Configurar todos os event listeners da página
    setupEventListeners();
});

// --- Funções Principais de "Callback" ---

/**
 * Chamado pelo authService sempre que o usuário logar ou deslogar.
 * @param {Object|null} user - O objeto de usuário do Firebase ou null.
 * @param {Object|null} profile - O perfil do Firestore ou null.
 */
function handleAuthStateChange(user, profile) {
    if (user && profile) {
        // Usuário LOGADO e COM PERFIL
        currentUserId = user.uid;
        hasRegisteredProfile = true;
        currentUserName = profile.name || 'Utilizador';
        
        updateAuthStatusText(`Autenticado: ${profile.name.split(' ')[0]}`);
        setFormAndNavState(true, true);
        showMessage(`Bem-vindo(a) de volta, ${profile.name}!`, 'success');
        
        // Carrega dados privados (mensagens)
        observeMessages(handleMessagesUpdate);

    } else if (user && !profile) {
        // Usuário LOGADO mas SEM PERFIL (ex: acabou de se registrar, precisa completar)
        // No seu fluxo, o registro já cria o perfil, mas isso trata casos de borda.
        currentUserId = user.uid;
        hasRegisteredProfile = false;
        currentUserName = 'Novo Utilizador';
        
        updateAuthStatusText(`Autenticado: ${user.uid.substring(0, 8)}...`);
        setFormAndNavState(true, false);
        showMessage('Sessão ativa. Por favor, complete o seu cadastro.', 'info');
        showSection('register', false); // Força ir para o cadastro

    } else {
        // Usuário DESLOGADO
        currentUserId = null;
        hasRegisteredProfile = false;
        
        updateAuthStatusText('Não Autenticado');
        setFormAndNavState(false, false);
        // Não precisa fazer nada, o observeMessages será desativado (se implementado com regras de segurança)
    }
}

/**
 * Chamado pelo firestoreService sempre que a lista de anúncios mudar.
 * @param {Array} ads - A lista atualizada de anúncios.
 */
function handleAdsUpdate(ads) {
    allAds = ads; // Atualiza a lista local
    displaySearchResults(allAds); // Exibe todos por padrão
}

/**
 * Chamado pelo firestoreService sempre que a lista de mensagens mudar.
 * @param {Array} messages - A lista atualizada de mensagens.
 */
function handleMessagesUpdate(messages) {
    if (hasRegisteredProfile) {
        renderMessages(messages, currentUserId);
    }
}

// --- Configuração dos Event Listeners do DOM ---

function setupEventListeners() {
    
    // Navegação Principal
    document.querySelectorAll('.nav-button, [data-target]').forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = event.target.dataset.target;
            if (targetId) {
                // Passa o estado de 'hasRegisteredProfile' para a função de UI
                showSection(targetId, hasRegisteredProfile);
            }
        });
    });

    // Botão de Logout
    document.getElementById('logout-button').addEventListener('click', handleLogout);

    // Formulário de Registro
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = {
            email: form.querySelector('#reg-email').value,
            password: form.querySelector('#reg-password').value,
            name: form.querySelector('#reg-name').value,
            phone: form.querySelector('#reg-phone').value,
            location: form.querySelector('#reg-location').value,
        };
        
        if (formData.name && formData.email && formData.password && formData.phone && formData.location) {
             const success = await handleRegistration(formData);
             if (success) {
                form.reset();
                setTimeout(() => showSection('home', hasRegisteredProfile), 2000); // Espera o authStateChange
             }
        } else {
            showMessage('Por favor, preencha todos os campos.', 'error');
        }
    });

    // Formulário de Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;

        if (email && password) {
            const success = await handleLogin(email, password);
            if (success) {
                form.reset();
                // O observeAuthState vai cuidar de redirecionar e mostrar a home
            }
        } else {
            showMessage('Por favor, insira o email e a senha.', 'error');
        }
    });

    // Formulário de Criar Anúncio
    document.getElementById('create-ad-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUserId || !hasRegisteredProfile) {
             showMessage('Você precisa estar logado e com perfil completo para criar anúncios.', 'error');
             return;
        }
        
        const form = e.target;
        const adData = {
            userId: currentUserId,
            title: form.querySelector('#ad-title').value,
            description: form.querySelector('#ad-description').value,
            category: form.querySelector('#ad-category').value,
            price: form.querySelector('#ad-price').value || 'A Combinar',
            location: form.querySelector('#ad-location').value,
        };

        if (adData.title && adData.description && adData.category && adData.location) {
            try {
                await createAd(adData);
                showMessage('Anúncio publicado com sucesso!', 'success');
                form.reset();
                setTimeout(() => showSection('search-services', hasRegisteredProfile), 2000);
            } catch (error) {
                console.error('Erro ao criar anúncio:', error);
                showMessage('Erro ao publicar anúncio. Tente novamente.', 'error');
            }
        } else {
            showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
        }
    });
    
    // Formulário de Enviar Mensagem
    document.getElementById('send-message-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUserId || !hasRegisteredProfile) {
             showMessage('Você precisa estar logado e com perfil completo para enviar mensagens.', 'error');
             return;
        }

        const input = document.getElementById('message-input');
        const messageText = input.value.trim();
        
        if (messageText) {
            const messageData = {
                senderId: currentUserId,
                senderName: currentUserName, // Usamos o nome salvo
                text: messageText,
            };
            try {
                await sendMessage(messageData);
                input.value = ''; // Limpa o input
                // Não precisa de 'showMessage' de sucesso, a mensagem aparece na tela
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
                showMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
            }
        }
    });

    // Botão de Busca
    document.getElementById('search-button').addEventListener('click', () => {
        const keyword = document.getElementById('search-keyword').value.toLowerCase();
        const category = document.getElementById('search-category').value.toLowerCase();
        const location = document.getElementById('search-location').value.toLowerCase();

        const filteredAds = allAds.filter(ad => {
            const matchesKeyword = ad.title.toLowerCase().includes(keyword) || ad.description.toLowerCase().includes(keyword);
            const matchesCategory = category === '' || ad.category.toLowerCase() === category;
            const matchesLocation = ad.location.toLowerCase().includes(location);
            return matchesKeyword && matchesCategory && matchesLocation;
        });

        displaySearchResults(filteredAds);
    });
}