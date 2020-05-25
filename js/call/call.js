Function.prototype.call2 = function(context) {
    context = context || window;
    context.fn = this;
    let args = [];
    for(let i = 1;i<arguments.length;i++ ){
        args.push('arguments[' + i + ']');
    }
    let res = eval('context.fn(' + args +')');
    delete context.fn;
    return res;
}

// 测试
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));