const Items = {
    data: {
        // Consommables
        'potion_soin': { name: 'Potion de soin', category: 'consumable', heal: 15, value: 10, description: 'Restaure 15 PV' },
        'potion_mana': { name: 'Potion de mana', category: 'consumable', mana: 10, value: 10, description: 'Restaure 10 PM' },
        'potion_grande': { name: 'Grande potion', category: 'consumable', heal: 35, value: 25, description: 'Restaure 35 PV' },
        'rations': { name: 'Rations spatiales', category: 'consumable', heal: 8, value: 5, description: 'Restaure 8 PV' },
        'stim': { name: 'Stimulant', category: 'consumable', heal: 5, buff: 'agility', buffValue: 2, duration: 3, value: 20, description: '+2 Agilité (3 tours)' },

        // Armes
        'laser_pistol': { name: 'Pistolet laser', category: 'weapon', damage: 'd6', value: 50, description: 'Arme énergétique légère' },
        'plasma_rifle': { name: 'Fusil plasma', category: 'weapon', damage: 'd8', value: 120, description: 'Arme à plasma moyenne' },
        'vibroblade': { name: 'Vibrolame', category: 'weapon', damage: 'd6', value: 40, description: 'Lame vibrante de combat' },
        'railgun': { name: 'Railgun', category: 'weapon', damage: 'd10', value: 200, description: 'Arme lourde à rails magnétiques' },

        // Armures
        'spacesuit': { name: 'Combinaison spatiale', category: 'armor', ac: 2, value: 30, description: 'AC +2' },
        'combat_armor': { name: 'Armure de combat', category: 'armor', ac: 4, value: 80, description: 'AC +4' },
        'power_armor': { name: 'Armure assistée', category: 'armor', ac: 6, value: 150, description: 'AC +6, Force +1' },

        // Objets divers
        'scrap': { name: 'Ferraille', category: 'material', value: 2, description: 'Matière première basique' },
        'circuit': { name: 'Circuit imprimé', category: 'material', value: 8, description: 'Composant électronique' },
        'crystal': { name: 'Cristal énergétique', category: 'material', value: 25, description: 'Source d\'énergie concentrée' },
        'data_chip': { name: 'Puce de données', category: 'quest', value: 0, description: 'Contient des informations' },
        'alien_artifact': { name: 'Artefact alien', category: 'quest', value: 100, description: 'Objet d\'origine inconnue' }
    },

    get: function(key) {
        return this.data[key] ? { ...this.data[key], key: key } : null;
    },

    getByCategory: function(category) {
        return Object.entries(this.data)
            .filter(([_, item]) => item.category === category)
            .map(([key, item]) => ({ ...item, key: key }));
    },

    getRandom: function(level = 1, category = null) {
        const pool = category ? this.getByCategory(category) : Object.entries(this.data).map(([k, v]) => ({ ...v, key: k }));
        if (pool.length === 0) return null;
        const item = pool[Math.floor(Math.random() * pool.length)];
        return { ...item, quantity: 1 };
    },

    generateLoot: function(level, quantity = 1) {
        const loot = [];
        const categories = ['consumable', 'weapon', 'armor', 'material'];
        for (let i = 0; i < quantity; i++) {
            const cat = categories[Math.floor(Math.random() * categories.length)];
            const item = this.getRandom(level, cat);
            if (item) loot.push(item);
        }
        return loot;
    }
};
