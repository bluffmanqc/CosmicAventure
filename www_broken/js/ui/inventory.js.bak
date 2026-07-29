const Inventory = {
    selectedItem: null,

    render: function() {
        const char = App.currentCharacter;
        const container = document.getElementById('inventory-content');
        if (!container || !char) return;

        let html = '<div class="inventory-grid">';
        html += '<div class="inv-section"><h3>🎒 Objets</h3>';
        if (!char.inventory || char.inventory.length === 0) {
            html += '<p class="empty">Inventaire vide</p>';
        } else {
            html += '<div class="item-list">';
            char.inventory.forEach((item, index) => {
                const icon = this.getItemIcon(item.category || item.type);
                html += `<div class="item-card" onclick="Inventory.selectItem(${index})">
                    <span class="item-icon">${icon}</span>
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">x${item.quantity || 1}</span>
                </div>`;
            });
            html += '</div>';
        }
        html += '</div>';

        html += '<div class="inv-section"><h3>⚔️ Équipement</h3>';
        if (!char.equipment || char.equipment.length === 0) {
            html += '<p class="empty">Aucun équipement</p>';
        } else {
            html += '<div class="equip-list">';
            char.equipment.forEach((item, index) => {
                const icon = item.type === 'weapon' ? '⚔️' : '🛡️';
                html += `<div class="equip-card">
                    <span class="item-icon">${icon}</span>
                    <span class="item-name">${item.name}</span>
                    <button onclick="Inventory.unequip(${index})" class="btn-small">Retirer</button>
                </div>`;
            });
            html += '</div>';
        }
        html += '</div>';

        html += '<div class="inv-actions" id="inv-actions"></div>';
        html += '</div>';

        container.innerHTML = html;
    },

    getItemIcon: function(category) {
        const icons = { consumable: '🧪', weapon: '⚔️', armor: '🛡️', material: '⚙️', quest: '📦' };
        return icons[category] || '📦';
    },

    selectItem: function(index) {
        const char = App.currentCharacter;
        if (!char.inventory || !char.inventory[index]) return;
        this.selectedItem = { item: char.inventory[index], index: index };
        const actions = document.getElementById('inv-actions');
        const item = char.inventory[index];
        let html = `<h4>${item.name}</h4><p>${item.description || ''}</p><div class="action-row">`;
        if (item.category === 'consumable' || item.type === 'consumable') {
            html += `<button onclick="Inventory.useItem()" class="btn-primary">Utiliser</button>`;
        }
        if (item.category === 'weapon' || item.category === 'armor') {
            html += `<button onclick="Inventory.equipItem()" class="btn-primary">Équiper</button>`;
        }
        html += `<button onclick="Inventory.dropItem()" class="btn-danger">Jeter</button></div>`;
        actions.innerHTML = html;
    },

    useItem: function() {
        const char = App.currentCharacter;
        if (!this.selectedItem) return;
        const item = this.selectedItem.item;
        const idx = this.selectedItem.index;
        if (item.heal) {
            char.currentHP = Math.min(char.maxHP, char.currentHP + item.heal);
            UI.addStoryEntry('Objet utilisé', `${item.name} restaure ${item.heal} PV.`);
        }
        if (item.mana) {
            char.currentMP = Math.min(char.maxMP, char.currentMP + item.mana);
            UI.addStoryEntry('Objet utilisé', `${item.name} restaure ${item.mana} PM.`);
        }
        item.quantity = (item.quantity || 1) - 1;
        if (item.quantity <= 0) char.inventory.splice(idx, 1);
        Storage.saveCharacter(char);
        this.selectedItem = null;
        this.render();
        UI.updateCharacterSheet(char);
    },

    equipItem: function() {
        const char = App.currentCharacter;
        if (!this.selectedItem) return;
        const item = this.selectedItem.item;
        const idx = this.selectedItem.index;
        const slot = item.category === 'weapon' ? 'weapon' : 'armor';
        const existing = char.equipment.find(e => e.type === slot);
        if (existing) {
            char.inventory.push({ ...existing, quantity: 1 });
        }
        char.equipment = char.equipment.filter(e => e.type !== slot);
        char.equipment.push({ type: slot, name: item.name, equipped: true });
        if (item.ac) char.armorClass = 10 + item.ac;
        char.inventory.splice(idx, 1);
        Storage.saveCharacter(char);
        this.selectedItem = null;
        this.render();
        UI.updateCharacterSheet(char);
    },

    unequip: function(index) {
        const char = App.currentCharacter;
        if (!char.equipment || !char.equipment[index]) return;
        const item = char.equipment[index];
        char.inventory.push({ type: item.type, name: item.name, quantity: 1 });
        char.equipment.splice(index, 1);
        if (item.type === 'armor') char.armorClass = 10 + Math.floor((char.attributes.agility - 10) / 2);
        Storage.saveCharacter(char);
        this.render();
        UI.updateCharacterSheet(char);
    },

    dropItem: function() {
        const char = App.currentCharacter;
        if (!this.selectedItem) return;
        const idx = this.selectedItem.index;
        char.inventory.splice(idx, 1);
        this.selectedItem = null;
        Storage.saveCharacter(char);
        this.render();
    }
};
