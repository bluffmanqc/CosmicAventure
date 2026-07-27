// ============================================
// COSMIC AVENTURE - GESTIONNAIRE D'API
// Grok, ElevenLabs, et autres services
// ============================================
const APIManager = {
    providers: {
        grok: {
            name: 'Grok (xAI)',
            type: 'text',
            endpoint: 'https://api.x.ai/v1/chat/completions',
            key: null,
            enabled: true,
            unlimited: true
        },
        
        openai: {
            name: 'OpenAI GPT',
            type: 'text',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            key: null,
            enabled: false,
            unlimited: false
        },
        
        elevenlabs: {
            name: 'ElevenLabs (Voix)',
            type: 'voice',
            endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
            key: null,
            enabled: false,
            unlimited: false,
            fallback: 'android_tts'
        },
        
        pollinations: {
            name: 'Pollinations.ai (Images)',
            type: 'image',
            endpoint: 'https://image.pollinations.ai/prompt/',
            key: null,
            enabled: true,
            unlimited: true
        },
        
        stability: {
            name: 'Stability AI',
            type: 'image',
            endpoint: 'https://api.stability.ai/v1/generation',
            key: null,
            enabled: false,
            unlimited: false
        }
    },
    
    // Configuration
    config: {
        activeTextProvider: 'grok',
        activeVoiceProvider: 'android_tts',
        activeImageProvider: 'pollinations',
        autoFallback: true
    },
    
    // Charger les clés API depuis le storage
    loadKeys: function() {
        try {
        const saved = JSON.parse(Storage.getItem('api_keys'));
        } catch(e) {
            console.log('Aucune clé API sauvegardée');
            return;
        }
        if (saved) {
            Object.keys(saved).forEach(provider => {
                if (this.providers[provider]) {
                    this.providers[provider].key = saved[provider];
                }
            });
        }
    },
    
    // Sauvegarder les clés API
    saveKeys: function() {
        const keys = {};
        Object.keys(this.providers).forEach(provider => {
            if (this.providers[provider].key) {
                keys[provider] = this.providers[provider].key;
            }
        });
        Storage.save('api_keys', keys);
    },
    
    // Définir une clé API
    setKey: function(provider, key) {
        if (this.providers[provider]) {
            this.providers[provider].key = key;
            this.providers[provider].enabled = !!key;
            this.saveKeys();
            return true;
        }
        return false;
    },
    
    // Générer du texte avec IA (Grok ou autre)
    async generateText: function(prompt, options = {}) {
        const provider = this.providers[this.config.activeTextProvider];
        
        if (!provider.key && !provider.unlimited) {
            // Fallback vers un provider gratuit
            return this.generateTextFallback(prompt, options);
        }
        
        try {
            if (provider.name.includes('Grok')) {
                return await this.callGrok(prompt, options);
            } else if (provider.name.includes('OpenAI')) {
                return await this.callOpenAI(prompt, options);
            }
        } catch (e) {
            console.error('Erreur API texte:', e);
            if (this.config.autoFallback) {
                return this.generateTextFallback(prompt, options);
            }
            throw e;
        }
    },
    
    // Appel à Grok
    async callGrok: function(prompt, options) {
        const provider = this.providers.grok;
        
        const response = await fetch(provider.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${provider.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un Maître du Jeu expert en RPG spatial. Tu crées des histoires épiques, gères les combats, et décris l\'univers de manière immersive.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: options.maxTokens || 2000,
                temperature: options.temperature || 0.8
            })
        });
        
        if (!response.ok) {
            throw new Error(`Grok API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    },
    
    // Fallback vers texte généré localement
    generateTextFallback: function(prompt, options) {
        // Génération procédurale basique quand pas d'API
        const responses = [
            "Vous avancez prudemment dans l'obscurité...",
            "Un bruit étrange retentit au loin...",
            "Vous découvrez un objet brillant au sol...",
            "L'atmosphère est lourde de tensions..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },
    
    // Synthèse vocale
    async speak: function(text, options = {}) {
        const provider = this.config.activeVoiceProvider;
        
        if (provider === 'android_tts' || provider === 'elevenlabs') {
            return this.speakAndroid(text, options);
        }
        
        try {
            if (provider === 'elevenlabs') {
                return await this.callElevenLabs(text, options);
            }
        } catch (e) {
            console.error('Erreur voix:', e);
            return this.speakAndroid(text, options);
        }
    },
    
    // TTS Android natif
    speakAndroid: function(text, options) {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = options.lang || 'fr-FR';
                utterance.rate = options.rate || 1.0;
                utterance.pitch = options.pitch || 1.0;
                
                utterance.onend = () => resolve(true);
                utterance.onerror = () => resolve(false);
                
                speechSynthesis.speak(utterance);
            } else {
                resolve(false);
            }
        });
    },
    
    // ElevenLabs
    async callElevenLabs: function(text, options) {
        const provider = this.providers.elevenlabs;
        
        const response = await fetch(`${provider.endpoint}/${options.voiceId || '21m00Tcm4TlvDq8ikWAM'}`, {
            method: 'POST',
            headers: {
                'xi-api-key': provider.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('ElevenLabs quota exceeded');
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        return new Promise((resolve) => {
            audio.onended = () => resolve(true);
            audio.play();
        });
    },
    
    // Générer une image
    generateImage: function(prompt, width = 512, height = 512) {
        const provider = this.providers[this.config.activeImageProvider];
        
        if (provider.name.includes('Pollinations')) {
            return Images.generate(prompt, width, height);
        }
        
        // Autres providers...
        return Images.generate(prompt, width, height);
    },
    
    // Interface de configuration
    getConfiguration: function() {
        return {
            providers: Object.keys(this.providers).map(key => ({
                id: key,
                name: this.providers[key].name,
                type: this.providers[key].type,
                enabled: this.providers[key].enabled,
                unlimited: this.providers[key].unlimited,
                hasKey: !!this.providers[key].key
            })),
            active: this.config
        };
    },
    
    // Changer de provider
    setActiveProvider: function(type, providerId) {
        if (type === 'text') {
            this.config.activeTextProvider = providerId;
        } else if (type === 'voice') {
            this.config.activeVoiceProvider = providerId;
        } else if (type === 'image') {
            this.config.activeImageProvider = providerId;
        }
        Storage.save('api_config', this.config);
    }
};

// Charger les clés au démarrage
// APIManager.loadKeys() moved to DOMContentLoaded
