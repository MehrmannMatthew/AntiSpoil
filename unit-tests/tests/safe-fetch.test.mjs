import { test, expect } from '../test-framework.mjs';
import safeFetch from '../../components/safe-fetch.mjs';

test('Safe Fetch - should return json example response', async () => {

    const jsonResponse = await safeFetch('https://reqbin.com/echo/get/json');

    expect(JSON.stringify(jsonResponse) === '{"success":"true"}');
});

test('Safe Fetch - should fail gracefully with an empty object returned when passed a false url', async () => {
    const jsonResponse = await safeFetch('false url');

    expect(JSON.stringify(jsonResponse) === '{}');
});