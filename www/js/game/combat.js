const Combat = {
    currentBattle: null,
    turnOrder: [],
    currentTurn: 0,

    initBattle: function(player, enemies) {
        this.currentBattle = {
            player: player,
            enemies: enemies,
            turn: 0,
            log: []
        };
        this.turnOrder = this.calculateTurnOrder(player, enemies);
        this.currentTurn = 0;
        this.processSummons(player);
        return this.currentBattle;
    },

    calculateTurnOrder: function(player, enemies) {
        const all = [{ type: 'player', entity: player, initiative: this.getInitiative(player) }];
        enemies.forEach((e, i) => all.push({ type: 'enemy', entity: e, index: i, initiative: this.getInitiative(e) }));
        return all.sort((a, b) => b.initiative - a.initiative);
    },

    getInitiative: function(entity) {
        let base = entity.attributes ? (entity.attributes.dexterite || 10) : 10;
        if (entity.skillsUnlocked && entity.skillsUnlocked['merc_tacticien']) {
            base += 5 * entity.skillsUnlocked['merc_tacticien'];
        }
        return base + Math.floor(Math.random() * 20) + 1;
    },

    nextTurn: function() {
        if (!this.currentBattle) return null;
        const actor = this.turnOrder[this.currentTurn % this.turnOrder.length];
        this.currentTurn++;
        return actor;
    },

    playerAttack: function(targetIndex, actionType) {
        const battle = this.currentBattle;
        if (!battle) return null;
        const player = battle.player;
        const target = battle.enemies[targetIndex];
        if (!target || target.hp <= 0) return { error: 'Cible invalide' };

        let action = { type: actionType || 'melee', damage: this.getBaseDamage(player, actionType) };
        action = this.applySkillEffects(player, target, action);
        action = this.applyDefensiveSkills(target, player, action);

        if (action.missed) {
            this.log(`${player.name} rate son attaque!`);
            return { hit: false, damage: 0 };
        }

        let damage = action.damage || 0;
        if (action.crit) damage *= 2;
        if (action.reflect) {
            player.hp -= Math.floor(damage * action.reflect);
            this.log(`${target.name} renvoie ${Math.floor(damage * action.reflect)} dégâts!`);
        }

        target.hp -= damage;
        if (action.lifeSteal && damage > 0) {
            const heal = Math.floor(damage * action.lifeSteal);
            player.hp = Math.min(player.maxHp, player.hp + heal);
            this.log(`${player.name} se soigne de ${heal} PV!`);
        }
        if (action.stun) target.stunned = action.stun;
        if (action.burn) target.burning = action.burn;

        this.log(`${player.name} inflige ${damage} dégâts à ${target.name}!`);

        if (target.hp <= 0) {
            target.hp = 0;
            this.log(`${target.name} est vaincu!`);
            this.gainExperience(player, target);
        }

        if (action.extraAttacks > 0) {
            for (let i = 0; i < action.extraAttacks; i++) {
                this.log(`Attaque éclair!`);
                const extraDmg = Math.floor(action.damage * 0.5);
                target.hp -= extraDmg;
                this.log(`${extraDmg} dégâts supplémentaires!`);
            }
        }

        if (action.summons && action.summons.length > 0) {
            action.summons.forEach(s => {
                battle.enemies.push({ ...s, hp: s.hp, maxHp: s.hp, type: 'summon', owner: player.name });
                this.log(`${player.name} invoque ${s.name}!`);
            });
        }

        this.processMinionAttacks(player, target);
        return { hit: true, damage: damage, targetDead: target.hp <= 0 };
    },

    enemyAttack: function(enemyIndex) {
        const battle = this.currentBattle;
        if (!battle) return null;
        const enemy = battle.enemies[enemyIndex];
        if (!enemy || enemy.hp <= 0) return null;
        const player = battle.player;

        if (enemy.stunned && enemy.stunned > 0) {
            enemy.stunned--;
            this.log(`${enemy.name} est étourdi!`);
            return { hit: false };
        }

        let action = { type: 'melee', damage: enemy.damage || Math.floor(Math.random() * 10) + 5 };
        action = this.applyDefensiveSkills(player, enemy, action);

        if (action.missed) {
            this.log(`${enemy.name} rate son attaque!`);
            return { hit: false };
        }

        let damage = action.damage;
        if (player.tempShield && player.tempShield > 0) {
            const absorb = Math.min(player.tempShield, damage);
            player.tempShield -= absorb;
            damage -= absorb;
            this.log(`Bouclier absorbe ${absorb} dégâts!`);
        }

        player.hp -= damage;
        this.log(`${enemy.name} inflige ${damage} dégâts à ${player.name}!`);

        if (player.hp <= 0) {
            player.hp = 0;
            this.log(`${player.name} est KO!`);
        }

        return { hit: true, damage: damage };
    },

    getBaseDamage: function(entity, type) {
        let base = 10;
        if (entity.attributes) {
            if (type === 'melee') base += (entity.attributes.force || 10) - 10;
            if (type === 'ranged') base += (entity.attributes.dexterite || 10) - 10;
            if (type === 'spell') base += (entity.attributes.intelligence || 10) - 10;
        }
        return Math.floor(base + Math.random() * 6);
    },

    applySkillEffects: function(attacker, defender, action) {
        if (!attacker || !attacker.skillsUnlocked) return action;
        const skills = attacker.skillsUnlocked;
        let modified = { ...action };

        if (skills['ninja_attaque_sournoise'] && modified.stealth) {
            modified.damage = Math.floor(modified.damage * (1 + 0.15 * skills['ninja_attaque_sournoise']));
            if (skills['ninja_attaque_sournoise'] >= 5) modified.crit = true;
        }
        if (skills['ninja_lame_energetique'] && modified.type === 'melee') {
            modified.damage = Math.floor(modified.damage * (1 + 0.10 * skills['ninja_lame_energetique']));
        }
        if (skills['ninja_lame_dimensionnelle'] && modified.type === 'melee') {
            modified.damage = Math.floor(modified.damage * (1 + 0.25 * skills['ninja_lame_dimensionnelle']));
            modified.pierceShield = true;
        }
        if (skills['ninja_attaque_eclair'] && modified.type === 'melee') {
            modified.extraAttacks = (modified.extraAttacks || 0) + skills['ninja_attaque_eclair'];
        }
        if (skills['ninja_frappe_trou_noir'] && modified.type === 'ultimate') {
            modified.damage = Math.floor(modified.damage * 5);
            modified.pull = true;
        }
        if (skills['merc_style_combat'] && modified.type === 'melee') {
            modified.damage = Math.floor(modified.damage * (1 + 0.08 * skills['merc_style_combat']));
            if (skills['merc_style_combat'] >= 5) modified.doubleStrike = true;
        }
        if (skills['merc_tir_suppression'] && modified.type === 'ranged') {
            modified.damage = Math.floor(modified.damage * (1 + 0.08 * skills['merc_tir_suppression']));
        }
        if (skills['merc_charge'] && modified.charge) {
            modified.damage = Math.floor(modified.damage * (1 + 0.25 * skills['merc_charge']));
            if (skills['merc_charge'] >= 3) modified.stun = 2;
        }
        if (skills['merc_attaque_multiple'] && modified.type === 'melee') {
            modified.targets = (modified.targets || 1) + skills['merc_attaque_multiple'];
        }
        if (skills['merc_grenade'] && modified.type === 'grenade') {
            modified.radius = (modified.radius || 3) + 2 * skills['merc_grenade'];
            modified.damage = Math.floor(modified.damage * (1 + 0.30 * skills['merc_grenade']));
        }
        if (skills['sorc_puissance'] && modified.type === 'spell') {
            modified.damage = Math.floor(modified.damage * (1 + 0.10 * skills['sorc_puissance']));
        }
        if (skills['sorc_nova'] && modified.type === 'nova') {
            modified.damage = 30 + 15 * skills['sorc_nova'];
        }
        if (skills['sorc_supernova'] && modified.type === 'supernova') {
            modified.damage = 100 + 50 * skills['sorc_supernova'];
            if (skills['sorc_supernova'] >= 2) modified.burn = 5;
        }
        if (skills['sorc_trou_noir'] && modified.type === 'blackhole') {
            modified.damage = 200;
            modified.duration = 5;
            modified.pull = true;
        }
        if (skills['sorc_big_bang'] && modified.type === 'ultimate') {
            modified.damage = 1000;
            modified.destroyTerrain = true;
        }
        if (skills['necro_toucher'] && modified.type === 'touch') {
            modified.damage = (1 + skills['necro_toucher']) * 8;
            modified.lifeSteal = 0.50;
        }
        if (skills['necro_drain'] && modified.type === 'drain') {
            modified.damage = 5 * skills['necro_drain'];
            modified.lifeSteal = 1.0;
        }
        if (skills['necro_aura'] && modified.type === 'aura') {
            modified.damage = 5 * skills['necro_aura'];
            modified.radius = 3;
        }
        if (skills['necro_peste'] && modified.type === 'plague') {
            modified.damage = 10 * skills['necro_peste'];
            modified.contagious = true;
            modified.duration = 5;
        }
        if (skills['necro_vortex'] && modified.type === 'vortex') {
            modified.damage = 20 * skills['necro_vortex'];
            modified.radius = 8;
            modified.duration = 5;
            modified.pull = true;
        }
        if (skills['necro_cataclysme'] && modified.type === 'cataclysm') {
            modified.damage = 200;
            modified.radius = 15;
            modified.raiseDead = true;
        }

        return modified;
    },

    applyDefensiveSkills: function(defender, attacker, incoming) {
        if (!defender || !defender.skillsUnlocked) return incoming;
        const skills = defender.skillsUnlocked;
        let modified = { ...incoming };

        if (skills['ninja_esquive']) {
            const dodgeChance = 0.10 * skills['ninja_esquive'];
            if (Math.random() < dodgeChance) modified.missed = true;
        }
        if (skills['ninja_invisibilite'] && defender.invisible) {
            modified.missed = true;
        }
        if (skills['merc_resistance']) {
            modified.damage = Math.floor(modified.damage * (1 - 0.05 * skills['merc_resistance']));
            if (skills['merc_resistance'] >= 5 && modified.type === 'projectile') modified.damage = 0;
        }
        if (skills['merc_bouclier_energie']) {
            const shield = 20 * skills['merc_bouclier_energie'];
            defender.tempShield = (defender.tempShield || 0) + shield;
        }
        if (skills['merc_blindage']) {
            modified.damage = Math.floor(modified.damage * (1 - 0.10 * skills['merc_blindage']));
        }
        if (skills['merc_colosse']) {
            modified.damage = Math.floor(modified.damage * 0.7);
        }
        if (skills['merc_immunite']) {
            if (['poison', 'fire', 'cold', 'electric'].includes(modified.element)) modified.damage = 0;
            if (modified.type === 'magic') modified.damage = Math.floor(modified.damage * 0.5);
        }
        if (skills['sorc_bouclier']) {
            const shield = 15 * skills['sorc_bouclier'];
            defender.tempShield = (defender.tempShield || 0) + shield;
            if (skills['sorc_bouclier'] >= 5) modified.reflect = 0.30;
        }
        if (skills['sorc_contresort'] && modified.type === 'spell') {
            const counterChance = 0.15 * skills['sorc_contresort'];
            if (Math.random() < counterChance) {
                modified.countered = true;
                modified.damage = 0;
            }
        }
        if (skills['necro_lien'] && defender.minions && defender.minions.length > 0) {
            const share = 0.10 * skills['necro_lien'];
            const shared = Math.floor(modified.damage * share);
            modified.damage -= shared;
            if (defender.minions[0]) defender.minions[0].hp -= shared;
        }

        return modified;
    },

    processSummons: function(caster) {
        if (!caster || !caster.skillsUnlocked) return [];
        const skills = caster.skillsUnlocked;
        const summons = [];

        if (skills['necro_mort_vivant']) {
            const count = Math.min(skills['necro_mort_vivant'], getMaxMinions(caster.level));
            for (let i = 0; i < count; i++) {
                summons.push({
                    type: 'zombie', name: 'Zombi Spatial',
                    hp: 20 + 10 * skills['necro_mort_vivant'],
                    damage: 5 + 3 * skills['necro_mort_vivant'],
                    duration: -1
                });
            }
        }
        if (skills['necro_zombi_cosmique']) {
            for (let i = 0; i < skills['necro_zombi_cosmique']; i++) {
                summons.push({
                    type: 'cosmic_zombie', name: 'Zombi Cosmique',
                    hp: 50 + 25 * skills['necro_zombi_cosmique'],
                    damage: 15, fly: true, duration: -1
                });
            }
        }
        if (skills['necro_golem']) {
            for (let i = 0; i < skills['necro_golem']; i++) {
                summons.push({
                    type: 'necro_golem', name: 'Golem Nécro-Météorite',
                    hp: 100 + 50 * skills['necro_golem'],
                    damage: 25, explodeOnDeath: 50, duration: -1
                });
            }
        }
        if (skills['necro_legion']) {
            const specterCount = 5 * skills['necro_legion'];
            for (let i = 0; i < specterCount; i++) {
                summons.push({
                    type: 'specter', name: 'Spectre',
                    hp: 40, damage: 10, ethereal: true, duration: 10
                });
            }
        }
        if (skills['necro_reine']) {
            summons.push({
                type: 'necro_queen', name: 'Reine Alien Nécrotique',
                hp: 300, damage: 60, spawnRate: 1, duration: 15
            });
        }
        if (skills['necro_creature']) {
            for (let i = 0; i < skills['necro_creature']; i++) {
                summons.push({
                    type: 'alien', name: 'Créature Alien',
                    hp: 30 + 15 * skills['necro_creature'],
                    damage: 8 + 4 * skills['necro_creature'], duration: -1
                });
            }
        }
        if (skills['merc_tourelle']) {
            for (let i = 0; i < skills['merc_tourelle']; i++) {
                summons.push({
                    type: 'turret', name: 'Tourelle Automatique',
                    hp: 50, damage: 20, duration: -1
                });
            }
        }
        if (skills['merc_mech']) {
            summons.push({
                type: 'mech', name: 'Mech de Combat',
                hp: 200, damage: 50, duration: 10
            });
        }
        if (skills['sorc_creation_vie']) {
            summons.push({
                type: 'arcane_creature', name: 'Créature Arcanique',
                hp: 150, damage: 40, duration: -1
            });
        }

        return summons;
    },

    processMinionAttacks: function(player, target) {
        if (!player.minions || player.minions.length === 0) return;
        player.minions.forEach(minion => {
            if (minion.hp > 0 && target.hp > 0) {
                const dmg = minion.damage || 5;
                target.hp -= dmg;
                this.log(`${minion.name} inflige ${dmg} dégâts!`);
                if (target.hp <= 0) {
                    target.hp = 0;
                    this.log(`${target.name} est vaincu!`);
                }
            }
        });
    },

    getSkillDamage: function(character, baseDamage, type) {
        if (!character || !character.skillsUnlocked) return baseDamage;
        const skills = character.skillsUnlocked;
        let multiplier = 1.0;
        if (type === 'melee') {
            if (skills['ninja_lame_energetique']) multiplier += 0.10 * skills['ninja_lame_energetique'];
            if (skills['merc_style_combat']) multiplier += 0.08 * skills['merc_style_combat'];
        }
        if (type === 'ranged') {
            if (skills['merc_tir_suppression']) multiplier += 0.08 * skills['merc_tir_suppression'];
        }
        if (type === 'spell') {
            if (skills['sorc_puissance']) multiplier += 0.10 * skills['sorc_puissance'];
            if (skills['sorc_metamagie']) multiplier += 0.15 * skills['sorc_metamagie'];
        }
        if (type === 'necro') {
            if (skills['necro_ecole']) multiplier += 0.10 * skills['necro_ecole'];
        }
        return Math.floor(baseDamage * multiplier);
    },

    getSkillHealing: function(character, baseHeal) {
        if (!character || !character.skillsUnlocked) return baseHeal;
        const skills = character.skillsUnlocked;
        let multiplier = 1.0;
        if (skills['necro_toucher']) multiplier += 0.20 * skills['necro_toucher'];
        return Math.floor(baseHeal * multiplier);
    },

    gainExperience: function(player, enemy) {
        const xp = enemy.xp || 50;
        player.experience += xp;
        this.log(`${player.name} gagne ${xp} XP!`);
        while (player.experience >= player.experienceToNext) {
            levelUp(player);
            this.log(`${player.name} monte au niveau ${player.level}!`);
        }
    },

    log: function(message) {
        if (this.currentBattle) this.currentBattle.log.push(message);
        console.log(`[COMBAT] ${message}`);
    },

    isBattleOver: function() {
        if (!this.currentBattle) return true;
        const allEnemiesDead = this.currentBattle.enemies.every(e => e.hp <= 0);
        const playerDead = this.currentBattle.player.hp <= 0;
        return allEnemiesDead || playerDead;
    },

    getBattleResult: function() {
        if (!this.currentBattle) return null;
        const player = this.currentBattle.player;
        const enemies = this.currentBattle.enemies;
        if (player.hp <= 0) return { victory: false, message: 'Défaite...' };
        if (enemies.every(e => e.hp <= 0)) return { victory: true, message: 'Victoire!', log: this.currentBattle.log };
        return null;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Combat;
}
