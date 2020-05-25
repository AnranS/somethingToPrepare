Function.prototype.bind2 = function (context) {
    let self = this;
    // 取后面的参数
    let args = Array.prototype.slice.call(arguments, 1);
    return function () {
        // 取函数调用时传入的参数
        let bindArgs = Array.prototype.slice.call(arguments);
        // 合并调用bind和函数调用时传入的参数
        return self.apply(context, args.concat(bindArgs));
    }

}

// 测试
var foo = {
    value: 1
};

function bar() {
	return this.value;
}

var bindFoo = bar.bind(foo);

console.log(bindFoo()); // 1