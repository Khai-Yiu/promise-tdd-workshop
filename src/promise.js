function MyPromise(executor = () => {}) {
    this.then = (onResolvedFunction) => {
        this.onResolvedFunction = onResolvedFunction;

        if (this.result !== undefined) {
            onResolvedFunction(this.result);
        }
    };

    this.resolveFunction = (result) => {
        this.result = result;

        if (this.onResolvedFunction !== undefined) {
            this.onResolvedFunction(result);
        }
    };

    executor(this.resolveFunction);
}

export default MyPromise;
