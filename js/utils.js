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