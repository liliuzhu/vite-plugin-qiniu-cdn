import path from "path"
import ts from "@rollup/plugin-typescript"
// import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser"
// import nodePolyfills from "rollup-plugin-polyfill-node"

import del from 'rollup-plugin-delete'

export default {
    input: path.resolve(__dirname, "./src/index.ts"),
    output: [
        {
            file: path.resolve(__dirname, './lib/index.mjs'),
            format: 'es',
            sourcemap: false
        },
        {
            file: path.resolve(__dirname, './lib/index.cjs'),
            format: 'cjs',
            sourcemap: false,
        }
    ],
    // output: {
    //     file: path.resolve(__dirname, './lib/index.js'),
    //     format: 'umd',
    //     name: 'vitePluginQiniuCDN',
    //     sourcemap: true
    // },
    plugins: [
        del({
            targets: 'lib',
            verbose: true
        }),
        ts(),
        // nodePolyfills(),
        // commonjs(), // 将 CommonJS 模块转换为可以被 Rollup 处理的格式
        terser({
            mangle: false,   // 禁用变量名混淆
            compress: {
                drop_console: ['log', 'info'],
                drop_debugger: true
            },
            // keep_classnames: true,
            // keep_fnames: true,
            // module: false,
            format: {
                comments: 'some',
                beautify: true,   // 保持代码可读
                keep_quoted_props: true,
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
