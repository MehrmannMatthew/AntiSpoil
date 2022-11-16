import MessageSystem from './components/message-system.js';
import Storage from './components/storage.js';

function replace() {

    chrome.storage.local.get(['phrases'], ({ phrases }) => {
        const bannedPhrases = [];
        let banIndex = 0;

        //this loop adds all the phrases and related phrases from our data structure into a single array to more easily compare with web page content for blocking spoiler
        for(let phraseObj of phrases){
            bannedPhrases[banIndex++] = phraseObj.keyPhrase.toLowerCase(); //adds user-inputted keyphrase strings into our local array
            for(let relatedPhrase of phraseObj.relatedPhrases){
                bannedPhrases[banIndex++] = relatedPhrase.toLowerCase(); //adds algorithm-generated related phrases to our local array
            }
        }
        
        //this function searches through the webpage starting from the body, and hides all spoiler content
        recursiveReplace(document.body, bannedPhrases);
    });
}

function recursiveReplace(root, bannedPhrases) {
    for(let i = 0; i < root.childNodes.length; ++i) {
        const child = root.childNodes[i];
        if(child.nodeType === Node.TEXT_NODE) {
                const text = child.wholeText.toLowerCase();
                bannedPhrases.forEach(bannedPhrase => {
                    if(text.indexOf(bannedPhrase) !== -1) {
                        root.classList.add('antispoil-blur');
                    }
                });
        }
        else {
            recursiveReplace(child, bannedPhrases);
        }
    }
}

window.onload = async () => {
    if( await Storage.getSetting('enabled') ){
        replace;
    }   
};
window.onscroll = async () => {
    if( await Storage.getSetting('enabled') ){
        replace;
    }   
};