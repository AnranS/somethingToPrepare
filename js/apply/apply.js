Function.prototype.apply2 = function(context, args) {
    context = context || window;
    context.fn = this;
    let tmp = [];
    let res;
    if(!args) {
        res = context.fn();
    } else {
        for(let i = 0;i<args.length;i++ ){
            tmp.push('arguments[' + i + ']');
        }
        res = eval('context.fn(' + tmp +')');
    }
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

bar.apply2(null); // 2

console.log(bar.apply2(obj, ['kevin', 18]));