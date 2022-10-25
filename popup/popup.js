function $(a, b) {
    return typeof b === 'number' ? document.querySelectorAll(a)[b] : document.querySelectorAll(a);
}

function createElement(parent, elementType, attributes, innerText) {
    const element = document.createElement(elementType);
    if(parent) {
        parent.appendChild(element);
    }
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    if(innerText) {
        element.innerText = innerText;
    }
    return element;
}

class MessageSystem {
  constructor() {
    this.handlers = {};
    chrome.runtime.onMessage.addListener(({ signature, body }, sender) => {
      const handler = this.handlers[signature];
      if(handler) {
        handler(body);
      }
    });
  }
  addHandler(signature, handler) {
    this.handlers[signature] = handler;
  }
  send(signature, body) {
    chrome.runtime.sendMessage({
      signature,
      body
    });
  }
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
            
            const expansionId = `banned-related-container-${i}`;
            
            const itemContainer = createElement(bannedListContainer, 'div', { id: `banned-item-container-${i}`, class: 'banned-item-container' });

            const keyPhraseContainer = createElement(itemContainer, 'div', { class: 'banned-phrase-container' });
            createElement(keyPhraseContainer, 'div', { class: 'banned-remove-button' }, 'delete').addEventListener('click', () => {
                this.removePhrase(i);
            });
            createElement(keyPhraseContainer, 'div', { class: 'banned-phrase' }, keyPhrase);
            createElement(keyPhraseContainer, 'div', { class: 'banned-expansion-button' }, 'expand').addEventListener('click', () => {
                const { classList } = $(`#${expansionId}`, 0);
                if(classList.contains('expansion-panel-hidden')) {
                  classList.remove('expansion-panel-hidden');
                }
                else {
                  classList.add('expansion-panel-hidden');
                }
            });

            const expansionPanel = createElement(itemContainer, 'div', { id: expansionId, class: 'expansion-panel expansion-panel-hidden' });
            const expansionHeader = createElement(expansionPanel, 'div', { class: 'expansion-panel-header' });
            createElement(expansionHeader, 'div', { class: 'expansion-panel-header-title' }, 'Block Related Words');
            // expansion header toggle
            createElement(expansionHeader, 'div', { class: 'toggle' });
            
            
            
            const relatedListContainer = createElement(expansionPanel, 'div', { class: 'banned-item-container' });
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

const messageSystem = new MessageSystem();
const store = new Store();

window.onload = () => {
    const inputButton = () => {
        const input = $('#add-phrase', 0);
        const { value } = input;
        if(value.length !== 0) {
            store.addPhrase(value);
            input.value = '';
        }
    };

    $('#add-phrase', 0).addEventListener('keydown', e => {
        if(e.key == 'Enter') {
            inputButton();
        }
    });
};
