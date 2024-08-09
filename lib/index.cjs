"use strict";

var path = require("path"), fs = require("fs"), qiniu = require("qiniu"), ora = require("ora");

const tip = (uploaded, failed, total, retrying) => `${retrying ? "重试失败的文件:" : "七牛云上传中:"} 已上传 ${Math.round(uploaded / total * 100)}% ${uploaded}/${total} ， ${failed} 个文件上传失败`;

class QiniuPlugin {
    constructor(options) {
        this.options = options;
    }
    uploadFiles() {
        let assets = this.options.assets, exclude = this.options.exclude, include = this.options.include, batch = this.options.batch || 20, maxRetryTimes = this.options.maxRetryTimes || 3, mac = new qiniu.auth.digest.Mac(this.options.accessKey, this.options.secretKey), qiniuConfig = new qiniu.conf.Config, bucket = this.options.bucket, zone = qiniu.zone[this.options.zone];
        zone && (qiniuConfig.zone = zone);
        let uploadPath = this.options.path, filesNames = Object.keys(assets), totalFiles = 0, uploadedFiles = 0, retryFiles = [], retryFilesCountDown = 0, _finish = err => {
            spinner.succeed();
        };
        filesNames = filesNames.filter((fileName => (!exclude || !exclude.test(fileName)) && (!include || include.test(fileName)))), 
        totalFiles = filesNames.length;
        let spinner = ora({
            text: tip(0, retryFiles.length, totalFiles, !1),
            color: "green"
        }).start();
        const performUpload = function(fileName, retrying) {
            let file = assets[fileName] || {}, key = path.posix.join(uploadPath, fileName), uploadToken = new qiniu.rs.PutPolicy({
                scope: bucket + ":" + key
            }).uploadToken(mac), formUploader = new qiniu.form_up.FormUploader(qiniuConfig), putExtra = new qiniu.form_up.PutExtra;
            return new Promise((resolve => {
                let begin = Date.now();
                formUploader.putFile(uploadToken, key, file.existsAt, putExtra, (function(err, body) {
                    err ? (console.error(`上传文件 ${fileName} 失败: ${err.message || err.name || err.stack}`), 
                    ~retryFiles.indexOf(fileName) || retryFiles.push(fileName)) : uploadedFiles++, spinner.text = tip(uploadedFiles, retryFiles.length, totalFiles, retrying), 
                    body.duration = Date.now() - begin, resolve(body);
                }));
            }));
        }, retryFailedFiles = function(err) {
            if (err) return Promise.reject(err);
            retryFilesCountDown < 0 && (retryFilesCountDown = 0);
            let _files = retryFiles.splice(0, batch <= retryFilesCountDown ? batch : retryFilesCountDown);
            return retryFilesCountDown -= _files.length, _files.length ? Promise.all(_files.map((file => performUpload(file, !0)))).then((() => retryFailedFiles()), retryFailedFiles) : retryFiles.length ? Promise.reject(new Error("文件上传失败")) : Promise.resolve();
        }, execStack = function(err) {
            if (err) return Promise.reject(err);
            let _files = filesNames.splice(0, batch);
            return _files.length ? Promise.all(_files.map((file => performUpload(file, !1)))).then((() => execStack()), execStack) : Promise.resolve();
        };
        execStack().then((() => (retryFilesCountDown = retryFiles.length * maxRetryTimes, 
        retryFailedFiles()))).then((() => _finish()), _finish);
    }
}

/*!
 * vite-plugin-qiniu-cnd
 * (c) 2024 liliuzhu <liliuzhu1992@163.com>
 * Released under the MIT License.
 */ const defaultOptions = {
    enable: !0,
    accessKey: "",
    secretKey: "",
    bucket: "",
    path: "/",
    zone: "",
    exclude: /index\.html$/,
    root: "/"
};

function getFilePaths(dir, sourceFilesDir = dir) {
    return fs.readdirSync(dir).map((item => {
        const filePath = `${dir}/${item}`, stat = fs.lstatSync(filePath);
        return stat.isDirectory() ? getFilePaths(filePath, sourceFilesDir) : stat.isFile() ? {
            name: sourceFilesDir ? filePath.replace(`${sourceFilesDir}/`, "") : item,
            existsAt: filePath
        } : void 0;
    })).flat();
}

module.exports = function(propOption) {
    const option = Object.assign({}, defaultOptions, propOption);
    return {
        name: "vite-plugin-qiniu-cdn",
        enforce: "post",
        apply: "build",
        configResolved(config) {
            const sourceFilesDir = path.resolve(config.root, config.build.outDir);
            option.sourceFilesDir = option.sourceFilesDir || sourceFilesDir;
            [ "accessKey", "secretKey", "bucket", "path" ].forEach((field => {
                option[field] || (console.warn(` 插件 参数${field} 必须填写`), option.enable = !1);
            }));
        },
        closeBundle() {
            if (option.enable) {
                let files = getFilePaths(option.sourceFilesDir), assets = {};
                files.forEach((item => {
                    assets[item.name] = item;
                })), new QiniuPlugin(Object.assign(Object.assign({}, option), {
                    assets: assets
                })).uploadFiles();
            } else console.warn("已禁用 可设置enable: true 开启");
        }
    };
};
