const Rules = {
    roll: function(dice, modifier = 0) {
        const match = dice.match(/d(\d+)/);
        if (!match) return { total: 0, rolls: [], modifier: 0 };
        const sides = parseInt(match[1]);
        const roll = Math.floor(Math.random() * sides) + 1;
        const total = roll + modifier;
        return { total: total, rolls: [roll], modifier: modifier, critical: roll === sides, fumble: roll === 1 };
    },

    calculateHP: function(character) {
        const conMod = Math.floor((character.attributes.constitution - 10) / 2);
        const baseHP = character.classData ? (character.classData.hitDie || 8) : 8;
        return Math.max(1, baseHP + conMod + (character.level - 1) * Math.max(1, Math.floor(baseHP / 2) + conMod));
    },

    calculateMP: function(character) {
        const intMod = Math.floor((character.attributes.intelligence - 10) / 2);
        return Math.max(0, 10 + intMod * 2 + (character.level - 1) * 2);
    },

    calculateDamage: function(attacker, defender, isPlayer = true) {
        let damage = 0;
        if (isPlayer) {
            const strMod = Math.floor((attacker.attributes.strength - 10) / 2);
            const weaponDmg = attacker.equipment && attacker.equipment.find(e => e.type === 'weapon') ? 
                this.roll('d8', strMod).total : this.roll('d4', strMod).total;
            damage = weaponDmg;
        } else {
            damage = this.roll('d6', Math.floor(attacker.level / 2)).total;
        }
        return Math.max(1, damage);
    },

    calculateEnemyHP: function(level) {
        return 8 + (level * 4) + this.roll('d6', 0).total;
    },

    calculateEnemyDamage: function(level) {
        const base = 2 + Math.floor(level / 2);
        const roll = this.roll('d4', 0).total;
        return Math.max(1, base + roll - 2);
    },

    calculateXP: function(enemyLevel, playerLevel) {
        const diff = enemyLevel - playerLevel;
        let baseXP = 10 + (enemyLevel * 5);
        if (diff >= 3) baseXP *= 2;
        else if (diff >= 1) baseXP *= 1.5;
        else if (diff <= -3) baseXP = Math.max(1, Math.floor(baseXP * 0.25));
        else if (diff <= -1) baseXP = Math.max(1, Math.floor(baseXP * 0.5));
        return Math.floor(baseXP);
    },

    xpNeeded: function(level) {
        return Math.floor(50 * Math.pow(level, 1.5));
    },

    checkLevelUp: function(character) {
        const xpNeeded = this.xpNeeded(character.level);
        if (character.xp >= xpNeeded) {
            character.xp -= xpNeeded;
            character.level += 1;
            const conMod = Math.floor((character.attributes.constitution - 10) / 2);
            const hpGain = this.roll('d8', conMod).total;
            character.maxHP += Math.max(1, hpGain);
            character.currentHP = character.maxHP;
            character.maxMP = this.calculateMP(character);
            character.currentMP = character.maxMP;
            character.attributePoints = (character.attributePoints || 0) + 2;
            if (character.skills) {
                Object.keys(character.skills).forEach(skill => {
                    character.skills[skill] += 2;
                });
            }
            return { leveledUp: true, newLevel: character.level, hpGain: hpGain };
        }
        return { leveledUp: false };
    },

    attributeModifier: function(value) {
        return Math.floor((value - 10) / 2);
    },

    savingThrow: function(character, saveType, difficulty = 15) {
        const saveValue = character.saves[saveType] || 0;
        const roll = this.roll('d20', saveValue);
        return { success: roll.total >= difficulty, roll: roll, difficulty: difficulty };
    },

    generateEnemy: function(playerLevel) {
        const enemies = [
            { name: 'Pirate de l\'espace', type: 'humanoid' },
            { name: 'Drones de sécurité', type: 'construct' },
            { name: 'Alien sauvage', type: 'beast' },
            { name: 'Mercenaire cyborg', type: 'cyborg' },
            { name: 'Voleur stellaire', type: 'humanoid' },
            { name: 'Gardien de ruines', type: 'construct' }
        ];
        const template = enemies[Math.floor(Math.random() * enemies.length)];
        const level = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);
        const hp = this.calculateEnemyHP(level);
        const damage = this.calculateEnemyDamage(level);
        return {
            name: template.name,
            type: template.type,
            level: level,
            hp: hp,
            maxHP: hp,
            damage: damage,
            armorClass: 10 + Math.floor(level / 2),
            xpReward: this.calculateXP(level, playerLevel)
        };
    }
};
