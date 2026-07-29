// ============================================
// COSMIC AVENTURE - UI MANAGER
// Gestion des écrans et du rendu DOM
// ============================================
const UI = {
    currentScreen: 'loading',
    
    // Changer d'écran
    showScreen: function(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            this.currentScreen = screenId;
            
            // Actions spécifiques au chargement de l'écran
            if (screenId === 'character-sheet') this.renderCharacterSheet();
            if (screenId === 'game') this.scrollToBottom();
        }
    },
    
    // Afficher une entrée d'histoire
    addStoryEntry: function(title, text, imageUrl = null) {
        const container = document.getElementById('story-log');
        const entry = document.createElement('div');
        entry.className = 'story-entry';
        
        let html = `<h3>${title}</h3><p>${text}</p>`;
        if (imageUrl) {
            html += `<img src="${imageUrl}" alt="Scene" loading="lazy">`;
        }
        
        entry.innerHTML = html;
        container.appendChild(entry);
        this.scrollToBottom();
    },
    
    // Afficher les choix
    showChoices: function(choices) {
        const container = document.getElementById('choices-log');
        container.innerHTML = '';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = `▶ ${choice.text}`;
            btn.onclick = () => App.handleChoice(choice);
            container.appendChild(btn);
        });
    },
    
    // Mettre à jour le mini-header du jeu
    updateMiniHeader: function(character) {
        document.getElementById('mini-name').textContent = character.name;
        const portraitUrl = Images.getCharacterPortrait(character);
        document.getElementById('mini-portrait').src = portraitUrl;
        
        const hpPercent = (character.currentHP / character.maxHP) * 100;
        document.getElementById('mini-hp-bar').style.width = `${hpPercent}%`;
        document.getElementById('mini-hp-bar').style.background = hpPercent < 30 ? 'var(--accent)' : 'var(--success)';
    },
    
    // Rendu de la fiche de personnage
    renderCharacterSheet: function() {
        const char = App.currentCharacter;
        if (!char) return;
        
        document.getElementById('sheet-portrait').src = Images.getCharacterPortrait(char);
        document.getElementById('sheet-name').textContent = char.name;
        document.getElementById('sheet-race-class').textContent = `${Races[char.race].name} - ${Classes[char.class].name}`;
        document.getElementById('sheet-level').textContent = char.level;
        document.getElementById('sheet-xp').textContent = `${char.xp} / ${char.xpNeeded}`;
        
        // Attributs
        const attrList = document.getElementById('sheet-attributes');
        attrList.innerHTML = '';
        for (const [key, value] of Object.entries(char.attributes)) {
            const mod = Math.floor((value - 10) / 2);
            const modStr = mod >= 0 ? `+${mod}` : mod;
            attrList.innerHTML += `<li><span>${key.charAt(0).toUpperCase() + key.slice(1)}</span> <span>${value} (${modStr})</span></li>`;
        }
        
        // Équipement
        const equipList = document.getElementById('sheet-equipment');
        equipList.innerHTML = '';
        if (char.equipment.length === 0) {
            equipList.innerHTML = '<li>Aucun équipement</li>';
        } else {
            char.equipment.forEach(item => {
                equipList.innerHTML += `<li><span>${item.name}</span> <span style="color:var(--primary)">Équipé</span></li>`;
            });
        }
    },
    
    scrollToBottom: function() {
        const container = document.getElementById('story-log');
        if (container) {
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    },
    
    // Afficher un indicateur de chargement
    showLoading: function(show) {
        // Implémentation simple d'overlay si nécessaire
    }
};
