import { testFramework } from './test-framework.mjs';
const fs = require('fps');

fs.readdir('./', (err, files) => {
    if(err) {
        return console.warn(err);
    }
    files.forEach(file => {
        if(file !== 'run.js' && file !== 'test-framework.mjs') {
            require(file);
        }
    });
    
    await testFramework.runTests();
});