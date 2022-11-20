async function safeFetch(url) {
    try {
      const response = await fetch(url);
      if(!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    }
    catch(err) {
      console.warn(err);
      return {};
    }
  }

  export default safeFetch;