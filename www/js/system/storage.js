const Storage = {
    // === localStorage de base ===
    getItem: function(key) {
        try { return localStorage.getItem(key); } catch(e) { return null; }
    },
    setItem: function(key, value) {
        try { localStorage.setItem(key, value); } catch(e) {}
    },
    removeItem: function(key) {
        try { localStorage.removeItem(key); } catch(e) {}
    },
    clear: function() {
        try { localStorage.clear(); } catch(e) {}
    },

    // === API personnalisée du jeu ===
    _getCharacters: function() {
        const raw = this.getItem('cosmic_characters');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch(e) { return []; }
    },
    _setCharacters: function(chars) {
        this.setItem('cosmic_characters', JSON.stringify(chars));
    },

    getAllCharacters: function() {
        return this._getCharacters();
    },

    saveCharacter: function(character) {
        if (!character || !character.id) return false;
        const chars = this._getCharacters();
        const idx = chars.findIndex(c => c.id === character.id);
        if (idx >= 0) { chars[idx] = character; }
        else { chars.push(character); }
        this._setCharacters(chars);
        return true;
    },

    deleteCharacter: function(id) {
        const chars = this._getCharacters().filter(c => c.id !== id);
        this._setCharacters(chars);
    },

    getCharacterById: function(id) {
        return this._getCharacters().find(c => c.id === id) || null;
    },

    exportAll: function() {
        const data = {
            characters: this._getCharacters(),
            settings: this.getItem('cosmic_settings') || '{}',
            version: '1.0',
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(data);
    },

    importAll: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.characters) this._setCharacters(data.characters);
            if (data.settings) this.setItem('cosmic_settings', data.settings);
            return true;
        } catch(e) { return false; }
    },

    // === Auto-save ===
    autoSave: {
        _intervalId: null,
        start: function(characterId, intervalSeconds) {
            this.stop();
            if (!characterId) return;
            const sec = intervalSeconds || 30;
            this._intervalId = setInterval(function() {
                const char = Storage.getCharacterById(characterId);
                if (char) Storage.saveCharacter(char);
            }, sec * 1000);
        },
        },
        stop: function() {
            if (this._intervalId) {
                clearInterval(this._intervalId);
                this._intervalId = null;
            }
        }
    }
    // === Méthodes alias pour compatibilité apiManager.js ===
    load: function(key) {
        return this.getItem(key);
    },
    save: function(key, value) {
        this.setItem(key, value);
    },
};
