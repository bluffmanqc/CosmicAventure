/**
 * GameMaster Chat System - Bulle de dialogue interactive avec le MJ
 * S'intègre avec apiManager.js pour les réponses IA (Grok)
 * Fallback local si pas de clé API configurée
 */

const GameMasterChat = {
    // État
    history: [],
    isTyping: false,
    currentContext: 'exploration', // exploration, combat, dialogue, shop, etc.
    
    // Références DOM (initialisées dans init)
    container: null,
    messagesContainer: null,
    inputField: null,
    sendButton: null,
    choicesContainer: null,
    typingIndicator: null,
    
    /**
     * Initialiser le système de chat
     */
    init: function() {
        this.container = document.getElementById('gm-chat-container');
        if (!this.container) {
            console.warn('GameMasterChat: container non trouvé');
            return;
        }
        
        this.messagesContainer = document.getElementById('gm-messages');
        this.inputField = document.getElementById('gm-input');
        this.sendButton = document.getElementById('gm-send-btn');
        this.choicesContainer = document.getElementById('gm-choices');
        this.typingIndicator = document.getElementById('gm-typing');
        
        // Bind events
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend();
        });
        
        // Message de bienvenue
        this.addMessage('mj', 'Bienvenue, aventurier. Je suis votre Maître de Jeu. Que souhaitez-vous faire ?');
        this.showChoices([
            { text: 'Explorer les environs', action: 'explore' },
            { text: 'Consulter ma fiche', action: 'character_sheet' },
            { text: 'Chercher du combat', action: 'combat' }
        ]);
    },
    
    /**
     * Ajouter un message au chat
     * @param {string} sender - 'mj' ou 'player'
     * @param {string} text - Contenu du message
     */
    addMessage: function(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `gm-message gm-${sender}`;
        
        const avatar = sender === 'mj' ? '🤖' : '👤';
        const name = sender === 'mj' ? 'MJ' : (App.playerName || 'Vous');
        
        msgDiv.innerHTML = `
            <div class="gm-avatar">${avatar}</div>
            <div class="gm-bubble">
                <div class="gm-name">${name}</div>
                <div class="gm-text">${this.escapeHtml(text)}</div>
            </div>
        `;
        
        this.messagesContainer.appendChild(msgDiv);
        this.scrollToBottom();
        
        // Sauvegarder dans l'historique
        this.history.push({
            sender: sender,
            text: text,
            timestamp: new Date().toISOString()
        });
        
        // Limiter l'historique à 50 messages
        if (this.history.length > 50) {
            this.history.shift();
        }
    },
    
    /**
     * Afficher l'indicateur "MJ est en train d'écrire..."
     */
    showTyping: function() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    },
    
    /**
     * Cacher l'indicateur de frappe
     */
    hideTyping: function() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    },
    
    /**
     * Afficher des boutons de choix rapides
     * @param {Array} choices - [{text: string, action: string, data?: any}]
     */
    showChoices: function(choices) {
        this.choicesContainer.innerHTML = '';
        this.choicesContainer.style.display = 'flex';
        
        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'gm-choice-btn';
            btn.textContent = choice.text;
            btn.onclick = () => {
                this.hideChoices();
                this.handleChoice(choice);
            };
            this.choicesContainer.appendChild(btn);
        });
    },
    
    /**
     * Cacher les choix
     */
    hideChoices: function() {
        this.choicesContainer.style.display = 'none';
        this.choicesContainer.innerHTML = '';
    },
    
    /**
     * Gérer l'envoi d'un message par le joueur
     */
    handleSend: function() {
        const text = this.inputField.value.trim();
        if (!text || this.isTyping) return;
        
        this.addMessage('player', text);
        this.inputField.value = '';
        this.hideChoices();
        
        this.processPlayerInput(text);
    },
    
    /**
     * Gérer le clic sur un choix rapide
     */
    handleChoice: function(choice) {
        this.addMessage('player', choice.text);
        this.processAction(choice.action, choice.data);
    },
    
    /**
     * Traiter l'entrée du joueur (texte libre)
     */
    processPlayerInput: function(text) {
        const lower = text.toLowerCase();
        
        // Commandes rapides
        if (lower.includes('combattre') || lower.includes('attaquer') || lower.includes('fight')) {
            this.processAction('combat');
        } else if (lower.includes('explorer') || lower.includes('marcher') || lower.includes('avancer')) {
            this.processAction('explore');
        } else if (lower.includes('fiche') || lower.includes('personnage') || lower.includes('stats')) {
            this.processAction('character_sheet');
        } else if (lower.includes('soigner') || lower.includes('potion') || lower.includes('heal')) {
            this.processAction('heal');
        } else if (lower.includes('fuir') || lower.includes('run') || lower.includes('escape')) {
            this.processAction('flee');
        } else {
            // Fallback : réponse contextuelle du MJ
            this.respondAsMJ(text);
        }
    },
    
    /**
     * Traiter une action prédéfinie
     */
    processAction: function(action, data) {
        this.showTyping();
        
        switch(action) {
            case 'explore':
                this.delayedResponse(() => {
                    const events = [
                        'Vous avancez prudemment dans les débris spatiaux...',
                        'Un bruit étrange retentit à proximité.',
                        'Vous découvrez une ancienne station abandonnée.',
                        'Le silence de l\'espace vous enveloppe.'
                    ];
                    const event = events[Math.floor(Math.random() * events.length)];
                    this.addMessage('mj', event);
                    
                    // Chance de rencontre
                    if (Math.random() < 0.4) {
                        setTimeout(() => {
                            this.addMessage('mj', 'Un ennemi approche ! Préparez-vous au combat !');
                            this.showChoices([
                                { text: '⚔️ Attaquer', action: 'combat' },
                                { text: '🏃 Fuir', action: 'flee' }
                            ]);
                        }, 800);
                    } else {
                        this.showChoices([
                            { text: 'Continuer', action: 'explore' },
                            { text: 'Se reposer', action: 'rest' },
                            { text: 'Fiche perso', action: 'character_sheet' }
                        ]);
                    }
                });
                break;
                
            case 'combat':
                this.delayedResponse(() => {
                    this.addMessage('mj', 'Le combat commence ! Un ' + GameMaster.getRandomEnemyName() + ' vous attaque !');
                    if (typeof CombatUI !== 'undefined') {
                        CombatUI.startCombat();
                    }
                    this.showChoices([
                        { text: '⚔️ Attaquer', action: 'combat_attack' },
                        { text: '🛡️ Défendre', action: 'combat_defend' },
                        { text: '🏃 Fuir', action: 'flee' }
                    ]);
                });
                break;
                
            case 'combat_attack':
                this.delayedResponse(() => {
                    const dmg = Math.floor(Math.random() * 10) + 5;
                    this.addMessage('mj', `Vous infligez ${dmg} points de dégâts !`);
                    this.showChoices([
                        { text: 'Continuer le combat', action: 'combat' },
                        { text: 'Utiliser une compétence', action: 'combat_skill' }
                    ]);
                });
                break;
                
            case 'combat_defend':
                this.delayedResponse(() => {
                    this.addMessage('mj', 'Vous vous mettez en position défensive. Les dégâts subis sont réduits.');
                    this.showChoices([
                        { text: 'Contre-attaquer', action: 'combat_attack' },
                        { text: 'Rester défensif', action: 'combat_defend' }
                    ]);
                });
                break;
                
            case 'flee':
                this.delayedResponse(() => {
                    if (Math.random() < 0.6) {
                        this.addMessage('mj', 'Vous réussissez à fuir ! Vous êtes en sécurité... pour l\'instant.');
                        this.currentContext = 'exploration';
                        this.showChoices([
                            { text: 'Explorer', action: 'explore' },
                            { text: 'Se soigner', action: 'heal' }
                        ]);
                    } else {
                        this.addMessage('mj', 'La fuite échoue ! L\'ennemi vous rattrape !');
                        this.showChoices([
                            { text: 'Combattre', action: 'combat' }
                        ]);
                    }
                });
                break;
                
            case 'heal':
                this.delayedResponse(() => {
                    this.addMessage('mj', 'Vous utilisez une potion de soin. +20 PV restaurés.');
                    this.showChoices([
                        { text: 'Continuer', action: 'explore' }
                    ]);
                });
                break;
                
            case 'rest':
                this.delayedResponse(() => {
                    this.addMessage('mj', 'Vous vous reposez un moment. Vos PV sont restaurés.');
                    this.showChoices([
                        { text: 'Repartir', action: 'explore' }
                    ]);
                });
                break;
                
            case 'character_sheet':
                this.delayedResponse(() => {
                    this.addMessage('mj', 'Voici votre fiche de personnage. Souhaitez-vous la consulter en détail ?');
                    if (typeof App !== 'undefined' && App.showScreen) {
                        App.showScreen('character-sheet');
                    }
                    this.showChoices([
                        { text: 'Retour au jeu', action: 'explore' }
                    ]);
                });
                break;
                
            default:
                this.respondAsMJ('Action non reconnue : ' + action);
        }
    },
    
    /**
     * Répondre comme MJ (avec IA si possible, sinon fallback)
     */
    respondAsMJ: function(playerText) {
        this.showTyping();
        
        // Vérifier si l'API Grok est disponible
        if (typeof ApiManager !== 'undefined' && ApiManager.providers && 
            ApiManager.providers.grok && ApiManager.providers.grok.key) {
            
            const prompt = this.buildPrompt(playerText);
            
            ApiManager.generateText(prompt, { maxTokens: 150 })
                .then(response => {
                    this.hideTyping();
                    this.addMessage('mj', response);
                    this.generateChoicesFromContext();
                })
                .catch(err => {
                    console.error('Erreur API MJ:', err);
                    this.fallbackResponse(playerText);
                });
                
        } else {
            // Pas de clé API : réponse locale
            this.fallbackResponse(playerText);
        }
    },
    
    /**
     * Construire le prompt pour l'IA
     */
    buildPrompt: function(playerText) {
        const context = this.currentContext;
        const history = this.history.slice(-5).map(h => 
            `${h.sender === 'mj' ? 'MJ' : 'Joueur'}: ${h.text}`
        ).join('\n');
        
        return `Tu es le Maître de Jeu d'un RPG spatial appelé CosmicAventure. 
Contexte actuel: ${context}
Historique récent:
${history}

Le joueur dit: "${playerText}"

Réponds comme un MJ immersif, en français, en 1-2 phrases maximum. Propose des actions possibles à la fin.`;
    },
    
    /**
     * Réponse fallback locale (sans API)
     */
    fallbackResponse: function(playerText) {
        this.delayedResponse(() => {
            const responses = {
                exploration: [
                    'Les étoiles scintillent au loin. Un vaisseau dérivant attire votre attention.',
                    'Vous entendez un signal de détresse sur une fréquence inhabituelle.',
                    'Des traces de pas sur le sol métallique indiquent un passage récent.',
                    'Le vent artificiel souffle à travers les couloirs abandonnés.'
                ],
                combat: [
                    'L\'ennemi est blessé mais ne recule pas. Il prépare une contre-attaque !',
                    'Votre arme vibre dans vos mains. Le combat fait rage.',
                    'Une ouverture ! Vous pouvez frapper maintenant.',
                    'L\'adversaire semble faiblir. Encore quelques coups !'
                ],
                dialogue: [
                    'Le personnage vous observe avec méfiance. Que lui dites-vous ?',
                    'Un silence pesant s\'installe. Votre réponse sera déterminante.',
                    'Il hoche lentement la tête, attendant votre décision.'
                ]
            };
            
            const pool = responses[this.currentContext] || responses.exploration;
            const response = pool[Math.floor(Math.random() * pool.length)];
            
            this.addMessage('mj', response);
            this.generateChoicesFromContext();
        });
    },
    
    /**
     * Générer des choix selon le contexte actuel
     */
    generateChoicesFromContext: function() {
        const choices = {
            exploration: [
                { text: '🔍 Explorer', action: 'explore' },
                { text: '⚔️ Chercher combat', action: 'combat' },
                { text: '📋 Fiche perso', action: 'character_sheet' }
            ],
            combat: [
                { text: '⚔️ Attaquer', action: 'combat_attack' },
                { text: '🛡️ Défendre', action: 'combat_defend' },
                { text: '🏃 Fuir', action: 'flee' }
            ],
            dialogue: [
                { text: '💬 Parler', action: 'talk' },
                { text: '🎁 Offrir', action: 'gift' },
                { text: '⚔️ Menacer', action: 'threaten' }
            ]
        };
        
        this.showChoices(choices[this.currentContext] || choices.exploration);
    },
    
    /**
     * Réponse différée (simule le temps de réflexion du MJ)
     */
    delayedResponse: function(callback, delay) {
        delay = delay || (800 + Math.random() * 1200);
        setTimeout(() => {
            this.hideTyping();
            callback();
        }, delay);
    },
    
    /**
     * Définir le contexte actuel
     */
    setContext: function(context) {
        this.currentContext = context;
    },
    
    /**
     * Scroll vers le bas du chat
     */
    scrollToBottom: function() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },
    
    /**
     * Échapper le HTML pour éviter XSS
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Effacer le chat
     */
    clear: function() {
        this.messagesContainer.innerHTML = '';
        this.history = [];
    }
};

// Exposer globalement

    /**
     * Minimiser/maximiser le chat
     */
    toggleMinimize: function() {
        this.container.classList.toggle('minimized');
        const btn = document.querySelector('.gm-chat-toggle');
        if (btn) {
            btn.textContent = this.container.classList.contains('minimized') ? '+' : '−';
        }
    },
window.GameMasterChat = GameMasterChat;
