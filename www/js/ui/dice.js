const Dice = {
    init: function() {
        this.container = document.getElementById('dice-panel');
        if (!this.container) return;
        this.render();
    },

    render: function() {
        this.container.innerHTML = `
            <div class="dice-panel-header">
                <h3>🎲 Lancer de dés</h3>
            </div>
            <div class="dice-controls">
                <select id="dice-type">
                    <option value="6">D6</option>
                    <option value="20">D20</option>
                    <option value="100">D100</option>
                </select>
                <input type="number" id="dice-count" value="1" min="1" max="10">
                <button id="roll-btn" class="btn-gm">Lancer</button>
            </div>
            <div id="dice-results" class="dice-results"></div>
        `;
        document.getElementById('roll-btn').addEventListener('click', () => this.roll());
    },

    roll: function() {
        const type = parseInt(document.getElementById('dice-type').value);
        const count = parseInt(document.getElementById('dice-count').value);
        const results = [];
        let total = 0;
        for (let i = 0; i < count; i++) {
            const result = Math.floor(Math.random() * type) + 1;
            results.push(result);
            total += result;
        }
        const resultsDiv = document.getElementById('dice-results');
        resultsDiv.innerHTML = `
            <div class="dice-result-item">
                <span class="dice-values">${results.join(' + ')}</span>
                <span class="dice-total">= ${total}</span>
            </div>
        `;
    }
};
