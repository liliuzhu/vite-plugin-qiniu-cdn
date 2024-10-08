

/*!
 * vite-plugin-qiniu-cnd
 * (c) 2024 liliuzhu <liliuzhu1992@163.com>
 * Released under the MIT License.
 */



import type { PluginOption } from 'vite'
import path from "path";
import fs from "fs";
import QiniuPlugin from './qiniu-plugin'
import type { Option, File } from './vite-plugin-qiniu'


const defaultOptions:Option = {
   enable: true,
   accessKey: '',
   secretKey: '',
   bucket: '',
   path: '/',
   zone:'',
   // sourceFilesDir: '/dist',
   exclude: /index\.html$/,
   root: '/'
}

function getFilePaths (dir:string, sourceFilesDir:string = dir):Array<File> {
   const files:Array<string> = fs.readdirSync(dir);
   return files.map((item:string) => {
      const filePath = `${dir}/${item}`;
      const stat = fs.lstatSync(filePath);
      if (stat.isDirectory()) {
         return getFilePaths(filePath, sourceFilesDir) as Array<File>;
      } else if(stat.isFile()) {
         // return !sourceFilesDir ? filePath : filePath.replace(`${sourceFilesDir}/`, '');
         // let file = {}
         // file[] = filePath
         return {
            name: !sourceFilesDir ? item : filePath.replace(`${sourceFilesDir}/`, ''),
            existsAt: filePath
         }
      }
   }).flat() as Array<File>
}
export default function vitePluginQiniuCDN(propOption: Option): PluginOption {
   const option = Object.assign({}, defaultOptions, propOption)
   return {
      name: 'vite-plugin-qiniu-cdn', // 必须的，将会在 warning 和 error 中显示
      enforce: 'post',
      apply: 'build',
      // buildEnd(){
      //    console.log('*****************************buildEnd', arguments)
      // },
      // options(options){
      //    console.log('options', arguments)
      // },
      configResolved(config) {
         const sourceFilesDir = path.resolve(config.root, config.build.outDir)
         option.sourceFilesDir = option.sourceFilesDir || sourceFilesDir
         // 校验必填的列
         const vaildField = ['accessKey', 'secretKey', 'bucket', 'path'];
         vaildField.forEach(field => {
            let val = option[field];
            if (!val) {
               console.warn(` 插件 参数${field} 必须填写`);
               option.enable = false
            }
         });
      },
      closeBundle(){
         if(option.enable) {
            // 读取上级目录下的所有文件
            let files = getFilePaths(option.sourceFilesDir as string)
            let assets = {} as any
            files.forEach((item:File) =>{
               assets[item.name] = item
            })
            let qiniuPlugin = new QiniuPlugin({ ...option, assets })
            qiniuPlugin.uploadFiles()
         } else {
            console.warn(`已禁用 可设置enable: true 开启`);
         }
      }
   }
}
