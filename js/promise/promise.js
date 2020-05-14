class APromise {
    static PENDING = 'pending';
    static FULFILLED = "fulfilled";
    static REJECTED = "rejected";

    constructor(executor) {
        // 存储当前promise的状态
        this.status = APromise.PENDING;
        // promise的值
        this.value = null;
        // 保存peding状态时的处理函数
        this.callbacks = [];
        // 避免传入的函数执行出现异常
        try {
            executor(this.resolve, this.reject);
        } catch (error) {
            // 出现职场直接状态设置为reject
            this.reject(error);
        }
    }

    // 静态resolve
    static resolve(value) {
        return new APromise((resolve, reject) => {
            if (value instanceof APromise) {
                value.then(resolve, reject);
            } else {
                resolve(value);
            }
        });
    }

    // 静态reject
    static reject(reason) {
        return new APromise((_, reject) => {
            reject(reason);
        });
    }

    // Rromise.all()方法实现 
    static all(promises) {
        let resolves = [];
        return new APromise((resolve, reject) => {
            promises.forEach((promise, index) => {
                promise.then(
                    value => {
                        resolves.push(value);
                        // 当所有promise都resolve
                        if (resolves.length == promises.length) {
                            resolve(resolves);
                        }
                    },
                    reason => {
                        reject(reason);
                    }
                );
            });
        });
    }

    // promise.race()方法实现
    static race(promises) {
        return new APromise((resolve, reject) => {
            promises.map(promise => {
                promise.then(value => {
                    resolve(value);
                });
            });
        });
    }

    resolve = (value) => {
        // 仅当状态为peding时可以变为fulfilled确保状态只可以改变一次
        if (this.status === APromise.PENDING) {
            this.status = APromise.FULFILLED;
            this.value = value;
            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onFulfilled(value);
                });
            });
        }
    }

    reject = (value) => {
        // // 仅当状态为peding时可以变为reject确保状态只可以改变一次
        if (this.status === APromise.PENDING) {
            this.status = APromise.REJECTED;
            this.value = value;
            setTimeout(() => {
                this.callbacks.map(callback => {
                    callback.onRejected(value);
                });
            });
        }
    }
    // 复用逻辑，判断返回值得类型
    parse = (promise, result, resolve, reject) => {
        // 如果两次的promise一样抛出异常
        if (promise === result) {
            throw new TypeError("Chaining cycle detected for promise");
        }
        try {
            if (result instanceof APromise) {
                result.then(resolve, reject);
            } else {
                resolve(result);
            }
        } catch (error) {
            reject(error);
        }
    }

    then = (onFulfilled, onRejected) => {
        if (typeof onFulfilled != "function") {
            onFulfilled = value => value;
        }
        if (typeof onRejected != "function") {
            onRejected = error => error;
        }
        let promise = new APromise((resolve, reject) => {
            if (this.status === APromise.PENDING) {
                this.callbacks.push({
                    onFulfilled: value => {
                        this.parse(promise, onFulfilled(this.value), resolve, reject);
                    },
                    onRejected: value => {
                        this.parse(promise, onRejected(this.value), resolve, reject);
                    }
                });
            }
            if (this.status === APromise.FULFILLED) {
                setTimeout(() => {
                    this.parse(promise, onFulfilled(this.value), resolve, reject);
                });
            }
            if (this.status === APromise.REJECTED) {
                setTimeout(() => {
                    this.parse(promise, onRejected(this.value), resolve, reject);
                });
            }
        })
        return promise;
    }
}
let promise = new APromise((resolve, reject) => {
    setTimeout(() => {
        resolve('安然');
        console.log('啦啦啦');
    });
    // reject('error');
})
promise.then(
    value => console.log(value),
    reason => console.log(reason)
);
console.log('执行');