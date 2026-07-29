const Storage = {
    saveCharacter: function(character) {
        const data = this.load() || {};
        data.character = this.cleanCharacter(character);
        return this.save(data);
    },

    cleanCharacter: function(char) {
        const cleaned = JSON.parse(JSON.stringify(char));
        delete cleaned._tempData;
        delete cleaned.battleHistory;
        // cachedImages nettoyé séparément
        if (cleaned.inventory) {
            cleaned.inventory = cleaned.inventory.map(item => ({
                id: item.id, name: item.name, type: item.type, category: item.category,
                quantity: item.quantity, level: item.level, rarity: item.rarity,
                stats: item.stats, equipped: item.equipped
            }));
        }
        if (cleaned.equipment) {
            cleaned.equipment = cleaned.equipment.map(item => ({
                id: item.id, name: item.name, type: item.type, slot: item.slot,
                level: item.level, rarity: item.rarity, stats: item.stats
            }));
        }
        return cleaned;
    },

    loadCharacter: function() {
        const data = this.load();
        return data ? data.character : null;
    },

    save: function(data) {
        try {
            localStorage.setItem('cosmic_save', JSON.stringify(data));
            return true;
        } catch(e) {
            console.error('Storage.save error:', e);
            return false;
        }
    },

    load: function() {
        var data = localStorage.getItem('cosmic_save');
        if (data) {
            try {
                return JSON.parse(data);
            } catch(e) {
                console.error('Storage.load error:', e);
                return null;
            }
        }
        return null;
    },

    exportAll: function() {
        const data = localStorage.getItem('cosmic_save') || '{}';
        return data;
    },

    importAll: function(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data && data.character) {
                localStorage.setItem('cosmic_save', jsonString);
                return true;
            }
            return false;
        } catch(e) {
            console.error('Storage.import error:', e);
            return false;
        }
    },

    clear: function() {
        localStorage.removeItem('cosmic_save');
    }
};
