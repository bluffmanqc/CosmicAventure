const Grimoire = {
    enemies: {},
    items: {},
    vehicles: {},
    spells: {},
    locations: {},

    search: function(query, category) {
        const results = [];
        const searchIn = function(obj, type) {
            Object.entries(obj).forEach(([key, item]) => {
                if (item.name && item.name.toLowerCase().includes(query.toLowerCase())) {
                    results.push({ ...item, category: type, key: key });
                }
            });
        };
        if (!category || category === 'enemies') searchIn(this.enemies, 'enemy');
        if (!category || category === 'items') searchIn(this.items, 'item');
        if (!category || category === 'vehicles') searchIn(this.vehicles, 'vehicle');
        if (!category || category === 'spells') searchIn(this.spells, 'spell');
        if (!category || category === 'locations') searchIn(this.locations, 'location');
        return results;
    },

    generateRandomLoot: function(level, quantity) {
        return Items.generateLoot ? Items.generateLoot(level, quantity) : [];
    }
};
