const Craft = {
    recipes: [
        { id: 'potion_soin', name: 'Potion de soin', ingredients: { scrap: 2, circuit: 1 }, result: 'potion_soin', resultQty: 1 },
        { id: 'potion_mana', name: 'Potion de mana', ingredients: { crystal: 1, circuit: 1 }, result: 'potion_mana', resultQty: 1 },
        { id: 'potion_grande', name: 'Grande potion', ingredients: { potion_soin: 2, crystal: 1 }, result: 'potion_grande', resultQty: 1 },
        { id: 'laser_pistol', name: 'Pistolet laser', ingredients: { scrap: 5, circuit: 3, crystal: 1 }, result: 'laser_pistol', resultQty: 1 },
        { id: 'combat_armor', name: 'Armure de combat', ingredients: { scrap: 8, circuit: 2 }, result: 'combat_armor', resultQty: 1 }
    ],

    canCraft: function(recipeId, inventory) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) return false;
        const invMap = {};
        inventory.forEach(item => { invMap[item.key || item.name] = (invMap[item.key || item.name] || 0) + (item.quantity || 1); });
        return Object.entries(recipe.ingredients).every(([ing, qty]) => (invMap[ing] || 0) >= qty);
    },

    craft: function(recipeId, inventory) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe || !this.canCraft(recipeId, inventory)) return false;
        Object.entries(recipe.ingredients).forEach(([ing, qty]) => {
            for (let i = 0; i < qty; i++) {
                const idx = inventory.findIndex(item => (item.key || item.name) === ing);
                if (idx >= 0) {
                    inventory[idx].quantity = (inventory[idx].quantity || 1) - 1;
                    if (inventory[idx].quantity <= 0) inventory.splice(idx, 1);
                }
            }
        });
        const resultItem = Items.get(recipe.result);
        if (resultItem) {
            const existing = inventory.find(item => (item.key || item.name) === recipe.result);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + recipe.resultQty;
            } else {
                inventory.push({ ...resultItem, quantity: recipe.resultQty });
            }
        }
        return true;
    },

    getAvailable: function(inventory) {
        return this.recipes.map(r => ({ ...r, canCraft: this.canCraft(r.id, inventory) }));
    }
};
