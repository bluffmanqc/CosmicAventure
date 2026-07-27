// ============================================
// COSMIC AVENTURE - APP CONTROLLER
// Point d'entrée et coordination générale
// ============================================
const App = {
    currentCharacter: null,
    
    // Initialisation
    init: function() {
        console.log('Initialisation de Cosmic Aventure...');
        try {
            APIManager.loadKeys();
            console.log('Clés API chargées');
        } catch(e) {
            console.error('Erreur chargement API:', e);
        }
        
        // Simuler un chargement
        setTimeout(() => {
            const savedChars = Storage.getAllCharacters();
            if (savedChars.length > 0) {
                // Pour l'instant, on va au menu principal, on pourrait charger le dernier
                this.showScreen('main-menu');
            } else {
                this.showScreen('main-menu');
            }
        }, 1500);
    },
    
    // Navigation
    showScreen: function(screenId) {
        UI.showScreen(screenId);
    },
    
    // Mise à jour des descriptions en temps réel
    updateRaceDesc: function() {
        const race = document.getElementById('char-race').value;
        document.getElementById('race-desc').textContent = Races[race].description;
    },
    
    updateClassDesc: function() {
        const cls = document.getElementById('char-class').value;
        document.getElementById('class-desc').textContent = Classes[cls].description;
    },
    
    // Création de personnage
    createCharacter: function() {
        const name = document.getElementById('char-name').value.trim();
        const race = document.getElementById('char-race').value;
        const cls = document.getElementById('char-class').value;
        
        if (!name) {
            alert('Veuillez entrer un nom pour votre personnage !');
            return;
        }
        
        const appearance = {
            body: 'athletic',
            skin: 'light',
            height: 'average',
            hair: 'short',
            hairStyle: 'neat',
            eyes: 'determined',
            mark: 'none'
        };
        
        this.currentCharacter = createCharacter(name, race, cls, appearance);
        Storage.saveCharacter(this.currentCharacter);
        
        // Démarrer l'aventure
        this.startGame();
    },
    
    // Démarrer une partie
    startGame: function() {
        GameMaster.initSession(this.currentCharacter);
        UI.updateMiniHeader(this.currentCharacter);
        this.showScreen('game');
        
        const storyStart = GameMaster.generateStoryStart(this.currentCharacter);
        
        // Générer une image de départ
        const imgUrl = Images.getStoryScene(`starting adventure on ${this.currentCharacter.location.planet}, ${this.currentCharacter.location.city}`);
        
        UI.addStoryEntry(storyStart.title, storyStart.introduction, imgUrl);
        UI.showChoices(storyStart.firstChoices);
        
        // Sauvegarde auto
        Storage.autoSave.start(this.currentCharacter.id, 5);
    },
    
    // Gestion des choix du joueur
    handleChoice: function(choice) {
        UI.showChoices([]); // Cacher les anciens choix
        
        UI.addStoryEntry('Action', `Vous choisissez : ${choice.text}`);
        
        if (choice.action === 'explore' || choice.action === 'adventure' || choice.action === 'find_gear') {
            this.generateNextEncounter();
        }
    },
    
    // Générer la prochaine rencontre
    generateNextEncounter: function() {
        setTimeout(() => {
            const encounter = GameMaster.generateEncounter(this.currentCharacter, this.currentCharacter.location);
            
            if (encounter.type === 'combat' || encounter.type === 'boss_combat') {
                UI.addStoryEntry(encounter.title, encounter.description, Images.getEnemyImage(encounter.enemy));
                setTimeout(() => Combat.start(encounter), 1000);
            } 
            else if (encounter.type === 'merchant') {
                UI.addStoryEntry(encounter.title, encounter.description);
                UI.showChoices([{ text: 'Voir les marchandises', action: 'shop' }, { text: 'Partir', action: 'explore' }]);
            }
            else if (encounter.type === 'treasure') {
                UI.addStoryEntry(encounter.title, encounter.description);
                this.currentCharacter.inventory.push(...encounter.loot);
                Storage.saveCharacter(this.currentCharacter);
                UI.showChoices([{ text: 'Continuer l\'exploration', action: 'explore' }]);
            }
        }, 800);
    },
    
    // Chargement des personnages (placeholder pour le menu "Continuer")
    loadCharacters: function() {
        const chars = Storage.getAllCharacters();
        if (chars.length === 0) {
            alert('Aucun personnage trouvé. Créez-en un nouveau !');
            return;
        }
        // Pour simplifier, on charge le premier
        this.currentCharacter = chars[0];
        this.startGame();
    },
    
    // Paramètres
    saveSettings: function() {
        const grokKey = document.getElementById('api-grok').value;
        const elevenKey = document.getElementById('api-elevenlabs').value;
        
        if (grokKey) APIManager.setKey('grok', grokKey);
        if (elevenKey) APIManager.setKey('elevenlabs', elevenKey);
        
        alert('Paramètres sauvegardés !');
        this.showScreen('main-menu');
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
                } else {
                    alert('Erreur lors de l\'importation.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
};

// Démarrage automatique
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
