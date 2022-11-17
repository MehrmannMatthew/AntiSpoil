import safeFetch from './safe-fetch.js';

async function wikipediaAPI(params) {
  
    // takes in params as argument, returns json of request
    
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

export default wikipediaAPI;