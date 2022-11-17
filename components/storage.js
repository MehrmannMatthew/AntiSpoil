import extensionContext from './extension-context.js';

class Phrase {
    constructor(keyPhrase, relatedPhrases) {
        this.keyPhrase = keyPhrase;
        this.relatedPhrases = relatedPhrases;
    }
}

class Storage {
    constructor() {
        this.phrases = [];
        this.settings = {};
        this.loadFromBrowserStorage();
    }
    async getPhrases() {
        await this.loadFromBrowserStorage();
        return this.phrases;
    }
    async getSetting(setting) {
        await this.loadFromBrowserStorage();
        return this.settings[setting];
    }
    async setSetting(setting, value) {
        await this.loadFromBrowserStorage();
        this.settings[setting] = value;
        await this.saveToBrowserStorage();
    }
    async add(keyPhrase, relatedPhrases) {
        await this.loadFromBrowserStorage();
        let i = 0;
        while(i < this.phrases.length) {
            if(this.phrases[i].keyPhrase === keyPhrase) {
                this.phrases[i].relatedPhrases = relatedPhrases;
                break;
            }
            else {
                ++i;
            }
        }
        if(i === this.phrases.length) {
            this.phrases.push(new Phrase(keyPhrase, relatedPhrases));
        }
        await this.saveToBrowserStorage();
    }
    async removeKeyPhrase(keyPhrase) {
        await this.loadFromBrowserStorage()
        for(let i = 0; i < this.phrases.length; ++i) {
            if(keyPhrase === this.phrases[i].keyPhrase) {
                this.phrases.splice(i, 1);
                break;
            }
        }
        await this.saveToBrowserStorage();
    }
    async removeRelatedPrase(keyPhrase, relatedPhrase) {
        await this.loadFromBrowserStorage()
        for(let i = 0; i< this.phrases.length; i++) {
            const phrase = this.phrases[i];
            if(keyPhrase === phrase.keyPhrase) {
                const index = phrase.relatedPhrases.indexOf(relatedPhrase);
                if(index !== -1) {
                    phrase.relatedPhrases.splice(index, 1);
                }
                break;
            }
        }
        await this.saveToBrowserStorage();
    }
    loadFromBrowserStorage() {
        return new Promise(resolve => {
            extensionContext.storage.local.get(['phrases', 'settings'], ({ phrases, settings }) => {
                // check the types of the values returned.
                if(this.validateStorageData(phrases, settings)) {
                    this.phrases = phrases.map(({ keyPhrase, relatedPhrases }) => new Phrase(keyPhrase, relatedPhrases));
                    this.settings = settings;
                }
                else {
                    this.phrases = [];
                    this.settings = {};
                }
                resolve();
            });
        });
    }
    validateStorageData(phrases, settings) {
        try {
            if(typeof settings === 'object' && Array.isArray(phrases)) {
                if(phrases.length === 0) {
                    return true;
                }
                else {
                    for(let i = 0; i < phrases.length; ++i) {
                        const { keyPhrase, relatedPhrases } = phrases[i];
                        if(typeof keyPhrase === 'string' && Array.isArray(relatedPhrases)) {
                            for(let j = 0; j < relatedPhrases.length; ++j) {
                                if(typeof relatedPhrases[j] !== 'string') {
                                    return false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    phrases.forEach(({ keyPhrase, relatedPhrases }) => {
                        
                    });
                }
            }
            else {
                return false;
            }
        }
        catch(err) {
            console.warn(err);
        }
        return false;
    }
    saveToBrowserStorage() {
        return new Promise(resolve => {
            const phrases = this.phrases.map(({ keyPhrase, relatedPhrases }) => ({ keyPhrase, relatedPhrases }));
            extensionContext.storage.local.set({ 
                phrases: phrases,
                settings: this.settings
            }, resolve);
        });
    }
}

export default Storage;