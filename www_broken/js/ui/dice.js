const Dice = {
    init: function() {
        this.container = document.getElementById('dice-panel');
        if (!this.container) return;
        this.render();
    },

    render: function() {
        this.container.innerHTML = `
            <div class="dice-panel-header">
                <h3>🎲 Lancer de dés</h3>
            </div>
            <div class="dice-controls">
                <select id="dice-type">
                    <option value="6">D6</option>
                    <option value="20">D20</option>
                    <option value="100">D100</option>
                </select>
                <input type="number" id="dice-count" value="1" min="1" max="10">
                <button id="roll-btn" class="btn-gm">Lancer</button>
            </div>
            <div id="dice-results" class="dice-results"></div>
        `;
        document.getElementById('roll-btn').addEventListener('click', () => this.roll());
    },

    roll: function() {
        const type = parseInt(document.getElementById('dice-type').value);
        const count = parseInt(document.getElementById('dice-count').value);
        const results = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const result = Math.floor(Math.random() * type) + 1;
            results.push(result);
            total += result;
        }
        const resultsDiv = document.getElementById('dice-results');
        resultsDiv.innerHTML = `
            <div class="dice-result-item">
                <span class="dice-values">${results.join(' + ')}</span>
                <span class="dice-total">= ${total}</span>
            </div>
        `;
    },
// ===== Mode Maître de Jeu / Intégration Combat =====
    // Configuration MJ : préparer un jet spécifique
    setConfig: function(diceType, modifier, difficulty, label) {
        this.config = { diceType, modifier, difficulty, label };
        return this.config;
    },

    // Lancer le jet préconfiguré par le MJ
    rollConfigured: function() {
        if (!this.config) {
            alert('Aucun jet configuré par le MJ.');
            return null;
        }
        const result = this.rollRaw(this.config.diceType, this.config.modifier || 0);
        result.success = result.total >= (this.config.difficulty || 10);
        result.label = this.config.label || 'Jet MJ';
        this.displayResult(result);
        return result;
    },

    // Jet brut (sans UI, pour usage interne)
    rollRaw: function(diceType, modifier) {
        const match = diceType.match(/d(\\d+)/);
        if (!match) return { total: 0, rolls: [], modifier: 0, critical: false, fumble: false };
        const sides = parseInt(match[1]);
        const roll = Math.floor(Math.random() * sides) + 1;
        const total = roll + (modifier || 0);
        return {
            total: total,
            rolls: [roll],
            modifier: modifier || 0,
            critical: roll === sides,
            fumble: roll === 1
        };
    },

    // Jet de compétence (ex: chance, persuasion, etc.)
    rollSkill: function(skillName, character) {
        const skillMap = {
            'force': 'strength',
            'dexterite': 'dexterity',
            'agilite': 'agility',
            'constitution': 'constitution',
            'intelligence': 'intelligence',
            'sagesse': 'wisdom',
            'charisme': 'charisma',
            'chance': 'luck'
        };
        const attr = skillMap[skillName.toLowerCase()] || skillName.toLowerCase();
        const modifier = Rules.attributeModifier(character.attributes[attr] || 10);
        const result = this.rollRaw('d20', modifier);
        result.skill = skillName;
        result.success = result.total >= 10; // DC par défaut
        this.displayResult(result);
        return result;
    },

    // Jet de combat complet (attaque)
    rollAttack: function(character, enemy) {
        const modifier = Rules.attributeModifier(character.attributes.strength || 10);
        const result = this.rollRaw('d20', modifier);
        result.type = 'attack';
        result.hit = result.total >= (enemy.armorClass || 10);
        this.displayResult(result);
        return result;
    },

    // Jet d'initiative
    rollInitiative: function(character) {
        const modifier = Rules.attributeModifier(character.attributes.dexterity || character.attributes.agility || 10);
        const result = this.rollRaw('d20', modifier);
        result.type = 'initiative';
        this.displayResult(result);
        return result;
    },

    // Jet de dégâts
    rollDamage: function(diceType, modifier) {
        const result = this.rollRaw(diceType, modifier);
        result.type = 'damage';
        this.displayResult(result);
        return result;
    },

    // Jet de fuite
    rollEscape: function(character, enemyLevel) {
        const modifier = Rules.attributeModifier(character.attributes.agility || 10);
        const fleeDC = 10 + Math.floor(enemyLevel / 2);
        const result = this.rollRaw('d20', modifier);
        result.type = 'escape';
        result.success = result.total >= fleeDC;
        result.difficulty = fleeDC;
        this.displayResult(result);
        return result;
    },

    // Afficher un résultat dans le panneau de dés
    displayResult: function(result) {
        const resultsDiv = document.getElementById('dice-results');
        if (!resultsDiv) return;
        const icon = result.critical ? '🔥' : result.fumble ? '💀' : result.success !== false ? (result.success ? '✅' : '❌') : '🎲';
        const label = result.label || result.skill || result.type || 'Jet';
        const diffText = result.difficulty ? ` (DC ${result.difficulty})` : '';
        const html = `
            <div class="dice-result-item ${result.critical ? 'critical' : ''} ${result.fumble ? 'fumble' : ''}">
                <span class="dice-icon">${icon}</span>
                <span class="dice-label">${label}${diffText}</span>
                <span class="dice-values">${result.rolls.join(' + ')} ${result.modifier ? '+ ' + result.modifier : ''}</span>
                <span class="dice-total">= ${result.total}</span>
                ${result.success !== undefined ? `<span class="dice-success">${result.success ? 'RÉUSSI' : 'ÉCHEC'}</span>` : ''}
            </div>
        `;
        resultsDiv.innerHTML = html + resultsDiv.innerHTML;
    },

    config: null,

};