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
    }
    runTests() {
        return new Promise(resolveAll => {
            const results = new Array(this.tests.length);
            const promises = this.tests.map(({ description, callback }, index) => {

                return new Promise(resolve => {
                    try {
                        callback().then(() => {
                            results[index] = `[PASSED] - ${description}`;
                            resolve();
                        });
                    }
                    catch(err) {
                        if(err === 'test-framework-expect-failed') {
                            results[index] = `[FAILED] - ${description}: expect statement failed`;
                        }
                        else {
                            results[index] = `[FAILED] - ${description}: ${err}`;
                        }
                        resolve();
                    }
                });
            });
            Promise.all(promises)
            .then(() => {
                results.forEach(result => {
                    console.log(result);
                });
                resolveAll();
            });
        });
    }
}

export const testFramework = new TestFramework();

export function expect(statement) {
    if(statement !== true) {
        throw new Error('test-framework-expect-failed');
    }
}

export function test(description, callback) {
    testFramework.addTest(description, callback);
}