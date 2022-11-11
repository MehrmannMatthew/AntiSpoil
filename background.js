import MessageSystem from './components/message-system.js';

const messageSystem = new MessageSystem();

messageSystem.addHandler('test', body => {
  console.log('received', body);
});

async function safeFetch(url) {
  try {
    const response = await fetch(url);
    if(!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }
  catch(err) {
    throw new Error(err);
  }
}

async function wikipediaAPI(params) {
  /*
    takes in params as argument, returns json of request
  */
  let url = 'https://en.wikipedia.org/w/api.php?';
  const combinedParams = {
    'format': 'json',
    'utf8': '',
    'origin': '*',
    ...params
  };
  for(const paramKey in combinedParams) {
    url += `${paramKey}=${combinedParams[paramKey]}&`;
  }
  return safeFetch(url);
}

async function wikipediaQuery(searchQuery) {
  console.time('time test');
  // settings
  const maxWikipediaPages = 3;
  const relatedWordCount = 30;

  // get black lists
  const englishBlacklist = await safeFetch(chrome.runtime.getURL('/dictionary/words-dictionary.json'));
  const wikipediaBlacklist = await safeFetch(chrome.runtime.getURL('/dictionary/wikipedia-blacklist.json'));

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
          let phrase = content.slice(wordIndex, charIndex).replaceAll('\'', '').trim();

          // filter words and phrases based on length, wikipedia formatting blacklist, and english words
          const wordsAndPhrases = phrase.split(' ');
          if(wordsAndPhrases.length !== 0) {
            wordsAndPhrases.push(phrase);
          }
          wordsAndPhrases.forEach(string => {
            if(string.length > 2 && wikipediaBlacklist[string] === undefined && englishBlacklist[string] === undefined) {
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

  console.log(sort.map(word => {
    const score = dictionary[word].toString();
    const decimalIndex = score.indexOf('.');
    return `${word} = ${decimalIndex === -1 ? score : score.slice(0, decimalIndex + 3)}`;
  }));

  console.timeEnd('time test');

  return sort;
}

console.clear();
wikipediaQuery('jurassic park');