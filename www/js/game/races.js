const Races = {
    terrien: {
        name: 'Terrien',
        description: 'Humain originaire de la Terre, adaptable et résilient',
        attributes: { force: 0, dexterite: 0, constitution: 0, intelligence: 0, sagesse: 0, charisme: 0 },
        skills: ['survie', 'technologie', 'commerce'],
        traits: ['Adaptable', 'Résilient']
    },
    martien: {
        name: 'Martien',
        description: 'Colons terraformés de Mars, robustes et ingénieux',
        attributes: { force: 1, constitution: 1, intelligence: 1 },
        skills: ['ingenierie', 'survie', 'combat'],
        traits: ['Résistant au froid', 'Ingénieux']
    },
    raelien: {
        name: 'Raëlien',
        description: 'Êtres énergétiques du système Raël, maîtres de la psionique',
        attributes: { intelligence: 2, sagesse: 1, charisme: 1 },
        skills: ['psionique', 'meditation', 'telepathie'],
        traits: ['Télépathie', 'Régénération psionique']
    },
    ptitgris: {
        name: 'Ptitgris',
        description: 'Petits humanoïdes gris, experts en technologie et furtivité',
        attributes: { dexterite: 2, intelligence: 2, force: -1 },
        skills: ['furtivite', 'technologie', 'pilotage'],
        traits: ['Furtivité naturelle', 'Interface technologique']
    }
};

const Classes = {
    ninja: {
        name: 'Ninja Spatial',
        description: "Maître du combat furtif et du corps à corps dans l'espace",
        hitDie: 'd8',
        primaryAttributes: ['agilite', 'force'],
        saves: ['agilite', 'intelligence'],
        skills: ['furtivite', 'acrobaties', 'discretion', 'escalade'],
        equipment: {
            weapons: ['katanas_energetique', 'shurikens'],
            armor: 'armure_legere_ninja',
            items: ['kit_infiltration', 'fumigene']
        },
        abilities: {
            level1: [
                { name: 'Attaque Sournoise', effect: { type: 'damage', value: 15, condition: 'stealth', scaling: 'percent' }, desc: '+15% dégâts en furtivité' },
                { name: 'Furtivité Améliorée', effect: { type: 'stealth', value: 10, scaling: 'percent' }, desc: '+10% chance de disparaître' }
            ],
            level2: [
                { name: 'Marche Silencieuse', effect: { type: 'stealth', value: 20, scaling: 'percent' }, desc: 'Détection ennemie -20%' },
                { name: 'Lame Énergétique', effect: { type: 'damage', value: 10, scaling: 'percent' }, desc: 'Dégâts mêlée +10%' }
            ],
            level3: [
                { name: 'Esquive Instinctive', effect: { type: 'dodge', value: 10, scaling: 'percent' }, desc: "+10% chance d'esquiver" },
                { name: 'Saut Spatial', effect: { type: 'movement', value: 5, scaling: 'flat' }, desc: 'Saut +5m' }
            ],
            level4: [
                { name: 'Ombre Portée', effect: { type: 'teleport', value: 1, scaling: 'flat' }, desc: 'Téléportation courte 1x/tour' },
                { name: 'Détection Pièges', effect: { type: 'perception', value: 15, scaling: 'percent' }, desc: '+15% détection pièges' }
            ],
            level5: [
                { name: 'Marche sur les Murs', effect: { type: 'movement', value: 20, scaling: 'percent' }, desc: 'Vitesse +20% surfaces verticales' },
                { name: 'Camouflage Adaptatif', effect: { type: 'stealth', value: 25, scaling: 'percent' }, desc: "Furtivité +25% dans l'espace" }
            ],
            level6: [
                { name: "Clone d'Ombre", effect: { type: 'summon', value: 1, scaling: 'flat', summonType: 'shadow_clone' }, desc: 'Clone absorbe 1 coup' },
                { name: 'Attaque Éclair', effect: { type: 'extra_attack', value: 1, scaling: 'flat' }, desc: 'Attaque supplémentaire 1x/combat' }
            ],
            level7: [
                { name: 'Invisibilité Temporaire', effect: { type: 'invisibility', value: 2, scaling: 'flat' }, desc: 'Invisibilité 2 tours' },
                { name: 'Marche dans le Vide', effect: { type: 'movement', value: 50, scaling: 'percent' }, desc: 'Vitesse x1.5 dans le vide' }
            ],
            level8: [
                { name: 'Portail Ninja', effect: { type: 'teleport', value: 10, scaling: 'flat' }, desc: 'Téléportation 10m' },
                { name: 'Lame Dimensionnelle', effect: { type: 'damage', value: 25, scaling: 'percent' }, desc: 'Dégâts +25%, ignore boucliers' }
            ],
            level9: [
                { name: 'Maître des Ombres', effect: { type: 'stealth', value: 50, scaling: 'percent' }, desc: 'Furtivité +50% permanente' },
                { name: 'Assassinat Cosmique', effect: { type: 'damage', value: 100, scaling: 'percent', condition: 'stealth' }, desc: 'x2 dégâts depuis furtivité' }
            ],
            level10: [
                { name: 'Maître Assassin', effect: { type: 'crit_chance', value: 25, scaling: 'percent' }, desc: '+25% critique' },
                { name: 'Transcendance Spatiale', effect: { type: 'immunity', value: 1, scaling: 'flat', immunity: 'gravity' }, desc: 'Immunité gravité' }
            ]
        },
        spellcasting: false
    },

    mercenaire: {
        name: 'Mercenaire Blindé',
        description: 'Soldat lourdement armé et blindé',
        hitDie: 'd12',
        primaryAttributes: ['force', 'constitution'],
        saves: ['force', 'constitution'],
        skills: ['athletisme', 'intimidation', 'survie', 'pilote'],
        equipment: {
            weapons: ['fusil_assaut', 'pistolet_lourd', 'couteau_combat'],
            armor: 'armure_lourde_mercenaire',
            items: ['trousse_soins', 'grenades']
        },
        abilities: {
            level1: [
                { name: 'Second Souffle', effect: { type: 'regen', value: 5, scaling: 'percent' }, desc: 'Régénération +5% hors combat' },
                { name: 'Style de Combat', effect: { type: 'damage', value: 8, scaling: 'percent' }, desc: 'Dégâts mêlée +8%' }
            ],
            level2: [
                { name: 'Action Supplémentaire', effect: { type: 'extra_action', value: 1, scaling: 'flat' }, desc: 'Action bonus 1x/combat' },
                { name: 'Résistance Balistique', effect: { type: 'resistance', value: 5, scaling: 'percent', vs: 'projectile' }, desc: '-5% dégâts projectiles' }
            ],
            level3: [
                { name: 'Archétype Mercenaire', effect: { type: 'specialization', value: 15, scaling: 'percent' }, desc: 'Spécialisation +15%' },
                { name: 'Tir de Suppression', effect: { type: 'damage', value: 8, scaling: 'percent' }, desc: 'Dégâts distance +8%' }
            ],
            level4: [
                { name: 'Charge Lourde', effect: { type: 'damage', value: 25, scaling: 'percent', condition: 'charge' }, desc: 'Charge +25% dégâts' },
                { name: 'Blindage Réactif', effect: { type: 'resistance', value: 10, scaling: 'percent' }, desc: 'Résistance +10% tous dégâts' }
            ],
            level5: [
                { name: 'Attaque Multiple', effect: { type: 'multi_target', value: 2, scaling: 'flat' }, desc: 'Attaque 2 cibles' },
                { name: 'Grenade à Fragmentation', effect: { type: 'aoe', value: 20, scaling: 'flat', radius: 3 }, desc: 'Grenade 20 dégâts, rayon 3m' }
            ],
            level6: [
                { name: 'Tourelle Automatique', effect: { type: 'summon', value: 20, scaling: 'flat', summonType: 'turret' }, desc: 'Tourelle 20 dégâts/tour' },
                { name: 'Exosquelette Léger', effect: { type: 'attribute', value: 2, scaling: 'flat', attr: 'force' }, desc: 'Force +2' }
            ],
            level7: [
                { name: 'Bouclier Énergétique', effect: { type: 'shield', value: 60, scaling: 'flat' }, desc: 'Bouclier +60 PV' },
                { name: 'Tir de Barrage', effect: { type: 'aoe', value: 15, scaling: 'flat', radius: 5 }, desc: 'Barrage 15 dégâts, rayon 5m' }
            ],
            level8: [
                { name: 'Mech de Combat', effect: { type: 'summon', value: 200, scaling: 'flat', summonType: 'mech' }, desc: 'Mech 200 PV, 50 dégâts/tour' },
                { name: 'Bombardement Orbital', effect: { type: 'aoe', value: 100, scaling: 'flat', radius: 10 }, desc: 'Bombardement 100 dégâts, rayon 10m' }
            ],
            level9: [
                { name: 'Colosse Blindé', effect: { type: 'hp_max', value: 50, scaling: 'percent' }, desc: 'PV max +50%' },
                { name: 'Tacticien Spatial', effect: { type: 'initiative', value: 10, scaling: 'flat' }, desc: 'Initiative +10' }
            ],
            level10: [
                { name: 'Maître de Guerre', effect: { type: 'damage', value: 30, scaling: 'percent' }, desc: 'Dégâts +30%' },
                { name: 'Forteresse Ambulante', effect: { type: 'resistance', value: 30, scaling: 'percent' }, desc: 'Résistance +30% tous dégâts' }
            ]
        },
        spellcasting: false
    },

    sorcier: {
        name: 'Sorcier Cosmique',
        description: "Maître des énergies mystiques de l'univers",
        hitDie: 'd6',
        primaryAttributes: ['intelligence', 'charisme'],
        saves: ['intelligence', 'sagesse'],
        skills: ['arcane', 'histoire', 'investigation', 'persuasion'],
        equipment: {
            weapons: ['baton_cosmique', 'dague_rituelle'],
            armor: 'robe_sorcier',
            items: ['composantes_sorts', 'grimoire_vide']
        },
        spellSlots: {
            level1: { 1: 2, 2: 3, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4 }
        },
        spells: ['projectile_energetique', 'bouclier_mystique', 'detection_magie', 'teleportation'],
        abilities: {
            level1: [
                { name: 'Lancement de Sorts', effect: { type: 'mana', value: 10, scaling: 'flat' }, desc: 'PM max +10' },
                { name: 'Récupération Arcane', effect: { type: 'mana_regen', value: 2, scaling: 'flat' }, desc: 'Régén PM +2/tour' }
            ],
            level2: [
                { name: 'Origine Sorcière', effect: { type: 'specialization', value: 10, scaling: 'percent' }, desc: 'Bonus origine +10%' },
                { name: 'Contresort', effect: { type: 'counter', value: 1, scaling: 'flat' }, desc: 'Annule sort 1x/combat' }
            ],
            level3: [
                { name: 'Sorts Métamagiques', effect: { type: 'spell_power', value: 15, scaling: 'percent' }, desc: 'Sorts +15% portée/dégâts' },
                { name: 'Télékinésie', effect: { type: 'telekinesis', value: 50, scaling: 'flat' }, desc: 'Télékinésie 50kg' }
            ],
            level4: [
                { name: 'Portail Arcanique', effect: { type: 'teleport', value: 15, scaling: 'flat' }, desc: 'Téléportation 15m' },
                { name: 'Nova Cosmique', effect: { type: 'aoe', value: 30, scaling: 'flat', radius: 5 }, desc: 'Nova 30 dégâts, rayon 5m' }
            ],
            level5: [
                { name: 'Sorts de Niveau 3', effect: { type: 'spell_level', value: 3, scaling: 'flat' }, desc: 'Accès sorts niveau 3' },
                { name: 'Sphère de Protection', effect: { type: 'shield', value: 40, scaling: 'flat' }, desc: 'Bouclier +40 PV' }
            ],
            level6: [
                { name: 'Métamorphose', effect: { type: 'transform', value: 2, scaling: 'flat' }, desc: 'Transforme ennemi 2 tours' },
                { name: "Chaîne d'Éclairs", effect: { type: 'chain', value: 3, scaling: 'flat', damage: 25 }, desc: 'Éclair 25 dégâts, 3 cibles' }
            ],
            level7: [
                { name: 'Téléportation de Groupe', effect: { type: 'teleport', value: 20, scaling: 'flat', group: true }, desc: 'Téléporte groupe 20m' },
                { name: 'Rayon Disjoncteur', effect: { type: 'damage', value: 40, scaling: 'flat' }, desc: 'Rayon 40 dégâts, désactive tech' }
            ],
            level8: [
                { name: 'Distorsion Temporelle', effect: { type: 'time', value: 2, scaling: 'flat' }, desc: 'Ralentit temps 2 tours' },
                { name: 'Supernova', effect: { type: 'aoe', value: 75, scaling: 'flat', radius: 8 }, desc: 'Supernova 75 dégâts, rayon 8m' }
            ],
            level9: [
                { name: 'Trou Noir', effect: { type: 'aoe', value: 100, scaling: 'flat', radius: 6, duration: 5 }, desc: 'Trou noir 100 dégâts/tour, 5 tours' },
                { name: 'Big Bang Contrôlé', effect: { type: 'aoe', value: 200, scaling: 'flat', radius: 12 }, desc: 'Big Bang 200 dégâts, rayon 12m' }
            ],
            level10: [
                { name: 'Maître des Arcanes', effect: { type: 'spell_power', value: 50, scaling: 'percent' }, desc: 'Sorts +50% puissance' },
                { name: 'Création de Mondes', effect: { type: 'dimension', value: 1, scaling: 'flat' }, desc: 'Crée dimension personnelle' }
            ]
        },
        spellcasting: true
    },

    necromancien: {
        name: "Nécromancien de l'Espace",
        description: 'Invoqueur de morts-vivants et créatures alien',
        hitDie: 'd8',
        primaryAttributes: ['sagesse', 'intelligence'],
        saves: ['sagesse', 'constitution'],
        skills: ['necromancie', 'religion', 'medecine', 'dressage'],
        equipment: {
            weapons: ['faucheuse_cosmique', 'tome_necromancie'],
            armor: 'robe_necromancien',
            items: ['composantes_sombres', 'amulette_morts']
        },
        spellSlots: {
            level1: { 1: 2, 2: 3, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4 }
        },
        spells: ['invoquer_mort_vivant', 'toucher_vampirique', 'peur', 'resurrection_sombre'],
        abilities: {
            level1: [
                { name: 'Invoquer Mort-Vivant', effect: { type: 'summon', value: 20, scaling: 'flat', summonType: 'zombie' }, desc: 'Zombi: 20 PV, 5 dégâts' },
                { name: 'Toucher Nécrotique', effect: { type: 'damage', value: 8, scaling: 'flat', heal: 50 }, desc: '1d8 dégâts, soigne 50%' }
            ],
            level2: [
                { name: 'École de Nécromancie', effect: { type: 'spell_power', value: 10, scaling: 'percent' }, desc: 'Sorts nécro +10%' },
                { name: 'Drain de Vie', effect: { type: 'drain', value: 5, scaling: 'flat' }, desc: 'Vole 5 PV' }
            ],
            level3: [
                { name: 'Créature Alien Invoquée', effect: { type: 'summon', value: 30, scaling: 'flat', summonType: 'alien' }, desc: 'Alien: 30 PV, 8 dégâts' },
                { name: 'Aura de Décomposition', effect: { type: 'aura', value: 5, scaling: 'flat', radius: 3 }, desc: 'Aura 5 dégâts/tour, 3m' }
            ],
            level4: [
                { name: 'Zombi Cosmique', effect: { type: 'summon', value: 50, scaling: 'flat', summonType: 'cosmic_zombie' }, desc: 'Zombi spatial: 50 PV, vol, laser 15' },
                { name: 'Lien Spirituel', effect: { type: 'link', value: 10, scaling: 'percent' }, desc: 'Partage 10% PV avec invocation' }
            ],
            level5: [
                { name: 'Armée des Morts', effect: { type: 'summon', value: 3, scaling: 'flat', summonType: 'zombie_army' }, desc: 'Invoque 3 zombis' },
                { name: 'Peste Galactique', effect: { type: 'dot', value: 10, scaling: 'flat', duration: 5 }, desc: 'Maladie 10 dégâts/tour, 5 tours' }
            ],
            level6: [
                { name: 'Golem Nécro-Météorite', effect: { type: 'summon', value: 100, scaling: 'flat', summonType: 'necro_golem' }, desc: 'Golem: 100 PV, 25 dégâts' },
                { name: 'Réanimation Massive', effect: { type: 'summon', value: 3, scaling: 'flat', summonType: 'raised_dead' }, desc: 'Réanime 3 cadavres' }
            ],
            level7: [
                { name: 'Légion des Ombres', effect: { type: 'summon', value: 5, scaling: 'flat', summonType: 'specter_legion' }, desc: '5 spectres: 40 PV, 10 dégâts' },
                { name: 'Vortex Nécrotique', effect: { type: 'aoe', value: 20, scaling: 'flat', radius: 8, duration: 5 }, desc: 'Vortex 20 dégâts/tour, 8m, 5 tours' }
            ],
            level8: [
                { name: 'Reine Alien Nécrotique', effect: { type: 'summon', value: 300, scaling: 'flat', summonType: 'necro_queen' }, desc: 'Reine: 300 PV, 60 dégâts, pond zombis' },
                { name: 'Cataclysme Sombre', effect: { type: 'aoe', value: 200, scaling: 'flat', radius: 15 }, desc: 'Cataclysme 200 dégâts, 15m' }
            ],
            level9: [
                { name: 'Singularité de Mort', effect: { type: 'aoe', value: 100, scaling: 'flat', radius: 6, duration: 8 }, desc: 'Trou noir nécro 100 dégâts/tour, 8 tours' },
                { name: 'Nécropole Spatiale', effect: { type: 'zone', value: 50, scaling: 'percent' }, desc: 'Zone: morts ressuscitent auto, +50% stats' }
            ],
            level10: [
                { name: 'Seigneur des Morts', effect: { type: 'summon', value: 20, scaling: 'flat', summonType: 'undead_army' }, desc: 'Armée: 20 zombis, 5 golems, 1 reine' },
                { name: 'Apocalypse Stellaire', effect: { type: 'aoe', value: 500, scaling: 'flat', radius: 20 }, desc: 'Apocalypse 500 dégâts, 20m' }
            ]
        },
        spellcasting: true,
        minions: {
            maxCount: { 1: 2, 3: 4, 5: 6, 7: 8, 10: 12 }
        }
    }
};

function getClassAbilities(classType, level) {
    const classData = Classes[classType];
    if (!classData || !classData.abilities) return [];
    
    const abilities = [];
    for (let i = 1; i <= level; i++) {
        const key = 'level' + i;
        if (classData.abilities[key]) {
            abilities.push(...classData.abilities[key]);
        }
    }
    return abilities;
}

function getMaxMinions(level) {
    const thresholds = Object.keys(Classes.necromancien.minions.maxCount).map(Number).sort((a,b) => b-a);
    for (const t of thresholds) {
        if (level >= t) return Classes.necromancien.minions.maxCount[t];
    }
    return 2;
}

function createCharacter(name, race, classType, appearance) {
    const raceData = Races[race];
    const classData = Classes[classType];

    const character = {
        id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        race: race,
        class: classType,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        attributePoints: 0,
        skillsUnlocked: {},
        hp: classData.hitDie === 'd12' ? 12 : (classData.hitDie === 'd8' ? 8 : 6),
        maxHp: classData.hitDie === 'd12' ? 12 : (classData.hitDie === 'd8' ? 8 : 6),
        mana: classData.spellcasting ? 10 : 0,
        maxMana: classData.spellcasting ? 10 : 0,
        attributes: {
            force: 10 + (raceData.attributes.force || 0),
            dexterite: 10 + (raceData.attributes.dexterite || 0),
            constitution: 10 + (raceData.attributes.constitution || 0),
            intelligence: 10 + (raceData.attributes.intelligence || 0),
            sagesse: 10 + (raceData.attributes.sagesse || 0),
            charisme: 10 + (raceData.attributes.charisme || 0)
        },
        skills: {},
        equipment: { ...classData.equipment },
        inventory: [],
        spells: classData.spellcasting ? [...classData.spells] : [],
        abilities: getClassAbilities(classType, 1),
        appearance: appearance,
        createdAt: new Date().toISOString()
    };

    classData.skills.forEach(skill => {
        character.skills[skill] = 0;
    });

    return character;
}

function levelUp(character) {
    character.level++;
    character.experience -= character.experienceToNext;
    character.experienceToNext = Math.floor(character.experienceToNext * 1.5);
    character.attributePoints += 2;
    
    const classData = Classes[character.class];
    const hpGain = classData.hitDie === 'd12' ? Math.floor(Math.random() * 12) + 1 : 
                   (classData.hitDie === 'd8' ? Math.floor(Math.random() * 8) + 1 : 
                    Math.floor(Math.random() * 6) + 1);
    character.maxHp += hpGain;
    character.hp += hpGain;
    
    if (classData.spellcasting) {
        character.maxMana += 5;
        character.mana += 5;
    }
    
    character.abilities = getClassAbilities(character.class, character.level);
    
    return character;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Races, Classes, createCharacter, levelUp, getClassAbilities, getMaxMinions };
}
