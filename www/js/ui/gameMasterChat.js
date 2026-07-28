const GameMasterChat = {
    init: function() {
        this.container = document.getElementById('gm-controls');
        if (!this.container) return;
        this.messagesContainer = null;
        this.history = [];
        this.render();
        this.bindEvents();
    },

    render: function() {
        this.container.innerHTML = `
            <div class="gm-chat-header">
                <h3>🎭 Maître du Jeu</h3>
                <button class="gm-chat-toggle">−</button>
            </div>
            <div class="gm-chat-body">
                <div id="gm-messages" class="gm-messages"></div>
                <div class="gm-input-area">
                    <input type="text" id="gm-input" class="gm-input" placeholder="Parler au MJ..." maxlength="200">
                    <button id="gm-send-btn" class="gm-send-btn">➤</button>
                </div>
            </div>
        `;
        this.messagesContainer = document.getElementById('gm-messages');
    },

    bindEvents: function() {
        const input = document.getElementById('gm-input');
        const sendBtn = document.getElementById('gm-send-btn');
        const toggleBtn = document.querySelector('.gm-chat-toggle');

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleMinimize());
        }
    },

    sendMessage: function() {
        const input = document.getElementById('gm-input');
        const text = input.value.trim();
        if (!text) return;
        this.addMessage('player', text);
        input.value = '';
        this.processGMResponse(text);
    },

    addMessage: function(type, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `gm-message gm-message-${type}`;
        msgDiv.innerHTML = `<span class="gm-message-text">${this.escapeHtml(text)}</span>`;
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
        this.history.push({ type, text, timestamp: Date.now() });
    },

    processGMResponse: function(playerText) {
        const responses = [
            "Intéressant... Continuez.",
            "Le destin vous observe.",
            "Une ombre se déplace dans l'obscurité.",
            "Vous sentez une présence étrange.",
            "Le cosmos répond à votre appel."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setTimeout(() => this.addMessage('gm', response), 500);
    },

    scrollToBottom: function() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    clear: function() {
        this.messagesContainer.innerHTML = '';
        this.history = [];
    },

    toggleMinimize: function() {
        this.container.classList.toggle('minimized');
        const btn = document.querySelector('.gm-chat-toggle');
        if (btn) {
            btn.textContent = this.container.classList.contains('minimized') ? '+' : '−';
        }
    }
};

window.GameMasterChat = GameMasterChat;
