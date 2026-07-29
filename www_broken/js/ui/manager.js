const UI = {
    init: function() {
        this.setupNavigation();
        this.setupEventListeners();
    },

    setupNavigation: function() {
        const nav = document.getElementById('game-nav');
        if (nav) {
            nav.innerHTML = `
                <button onclick="App.showScreen('game')" class="nav-btn">🏠 Base</button>
                <button onclick="App.showScreen('inventory')" class="nav-btn">🎒 Inventaire</button>
                <button onclick="App.showScreen('skills')" class="nav-btn">🌟 Compétences</button>
                <button onclick="App.showScreen('ship')" class="nav-btn">🚀 Vaisseau</button>
                <button onclick="App.showScreen('quest')" class="nav-btn">📜 Quêtes</button>
                <button onclick="App.showScreen('craft')" class="nav-btn">⚒️ Atelier</button>
                <button onclick="App.showScreen('grimoire')" class="nav-btn">📖 Grimoire</button>
                <button onclick="App.showScreen('map')" class="nav-btn">🗺️ Carte</button>
                <button onclick="App.showScreen('character')" class="nav-btn">👤 Perso</button>
                <button onclick="App.showScreen('settings')" class="nav-btn">⚙️ Options</button>
            `;
        }
    },

    setupEventListeners: function() {
        const gmInput = document.getElementById('gm-input');
        const gmSend = document.getElementById('gm-send-btn');
        if (gmInput && gmSend) {
            gmSend.addEventListener('click', () => GameMasterChat.send(gmInput.value));
            gmInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') GameMasterChat.send(gmInput.value);
            });
        }
    },

    showScreen: function(screenName) {
        App.showScreen(screenName);
    },

    addStoryEntry: function(title, text) {
        const log = document.getElementById('story-log');
        if (!log) return;
        const entry = document.createElement('div');
        entry.className = 'story-entry';
        entry.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
        log.appendChild(entry);
        this.scrollToBottom();
    },

    updateCharacterSheet: function(char) {
        if (!char) return;
        const nameEl = document.getElementById('sheet-name');
        const classEl = document.getElementById('sheet-class');
        const hpEl = document.getElementById('sheet-hp');
        const mpEl = document.getElementById('sheet-mp');
        const xpEl = document.getElementById('sheet-xp');
        const levelEl = document.getElementById('sheet-level');
        const creditsEl = document.getElementById('sheet-credits');

        if (nameEl) nameEl.textContent = char.name || 'Inconnu';
        if (classEl) classEl.textContent = `${char.race || ''} ${char.class || ''}`.trim();
        if (hpEl) hpEl.textContent = `${char.currentHP || 0}/${char.maxHP || 0}`;
        if (mpEl) mpEl.textContent = `${char.currentMP || 0}/${char.maxMP || 0}`;
        if (xpEl) xpEl.textContent = `${char.xp || 0} / ${Rules.xpNeeded ? Rules.xpNeeded(char.level) : '?'}`;
        if (levelEl) levelEl.textContent = char.level || 1;
        if (creditsEl) creditsEl.textContent = char.credits || 0;

        const attrList = document.getElementById('sheet-attributes');
        if (attrList && char.attributes) {
            attrList.innerHTML = '';
            Object.entries(char.attributes).forEach(([key, value]) => {
                const mod = Rules.attributeModifier ? Rules.attributeModifier(value) : 0;
                const modStr = mod >= 0 ? `+${mod}` : mod;
                attrList.innerHTML += `<li><span>${key.charAt(0).toUpperCase() + key.slice(1)}</span> <span>${value} (${modStr})</span></li>`;
            });
        }

        const equipList = document.getElementById('sheet-equipment');
        if (equipList) {
            equipList.innerHTML = '';
            if (!char.equipment || char.equipment.length === 0) {
                equipList.innerHTML = '<li>Aucun équipement</li>';
            } else {
                char.equipment.forEach(item => {
                    equipList.innerHTML += `<li><span>${item.name}</span> <span style="color:var(--primary)">Équipé</span></li>`;
                });
            }
        }
    },

    scrollToBottom: function() {
        const container = document.getElementById('story-log');
        if (container) {
            setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
        }
    },

    showLoading: function(show) {
        // Implémentation simple d'overlay si nécessaire
    }
};
