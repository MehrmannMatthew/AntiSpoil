function $(a, b) {
    return typeof b === 'number' ? document.querySelectorAll(a)[b] : document.querySelectorAll(a);
}

class Store {
    constructor() {
        this.banned = null;
        chrome.storage.local.get(['banned'], ({ banned }) => {
            this.banned = banned ? banned : [];
            this.update(false);
        });

    }
    addPhrase(phrase) {
        this.banned.push(phrase);
        this.update(true);
    }
    removePhrase(index) {
        this.banned.splice(index, 1);
        this.update(true);
    }
    update(changeStorage) {
        if(changeStorage) {
            chrome.storage.local.set({ 'banned': this.banned });
        }
        const container = $('#blocked-phrases', 0);
        container.innerHTML = '';
        for(let i = 0; i < this.banned.length; ++i) {
            const phrase = this.banned[i];
            const item = document.createElement('div');
            const button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'remove');
            button.addEventListener('click', () => {
                this.removePhrase(i);
            })
            const span = document.createElement('span');
            span.innerText = phrase;
            item.appendChild(button);
            item.appendChild(span);
            container.appendChild(item);
        }
    }
}

const store = new Store();

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