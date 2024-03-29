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
    const arrayOfResults = [];
    for (let i = 0; i < arrayOfPromises.length; i++) {
        arrayOfPromises[i].then(
            (resolveValue) => {
                arrayOfResults[i] = {
                    status: 'fulfilled',
                    value: resolveValue
                };
            },
            (rejectValue) => {
                arrayOfResults[i] = {
                    status: 'rejected',
                    value: rejectValue
                };
            }
        );
    }

    return MyPromise.resolve(arrayOfResults);
};

MyPromise.race = function (arrayOfPromisesAndNonPromises) {
    if (arrayOfPromisesAndNonPromises.length === 0) {
        const newPromise = new MyPromise((resolve, reject) => {});
        newPromise.isDummyPromise = true;

        return newPromise;
    }

    let result;
    let stateOfFirstPromiseOrNonPromiseSettled;
    for (
        let i = 0;
        i < arrayOfPromisesAndNonPromises.length &&
        !stateOfFirstPromiseOrNonPromiseSettled;
        i++
    ) {
        if (arrayOfPromisesAndNonPromises[i] instanceof MyPromise) {
            arrayOfPromisesAndNonPromises[i].then(
                (resolvedValue) => {
                    result = resolvedValue;
                    stateOfFirstPromiseOrNonPromiseSettled = STATE.FULFILLED;
                },
                (rejectedValue) => {
                    result = rejectedValue;
                    stateOfFirstPromiseOrNonPromiseSettled = STATE.REJECTED;
                }
            );
        } else {
            result = arrayOfPromisesAndNonPromises[i];
            stateOfFirstPromiseOrNonPromiseSettled = STATE.FULFILLED;
        }
    }

    if (stateOfFirstPromiseOrNonPromiseSettled === STATE.FULFILLED) {
        return MyPromise.resolve(result);
    } else if (stateOfFirstPromiseOrNonPromiseSettled === STATE.REJECTED) {
        return MyPromise.reject(result);
    }
};

export default MyPromise;
