import MessageSystem from '../components/message-system.mjs';
import Storage from '../components/storage.mjs';
import extensionContext from '../components/extension-context.mjs';
import wikipediaAPI from '../components/wikipedia-api.mjs';
import safeFetch from '../components/safe-fetch.mjs';

const storage = new Storage();
const messageSystem = new MessageSystem();

extensionContext.runtime.onInstalled.addListener(() => {
  storage.setSetting('enabled', true);
});

messageSystem.addHandler('add-phrase', async ({ keyPhrase }) => {
  await storage.add(keyPhrase, []);
  messageSystem.send('update-ui');
  const relatedPhrases = await wikipediaQuery(keyPhrase);
  for(let i = 0; i < relatedPhrases.length; ++i) {
    if(relatedPhrases[i] === undefined) {
      relatedPhrases.splice(i--, 1);
    }
  }
  await storage.add(keyPhrase, relatedPhrases);
  messageSystem.send('update-ui');
});

async function wikipediaQuery(searchQuery) {
  // settings
  const maxWikipediaPages = 3;
  const relatedWordCount = 10;

  // get black lists
  const englishBlacklist = await safeFetch(extensionContext.runtime.getURL('/dictionary/words-dictionary.json'));
  const wikipediaBlacklist = await safeFetch(extensionContext.runtime.getURL('/dictionary/wikipedia-blacklist.json'));

  // perform a search
  const queryResponse = await wikipediaAPI({
    'action': 'query',
    'list': 'search',
    'prop': 'info',
    'inprop': 'url',
    'srlimit': maxWikipediaPages,
    'srsearch': searchQuery
  });

  const { search } = queryResponse.query;

  const acceptedChars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '-`;
  const dictionary = {};
  for(let i = 0; i < maxWikipediaPages && i < search.length; ++i) {
    // make wikipedia request
    const parseResponse = await wikipediaAPI({
      'action': 'parse',
      'prop': 'wikitext',
      'pageid': search[i].pageid,
    });
    const content = parseResponse.parse.wikitext['*'].toLowerCase().replaceAll(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g, ''); // lowercase and remove all urls

    const weight = 1 / (2 * i + 1);

    // filter content for words and phrases
    let wordIndex = -1;
    for(let charIndex = 0; charIndex < content.length; ++charIndex) {
      const char = content[charIndex];
      if(acceptedChars.indexOf(char) === -1) { // if char is not an alphabetical character
        if(wordIndex !== -1) { // if currently parsing a word
          const phrase = content.slice(wordIndex, charIndex).replaceAll('\'', '').trim();

          // filter words and phrases based on length, wikipedia formatting blacklist, and english words
          const wordsAndPhrases = phrase.split(' ');
          if(wordsAndPhrases.length !== 1) {
            wordsAndPhrases.push(phrase);
          }
          let insertionCount = 0;
          wordsAndPhrases.forEach((string, index) => {
            if(
              string.length > 2 &&
              (index + 1 !== wordsAndPhrases.length || (wordsAndPhrases.length !== 1 && insertionCount !== 0)) &&
              wikipediaBlacklist[string] === undefined &&
              englishBlacklist[string] === undefined
            ) {
              insertionCount += 1;
              if(dictionary[string] === undefined) {
                dictionary[string] = weight; // set word count to 1
              }
              else {
                dictionary[string] += weight; // add 1 to word count
              }
            }
          });
          wordIndex = -1;
        }
      }
      else if(wordIndex === -1) { // if not currently parsing a word
        wordIndex = charIndex;
      }
    }
  }

  // sort weighted words and phrases
  const sort = new Array(relatedWordCount);
  for(const word in dictionary) {
    const count = dictionary[word];
    if(count > 1) {
      let i = 0;
      do {
        const sortWord = sort[i];
        if(count <= dictionary[sortWord]) {
          if(i !== 0) {
            sort.splice(i, 0, word);
            sort.shift();
          }
          break;
        }
      }
      while(++i < relatedWordCount);
      if(i === relatedWordCount) {
        sort.splice(relatedWordCount, 0, word);
        sort.shift();
      }
    }
  }

  return sort;
}