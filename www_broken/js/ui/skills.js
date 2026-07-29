const Skills = {
    classTrees: {
        ninja: {
            ombre: [
                { id: 'ninja_attaque_sournoise', name: 'Attaque Sournoise', max: 5, desc: 'Dégâts +15% par rang en furtivité. Rang 5: critique garanti.', cost: 1, prereq: null },
                { id: 'ninja_furtivite', name: 'Furtivité Améliorée', max: 5, desc: 'Chance de disparaître +10% par rang. Rang 5: invisibilité permanente hors combat.', cost: 1, prereq: null },
                { id: 'ninja_marche_silencieuse', name: 'Marche Silencieuse', max: 3, desc: 'Détection ennemie -20% par rang. Rang 3: pas de bruit même en course.', cost: 1, prereq: 'ninja_furtivite' },
                { id: 'ninja_ombre_portee', name: 'Ombre Portée', max: 3, desc: 'Téléportation courte 1x par rang/tour. Rang 3: 3 téléportations.', cost: 2, prereq: 'ninja_marche_silencieuse' },
                { id: 'ninja_clone', name: "Clone d'Ombre", max: 3, desc: "Clone absorbe 1 coup par rang. Rang 3: clone attaque (50% dégâts).", cost: 3, prereq: 'ninja_ombre_portee' },
                { id: 'ninja_invisibilite', name: 'Invisibilité Temporaire', max: 3, desc: "Durée 2 tours +1 par rang. Rang 3: attaque depuis l'invisibilité = x3 dégâts.", cost: 3, prereq: 'ninja_clone' },
                { id: 'ninja_dimension_parallele', name: 'Dimension Parallèle', max: 1, desc: 'Immunité totale 1 tour. Recharge 5 tours.', cost: 5, prereq: 'ninja_invisibilite' },
                { id: 'ninja_maitre_ombre', name: 'Maître des Ombres', max: 1, desc: 'Toutes les compétences ombre coûtent -50%. Furtivité permanente.', cost: 8, prereq: 'ninja_dimension_parallele' }
            ],
            lame: [
                { id: 'ninja_lame_energetique', name: 'Lame Énergétique', max: 5, desc: 'Dégâts mêlée +10% par rang. Rang 5: ignore 50% armure.', cost: 1, prereq: null },
                { id: 'ninja_attaque_eclair', name: 'Attaque Éclair', max: 3, desc: 'Attaque supplémentaire 1x par rang/combat. Rang 3: 3 attaques bonus.', cost: 2, prereq: 'ninja_lame_energetique' },
                { id: 'ninja_shuriken', name: 'Shuriken Cosmique', max: 5, desc: 'Portée +2m par rang. Dégâts +20% par rang. Rang 5: ricochet sur 3 cibles.', cost: 1, prereq: 'ninja_lame_energetique' },
                { id: 'ninja_lame_dimensionnelle', name: 'Lame Dimensionnelle', max: 3, desc: 'Portée mêlée +1m par rang. Rang 3: coupe à travers les boucliers.', cost: 3, prereq: 'ninja_attaque_eclair' },
                { id: 'ninja_frappe_trou_noir', name: 'Frappe du Trou Noir', max: 1, desc: 'Attaque unique: 500% dégâts + aspiration ennemi. Recharge 10 tours.', cost: 5, prereq: 'ninja_lame_dimensionnelle' },
                { id: 'ninja_lame_neant', name: 'Lame du Néant', max: 1, desc: "Dégâts +100% permanents. Chaque coup a 10% chance d'effacer l'ennemi.", cost: 8, prereq: 'ninja_frappe_trou_noir' }
            ],
            spatial: [
                { id: 'ninja_saut_spatial', name: 'Saut Spatial', max: 3, desc: 'Saut +5m par rang. Rang 3: traverse les murs.', cost: 1, prereq: null },
                { id: 'ninja_marche_murs', name: 'Marche sur les Murs', max: 3, desc: 'Vitesse +20% sur surfaces verticales par rang. Rang 3: course sur plafond.', cost: 1, prereq: 'ninja_saut_spatial' },
                { id: 'ninja_portail', name: 'Portail Ninja', max: 2, desc: 'Téléportation 10m +5m par rang. Rang 2: portail persiste 3 tours (alliés).', cost: 3, prereq: 'ninja_marche_murs' },
                { id: 'ninja_marche_etoiles', name: 'Marche sur les Étoiles', max: 1, desc: 'Vol spatial limité. Vitesse x3 dans le vide.', cost: 5, prereq: 'ninja_portail' },
                { id: 'ninja_transcendance', name: 'Transcendance Spatiale', max: 1, desc: 'Immunité gravité. Déplacement instantané illimité hors combat.', cost: 8, prereq: 'ninja_marche_etoiles' }
            ]
        },
        mercenaire: {
            survie: [
                { id: 'merc_second_souffle', name: 'Second Souffle', max: 5, desc: 'Régénération PV +5% par rang hors combat. Rang 5: +1 PV/tour en combat.', cost: 1, prereq: null },
                { id: 'merc_resistance', name: 'Résistance Balistique', max: 5, desc: 'Réduction dégâts projectiles +5% par rang. Rang 5: immunisé balles.', cost: 1, prereq: null },
                { id: 'merc_charge', name: 'Charge Lourde', max: 3, desc: 'Charge: dégâts +25% par rang. Rang 3: étourdit 2 tours.', cost: 2, prereq: 'merc_second_souffle' },
                { id: 'merc_bouclier_energie', name: 'Bouclier Énergétique', max: 3, desc: 'Bouclier PV +20 par rang. Rang 3: bouclier régénère 5/tour.', cost: 2, prereq: 'merc_resistance' },
                { id: 'merc_exosquelette', name: 'Exosquelette Léger', max: 3, desc: 'Force +2 par rang. Vitesse -5% par rang. Rang 3: +6 FOR, vitesse normale.', cost: 3, prereq: 'merc_charge' },
                { id: 'merc_colosse', name: 'Colosse Blindé', max: 1, desc: 'PV max +50%. Résistance tous dégâts +30%.', cost: 5, prereq: 'merc_exosquelette' },
                { id: 'merc_immunite', name: 'Immunité Absolue', max: 1, desc: 'Immunisé poison, feu, froid, électricité. Résistance 50% magie.', cost: 8, prereq: 'merc_colosse' }
            ],
            armement: [
                { id: 'merc_style_combat', name: 'Style de Combat', max: 5, desc: 'Dégâts mêlée +8% par rang. Rang 5: attaque double.', cost: 1, prereq: null },
                { id: 'merc_tir_suppression', name: 'Tir de Suppression', max: 5, desc: 'Dégâts distance +8% par rang. Rang 5: ignore couvert.', cost: 1, prereq: null },
                { id: 'merc_attaque_multiple', name: 'Attaque Multiple', max: 3, desc: 'Attaque +1 cible par rang. Rang 3: 4 cibles.', cost: 2, prereq: 'merc_style_combat' },
                { id: 'merc_grenade', name: 'Grenade à Fragmentation', max: 3, desc: 'Rayon explosion +2m par rang. Dégâts +30% par rang.', cost: 2, prereq: 'merc_tir_suppression' },
                { id: 'merc_tourelle', name: 'Tourelle Automatique', max: 2, desc: 'Tourelle: 20 dégâts/tour. Rang 2: 2 tourelles.', cost: 3, prereq: 'merc_attaque_multiple' },
                { id: 'merc_mech', name: 'Mech de Combat', max: 1, desc: 'Invocation mech: 200 PV, 50 dégâts/tour. Dure 10 tours.', cost: 5, prereq: 'merc_tourelle' },
                { id: 'merc_bombardement', name: 'Bombardement Orbital', max: 1, desc: 'Zone 20m: 500 dégâts. Recharge 15 tours.', cost: 8, prereq: 'merc_mech' }
            ],
            commandement: [
                { id: 'merc_archetype', name: 'Archétype Mercenaire', max: 3, desc: 'Choix spécialisation: Tank/DPS/Support. Bonus +15% par rang.', cost: 1, prereq: null },
                { id: 'merc_tacticien', name: 'Tacticien Spatial', max: 3, desc: 'Initiative +5 par rang. Rang 3: allies agissent en premier.', cost: 2, prereq: 'merc_archetype' },
                { id: 'merc_stratege', name: 'Stratège Galactique', max: 2, desc: 'Dégâts allies +10% par rang. Rang 2: +25% dégâts groupe.', cost: 3, prereq: 'merc_tacticien' },
                { id: 'merc_general', name: "Général de l'Espace", max: 1, desc: 'Invoque 3 mercenaires alliés (100 PV, 30 dégâts). Recharge 20 tours.', cost: 5, prereq: 'merc_stratege' },
                { id: 'merc_maitre_guerre', name: 'Maître de Guerre', max: 1, desc: 'Tous les alliés: PV +30%, dégâts +30%. Permanent.', cost: 8, prereq: 'merc_general' }
            ]
        },
        sorcier: {
            arcanes: [
                { id: 'sorc_lancement', name: 'Lancement de Sorts', max: 5, desc: 'PM max +10 par rang. Coût sorts -5% par rang.', cost: 1, prereq: null },
                { id: 'sorc_regen', name: 'Récupération Arcanes', max: 5, desc: 'Régén PM +2/tour par rang. Rang 5: +10 PM/tour.', cost: 1, prereq: null },
                { id: 'sorc_contresort', name: 'Contresort', max: 3, desc: 'Annule sort ennemi 1x par rang/combat. Rang 3: renvoie sort.', cost: 2, prereq: 'sorc_lancement' },
                { id: 'sorc_metamagie', name: 'Sorts Métamagiques', max: 3, desc: 'Sorts: portée +2m, dégâts +15% par rang.', cost: 2, prereq: 'sorc_regen' },
                { id: 'sorc_portail', name: 'Portail Arcanique', max: 2, desc: 'Téléportation 15m. Rang 2: portail allié persiste.', cost: 3, prereq: 'sorc_contresort' },
                { id: 'sorc_arret_temps', name: 'Arrêt du Temps', max: 1, desc: "Tout s'arrête sauf vous 3 tours. Recharge 20 tours.", cost: 5, prereq: 'sorc_portail' },
                { id: 'sorc_maitre_arcane', name: 'Maître des Arcanes', max: 1, desc: 'PM illimités. Tous les sorts coûtent 1 PM.', cost: 8, prereq: 'sorc_arret_temps' }
            ],
            destruction: [
                { id: 'sorc_projectile', name: 'Projectile Énergétique', max: 5, desc: 'Dégâts +15% par rang. Rang 5: ricochet 3 cibles.', cost: 1, prereq: null },
                { id: 'sorc_nova', name: 'Nova Cosmique', max: 3, desc: 'Explosion 5m: 30 dégâts +15 par rang. Rang 3: 75 dégâts.', cost: 2, prereq: 'sorc_projectile' },
                { id: 'sorc_chain_eclair', name: "Chaîne d'Éclairs", max: 3, desc: 'Bond +1 cible par rang. Dégâts -20% par bond. Rang 3: 4 cibles.', cost: 2, prereq: 'sorc_projectile' },
                { id: 'sorc_supernova', name: 'Supernova', max: 2, desc: 'Zone 10m: 100 dégâts +50 par rang. Rang 2: brûlure 5 tours.', cost: 3, prereq: 'sorc_nova' },
                { id: 'sorc_trou_noir', name: 'Trou Noir', max: 1, desc: 'Zone 8m: aspire et détruit. 200 dégâts/tour. Dure 5 tours.', cost: 5, prereq: 'sorc_supernova' },
                { id: 'sorc_big_bang', name: 'Big Bang Contrôlé', max: 1, desc: 'Zone 30m: 1000 dégâts. Détruit terrain. Recharge 30 tours.', cost: 8, prereq: 'sorc_trou_noir' }
            ],
            creation: [
                { id: 'sorc_bouclier', name: 'Bouclier Mystique', max: 5, desc: 'Bouclier +15 PV par rang. Rang 5: renvoie 30% dégâts.', cost: 1, prereq: null },
                { id: 'sorc_teleportation', name: 'Téléportation', max: 3, desc: 'Portée +10m par rang. Rang 3: téléporte allié.', cost: 2, prereq: 'sorc_bouclier' },
                { id: 'sorc_metamorphose', name: 'Métamorphose', max: 2, desc: 'Transforme ennemi en mouton 2 tours +1 par rang.', cost: 3, prereq: 'sorc_teleportation' },
                { id: 'sorc_creation_matiere', name: 'Création de Matière', max: 2, desc: 'Crée objet rare 1x par rang/jour. Rang 2: objet épique.', cost: 3, prereq: 'sorc_metamorphose' },
                { id: 'sorc_creation_vie', name: 'Création de Vie', max: 1, desc: "Invoque créature alliée (150 PV, 40 dégâts). Dure jusqu'à mort.", cost: 5, prereq: 'sorc_creation_matiere' },
                { id: 'sorc_creation_mondes', name: 'Création de Mondes', max: 1, desc: 'Crée dimension personnelle (inventaire infini, repos sûr).', cost: 8, prereq: 'sorc_creation_vie' }
            ]
        },
        necromancien: {
            invocation: [
                { id: 'necro_mort_vivant', name: 'Invoquer Mort-Vivant', max: 5, desc: 'Zombi: 20 PV +10 par rang, 5 dégâts +3 par rang. Max 1 +1 par rang.', cost: 1, prereq: null },
                { id: 'necro_toucher', name: 'Toucher Nécrotique', max: 5, desc: 'Dégâts 1d8 +1d8 par rang. Soigne 50% dégâts infligés.', cost: 1, prereq: null },
                { id: 'necro_zombi_cosmique', name: 'Zombi Cosmique', max: 3, desc: 'Zombi spatial: 50 PV +25 par rang, vol, laser 15 dégâts.', cost: 2, prereq: 'necro_mort_vivant' },
                { id: 'necro_golem', name: 'Golem Nécro-Météorite', max: 3, desc: 'Golem: 100 PV +50 par rang, 25 dégâts, explosion mort 50 dégâts.', cost: 3, prereq: 'necro_zombi_cosmique' },
                { id: 'necro_legion', name: 'Légion des Ombres', max: 2, desc: 'Invoque 5 spectres (40 PV, 10 dégâts). Rang 2: 10 spectres.', cost: 3, prereq: 'necro_golem' },
                { id: 'necro_reine', name: 'Reine Alien Nécrotique', max: 1, desc: 'Reine: 300 PV, 60 dégâts, pond 1 zombi/tour. Dure 15 tours.', cost: 5, prereq: 'necro_legion' },
                { id: 'necro_seigneur', name: 'Seigneur des Morts', max: 1, desc: 'Invoque armée (20 zombis, 5 golems, 1 reine). Recharge 50 tours.', cost: 8, prereq: 'necro_reine' }
            ],
            necromancie: [
                { id: 'necro_drain', name: 'Drain de Vie', max: 5, desc: 'Vole 5 PV +5 par rang à la cible. Max portée 10m.', cost: 1, prereq: null },
                { id: 'necro_aura', name: 'Aura de Décomposition', max: 3, desc: 'Zone 3m: 5 dégâts/tour +5 par rang aux ennemis. Rang 3: 15 dégâts/tour.', cost: 2, prereq: 'necro_drain' },
                { id: 'necro_peste', name: 'Peste Galactique', max: 3, desc: 'Maladie contagieuse: 10 dégâts/tour +10 par rang. Se propage.', cost: 2, prereq: 'necro_aura' },
                { id: 'necro_vortex', name: 'Vortex Nécrotique', max: 2, desc: 'Zone 8m: aspire ennemis, 20 dégâts/tour. Rang 2: 40 dégâts/tour.', cost: 3, prereq: 'necro_peste' },
                { id: 'necro_cataclysme', name: 'Cataclysme Sombre', max: 1, desc: 'Zone 15m: 200 dégâts + réanime cadavres en zombis alliés.', cost: 5, prereq: 'necro_vortex' },
                { id: 'necro_apocalypse', name: "Apocalypse de l'Infini", max: 1, desc: 'Tous les morts de la zone ressuscitent. Vous devenez immortel 10 tours.', cost: 8, prereq: 'necro_cataclysme' }
            ],
            alien: [
                { id: 'necro_creature', name: 'Créature Alien Invoquée', max: 5, desc: 'Alien: 30 PV +15 par rang, 8 dégâts +4 par rang. 1 alien max.', cost: 1, prereq: null },
                { id: 'necro_lien', name: 'Lien Spirituel', max: 3, desc: 'Partage 10% PV +10% par rang avec invocation. Rang 3: partage 30%.', cost: 2, prereq: 'necro_creature' },
                { id: 'necro_reanimation', name: 'Réanimation Massive', max: 2, desc: 'Réanime 3 cadavres +2 par rang en zombis. Rang 2: 7 cadavres.', cost: 3, prereq: 'necro_lien' },
                { id: 'necro_singularite', name: 'Singularité de Mort', max: 1, desc: 'Crée trou noir nécrotique: aspire tout, 100 dégâts/tour. Dure 8 tours.', cost: 5, prereq: 'necro_reanimation' },
                { id: 'necro_necropole', name: 'Nécropole Spatiale', max: 1, desc: 'Zone contrôlée: morts ressuscitent auto, +50% stats invocation.', cost: 8, prereq: 'necro_singularite' }
            ]
        }
    },

    tree: {
        combat: [
            { id: 'precision', name: 'Précision', max: 5, desc: '+5% chance de coup critique par niveau', cost: 1 },
            { id: 'berserk', name: 'Berserk', max: 3, desc: '+10% dégâts quand PV < 30%', cost: 2 },
            { id: 'armure_lourde', name: 'Armure Lourde', max: 3, desc: '-1 dégât reçu par niveau', cost: 1 }
        ],
        magie: [
            { id: 'puissance', name: 'Puissance Arcane', max: 5, desc: '+10% dégâts des sorts par niveau', cost: 1 },
            { id: 'regen_mana', name: 'Régénération', max: 3, desc: '+1 PM par tour de combat', cost: 2 },
            { id: 'controle', name: 'Contrôle Mental', max: 1, desc: 'Chance de charmer un ennemi', cost: 5 }
        ],
        exploration: [
            { id: 'detection', name: 'Détection', max: 5, desc: '+10% chance de trouver du butin', cost: 1 },
            { id: 'pilotage', name: 'Pilotage', max: 3, desc: '+10% vitesse de vaisseau par niveau', cost: 1 },
            { id: 'negociation', name: 'Négociation', max: 3, desc: '-10% prix chez les marchands', cost: 2 }
        ]
    },

    getTree: function() {
        const char = App.currentCharacter;
        if (!char) return this.tree;
        return this.classTrees[char.class] || this.tree;
    },

    render: function() {
        const char = App.currentCharacter;
        const container = document.getElementById('skills-content');
        if (!container || !char) return;

        char.skillsUnlocked = char.skillsUnlocked || {};
        const points = char.attributePoints || 0;
        document.getElementById('skill-points').textContent = points;

        const activeTree = this.getTree();
        let html = '';
        
        Object.entries(activeTree).forEach(([branch, skills]) => {
            html += `<h3>${branch.toUpperCase()}</h3><div class="skill-branch">`;
            skills.forEach(skill => {
                const current = char.skillsUnlocked[skill.id] || 0;
                const prereqMet = !skill.prereq || (char.skillsUnlocked[skill.prereq] || 0) > 0;
                const canUpgrade = prereqMet && points >= skill.cost && current < skill.max;
                const lockedClass = !prereqMet ? 'locked' : (current > 0 ? 'unlocked' : '');
                const availClass = canUpgrade ? 'available' : '';
                
                html += `<div class="skill-node ${lockedClass} ${availClass}">
                    <div class="skill-info">
                        <strong>${skill.name}</strong> <span class="skill-lvl">${current}/${skill.max}</span>
                        <p>${skill.desc}</p>
                        ${skill.prereq ? `<small>Requiert: ${this.getSkillName(skill.prereq)}</small>` : ''}
                    </div>
                    <button onclick="Skills.upgrade('${skill.id}')" class="btn-small" ${!canUpgrade ? 'disabled' : ''}>
                        ${current >= skill.max ? 'MAX' : `+ (${skill.cost} pts)`}
                    </button>
                </div>`;
            });
            html += '</div>';
        });
        container.innerHTML = html;
    },

    getSkillName: function(skillId) {
        for (const cls of Object.values(this.classTrees)) {
            for (const branch of Object.values(cls)) {
                const skill = branch.find(s => s.id === skillId);
                if (skill) return skill.name;
            }
        }
        return skillId;
    },

    upgrade: function(skillId) {
        const char = App.currentCharacter;
        if (!char) return;
        let skill = null;
        const activeTree = this.getTree();
        Object.values(activeTree).forEach(branch => {
            const found = branch.find(s => s.id === skillId);
            if (found) skill = found;
        });
        if (!skill) return;

        const current = char.skillsUnlocked[skillId] || 0;
        const points = char.attributePoints || 0;
        const prereqMet = !skill.prereq || (char.skillsUnlocked[skill.prereq] || 0) > 0;

        if (current >= skill.max || points < skill.cost || !prereqMet) return;

        char.attributePoints -= skill.cost;
        char.skillsUnlocked[skillId] = current + 1;

        Storage.saveCharacter(char);
        this.render();
        UI.updateCharacterSheet(char);
    },

    getEffect: function(skillId, baseValue) {
        const char = App.currentCharacter;
        if (!char || !char.skillsUnlocked) return 0;
        const rank = char.skillsUnlocked[skillId] || 0;
        return baseValue * rank;
    },

    hasSkill: function(skillId, minRank) {
        const char = App.currentCharacter;
        if (!char || !char.skillsUnlocked) return false;
        return (char.skillsUnlocked[skillId] || 0) >= (minRank || 1);
    }
};
