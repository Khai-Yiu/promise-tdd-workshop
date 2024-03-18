import MyPromise from './promise';
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('MyPromise', () => {
    it('should be a constructor', () => {
        expect(typeof MyPromise).toBe('function');
    });
    it('should have a then method', () => {
        const myPromise = new MyPromise();

        expect(typeof myPromise.then).toBe('function');
    });
    describe('given a promise that resolves immediately', () => {
        it('should resolve with a value', () => {
            const executor = (resolveFunction) => {
                resolveFunction(1);
            };
            const myPromise = new MyPromise(executor);
            const functionToCallWhenPromiseIsResolved = jest.fn();
            myPromise.then(functionToCallWhenPromiseIsResolved);

            expect(functionToCallWhenPromiseIsResolved).toHaveBeenCalledWith(1);
        });
    });
    describe('given a promise that resolves after some time', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.useRealTimers();
        });
        describe('and the callback is registered before it resolves', () => {
            it('calls the registered callback when it resolves', () => {
                const executor = (resolveFunction) => {
                    setTimeout(() => {
                        resolveFunction(1);
                    }, 1000);
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseIsResolved = jest.fn();
                myPromise.then(functionToCallWhenPromiseIsResolved);
                jest.runAllTimers();
                expect(
                    functionToCallWhenPromiseIsResolved
                ).toHaveBeenCalledWith(1);
            });
        });
        describe('and the callback is registered after it resolves', () => {
            it('calls the registered callback immediately', () => {
                const executor = (resolveFunction) => {
                    setTimeout(() => {
                        resolveFunction(1);
                    }, 10000);
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseIsResolved = jest.fn();
                jest.runAllTimers();
                myPromise.then(functionToCallWhenPromiseIsResolved);
                expect(
                    functionToCallWhenPromiseIsResolved
                ).toHaveBeenCalledWith(1);
            });
        });
    });
});

/* Possible test cases:
 * Resolve value asynchronously
 * Reject
 * Add a catch method
 * Calling then() returns a promise
 * Chaining calls
 *      multiple then()
 *      then(), catch()
 *      then(), catch(), then()
 * Reject if error occurs in executor
 */
