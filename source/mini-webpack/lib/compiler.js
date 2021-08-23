/**
 * 实现模块的构建和资源的输出
 */

const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const { getAST, getDependencies, transform } = require('./parser.js');

module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options;

        this.entry = entry;
        this.output = output;
        this.modules = [];
    }

    run() {
        const entryModule = this.buildModule(this.entry, true);
        this.modules.push(entryModule);

        for (const module of this.modules) {
            for (const dependence of module.dependencies) {
                this.modules.push(this.buildModule(dependence))
            }
        }
        this.emitFiles();
    }

    /**
     * 构建模块
     * @param {*} modulePath 构建模块的路径 
     * @param {*} isEntry 是否是入口模块
     */
    buildModule(modulePath, isEntry) {
        let ast;
        if (isEntry) {
            ast = getAST(modulePath);
        } else {
            const absoletePath = path.join(process.cwd(), './src', modulePath);
            ast = getAST(absoletePath);
        }

        return {
            modulePath, //模块路径作为模块名称
            dependencies: getDependencies(ast),
            source: transform(ast)
        }
    }

    /**
     * 输出文件
     */
    emitFiles() {
        //加载输出文件路径
        const outputPath  = path.join(this.output.path, this.output.filename);
        let modules = '';

        //遍历所有模块，将模块都以key-walue（key是路径，value为code代码）方式保存在modules中，使用IIFE的方式传入modules
        for (const module of this.modules) {
            modules += `'${module.modulePath}':function(require, module, exports){${module.source}},`
        }

        //组织模块包
        const bundle = `
                (function(modules){
                    function require(modulePath){
                        var fn = modules[modulePath];
                        var module = {exports:{}};
                        
                        fn(require, module, module.exports);

                        return module.exports;
                    }
                    require('${this.entry}')
                })({${modules}})
        `

        fs.writeFileSync(outputPath,bundle, 'utf-8');
        console.log('--------------------打包完成--------------------')
    }
}