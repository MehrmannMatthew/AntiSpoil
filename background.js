//import MessageSystem from './components/message-system.js';
//import EnglishDictionary from './english-dictionary.js';

// const messageSystem = new MessageSystem();

//messageSystem.addHandler('test', body => {
//  console.log('received', body);
//});

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
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

async function wikipediaQuery(searchQuery) {
  const queryResponse = await wikipediaAPI({
    'action': 'query',
    'list': 'search',
    'prop': 'info',
    'inprop': 'url',
    'srlimit': '10',
    'srsearch': searchQuery
  });

  const { search } = queryResponse.query;

  const alphabetical = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const dictionary = {};
  const pageids = [search[0].pageid];
  for(let i = 0; i < pageids.length; ++i) {
    const parseResponse = await wikipediaAPI({
      'action': 'parse',
      'prop': 'wikitext',
      'pageid': pageids[i],
    });
    const content = parseResponse.parse.wikitext['*'];
    let wordIndex = -1;
    for(let j = 0; j < content.length; ++j) {
      const char = content[j];
      if(alphabetical.indexOf(char) === -1) { // if char is not an alphabetical character
        if(wordIndex !== -1) { // if currently parsing a word
          const word = content.slice(wordIndex, j);
          if(dictionary[word] === undefined) {
            dictionary[word] = 1; // set word count to 1
          }
          else {
            dictionary[word] += 1; // add 1 to word count
          }
          wordIndex = -1;
        }
      }
      else if(wordIndex === -1) { // if not currently parsing a word
        wordIndex = j;
      }
    }
  }
  console.log(dictionary);
}

wikipediaQuery('zootopia');