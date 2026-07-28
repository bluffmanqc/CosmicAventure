const APIManager = {
    providers: {
        grok: { name: 'Grok (xAI)', type: 'text', endpoint: 'https://api.x.ai/v1/chat/completions', key: null, enabled: true, unlimited: true },
        openai: { name: 'OpenAI GPT', type: 'text', endpoint: 'https://api.openai.com/v1/chat/completions', key: null, enabled: false, unlimited: false },
        elevenlabs: { name: 'ElevenLabs (Voix)', type: 'voice', endpoint: 'https://api.elevenlabs.io/v1/text-to-speech', key: null, enabled: false, unlimited: false, fallback: 'android_tts' },
        pollinations: { name: 'Pollinations.ai (Images)', type: 'image', endpoint: 'https://image.pollinations.ai/prompt/', key: null, enabled: true, unlimited: true },
        stability: { name: 'Stability AI', type: 'image', endpoint: 'https://api.stability.ai/v1/generation', key: null, enabled: false, unlimited: false }
    },
    config: { activeTextProvider: 'grok', activeVoiceProvider: 'android_tts', activeImageProvider: 'pollinations', autoFallback: true },

    loadKeys: function() {
        try {
            var saved = JSON.parse(localStorage.getItem('api_keys'));
            if (saved) {
                Object.keys(saved).forEach(function(provider) {
                    if (APIManager.providers[provider]) {
                        APIManager.providers[provider].key = saved[provider];
                    }
                });
            }
        } catch(e) {
            console.log('Aucune clé API sauvegardée');
        }
    },

    saveKeys: function() {
        try {
            var keys = {};
            Object.keys(this.providers).forEach(function(provider) {
                if (APIManager.providers[provider].key) {
                    keys[provider] = APIManager.providers[provider].key;
                }
            });
            localStorage.setItem('api_keys', JSON.stringify(keys));
            return true;
        } catch(e) {
            console.error('Erreur saveKeys:', e);
            return false;
        }
    },

    setKey: function(provider, key) {
        if (this.providers[provider]) {
            this.providers[provider].key = key;
            this.providers[provider].enabled = !!key;
            this.saveKeys();
            return true;
        }
        return false;
    },

    generateText: function(prompt, options) {
        options = options || {};
        var self = this;
        var provider = this.providers[this.config.activeTextProvider];
        if (!provider.key && !provider.unlimited) {
            return Promise.resolve(this.generateTextFallback(prompt, options));
        }
        return new Promise(function(resolve, reject) {
            if (provider.name.indexOf('Grok') >= 0) {
                self.callGrok(prompt, options).then(resolve).catch(function(e) {
                    console.error('Erreur API texte:', e);
                    if (self.config.autoFallback) {
                        resolve(self.generateTextFallback(prompt, options));
                    } else {
                        reject(e);
                    }
                });
            } else {
                resolve(self.generateTextFallback(prompt, options));
            }
        });
    },

    callGrok: function(prompt, options) {
        var provider = this.providers.grok;
        return fetch(provider.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + provider.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    { role: 'system', content: 'Tu es un MJ expert en RPG spatial.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: options.maxTokens || 2000,
                temperature: options.temperature || 0.8
            })
        }).then(function(response) {
            if (!response.ok) throw new Error('Grok API error: ' + response.status);
            return response.json();
        }).then(function(data) {
            return data.choices[0].message.content;
        });
    },

    generateTextFallback: function(prompt, options) {
        var responses = [
            "Vous avancez prudemment dans l'obscurité...",
            "Un bruit étrange retentit au loin...",
            "Vous découvrez un objet brillant au sol...",
            "L'atmosphère est lourde de tensions..."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    },

    speak: function(text, options) {
        options = options || {};
        var provider = this.config.activeVoiceProvider;
        if (provider === 'android_tts' || provider === 'elevenlabs') {
            return this.speakAndroid(text, options);
        }
        var self = this;
        return this.callElevenLabs(text, options).catch(function(e) {
            console.error('Erreur voix:', e);
            return self.speakAndroid(text, options);
        });
    },

    speakAndroid: function(text, options) {
        return new Promise(function(resolve) {
            if ('speechSynthesis' in window) {
                var utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = options.lang || 'fr-FR';
                utterance.rate = options.rate || 1.0;
                utterance.pitch = options.pitch || 1.0;
                utterance.onend = function() { resolve(true); };
                utterance.onerror = function() { resolve(false); };
                speechSynthesis.speak(utterance);
            } else {
                resolve(false);
            }
        });
    },

    callElevenLabs: function(text, options) {
        var provider = this.providers.elevenlabs;
        return fetch(provider.endpoint + '/' + (options.voiceId || '21m00Tcm4TlvDq8ikWAM'), {
            method: 'POST',
            headers: {
                'xi-api-key': provider.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
        }).then(function(response) {
            if (!response.ok) throw new Error('ElevenLabs quota exceeded');
            return response.blob();
        }).then(function(audioBlob) {
            var audioUrl = URL.createObjectURL(audioBlob);
            var audio = new Audio(audioUrl);
            return new Promise(function(resolve) {
                audio.onended = function() { resolve(true); };
                audio.play();
            });
        });
    },

    generateImage: function(prompt, width, height) {
        return Images.generate(prompt, width, height);
    },

    getConfiguration: function() {
        return {
            providers: Object.keys(this.providers).map(function(key) {
                return {
                    id: key,
                    name: APIManager.providers[key].name,
                    type: APIManager.providers[key].type,
                    enabled: APIManager.providers[key].enabled,
                    unlimited: APIManager.providers[key].unlimited,
                    hasKey: !!APIManager.providers[key].key
                };
            }),
            active: this.config
        };
    },

    setActiveProvider: function(type, providerId) {
        if (type === 'text') this.config.activeTextProvider = providerId;
        else if (type === 'voice') this.config.activeVoiceProvider = providerId;
        else if (type === 'image') this.config.activeImageProvider = providerId;
        localStorage.setItem('api_config', JSON.stringify(this.config));
    }
};
