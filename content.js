const className = 'anti-spoil-blur-1aa2e7f0be3cb32e13e5c84d42bb23c7';
var oldPreviousReplaceClass = generatePRC();
const extensionContext = window.chrome || window.browser;

extensionContext.runtime.onMessage.addListener(({ signature }) => {
    if(signature === 'replace') {
        replace();
    }
});

function generatePRC() {
    return `anti-spoil-blur-prc-${new Date().getTime()}`;
}

function replace() {
    extensionContext.storage.local.get(['settings', 'phrases'], ({ settings, phrases }) => {

        // generate unique time-based key to determine whether blur effect is new or old
        // this allows us to remove blur on elements that no longer need it without overwhelming the browser render process
        const previousReplaceClass = generatePRC();

        // if enabled, add blur effect
        if(settings.enabled) {
            const bannedPhrases = [];

            //this loop adds all the phrases and related phrases from our storage system into a single array to more easily compare with web page content for blocking spoiler
            for(const phraseObj of phrases){
                bannedPhrases.push(phraseObj.keyPhrase.toLowerCase()); //adds user-inputted keyphrase strings into our local array
                for(const relatedPhrase of phraseObj.relatedPhrases){
                    bannedPhrases.push(relatedPhrase.toLowerCase()); //adds algorithm-generated related phrases to our local array
                }
            }
            //this function searches through the webpage starting from the body, and hides all spoiler content
            recursiveReplace(document.body, bannedPhrases, previousReplaceClass);
        }
        
        // remove all blur from phrases no longer blurred by the current list
        const elements = document.getElementsByClassName(oldPreviousReplaceClass);
        while(elements.length !== 0) {
            const element = elements[0];
            element.classList.remove(className);
            element.classList.remove(oldPreviousReplaceClass);
        }
        oldPreviousReplaceClass = previousReplaceClass;
    });
}

function recursiveReplace(root, bannedPhrases, prc) {
    for(let i = 0; i < root.childNodes.length; ++i) {
        const child = root.childNodes[i];
        if(child.nodeType === Node.TEXT_NODE) {
                const text = child.wholeText.toLowerCase();
                bannedPhrases.forEach(bannedPhrase => {
                    if(text.indexOf(bannedPhrase) !== -1) {
                        root.classList.add(className);
                        root.classList.add(prc);
                        root.classList.remove(oldPreviousReplaceClass);
                    }
                });
        }
        else {
            recursiveReplace(child, bannedPhrases, prc);
        }
    }
}

window.onload =  replace;
window.onscroll =  replace;