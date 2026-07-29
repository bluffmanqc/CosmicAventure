const Quests = {
    data: [
        { id: 'q1', title: 'Premier sang', desc: 'Vaincre 3 ennemis', type: 'kill', target: 3, reward: { xp: 50, credits: 100 }, completed: false },
        { id: 'q2', title: 'Fouilleur', desc: 'Trouver 5 objets', type: 'loot', target: 5, reward: { xp: 30, credits: 50 }, completed: false },
        { id: 'q3', title: 'Pilote novice', desc: 'Voyager vers 3 systèmes', type: 'travel', target: 3, reward: { xp: 40, credits: 75 }, completed: false },
        { id: 'q4', title: 'Artisan', desc: 'Crafter 3 objets', type: 'craft', target: 3, reward: { xp: 60, credits: 120 }, completed: false },
        { id: 'q5', title: 'Chasseur de prime', desc: 'Vaincre un ennemi Niv.5+', type: 'kill_high', target: 1, reward: { xp: 100, credits: 200 }, completed: false }
    ],

    init: function() {
        const char = App.currentCharacter;
        if (!char) return;
        char.quests = char.quests || this.data.map(q => ({ ...q, progress: 0 }));
    },

    getActive: function() {
        const char = App.currentCharacter;
        if (!char || !char.quests) return [];
        return char.quests.filter(q => !q.completed);
    },

    getCompleted: function() {
        const char = App.currentCharacter;
        if (!char || !char.quests) return [];
        return char.quests.filter(q => q.completed);
    },

    updateProgress: function(type, amount = 1) {
        const char = App.currentCharacter;
        if (!char || !char.quests) return;
        char.quests.forEach(q => {
            if (!q.completed && q.type === type) {
                q.progress = (q.progress || 0) + amount;
                if (q.progress >= q.target) {
                    q.completed = true;
                    this.claimReward(q);
                }
            }
        });
        Storage.saveCharacter(char);
    },

    claimReward: function(quest) {
        const char = App.currentCharacter;
        if (!char) return;
        char.xp += quest.reward.xp;
        char.credits = (char.credits || 0) + quest.reward.credits;
        UI.addStoryEntry('Quête terminée !', `${quest.title} — +${quest.reward.xp} XP, +${quest.reward.credits} crédits`);
        const levelUp = Rules.checkLevelUp(char);
        if (levelUp.leveledUp) {
            UI.addStoryEntry('Niveau Supérieur !', `Vous passez au niveau ${levelUp.newLevel} !`);
        }
    },

    resetDaily: function() {
        const char = App.currentCharacter;
        if (!char) return;
        char.quests = this.data.map(q => ({ ...q, progress: 0 }));
        Storage.saveCharacter(char);
    }
};
