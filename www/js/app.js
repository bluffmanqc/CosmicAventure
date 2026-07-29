const App = {
    state: null,
    statPointsAvailable: 15,
    allocatedStats: { force: 0, agilite: 0, constitution: 0, intelligence: 0, sagesse: 0, charisme: 0 },
    customAvatarUrl: null,
    defaultAvatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400",

    planetMapping: {
        "Humain": { planet: "Néo-Terra", desc: "une planète urbaine de la Fédération Humaine." },
        "Alien Hybride": { planet: "Xylos-IV", desc: "une planète-jungle bioluminescente." },
        "Cyborg": { planet: "Cyber-1", desc: "un monde métropolitain industriel sous le néon." },
        "Synthétique / Droïde": { planet: "Usine Aethel", desc: "un complexe industriel en orbite." },
        "Korvax Cosmique": { planet: "Monolithe Korvax", desc: "une planète sacrée aux monolithes d'énergie." },
        "Sylphide Éthéré": { planet: "Cité Flottante Zephyria", desc: "un archipel de cités dans les nuages." }
    },

    init: function() {
        console.log("Démarrage CosmicAventure...");
        try {
            this.state = Storage.loadData() || {};
        } catch(e) {
            this.state = {};
        }

        if (!this.state.settings) this.state.settings = { grokKey: "", customProvider: "" };
        if (!this.state.grimoire) this.state.grimoire = { bestiary: [], equipment: [], mountsCompanions: [], shipsCargo: [], locations: [] };

        if (this.state.character) {
            const btnCont = document.getElementById('btn-continue-game');
            if (btnCont) btnCont.style.display = "block";
            this.updateUI();
            this.showScreen('game');
            
            if (this.state.storyProgress && (this.state.storyProgress.story || this.state.storyProgress.text)) {
                this.renderStoryUI(this.state.storyProgress);
            } else {
                this.startStory();
            }
        } else {
            const btnCont = document.getElementById('btn-continue-game');
            if (btnCont) btnCont.style.display = "none";
            this.showScreen('main-menu');
        }
    },

    ensureGameHeader: function() {
        const gameScreen = document.getElementById('screen-game');
        if (gameScreen && !document.getElementById('btn-back-to-menu')) {
            const topNav = document.createElement('div');
            topNav.id = 'game-top-bar';
            topNav.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(0,0,0,0.8); border-bottom:1px solid #00d2ff; margin-bottom:10px;";
            topNav.innerHTML = `
                <button id="btn-back-to-menu" onclick="App.confirmResetOrMenu()" style="background:#ff3366; color:#fff; border:none; padding:8px 12px; border-radius:5px; font-weight:bold; cursor:pointer;">
                    ⬅ Menu / Perso
                </button>
                <span style="color:#00d2ff; font-weight:bold; font-size:0.9rem;">CosmicAventure</span>
            `;
            gameScreen.insertBefore(topNav, gameScreen.firstChild);
        }
    },

    showScreen: function(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`screen-${screenId}`);
        if (target) target.classList.add('active');

        if (screenId === 'game') this.ensureGameHeader();
        if (screenId === 'character-sheet') this.renderCharacterSheet();
        if (screenId === 'settings') this.loadSettingsUI();
        if (screenId === 'grimoire') this.renderGrimoire();
    },

    startNewGameCreation: function() {
        this.allocatedStats = { force: 0, agilite: 0, constitution: 0, intelligence: 0, sagesse: 0, charisme: 0 };
        this.statPointsAvailable = 15;
        const ptsEl = document.getElementById('points-remaining');
        if (ptsEl) ptsEl.textContent = 15;
        ['force', 'agilite', 'constitution', 'intelligence', 'sagesse', 'charisme'].forEach(s => {
            const el = document.getElementById(`stat-${s}`);
            if (el) el.textContent = 10;
        });
        this.showScreen('character-creation');
    },

    confirmResetOrMenu: function() {
        if (confirm("Voulez-vous retourner au Menu / Créer un NOUVEAU personnage ?\n(Votre progression actuelle sera réinitialisée)")) {
            if (typeof Storage !== 'undefined' && Storage.clearCharacter) {
                Storage.clearCharacter();
            }
            this.state.character = null;
            this.state.storyProgress = null;
            const btnCont = document.getElementById('btn-continue-game');
            if (btnCont) btnCont.style.display = "none";
            this.startNewGameCreation();
        }
    },

    adjustStat: function(stat, delta) {
        if (delta > 0 && this.statPointsAvailable > 0) {
            this.allocatedStats[stat] += 1;
            this.statPointsAvailable -= 1;
        } else if (delta < 0 && this.allocatedStats[stat] > 0) {
            this.allocatedStats[stat] -= 1;
            this.statPointsAvailable += 1;
        }
        const ptsEl = document.getElementById('points-remaining');
        if (ptsEl) ptsEl.textContent = this.statPointsAvailable;
        const statEl = document.getElementById(`stat-${stat}`);
        if (statEl) statEl.textContent = 10 + this.allocatedStats[stat];
    },

    handleAvatarUpload: function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                this.customAvatarUrl = evt.target.result;
                const prev = document.getElementById('char-avatar-preview');
                if (prev) prev.src = this.customAvatarUrl;
            };
            reader.readAsDataURL(file);
        }
    },

    createCharacter: function() {
        const nameInput = document.getElementById('char-name');
        const raceInput = document.getElementById('char-race');
        const classInput = document.getElementById('char-class');

        const name = (nameInput && nameInput.value.trim()) || "Bluff";
        const race = (raceInput && raceInput.value) || "Humain";
        const cls = (classInput && classInput.value) || "Chasseur de Primes";
        const planetInfo = this.planetMapping[race] || { planet: "Néo-Terra", desc: "un monde urbain." };

        this.state.character = {
            name: name,
            race: race,
            homePlanet: planetInfo.planet,
            planetDesc: planetInfo.desc,
            classType: cls,
            appearance: this.customAvatarUrl || this.defaultAvatar,
            level: 1,
            xp: 0,
            hasMount: false,
            hasShip: false,
            hasCargo: false,
            currentLocation: planetInfo.planet,
            equipment: {
                head: "Aucun",
                chest: "Combinaison Standard (Chest)",
                weapon: "Blaster de base",
                legs: "Pantalon de tissu",
                accessory: "Aucun"
            },
            attributes: {
                force: 10 + this.allocatedStats.force,
                agilite: 10 + this.allocatedStats.agilite,
                constitution: 10 + this.allocatedStats.constitution,
                intelligence: 10 + this.allocatedStats.intelligence,
                sagesse: 10 + this.allocatedStats.sagesse,
                charisme: 10 + this.allocatedStats.charisme
            }
        };

        this.state.storyProgress = null;
        if (typeof Storage !== 'undefined' && Storage.saveData) {
            Storage.saveData(this.state);
        }

        const btnCont = document.getElementById('btn-continue-game');
        if (btnCont) btnCont.style.display = "block";
        this.updateUI();
        this.showScreen('game');
        this.startStory();
    },

    addEquipment: function(name, slot, desc, stats) {
        if (!this.state.character) return;
        if (!this.state.character.equipment) {
            this.state.character.equipment = { head: "Aucun", chest: "Combinaison Standard", weapon: "Blaster de base", legs: "Aucun", accessory: "Aucun" };
        }
        this.state.character.equipment[slot] = `${name} (${stats})`;

        if (!this.state.grimoire.equipment) this.state.grimoire.equipment = [];
        const exists = this.state.grimoire.equipment.some(e => e.name === name);
        if (!exists) {
            this.state.grimoire.equipment.push({ name: name, type: `Équipement (${slot.toUpperCase()})`, desc: desc, stats: stats });
        }
        if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
    },

    addMount: function(name, desc, stats) {
        if (!this.state.character) return;
        this.state.character.hasMount = true;

        if (!this.state.grimoire.mountsCompanions) this.state.grimoire.mountsCompanions = [];
        const exists = this.state.grimoire.mountsCompanions.some(m => m.name === name);
        if (!exists) {
            this.state.grimoire.mountsCompanions.push({ name: name, type: "Monture Terrestre", desc: desc, stats: stats });
        }
        if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
    },

    addXP: function(amount) {
        if (!this.state.character) return;
        this.state.character.xp = (this.state.character.xp || 0) + amount;
        if (this.state.character.xp >= 100) {
            this.state.character.level += 1;
            this.state.character.xp = 0;
            alert(`🎉 Niveau Supérieur ! Vous êtes maintenant Niveau ${this.state.character.level} !`);
        }
        if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
    },

    callAI: async function(promptText) {
        const settings = (this.state && this.state.settings) || {};
        const apiKey = (settings.grokKey && settings.grokKey.trim()) || "";
        const endpoint = (settings.customProvider && settings.customProvider.trim()) || "https://api.x.ai/v1/chat/completions";
        const char = this.state.character || { name: "Bluff", race: "Humain", classType: "Chasseur de Primes", level: 1, homePlanet: "Néo-Terra" };

        if (!apiKey) {
            console.log("⚡ MJ Hors-Ligne Instantané.");
            return this.getOfflineStoryFallback(promptText);
        }

        const systemPrompt = `Tu es le Maître du Jeu du RPG Sci-Fi "CosmicAventure".
Joueur : ${char.name} (${char.race}, ${char.classType}, Niv: ${char.level}).
Planète : ${char.currentLocation || char.homePlanet}.
Monture : ${char.hasMount ? 'OUI' : 'NON (Bloqué dans la ville)'}.
Vaisseau : ${char.hasShip ? 'OUI' : 'NON (Bloqué sur la planète, Niveau 15 requis)'}.

RÈGLES DE PROGRESSION ULTRA-STRICTES :
1. Au Niveau 1, NE DONNE PAS de monture ni de vaisseau gratuitement ! Le joueur doit travailler/combattre.
2. Le vaisseau spatial nécessite le Niveau 15+.
3. Propose des choix réalistes de niveau 1.

Réponds UNIQUEMENT en JSON valide :
{
  "title": "Titre du chapitre",
  "story": "Description du récit",
  "choices": ["Choix 1", "Choix 2", "Choix 3"]
}`;

        let controller, timeoutId;
        if (typeof AbortController !== 'undefined') {
            controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 3500);
        }

        try {
            const fetchOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: "grok-2-latest",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: promptText }],
                    temperature: 0.7
                })
            };
            if (controller) fetchOptions.signal = controller.signal;

            const res = await fetch(endpoint, fetchOptions);
            if (timeoutId) clearTimeout(timeoutId);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            let rawText = data.choices[0].message.content.trim();
            rawText = rawText.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
            return JSON.parse(rawText);
        } catch (e) {
            if (timeoutId) clearTimeout(timeoutId);
            return this.getOfflineStoryFallback(promptText);
        }
    },

    getOfflineStoryFallback: function(promptText) {
        const c = this.state.character || { name: "Bluff", race: "Humain", homePlanet: "Néo-Terra", classType: "Chasseur de Primes", level: 1, hasMount: false, hasShip: false };
        const text = (promptText || "").toLowerCase();

        // Départ Niveau 1
        if (!this.state.storyProgress || !this.state.storyProgress.story || text.includes("commence")) {
            return {
                title: `📍 Niv. ${c.level} - District de départ (${c.homePlanet})`,
                story: `Vous êtes dans la ville de départ de ${c.homePlanet}. Vous portez une combinaison de base et un blaster simple.\n\n⚠️ PROGRESSION :\n• Sans Monture 🦎 : Vous ne pouvez pas quitter la ville pour explorer la planète.\n• Sans Vaisseau 🚀 : Bloqué sur la planète (Niveau 15 requis).\n\nQue voulez-vous faire pour gagner vos premiers crédits ?`,
                choices: [
                    "Rechercher une mission de sécurité au bar local",
                    "Explorer le marché de la ville pour repérer les dresseurs de montures",
                    "Consulter les contrats du terminal d'information"
                ]
            };
        }

        // Quête 1 : Contrat au bar / réserve
        if (text.includes("bar") || text.includes("mission") || text.includes("marché") || text.includes("terminal")) {
            return {
                title: `📋 Contrat : Nettoyage de la Réserve`,
                story: `Un marchand local vous propose un contrat :\n« Des mécano-rats sabotent mes générateurs dans la réserve. Élimine-les et je te donne 150 Crédits ainsi qu'un Plastron Blindé (Chest) ! »`,
                choices: [
                    "Entrer dans la réserve et éliminer les vermines",
                    "Utiliser vos aptitudes de " + c.classType + " pour pirater la réserve",
                    "Négocier une meilleure récompense"
                ]
            };
        }

        // Resolution Combat -> Donne le Plastron (Chest)
        if (text.includes("éliminer") || text.includes("pirater") || text.includes("réserve") || text.includes("négocier")) {
            this.addXP(35);
            this.addEquipment("Plastron Blindé Renforcé", "chest", "Protection de Torse (Chest) contre les tirs de blaster", "+2 CONST, +10 HP");

            return {
                title: `⚔️ Mission Réussie ! (+35 XP)`,
                story: `Victoire ! Le marchand vous remet votre prime et un **Plastron Blindé Renforcé (Chest)** qui a été immédiatement équipé dans votre fiche de personnage !\n\nVous possédez maintenant assez de crédits pour aller voir le Dresseur de Montures.`,
                choices: [
                    "Acheter une Monture (Cyber-Gharial) chez le dresseur",
                    "Améliorer votre Blaster à l'atelier mécanique",
                    "Consulter vos équipements dans la Fiche de Personnage"
                ]
            };
        }

        // Quête Monture -> Débloque la Monture
        if (text.includes("dresseur") || text.includes("cyber-gharial") || text.includes("acheter")) {
            this.addMount("Cyber-Gharial", "Reptile bionique rapide adapté aux steppes de " + c.homePlanet, "Vitesse +50%");

            return {
                title: `🦎 Monture Acquise !`,
                story: `Félicitations ! Vous avez acquis un **Cyber-Gharial** ! Elle est enregistrée dans votre Grimoire et votre profil.\n\nGrâce à cette monture, vous pouvez désormais voyager entre les différentes villes de la planète ${c.homePlanet}.`,
                choices: [
                    "Chevaucher votre Monture vers la Métropole Centrale",
                    "Explorer les ruines extérieures de la planète",
                    "Se renseigner au spatioport sur l'obtention d'un Vaisseau"
                ]
            };
        }

        // Tentative d'obtenir un Vaisseau trop tôt
        if (text.includes("vaisseau") || text.includes("spatioport")) {
            if (c.level < 15) {
                return {
                    title: `🔒 Vaisseau Spatial Verrouillé (Niveau 15 requis)`,
                    story: `L'ingénieur du spatioport vous barre l'accès :\n« Vous êtes seulement Niveau ${c.level} ! La licence de vol spatial et l'accès aux réacteurs Hyper-Drive nécessitent le **Niveau 15**. Continuez à accomplir des quêtes sur la planète avec votre monture ! »`,
                    choices: [
                        "Chevaucher vers la Métropole Centrale pour des contrats plus avancés",
                        "Chasser des bandits dans les steppes sauvages pour gagner de l'XP",
                        "Examiner votre Fiche de Personnage et vos équipements"
                    ]
                };
            }
        }

        return {
            title: `🌌 Exploration sur ${c.currentLocation || c.homePlanet}`,
            story: `Action : "${promptText}"\n\nVous avancez sur ${c.homePlanet}. Votre niveau est ${c.level}.`,
            choices: [
                "Poursuivre la quête principale de la planète",
                "Consulter votre Fiche de Personnage / Équipement",
                "Chercher de nouveaux contrats"
            ]
        };
    },

    startStory: async function() {
        this.renderLoading("Connexion au Maître du Jeu...");
        try {
            const planet = (this.state.character && this.state.character.homePlanet) || "Néo-Terra";
            const aiData = await this.callAI(`Commence l'aventure du joueur au Niveau 1 sur sa planète natale ${planet}.`);
            this.state.storyProgress = aiData;
            if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
            this.renderStoryUI(aiData);
        } catch(err) {
            const fallback = this.getOfflineStoryFallback("Commence l'aventure");
            this.renderStoryUI(fallback);
        }
    },

    makeChoice: async function(choiceText) {
        this.renderLoading(`Résolution : "${choiceText}"...`);
        try {
            const name = (this.state.character && this.state.character.name) || "Bluff";
            const level = (this.state.character && this.state.character.level) || 1;
            const aiData = await this.callAI(`Le joueur (${name}) choisit : "${choiceText}". Raconte la suite au niveau ${level}.`);
            this.state.storyProgress = aiData;
            if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
            this.renderStoryUI(aiData);
        } catch(err) {
            const fallback = this.getOfflineStoryFallback(choiceText);
            this.renderStoryUI(fallback);
        }
    },

    sendGMChat: async function() {
        const input = document.getElementById('gm-chat-input');
        if (!input) return;
        const userMsg = input.value.trim();
        if (!userMsg) return;

        input.value = '';
        this.renderLoading(`Action MJ : "${userMsg}"...`);

        try {
            const name = (this.state.character && this.state.character.name) || "Bluff";
            const aiData = await this.callAI(`Le joueur (${name}) interagit : "${userMsg}".`);
            this.state.storyProgress = aiData;
            if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
            this.renderStoryUI(aiData);
        } catch(err) {
            const fallback = this.getOfflineStoryFallback(userMsg);
            this.renderStoryUI(fallback);
        }
    },

    renderLoading: function(message) {
        const titleEl = document.getElementById('story-title');
        const textEl = document.getElementById('story-text');
        const choiceDiv = document.getElementById('choice-buttons');

        if (titleEl) titleEl.textContent = "🎲 Le MJ prépare le récit...";
        if (textEl) textEl.textContent = message;
        if (choiceDiv) choiceDiv.innerHTML = `<div style="text-align:center; color:#00d2ff; padding:15px; font-weight:bold;">⚡ Calcul du Maître du Jeu...</div>`;
    },

    renderStoryUI: function(data) {
        if (!data) return;

        const titleEl = document.getElementById('story-title');
        const textEl = document.getElementById('story-text');
        const container = document.getElementById('choice-buttons');

        if (titleEl) titleEl.textContent = data.title || "Chapitre";
        if (textEl) textEl.textContent = data.story || data.text || "";

        if (container) {
            container.innerHTML = '';
            if (data.choices && Array.isArray(data.choices)) {
                data.choices.forEach((choice) => {
                    const btn = document.createElement('button');
                    btn.className = 'choice-btn';
                    btn.textContent = `▶ ${choice}`;
                    btn.onclick = () => this.makeChoice(choice);
                    container.appendChild(btn);
                });
            }
        }
    },

    renderGrimoire: function() {
        const sessEl = document.getElementById('display-session-code');
        if (sessEl) sessEl.textContent = this.state.sessionCode || "SOLO";
        const g = this.state.grimoire || {};

        this.populateGrimoireList('grim-bestiary', g.bestiary, "danger");
        this.populateGrimoireList('grim-equipment', g.equipment, "stats");
        this.populateGrimoireList('grim-mounts', g.mountsCompanions, "stats");
        this.populateGrimoireList('grim-ships', g.shipsCargo, "stats");
        this.populateGrimoireList('grim-locations', g.locations, "status");
    },

    populateGrimoireList: function(containerId, list, extraKey) {
        const el = document.getElementById(containerId);
        if (!el) return;
        if (!list || list.length === 0) {
            el.innerHTML = "<p style='color:#888; font-size:0.85rem; padding:10px;'>Aucun élément découvert dans le codex.</p>";
            return;
        }

        el.innerHTML = list.map(item => `
            <div class="grimoire-card">
                <h4>${item.name} <span class="grimoire-badge">${item.rarity || item.type}</span></h4>
                <p>${item.desc || ''}</p>
                ${item[extraKey] ? `<div class="grimoire-stats">📌 ${item[extraKey]}</div>` : ''}
            </div>
        `).join('');
    },

    switchGrimoireTab: function(tabId) {
        const target = document.getElementById(tabId);
        if (!target) return;
        const parent = target.parentElement;
        if (parent) {
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        }

        target.classList.add('active');
        if (event && event.target) event.target.classList.add('active');
    },

    syncWithFriend: function() {
        const friendDataStr = prompt("Code/Export JSON de votre ami :");
        if (!friendDataStr) return;

        try {
            const imported = JSON.parse(friendDataStr);
            if (imported && imported.grimoire) {
                ['bestiary', 'equipment', 'mountsCompanions', 'shipsCargo', 'locations'].forEach(cat => {
                    if (imported.grimoire[cat]) {
                        this.state.grimoire[cat] = [...(this.state.grimoire[cat] || []), ...imported.grimoire[cat]];
                    }
                });
                if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
                this.renderGrimoire();
                alert("🤝 Grimoire synchronisé !");
            }
        } catch (e) {
            alert("⚠️ Code invalide.");
        }
    },

    loadSettingsUI: function() {
        const settings = (this.state && this.state.settings) || {};
        const grokInput = document.getElementById('api-grok');
        const elevenInput = document.getElementById('api-elevenlabs');
        const customInput = document.getElementById('api-custom-provider');

        if (grokInput) grokInput.value = settings.grokKey || "";
        if (elevenInput) elevenInput.value = settings.elevenlabsKey || "";
        if (customInput) customInput.value = settings.customProvider || "";
    },

    saveSettings: function() {
        if (!this.state.settings) this.state.settings = {};
        const grokInput = document.getElementById('api-grok');
        const elevenInput = document.getElementById('api-elevenlabs');
        const customInput = document.getElementById('api-custom-provider');

        if (grokInput) this.state.settings.grokKey = grokInput.value.trim();
        if (elevenInput) this.state.settings.elevenlabsKey = elevenInput.value.trim();
        if (customInput) this.state.settings.customProvider = customInput.value.trim();

        if (typeof Storage !== 'undefined' && Storage.saveData) Storage.saveData(this.state);
        alert("✅ Clés enregistrées !");
    },

    rollDice: function(type) {
        const max = parseInt(type.replace('d', '')) || 20;
        const result = Math.floor(Math.random() * max) + 1;
        alert(`🎲 Lancer de ${type} : ${result}`);
    },

    switchTab: function(tabId) {
        const target = document.getElementById(tabId);
        if (!target) return;
        const parent = target.parentElement;
        if (parent) {
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        }

        target.classList.add('active');
        if (event && event.target) event.target.classList.add('active');
    },

    updateUI: function() {
        if (!this.state || !this.state.character) return;
        const nameEl = document.getElementById('mini-name');
        const portEl = document.getElementById('mini-portrait');

        if (nameEl) nameEl.textContent = this.state.character.name;
        if (portEl) portEl.src = this.state.character.appearance || this.defaultAvatar;
    },

    renderCharacterSheet: function() {
        if (!this.state || !this.state.character) return;
        const c = this.state.character;

        const nameEl = document.getElementById('sheet-name');
        const portEl = document.getElementById('sheet-portrait');
        const raceEl = document.getElementById('sheet-race-class');
        const planEl = document.getElementById('sheet-planet');

        if (nameEl) nameEl.textContent = `${c.name} (Niveau ${c.level} - XP: ${c.xp || 0}/100)`;
        if (portEl) portEl.src = c.appearance || this.defaultAvatar;
        if (raceEl) raceEl.textContent = `${c.race} - ${c.classType}`;
        if (planEl) planEl.textContent = `🌍 Planète: ${c.currentLocation || c.homePlanet} | Monture: ${c.hasMount ? 'Oui 🦎' : 'Non ❌'} | Vaisseau: ${c.hasShip ? 'Oui 🚀' : 'Non ❌ (Niv 15)'}`;

        const attrDiv = document.getElementById('sheet-attributes');
        if (attrDiv && c.attributes) {
            const eq = c.equipment || { head: "Aucun", chest: "Combinaison Standard", weapon: "Blaster de base", legs: "Aucun", accessory: "Aucun" };
            attrDiv.innerHTML = `
                <div style="background:rgba(0,210,255,0.1); padding:10px; border-radius:8px; margin-bottom:15px; border:1px solid #00d2ff;">
                    <h4 style="color:#00d2ff; margin-top:0;">🛡️ ÉQUIPEMENT PAR SLOT</h4>
                    <p>🪖 <strong>Tête (Head) :</strong> ${eq.head || "Aucun"}</p>
                    <p>🛡️ <strong>Torse (Chest) :</strong> ${eq.chest || "Combinaison Standard"}</p>
                    <p>⚔️ <strong>Arme (Weapon) :</strong> ${eq.weapon || "Blaster de base"}</p>
                    <p>🦵 <strong>Jambes (Legs) :</strong> ${eq.legs || "Aucun"}</p>
                    <p>💍 <strong>Accessoire :</strong> ${eq.accessory || "Aucun"}</p>
                </div>
                <h4 style="color:#00d2ff;">📊 ATTRIBUTS</h4>
                ${Object.entries(c.attributes).map(([k, v]) => `<p><strong>${k.toUpperCase()} :</strong> ${v}</p>`).join('')}
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
