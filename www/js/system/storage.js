const Storage = {
    STORAGE_KEY: "CosmicAventure_Master_Save",

    getInitialData: function() {
        return {
            character: null,
            inventory: { equipment: [], consumables: [], ship: [], cargo: [], mounts: [], companions: [] },
            settings: { grokKey: "", elevenlabsKey: "", customProvider: "" },
            storyProgress: { title: "", text: "", choices: [], image_prompt: "" },
            sessionCode: "COSMIC-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            grimoire: {
                bestiary: [
                    { id: "b1", name: "Xénomorphe Hybride-33", type: "Créature Agresssive", desc: "Monstre génétique aux griffes de plasma.", danger: "Élevé (CR 5)", rarity: "Rare" }
                ],
                equipment: [
                    { id: "e1", name: "Blaster à Plasma 'Eclipse'", type: "Arme à Distance", desc: "Tire des rafales de sursauts gamma.", stats: "+4 Dégâts de Plasma", rarity: "Épique" },
                    { id: "e2", name: "Exosquelette de Commando", type: "Armure Lourde", desc: "Protège contre les tirs lourds et le vide spatial.", stats: "+3 CA / Résistance Plasma", rarity: "Légendaire" }
                ],
                mountsCompanions: [
                    { id: "m1", name: "Droïde Tactique HK-88", type: "Compagnon", desc: "Droïde militaire d'assistance au tir.", stats: "+2 en Initiative", rarity: "Rare" },
                    { id: "m2", name: "Raptor Néon de Vega", type: "Monture", desc: "Créature reptilienne super-rapide.", stats: "Vitesse x2", rarity: "Rare" }
                ],
                shipsCargo: [
                    { id: "s1", name: "Corvette 'Ombre Stellair'", type: "Vaisseau Furtif", desc: "Vaisseau d'infiltration rapide doté d'un camouflage optique.", stats: "Capacité Cargo: 500T", rarity: "Légendaire" },
                    { id: "s2", name: "Module Cargo Intergalactique MK-2", type: "Cargo", desc: "Conteneur blindé sous vide pour minerais rares.", stats: "Volume: 2000T", rarity: "Spécial" }
                ],
                locations: [
                    { id: "l1", name: "Station Clandestine X-9", type: "Secteur Cosmique", desc: "Avant-poste de pirates et de scientifiques proscrits.", status: "Exploré" }
                ]
            }
        };
    },

    loadData: function() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return this.getInitialData();
            const data = JSON.parse(raw);
            if (!data.grimoire) data.grimoire = this.getInitialData().grimoire;
            if (!data.sessionCode) data.sessionCode = "COSMIC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
            return data;
        } catch (e) {
            console.error("Erreur chargement :", e);
            return this.getInitialData();
        }
    },

    saveData: function(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Erreur sauvegarde :", e);
        }
    }
};
