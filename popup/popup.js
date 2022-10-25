function $(a, b) {
    return typeof b === 'number' ? document.querySelectorAll(a)[b] : document.querySelectorAll(a);
}

function createElement(parent, elementType, attributes, innerText) {
    console.log(elementType, attributes);
    const element = document.createElement(elementType);
    if(parent) {
        parent.appendChild(element);
    }
    for(const key in attributes) {
        console.log(key);
        element.setAttribute(key, attributes[key]);
    }
    if(innerText) {
        element.innerText = innerText;
    }
    return element;
}

class Store {
    constructor() {
        this.banned = null;
        chrome.storage.local.get(['banned'], ({ banned }) => {
            this.banned = banned ? banned : [];
            this.update(false);
        });

    }
    addPhrase(keyPhrase) {
        this.banned.push(new Phrase(keyPhrase));
        this.update(true);
    }
    removePhrase(index) {
        this.banned.splice(index, 1);
        this.update(true);
    }
    removeRelatedPhrase(index, relatedIndex) {

    }
    update(changeStorage) {
        if(changeStorage) {
            chrome.storage.local.set({ 'banned': this.banned });
        }
        const bannedListContainer = $('#banned-list-container', 0);
        bannedListContainer.innerHTML = '';
        for(let i = 0; i < this.banned.length; ++i) {
            const { keyPhrase, relatedPhrases } = this.banned[i];
            const itemContainer = createElement(bannedListContainer, 'div', { id: `banned-item-container-${i}`, class: 'banned-item-container' });

            const keyPhraseContainer = createElement(itemContainer, 'div', { class: 'banned-phrase-container' });
            createElement(keyPhraseContainer, 'div', { class: 'banned-remove-button' }, 'delete').addEventListener('click', () => {
                this.removePhrase(i);
            });
            createElement(keyPhraseContainer, 'div', { class: 'banned-phrase' }, keyPhrase);
            createElement(keyPhraseContainer, 'div', { class: 'banned-expansion-button' }, 'expand').addEventListener('click', () => {
                // expand
            });

            const relatedListContainer = createElement(itemContainer, 'div', { id: `banned-related-container-${i}`, class: 'banned-item-container' });
            console.log(relatedPhrases);
            relatedPhrases.forEach((phrase, relatedIndex) => {
                const relatedItemContainer = createElement(relatedListContainer, 'div', { class: 'banned-phrase-container' });
                createElement(relatedItemContainer, 'div', { class: 'banned-remove-button' }, 'delete').addEventListener('click', () => {
                    this.removeRelatedPhrase(i, relatedIndex);
                });
                createElement(relatedItemContainer, 'div', { class: 'banned-phrase' }, phrase);
            });
        }
    }
}

const store = new Store();

class Phrase {
    constructor(keyPhrase) {
        this.keyPhrase = keyPhrase;
        this.relatedPhrases = [
            'related 1',
            'related 2',
            'related 3'
        ];
    }
}

window.onload = () => {
    const inputButton = () => {
        const input = $('#add-banned-text', 0);
        const { value } = input;
        if(value.length !== 0) {
            store.addPhrase(value);
            input.value = '';
        }
    };

    $('#add-banned-button', 0).addEventListener('click', inputButton);
    $('#add-banned-text', 0).addEventListener('keydown', e => {
        if(e.key == "Enter")
        {
            inputButton();
        }       
});
}