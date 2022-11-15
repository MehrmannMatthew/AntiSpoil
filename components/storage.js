import extensionContext from './extension-context.js';

class Phrase {
    constructor(keyPhrase, relatedPhrases) {
        this.keyPhrase = keyPhrase;
        this.relatedPhrases = relatedPhrases;
    }
}

class Storage {
    constructor() {
        this.phrases = null;
        extensionContext.storage.local.get(['phrases'], ({ phrases }) => {
            if(Array.isArray(phrases)) {
                this.phrases = phrases.map(({ keyPhrase, relatedPhrases }) => new Phrase(keyPhrase, relatedPhrases));
            }
            else {
                this.phrases = [];
            }
        });
    }
    add(keyPhrase, relatedPhrases) {
        this.phrases.push(new Phrase(keyPhrase, relatedPhrases));
        this.saveToBrowserStorage();
    }
    removeKeyPhrase(keyPhrase) {
        for(let i = 0; i < this.phrases.length; ++i) {
            if(keyPhrase === this.phrases[i].keyPhrase) {
                this.phrases.splice(i, 1);
                this.saveToBrowserStorage();
                break;
            }
        }
    }
    saveToBrowserStorage() {
        extensionContext.storage.local.set({ phrases: this.phrases.map(({ keyPhrase, relatedPhrases }) => { keyPhrase, relatedPhrases }) });
    }
}

export default Storage;