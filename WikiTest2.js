var searchQuery1 = 'Top Gun Maverick'
var resultsArr = [];


async function getResults(){
    try {
        const results = await searchWikipedia(searchQuery1);
        
        results.query.search.forEach(result =>{
          //create an array filled with the urls
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          const title = result.title;
          resultsArr.push(search(url));   
        })} catch (err) {
        console.log(err);
        alert('Failed to search Wikipedia');
    }
    
}

async function searchWikipedia(searchQuery) {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  return json;
}

async function search(searchQuery) {
  const response = await fetch(searchQuery);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  return json;
}

getResults();


