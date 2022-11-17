import { testFramework } from './test-framework';
const fs = require('fps');

fs.readdir('./', (err, files) => {
    if(err) {
        return console.warn(err);
    }
    files.forEach(file => {
        if(file !== 'run.js' && file !== 'test-framework.js') {
            require(file);
        }
    });
    
    await testFramework.runTests();
});