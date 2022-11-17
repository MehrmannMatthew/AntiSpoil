import { testFramework } from './test-framework.mjs';
import fs from 'fs';

fs.readdir('./unit-tests/tests/', (err, files) => {
    if(err) {
        return console.warn(err);
    }
    const promises = [];
    files.forEach(file => {
        if(file !== 'run.mjs' && file !== 'test-framework.mjs') {
            promises.push(import(`./tests/${file}`));
        }
    });
    Promise.all(promises).then(() => {
        testFramework.runTests();
    });
});