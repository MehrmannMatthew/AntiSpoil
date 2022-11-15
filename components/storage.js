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
        this.phrases.push(new Phrase(keyPhrase, relatedPhrases));
        console.log(this.phrases);
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
    loadFromBrowserStorage() {
        return new Promise(resolve => {
            extensionContext.storage.local.get(['phrases', 'settings'], ({ phrases, settings }) => {
                if(Array.isArray(phrases)) {
                    this.phrases = phrases.map(({ keyPhrase, relatedPhrases }) => new Phrase(keyPhrase, relatedPhrases));
                }
                else {
                    this.phrases = [];
                }
                if(typeof settings === 'object') {
                    this.settings = settings;
                }
                else {
                    this.settings = {};
                }
                resolve();
            });
        });
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