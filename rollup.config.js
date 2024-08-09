import path from "path"
import ts from "@rollup/plugin-typescript"
// import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser"
// import nodePolyfills from "rollup-plugin-polyfill-node"

export default {
    input: path.resolve(__dirname, "./src/index.ts"),
    output: [
        {
            file: path.resolve(__dirname, './lib/index.esm.js'),
            format: 'es',
            sourcemap: true
        },
        {
            file: path.resolve(__dirname, './lib/index.js'),
            format: 'cjs',
            sourcemap: true,
        }
    ],
    // output: {
    //     file: path.resolve(__dirname, './lib/index.js'),
    //     format: 'umd',
    //     name: 'vitePluginQiniuCDN',
    //     sourcemap: true
    // },
    plugins: [
        ts(),
        // nodePolyfills(),
        // commonjs(), // 将 CommonJS 模块转换为可以被 Rollup 处理的格式
        terser({
            // compress:{
            //     drop_console: false,
            //     drop_debugger: true
            // },
            // remove all comments
            compress: {
                module: true,
                keep_fargs:true,
                keep_fnames:true,
            },
            // compress: false,
            keep_classnames: true,
            keep_fnames: true,
            module: false,
            format: {
                comments: 'some',
                keep_quoted_props: true
            },
        }),

    ]
}


// const path = require('path')
// const ts = require('rollup-plugin-typescript2')
//
// module.exports = {
//     input: path.resolve(__dirname, "./src/index.ts"),
//     output: {
//         file:path.resolve(__dirname, './lib/index.js'),
//         format: 'umd'
//     },
//     plugins:[
//         ts()
//     ]
// }
