import { test, expect, mock } from '../test-framework.mjs';
import extensionContext from '../../components/extension-context.mjs';
import Storage from '../../components/storage.mjs';

// browser mock setup
const internalBrowserMockedStorage = {};

extensionContext.storage = {
    local: {
        set: async (setObject, resolveCallback) => {
            console.log(setObject);
            for(const key in setObject) {
                internalBrowserMockedStorage[key] = setObject[key];
            }
            mock(...[setObject, resolveCallback]);
            await resolveCallback();
        },
        get: async (storageKeys, callback) => {
            mock(...[storageKeys, callback]);
            const response = {};
            storageKeys.forEach(key => {
                response[key] = internalBrowserMockedStorage[key];
            });
            await callback(response);
        }
    }
};

test('Storage - constructor should call extension context via load', async () => {

    const storage = new Storage();

    const [ storageKeys, callback ] = mock().getArguments();

    expect(storageKeys.indexOf('phrases') !== -1);
    expect(storageKeys.indexOf('settings') !== -1);
    expect(typeof callback === 'function');

});

test('Storage - setSetting() should set a setting and getSetting() should return that value', async () => {

    const storage = new Storage();

    const settingKey = 'key';
    const settingValue = 'value';

    await storage.setSetting(settingKey, settingValue);
    console.log(internalBrowserMockedStorage);
    const value = await storage.getSetting(settingKey);

    console.log('value');
    console.log(value);

    expect(value === settingValue);
});

test('Storage - add() should result in the expected data structure obtained from getPhrases()', async () => {
    
    const storage = new Storage();

    // fixes error with mock data
    await storage.loadFromBrowserStorage();

    storage.add('word1', ['relatedPhrase1', 'relatedPhrase2', 'relatedPhrase3']);
    storage.add('word2', ['relatedPhrase1', 'relatedPhrase2', 'relatedPhrase3']);

    const [ keyphrase1, keyphrase2 ] = await storage.getPhrases();

    expect(keyphrase1.keyPhrase === 'word1');
    expect(keyphrase1.relatedPhrases[0] === 'relatedPhrase1');

    expect(keyphrase2.keyPhrase === 'word2');
    expect(keyphrase2.relatedPhrases[1] === 'relatedPhrase2');

});

test('Storage - save should call extension context', async () => {

    const storage = new Storage();

    storage.saveToBrowserStorage();

    const [ setObject, callback ] = mock().getArguments();

    expect(Array.isArray(setObject.phrases));
    expect(typeof setObject.settings === 'object');
    expect(typeof callback === 'function');

});