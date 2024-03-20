const STATE = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
};

function MyPromise(executor = () => {}) {
    this.then = (
        functionToCallWhenPromiseIsResolved,
        functionToCallWhenPromiseIsRejected
    ) => {
        if (this.state === STATE.PENDING) {
            this.functionToCallWhenPromiseIsResolved =
                functionToCallWhenPromiseIsResolved;
            this.functionToCallWhenPromiseIsRejected =
                functionToCallWhenPromiseIsRejected;
        } else if (this.state === STATE.FULFILLED) {
            functionToCallWhenPromiseIsResolved(this.result);
        } else if (this.state === STATE.REJECTED) {
            functionToCallWhenPromiseIsRejected(this.result);
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

    this.functionToRejectPromise = (result) => {
        if (this.state === STATE.PENDING) {
            this.result = result;
            this.state = STATE.REJECTED;

            if (this.functionToCallWhenPromiseIsRejected !== undefined) {
                this.functionToCallWhenPromiseIsRejected(result);
            }
        }
    };

    this.state = STATE.PENDING;
    executor(this.functionToResolvePromise, this.functionToRejectPromise);
}

MyPromise.resolve = function (result) {
    const executor = (resolveFunction) => {
        resolveFunction(result);
    };

    return new MyPromise(executor);
};

MyPromise.reject = function (result) {
    const executor = (resolveFunction, rejectFunction) => {
        rejectFunction(result);
    };

    return new MyPromise(executor);
};

MyPromise.all = function (arrayOfPromises) {
    const arrayOfResults = [];
    let rejectedPromiseResult;
    let isRejected = false;
    for (let i = 0; i < arrayOfPromises.length && !isRejected; i++) {
        arrayOfPromises[i].then(
            (resolveValue) => {
                arrayOfResults[i] = resolveValue;
            },
            (rejectValue) => {
                rejectedPromiseResult = rejectValue;
                isRejected = true;
            }
        );
    }

    return isRejected
        ? MyPromise.reject(rejectedPromiseResult)
        : MyPromise.resolve(arrayOfResults);
};

MyPromise.allSettled = function (arrayOfPromises) {
    return MyPromise.resolve([]);
};

export default MyPromise;
