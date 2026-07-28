const App = {
    currentCharacter: null,
    currentScreen: 'menu',
    screens: ['menu', 'game', 'combat', 'inventory', 'skills', 'ship', 'quest', 'map', 'character', 'settings'],

    init: function() {
        this.loadCharacter();
        UI.init();
        Dice.init();
        GM.init();
        this.showScreen('menu');
    },

    loadCharacter: function() {
        const data = Storage.load();
        if (data && data.character) {
            this.currentCharacter = data.character;
            UI.addStoryEntry('Bienvenue', `Bon retour, ${this.currentCharacter.name} !`);
        }
    },

    showScreen: function(screenName) {
        if (!this.screens.includes(screenName)) {
            console.warn('Écran inconnu:', screenName);
            return;
        }
        this.screens.forEach(s => {
            const el = document.getElementById(s + '-screen');
            if (el) el.style.display = 'none';
        });
        const target = document.getElementById(screenName + '-screen');
        if (target) {
            target.style.display = 'block';
            this.currentScreen = screenName;
        }
        if (screenName === 'inventory' && Inventory.render) Inventory.render();
        if (screenName === 'skills' && Skills.render) Skills.render();
        if (screenName === 'ship' && Ship.render) Ship.render();
        if (screenName === 'quest' && Quest.render) Quest.render();
        if (screenName === 'map' && Map.render) Map.render();
    },

    createCharacter: function(name, race, className) {
        const character = Races.createCharacter(name, race, className);
        this.currentCharacter = character;
        Storage.saveCharacter(character);
        UI.addStoryEntry('Nouveau personnage', `${name} le ${race} ${className} est né !`);
        this.showScreen('game');
        this.generateNextEncounter();
    },

    generateNextEncounter: function() {
        if (!this.currentCharacter) return;
        const roll = Math.random();
        if (roll < 0.4) {
            const enemy = Rules.generateEnemy(this.currentCharacter.level);
            setTimeout(() => Combat.start(enemy), 1000);
        } else if (roll < 0.7) {
            UI.addStoryEntry('Exploration', 'Vous avancez dans l\'espace... Rien ne se passe pour l\'instant.');
        } else {
            UI.addStoryEntry('Découverte', 'Vous trouvez un point d\'intérêt. [Explorer] à venir.');
        }
    },

    exportSave: function() {
        const data = Storage.exportAll();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cosmic_save_${Date.now()}.json`;
        a.click();
    },

    importSavePrompt: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (Storage.importAll(event.target.result)) {
                    alert('Sauvegarde importée avec succès !');
                    location.reload();
                } else {
                    alert('Erreur lors de l\'importation.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
};

window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
