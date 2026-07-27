// ============================================
// COSMIC AVENTURE - MAÎTRE DU JEU IA
// Génération d'histoire, combats, quêtes
// ============================================
const GameMaster = {
    currentSession: null,
    
    // Initialiser une session de jeu
    initSession: function(character) {
        this.currentSession = {
            character: character,
            currentLocation: character.location,
            story: [],
            choices: [],
            combat: null,
            lastUpdate: new Date().toISOString()
        };
        return this.currentSession;
    },
    
    // Générer le début d'histoire selon race/classe
    generateStoryStart: function(character) {
        const race = character.race;
        const classType = character.class;
        
        const intros = {
            terrien: {
                ninja: "Né dans les bas-fonds de Neo-Tokyo, vous avez appris la furtivité pour survivre...",
                mercenaire: "Ancien soldat de l'armée terrestre, vous avez été renvoyé pour insubordination...",
                sorcier: "Étudiant à l'Académie des Sciences Cosmiques, vous avez découvert des pouvoirs interdits...",
                necromancien: "Archéologue sur Mars, vous avez réveillé quelque chose d'ancien dans les ruines..."
            },
            martien: {
                ninja: "Dans les canaux souterrains de Mars, vous êtes l'ombre qui frappe...",
                mercenaire: "Mineur devenus mercenaire, votre force est légendaire dans les colonies...",
                sorcier: "Les cristaux rouges de Mars vous ont révélé des secrets cosmiques...",
                necromancien: "Les tempêtes de poussière vous parlent des âmes perdues..."
            },
            raelien: {
                ninja: "Gardien des temples de lumière, vous protégez les secrets ancestraux...",
                mercenaire: "Exilé de Raël Prime, vous vendez vos services pour survivre...",
                sorcier: "Connecté à l'énergie cosmique, vous canalisez la lumière des étoiles...",
                necromancien: "Hérétique parmi les vôtres, vous explorez les énergies sombres..."
            },
            ptitgris: {
                ninja: "Espion de Zeta Reticuli, votre mission est d'infiltrer l'humanité...",
                mercenaire: "Votre technologie supérieure fait de vous un mercenaire recherché...",
                sorcier: "Votre intelligence génétique vous permet de manipuler la réalité...",
                necromancien: "Expérimentateur interdit, vous créez des hybrides alien..."
            }
        };
        
        const intro = intros[race]?.[classType] || "Votre aventure commence...";
        
        return {
            title: `L'Aube de ${character.name}`,
            introduction: intro,
            startingLocation: this.getStartingLocation(character),
            firstChoices: [
                { text: "Explorer les environs", action: "explore" },
                { text: "Chercher de l'équipement", action: "find_gear" },
                { text: "Partir à l'aventure", action: "adventure" }
            ]
        };
    },
    
    // Obtenir la localisation de départ
    getStartingLocation: function(character) {
        const locations = {
            terrien: {
                planet: 'Terre',
                city: 'Neo-Paris',
                district: 'Quartier des Ombres'
            },
            martien: {
                planet: 'Mars',
                city: 'Olympus City',
                district: 'Dômes Extérieurs'
            },
            raelien: {
                planet: 'Raël Prime',
                city: 'Cité de Lumière',
                district: 'Temple Extérieur'
            },
            ptitgris: {
                planet: 'Zeta Reticuli',
                city: 'Base Alpha',
                district: 'Laboratoires'
            }
        };
        
        return locations[character.race] || locations.terrien;
    },
    
    // Générer une rencontre aléatoire
    generateEncounter: function(character, location) {
        const roll = Rules.roll('d100');
        const difficulty = character.level;
        
        let encounter;
        
        if (roll.total <= 30) {
            // Rencontre paisible
            encounter = this.generatePeacefulEncounter(character);
        } else if (roll.total <= 70) {
            // Combat simple
            encounter = this.generateCombatEncounter(character, difficulty);
        } else if (roll.total <= 90) {
            // Événement spécial
            encounter = this.generateSpecialEvent(character, location);
        } else {
            // Boss ou combat difficile
            encounter = this.generateBossEncounter(character);
        }
        
        return encounter;
    },
    
    // Rencontre paisible
    generatePeacefulEncounter: function(character) {
        const encounters = [
            {
                type: 'merchant',
                title: 'Marchand Ambulant',
                description: 'Un marchand interstellaire propose ses marchandises...',
                merchant: {
                    name: 'Zorg le Commerçant',
                    items: Grimoire.generateRandomLoot(character.level, 5)
                }
            },
            {
                type: 'npc_quest',
                title: 'Appel à l\'Aide',
                description: 'Un habitant vous demande de l\'aide...',
                quest: {
                    name: 'Objet Perdu',
                    reward: { credits: 100, xp: 50 }
                }
            },
            {
                type: 'treasure',
                title: 'Découverte Fortuite',
                description: 'Vous trouvez un objet abandonné...',
                loot: Grimoire.generateRandomLoot(character.level, 2)
            }
        ];
        
        return encounters[Math.floor(Math.random() * encounters.length)];
    },
    
    // Rencontre de combat
    generateCombatEncounter: function(character, difficulty) {
        const enemyKeys = Object.keys(Grimoire.enemies).filter(
            key => !Grimoire.enemies[key].isBoss && Grimoire.enemies[key].level <= difficulty + 2
        );
        
        const enemyKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        const enemy = { ...Grimoire.enemies[enemyKey] };
        
        // Ajuster les PV selon le niveau du perso
        const levelDiff = character.level - enemy.level;
        enemy.hp += levelDiff * 5;
        enemy.maxHP = enemy.hp;
        
        return {
            type: 'combat',
            title: `Combat contre ${enemy.name}`,
            description: `Un ${enemy.name} sauvage vous attaque!`,
            enemy: enemy,
            initiative: Rules.initCombat([character, enemy])
        };
    },
    
    // Événement spécial
    generateSpecialEvent: function(character, location) {
        const events = [
            {
                type: 'anomaly',
                title: 'Anomalie Spatiale',
                description: 'Une faille dimensionnelle apparaît...',
                choices: [
                    { text: 'Examiner de près', effect: 'investigate' },
                    { text: 'Partir prudemment', effect: 'leave' }
                ]
            },
            {
                type: 'ruins',
                title: 'Ruines Anciennes',
                description: 'Vous découvrez des ruines d\'une civilisation perdue...',
                loot: Grimoire.generateRandomLoot(character.level + 1, 3)
            },
            {
                type: 'shipwreck',
                title: 'Vaisseau Écrasé',
                description: 'Un vaisseau spatial gît en ruine...',
                choices: [
                    { text: 'Fouiller l\'épave', effect: 'loot' },
                    { text: 'Chercher des survivants', effect: 'rescue' }
                ]
            }
        ];
        
        return events[Math.floor(Math.random() * events.length)];
    },
    
    // Rencontre Boss
    generateBossEncounter: function(character) {
        const bossKeys = Object.keys(Grimoire.enemies).filter(
            key => Grimoire.enemies[key].isBoss
        );
        
        const bossKey = bossKeys[Math.floor(Math.random() * bossKeys.length)];
        const boss = { ...Grimoire.enemies[bossKey] };
        
        return {
            type: 'boss_combat',
            title: `BOSS: ${boss.name}`,
            description: `Un ennemi légendaire apparaît! ${boss.name} vous défie!`,
            enemy: boss,
            isBoss: true
        };
    },
    
    // Résoudre un combat
    resolveCombat: function(combatData) {
        const { character, enemy } = combatData;
        const combatLog = [];
        
        let charHP = character.currentHP;
        let enemyHP = enemy.hp;
        let round = 1;
        
        while (charHP > 0 && enemyHP > 0 && round <= 20) {
            // Tour du personnage
            const attackResult = Rules.attack(character, enemy);
            if (attackResult.hit) {
                enemyHP -= attackResult.damage;
                combatLog.push({
                    round: round,
                    turn: 'character',
                    action: 'attack',
                    damage: attackResult.damage,
                    critical: attackResult.criticalHit
                });
            } else {
                combatLog.push({
                    round: round,
                    turn: 'character',
                    action: 'miss'
                });
            }
            
            if (enemyHP <= 0) break;
            
            // Tour de l'ennemi
            const enemyAttack = Rules.attack(enemy, character);
            if (enemyAttack.hit) {
                charHP -= enemyAttack.damage;
                combatLog.push({
                    round: round,
                    turn: 'enemy',
                    action: 'attack',
                    damage: enemyAttack.damage,
                    critical: enemyAttack.criticalHit
                });
            } else {
                combatLog.push({
                    round: round,
                    turn: 'enemy',
                    action: 'miss'
                });
            }
            
            round++;
        }
        
        return {
            victory: charHP > 0,
            characterHP: charHP,
            rounds: round,
            log: combatLog,
            loot: victory ? Grimoire.generateRandomLoot(character.level) : [],
            xp: victory ? enemy.xp : 0
        };
    },
    
    // Générer une quête
    generateQuest: function(character, location) {
        const questTypes = [
            'hunt',      // Chasser un monstre
            'fetch',     // Trouver un objet
            'rescue',    // Sauver quelqu'un
            'explore',   // Explorer un lieu
            'escort'     // Escorter
        ];
        
        const type = questTypes[Math.floor(Math.random() * questTypes.length)];
        
        const quests = {
            hunt: {
                title: 'Chasse au Monstre',
                description: `Éliminez ${Math.floor(Math.random() * 3) + 1} ${this.getRandomEnemyName()}`,
                objective: 'kill_enemies',
                target: Math.floor(Math.random() * 3) + 1,
                reward: {
                    credits: character.level * 50,
                    xp: character.level * 25,
                    item: Math.random() > 0.7 ? Grimoire.generateRandomLoot(character.level, 1)[0] : null
                }
            },
            fetch: {
                title: 'Objet Rare',
                description: 'Trouvez un artefact ancien dans les ruines',
                objective: 'find_item',
                target: 1,
                reward: {
                    credits: character.level * 75,
                    xp: character.level * 30
                }
            },
            rescue: {
                title: 'Sauvetage',
                description: 'Sauvez les otages des bandits',
                objective: 'rescue_hostages',
                target: Math.floor(Math.random() * 3) + 1,
                reward: {
                    credits: character.level * 100,
                    xp: character.level * 40,
                    reputation: 10
                }
            }
        };
        
        return quests[type];
    },
    
    getRandomEnemyName: function() {
        const enemies = ['Rat Géant', 'Bandit Spatial', 'Alien Prédateur', 'Pirate'];
        return enemies[Math.floor(Math.random() * enemies.length)];
    },
    
    // Mettre à jour l'histoire
    addStoryEntry: function(entry) {
        if (!this.currentSession) return;
        
        this.currentSession.story.push({
            timestamp: new Date().toISOString(),
            ...entry
        });
        
        // Garder seulement les 100 derniers entrées
        if (this.currentSession.story.length > 100) {
            this.currentSession.story = this.currentSession.story.slice(-100);
        }
    }
};
