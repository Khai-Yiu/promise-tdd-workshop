import MyPromise from './promise';

describe('MyPromise', () => {
    it('should be a constructor', () => {
        expect(typeof MyPromise).toBe('function');
    });
    it('should have a then method', () => {
        const myPromise = new MyPromise();

        expect(typeof myPromise.then).toBe('function');
    });
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
