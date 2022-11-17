function f(...ints) {
    // formatting console strings in node
    return ints.map(int => `\x1b[${int}m`).join('');
}

class Test {
    constructor(description, callback) {
        this.description = description;
        this.callback = callback;
    }
}

class TestFramework {
    constructor() {
        this.tests = [];
    }
    addTest(description, callback) {
        this.tests.push(new Test(description, callback));
        // add test from another file to instance's list  of tests
    }
    runTests() {
        return new Promise(resolveAll => {
            const results = new Array(this.tests.length); // array to hold outputs
            const promises = this.tests.map(({ description, callback }, index) => new Promise(async (resolve) => {
                // map promises with testing capabilities and output text
                try {
                    await callback();
                    results[index] = `${f(1,42)} [PASSED] ${f(49)} - ${description}${f(22)}`;
                    resolve();
                }
                catch(err) {
                    results[index] = `${f(1,41)} [FAILED] ${f(49)} - ${description}${f(22)}: ${err === 'test-framework-expect-failed' ? 'expect statement failure' : err}`;
                    resolve();
                }
            }));
            Promise.all(promises) // run all the tests
            .then(() => {
                results.forEach(result => { // print the outputs
                    console.log(result);
                });
                resolveAll(); // finish runTests
            });
        });
    }
}

export const testFramework = new TestFramework();

export function expect(statement) {
    if(statement !== true) {
        throw 'test-framework-expect-failed';
    }
}

export function test(description, callback) {
    testFramework.addTest(description, callback);
}