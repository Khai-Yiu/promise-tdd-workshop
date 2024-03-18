import MyPromise from './promise';
jest.spyOn(global, 'setTimeout');

describe('MyPromise', () => {
    it('should be a constructor', () => {
        expect(typeof MyPromise).toBe('function');
    });
    it('should have a then method', () => {
        const myPromise = new MyPromise();

        expect(typeof myPromise.then).toBe('function');
    });
    describe('given a promise that resolves', () => {
        describe('immediately', () => {
            it('should resolve with a value', () => {
                const executor = (resolveFunction) => {
                    resolveFunction(1);
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseIsResolved = jest.fn();
                myPromise.then(functionToCallWhenPromiseIsResolved);

                expect(
                    functionToCallWhenPromiseIsResolved
                ).toHaveBeenCalledWith(1);
            });
        });
        describe('after some time', () => {
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
    describe('given a promise that rejects', () => {
        describe('immediately', () => {
            it('calls the registered callback', () => {
                const executor = (resolveFunction, rejectFunction) => {
                    rejectFunction('Rejected');
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseIsRejected = jest.fn();
                myPromise.then(undefined, functionToCallWhenPromiseIsRejected);

                expect(
                    functionToCallWhenPromiseIsRejected
                ).toHaveBeenCalledWith('Rejected');
            });
        });
        describe('after some time', () => {
            beforeAll(() => {
                jest.useFakeTimers();
            });

            afterAll(() => {
                jest.useRealTimers();
            });
            describe('and the callback is registered before it rejects', () => {
                it('should call the registered callback after it rejects', () => {
                    const executor = (resolveFunction, rejectFunction) => {
                        setTimeout(() => {
                            rejectFunction('Reject');
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    const functionToCallWhenPromiseIsRejected = jest.fn();
                    jest.runAllTimers();
                    myPromise.then(
                        undefined,
                        functionToCallWhenPromiseIsRejected
                    );
                    expect(
                        functionToCallWhenPromiseIsRejected
                    ).toHaveBeenCalledWith('Reject');
                });
            });
            describe('and the callback is registered after it rejects', () => {
                it('should call the registered callback immediately', () => {
                    const executor = (resolveFunction, rejectFunction) => {
                        setTimeout(() => {
                            rejectFunction('Reject');
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    const functionToCallWhenPromiseIsRejected = jest.fn();
                    jest.runAllTimers();
                    myPromise.then(
                        undefined,
                        functionToCallWhenPromiseIsRejected
                    );
                    expect(
                        functionToCallWhenPromiseIsRejected
                    ).toHaveBeenCalledWith('Reject');
                });
            });
        });
    });
    it('returns a promise that is immediately resolved to a value', () => {
        const myResolvedPromise = MyPromise.resolve('Resolved');
        expect(myResolvedPromise).toBeInstanceOf(MyPromise);
        expect(myResolvedPromise.state).toBe('fulfilled');
        expect(myResolvedPromise.result).toBe('Resolved');
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
