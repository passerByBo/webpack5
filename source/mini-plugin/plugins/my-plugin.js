module.exports = class MyPlugin{
    constructor(options){
        console.log(options)
    }

    apply(compiler){
        console.log('my plugin run...')
    }
}