let a = 1;
let b = 2;

//ES6需要使用babel进行编译
//webpack只是js打包工具
class Student {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }
}