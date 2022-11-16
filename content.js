function replace() {

    const tags = ["p", "span", "h", "h3", "a"];

    const spoiler = "<h1 style=\"color:#FF0000\">[SPOILER]</h1>";

    chrome.storage.local.get(['phrases'], ({ phrases }) => {
        const modifiedBanned = [];
        let banIndex = 0;

        for(let phraseObj of phrases){
            modifiedBanned[banIndex++] = phraseObj.keyPhrase; //adds user-inputted keyphrase strings into our local array
            for(let relatedPhrase of phraseObj.relatedPhrases){
                modifiedBanned[banIndex++] = relatedPhrase; //adds algorithm-generated related phrases to our local array
            }
        }

        tags.forEach(tag => {
            const currentTag = document.getElementsByTagName(tag);
            for(const elt of currentTag) {
                modifiedBanned.forEach(phrase => {
                    if(elt.innerHTML.toLowerCase().indexOf(phrase) !== -1) {
                        elt.innerHTML = spoiler;
                    }
                });
            }
        });
    });
}

window.onload = replace;
window.onscroll = replace;