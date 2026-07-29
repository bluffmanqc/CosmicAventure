// ============================================
// COSMIC AVENTURE - IMAGE GENERATOR
// Pollinations.ai (Illimité, sans clé API)
// ============================================
const Images = {
    baseUrl: 'https://image.pollinations.ai/prompt/',
    
    // Génère une URL d'image avec options
    generate: function(prompt, width = 512, height = 512, seed = null) {
        const encodedPrompt = encodeURIComponent(prompt);
        const seedParam = seed !== null ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 100000)}`;
        return `${this.baseUrl}${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux${seedParam}`;
    },
    
    // Construit le prompt pour le portrait dynamique du personnage
    buildCharacterPrompt: function(char) {
        if (!char) return 'empty space';
        
        let prompt = 'full body portrait, head to toe, sci-fi rpg character, ';
        
        // Apparence de base (sous-vêtements spatiaux par défaut)
        prompt += `${char.appearance.body || 'athletic'} body, `;
        prompt += `${char.appearance.skin || 'light'} skin, `;
        prompt += `${char.appearance.height || 'average'} height, `;
        
        // Tête et visage
        if (char.appearance.hair !== 'bald') {
            prompt += `${char.appearance.hair} ${char.appearance.hairStyle || 'short'} hair, `;
        } else {
            prompt += 'bald, ';
        }
        prompt += `${char.appearance.eyes} eyes, `;
        if (char.appearance.mark && char.appearance.mark !== 'none') {
            prompt += `${char.appearance.mark} on face, `;
        }
        
        // Race spécifique
        const raceTraits = {
            'terrien': 'human earthling',
            'martien': 'red skinned martian alien',
            'raelien': 'glowing ethereal raelien being',
            'ptitgris': 'small grey alien with big black eyes'
        };
        prompt += `${raceTraits[char.race] || 'human'}, `;
        
        // Classe et équipement (modifie l'image au fil du jeu)
        const classTraits = {
            'ninja': 'stealthy ninja outfit',
            'mercenaire': 'heavy armored mercenary',
            'sorcier': 'mystical wizard robes',
            'necromancien': 'dark necromancer robes with skulls'
        };
        
        // Si le personnage a de l'équipement, on l'ajoute au prompt
        if (char.equipment && char.equipment.length > 0) {
            const equippedItems = char.equipment.map(e => e.name || e.type).join(', ');
            prompt += `wearing ${classTraits[char.class] || 'adventurer gear'}, equipped with ${equippedItems}, `;
        } else {
            // Presque nu au début
            prompt += 'wearing basic underwear, nearly naked, starting adventurer, ';
        }
        
        prompt += 'cinematic lighting, highly detailed, digital art, 8k, unreal engine 5 style, dark sci-fi background';
        
        return prompt;
    },
    
    // Génère le portrait du personnage
    getCharacterPortrait: function(char) {
        const prompt = this.buildCharacterPrompt(char);
        // On utilise l'ID du perso comme seed pour garder la cohérence du visage
        const seed = char.id ? char.id.split('_')[1].charCodeAt(0) * 100 : 1234;
        return this.generate(prompt, 512, 768, seed);
    },
    
    // Génère une image d'item
    getItemImage: function(item) {
        const prompt = `sci-fi rpg item icon, ${item.name}, ${item.rarity || 'common'} quality, detailed, dark background, game asset style`;
        return this.generate(prompt, 256, 256);
    },
    
    // Génère une image d'ennemi/boss
    getEnemyImage: function(enemy) {
        const isBoss = enemy.isBoss || false;
        const prompt = `sci-fi rpg ${isBoss ? 'epic boss monster' : 'enemy creature'}, ${enemy.name}, ${enemy.description || ''}, terrifying, detailed, dark atmospheric background, digital painting`;
        return this.generate(prompt, isBoss ? 768 : 512, isBoss ? 768 : 512);
    },
    
    // Génère une carte (locale, planète, système, galaxie)
    getMapImage: function(type, locationName) {
        const prompts = {
            'local': `top down tactical rpg map, ${locationName}, indoor or outdoor area, grid, fantasy sci-fi mix, detailed`,
            'planet': `space rpg planet map, ${locationName}, planets orbiting a star, sci-fi holographic interface style, dark space background`,
            'galaxy': `galaxy map, spiral arms, ${locationName} sector highlighted, sci-fi strategic view, nebulae, stars, epic scale`
        };
        return this.generate(prompts[type] || prompts['local'], 800, 600);
    },
    
    // Génère une image de magasin
    getShopImage: function(shopType) {
        const prompts = {
            'armurerie': 'sci-fi weapon shop interior, futuristic store, weapons on display, holographic interface',
            'armure': 'sci-fi armor shop, protective gear display, futuristic equipment store',
            'general': 'sci-fi general store, trading post, space merchant shop interior',
            'vaisseau': 'spaceship dealership, futuristic vehicle shop, hangar with spacecraft'
        };
        return this.generate(prompts[shopType] || prompts['general'], 640, 480);
    },
    
    // Génère une scène d'histoire
    getStoryScene: function(description) {
        const prompt = `sci-fi rpg scene, ${description}, cinematic composition, dramatic lighting, detailed environment, digital painting, 8k`;
        return this.generate(prompt, 1024, 576);
    },
    
    // Précharge une image en arrière-plan (optionnel, pour fluidité)
    preload: function(url) {
        const img = new Image();
        img.src = url;
    }
};
