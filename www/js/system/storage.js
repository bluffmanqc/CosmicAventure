const Storage = {
    saveCharacter: function(character) {
        const data = this.load() || {};
        data.character = character;
        return this.save(data);
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
