// Função para exibir mensagens na tela (substitui alert())
export function showMessage(message, type = 'info') {
    const messageBox = document.createElement('div');
    messageBox.className = `message-box ${type}`;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);

    // Remove a mensagem após um tempo
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Escapa texto vindo do usuário antes de colocá-lo em HTML (evita XSS).
export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

// Só aceita URLs http(s) para imagens; qualquer outra coisa vira o placeholder.
export function safeImageUrl(value, fallback = 'https://placehold.co/400x200?text=BORA') {
    try {
        const url = new URL(String(value));
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : fallback;
    } catch {
        return fallback;
    }
}
