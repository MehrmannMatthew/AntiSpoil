import { testFramework } from './test-framework.mjs';
import fs from 'fs';

fs.readdir('./unit-tests/tests/', (err, files) => {
    if(err) {
        return console.warn(err);
    }
    const promises = [];
    files.forEach(fileName => {
        if(fileName !== 'run.mjs' && fileName !== 'test-framework.mjs') {
            console.log(fileName);
            promises.push(import(`./tests/${fileName}`));
        }
    });
    Promise.all(promises).then(() => {
        testFramework.runTests();
    });
});