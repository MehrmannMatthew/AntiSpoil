function replace() {

    const tags = ["p", "span", "h", "h3", "a"];

    const spoiler = "<h1 style=\"color:#FF0000\">[SPOILER]</h1>";

    chrome.storage.local.get(['banned'], ({ banned }) => {

        const modifiedBanned = banned.map(phrase => phrase.toLowerCase().trim());
        
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