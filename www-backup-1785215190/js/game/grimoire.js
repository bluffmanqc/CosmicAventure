// ============================================
// COSMIC AVENTURE - GRIMOIRE UNIVERSEL
// Bestiaire, Items, Sorts, Véhicules
// ============================================
const Grimoire = {
    // Bestiaire - Ennemis et Boss
    enemies: {
        // Ennemis communs
        rat_geant: {
            name: 'Rat Géant Mutant',
            type: 'beast',
            level: 1,
            hp: 15,
            ac: 11,
            speed: 30,
            attributes: { force: 12, agilite: 14, constitution: 13 },
            attacks: [{ name: 'Morsure', damage: '2d4+1' }],
            xp: 25,
            loot: ['viande_rat', 'fourrure']
        },
        
        bandit_spatial: {
            name: 'Bandit Spatial',
            type: 'humanoid',
            level: 2,
            hp: 30,
            ac: 13,
            speed: 30,
            attributes: { force: 14, agilite: 13, constitution: 14 },
            attacks: [
                { name: 'Pistolet laser', damage: '2d6+2', range: 60 },
                { name: 'Couteau', damage: '1d4+2' }
            ],
            xp: 50,
            loot: ['credits', 'pistolet_laser', 'ration']
        },
        
        alien_predator: {
            name: 'Alien Prédateur',
            type: 'alien',
            level: 5,
            hp: 65,
            ac: 15,
            speed: 35,
            attributes: { force: 18, agilite: 16, constitution: 16 },
            specialAbilities: ['invisibilite', 'vision_thermique'],
            attacks: [
                { name: 'Griffes', damage: '2d8+4' },
                { name: 'Lance plasma', damage: '3d8+2', range: 80 }
            ],
            xp: 200,
            loot: ['trophee_alien', 'technologie_avancee']
        },
        
        // Boss
        seigneur_dragon_cosmique: {
            name: 'Seigneur Dragon Cosmique',
            type: 'dragon',
            isBoss: true,
            level: 15,
            hp: 350,
            ac: 20,
            speed: 40,
            flySpeed: 80,
            attributes: { force: 26, agilite: 14, constitution: 24, intelligence: 18, sagesse: 16, charisme: 22 },
            specialAbilities: [
                'souffle_cosmique',
                'regeneration',
                'aura_terreur',
                'legendaire_actions'
            ],
            attacks: [
                { name: 'Morsure', damage: '4d10+8' },
                { name: 'Griffes', damage: '3d8+8', multiattack: 2 },
                { name: 'Souffle cosmique', damage: '12d10', recharge: 6, area: 'cone_60ft' }
            ],
            legendaryActions: 3,
            xp: 5000,
            loot: [
                'ecaille_dragon',
                'coeur_cosmique',
                'tresor_ancien',
                'artefact_legendaire'
            ]
        },
        
        mere_reine_insectoide: {
            name: 'Mère Reine Insectoïde',
            type: 'aberration',
            isBoss: true,
            level: 12,
            hp: 280,
            ac: 18,
            speed: 20,
            attributes: { force: 22, agilite: 10, constitution: 24, intelligence: 16, sagesse: 14, charisme: 18 },
            specialAbilities: [
                'invoquer_serviteurs',
                'toile_cosmique',
                'regeneration_rapide'
            ],
            attacks: [
                { name: 'Mandibules', damage: '3d10+6' },
                { name: 'Acide', damage: '4d8+4', recharge: 5 }
            ],
            lairActions: true,
            xp: 3500,
            loot: ['soie_precieuse', 'oeuf_royal', 'venin_rares']
        }
    },
    
    // Items et Équipement
    items: {
        // Armes
        katanas_energetique: {
            name: 'Katana Énergétique',
            type: 'weapon',
            category: 'arme_mele',
            damage: '2d6+2',
            damageType: 'energie',
            weight: 3,
            value: 500,
            properties: ['finesse', 'deux_mains'],
            rarity: 'rare'
        },
        
        fusil_assaut: {
            name: 'Fusil d\'Assaut Plasma',
            type: 'weapon',
            category: 'arme_distance',
            damage: '2d8+1',
            damageType: 'plasma',
            range: { normal: 80, long: 240 },
            weight: 8,
            value: 800,
            properties: ['lourd', 'deux_mains', 'rechargement'],
            rarity: 'uncommon'
        },
        
        baton_cosmique: {
            name: 'Bâton Cosmique',
            type: 'weapon',
            category: 'focus_arcanique',
            damage: '1d6',
            damageType: 'contondant',
            weight: 4,
            value: 300,
            properties: ['versatile', 'focus'],
            rarity: 'rare',
            magicBonus: 2
        },
        
        // Armures
        armure_legere_ninja: {
            name: 'Armure Légère Ninja',
            type: 'armor',
            category: 'armure_legere',
            ac: 14,
            dexModifier: true,
            weight: 10,
            value: 400,
            stealth: 'advantage',
            rarity: 'uncommon'
        },
        
        armure_lourde_mercenaire: {
            name: 'Armure Lourde Mercenaire',
            type: 'armor',
            category: 'armure_lourde',
            ac: 18,
            dexModifier: false,
            weight: 40,
            value: 1200,
            stealth: 'disadvantage',
            rarity: 'rare'
        },
        
        robe_sorcier: {
            name: 'Robe de Sorcier Cosmique',
            type: 'armor',
            category: 'armure_speciale',
            ac: 12,
            dexModifier: true,
            weight: 4,
            value: 350,
            properties: ['spellcasting_focus'],
            rarity: 'uncommon'
        },
        
        // Accessoires
        amulette_protection: {
            name: 'Amulette de Protection',
            type: 'accessory',
            category: 'collier',
            ac: 1,
            saves: 1,
            weight: 0.5,
            value: 1000,
            rarity: 'rare'
        },
        
        bague_force: {
            name: 'Bague de Force',
            type: 'accessory',
            category: 'bague',
            attributes: { force: 2 },
            weight: 0.1,
            value: 800,
            rarity: 'uncommon'
        },
        
        // Matériaux
        ecaille_dragon: {
            name: 'Écaille de Dragon Cosmique',
            type: 'material',
            category: 'crafting',
            weight: 2,
            value: 500,
            rarity: 'legendary',
            usedFor: ['armure_dragon', 'bouclier_cosmique']
        },
        
        // Consommables
        potion_soins: {
            name: 'Potion de Soins',
            type: 'consumable',
            category: 'potion',
            effect: { heal: '2d4+2' },
            weight: 0.5,
            value: 50,
            rarity: 'common'
        },
        
        ration: {
            name: 'Ration Spatiale',
            type: 'consumable',
            category: 'nourriture',
            effect: { nutrition: 1 },
            weight: 1,
            value: 5,
            rarity: 'common'
        }
    },
    
    // Véhicules et Vaisseaux
    vehicles: {
        // Montures terrestres
        cheval_cybernetique: {
            name: 'Cheval Cybernétique',
            type: 'mount',
            category: 'terrestrial',
            speed: 60,
            hp: 50,
            ac: 13,
            capacity: 1,
            value: 2000,
            rarity: 'uncommon'
        },
        
        // Vaisseaux spatiaux
        chasseur_leger: {
            name: 'Chasseur Léger',
            type: 'spaceship',
            category: 'fighter',
            speed: 100,
            hp: 100,
            ac: 15,
            crew: { min: 1, max: 2 },
            cargo: 100,
            weapons: ['laser_double', 'missiles'],
            value: 50000,
            rarity: 'rare'
        },
        
        cargo_moyen: {
            name: 'Cargo Intergalactique Moyen',
            type: 'spaceship',
            category: 'freighter',
            speed: 60,
            hp: 200,
            ac: 14,
            crew: { min: 2, max: 6 },
            cargo: 1000,
            weapons: ['tourelle_defensive'],
            value: 150000,
            rarity: 'epic'
        },
        
        vaisseau_amiral: {
            name: 'Vaisseau Amiral',
            type: 'spaceship',
            category: 'capital',
            speed: 50,
            hp: 500,
            ac: 16,
            crew: { min: 10, max: 50 },
            cargo: 5000,
            weapons: ['canons_lourds', 'lance_missiles', 'boucliers'],
            value: 1000000,
            rarity: 'legendary'
        }
    },
    
    // Sorts
    spells: {
        projectile_energetique: {
            name: 'Projectile Énergétique',
            level: 1,
            school: 'evocation',
            castingTime: '1 action',
            range: 120,
            components: ['V', 'S'],
            duration: 'instantanée',
            damage: '1d10 force',
            description: 'Vous lancez un projectile d\'énergie pure'
        },
        
        bouclier_mystique: {
            name: 'Bouclier Mystique',
            level: 1,
            school: 'abjuration',
            castingTime: '1 réaction',
            range: 'self',
            components: ['V', 'S'],
            duration: '1 round',
            effect: 'ac +5',
            description: 'Un bouclier invisible vous protège'
        },
        
        invoquer_mort_vivant: {
            name: 'Invoquer Mort-Vivant',
            level: 2,
            school: 'necromancie',
            castingTime: '1 minute',
            range: 30,
            components: ['V', 'S', 'M'],
            duration: '1 heure',
            effect: 'summon undead',
            description: 'Vous invoquez un mort-vivant pour vous servir'
        },
        
        teleportation: {
            name: 'Téléportation',
            level: 3,
            school: 'conjuration',
            castingTime: '1 action',
            range: 500,
            components: ['V'],
            duration: 'instantanée',
            effect: 'teleport',
            description: 'Vous vous téléportez instantanément'
        }
    },
    
    // Planètes et Lieux
    locations: {
        terre: {
            name: 'Terre',
            type: 'planet',
            system: 'Système Solaire',
            description: 'Berceau de l\'humanité',
            gravity: 1,
            atmosphere: 'respirable',
            population: '10 milliards',
            cities: ['Neo-Paris', 'Tokyo Prime', 'New York Orbitale']
        },
        
        mars: {
            name: 'Mars',
            type: 'planet',
            system: 'Système Solaire',
            description: 'Planète rouge colonisée',
            gravity: 0.38,
            atmosphere: 'dome',
            population: '2 milliards',
            cities: ['Olympus City', 'Valles Marineris Base']
        },
        
        rael_prime: {
            name: 'Raël Prime',
            type: 'planet',
            system: 'Système Andromède',
            description: 'Monde des êtres lumineux',
            gravity: 0.9,
            atmosphere: 'respirable',
            population: '500 millions',
            cities: ['Cité de Lumière', 'Temple Cosmique']
        }
    },
    
    // Fonctions de recherche
    search: function(query, category = null) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        const searchIn = (obj, type) => {
            Object.keys(obj).forEach(key => {
                const item = obj[key];
                if (item.name.toLowerCase().includes(searchTerm)) {
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
    
    // Générer un item aléatoire selon le niveau
    generateRandomLoot: function(level, quantity = 1) {
        const lootTable = [];
        const itemKeys = Object.keys(this.items);
        
        for (let i = 0; i < quantity; i++) {
            const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
            const item = { ...this.items[randomKey] };
            item.quantity = 1;
            lootTable.push(item);
        }
        
        return lootTable;
    }
};
