// ============================================
// COSMIC AVENTURE - RACES ET CLASSES
// Inspiré de D&D avec races spatiales
// ============================================
const Races = {
    terrien: {
        name: 'Terrien',
        description: 'Humain de la Terre, adaptable et ambitieux',
        attributes: {
            force: 10,
            agilite: 10,
            constitution: 10,
            intelligence: 10,
            sagesse: 10,
            charisme: 10
        },
        bonuses: { anyAttribute: 2 }, // +2 à une caractéristique au choix
        traits: ['Adaptabilité', 'Polyvalence', 'Ambition'],
        startingPlanet: 'Terre',
        languages: ['Terrestre', 'Galactique Commun'],
        speed: 30,
        size: 'medium'
    },
    
    martien: {
        name: 'Martien',
        description: 'Humain rouge de Mars, résistant et déterminé',
        attributes: {
            force: 12,
            agilite: 10,
            constitution: 14,
            intelligence: 10,
            sagesse: 10,
            charisme: 8
        },
        traits: ['Résistance gravitationnelle', 'Vision infrarouge', 'Résistance feu +2'],
        startingPlanet: 'Mars',
        languages: ['Martien', 'Galactique Commun'],
        speed: 25,
        size: 'medium',
        specialAbilities: {
            'lowLightVision': true,
            'fireResistance': 2
        }
    },
    
    raelien: {
        name: 'Raëlien',
        description: 'Être éthéré lumineux, connecté à l\'énergie cosmique',
        attributes: {
            force: 8,
            agilite: 12,
            constitution: 10,
            intelligence: 14,
            sagesse: 14,
            charisme: 12
        },
        traits: ['Luminosité naturelle', 'Télépathie limitée', 'Magie +3'],
        startingPlanet: 'Raël Prime',
        languages: ['Raëlien', 'Galactique Commun', 'Télépathie'],
        speed: 30,
        size: 'medium',
        specialAbilities: {
            'glow': true,
            'telepathy': 30,
            'magicBonus': 3
        }
    },
    
    ptitgris: {
        name: 'Petit Gris',
        description: 'Petit alien gris à grands yeux noirs, mystérieux et intelligent',
        attributes: {
            force: 6,
            agilite: 14,
            constitution: 8,
            intelligence: 16,
            sagesse: 12,
            charisme: 10
        },
        traits: ['Intelligence supérieure', 'Furtivité +2', 'Technologie +3'],
        startingPlanet: 'Zeta Reticuli',
        languages: ['Gris', 'Galactique Commun', 'Binaire'],
        speed: 25,
        size: 'small',
        specialAbilities: {
            'highIntelligence': true,
            'stealthBonus': 2,
            'techBonus': 3
        }
    }
};

const Classes = {
    ninja: {
        name: 'Ninja Spatial',
        description: 'Maître du combat furtif et du corps à corps',
        hitDie: 'd8',
        primaryAttributes: ['agilite', 'force'],
        saves: ['agilite', 'intelligence'],
        skills: ['furtivite', 'acrobaties', 'discrétion', 'escalade'],
        equipment: {
            weapons: ['katanas_energetique', 'shurikens'],
            armor: 'armure_legere_ninja',
            items: ['kit_infiltration', 'fumigene']
        },
        abilities: {
            level1: ['Attaque sournoise', 'Furtivité améliorée'],
            level3: ['Esquive instinctive'],
            level5: ['Marche sur les murs'],
            level7: ['Invisibilité temporaire'],
            level10: ['Maître assassin']
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
            level1: ['Second souffle', 'Style de combat'],
            level2: ['Action supplémentaire'],
            level3: ['Archétype mercenaire'],
            level5: ['Attaque multiple'],
            level10: ['Maître de guerre']
        },
        spellcasting: false
    },
    
    sorcier: {
        name: 'Sorcier Cosmique',
        description: 'Maître des énergies mystiques de l\'univers',
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
            level1: ['Lancement de sorts', 'Récupération arcane'],
            level2: ['Origine sorcière'],
            level3: ['Sorts métamagiques'],
            level5: ['Sorts de niveau 3'],
            level10: ['Maître des arcanes']
        },
        spellcasting: true
    },
    
    necromancien: {
        name: 'Nécromancien de l\'Espace',
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
            level1: ['Invoquer mort-vivant', 'Toucher nécrotique'],
            level2: ['École de nécromancie'],
            level3: ['Créature alien invoquée'],
            level5: ['Armée des morts'],
            level10: ['Seigneur des morts']
        },
        spellcasting: true,
        minions: {
            maxCount: { 1: 2, 3: 4, 5: 6, 7: 8, 10: 12 }
        }
    }
};

// Fonction de création de personnage
function createCharacter(name, race, classType, appearance) {
    const raceData = Races[race];
    const classData = Classes[classType];
    
    const character = {
        id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        race: race,
        class: classType,
        level: 1,
        xp: 0,
        xpNeeded: 300,
        
        // Attributs de base
        attributes: { ...raceData.attributes },
        
        // Points de vie et magie
        maxHP: 0,
        currentHP: 0,
        maxMP: 0,
        currentMP: 0,
        
        // Compétences
        skills: {},
        
        // Sauvegardes
        saves: {},
        
        // Équipement
        equipment: [],
        inventory: [],
        
        // Apparence
        appearance: appearance,
        
        // Position
        location: {
            planet: raceData.startingPlanet,
            system: 'Système Solaire',
            sector: 'Quadrant Alpha'
        },
        
        // Statistiques
        credits: 50,
        reputation: 0,
        
        // Métadonnées
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
    };
    
    // Ajout des points de caractéristiques (15 points à distribuer)
    character.attributePoints = 15;
    
    // Initialisation des compétences de classe
    classData.skills.forEach(skill => {
        character.skills[skill] = 10;
    });
    
    // Initialisation des sauvegardes
    classData.saves.forEach(save => {
        character.saves[save] = 2;
    });
    
    // Calcul HP et MP
    character.maxHP = Rules.calculateHP(character);
    character.currentHP = character.maxHP;
    character.maxMP = Rules.calculateMP(character);
    character.currentMP = character.maxMP;
    
    // Équipement de départ
    if (classData.equipment) {
        character.equipment = [
            { type: 'weapon', name: classData.equipment.weapons[0], equipped: true },
            { type: 'armor', name: classData.equipment.armor, equipped: true }
        ];
        character.inventory = classData.equipment.items.map(item => ({
            type: 'item',
            name: item,
            quantity: 1
        }));
    }
    
    // Calcul de l'Armor Class
    character.armorClass = 10 + Math.floor((raceData.attributes.agilite - 10) / 2);
    
    return character;
}
