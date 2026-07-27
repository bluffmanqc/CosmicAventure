// ============================================
// COSMIC AVENTURE - SYSTÈME DE RÈGLES
// Inspiré de D&D 5e et Warhammer Fantasy
// ============================================
const Rules = {
    // Caractéristiques principales (comme D&D)
    attributes: ['force', 'agilite', 'constitution', 'intelligence', 'sagesse', 'charisme'],
    
    // Types de dés
    dice: {
        d4: { min: 1, max: 4 },
        d6: { min: 1, max: 6 },
        d8: { min: 1, max: 8 },
        d10: { min: 1, max: 10 },
        d12: { min: 1, max: 12 },
        d20: { min: 1, max: 20 },
        d100: { min: 1, max: 100 }
    },
    
    // Lancer un dé
    roll: function(diceType, modifier = 0) {
        const dice = this.dice[diceType];
        if (!dice) return 0;
        const roll = Math.floor(Math.random() * (dice.max - dice.min + 1)) + dice.min;
        return {
            raw: roll,
            total: roll + modifier,
            modifier: modifier,
            dice: diceType
        };
    },
    
    // Test de caractéristique (système D&D)
    attributeTest: function(character, attribute, difficulty = 15) {
        const value = character.attributes[attribute] || 10;
        const modifier = Math.floor((value - 10) / 2);
        const roll = this.roll('d20', modifier);
        
        return {
            success: roll.total >= difficulty,
            roll: roll,
            difficulty: difficulty,
            criticalSuccess: roll.raw === 20,
            criticalFail: roll.raw === 1
        };
    },
    
    // Test de compétence (Warhammer - d100)
    skillTest: function(character, skill, difficulty = 50) {
        const skillValue = character.skills[skill] || 0;
        const roll = this.roll('d100');
        
        // Système Warhammer: il faut faire MOINS que la valeur
        const success = roll.total <= skillValue;
        const degree = Math.floor((skillValue - roll.total) / 10);
        
        return {
            success: success,
            roll: roll,
            difficulty: difficulty,
            degreeOfSuccess: degree,
            criticalSuccess: roll.raw <= 10 && success,
            criticalFail: roll.raw >= 90 && !success
        };
    },
    
    // Calcul des PV (D&D)
    calculateHP: function(character) {
        const conMod = Math.floor((character.attributes.constitution - 10) / 2);
        const classHP = {
            'ninja': 8,
            'mercenaire': 12,
            'sorcier': 6,
            'necromancien': 8
        };
        return (classHP[character.class] || 8) + conMod;
    },
    
    // Calcul des PM (Points de Magie)
    calculateMP: function(character) {
        const intMod = Math.floor((character.attributes.intelligence - 10) / 2);
        const wisMod = Math.floor((character.attributes.sagesse - 10) / 2);
        const classMP = {
            'ninja': 0,
            'mercenaire': 0,
            'sorcier': 20,
            'necromancien': 15
        };
        return (classMP[character.class] || 0) + intMod + wisMod;
    },
    
    // Combat - Initiative (D&D)
    initCombat: function(participants) {
        return participants.map(p => {
            const agiMod = Math.floor((p.attributes.agilite - 10) / 2);
            const init = this.roll('d20', agiMod);
            return { ...p, initiative: init.total };
        }).sort((a, b) => b.initiative - a.initiative);
    },
    
    // Attaque (système hybride)
    attack: function(attacker, defender, weapon = null) {
        const attackBonus = Math.floor((attacker.attributes.force - 10) / 2);
        const attackRoll = this.roll('d20', attackBonus);
        
        // AC (Armor Class) du défenseur
        const defenderAC = defender.armorClass || 10;
        
        const hit = attackRoll.total >= defenderAC;
        let damage = 0;
        
        if (hit) {
            if (weapon) {
                damage = this.roll(weapon.damageDice, attackBonus).total;
            } else {
                damage = this.roll('d4', attackBonus).total;
            }
        }
        
        return {
            hit: hit,
            damage: damage,
            attackRoll: attackRoll,
            criticalHit: attackRoll.raw === 20,
            criticalMiss: attackRoll.raw === 1
        };
    },
    
    // Progression de niveau (système Warhammer - plus dur à haut niveau)
    calculateXPNeeded: function(currentLevel) {
        // Courbe exponentielle comme D&D/Warhammer
        const baseXP = 300;
        const multiplier = 1.5;
        return Math.floor(baseXP * Math.pow(multiplier, currentLevel - 1));
    },
    
    // Vérifier montée de niveau
    checkLevelUp: function(character) {
        const xpNeeded = this.calculateXPNeeded(character.level);
        if (character.xp >= xpNeeded && character.level < 100) {
            character.level++;
            character.xp -= xpNeeded;
            
            // Augmentation des PV
            const hpGain = this.roll('d8', Math.floor((character.attributes.constitution - 10) / 2)).total;
            character.maxHP += hpGain;
            character.currentHP = character.maxHP;
            
            // Points de caractéristiques à augmenter
            character.attributePoints = (character.attributePoints || 0) + 2;
            
            return {
                leveledUp: true,
                newLevel: character.level,
                hpGain: hpGain
            };
        }
        return { leveledUp: false };
    },
    
    // Système de sauvegarde (D&D - saving throws)
    savingThrow: function(character, saveType, difficulty = 15) {
        const saveValue = character.saves[saveType] || 0;
        const roll = this.roll('d20', saveValue);
        
        return {
            success: roll.total >= difficulty,
            roll: roll,
            difficulty: difficulty
        };
    }
};
