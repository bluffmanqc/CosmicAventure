const App = {
    currentCharacter: null,
    currentScreen: 'menu',
    screens: ['menu', 'game', 'combat', 'inventory', 'skills', 'ship', 'quest', 'map', 'character', 'settings'],

    init: function() {
        this.loadCharacter();
        UI.init();
        Dice.init();
        GM.init();
        this.showScreen('main-menu');
    },

    loadCharacter: function() {
        const data = Storage.load();
        if (data && data.character) {
            this.currentCharacter = data.character;
            UI.addStoryEntry('Bienvenue', `Bon retour, ${this.currentCharacter.name} !`);
        }
    },

        showScreen: function(screenName) {
            const screenMap = {
                "menu": "main-menu",
                "game": "game-screen",
                "character-creator": "character-creator",
                "inventory-panel": "inventory-panel",
                "skilltree-panel": "skilltree-panel",
                "ship-panel": "ship-panel",
                "quests-panel": "quests-panel",
                "starmap-panel": "starmap-panel",
                "options-panel": "options-panel"
            };
            const targetId = screenMap[screenName] || screenName;
            document.querySelectorAll(".screen").forEach(el => {
                if (el.id !== "loading-screen") el.style.display = "none";
            });
            const target = document.getElementById(targetId);
            if (target) {
                target.style.display = "block";
                target.classList.add("active");
                this.currentScreen = screenName;
            } else {
                console.warn("Écran introuvable:", screenName, "->", targetId);
            }
            if (screenName === "inventory-panel" && window.Inventory && Inventory.render) Inventory.render();
            if (screenName === "skilltree-panel" && window.Skills && Skills.render) Skills.render();
            if (screenName === "ship-panel" && window.Ship && Ship.render) Ship.render();
            if (screenName === "quests-panel" && window.Quest && Quest.render) Quest.render();
            if (screenName === "starmap-panel" && window.Map && Map.render) Map.render();
        },
    createCharacter: function(name, race, className) {
        const character = Races.createCharacter(name, race, className);
        this.currentCharacter = character;
        Storage.saveCharacter(character);
        UI.addStoryEntry('Nouveau personnage', `${name} le ${race} ${className} est né !`);
        this.showScreen('game-screen');
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

// Wrappers pour compatibilité avec index.html
App.showMainMenu = function() { App.showScreen('main-menu'); };
App.showCharacterCreator = function() { App.showScreen('character-creator'); };
App.showGameScreen = function() { App.showScreen('game-screen'); };
App.showInventory = function() { App.showScreen('inventory-panel'); };
App.showQuests = function() { App.showScreen('quests-panel'); };
App.showShip = function() { App.showScreen('ship-panel'); };
App.showSkillTree = function() { App.showScreen('skilltree-panel'); };
App.showOptions = function() { App.showScreen('options-panel'); };
App.importSave = function() { App.importSavePrompt(); };
App.loadGame = function() { App.loadCharacter(); };
App.resetGame = function() { localStorage.clear(); location.reload(); };
