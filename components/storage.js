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
        this.loadFromBrowserStorage();
    }
    add(keyPhrase, relatedPhrases) {
        return new Promise(resolve => {
            this.phrases.push(new Phrase(keyPhrase, relatedPhrases));
            this.saveToBrowserStorage().then(resolve);
        });
    }
    removeKeyPhrase(keyPhrase) {
        return new Promise(resolve => {
            for(let i = 0; i < this.phrases.length; ++i) {
                if(keyPhrase === this.phrases[i].keyPhrase) {
                    this.phrases.splice(i, 1);
                    break;
                }
            }
            this.saveToBrowserStorage().then(resolve);
        });
    }
    loadFromBrowserStorage() {
        return new Promise(resolve => {
            extensionContext.storage.local.get(['phrases'], ({ phrases }) => {
                if(Array.isArray(phrases)) {
                    this.phrases = phrases.map(({ keyPhrase, relatedPhrases }) => new Phrase(keyPhrase, relatedPhrases));
                }
                else {
                    this.phrases = [];
                }
                resolve();
            });
        });
    }
    saveToBrowserStorage() {
        return new Promise(resolve => {
            const phrases = this.phrases.map(({ keyPhrase, relatedPhrases }) => ({ keyPhrase, relatedPhrases }));
            extensionContext.storage.local.set({ phrases }, resolve);
        });
    }
}

export default Storage;