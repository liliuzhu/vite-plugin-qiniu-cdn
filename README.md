# vite-plugin-qiniu-cdn
vite 打包完成后上传七牛插件



[![Build Status](https://img.shields.io/circleci/project/liliuzhu/vite-plugin-qiniu-cdn/master.svg?style=flat-square)](https://circleci.com/gh/liliuzhu/vite-plugin-qiniu-cdn)
[![CircleCI](https://circleci.com/gh/liliuzhu/vite-plugin-qiniu-cdn.svg?style=svg)](https://circleci.com/gh/liliuzhu/vite-plugin-qiniu-cdn)
[![npm version](https://img.shields.io/npm/v/vite-plugin-qiniu-cdn.svg?style=flat-square)](https://www.npmjs.com/package/vite-plugin-qiniu-cdn)
[![npm downloads](https://img.shields.io/npm/dt/vite-plugin-qiniu-cdn.svg?style=flat-square)](https://www.npmjs.com/package/vite-plugin-qiniu-cdn)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-qiniu-cdn.svg?style=flat-square)](https://www.npmjs.com/package/vite-plugin-qiniu-cdn)
[![npm license](https://img.shields.io/npm/l/vite-plugin-qiniu-cdn.svg?style=flat-square)](https://www.npmjs.com/package/vite-plugin-qiniu-cdn)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)


使用方法


# Installation

## npm

```bash

$ npm i vite-plugin-qiniu-cdn -dev

```
## yarn

```bash

$ yuarn add vite-plugin-qiniu-cdn -D

```

# Usage

vite.config.js:

```javascript

import vitePluginQiniuCdn from 'vite-plugin-qiniu-cdn'

export default defineConfig({
  plugins: [
    vitePluginQiniuCdn({
      enable: true,
      accessKey: 'accessKey', // 七牛账号accessKey
      secretKey: 'secretKey', // 七牛账号secretKey
      exclude: /index\.html$|manifest\.[0-9a-zA-Z]+\.js$/, // 排除的文件
      bucket: 'bucket', //七牛空间
      path: 'vite-plugin-qiniu/online/', //七牛空间下的路径

    })
  ]
})
```
