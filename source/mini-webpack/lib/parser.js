/**
 * 1. 将代码转换成AST，然后将AST转换成ES5
 * 2. 分析依赖
 */

 const fs = require('fs');
 // const traverse = require('babel-traverse').default;
 const { parse, transformFromAstSync, traverse } = require('@babel/core');
 
 module.exports = {
   // es5 -> AST
   getAST: (path) => {
     const source = fs.readFileSync(path, 'utf-8');
 
     return parse(source, {
       sourceType: 'module',
     });
   },
   // 获取依赖
   getDependencies: (ast) => {
     const dependencies = [];
 
     traverse(ast, {
       ImportDeclaration: ({ node }) => {
         dependencies.push(node.source.value);
       },
     });
 
     return dependencies;
   },
   //ast->es5
   transform: (ast) => {
     const res = transformFromAstSync(ast, null, {
       presets: ['@babel/preset-env'],
     });
 
     return res.code;
   },
 };