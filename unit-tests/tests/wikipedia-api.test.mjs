import { test, expect } from '../test-framework.mjs';
import wikipediaAPI from '../../components/wikipedia-api.mjs';

test('Wikipedia API - params should result in requested response', async () => {

    const requestedArticlesAmount = 5;

    const response = await wikipediaAPI({
        'action': 'query',
        'list': 'search',
        'prop': 'info',
        'inprop': 'url',
        'srlimit': requestedArticlesAmount,
        'srsearch': 'computers'
      });

    expect(response.query.search.length === requestedArticlesAmount);
});