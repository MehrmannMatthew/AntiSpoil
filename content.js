const className = 'anti-spoil-blur-1aa2e7f0be3cb32e13e5c84d42bb23c7';
const extensionContext = (browser)? browser : chrome;

function replace() {
    extensionContext.storage.local.get(['settings', 'phrases'], ({ settings, phrases }) => {
        if(settings.enabled) {
            const bannedPhrases = [];

            //this loop adds all the phrases and related phrases from our data structure into a single array to more easily compare with web page content for blocking spoiler
            for(let phraseObj of phrases){
                bannedPhrases.push(...phraseObj.keyPhrase.toLowerCase().split(' ')); //adds user-inputted keyphrase strings into our local array
                for(let relatedPhrase of phraseObj.relatedPhrases){
                    bannedPhrases.push(...relatedPhrase.toLowerCase().split(' ')); //adds algorithm-generated related phrases to our local array
                }
            }
            
            //this function searches through the webpage starting from the body, and hides all spoiler content
            recursiveReplace(document.body, bannedPhrases);
        }
        else {
            const elements = document.getElementsByClassName(className);
            for(let i = 0; i < elements.length; ++i) {
                elements[i].classList.remove(className);
            }
        }
    });
}

function recursiveReplace(root, bannedPhrases) {
    for(let i = 0; i < root.childNodes.length; ++i) {
        const child = root.childNodes[i];
        if(child.nodeType === Node.TEXT_NODE) {
                const text = child.wholeText.toLowerCase();
                bannedPhrases.forEach(bannedPhrase => {
                    if(text.indexOf(bannedPhrase) !== -1) {
                        root.classList.add(className);
                    }
                });
        }
        else {
            recursiveReplace(child, bannedPhrases);
        }
    }
}

window.onload =  replace;
window.onscroll =  replace;