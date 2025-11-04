import { showMessage } from './utils.js';

// Elemento para exibir o status de autenticação
const authStatusSpan = document.createElement('span');
authStatusSpan.id = 'auth-status';
authStatusSpan.className = 'text-sm text-gray-200 ml-4';

/**
 * Adiciona o elemento de status de autenticação ao cabeçalho.
 * Deve ser chamado uma vez em main.js no DOMContentLoaded.
 */
export function setupAuthStatusUI() {
    document.querySelector('header .container').appendChild(authStatusSpan);
    authStatusSpan.textContent = 'A verificar autenticação...'; // Estado inicial
}

/**
 * Atualiza o texto do status de autenticação no cabeçalho.
 * @param {string} text - O texto a ser exibido.
 */
export function updateAuthStatusText(text) {
    authStatusSpan.textContent = text;
}

/**
 * Habilita/desabilita elementos dos formulários e navegação
 * @param {boolean} isAuthenticated - O usuário está autenticado?
 * @param {boolean} profileRegistered - O usuário tem um perfil no Firestore?
 */
export function setFormAndNavState(isAuthenticated, profileRegistered) {
    console.log(`Chamando setFormAndNavState com isAuthenticated=${isAuthenticated}, profileRegistered=${profileRegistered}`);
    
    // Botões dos formulários (submeter)
    const registerFormSubmit = document.getElementById('register-form')?.querySelector('button[type="submit"]');
    const createAdFormSubmit = document.getElementById('create-ad-form')?.querySelector('button[type="submit"]');
    const sendMessageFormSubmit = document.getElementById('send-message-form')?.querySelector('button[type="submit"]');
    const loginFormSubmit = document.getElementById('login-form')?.querySelector('button[type="submit"]');

    // Botões de navegação
    const navRegister = document.querySelector('.nav-button[data-target="register"]');
    const navCreateAd = document.querySelector('.nav-button[data-target="create-ad"]');
    const navMessages = document.querySelector('.nav-button[data-target="messages"]');
    const navLogin = document.querySelector('.nav-button[data-target="login"]');
    const navLogout = document.getElementById('logout-button');

    // Lógica de habilitação/desabilitação
    if (isAuthenticated && profileRegistered) {
        // Utilizador autenticado E com perfil registado: Acesso total
        if (registerFormSubmit) registerFormSubmit.disabled = true;
        if (createAdFormSubmit) createAdFormSubmit.disabled = false;
        if (sendMessageFormSubmit) sendMessageFormSubmit.disabled = false;
        if (loginFormSubmit) loginFormSubmit.disabled = true;

        if (navRegister) navRegister.disabled = true;
        if (navCreateAd) navCreateAd.disabled = false;
        if (navMessages) navMessages.disabled = false;
        if (navLogin) navLogin.disabled = true;
        if (navLogout) navLogout.style.display = 'block'; // Mostra botão Sair
        console.log('UI state: Full access.');
    } else if (isAuthenticated && !profileRegistered) {
        // Utilizador autenticado, mas SEM perfil registado
        if (registerFormSubmit) registerFormSubmit.disabled = false; // Deve preencher o cadastro
        if (createAdFormSubmit) createAdFormSubmit.disabled = true;
        if (sendMessageFormSubmit) sendMessageFormSubmit.disabled = true;
        if (loginFormSubmit) loginFormSubmit.disabled = true;

        if (navRegister) navRegister.disabled = false; // Força a ir para Cadastro
        if (navCreateAd) navCreateAd.disabled = true;
        if (navMessages) navMessages.disabled = true;
        if (navLogin) navLogin.disabled = true;
        if (navLogout) navLogout.style.display = 'block'; // Pode sair
        console.log('UI state: Authenticated but no profile. Force registration.');
    } else {
        // Utilizador NÃO autenticado
        if (registerFormSubmit) registerFormSubmit.disabled = false;
        if (createAdFormSubmit) createAdFormSubmit.disabled = true;
        if (sendMessageFormSubmit) sendMessageFormSubmit.disabled = true;
        if (loginFormSubmit) loginFormSubmit.disabled = false;

        if (navRegister) navRegister.disabled = false;
        if (navCreateAd) navCreateAd.disabled = true;
        if (navMessages) navMessages.disabled = true;
        if (navLogin) navLogin.disabled = false;
        if (navLogout) navLogout.style.display = 'none'; // Esconde botão Sair
        console.log('UI state: Not authenticated. Limited access.');
    }
}

/**
 * Alterna a visibilidade das seções
 * @param {string} targetId - O ID da seção a ser mostrada.
 * @param {boolean} hasRegisteredProfile - O usuário tem um perfil registrado?
 */
export function showSection(targetId, hasRegisteredProfile) {
    // Seções que exigem um perfil registado no Firestore
    const sectionsRequiringRegisteredProfile = ['create-ad', 'messages'];
    
    // Redireciona para a home se tentar aceder a uma secção restrita sem perfil
    if (sectionsRequiringRegisteredProfile.includes(targetId) && !hasRegisteredProfile) {
        showMessage('Você precisa estar autenticado E ter um perfil registado para aceder a esta secção. Por favor, complete o seu cadastro ou faça login.', 'error');
        document.querySelectorAll('.section').forEach(section => { section.classList.remove('active'); });
        document.getElementById('home').classList.add('active'); // Redireciona para home
        return;
    }

    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(targetId).classList.add('active');
}

/**
 * Exibe os resultados da busca na tela.
 * @param {Array} results - Um array de objetos de anúncios.
 */
export function displaySearchResults(results) {
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = ''; // Limpa resultados anteriores

    if (results.length === 0) {
        searchResultsDiv.innerHTML = '<p class="text-gray-500 text-center col-span-full">Nenhum serviço encontrado. Tente ajustar os filtros.</p>';
        return;
    }

    results.forEach(ad => {
        const adCard = `
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col h-full">
                <img src="${ad.imageUrl}" alt="Imagem do serviço de ${ad.category}" class="w-full h-32 object-cover rounded-md mb-3">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${ad.title}</h3>
                <p class="text-gray-600 text-sm mb-2 flex-grow">${ad.description}</p>
                <div class="text-gray-700 text-sm mb-1">
                    <span class="font-semibold">Categoria:</span> ${ad.category.charAt(0).toUpperCase() + ad.category.slice(1)}
                </div>
                <div class="text-gray-700 text-sm mb-1">
                    <span class="font-semibold">Preço:</span> ${ad.price}
                </div>
                <div class="text-gray-700 text-sm mb-3">
                    <span class="font-semibold">Localização:</span> ${ad.location}
                </div>
                <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mt-auto w-full">Entrar em Contacto</button>
            </div>
        `;
        searchResultsDiv.innerHTML += adCard;
    });
}

/**
 * Renderiza a lista de mensagens na tela.
 * @param {Array} messages - Array de objetos de mensagem.
 * @param {string} currentUserId - O UID do usuário logado.
 */
export function renderMessages(messages, currentUserId) {
    const messageListDiv = document.getElementById('message-list');
    messageListDiv.innerHTML = ''; // Limpa as mensagens existentes
    
    if (messages.length === 0) {
        messageListDiv.innerHTML = '<p class="text-gray-500 text-center">Nenhuma mensagem ainda.</p>';
        return;
    }

    messages.forEach(msg => {
        const isMyMessage = msg.senderId === currentUserId;
        const messageHtml = `
            <div class="flex items-start ${isMyMessage ? 'justify-end' : ''} space-x-3">
                ${!isMyMessage ? `<div class="flex-shrink-0 w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">${msg.senderName ? msg.senderName.substring(0, 2).toUpperCase() : '??'}</div>` : ''}
                <div class="flex-grow ${isMyMessage ? 'bg-green-100 text-right' : 'bg-blue-100'} p-3 rounded-lg shadow-sm">
                    <p class="font-semibold ${isMyMessage ? 'text-green-800' : 'text-blue-800'} ${isMyMessage ? 'text-right' : ''}">${isMyMessage ? 'Você' : (msg.senderName || 'Desconhecido')}</p>
                    <p class="text-gray-700 ${isMyMessage ? 'text-right' : ''}">${msg.text}</p>
                    <span class="text-xs text-gray-500 block ${isMyMessage ? 'text-left' : 'text-right'} mt-1">${msg.timestamp && typeof msg.timestamp.toDate === 'function' ? new Date(msg.timestamp.toDate()).toLocaleTimeString() + ' - ' + new Date(msg.timestamp.toDate()).toLocaleDateString() : 'Sem data'}</span>
                </div>
                ${isMyMessage ? `<div class="flex-shrink-0 w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold">VC</div>` : ''}
            </div>
        `;
        messageListDiv.innerHTML += messageHtml;
    });
    messageListDiv.scrollTop = messageListDiv.scrollHeight; // Rola para o final
}