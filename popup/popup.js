import MessageSystem from '../components/message-system.js';
import Storage from '../components/storage.js';

const storage = new Storage();
const messageSystem = new MessageSystem();

messageSystem.addHandler('update-ui', update);

function toggleOn(){
    //const status = storage.toggleStorage...(something);
    const toggle = document.getElementById('enable');
    if(toggle.checked){
        //assuming something like this to get it persistent:
        //storage.toggleStorage(toggle).then(update);
        chrome.action.setIcon({path: "../Icons/favicon-on-16x16.png"});
        //also do stuff to block spoilers if it's 
    }
    else{
        chrome.action.setIcon({path: "../Icons/favicon-16x16.png"});
    }
}

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
    await storage.loadFromBrowserStorage();
    const { phrases } = storage;
    const bannedListContainer = $('#banned-list-container', 0);
    bannedListContainer.innerHTML = '';

    //check toggle
    /*we'll see what this ends up being*/ 
    //const toggle = document.getElementById("enable");
    //var enabled = storage.getSetting()
    toggleOn();

    for(let i = 0; i < phrases.length; ++i) {
        const { keyPhrase, relatedPhrases } = phrases[i];
        
        const expansionId = `banned-related-container-${i}`;
        
        const itemContainer = createElement(bannedListContainer, 'div', { id: `banned-item-container-${i}`, class: 'banned-item-container' });

        const keyPhraseContainer = createElement(itemContainer, 'div', { class: 'banned-phrase-container' });
        createElement(keyPhraseContainer, 'div', { class: 'banned-remove-button' }, 'delete').addEventListener('click', () => {
            storage.removeKeyPhrase(keyPhrase).then(update);
            
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

    $('#enable', 0).addEventListener("click", toggleOn);

    update();
};
