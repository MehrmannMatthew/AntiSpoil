import MessageSystem from '../components/message-system.js';
import Storage from '../components/storage.js';

const storage = new Storage();
const messageSystem = new MessageSystem();

messageSystem.addHandler('update-ui', update);

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

async function update() {
    const phrases = await storage.getPhrases();
    console.log(phrases);
    const bannedListContainer = $('#banned-list-container', 0);
    bannedListContainer.innerHTML = '';
    for(let i = 0; i < phrases.length; ++i) {
        const { keyPhrase, relatedPhrases } = phrases[i];
        
        const itemContainer = createElement(bannedListContainer, 'div', { id: `banned-item-container-${i}`, class: 'banned-item-container expansion-panel-hidden' });

        const keyPhraseContainer = createElement(itemContainer, 'div', { class: 'banned-phrase-container' });
        createElement(keyPhraseContainer, 'div', { class: 'banned-remove-button' }).addEventListener('click', () => {
            storage.removeKeyPhrase(keyPhrase).then(update);
            
        });
        createElement(keyPhraseContainer, 'div', { class: 'banned-phrase' }, keyPhrase);
        createElement(keyPhraseContainer, 'div', { class: 'banned-expansion-button' }).addEventListener('click', () => {
            const { classList } = itemContainer;
            if(classList.contains('expansion-panel-hidden')) {
                classList.remove('expansion-panel-hidden');
            }
            else {
                classList.add('expansion-panel-hidden');
            }
        });

        const expansionPanel = createElement(itemContainer, 'div', { class: 'expansion-panel' });
        const expansionHeader = createElement(expansionPanel, 'div', { class: 'expansion-panel-header' });
        createElement(expansionHeader, 'div', { class: 'expansion-panel-header-title' }, 'Block Related Words');
        // expansion header toggle
        createElement(expansionHeader, 'div', { class: 'toggle' });
        
        
        
        const relatedListContainer = createElement(expansionPanel, 'div', { class: 'banned-item-container' });
        relatedPhrases.forEach((phrase, relatedIndex) => {
            const relatedItemContainer = createElement(relatedListContainer, 'div', { class: 'banned-phrase-container' });
            createElement(relatedItemContainer, 'div', { class: 'banned-remove-button' }).addEventListener('click', () => {
                // REMOVE RELATED PHRASE FUNCTION
            });
            createElement(relatedItemContainer, 'div', { class: 'banned-phrase' }, phrase);
        });
    }
}

window.onload = () => {
    const inputButton = () => {
        const input = $('#add-phrase', 0);
        const { value } = input;
        if(value.length !== 0) {
            messageSystem.send('add-phrase', { keyPhrase: value });
            input.value = '';
        }
    };

    $('#add-phrase', 0).addEventListener('keydown', e => {
        if(e.key == 'Enter') {
            inputButton();
        }
    });

    update();
};
