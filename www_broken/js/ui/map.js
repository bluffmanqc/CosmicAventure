const Map = {
    systems: [
        { id: 'sol', name: 'Système Sol', x: 50, y: 50, type: 'safe', discovered: true },
        { id: 'alpha', name: 'Alpha Centauri', x: 65, y: 40, type: 'hostile', discovered: false },
        { id: 'vega', name: 'Véga', x: 35, y: 30, type: 'trade', discovered: false },
        { id: 'sirius', name: 'Sirius B', x: 70, y: 65, type: 'dungeon', discovered: false },
        { id: 'proxima', name: 'Proxima', x: 55, y: 55, type: 'hostile', discovered: false },
        { id: 'kepler', name: 'Kepler-442b', x: 25, y: 60, type: 'exploration', discovered: false }
    ],

    currentSystem: 'sol',

    render: function() {
        const char = App.currentCharacter;
        const container = document.getElementById('star-map');
        if (!container) return;

        char.discoveredSystems = char.discoveredSystems || ['sol'];

        let html = '<div class="map-container">';
        this.systems.forEach(sys => {
            const discovered = char.discoveredSystems.includes(sys.id);
            const isCurrent = this.currentSystem === sys.id;
            const typeColors = { safe: '#4CAF50', hostile: '#f44336', trade: '#2196F3', dungeon: '#9C27B0', exploration: '#FF9800' };
            const color = discovered ? (typeColors[sys.type] || '#888') : '#333';
            const opacity = discovered ? 1 : 0.3;
            const label = discovered ? sys.name : '???';

            html += `<div class="star-system ${isCurrent ? 'current' : ''}" 
                style="left:${sys.x}%;top:${sys.y}%;opacity:${opacity}"
                onclick="Map.travel('${sys.id}')">
                <div class="star-dot" style="background:${color};box-shadow:0 0 ${isCurrent ? 15 : 8}px ${color}"></div>
                <span class="star-label">${label}</span>
                ${isCurrent ? '<span class="star-here">📍</span>' : ''}
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    travel: function(systemId) {
        const char = App.currentCharacter;
        if (!char) return;
        const target = this.systems.find(s => s.id === systemId);
        if (!target) return;

        if (systemId === this.currentSystem) {
            UI.addStoryEntry('Voyage', 'Vous êtes déjà dans ce système.');
            return;
        }

        const current = this.systems.find(s => s.id === this.currentSystem);
        const dist = Math.sqrt(Math.pow(target.x - current.x, 2) + Math.pow(target.y - current.y, 2));
        const fuelCost = Math.ceil(dist / 3);

        if (!Ship.consumeFuel(fuelCost)) return;

        this.currentSystem = systemId;
        if (!char.discoveredSystems.includes(systemId)) {
            char.discoveredSystems.push(systemId);
            UI.addStoryEntry('Découverte', `Nouveau système découvert : ${target.name} !`);
        }

        const events = {
            safe: 'Zone sécurisée. Rien ne se passe.',
            hostile: 'Des pirates rodent dans le secteur !',
            trade: 'Station commerciale détectée.',
            dungeon: 'Signaux étranges détectés...',
            exploration: 'Planètes inexplorées à visiter.'
        };
        UI.addStoryEntry('Voyage', `Arrivé dans ${target.name}. ${events[target.type] || ''}`);

        if (target.type === 'hostile' && Math.random() < 0.6) {
            const enemy = Rules.generateEnemy(char.level);
            setTimeout(() => Combat.start(enemy), 1500);
        }

        Quests.updateProgress('travel');
        Storage.saveCharacter(char);
        this.render();
    }
};
