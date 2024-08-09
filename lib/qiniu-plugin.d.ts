import type { Option } from './vite-plugin-qiniu';
declare class QiniuPlugin {
    options: Option;
    constructor(options: Option);
    uploadFiles(): void;
}
export default QiniuPlugin;
