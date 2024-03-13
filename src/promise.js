const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled'
};

function MyPromise(executor = () => {}) {
    this.then = (functionToCallWhenPromiseIsResolved) => {
        if (this.state === STATE.PENDING) {
            this.functionToCallWhenPromiseIsResolved =
                functionToCallWhenPromiseIsResolved;
        } else if (this.state === STATE.FULFILLED) {
            functionToCallWhenPromiseIsResolved(this.result);
        }
    };

    this.functionToResolvePromise = (result) => {
        if (this.state === STATE.PENDING) {
            this.result = result;
            this.state = STATE.FULFILLED;

            if (this.functionToCallWhenPromiseIsResolved !== undefined) {
                this.functionToCallWhenPromiseIsResolved(result);
            }
        }
    };

    this.state = STATE.PENDING;
    executor(this.functionToResolvePromise);
}

export default MyPromise;
