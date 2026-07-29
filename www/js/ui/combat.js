// ============================================
// COSMIC AVENTURE - COMBAT MANAGER
// Boucle de combat interactive avec dés
// ============================================
const Combat = {
    active: false,
    data: null,
    
    // Démarrer un combat
    start: function(encounterData) {
        this.active = true;
        this.data = encounterData;
        
        // Mise à jour de l'UI
        document.getElementById('enemy-name').textContent = this.data.enemy.name;
        document.getElementById('enemy-img').src = Images.getEnemyImage(this.data.enemy);
        this.updateHPBars();
        
        document.getElementById('combat-log').innerHTML = `<p class="damage">⚔️ Le combat commence contre ${this.data.enemy.name} !</p>`;
        document.getElementById('combat-actions').style.display = 'flex';
        
        App.showScreen('combat');
        
        // Tour de l'ennemi si l'initiative est mauvaise (simplifié : le joueur commence toujours pour l'UX mobile)
    },
    
    // Action du joueur
    playerAction: function(action) {
        if (!this.active) return;
        
        const char = App.currentCharacter;
        const enemy = this.data.enemy;
        const log = document.getElementById('combat-log');
        
        if (action === 'attack') {
            const result = Rules.attack(char, enemy);
            
            if (result.criticalHit) {
                log.innerHTML += `<p class="damage">💥 COUP CRITIQUE ! Vous infligez ${result.damage} dégâts !</p>`;
            } else if (result.hit) {
                log.innerHTML += `<p>⚔️ Vous touchez et infligez <span class="damage">${result.damage}</span> dégâts.</p>`;
            } else {
                log.innerHTML += `<p>💨 Vous ratez votre attaque...</p>`;
            }
            
            enemy.hp -= result.damage;
        } 
        else if (action === 'flee') {
            const escapeRoll = Rules.attributeTest(char, 'agilite', 12);
            if (escapeRoll.success) {
                log.innerHTML += `<p class="heal">🏃 Vous parvenez à vous enfuir !</p>`;
                setTimeout(() => this.endCombat(false), 1500);
                return;
            } else {
                log.innerHTML += `<p>💨 Vous tentez de fuir mais vous trébuchez...</p>`;
            }
        }
        else if (action === 'item') {
            log.innerHTML += `<p>🎒 (Système d'objet à développer dans l'inventaire)</p>`;
        }
        
        this.updateHPBars();
        document.getElementById('combat-actions').style.display = 'none';
        
        // Vérifier victoire
        if (enemy.hp <= 0) {
            log.innerHTML += `<p class="heal">🏆 Victoire ! Vous avez vaincu ${enemy.name}.</p>`;
            setTimeout(() => this.endCombat(true), 2000);
            return;
        }
        
        // Tour de l'ennemi après un court délai
        setTimeout(() => this.enemyTurn(), 1000);
    },
    
    // Tour de l'ennemi
    enemyTurn: function() {
        if (!this.active) return;
        
        const char = App.currentCharacter;
        const enemy = this.data.enemy;
        const log = document.getElementById('combat-log');
        
        const result = Rules.attack(enemy, char);
        
        if (result.criticalHit) {
            log.innerHTML += `<p class="damage">💥 L'ennemi vous inflige un coup CRITIQUE de ${result.damage} dégâts !</p>`;
        } else if (result.hit) {
            log.innerHTML += `<p>🩸 ${enemy.name} vous touche et inflige <span class="damage">${result.damage}</span> dégâts.</p>`;
        } else {
            log.innerHTML += `<p>🛡️ Vous esquivez l'attaque de l'ennemi !</p>`;
        }
        
        char.currentHP -= result.damage;
        this.updateHPBars();
        
        // Vérifier défaite
        if (char.currentHP <= 0) {
            log.innerHTML += `<p class="damage">☠️ Vous êtes tombé au combat...</p>`;
            setTimeout(() => this.endCombat(false, true), 2000);
            return;
        }
        
        // Retour au joueur
        setTimeout(() => {
            document.getElementById('combat-actions').style.display = 'flex';
            log.scrollTop = log.scrollHeight;
        }, 800);
    },
    
    // Mettre à jour les barres de vie
    updateHPBars: function() {
        const char = App.currentCharacter;
        const enemy = this.data.enemy;
        
        const charPercent = Math.max(0, (char.currentHP / char.maxHP) * 100);
        const enemyPercent = Math.max(0, (enemy.hp / enemy.maxHP) * 100);
        
        document.getElementById('player-combat-hp-bar').style.width = `${charPercent}%`;
        document.getElementById('player-combat-hp-bar').style.background = charPercent < 30 ? 'var(--accent)' : 'var(--success)';
        document.getElementById('player-combat-hp-text').textContent = `HP: ${char.currentHP}/${char.maxHP}`;
        document.getElementById('player-combat-name').textContent = char.name;
        document.getElementById('player-combat-img').src = Images.getCharacterPortrait(char);
        
        document.getElementById('enemy-hp-bar').style.width = `${enemyPercent}%`;
        document.getElementById('enemy-hp-bar').style.background = enemyPercent < 30 ? 'var(--accent)' : 'var(--warning)';
        document.getElementById('enemy-hp-text').textContent = `HP: ${Math.max(0, enemy.hp)}/${enemy.maxHP}`;
    },
    
    // Fin du combat
    endCombat: function(victory, isDeath = false) {
        this.active = false;
        
        if (victory) {
            const xpGain = this.data.enemy.xp;
            App.currentCharacter.xp += xpGain;
            
            // Loot
            const loot = Grimoire.generateRandomLoot(App.currentCharacter.level, 2);
            App.currentCharacter.inventory.push(...loot);
            
            UI.addStoryEntry('Victoire !', `Vous avez gagné ${xpGain} XP et trouvé des objets.`);
            
            // Vérifier niveau
            const levelUp = Rules.checkLevelUp(App.currentCharacter);
            if (levelUp.leveledUp) {
                UI.addStoryEntry('Niveau Supérieur !', `Vous passez au niveau ${levelUp.newLevel} ! Vos PV augmentent de ${levelUp.hpGain}.`);
            }
            
            Storage.saveCharacter(App.currentCharacter);
        } else if (isDeath) {
            UI.addStoryEntry('Game Over', 'Votre aventure prend fin ici. Vous serez ramené au dernier point de sauvegarde.');
            App.currentCharacter.currentHP = Math.floor(App.currentCharacter.maxHP / 2);
            App.currentCharacter.credits = Math.max(0, App.currentCharacter.credits - 50);
            Storage.saveCharacter(App.currentCharacter);
        }
        
        setTimeout(() => {
            App.showScreen('game');
            App.generateNextEncounter();
        }, 2000);
    }
};
