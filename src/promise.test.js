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
    it('returns a promise that is immediately rejected with a reason', () => {
        const callback = jest.fn();
        const myRejectedPromise = MyPromise.reject('Rejected');
        myRejectedPromise.then(undefined, callback);

        expect(myRejectedPromise).toBeInstanceOf(MyPromise);
        expect(callback).toHaveBeenCalledWith('Rejected');
    });
    describe('given an array of promises passed to MyPromise.all()', () => {
        it('resolves to an empty array given an empty array', () => {
            const arrayOfPromises = [];
            const callback = jest.fn();
            const newPromise = MyPromise.all(arrayOfPromises);
            newPromise.then(callback);
            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([]);
        });
        it('resolves to an array of results given all promises resolve', () => {
            const arrayOfPromises = [
                MyPromise.resolve(1),
                MyPromise.resolve(2),
                MyPromise.resolve(3)
            ];
            const callback = jest.fn();
            const newPromise = MyPromise.all(arrayOfPromises);
            newPromise.then(callback);

            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([1, 2, 3]);
        });
        it('rejects if any promise rejects', () => {
            const arrayOfPromises = [
                MyPromise.resolve(1),
                MyPromise.reject('Rejected'),
                MyPromise.resolve(2)
            ];
            const callback = jest.fn();
            const newPromise = MyPromise.all(arrayOfPromises);
            newPromise.then(undefined, callback);

            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith('Rejected');
        });
        describe('where some promises settle at different times', () => {
            beforeAll(() => {
                jest.useFakeTimers();
            });

            afterAll(() => {
                jest.useRealTimers();
            });

            it('resolves to an array of results matching the order of promises in the array', () => {
                const arrayOfPromises = [
                    MyPromise.resolve(1),
                    new MyPromise((resolve) => {
                        setTimeout(() => resolve(2), 1000);
                    }),
                    MyPromise.resolve(3)
                ];
                const callback = jest.fn();
                const newPromise = MyPromise.all(arrayOfPromises);
                newPromise.then(callback);
                jest.runAllTimers();

                expect(newPromise).toBeInstanceOf(MyPromise);
                expect(callback).toHaveBeenCalledWith([1, 2, 3]);
            });
        });
    });
    describe('given an array of promises passed to MyPromise.allSettled', () => {
        it('resolves to an empty array given an empty array', () => {
            const arrayOfPromises = [];
            const callback = jest.fn();
            const newPromise = MyPromise.allSettled(arrayOfPromises);
            newPromise.then(callback);

            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([]);
        });
        it('resolves an array of results given a promise either resolves or rejects', () => {
            const arrayOfPromises = [
                MyPromise.resolve(1),
                MyPromise.reject('Rejected')
            ];
            const callback = jest.fn();
            const newPromise = MyPromise.allSettled(arrayOfPromises);
            newPromise.then(callback);

            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([
                { status: 'fulfilled', value: 1 },
                { status: 'rejected', value: 'Rejected' }
            ]);
        });
        it('resolves an array of results matching the order of the promises in the array', () => {
            jest.useFakeTimers();

            const arrayOfPromises = [
                new MyPromise((resolve) => {
                    setTimeout(() => {
                        resolve(1);
                    }, 1000);
                }),
                MyPromise.reject('Rejected')
            ];
            const callback = jest.fn();
            const newPromise = MyPromise.allSettled(arrayOfPromises);
            newPromise.then(callback);
            jest.runAllTimers();

            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([
                { status: 'fulfilled', value: 1 },
                { status: 'rejected', value: 'Rejected' }
            ]);

            jest.useRealTimers();
        });
    });
    describe('given an array of promises passed to MyPromise.race()', () => {
        it("returns a promise that's not settled given an empty array", () => {
            const arrayOfPromises = [];
            const callback = jest.fn();
            const newPromise = MyPromise.race(arrayOfPromises);
            newPromise.then(callback);

            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(newPromise.state).toBe('pending');
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
