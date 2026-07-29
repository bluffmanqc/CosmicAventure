const Combat = {
    active: false,
    enemy: null,
    turn: 0,

    init: function() {
        this.active = false;
        this.enemy = null;
        this.turn = 0;
    },

    start: function(enemy) {
        this.active = true;
        this.enemy = enemy;
        const char = App.currentCharacter;
        const playerInit = Dice.rollRaw('d20', Rules.attributeModifier(char.attributes.dexterity || char.attributes.agility || 10)).total;
        const enemyInit = Dice.rollRaw('d20', Math.floor(this.enemy.level / 2)).total;
        if (enemyInit > playerInit) {
            this.turn = 0;
            UI.addStoryEntry('Combat', `⚔️ ${this.enemy.name} prend l'initiative !`);
            document.getElementById('combat-actions').style.display = 'none';
            setTimeout(() => this.enemyTurn(), 1000);
        } else {
            this.turn = 1;
            UI.addStoryEntry('Combat', `🛡️ Vous prenez l'initiative !`);
        }
        UI.showScreen('combat');
        this.render();
        UI.addStoryEntry('Combat', `Un ${enemy.name} (Niv.${enemy.level}) apparaît !`);
    },

    render: function() {
        const char = App.currentCharacter;
        const container = document.getElementById('combat-screen');
        if (!container) return;
        container.innerHTML = `
            <div class="combat-header">
                <h2>⚔️ Combat — Tour ${this.turn}</h2>
            </div>
            <div class="combat-arena">
                <div class="combat-player">
                    <h3>${char.name}</h3>
                    <div class="hp-bar"><div class="hp-fill" style="width:${(char.currentHP/char.maxHP)*100}%"></div></div>
                    <p>PV: ${char.currentHP}/${char.maxHP} | PM: ${char.currentMP}/${char.maxMP}</p>
                    <p>Niv.${char.level} | CA: ${char.armorClass || 10}</p>
                </div>
                <div class="combat-vs">VS</div>
                <div class="combat-enemy">
                    <h3>${this.enemy.name}</h3>
                    <div class="hp-bar enemy"><div class="hp-fill" style="width:${(this.enemy.hp/this.enemy.maxHP)*100}%"></div></div>
                    <p>PV: ${this.enemy.hp}/${this.enemy.maxHP}</p>
                    <p>Niv.${this.enemy.level} | Type: ${this.enemy.type}</p>
                </div>
            </div>
            <div class="combat-log" id="combat-log"></div>
            <div class="combat-actions" id="combat-actions">
                <button onclick="Combat.playerAction('attack')" class="btn-primary">⚔️ Attaquer</button>
                <button onclick="Combat.playerAction('spell')" class="btn-secondary">✨ Sort</button>
                <button onclick="Combat.playerAction('item')" class="btn-secondary">🎒 Objet</button>
                <button onclick="Combat.playerAction('flee')" class="btn-danger">🏃 Fuir</button>
            </div>
        `;
    },

    playerAction: function(action) {
        if (!this.active) return;
        const char = App.currentCharacter;
        const log = document.getElementById('combat-log');

        if (action === 'attack') {
            const attackRoll = Dice.rollRaw('d20', Rules.attributeModifier(char.attributes.strength));
            const hit = attackRoll.total >= this.enemy.armorClass;
            if (hit) {
                const dmg = Rules.calculateDamage(char, this.enemy, true);
                this.enemy.hp -= dmg;
                log.innerHTML += `<p class="damage">⚔️ Vous touchez et infligez <span class="dmg">${dmg}</span> dégâts !</p>`;
            } else {
                log.innerHTML += `<p class="miss">❌ Vous ratez votre attaque...</p>`;
            }
        } else if (action === 'spell') {
            if (char.currentMP < 3) {
                log.innerHTML += `<p class="miss">💨 Pas assez de PM !</p>`;
                return;
            }
            char.currentMP -= 3;
            const dmg = Dice.rollRaw('d10', Rules.attributeModifier(char.attributes.intelligence)).total;
            this.enemy.hp -= dmg;
            log.innerHTML += `<p class="damage">✨ Sort inflige <span class="dmg">${dmg}</span> dégâts !</p>`;
        } else if (action === 'item') {
            if (!char.inventory || char.inventory.length === 0) {
                log.innerHTML += `<p class="miss">🎒 Inventaire vide !</p>`;
                return;
            }
            const item = char.inventory[0];
            if (item.type === 'consumable' || item.category === 'consumable') {
                const heal = item.heal || 10;
                char.currentHP = Math.min(char.maxHP, char.currentHP + heal);
                item.quantity = (item.quantity || 1) - 1;
                if (item.quantity <= 0) char.inventory.shift();
                log.innerHTML += `<p class="heal">🧪 Vous utilisez ${item.name} et récupérez ${heal} PV !</p>`;
            } else {
                log.innerHTML += `<p>🎒 ${item.name} ne peut pas être utilisé en combat.</p>`;
            }
        } else if (action === 'flee') {
            const escapeRoll = Dice.rollRaw('d20', Rules.attributeModifier(char.attributes.agility));
            const fleeDC = 10 + Math.floor(this.enemy.level / 2);
            if (escapeRoll.total >= fleeDC) {
                log.innerHTML += `<p class="heal">🏃 Vous parvenez à vous enfuir !</p>`;
                setTimeout(() => this.endCombat(false), 1500);
                return;
            } else {
                log.innerHTML += `<p>💨 Vous tentez de fuir mais vous trébuchez...</p>`;
            }
        }

        this.updateHPBars();
        document.getElementById('combat-actions').style.display = 'none';

        if (this.enemy.hp <= 0) {
            log.innerHTML += `<p class="heal">🏆 Victoire ! Vous avez vaincu ${this.enemy.name}.</p>`;
            setTimeout(() => this.endCombat(true), 2000);
            return;
        }

        setTimeout(() => this.enemyTurn(), 1000);
    },

    enemyTurn: function() {
        if (!this.active) return;
        const char = App.currentCharacter;
        const log = document.getElementById('combat-log');

        const attackRoll = Dice.rollRaw('d20', Math.floor(this.enemy.level / 2));
        const hit = attackRoll.total >= (char.armorClass || 10);

        if (hit) {
            const dmg = Rules.calculateEnemyDamage(this.enemy.level);
            char.currentHP -= dmg;
            log.innerHTML += `<p class="damage-enemy">💥 ${this.enemy.name} vous inflige <span class="dmg">${dmg}</span> dégâts !</p>`;
        } else {
            log.innerHTML += `<p class="miss">🛡️ ${this.enemy.name} rate son attaque !</p>`;
        }

        this.updateHPBars();

        if (char.currentHP <= 0) {
            log.innerHTML += `<p class="damage-enemy">💀 Vous êtes vaincu...</p>`;
            setTimeout(() => this.endCombat(false, true), 2000);
            return;
        }

        this.turn++;
        document.getElementById('combat-actions').style.display = 'flex';
        this.render();
    },

    updateHPBars: function() {
        const char = App.currentCharacter;
        const playerBar = document.querySelector('.combat-player .hp-fill');
        const enemyBar = document.querySelector('.combat-enemy .hp-fill');
        if (playerBar) playerBar.style.width = `${Math.max(0, (char.currentHP / char.maxHP) * 100)}%`;
        if (enemyBar) enemyBar.style.width = `${Math.max(0, (this.enemy.hp / this.enemy.maxHP) * 100)}%`;
    },

    endCombat: function(victory, isDeath = false) {
        this.active = false;
        const char = App.currentCharacter;

        if (victory) {
            const xpGain = this.enemy.xpReward;
            char.xp += xpGain;

            const loot = Grimoire.generateRandomLoot ? Grimoire.generateRandomLoot(char.level, 2) : [];
            if (loot.length > 0) {
                char.inventory = char.inventory || [];
                char.inventory.push(...loot);
            }

            UI.addStoryEntry('Victoire !', `Vous avez gagné ${xpGain} XP${loot.length > 0 ? ' et trouvé des objets.' : '.'}`);

            const levelUp = Rules.checkLevelUp(char);
            if (levelUp.leveledUp) {
                UI.addStoryEntry('Niveau Supérieur !', `Vous passez au niveau ${levelUp.newLevel} ! Vos PV augmentent de ${levelUp.hpGain}.`);
            }

            Storage.saveCharacter(char);
        } else if (isDeath) {
            UI.addStoryEntry('Game Over', 'Votre aventure prend fin ici. Vous serez ramené au dernier point de sauvegarde.');
            char.currentHP = Math.floor(char.maxHP / 2);
            char.credits = Math.max(0, (char.credits || 0) - 50);
            Storage.saveCharacter(char);
        }

        setTimeout(() => {
            App.showScreen('game');
            App.generateNextEncounter();
        }, 2000);
    }
};
