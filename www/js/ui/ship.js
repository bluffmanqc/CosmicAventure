const Ship = {
    render: function() {
        const char = App.currentCharacter;
        const container = document.getElementById('ship-content');
        if (!container || !char) return;

        char.ship = char.ship || { name: 'Vagabond', cargo: [], cargoMax: 20, speed: 10, fuel: 100, fuelMax: 100 };

        let html = `<div class="ship-panel">
            <div class="ship-info">
                <h3>🚀 ${char.ship.name}</h3>
                <div class="ship-stats">
                    <div class="stat"><span>Vitesse</span><span>${char.ship.speed}</span></div>
                    <div class="stat"><span>Carburant</span><span>${char.ship.fuel}/${char.ship.fuelMax}</span></div>
                    <div class="stat"><span>Capacité</span><span>${char.ship.cargo.length}/${char.ship.cargoMax}</span></div>
                </div>
                <div class="fuel-bar"><div class="fuel-fill" style="width:${(char.ship.fuel/char.ship.fuelMax)*100}%"></div></div>
            </div>
            <div class="cargo-section">
                <h4>📦 Cargo</h4>`;
        if (!char.ship.cargo || char.ship.cargo.length === 0) {
            html += '<p class="empty">Cargo vide</p>';
        } else {
            html += '<div class="cargo-list">';
            char.ship.cargo.forEach((item, idx) => {
                html += `<div class="cargo-item">
                    <span>${item.name}</span>
                    <span>x${item.quantity || 1}</span>
                    <button onclick="Ship.unload(${idx})" class="btn-small">Décharger</button>
                </div>`;
            });
            html += '</div>';
        }
        html += `</div>
            <div class="ship-actions">
                <button onclick="Ship.refuel()" class="btn-primary">⛽ Ravitailler (20 crédits)</button>
                <button onclick="Ship.upgrade()" class="btn-secondary" disabled>🔧 Améliorer (bientôt)</button>
            </div>
        </div>`;
        container.innerHTML = html;
    },

    loadCargo: function(item) {
        const char = App.currentCharacter;
        if (!char || !char.ship) return false;
        if (char.ship.cargo.length >= char.ship.cargoMax) {
            UI.addStoryEntry('Cargo plein', 'Votre vaisseau ne peut plus transporter d\'objets.');
            return false;
        }
        char.ship.cargo.push({ ...item });
        Storage.saveCharacter(char);
        return true;
    },

    unload: function(index) {
        const char = App.currentCharacter;
        if (!char || !char.ship || !char.ship.cargo[index]) return;
        const item = char.ship.cargo[index];
        char.inventory = char.inventory || [];
        const existing = char.inventory.find(i => i.name === item.name);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
        } else {
            char.inventory.push({ ...item });
        }
        char.ship.cargo.splice(index, 1);
        Storage.saveCharacter(char);
        this.render();
        UI.addStoryEntry('Cargo', `${item.name} déchargé dans l'inventaire.`);
    },

    refuel: function() {
        const char = App.currentCharacter;
        if (!char || !char.ship) return;
        if (char.credits < 20) {
            UI.addStoryEntry('Pas assez de crédits', 'Il vous faut 20 crédits pour ravitailler.');
            return;
        }
        if (char.ship.fuel >= char.ship.fuelMax) {
            UI.addStoryEntry('Réservoir plein', 'Votre vaisseau est déjà plein.');
            return;
        }
        char.credits -= 20;
        char.ship.fuel = Math.min(char.ship.fuelMax, char.ship.fuel + 50);
        Storage.saveCharacter(char);
        this.render();
        UI.addStoryEntry('Ravitaillement', 'Votre vaisseau a été ravitaillé.');
    },

    consumeFuel: function(amount) {
        const char = App.currentCharacter;
        if (!char || !char.ship) return false;
        if (char.ship.fuel < amount) {
            UI.addStoryEntry('Carburant insuffisant', 'Vous n\'avez pas assez de carburant pour voyager.');
            return false;
        }
        char.ship.fuel -= amount;
        Storage.saveCharacter(char);
        return true;
    }
};
