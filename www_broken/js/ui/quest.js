const Quest = {
    render: function() {
        const char = App.currentCharacter;
        const container = document.getElementById('quest-content');
        if (!container || !char) return;

        Quests.init();
        const active = Quests.getActive();
        const completed = Quests.getCompleted();

        let html = '';
        if (active.length > 0) {
            html += '<h3>📋 Quêtes actives</h3>';
            active.forEach(q => {
                const pct = Math.min(100, Math.floor(((q.progress || 0) / q.target) * 100));
                html += `<div class="quest-item">
                    <h4>${q.title}</h4>
                    <p>${q.desc}</p>
                    <div class="quest-progress">
                        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                        <span>${q.progress || 0}/${q.target}</span>
                    </div>
                    <p class="reward">🏆 ${q.reward.xp} XP | 💰 ${q.reward.credits} crédits</p>
                </div>`;
            });
        } else {
            html += '<p class="empty">Aucune quête active</p>';
        }

        if (completed.length > 0) {
            html += '<h3>✅ Terminées</h3>';
            completed.forEach(q => {
                html += `<div class="quest-item completed">
                    <h4>${q.title}</h4>
                    <p>Terminée !</p>
                </div>`;
            });
        }

        container.innerHTML = html;
    }
};
